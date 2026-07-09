import { Component, computed, inject, signal } from '@angular/core';
import { FeedbackService } from '../../shared/feedback/feedback.service';
import { FeedbackEntry, FeedbackKind } from '../../shared/feedback/feedback.types';
import { environment } from '../../../environments/environment';
import { buildDemoEntries } from './results.demo';

const ALL = '__all__';

interface Verdict {
  headline: string;
  tone: 'warm' | 'mixed' | 'friction' | 'quiet';
  sub: string;
}

/**
 * Echo — tableau de bord autonome d'analyse des retours testeurs.
 * Identité produit propre (tokens --vb-*), indépendante du design system Qirin.
 * Lit le brut (localStorage en mode local, sinon Supabase via /rest), le
 * présente filtrable et exportable. Aucune interprétation destructrice : le
 * brut reste la source de vérité.
 */
@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  private feedback = inject(FeedbackService);

  readonly usingSupabase = this.feedback.usingSupabase;

  entries = signal<FeedbackEntry[]>([]);
  loading = signal(false);
  loadError = signal<string | null>(null);

  // ── Filtres ─────────────────────────────────────────────────────────────
  routeFilter = signal<string>(ALL);
  kindFilter = signal<string>(ALL);
  sessionFilter = signal<string>(ALL);
  /** Bornes de date, format `yyyy-mm-dd` (input natif) ; '' = pas de borne. */
  dateFrom = signal<string>('');
  dateTo = signal<string>('');

  preview = signal<string | null>(null);
  detail = signal<FeedbackEntry | null>(null);

  openDetail(e: FeedbackEntry) { this.detail.set(e); }
  closeDetail() { this.detail.set(null); }

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(null);
    try {
      if (this.usingSupabase) {
        this.entries.set(await this.fetchSupabase());
      } else {
        this.entries.set(this.feedback.readLocal());
      }
    } catch {
      this.loadError.set(
        "Lecture Supabase bloquée depuis le navigateur (RLS interdit le select anonyme, c'est voulu). " +
        'Exporte le brut depuis Supabase, ou reste en mode local.',
      );
      this.entries.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  private async fetchSupabase(): Promise<FeedbackEntry[]> {
    const res = await fetch(
      `${environment.supabaseUrl}/rest/v1/${environment.feedbackTable}?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: environment.supabaseAnonKey,
          Authorization: `Bearer ${environment.supabaseAnonKey}`,
        },
      },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = (await res.json()) as FeedbackEntry[];
    return rows.map((r) => ({ ...r, source: 'supabase' as const }));
  }

  // ── Options de filtre (dérivées du brut) ─────────────────────────────────
  routeOptions = computed(() => this.optionsFrom((e) => e.route, 'Toutes les pages'));
  sessionOptions = computed(() =>
    this.optionsFrom((e) => e.session_id, 'Toutes les sessions', (v) => v.slice(0, 8)),
  );
  readonly kindOptions = [
    { value: ALL, label: 'Tous les types' },
    { value: 'reaction', label: 'Réaction' },
    { value: 'rating', label: 'Note' },
    { value: 'comment', label: 'Commentaire' },
    { value: 'screen', label: 'Avis écran' },
  ];

  private optionsFrom(
    pick: (e: FeedbackEntry) => string,
    allLabel: string,
    fmt: (v: string) => string = (v) => v,
  ): { value: string; label: string }[] {
    const values = Array.from(new Set(this.entries().map(pick))).sort();
    return [{ value: ALL, label: allLabel }, ...values.map((v) => ({ value: v, label: fmt(v) }))];
  }

  // ── Vue filtrée ───────────────────────────────────────────────────────────
  filtered = computed<FeedbackEntry[]>(() => {
    const r = this.routeFilter(), k = this.kindFilter(), s = this.sessionFilter();
    const fromMs = this.dateFrom() ? new Date(this.dateFrom() + 'T00:00:00').getTime() : null;
    const toMs = this.dateTo() ? new Date(this.dateTo() + 'T23:59:59.999').getTime() : null;
    return this.entries().filter((e) => {
      const t = new Date(e.created_at).getTime();
      return (r === ALL || e.route === r) &&
        (k === ALL || e.kind === k) &&
        (s === ALL || e.session_id === s) &&
        (fromMs === null || t >= fromMs) &&
        (toMs === null || t <= toMs);
    });
  });

  hasDateFilter = computed(() => !!this.dateFrom() || !!this.dateTo());

  activeFilterCount = computed(() => {
    let n = 0;
    if (this.routeFilter() !== ALL) n++;
    if (this.kindFilter() !== ALL) n++;
    if (this.sessionFilter() !== ALL) n++;
    if (this.hasDateFilter()) n++;
    return n;
  });

  resetFilters(): void {
    this.routeFilter.set(ALL);
    this.kindFilter.set(ALL);
    this.sessionFilter.set(ALL);
    this.dateFrom.set('');
    this.dateTo.set('');
  }

  onSelect(sig: 'route' | 'kind' | 'session', ev: Event): void {
    const v = (ev.target as HTMLSelectElement).value;
    if (sig === 'route') this.routeFilter.set(v);
    else if (sig === 'kind') this.kindFilter.set(v);
    else this.sessionFilter.set(v);
  }
  onDate(which: 'from' | 'to', ev: Event): void {
    const v = (ev.target as HTMLInputElement).value;
    (which === 'from' ? this.dateFrom : this.dateTo).set(v);
  }

  sentimentAria = computed(() => {
    const s = this.stats();
    return `${s.likePct}% positif, ${s.dislikePct}% négatif, ${s.confusedPct}% confus`;
  });

  // ── Agrégats ──────────────────────────────────────────────────────────────
  stats = computed(() => {
    const f = this.filtered();
    const likes = f.filter((e) => e.reaction === 'like').length;
    const dislikes = f.filter((e) => e.reaction === 'dislike').length;
    const confused = f.filter((e) => e.reaction === 'confused').length;
    const reacted = likes + dislikes + confused;
    const ratings = f.map((e) => e.rating).filter((r): r is number => r != null);
    const avgRating = ratings.length
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : null;
    const pct = (n: number) => (reacted ? Math.round((n / reacted) * 100) : 0);
    const sessions = new Set(f.map((e) => e.session_id)).size;
    return {
      total: f.length,
      likes, dislikes, confused, reacted,
      comments: f.filter((e) => !!e.comment).length,
      sessions,
      avgRating,
      ratingsCount: ratings.length,
      likePct: pct(likes),
      dislikePct: pct(dislikes),
      confusedPct: pct(confused),
    };
  });

  /** « The Room » — verdict qualitatif dérivé du vrai ratio de réactions. */
  verdict = computed<Verdict>(() => {
    const s = this.stats();
    if (s.total === 0) {
      return { headline: 'La salle est vide', tone: 'quiet', sub: 'Aucun retour pour ces filtres.' };
    }
    if (s.reacted === 0) {
      return { headline: 'Signaux silencieux', tone: 'quiet', sub: `${s.comments} commentaire(s), aucune réaction chiffrée.` };
    }
    const pos = s.likePct, neg = s.dislikePct, conf = s.confusedPct;
    if (pos >= 60 && neg <= 20) {
      return { headline: 'La salle est conquise', tone: 'warm', sub: `${pos}% des réactions sont positives.` };
    }
    if (neg >= 40) {
      return { headline: 'Friction détectée', tone: 'friction', sub: `${neg}% des réactions sont négatives.` };
    }
    if (conf >= 30) {
      return { headline: 'Ça coince quelque part', tone: 'mixed', sub: `${conf}% des testeurs sont perdus.` };
    }
    return { headline: 'Signaux partagés', tone: 'mixed', sub: `${pos}% positif · ${neg}% négatif · ${conf}% confus.` };
  });

  // ── Rendu ─────────────────────────────────────────────────────────────────
  kindLabel(kind: FeedbackKind): string {
    return { reaction: 'Réaction', rating: 'Note', comment: 'Commentaire', screen: 'Avis écran' }[kind];
  }

  reactionLabel(reaction: string | null): string {
    switch (reaction) {
      case 'like': return 'Positif';
      case 'dislike': return 'Négatif';
      case 'confused': return 'Confus';
      default: return '';
    }
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  /** Temps relatif compact (« il y a 3 h »). */
  relTime(iso: string): string {
    const then = new Date(iso).getTime();
    if (isNaN(then)) return '';
    const diff = new Date().getTime() - then;
    const min = Math.round(diff / 60000);
    if (min < 1) return "à l'instant";
    if (min < 60) return `il y a ${min} min`;
    const h = Math.round(min / 60);
    if (h < 24) return `il y a ${h} h`;
    const d = Math.round(h / 24);
    return `il y a ${d} j`;
  }

  targetModeLabel(mode: 'element' | 'zone' | null): string {
    if (mode === 'zone') return 'Zone sélectionnée';
    if (mode === 'element') return 'Élément pointé';
    return 'Écran entier';
  }

  shortSession(id: string): string {
    return id.slice(0, 8);
  }

  // ── Export ──────────────────────────────────────────────────────────────
  exportJson(): void {
    this.download(JSON.stringify(this.filtered(), null, 2), 'application/json', 'echo-feedback.json');
  }

  exportCsv(): void {
    const cols: (keyof FeedbackEntry)[] = [
      'created_at', 'session_id', 'route', 'kind', 'reaction', 'rating',
      'comment', 'target_selector', 'target_text', 'target_label',
    ];
    const escape = (v: unknown) => {
      const s = v == null ? '' : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = cols.join(',');
    const rows = this.filtered().map((e) => cols.map((c) => escape(e[c])).join(','));
    this.download([header, ...rows].join('\n'), 'text/csv', 'echo-feedback.csv');
  }

  private download(content: string, mime: string, filename: string): void {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  clearLocal(): void {
    this.feedback.clearLocal();
    this.load();
  }

  loadDemo(): void {
    this.feedback.seedLocal(buildDemoEntries(new Date().getTime()));
    this.load();
  }
}
