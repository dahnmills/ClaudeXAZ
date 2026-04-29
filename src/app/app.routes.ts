import { Routes } from '@angular/router';
import { IndexPage } from './user-testing/pages/index.page';
import { WithAccordionPage } from './user-testing/pages/with-accordion.page';
import { WithModalPage } from './user-testing/pages/with-modal.page';

export const appRoutes: Routes = [
  { path: '', component: IndexPage },
  { path: 'accordion', component: WithAccordionPage },
  { path: 'modal', component: WithModalPage },
  { path: '**', redirectTo: '' },
];
