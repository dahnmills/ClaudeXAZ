import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Accès au prototype : un identifiant et un mot de passe factices, une session qui expire.
 *
 * Ce n'est PAS une sécurité réelle : le site est statique, tout le code part dans le
 * navigateur. Le verrou évite seulement qu'un lien partagé ouvre le prototype sans
 * mot de passe. Seule l'empreinte SHA-256 de « identifiant:mot de passe » est dans le code.
 */
const CREDENTIALS_SHA256 = '27680dc733583c737ca90de659958d2422708230b92b9716170b7b4cb49a1684';

/** Durée d'une session, comptée depuis la connexion (pas de prolongation à l'usage). */
export const SESSION_TTL_MS = 4 * 60 * 60 * 1000;

const STORAGE_KEY = 'qirin.proto.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private timer: ReturnType<typeof setTimeout> | null = null;

  /** Fin de session (ms epoch), null si déconnecté. */
  readonly expiresAt = signal<number | null>(this.readExpiry());

  constructor() {
    this.schedule();
    // Connexion ou déconnexion dans un autre onglet : on suit.
    window.addEventListener('storage', (e) => {
      if (e.key !== STORAGE_KEY) return;
      this.expiresAt.set(this.readExpiry());
      this.schedule();
      if (!this.isAuthenticated()) this.redirectToLogin(false);
    });
  }

  isAuthenticated(): boolean {
    const exp = this.expiresAt();
    return exp !== null && exp > Date.now();
  }

  async login(username: string, password: string): Promise<boolean> {
    const hash = await sha256(`${username.trim().toLowerCase()}:${password}`);
    if (hash !== CREDENTIALS_SHA256) return false;
    const exp = Date.now() + SESSION_TTL_MS;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ exp }));
    this.expiresAt.set(exp);
    this.schedule();
    return true;
  }

  logout(expired = false): void {
    localStorage.removeItem(STORAGE_KEY);
    this.expiresAt.set(null);
    this.clearTimer();
    this.redirectToLogin(expired);
  }

  private redirectToLogin(expired: boolean): void {
    const current = this.router.url;
    if (current.startsWith('/login')) return;
    this.router.navigate(['/login'], {
      queryParams: { ...(expired ? { expired: 1 } : {}), returnUrl: current },
    });
  }

  /** Déconnexion automatique à l'échéance, même si l'utilisateur ne navigue pas. */
  private schedule(): void {
    this.clearTimer();
    const exp = this.expiresAt();
    if (exp === null) return;
    const delay = exp - Date.now();
    if (delay <= 0) {
      this.logout(true);
      return;
    }
    // setTimeout plafonne à ~24,8 jours : sans risque avec une session de quelques heures.
    this.timer = setTimeout(() => this.logout(true), delay);
  }

  private clearTimer(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }

  private readExpiry(): number | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const exp = raw ? Number(JSON.parse(raw).exp) : NaN;
      return Number.isFinite(exp) ? exp : null;
    } catch {
      return null;
    }
  }
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}
