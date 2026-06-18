import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PageHeaderComponent,
  BreadcrumbsComponent,
  CrumbComponent,
  PageTitleComponent,
  TabComponent,
  IconComponent,
  LinkComponent,
  CardComponent,
  PropertiesPanelComponent,
  type PropertySection,
  ActionCardComponent,
  ModalComponent,
  TopboxComponent,
  ConfirmDialogComponent,
  ToasterService,
  ToasterContainerComponent,
  RadioCardComponent,
  SelectComponent,
  type SelectOption,
  TextareaComponent,
  ButtonComponent,
} from '../../shared/ui';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { CompanyEditWizardComponent } from './company-edit-wizard/company-edit-wizard.component';

interface Activity {
  id:    string;
  label: string;
  nace:  string;
}

const ACTIVITIES: Activity[] = [
  { id: 'aerien-reg',    label: 'Transports aériens réguliers', nace: '6210' },
  { id: 'air-transport', label: 'Air Transport',                nace: '5100' },
];

type DetailKey = 'identity' | 'address' | 'identifier' | 'financial' | null;

type CompanyStatus = 'active' | 'closed';


const ORIGINS_FOR_ACTIVE: SelectOption[] = [
  { value: 'normal',      label: 'Normal activity' },
  { value: 'reactivated', label: 'Reactivated' },
  { value: 'corrected',   label: 'Corrected' },
];

const ORIGINS_FOR_CLOSED: SelectOption[] = [
  { value: 'bankrupt',   label: 'Bankruptcy' },
  { value: 'merged',     label: 'Merged / Absorbed' },
  { value: 'dissolved',  label: 'Dissolved' },
  { value: 'DOUBL',      label: 'Duplicate (DOUBL)' },
  { value: 'liquidated', label: 'Liquidated' },
];

@Component({
  selector: 'app-admin-data',
  standalone: true,
  imports: [
    FormsModule,
    TopboxTestShellComponent, TopboxComponent,
    PageHeaderComponent, BreadcrumbsComponent, CrumbComponent,
    PageTitleComponent, TabComponent, IconComponent, LinkComponent,
    CardComponent, PropertiesPanelComponent, ActionCardComponent,
    ModalComponent, ConfirmDialogComponent, ToasterContainerComponent,
    RadioCardComponent, SelectComponent, TextareaComponent,
    ButtonComponent,
    CompanyEditWizardComponent,
  ],
  templateUrl: './admin-data.component.html',
  styleUrl: './admin-data.component.scss',
})
export class AdminDataComponent {
  private readonly toaster = inject(ToasterService);

  activities      = signal<Activity[]>(ACTIVITIES);
  mainActivityId  = signal<string>('aerien-reg');
  pendingActivity = signal<Activity | null>(null);
  openDetail      = signal<DetailKey>(null);

  mainActivity = computed(() => this.activities().find(a => a.id === this.mainActivityId()) ?? null);
  pendingLabel = computed(() => this.pendingActivity()?.label ?? '');

  identitySections: PropertySection[] = [
    { rows: [
      { label: 'Name',           value: 'EASYJET AIRLINE COMPANY LIMITED' },
      { label: 'Business start', value: '2000-01-01' },
      { label: 'Legal creation', value: '1995-03-17' },
    ]},
    { rows: [
      { label: 'Trade sector',  value: 'Transports aériens réguliers' },
      { label: 'Legal form',    value: 'LTD' },
      { label: 'Public buyer',  value: 'N' },
    ]},
    { rows: [
      { label: 'Company status - origin', value: { kind: 'tags', tags: [
        { label: 'Active', tone: 'info' },
        { label: 'Activity continued', tone: 'warning' },
      ]}},
      { label: 'Effective date status', value: '2017-01-01' },
      { label: 'Workforce',             value: '12259-12259' },
    ]},
  ];

  addressSections: PropertySection[] = [
    { rows: [
      { label: 'Address', value: 'HANGAR 89 LONDON LUTON AIRPORT, BEDFORDSHIRE, LU, GB' },
      { label: 'Website', value: { kind: 'link', label: 'https://easyjet.com', href: 'https://easyjet.com' } },
      { label: 'Email',   value: { kind: 'link', label: 'investor.relations@easyjet.com', href: 'mailto:investor.relations@easyjet.com' } },
    ]},
  ];

  identifiersSections: PropertySection[] = [
    { rows: [
      { label: 'CRO',   labelFlag: 'gb', value: '03034606' },
      { label: 'TVAGB', labelFlag: 'gb', value: '656844496' },
    ]},
    { rows: [
      { label: 'HRM', value: '01011680419' },
      { label: 'DUN', value: '778678656' },
    ]},
  ];

  financialSections: PropertySection[] = [
    { rows: [
      { label: 'Currency',      value: 'GBP' },
      { label: 'Share capital', value: '-' },
    ]},
    { rows: [
      { label: 'Turnover',             value: '8 508 000 000' },
      { label: 'Turnover type - Date', value: 'Real turnover - 2023' },
    ]},
  ];

