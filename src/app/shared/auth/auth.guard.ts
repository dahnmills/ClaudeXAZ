import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Sans session valide, renvoie vers /login en gardant l'adresse demandée. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) return true;
  const expired = auth.expiresAt() !== null; // session présente mais échue
  return inject(Router).createUrlTree(['/login'], {
    queryParams: { ...(expired ? { expired: 1 } : {}), returnUrl: state.url },
  });
};
