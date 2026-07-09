import { Routes, Route } from '@angular/router';
import { UnlockPage } from './pages/hub/unlock.page';
import { HomeComponent } from './pages/home/home.component';
import { IndexPage } from './user-testing/pages/index.page';
import { WithAccordionPage } from './user-testing/pages/with-accordion.page';
import { WithModalPage } from './user-testing/pages/with-modal.page';
import { SearchComponent } from './pages/search/search.component';
import { FiltersTestPageComponent } from './user-testing/filters/filters-test-page.component';
import { AdminDataComponent } from './pages/admin-data/admin-data.component';
import { BuyerSummaryComponent } from './pages/buyer-summary/buyer-summary.component';
import { TagConfigurationComponent } from './pages/tag-configuration/tag-configuration.component';
import { ReviewShellComponent } from './shared/feedback/review-shell.component';
import { ResultsComponent } from './pages/results/results.component';
import { HubPage } from './pages/hub/hub.page';
import { UserTestingShellComponent } from './user-testing/isolated/user-testing-shell.component';
import { UserTestingHomePage } from './user-testing/isolated/user-testing-home.page';
import { DeadEndPage } from './user-testing/isolated/dead-end.page';
import { lockIsolatedGuard } from './user-testing/isolated/lock.guard';

/**
 * Pages du proto, partagées entre les routes de dev (root) et l'espace
 * testeur `/review/*`. Une seule liste → zéro duplication : toute évolution
 * d'une page se reflète automatiquement dans l'espace testeur.
 */
const PROTO_PAGES: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: 'accordion', component: WithAccordionPage },
  { path: 'modal', component: WithModalPage },
  { path: 'filters', component: FiltersTestPageComponent },
  { path: 'search', component: SearchComponent },
  { path: 'admin-data', component: AdminDataComponent },
  { path: 'buyer-summary/:id', component: BuyerSummaryComponent },
  { path: 'tag-configuration', component: TagConfigurationComponent },
];

export const appRoutes: Routes = [
  // ── Hub d'accueil : aiguille vers les quatre zones ──────────────────────
  { path: '', component: HubPage },
  { path: 'unlock/:key', component: UnlockPage },

  // ── Zone dev : liste des écrans + les écrans (nav libre, inspecteur) ─────
  // Route parente sans composant → les enfants s'affichent dans l'outlet
  // racine ; les liens relatifs de l'index résolvent vers /prototype/*.
  {
    path: 'prototype',
    children: [
      { path: '', component: IndexPage },
      ...PROTO_PAGES,
    ],
  },
  // Écrans aussi à la racine : cible des navigations internes absolues
  // (ex. search → router.navigate(['/buyer-summary', id])).
  ...PROTO_PAGES,

  // ── Récupération du brut (dashboard Echo) ───────────────────────────────
  { path: 'results', component: ResultsComponent },

  // ── Espace testeur : mêmes pages, AVEC le compagnon de feedback ─────────
  {
    path: 'review',
    component: ReviewShellComponent,
    children: [
      { path: '', component: IndexPage },
      ...PROTO_PAGES,
    ],
  },

  // ── Univers isolés (Useberry) : cloisonnés, sans inspecteur ni feedback ──
  // Chaque écran est clos. Pas d'index ici : toute URL inconnue tombe sur le
  // cul-de-sac, jamais sur la liste des scénarios (y compris via précédent).
  {
    path: 'user-testing',
    component: UserTestingShellComponent,
    children: [
      // Chaque écran est verrouillé : le guard annule toute navigation qui
      // changerait de chemin (clic interne → autre page, retour à l'index…).
      ...PROTO_PAGES.map((r) => ({ ...r, canDeactivate: [lockIsolatedGuard] })),
      { path: '', component: UserTestingHomePage },
      { path: '**', component: DeadEndPage },
    ],
  },

  { path: '**', redirectTo: '' },
];
