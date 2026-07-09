import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { FeedbackDraft, FeedbackEntry } from './feedback.types';

const SESSION_KEY = 'qirin.feedback.session';
const QUEUE_KEY = 'qirin.feedback.queue';   // insert non confirmés (offline)
const LOCAL_KEY = 'qirin.feedback.local';   // stockage brut en l'absence de Supabase

/**
 * Capture les retours des testeurs et les persiste — Supabase si configuré,
 * sinon `localStorage`. Offline-safe : un insert Supabase échoué est mis en
 * file et rejoué au prochain démarrage. Le testeur ne voit jamais d'erreur.
 *
 * Aucune interprétation ici : le brut est écrit tel quel.
 */
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private router = inject(Router);

  /** True si un backend Supabase est configuré. */
  readonly usingSupabase = !!(environment.supabaseUrl && environment.supabaseAnonKey);

  constructor() {
    // Rejoue les retours en attente dès que le service est instancié.
    void this.flushQueue();
  }

  /** Session anonyme stable (persiste entre pages et rechargements). */
  sessionId(): string {
    let id = safeGet(SESSION_KEY);
    if (!id) {
      id = uuid();
      safeSet(SESSION_KEY, id);
    }
    return id;
  }

  /**
   * Enrichit le brouillon (route, viewport, UA, session) et le persiste.
   * Ne rejette jamais : en cas d'échec réseau, on met en file localement.
   */
  async submit(draft: FeedbackDraft): Promise<void> {
    const entry = this.enrich(draft);
    if (this.usingSupabase) {
      const ok = await this.postToSupabase(entry);
      if (!ok) this.enqueue(entry);   // rejoué plus tard
    } else {
      this.appendLocal(entry);
    }
  }

  private enrich(draft: FeedbackDraft): FeedbackEntry {
    const t = draft.target ?? null;
    return {
      id: uuid(),
      created_at: new Date().toISOString(),
      session_id: this.sessionId(),
      route: this.router.url,
      kind: draft.kind,
      reaction: draft.reaction ?? null,
      rating: draft.rating ?? null,
      comment: draft.comment?.trim() || null,
      target_mode: t?.mode ?? null,
      target_selector: t?.selector ?? null,
      target_text: t?.text ?? null,
      target_label: t?.label ?? null,
      target_rect: t?.rect ?? null,
      screenshot: draft.screenshot ?? null,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      user_agent: navigator.userAgent,
    };
  }

  // ── Supabase (API REST PostgREST) ──────────────────────────────────────
  private async postToSupabase(entry: FeedbackEntry): Promise<boolean> {
    try {
      const { source, ...row } = entry;
      const res = await fetch(
        `${environment.supabaseUrl}/rest/v1/${environment.feedbackTable}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: environment.supabaseAnonKey,
            Authorization: `Bearer ${environment.supabaseAnonKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify(row),
        },
      );
      return res.ok;
    } catch {
      return false;
    }
  }

  /** Rejoue la file d'attente (best-effort). No-op sans Supabase. */
  async flushQueue(): Promise<void> {
    if (!this.usingSupabase) return;
    const queue = readArray<FeedbackEntry>(QUEUE_KEY);
    if (!queue.length) return;
    const remaining: FeedbackEntry[] = [];
    for (const entry of queue) {
      const ok = await this.postToSupabase(entry);
      if (!ok) remaining.push(entry);
    }
    safeSet(QUEUE_KEY, JSON.stringify(remaining));
  }

  private enqueue(entry: FeedbackEntry): void {
    const queue = readArray<FeedbackEntry>(QUEUE_KEY);
    queue.push(entry);
    safeSet(QUEUE_KEY, JSON.stringify(queue));
  }

  // ── Stockage local (mode sans backend) ─────────────────────────────────
  private appendLocal(entry: FeedbackEntry): void {
    const all = readArray<FeedbackEntry>(LOCAL_KEY);
    all.push(entry);
    safeSet(LOCAL_KEY, JSON.stringify(all));
  }

  /** Lit le brut stocké localement (utilisé par /results en mode local). */
  readLocal(): FeedbackEntry[] {
    return readArray<FeedbackEntry>(LOCAL_KEY).map((e) => ({ ...e, source: 'local' as const }));
  }

  /** Retours en attente de réplication Supabase (diagnostic /results). */
  readQueue(): FeedbackEntry[] {
    return readArray<FeedbackEntry>(QUEUE_KEY);
  }

  /** Vide le stockage local (bouton de purge dans /results). */
  clearLocal(): void {
    safeSet(LOCAL_KEY, JSON.stringify([]));
  }

  /** Remplace le stockage local par un jeu de démonstration (mode local only). */
  seedLocal(entries: FeedbackEntry[]): void {
    safeSet(LOCAL_KEY, JSON.stringify(entries));
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  // Fallback RFC4122 v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* quota / mode privé : on abandonne silencieusement */ }
}
function readArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
