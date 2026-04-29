import { Component, signal } from '@angular/core';
import {
  HeaderComponent,
  LogoComponent,
  ButtonIconComponent,
  TabComponent,
  SearchBarComponent,
  IconComponent,
} from '../../shared/ui';
import type { SearchRecentItem } from '../../shared/ui/search-bar/search-bar.component';
import { ActionCardComponent } from '../../shared/ui/action-card/action-card.component';
import { HeroIllustrationComponent } from './hero-illustration.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    LogoComponent,
    ButtonIconComponent,
    TabComponent,
    SearchBarComponent,
    ActionCardComponent,
    HeroIllustrationComponent,
    IconComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  searchValue = signal('');

  readonly actionCards = [
    { title: 'Find a buyer',     description: 'Search and identify a buyer from your portfolio or add a new one.',   linkLabel: 'Get started', icon: 'search'   },
    { title: 'Manage policies',  description: 'Review, update and manage your active insurance policies.',           linkLabel: 'Get started', icon: 'shield'   },
    { title: 'Draft a contract', description: 'Create and send a new contract to a buyer or existing client.',       linkLabel: 'Get started', icon: 'contract' },
    { title: 'Job to do',        description: 'Go to your Job To Do list and start doing what you need.',            linkLabel: 'Get started', icon: 'checklist'},
  ];

  readonly recentSearches: SearchRecentItem[] = [
    { label: 'IMMO DU MARAIS', badgeStatus: 'info',    badgeLabel: 'Buyer' },
    { label: 'AMAZON',         badgeStatus: 'warning',  badgeLabel: 'Buyer' },
    { label: 'EASYJET',        badgeStatus: 'neutral',  badgeLabel: 'Buyer' },
  ];

  onSearch(value: string): void {
    console.log('Search:', value);
  }

  onRecentSelect(item: SearchRecentItem): void {
    console.log('Selected recent:', item.label);
  }
}
