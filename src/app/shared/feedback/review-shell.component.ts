import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeedbackCompanionComponent } from './feedback-companion.component';

/**
 * Layout de l'espace testeur `/review/*`.
 * Rejoue les pages existantes (via <router-outlet/>) AVEC le compagnon de
 * feedback actif. C'est le SEUL endroit où le companion est monté → il
 * n'apparaît jamais sur les routes de dev normales.
 */
@Component({
  selector: 'app-review-shell',
  standalone: true,
  imports: [RouterOutlet, FeedbackCompanionComponent],
  template: `<router-outlet /><app-feedback-companion />`,
})
export class ReviewShellComponent {}
