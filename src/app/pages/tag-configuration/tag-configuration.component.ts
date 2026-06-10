import { Component, signal, computed, effect, inject } from '@angular/core';
import { TopboxTestShellComponent }       from '../../user-testing/topbox/topbox-test-shell.component';
import { PageHeaderComponent }            from '../../shared/ui/page-header/page-header.component';
import { BreadcrumbsComponent }           from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent }                 from '../../shared/ui/crumb/crumb.component';
import { PageTitleComponent }             from '../../shared/ui/page-title/page-title.component';
import { TabComponent }                   from '../../shared/ui/tab/tab.component';
import { ButtonComponent }                from '../../shared/ui/button/button.component';
import { IconComponent }                  from '../../shared/ui/icon/icon.component';
import { BadgeComponent }                 from '../../shared/ui/badge/badge.component';
import { CardComponent }                  from '../../shared/ui/card/card.component';
import { TableRowComponent }              from '../../shared/ui/table/table-row.component';
import { CellComponent }                  from '../../shared/ui/table/cell.component';
import { CellHeaderComponent }            from '../../shared/ui/table/cell-header.component';
import { DrawerComponent }                from '../../shared/ui/drawer/drawer.component';
import { ConfirmDialogComponent }         from '../../shared/ui/confirm-dialog/confirm-dialog.component';
import { ToasterContainerComponent }      from '../../shared/ui/toaster/toaster-container.component';
import { ToasterService }                 from '../../shared/ui/toaster/toaster.service';
import { PropertiesPanelComponent, PropertySection } from '../../shared/ui/properties-panel/properties-panel.component';
import { RuleRowComponent }               from './components/rule-row.component';
import { RuleModalComponent }             from './components/rule-modal.component';
import { FreshnessModalComponent }        from './components/freshness-modal.component';
import { StatusExclusionModalComponent }  from './components/status-exclusion-modal.component';
import {
  TagRule, TagRuleCriteria, TagSystemRule, TagHistoryEntry,
  FreshnessConfig, StatusExclusion, TagRuleStatus, DECISION_BADGE,
  STATUS_REASON_REFERENTIAL,
} from './tag-configuration.models';

const EMPTY: TagRuleCriteria = {
  sensitivity: null, exposureMin: null, exposureMax: null, newAutograde: null,
  validValue: null, validType: null, validFreshness: null, validTransferred: null, validVsNew: null,
  lastAgValue: null, lastAgFreshness: null, lastAgVsNew: null,
  nace: null, legalForm: null, role: null,
};

const MOCK_RULES: TagRule[] = [
  {
    id: 'r-1', position: 1, decision: 'valid',
    criteria: { ...EMPTY, sensitivity: ['S2', 'S3'], exposureMin: 500000, newAutograde: ['05', '06', '07', '08', '09', '10'] },
  },
  {
    id: 'r-2', position: 2, decision: 'refuse',
    criteria: { ...EMPTY, sensitivity: ['S1'], exposureMin: 1000000, newAutograde: ['08', '09', '10'], validType: ['MANUAL'], validFreshness: 'fresh', legalForm: ['GmbH', 'AG'] },
  },
  {
    id: 'r-3', position: 3, decision: 'task',
    criteria: { ...EMPTY, newAutograde: ['04'], lastAgFreshness: 'outdated' },
  },
  {
    id: 'r-4', position: 4, decision: 'valid',
    criteria: { ...EMPTY, exposureMax: 100000, nace: ['62.01'] },
  },
  {
    id: 'r-5', position: 5, decision: 'task',
    criteria: { ...EMPTY, role: ['GUARANTOR'] },
  },
];

const MOCK_SYSTEM_RULES: TagSystemRule[] = [
  {
    id: 'TRANS-LAST-PENDING', label: 'Task already open for this company',
    description: 'An autograde is already pending review — the existing task is kept, no duplicate is created.',
    phase: 'pre', decision: 'task',
  },
  {
    id: 'TRANS-NA-EXCL', label: 'Administrative status excludes a valid grade',
    description: 'Autograde N/A + company status code in the country exclusion list (IRP CLOSTHDO reference) → accepted.',
    phase: 'pre', decision: 'valid',
  },
  {
    id: 'TRANS-DEFAULT', label: 'No country rule matched',
    description: 'When no country rule applies, fall back to human review by default.',
    phase: 'post', decision: 'task',
  },
];

