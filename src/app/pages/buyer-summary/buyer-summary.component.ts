import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BreadcrumbsComponent,
  CrumbComponent,
  TopboxComponent,
  PageHeaderComponent,
  PageTitleComponent,
  SkeletonItemComponent,
  SelectComponent,
  CardComponent,
  WidgetCardComponent,
  ChartComponent,
  PropertiesPanelComponent,
  ListWidgetComponent,
  NewsfeedComponent,
  ModalComponent,
} from '../../shared/ui';
import { type BuyerCompany } from './buyer-summary.store';
import { SECTIONS } from '../../user-testing/mocks';
import { type PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import { type ListWidgetItem } from '../../shared/ui/list-widget/list-widget.component';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { ToasterService } from '../../shared/ui/toaster/toaster.service';
import { BuyerSummaryStore } from './buyer-summary.store';

/** Délai simulant la latence du provider externe (2-3 s) avant l'affichage des widgets. */
const PROVIDER_DELAY_MS = 2500;

const MONTHS = ['May 23', 'Jul 23', 'Sep 23', 'Nov 23', 'Jan 24', 'Mar 24', 'May 24', 'Jul 24'];

/** Company par défaut (accès direct à la page sans passer par Search) — seed réaliste. */
const DEFAULT_COMPANY: BuyerCompany = {
  name: 'Immobilière du Marais',
  companyId: '137381425',
  city: 'BHV',
  address: '34 RUE DE LA VERRIÈRE - 75004 - PARIS 4 - FRANCE',
};

@Component({
  selector: 'app-buyer-summary',
  standalone: true,
  imports: [
    TopboxTestShellComponent,
    BreadcrumbsComponent,
    CrumbComponent,
    TopboxComponent,
    PageHeaderComponent,
    PageTitleComponent,
    SkeletonItemComponent,
    SelectComponent,
    CardComponent,
    WidgetCardComponent,
    ChartComponent,
    PropertiesPanelComponent,
    ListWidgetComponent,
    NewsfeedComponent,
    ModalComponent,
  ],
  templateUrl: './buyer-summary.component.html',
  styleUrl: './buyer-summary.component.scss',
})
export class BuyerSummaryComponent implements OnInit {
  private route   = inject(ActivatedRoute);
  private store   = inject(BuyerSummaryStore);
  private toaster = inject(ToasterService);

  company = this.store.current;
  routeId = signal<string>('');

  loading = signal<boolean>(true);

  /** Company affichée : celle du store (venant de Search) sinon le seed par défaut. */
  view = computed<BuyerCompany>(() => {
    const c = this.company();
    if (!c) return DEFAULT_COMPANY;
    return { ...c, companyId: c.companyId || this.routeId() };
  });
  companyName = computed(() => this.view().name);
  companyId   = computed(() => this.view().companyId || this.routeId());

  // ── Modal "Full properties" (action de la topbox) — mêmes sections que la
  //    page de référence "topbox with modal".
  detailsModalOpen = signal<boolean>(false);
  openDetails()  { this.detailsModalOpen.set(true); }
  closeDetails() { this.detailsModalOpen.set(false); }

  readonly detailsSections: PropertySection[] = SECTIONS;

  // ── Dropdown de choix du board (ds-select bordé + flyout) ──────────────
  readonly layoutOptions = [
    { value: 'Common',              label: 'Common' },
    { value: 'Credit Assessment',   label: 'Credit Assessment' },
    { value: 'Credit Underwriting', label: 'Credit Underwriting' },
    { value: 'My layout',           label: 'My layout' },
  ];
  currentLayout = signal<string>('Common');

  readonly skeletonCards = Array.from({ length: 8 });

  // ── Données widgets (mock — branchement provider à venir) ──────────────
  readonly months = MONTHS;
  readonly gradeY  = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'N/A'];
  readonly gradeData    = [6, 6, 6, 7, 6, 5, 5, 6];
  readonly exposureData = [12, 18, 15, 22, 28, 26, 34, 40];

  readonly riskFigures: PropertySection[] = [{
    rows: [
      { label: 'Exposure',        value: '1 548 000' },
      { label: 'Highest limit',   value: '10 000 246 000' },
      { label: 'Number of limits', value: '72' },
    ],
  }];

  readonly companyIndicators: PropertySection[] = [{
    rows: [
      { label: 'Reaction', value: 'N/A' },
      { label: 'MIG',      value: 'N/A' },
      { label: 'PRG',      value: 'Yes' },
    ],
  }];

  readonly financials: PropertySection[] = [{
    rows: [
      { label: 'Turnover',       value: '123 900 000' },
      { label: 'Pre tax Profit', value: '18 000' },
      { label: 'Cashflow',       value: '22 000' },
    ],
  }];

  readonly jobItems: ListWidgetItem[] = [
    { label: 'ManA - Grade Transfer',    date: '11 nov 2024 - 16:42', badge: { label: 'High priority',   status: 'error' } },
    { label: 'Buyer information update', date: '11 nov 2024 - 16:42', badge: { label: 'Medium priority', status: 'warning' } },
    { label: 'CLR',                      date: '11 nov 2024 - 16:42', badge: { label: 'Low priority',    status: 'success' } },
  ];

  readonly notepadItems: ListWidgetItem[] = [
    { label: 'Reminder 1', date: '11 nov 2024 - 16:42', badge: { label: 'info', status: 'info' } },
    { label: 'Reminder 2', date: '11 nov 2024 - 16:42', badge: { label: 'info', status: 'info' } },
    { label: 'Reminder 3', date: '11 nov 2024 - 16:42', badge: { label: 'info', status: 'info' } },
  ];

  ngOnInit(): void {
    this.routeId.set(this.route.snapshot.paramMap.get('id') ?? '');

    if (this.store.consumeJustCreated()) {
      this.toaster.show('Company created', { tone: 'success', title: 'Success' });
    }

    setTimeout(() => this.loading.set(false), PROVIDER_DELAY_MS);
  }
}