  identityFullSections: PropertySection[] = [
    { rows: [
      { label: 'Name',                  value: 'EASYJET AIRLINE COMPANY LIMITED' },
      { label: 'Business start',        value: '2000-01-01' },
      { label: 'Legal creation',        value: '1995-03-17' },
      { label: 'Trade sector',          value: 'Transports aériens réguliers' },
      { label: 'Company status - Origin', value: { kind: 'tags', tags: [
        { label: 'Active', tone: 'info' }, { label: 'Activity continued', tone: 'warning' },
      ]}},
      { label: 'Effective date status', value: '2017-01-01' },
      { label: 'Buyer language',        value: 'English' },
      { label: 'Third party type',      value: 'Company' },
    ]},
    { rows: [
      { label: 'Legal form',        value: 'LTD' },
      { label: 'Public buyer',      value: 'N' },
      { label: 'Comments',          value: 'N/C' },
      { label: 'Work force',        value: '12259-12259' },
      { label: 'Protection status', value: 'N/C' },
      { label: "Duplicated origin (company ID's)", value: { kind: 'bullets', items: [
        { label: 'Loser : 113075', link: '#' },
        'Winner : N/A',
      ]}},
      { label: 'Alternative names', value: { kind: 'bullets', items: ['EASYJET AIRCRAFT - Alternative name'] } },
    ]},
  ];

  addressFullSections: PropertySection[] = [
    { rows: [
      { label: 'Address type',  value: 'Head office' },
      { label: 'Street number', value: '1350' },
      { label: 'Street',        value: 'CHALK ROAD' },
      { label: 'City',          value: 'Dallas' },
      { label: 'Postcode',      value: '75211' },
      { label: 'Post box',      value: '-' },
    ]},
    { rows: [
      { label: 'Country',          value: 'United States' },
      { label: 'Subdivision code', value: 'TX' },
      { label: 'Phone number',     value: '+1 914-253-2000' },
      { label: 'Website',          value: { kind: 'link', label: 'www.pepsico.com', href: 'https://www.pepsico.com' } },
      { label: 'Email',            value: { kind: 'link', label: 'investor.relations@easyjet.com', href: 'mailto:investor.relations@easyjet.com' } },
    ]},
  ];

  identifierFullSections: PropertySection[] = [
    { rows: [
      { label: 'DUN', labelFlag: 'gb', value: '03034606' },
      { label: 'SOS', labelFlag: 'gb', value: '656844496' },
    ]},
    { rows: [
      { label: 'CapiQ', value: '01011680419' },
      { label: 'HRM',   value: '778678656' },
    ]},
  ];

  financialFullSections: PropertySection[] = [
    { rows: [
      { label: 'Currency',      value: 'GBP' },
      { label: 'Turnover',      value: '8 508 000 000' },
      { label: 'Share capital', value: '-' },
    ]},
    { rows: [
      { label: 'Turnover type - Date', value: 'Real turnover - 2023' },
      { label: 'Currency',             value: 'GBP' },
    ]},
  ];

  // ── Edit wizard ───────────────────────────────────────────────────────────
  showEditWizard = signal(false);

  onEditSaved(): void {
    this.toaster.show('Company data saved successfully', { tone: 'success' });
  }

  // ── Change status & origin modal ──────────────────────────────────────────
  readonly currentStatus: CompanyStatus = 'active';
  statusModalOpen = signal(false);
  newStatus       = signal<CompanyStatus | null>(null);
  newOrigin       = signal<string>('');
  comment         = signal<string>('');

originOptions = computed<SelectOption[]>(() => {
    const s = this.newStatus();
    if (s === 'active') return ORIGINS_FOR_ACTIVE;
    if (s === 'closed') return ORIGINS_FOR_CLOSED;
    return [];
  });

  statusFormValid = computed(() => !!(this.newStatus() && this.newOrigin()));

  openStatusModal(): void {
    this.newStatus.set(null);
    this.newOrigin.set('');
    this.comment.set('');
    this.statusModalOpen.set(true);
  }

  closeStatusModal(): void { this.statusModalOpen.set(false); }

  onNewStatusChange(val: CompanyStatus): void {
    if (val === this.currentStatus || val === this.newStatus()) return;
    this.newStatus.set(val);
    this.newOrigin.set('');
  }

  confirmStatusChange(): void {
    if (!this.statusFormValid()) return;
    const originLabel = this.originOptions().find(o => o.value === this.newOrigin())?.label ?? '';
    this.toaster.show(
      `Status changed to: ${this.newStatus()} · Origin: ${originLabel}`,
      { tone: 'success' },
    );
    this.statusModalOpen.set(false);
  }

  // ───────────────────────────────────────────────────────────────────────────

  pickActivity(a: Activity): void {
    if (a.id === this.mainActivityId()) return;
    this.pendingActivity.set(a);
  }
  confirmActivity(): void {
    const a = this.pendingActivity();
    if (a) {
      this.mainActivityId.set(a.id);
      this.toaster.show(
        `You Trade Sector have been successfully changed to ${a.label}`,
        { tone: 'success' },
      );
    }
    this.pendingActivity.set(null);
  }
  cancelActivity(): void {
    this.pendingActivity.set(null);
  }

  openModal(key: Exclude<DetailKey, null>): void { this.openDetail.set(key); }
  closeModal(): void { this.openDetail.set(null); }
}