const MOCK_HISTORY: TagHistoryEntry[] = [
  { version: 3, status: 'draft',    createdAt: '2026-05-10', createdBy: 'admin@qirin.com', modifiedAt: '2026-06-08', modifiedBy: 'admin@qirin.com' },
  { version: 2, status: 'active',   createdAt: '2026-03-01', createdBy: 'admin@qirin.com', modifiedAt: '2026-04-15', modifiedBy: 'user@qirin.com' },
  { version: 1, status: 'inactive', createdAt: '2026-01-15', createdBy: 'admin@qirin.com', modifiedAt: '2026-02-28', modifiedBy: 'admin@qirin.com' },
];

@Component({
  selector: 'app-tag-configuration',
  standalone: true,
  imports: [
    TopboxTestShellComponent,
    PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, PageTitleComponent, TabComponent,
    ButtonComponent, IconComponent, BadgeComponent,
    CardComponent,
    TableRowComponent, CellComponent, CellHeaderComponent, DrawerComponent,
    ConfirmDialogComponent, ToasterContainerComponent, PropertiesPanelComponent,
    RuleRowComponent, RuleModalComponent, FreshnessModalComponent, StatusExclusionModalComponent,
  ],
  templateUrl: './tag-configuration.component.html',
  styleUrl:    './tag-configuration.component.scss',
})
export class TagConfigurationComponent {
  private readonly toaster = inject(ToasterService);

  // Mono-pays (proto) : pas de sélecteur, juste un libellé read-only.
  readonly countryName = signal<string>('France');

  activeTab = signal<'rules' | 'pipeline' | 'settings' | 'history'>('rules');

  /** Edit mode : règles modifiables, réordonnancement actif, snackbar flottante. */
  editMode = signal(false);
  enterEditMode(): void { this.editMode.set(true); }
  exitEditMode(): void {
    if (this.dirty()) { this.discardPromptOpen.set(true); return; }
    this.editMode.set(false);
  }
  confirmDiscard(): void {
    this.dirty.set(false);
    this.editMode.set(false);
    this.discardPromptOpen.set(false);
  }

  /** Tente de changer d'onglet. Bloqué si edit mode actif sur Rules. */
  trySetTab(tab: 'rules' | 'pipeline' | 'settings' | 'history'): void {
    if (this.editMode() && tab !== 'rules') return; // locked in edit mode
    this.activeTab.set(tab);
  }

  constructor() {
    // Leaving the History tab closes its detail drawer.
    effect(() => {
      if (this.activeTab() !== 'history') this.historyDrawerOpen.set(false);
    });
  }

  readonly draftVersion = 3;

  /** Unsaved changes since last save/validate — drives the draft bar. */
  dirty = signal(false);
  private markDirty(): void { this.dirty.set(true); }
  saveDraft(): void {
    if (!this.dirty()) return;
    // TODO: persist to API. For now, mark the draft as saved.
    this.dirty.set(false);
    this.toaster.show('Draft saved.', { tone: 'success' });
  }

  // Validate : draft → active version (high-stakes, confirmed)
  validatePromptOpen = signal(false);
  discardPromptOpen = signal(false);
  requestValidate(): void { this.validatePromptOpen.set(true); }
  confirmValidate(): void {
    this.validatePromptOpen.set(false);
    this.dirty.set(false);
    this.editMode.set(false);
    // TODO: persist to API + move prior active to history.
    this.toaster.show(`Version v${this.draftVersion} is now live for ${this.countryName()}.`, { tone: 'success' });
  }

  rules       = signal<TagRule[]>(MOCK_RULES);
  systemRules = signal<TagSystemRule[]>(MOCK_SYSTEM_RULES);

