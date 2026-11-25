import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ButtonComponent,
  CardComponent,
  FunctionalNoticeComponent,
  InputTextComponent,
  LogoComponent,
} from '../../shared/ui';
import { AuthService, SESSION_TTL_MS } from '../../shared/auth/auth.service';

/** Connexion au prototype : identifiant + mot de passe factices, session limitée dans le temps. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, CardComponent, FunctionalNoticeComponent, InputTextComponent, LogoComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private query = inject(ActivatedRoute).snapshot.queryParamMap;

  username = signal('');
  password = signal('');
  failed = signal(false);
  busy = signal(false);

  readonly expired = this.query.get('expired') === '1';
  readonly sessionHours = SESSION_TTL_MS / 3_600_000;

  canSubmit = computed(() => !!this.username().trim() && !!this.password() && !this.busy());

  async submit(): Promise<void> {
    if (!this.canSubmit()) return;
    this.busy.set(true);
    const ok = await this.auth.login(this.username(), this.password());
    this.busy.set(false);
    if (!ok) {
      this.failed.set(true);
      this.password.set('');
      return;
    }
    this.router.navigateByUrl(this.safeReturnUrl(), { replaceUrl: true });
  }

  /** Seulement une adresse interne : jamais /login, jamais une URL externe. */
  private safeReturnUrl(): string {
    const url = this.query.get('returnUrl') ?? '/';
    return url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/login') ? url : '/';
  }
}
