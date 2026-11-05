import { Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { TopboxComponent } from '../../shared/ui/topbox/topbox.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { PageTitleComponent } from '../../shared/ui/page-title/page-title.component';
import { BreadcrumbsComponent } from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent } from '../../shared/ui/crumb/crumb.component';
import { WidgetCardComponent } from '../../shared/ui/widget-card/widget-card.component';
import { CardComponent } from '../../shared/ui/card/card.component';
import { SkeletonItemComponent } from '../../shared/ui/skeleton-item/skeleton-item.component';
import { PropertiesPanelComponent, type PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import { ModalComponent } from '../../shared/ui/modal/modal.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { LinkComponent } from '../../shared/ui/link/link.component';
import { ButtonIconComponent } from '../../shared/ui/button-icon/button-icon.component';
import { FlyoutMenuComponent } from '../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../shared/ui/flyout-menu/flyout-menu-item.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { BadgeComponent, type BadgeStatus } from '../../shared/ui/badge/badge.component';
import { SelectComponent } from '../../shared/ui/select/select.component';
import { MultiSelectComponent } from '../../shared/ui/multi-select/multi-select.component';
import { TextareaComponent } from '../../shared/ui/textarea/textarea.component';
import { InputTextComponent } from '../../shared/ui/input-text/input-text.component';
import { FunctionalNoticeComponent } from '../../shared/ui/functional-notice/functional-notice.component';
import { SegmentedControlComponent, type SegmentedOption } from '../../shared/ui/segmented-control/segmented-control.component';
import { ToasterService } from '../../shared/ui/toaster/toaster.service';

import {
  ANSWER_OPTIONS, BUYER, CURRENT_USER, INVOICE_OPTIONS, NOTIFICATION_OPTIONS, OTHER_USER_DECISION,
  PEOPLE, RECIPIENT_OPTIONS, REASON_OPTIONS, REQUEST_REF, label, money,
  type Decision, type RequestStatus, type Rights,
} from './manual-underwriting.mock';

type CardId = 'buyer' | 'insured' | 'limit' | 'request' | 'answer' | 'validation';

const STATUS_LABEL: Record<RequestStatus, string> = {
  'draft': 'Draft', 'to-validate': 'To be validated', 'validated': 'Validated',
};
const STATUS_BADGE: Record<RequestStatus, BadgeStatus> = {
  'draft': 'neutral', 'to-validate': 'warning', 'validated': 'success',
};
const MESSAGE_MAX = 600;
const NARRATIVE =
  'The policyholder asks for an increase of the permanent limit to support a new seasonal contract with a ' +
  'retail chain. Deliveries start in January and are invoiced at 60 days. The buyer paid its last twelve ' +
  'invoices within terms, but a payment delay of 18 days was reported by another insurer in September.';

const BLANK: Decision = {
  answer: '', reason: '', permAmount: '', permLimited: '', permDays: '', tempAmount: '', tempDays: '',
  notifications: 'policyholder', invoice: 'any', comment: '', preparedBy: '', date: '',
};

@Component({
  selector: 'app-manual-underwriting',
  standalone: true,
  imports: [
    TopboxTestShellComponent, TopboxComponent, PageHeaderComponent, PageTitleComponent, BreadcrumbsComponent,
    CrumbComponent, WidgetCardComponent, CardComponent, SkeletonItemComponent, PropertiesPanelComponent,
    ModalComponent, ButtonComponent, LinkComponent, IconComponent, BadgeComponent, SelectComponent,
    MultiSelectComponent, TextareaComponent, InputTextComponent, FunctionalNoticeComponent,
    SegmentedControlComponent, ButtonIconComponent, FlyoutMenuComponent, FlyoutMenuItemComponent,
  ],
  templateUrl: './manual-underwriting.page.html',
  styleUrl: './manual-underwriting.page.scss',
})
export class ManualUnderwritingPage implements OnInit, OnDestroy {
  private route   = inject(ActivatedRoute);
  private toaster = inject(ToasterService);
  private timers  = new Set<ReturnType<typeof setTimeout>>();

  readonly buyer = BUYER;
  readonly ref = REQUEST_REF;
  readonly answerOptions = ANSWER_OPTIONS;
  readonly reasonOptions = REASON_OPTIONS;
  readonly notificationOptions = NOTIFICATION_OPTIONS;
  readonly invoiceOptions = INVOICE_OPTIONS;
  readonly recipientOptions = RECIPIENT_OPTIONS;
  readonly messageMax = MESSAGE_MAX;
  readonly skeletons = Array.from({ length: 6 });
  readonly narrative = NARRATIVE;

  buyerId = signal(BUYER.id);
  loading = signal(true);

  // Prototype controls
  rights = signal<Rights>('can');
  status = signal<RequestStatus>('draft');
  readonly rightsOptions: SegmentedOption[] = [
    { value: 'can', label: 'Can complete' }, { value: 'cannot', label: 'Cannot complete' },
  ];
  readonly statusOptions: SegmentedOption[] = [
    { value: 'draft', label: 'Draft' }, { value: 'to-validate', label: 'To be validated' },
    { value: 'validated', label: 'Validated' },
  ];

  decision = signal<Decision | null>(null);
  statusLabel = computed(() => STATUS_LABEL[this.status()]);
  statusBadge = computed(() => STATUS_BADGE[this.status()]);
  canComplete = computed(() => this.rights() === 'can');
  showValidation = computed(() => this.status() !== 'draft' && this.decision() !== null);

  // Modals
  detailsFor = signal<CardId | null>(null);
  completeOpen = signal(false);
  sendOpen = signal(false);
  conditionsOpen = signal(false);
  endorsementOpen = signal(false);
  validateOpen = signal(false);
  protoOpen = signal(false);

  // Card menu (kebab), same behaviour as the Buyer Summary board cards
  openMenu = signal<CardId | null>(null);
  toggleMenu(id: CardId): void { this.openMenu.update(cur => cur === id ? null : id); }
  @HostListener('document:click')
  onDocumentClick(): void { if (this.openMenu() !== null) this.openMenu.set(null); }
  @HostListener('document:keydown.escape')
  onEscape(): void { this.openMenu.set(null); this.protoOpen.set(false); }
  menuDetails(id: CardId): void { this.openMenu.set(null); this.detailsFor.set(id); }
  menuDo(fn: () => void): void { this.openMenu.set(null); fn(); }

  // Complete form
  form = signal<Decision>({ ...BLANK });
  submitted = signal(false);
  errors = computed(() => {
    const f = this.form();
    const e: Record<string, string> = {};
    if (!f.answer) e['answer'] = 'Select an answer.';
    if (!f.reason) e['reason'] = 'Select a reason.';
    if (f.answer === 'agreement' || f.answer === 'restrictive') {
      if (!f.permAmount && !f.tempAmount) e['permAmount'] = 'Enter a permanent limit or a temporary increase.';
    }
    for (const k of ['permAmount', 'permLimited', 'permDays', 'tempAmount', 'tempDays'] as const) {
      if (f[k] && !/^\d+$/.test(f[k].replace(/\s/g, ''))) e[k] = 'Digits only.';
    }
    return e;
  });
  hasErrors = computed(() => Object.keys(this.errors()).length > 0);
  showErr = (k: string): boolean => this.submitted() && !!this.errors()[k];
  err = (k: string): string => (this.submitted() ? this.errors()[k] ?? '' : '');

  setField(k: keyof Decision, v: string): void { this.form.update(f => ({ ...f, [k]: v })); }

  // Conditions
  conditions = signal({ special: '', internal: '', external: '' });

  // Send form
  recipients = signal<string[]>([]);
  message = signal('');
  sendSubmitted = signal(false);
  recipientError = computed(() => this.sendSubmitted() && this.recipients().length === 0);
  messageError = computed(() => this.sendSubmitted() && this.message().trim().length === 0);
  messageTooLong = computed(() => this.message().length > MESSAGE_MAX);
  selectedPeople = computed(() => PEOPLE.filter(p => this.recipients().includes(p.id)));

  // Validation card
  remark = signal('');
  remarkError = signal(false);

  // Sections
  readonly buyerDetails: PropertySection[] = [
    { title: 'Exposure', rows: [
      { label: 'Total exposure', value: money(1548000) },
      { label: 'Exposure on the policy', value: money(420000) },
      { label: 'Exposure on the group', value: money(2310000) },
      { label: 'Overdues', value: money(0) },
    ] },
    { title: 'Latest credit limits', rows: [
      { label: '12 Oct 2026', value: `${money(500000)}, Agreement` },
      { label: '03 Jun 2026', value: `${money(400000)}, Agreement` },
      { label: '19 Feb 2026', value: `${money(250000)}, Restrictive` },
    ] },
    { title: 'Latest incidents', rows: [
      { label: '14 Sep 2026', value: 'Payment delay of 18 days (other insurer)' },
      { label: '02 Mar 2025', value: 'No incident reported' },
    ] },
    { title: 'Latest mass decisions', rows: [
      { label: '28 Jan 2026', value: 'Sector review, no change' },
    ] },
  ];

  readonly noop = (): void => { /* prototype: opens another module */ };
  openConditions = (): void => this.conditionsOpen.set(true);
  openEndorsement = (): void => this.endorsementOpen.set(true);
  openValidateFn = (): void => this.openValidate();

  readonly buyerFace: PropertySection[] = [{ rows: [
    { label: 'Name', value: BUYER.name },
    { label: 'Company ID', value: BUYER.id },
    { label: 'Legal form', value: BUYER.legalForm },
    { label: 'Sector', value: BUYER.sector },
    { label: 'Address', value: BUYER.address },
  ] }];

  readonly insuredFace: PropertySection[] = [{ rows: [
    { label: 'Insured name', value: 'Valdora Distribution Services SL' },
    { label: 'Policy number', value: '2590417133' },
    { label: 'Primary limit', value: money(1000000) },
    { label: 'Top-up limit', value: money(500000) },
  ] }, { rows: [
    { label: 'Policy type', value: 'Global' },
    { label: 'Policy grade', value: 'G3' },
    { label: 'Days', value: '90' },
    { label: 'Thresholds', value: `${money(5000)} / ${money(25000)}` },
    { label: 'Warnings', value: { kind: 'tags', tags: [{ label: 'Loss ratio above 70%', tone: 'warning' }] } },
  ] }];
  readonly insuredDetails: PropertySection[] = [
    { title: 'Policy contacts', rows: [
      { label: 'Risk credit manager', value: 'Marta Lopez' },
      { label: 'Broker', value: 'Ferrand Courtage' },
      { label: 'Language', value: 'Spanish' },
    ] },
    { title: 'Cover', rows: [
      { label: 'Insured percentage', value: '90%' },
      { label: 'Can use policyholder name', value: 'Yes' },
      { label: 'NACE code', value: '46.39 Non-specialised wholesale of food' },
    ] },
    { title: 'Performance', rows: [
      { label: 'Loss ratio', value: '74%' },
      { label: 'Premium', value: money(182000) },
      { label: 'Policy colour', value: 'Orange' },
      { label: 'Renewal date', value: '01 Jan 2027' },
    ] },
  ];

  readonly limitFace: PropertySection[] = [{ rows: [
    { label: 'Request', value: money(500000) },
    { label: 'Answer', value: 'Agreement' },
    { label: 'Temporary', value: money(100000) },
    { label: 'Terms of payment', value: '60 days' },
    { label: 'ADT', value: '90 days' },
    { label: 'UW name', value: 'Camille Durand' },
  ] }];
  readonly limitDetails: PropertySection[] = [
    { title: 'Conditions', rows: [
      { label: 'Specific conditions', value: 'Quarterly turnover reporting' },
      { label: 'Self retention', value: '10%' },
    ] },
    { title: 'Group and history', rows: [
      { label: 'Aggregated exposure on the group', value: money(2310000) },
      { label: 'Previous decision', value: '12 Oct 2026, Agreement' },
      { label: 'Previous decision codes', value: 'A01, R14' },
    ] },
  ];

  readonly requestFace: PropertySection[] = [{ rows: [
    { label: 'Temporary increase', value: money(150000) },
    { label: 'Date of request', value: '03 Nov 2026' },
  ] }, { rows: [
    { label: 'Permanent', value: money(750000) },
    { label: 'Limited to', value: money(600000) },
    { label: 'Credit period', value: '60 days' },
  ] }];
  readonly requestDetails: PropertySection[] = [
    { title: 'Origin', rows: [
      { label: 'Date of input', value: '03 Nov 2026, 14:12' },
      { label: 'Origin', value: 'Policyholder, online portal' },
      { label: 'Complain', value: 'No' },
    ] },
    { title: 'Terms', rows: [
      { label: 'Condition for purchase', value: 'Payment at 60 days' },
      { label: 'Retention of title', value: 'Agreed by the buyer' },
      { label: 'Securities indicator', value: 'None' },
      { label: 'Self retention', value: '10%' },
    ] },
    { title: 'Narrative', rows: [{ label: 'Full text', value: NARRATIVE }] },
  ];

  decisionSections(d: Decision): PropertySection[] {
    return [{ rows: [
      { label: 'Answer', value: label(ANSWER_OPTIONS, d.answer) || '-' },
      { label: 'Reason', value: label(REASON_OPTIONS, d.reason) || '-' },
      { label: 'Permanent', value: money(d.permAmount) },
      { label: 'Limited to', value: money(d.permLimited) },
    ] }, { rows: [
      { label: 'With (days)', value: d.permDays || '-' },
      { label: 'Temporary increase', value: money(d.tempAmount) },
      { label: 'Temporary with (days)', value: d.tempDays || '-' },
    ] }];
  }
  decisionDetails(d: Decision): PropertySection[] {
    return [
      ...this.decisionSections(d),
      { rows: [
        { label: 'Notifications', value: label(NOTIFICATION_OPTIONS, d.notifications) || '-' },
        { label: 'Invoice', value: label(INVOICE_OPTIONS, d.invoice) || '-' },
        { label: 'Prepared by', value: d.preparedBy || '-' },
        { label: 'Date', value: d.date || '-' },
        { label: 'Remarks', value: d.comment || '-' },
      ] },
    ];
  }
  answerFace = computed<PropertySection[]>(() => { const d = this.decision(); return d ? this.decisionSections(d) : []; });
  validationFace = computed<PropertySection[]>(() => {
    const d = this.decision();
    return d ? [{ rows: [
      { label: 'Prepared by', value: d.preparedBy },
      { label: 'Date', value: d.date },
      ...this.decisionSections(d).flatMap(sec => sec.rows),
    ] }] : [];
  });
  detailsModal = computed<{ title: string; sections: PropertySection[] } | null>(() => {
    const d = this.decision();
    switch (this.detailsFor()) {
      case 'buyer':      return { title: 'Buyer details', sections: this.buyerDetails };
      case 'insured':    return { title: 'Insured and policy details', sections: this.insuredDetails };
      case 'limit':      return { title: 'Current limit details', sections: this.limitDetails };
      case 'request':    return { title: 'Request details', sections: this.requestDetails };
      case 'answer':     return d ? { title: 'Answer details', sections: this.decisionDetails(d) } : null;
      case 'validation': return d ? { title: 'Decision to validate', sections: this.decisionDetails(d) } : null;
      default:           return null;
    }
  });
  endorsementText = computed(() => {
    const d = this.decision() ?? this.form();
    const a = label(ANSWER_OPTIONS, d.answer);
    const r = label(REASON_OPTIONS, d.reason);
    if (!a) return 'Complete the answer to preview the endorsement text.';
    return `Credit limit on ${BUYER.name}: ${a}. ` +
      (d.permAmount ? `Permanent limit ${money(d.permAmount)}${d.permLimited ? `, limited to ${money(d.permLimited)}` : ''}${d.permDays ? ` for ${d.permDays} days` : ''}. ` : '') +
      (d.tempAmount ? `Temporary increase ${money(d.tempAmount)}${d.tempDays ? ` for ${d.tempDays} days` : ''}. ` : '') +
      (r ? `Reason: ${r}.` : '');
  });

  ngOnInit(): void {
    this.buyerId.set(this.route.snapshot.paramMap.get('id') ?? BUYER.id);
    this.later(() => this.loading.set(false), 1200);
  }
  ngOnDestroy(): void { this.timers.forEach(clearTimeout); }
  private later(fn: () => void, ms: number): void {
    const id = setTimeout(() => { this.timers.delete(id); fn(); }, ms);
    this.timers.add(id);
  }

  // Prototype switches
  setRights(v: string): void { this.rights.set(v as Rights); }
  setStatus(v: string): void {
    const s = v as RequestStatus;
    this.status.set(s);
    if (s !== 'draft' && !this.decision()) {
      this.decision.set({ ...OTHER_USER_DECISION });
    }
    this.remark.set(''); this.remarkError.set(false);
  }

  // Actions
  openDetails(id: CardId, ev?: Event): void { ev?.preventDefault(); this.detailsFor.set(id); }
  closeDetails(): void { this.detailsFor.set(null); }

  openComplete(): void {
    const d = this.decision();
    this.form.set(d ? { ...d } : { ...BLANK });
    this.submitted.set(false);
    this.completeOpen.set(true);
  }
  closeComplete(): void { this.completeOpen.set(false); }

  private snapshot(): Decision {
    return { ...this.form(), preparedBy: CURRENT_USER, date: '05 Nov 2026' };
  }
  saveDraft(): void {
    this.decision.set(this.snapshot());
    this.status.set('draft');
    this.completeOpen.set(false);
    this.toaster.show('Your draft decision is saved', { tone: 'success', title: 'Draft saved' });
  }
  submit(): void {
    this.submitted.set(true);
    if (this.hasErrors()) return;
    this.decision.set(this.snapshot());
    this.status.set('to-validate');
    this.completeOpen.set(false);
    this.toaster.show(`Request ${REQUEST_REF} is waiting for validation`, { tone: 'success', title: 'Decision submitted' });
  }

  openSend(): void {
    const d = this.decision();
    const amount = d?.permAmount ? money(d.permAmount) : money(750000);
    this.recipients.set([]);
    this.sendSubmitted.set(false);
    this.message.set(
      `Hello,\n\nCould you complete the credit limit request ${REQUEST_REF} on ${BUYER.name} (${this.buyerId()})? ` +
      `The policyholder asks for a permanent limit of ${amount}.\n\nLink: ${this.pageLink()}\n\nThank you.`);
    this.sendOpen.set(true);
  }
  closeSend(): void { this.sendOpen.set(false); }
  pageLink(): string { return typeof window === 'undefined' ? '' : window.location.href; }

  async copyLink(): Promise<void> {
    try { await navigator.clipboard.writeText(this.pageLink()); } catch { /* clipboard may be blocked */ }
    this.toaster.show('The link to this request is in your clipboard', { tone: 'info', title: 'Link copied' });
  }
  send(): void {
    this.sendSubmitted.set(true);
    if (this.recipients().length === 0 || this.messageError() || this.messageTooLong()) return;
    const names = this.selectedPeople().map(p => p.name);
    const text = names.length > 2 ? `${names[0]} and ${names.length - 1} others` : names.join(' and ');
    this.sendOpen.set(false);
    this.completeOpen.set(false);
    if (this.status() === 'draft') this.status.set('to-validate');
    this.toaster.show(`Request sent to ${text}`, { tone: 'success', title: 'Request sent' });
  }

  saveConditions(): void {
    this.conditionsOpen.set(false);
    this.toaster.show('Conditions are attached to the draft decision', { tone: 'success', title: 'Conditions saved' });
  }
  setCondition(k: 'special' | 'internal' | 'external', v: string): void {
    this.conditions.update(c => ({ ...c, [k]: v }));
  }

  openValidate(): void { this.remark.set(''); this.remarkError.set(false); this.validateOpen.set(true); }
  validate(): void {
    this.validateOpen.set(false);
    this.status.set('validated');
    this.toaster.show(`Request ${REQUEST_REF} is validated`, { tone: 'success', title: 'Decision validated' });
  }
  reject(): void {
    if (!this.remark().trim()) { this.remarkError.set(true); return; }
    this.validateOpen.set(false);
    this.status.set('draft');
    this.remark.set(''); this.remarkError.set(false);
    this.toaster.show('The decision goes back to the underwriter as a draft', { tone: 'warning', title: 'Decision rejected' });
  }
}