  systemPre  = computed(() => this.systemRules().filter(r => r.phase === 'pre'));
  systemPost = computed(() => this.systemRules().filter(r => r.phase === 'post'));

  // Settings tab → properties-panels (read-only résumé)
  freshnessSummary = computed<PropertySection[]>(() => {
    const f = this.freshnessConfig();
    return [{
      rows: [
        { label: 'Last verified autograde', value: { kind: 'tags', tags: [
          { label: `FRESH ≤ ${f.lastVerified.freshMonths}m`, tone: 'success' },
          { label: `OUTDATED ${f.lastVerified.freshMonths + 1}–${f.lastVerified.outdatedMonths}m`, tone: 'warning' },
          { label: `OLD > ${f.lastVerified.outdatedMonths}m`, tone: 'error' },
        ]}},
        { label: 'Manual valid grade', value: { kind: 'tags', tags: [
          { label: `FRESH ≤ ${f.manualGrade.freshMonths}m`, tone: 'success' },
          { label: `OUTDATED ${f.manualGrade.freshMonths + 1}–${f.manualGrade.outdatedMonths}m`, tone: 'warning' },
          { label: `OLD > ${f.manualGrade.outdatedMonths}m`, tone: 'error' },
        ]}},
      ],
    }];
  });

  exclusionSummary = computed<PropertySection[]>(() => [{
    rows: [{
      label: 'Excluded statuses',
      value: this.exclusions().length
        ? { kind: 'tags', tags: this.exclusions().map(e => ({ label: `${e.code} · ${e.label}`, tone: 'neutral' as const })) }
        : 'None configured — rule never triggers',
    }],
  }]);

  // Expanded = the "Any" (unconstrained) criteria breakdown is shown.
  // Default: collapsed — active criteria are always visible in the card head;
  // expanding only reveals the inactive ones, kept compressed to a counter by default.
  expandedIds = signal<Set<string>>(new Set());
  allExpanded = computed(() => this.expandedIds().size === this.rules().length && this.rules().length > 0);

