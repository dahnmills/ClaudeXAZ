import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { IndexPage } from './user-testing/pages/index.page';
import { WithAccordionPage } from './user-testing/pages/with-accordion.page';
import { WithModalPage } from './user-testing/pages/with-modal.page';
import { SearchComponent } from './pages/search/search.component';

export const appRoutes: Routes = [
  { path: '', component: IndexPage },
  { path: 'home', component: HomeComponent },
  { path: 'accordion', component: WithAccordionPage },
  { path: 'modal', component: WithModalPage },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: '' },
];
