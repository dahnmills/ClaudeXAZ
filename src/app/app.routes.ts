import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { IndexPage } from './user-testing/pages/index.page';
import { WithAccordionPage } from './user-testing/pages/with-accordion.page';
import { WithModalPage } from './user-testing/pages/with-modal.page';
import { SearchComponent } from './pages/search/search.component';
import { FiltersTestPageComponent } from './user-testing/filters/filters-test-page.component';
import { AdminDataComponent } from './pages/admin-data/admin-data.component';
import { BuyerSummaryComponent } from './pages/buyer-summary/buyer-summary.component';
import { TagConfigurationComponent } from './pages/tag-configuration/tag-configuration.component';

export const appRoutes: Routes = [
  { path: '', component: IndexPage },
  { path: 'home', component: HomeComponent },
  { path: 'accordion', component: WithAccordionPage },
  { path: 'modal', component: WithModalPage },
  { path: 'filters', component: FiltersTestPageComponent },
  { path: 'search', component: SearchComponent },
  { path: 'admin-data', component: AdminDataComponent },
  { path: 'buyer-summary/:id', component: BuyerSummaryComponent },
  { path: 'tag-configuration', component: TagConfigurationComponent },
  { path: '**', redirectTo: '' },
];