  isExpanded(id: string): boolean { return this.expandedIds().has(id); }
  toggleExpand(id: string): void {
    this.expandedIds.update(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  toggleExpandAll(): void {
    this.expandedIds.update(s =>
      s.size === this.rules().length ? new Set() : new Set(this.rules().map(r => r.id)),
    );
  }

  // Réordonnancement manuel : on saisit le nouveau numéro
  setPosition(id: string, newPos: number): void {
    const current = this.rules().find(r => r.id === id)?.position;
    const clampedTarget = Math.max(1, Math.min(newPos, this.rules().length));
    if (current === clampedTarget) return;
    this.rules.update(list => {
      const idx = list.findIndex(r => r.id === id);
      if (idx === -1) return list;
      const next = [...list];
      const [moved] = next.splice(idx, 1);
      next.splice(clampedTarget - 1, 0, moved);
      return next.map((r, i) => ({ ...r, position: i + 1 }));
    });
    this.markDirty();
  }

  // Rule modal
  ruleModalOpen = signal(false);
  editingRule   = signal<TagRule | null>(null);
  openCreateRule(): void {
    if (!this.editMode()) this.editMode.set(true);
    this.editingRule.set(null);
    this.ruleModalOpen.set(true);
  }
  openEditRule(rule: TagRule): void {
    if (!this.editMode()) this.editMode.set(true);
    this.editingRule.set(rule);
    this.ruleModalOpen.set(true);
  }

  duplicateRule(rule: TagRule): void {
    this.rules.update(list => {
      const idx = list.findIndex(r => r.id === rule.id);
      const copy: TagRule = { ...rule, id: crypto.randomUUID(), criteria: { ...rule.criteria } };
      const next = [...list];
      next.splice(idx + 1, 0, copy);
      return next.map((r, i) => ({ ...r, position: i + 1 }));
    });
    this.markDirty();
    this.toaster.show('Rule duplicated.', { tone: 'success' });
  }

  // Delete : confirm dialog, then soft-delete with undo
  pendingDelete = signal<TagRule | null>(null);
  requestDelete(id: string): void {
    const rule = this.rules().find(r => r.id === id) ?? null;
    this.pendingDelete.set(rule);
  }
  cancelDelete(): void { this.pendingDelete.set(null); }
  confirmDelete(): void {
    const rule = this.pendingDelete();
    if (!rule) return;
    const snapshot = this.rules();
    const position = rule.position;
    this.rules.update(list => list.filter(r => r.id !== rule.id).map((r, i) => ({ ...r, position: i + 1 })));
    this.pendingDelete.set(null);
    this.markDirty();
    this.toaster.show(
      `Rule ${position} deleted.`,
      { tone: 'warning', actionLabel: 'Undo', duration: 8000 },
      () => { this.rules.set(snapshot); },
    );
  }

  onRuleSaved(rule: TagRule): void {
    const isEdit = this.rules().some(r => r.id === rule.id);
    if (isEdit) {
      this.rules.update(list => list.map(r => r.id === rule.id ? { ...rule, position: r.position } : r));
      this.toaster.show('Rule updated.', { tone: 'success' });
    } else {
      this.rules.update(list => [...list, { ...rule, position: list.length + 1 }]);
      this.toaster.show('Rule created.', { tone: 'success' });
    }
    this.markDirty();
    this.ruleModalOpen.set(false);
  }

  // Freshness
  freshnessModalOpen = signal(false);
  freshnessConfig    = signal<FreshnessConfig>({
    lastVerified: { freshMonths: 6,  outdatedMonths: 12 },
    manualGrade:  { freshMonths: 12, outdatedMonths: 24 },
  });
  onFreshnessSaved(config: FreshnessConfig): void {
    this.freshnessConfig.set(config);
    this.freshnessModalOpen.set(false);
    this.markDirty();
    this.toaster.show('Freshness thresholds updated. This re-labels every rule using a freshness criterion.', { tone: 'success' });
  }

  // Exclusion list — picked from the IRP CLOSTHDO referential (free entry forbidden).
  readonly statusReferential = STATUS_REASON_REFERENTIAL;
  exclusionModalOpen = signal(false);
  exclusions         = signal<StatusExclusion[]>([
    { code: 'FAILL', label: 'Business bankruptcy' },
    { code: 'LIQJU', label: 'Liquidation' },
    { code: 'CESEC', label: 'Ceased to trade' },
  ]);
  onExclusionsSaved(items: StatusExclusion[]): void {
    this.exclusions.set(items);
    this.exclusionModalOpen.set(false);
    this.markDirty();
    this.toaster.show(`Exclusion list saved (${items.length} ${items.length === 1 ? 'status' : 'statuses'}).`, { tone: 'success' });
  }

  // History
  history              = signal<TagHistoryEntry[]>(MOCK_HISTORY);
  historyDrawerOpen    = signal(false);
  selectedHistoryEntry = signal<TagHistoryEntry | null>(null);
  openHistoryDetail(entry: TagHistoryEntry): void {
    this.selectedHistoryEntry.set(entry);
    this.historyDrawerOpen.set(true);
  }
  historyDetailSections = computed<PropertySection[]>(() => {
    const e = this.selectedHistoryEntry();
    if (!e) return [];
    return [{
      rows: [
        { label: 'Version',     value: `v${e.version}` },
        { label: 'Status',      value: { kind: 'tags', tags: [{ label: e.status, tone: this.historyStatusBadge(e.status) }] } },
        { label: 'Created',     value: e.createdAt },
        { label: 'Created by',  value: e.createdBy },
        { label: 'Modified',    value: e.modifiedAt },
        { label: 'Modified by', value: e.modifiedBy },
      ],
    }];
  });

  readonly decisionBadge = DECISION_BADGE;

  historyStatusBadge(status: TagRuleStatus): 'neutral' | 'success' | 'info' {
    return status === 'draft' ? 'neutral' : status === 'active' ? 'success' : 'info';
  }
}
