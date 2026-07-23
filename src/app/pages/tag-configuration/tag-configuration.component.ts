import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CdkDropList, CdkDrag, CdkDragHandle, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { PageHeaderComponent }      from '../../shared/ui/page-header/page-header.component';
import { BreadcrumbsComponent }     from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent }           from '../../shared/ui/crumb/crumb.component';
import { PageTitleComponent }       from '../../shared/ui/page-title/page-title.component';
import { SelectComponent }          from '../../shared/ui/select/select.component';
import { ButtonComponent }          from '../../shared/ui/button/button.component';
import { LinkComponent }            from '../../shared/ui/link/link.component';
import { FlyoutMenuComponent }      from '../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent }  from '../../shared/ui/flyout-menu/flyout-menu-item.component';
import { SnackbarComponent }        from '../../shared/ui/snackbar/snackbar.component';
import { ConfirmDialogComponent }   from '../../shared/ui/confirm-dialog/confirm-dialog.component';
import { ToasterContainerComponent } from '../../shared/ui/toaster/toaster-container.component';
import { ToasterService }           from '../../shared/ui/toaster/toaster.service';
import { FilterDrawerComponent, FilterDefinition, FilterValue } from '../../shared/ui/filter-drawer/filter-drawer.component';
import { TabComponent } from '../../shared/ui/tab/tab.component';
import { RuleCardComponent }        from './components/rule-card.component';
import { RuleModalComponent }       from './components/rule-modal.component';
import { FreshnessModalComponent }  from './components/freshness-modal.component';
import { TransExclModalComponent }  from './components/trans-excl-modal.component';
import { TagRule, CountryCode, FreshnessConfig, StatusReasonCode, FILTER_KEYS, FilterKey, RuleSetVersion, RuleSetHistoryEntry } from './tag-configuration.models';
import {
  COUNTRIES, rulesForCountry, freshnessForCountry, codesForCountry, versionsForCountry, historyForCountry,
  SENSITIVITY_OPTIONS, GRADE_OPTIONS, GRADE_TYPE_OPTIONS, FRESHNESS_OPTIONS,
} from './tag-configuration.data';
import { CompareVersionsModalComponent } from './components/compare-versions-modal.component';
import { HistoryRowComponent } from './components/history-row.component';
import { FunctionalNoticeComponent } from '../../shared/ui/functional-notice/functional-notice.component';
import { ImportRulesModalComponent } from './components/import-rules-modal.component';
import { ButtonSplitComponent } from '../../shared/ui/button-split/button-split.component';
import { StandaloneDropdownComponent } from '../../shared/ui/standalone-dropdown/standalone-dropdown.component';
import { NewSetChoiceModalComponent, NewSetAction } from './components/new-set-choice-modal.component';

@Component({
  selector: 'app-tag-configuration',
  standalone: true,
  imports: [
    TopboxTestShellComponent, PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, PageTitleComponent,
    SelectComponent, ButtonComponent, LinkComponent, FlyoutMenuComponent, FlyoutMenuItemComponent, SnackbarComponent,
    ConfirmDialogComponent, ToasterContainerComponent,
    RuleCardComponent, RuleModalComponent, FreshnessModalComponent,
    TransExclModalComponent, FilterDrawerComponent, CdkDropList, CdkDrag, CdkDragHandle, IconComponent,
    CompareVersionsModalComponent, TabComponent, HistoryRowComponent,
    FunctionalNoticeComponent, ImportRulesModalComponent, ButtonSplitComponent, StandaloneDropdownComponent, NewSetChoiceModalComponent,
  ],
  templateUrl: './tag-configuration.component.html',
  styleUrl: './tag-configuration.component.scss',
})
export class TagConfigurationComponent {
  private toaster = inject(ToasterService);

  countries = COUNTRIES;
  countryOptions = COUNTRIES.map(c => ({ value: c.code, label: c.name }));
  country = signal<CountryCode>('FR');
  currentCountry = computed(() => COUNTRIES.find(c => c.code === this.country())!);
  isReadOnly = computed(() => !!this.currentCountry().readOnly);

  activeTab = signal<'configuration' | 'history'>('configuration');

  // `rules` is always the currently-displayed set: the published/active set
  // in view mode, a draft copy of it while editing. Entering edit snapshots
  // the active set into the draft; leaving WITHOUT validating restores it —
  // only "Validate rules" (via Compare) promotes the draft to active.
  activeRules = signal<TagRule[]>(rulesForCountry('FR'));
  rules = signal<TagRule[]>(this.activeRules().map(r => ({ ...r, criteria: { ...r.criteria } })));
  expandedAll = signal(false);
  expandedIds = signal<Set<string>>(new Set());

  // view (read-only, default) vs edit (drag reorder, 3-dot menu, create/delete)
  mode = signal<'view' | 'edit'>('view');
  enterEdit(): void {
    this.rules.set(this.activeRules().map(r => ({ ...r, criteria: { ...r.criteria } })));
    this.mode.set('edit');
  }
  exitEdit(): void {
    this.rules.set(this.activeRules().map(r => ({ ...r, criteria: { ...r.criteria } })));
    this.mode.set('view');
    if (this.historyDetail()?.id === 'draft') this.historyDetail.set(null);
  }

  /** Drag indices refer to the rendered (filtered) list — disabled whenever a filter is active so dragged/full-list indices can't drift apart. */
  canReorder = computed(() => this.activeFilterCount() === 0);

  onRuleDrop(event: CdkDragDrop<TagRule[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const list = [...this.filteredRules()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    list.forEach((r, idx) => (r.position = idx + 1));
    this.rules.set([...list]);
    this.toaster.show('Rule order updated', { tone: 'success' });
  }

  // Edit-mode toolbar "Settings" flyout (Edit freshness / Edit TRANS-NA-EXCL)
  settingsMenuOpen = signal(false);
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent): void {
    if (!this.settingsMenuOpen()) return;
    const path = ev.composedPath() as Element[];
    if (!path.some(el => el.classList?.contains('tag-config__settings-menu'))) this.settingsMenuOpen.set(false);
  }

  // toolbar modals
  freshness = signal(freshnessForCountry('FR'));
  freshnessOpen = signal(false);
  onFreshnessSave(cfg: FreshnessConfig): void {
    this.freshness.set(cfg);
    this.freshnessOpen.set(false);
    this.toaster.show('Freshness thresholds saved (draft)', { tone: 'success' });
  }

  // TRANS-NA-EXCL modal (P3)
  exclusionCodes = signal(codesForCountry('FR'));
  transExclOpen = signal(false);
  onCodesSave(codes: StatusReasonCode[]): void {
    this.exclusionCodes.set(codes);
    this.transExclOpen.set(false);
    this.toaster.show('Exclusion list saved (draft)', { tone: 'success' });
  }

  ruleModalOpen = signal(false);
  editingRule = signal<TagRule | null>(null);
  openCreate(): void { this.editingRule.set(null); this.ruleModalOpen.set(true); }
  openEdit(r: TagRule): void { this.editingRule.set(r); this.ruleModalOpen.set(true); }
  onRuleSave(saved: TagRule): void {
    const wasEdit = this.editingRule() != null;
    this.rules.update(list => {
      const i = list.findIndex(x => x.id === saved.id);
      if (i >= 0) { const copy = [...list]; copy[i] = saved; return copy; }
      return [...list, { ...saved, position: list.length + 1 }];
    });
    this.ruleModalOpen.set(false);
    this.toaster.show(wasEdit ? 'Rule updated' : 'Rule created', { tone: 'success' });
  }

  // filter drawer
  drawerOpen = signal(false);
  currentFilters = signal<Record<string, FilterValue>>({});
  appliedFilters = signal<Record<string, FilterValue>>({});

  filters: FilterDefinition[] = [
    { id: 'sensitivity',  label: 'Sensitivity',           type: 'checkbox-list', defaultOpen: true, options: SENSITIVITY_OPTIONS },
    { id: 'newAutoGrade', label: 'New autograde',         type: 'checkbox-list', defaultOpen: true, options: GRADE_OPTIONS },
    { id: 'cvgValue',     label: 'CVG - Value',           type: 'checkbox-list', defaultOpen: true, options: GRADE_OPTIONS },
    { id: 'cvgType',      label: 'CVG - Type',            type: 'checkbox-list', defaultOpen: true, options: GRADE_TYPE_OPTIONS },
    { id: 'cvgFreshness', label: 'CVG - Freshness',       type: 'checkbox-list', defaultOpen: true, options: FRESHNESS_OPTIONS },
  ];

  activeFilterCount = computed(() => {
    const f = this.appliedFilters();
    return FILTER_KEYS.reduce((n, k) => n + (this.isActiveValue(f[k]) ? 1 : 0), 0);
  });

  openDrawer(): void {
    this.currentFilters.set({ ...this.appliedFilters() });
    this.drawerOpen.set(true);
  }
  closeDrawer(): void { this.drawerOpen.set(false); }
  onFiltersApplied(f: Record<string, FilterValue>): void {
    this.appliedFilters.set(f);
    this.currentFilters.set(f);
    this.drawerOpen.set(false);
  }

  private isActiveValue(v: FilterValue | undefined): boolean {
    return Array.isArray(v) ? v.length > 0 : v != null && v !== '';
  }

  filteredRules = computed(() => {
    const f = this.appliedFilters();
    return this.rules().filter(r => FILTER_KEYS.every(k => this.matches(r, k, this.toSet(f[k]))));
  });

  private toSet(v: FilterValue | undefined): Set<string> {
    return new Set(Array.isArray(v) ? v.map(String) : []);
  }

  hasRules = computed(() => this.rules().length > 0);

  // delete-undo
  confirmOpen = signal(false);
  pendingDelete = signal<TagRule | null>(null);

  onCountryChange(code: string): void {
    this.country.set(code as CountryCode);
    this.activeRules.set(rulesForCountry(code as CountryCode));
    this.rules.set(rulesForCountry(code as CountryCode));
    this.freshness.set(freshnessForCountry(code as CountryCode));
    this.exclusionCodes.set(codesForCountry(code as CountryCode));
    this.pastVersions.set(versionsForCountry(code as CountryCode));
    this.history.set(historyForCountry(code as CountryCode));
    this.historyDetail.set(null);
    this.appliedFilters.set({});
    this.currentFilters.set({});
    this.expandedIds.set(new Set());
    this.expandedAll.set(false);
    this.mode.set('view');
  }

  clearFilters(): void {
    this.appliedFilters.set({});
    this.currentFilters.set({});
  }

  private matches(r: TagRule, key: FilterKey, sel: Set<string>): boolean {
    if (sel.size === 0) return true;               // filter off
    const c = r.criteria;
    // "Any" selected → match rules where the criterion is explicitly Any (null/empty)
    const anySelected = sel.has('Any');
    const val = (() => {
      switch (key) {
        case 'sensitivity':  return c.sensitivity;
        case 'newAutoGrade': return c.newAutoGrade;
        case 'cvgType':      return c.cvgType;
        case 'cvgValue':     return c.cvgValue;
        case 'cvgFreshness': return c.cvgFreshness == null ? null : [c.cvgFreshness];
      }
    })();
    const isAny = val == null || (Array.isArray(val) && val.length === 0);
    if (isAny) return anySelected;
    // OR within the chip: rule matches if any of its values is selected
    return (val as string[]).some(v => sel.has(v));
  }

  toggleExpandAll(): void {
    const next = !this.expandedAll();
    this.expandedAll.set(next);
    this.expandedIds.set(next ? new Set(this.rules().map(r => r.id)) : new Set());
  }
  isExpanded(r: TagRule): boolean { return this.expandedIds().has(r.id); }
  toggleCard(r: TagRule): void {
    this.expandedIds.update(s => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; });
  }

  moveUp(r: TagRule): void { this.move(r, -1); }
  moveDown(r: TagRule): void { this.move(r, +1); }
  private move(r: TagRule, delta: number): void {
    const list = [...this.rules()].sort((a, b) => a.position - b.position);
    const i = list.findIndex(x => x.id === r.id);
    const j = i + delta;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    list.forEach((x, idx) => (x.position = idx + 1));
    this.rules.set([...list]);
    this.toaster.show('Rule order updated', { tone: 'success' });
  }

  // Compare rule versions
  compareOpen = signal(false);
  pastVersions = signal<RuleSetVersion[]>(versionsForCountry('FR'));
  currentDraftVersion = computed<RuleSetVersion>(() => {
    const rules = this.rules();
    const total = rules.length || 1;
    const count = (pred: (r: TagRule) => boolean) => rules.filter(pred).length;
    const stat = (n: number) => ({ pct: (n / total) * 100, count: n });
    return {
      id: '__draft__', label: 'Current draft', date: '',
      rules,
      accepted: stat(count(r => r.decision === 'Accept')),
      refused:  stat(count(r => r.decision === 'Refuse')),
      jtd:      stat(count(r => r.decision === 'CreateTask')),
    };
  });
  onValidateVersion(): void {
    const validated = this.rules().map(r => ({ ...r, criteria: { ...r.criteria } }));
    this.activeRules.set(validated);
    this.history.update(list => [{
      id: Math.floor(100000000 + Math.random() * 900000000).toString(),
      createdLabel: 'Just now', lastUpdateLabel: 'Just now', lastUpdateBy: 'John Doe',
      activePeriodLabel: '—', status: 'Active',
      rules: validated.map(r => ({ ...r, criteria: { ...r.criteria } })),
    }, ...list.map(h => h.status === 'Active' ? { ...h, status: 'Archived' as const } : h)]);
    this.compareOpen.set(false);
    this.mode.set('view');
    if (this.historyDetail()?.id === 'draft') this.historyDetail.set(null);
    this.toaster.show('New rule version validated', { tone: 'success' });
  }

  // History tab — includes a synthetic "Draft" row for the live in-progress
  // edit (if any), on top of past publications. It reflects `rules()` as it
  // changes, and disappears the moment edit mode is left (validated or not).
  history = signal<RuleSetHistoryEntry[]>(historyForCountry('FR'));
  draftHistoryEntry = computed<RuleSetHistoryEntry | null>(() => {
    if (this.mode() !== 'edit') return null;
    return {
      id: 'draft', createdLabel: 'In progress', lastUpdateLabel: 'In progress', lastUpdateBy: 'John Doe',
      activePeriodLabel: '—', status: 'Draft',
      rules: this.rules(),
    };
  });
  historyRows = computed<RuleSetHistoryEntry[]>(() => {
    const draft = this.draftHistoryEntry();
    return draft ? [draft, ...this.history()] : this.history();
  });
  historyDetail = signal<RuleSetHistoryEntry | null>(null);
  historyDetailExpandedIds = signal<Set<string>>(new Set());
  openHistoryDetail(entry: RuleSetHistoryEntry): void {
    this.historyDetail.set(entry);
    this.historyDetailExpandedIds.set(new Set());
  }
  closeHistoryDetail(): void { this.historyDetail.set(null); }
  toggleHistoryDetailCard(r: TagRule): void {
    this.historyDetailExpandedIds.update(s => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; });
  }
  isHistoryDetailExpanded(r: TagRule): boolean { return this.historyDetailExpandedIds().has(r.id); }

  // Create new set — Start from scratch vs Import rules. This only opens a
  // new draft in edit mode (same as any other edit); the current rules stay
  // the published/active set until "Validate rules" (via Compare) confirms
  // the draft, so no destructive confirmation is needed up front.
  newSetChoiceOpen = signal(false);
  onNewSetChosen(action: NewSetAction): void {
    this.newSetChoiceOpen.set(false);
    if (action === 'scratch') {
      this.enterEdit();
      this.rules.set([]);
    } else if (action === 'import') {
      this.importOpen.set(true);
    }
  }
  onNewSetFromPrevious(entry: RuleSetHistoryEntry): void {
    this.newSetChoiceOpen.set(false);
    this.enterEdit();
    this.rules.set(entry.rules.map(r => ({ ...r, criteria: { ...r.criteria } })));
    this.toaster.show('Rules loaded from previous set (draft)', { tone: 'success' });
  }

  // Import rules
  importOpen = signal(false);
  onRulesImported(imported: TagRule[]): void {
    if (this.mode() === 'view') this.enterEdit();
    this.rules.set(imported);
    this.importOpen.set(false);
    this.toaster.show('Rules imported (draft)', { tone: 'success' });
  }

  // Test rules — asynchronous simulation (mock: fixed delay, no real backend)
  testState = signal<'idle' | 'running' | 'done'>('idle');
  ruleVolumes = signal<Record<string, number> | null>(null);

  startTest(): void {
    this.testState.set('running');
    setTimeout(() => {
      const rules = this.rules();
      const volumes: Record<string, number> = {};
      for (const r of rules) volumes[r.id] = Math.round(Math.random() * 5000) / 100;
      this.ruleVolumes.set(volumes);
      this.testState.set('done');
    }, 2500);
  }
  stopTest(): void { this.testState.set('idle'); this.ruleVolumes.set(null); }
  dismissTestDone(): void { this.testState.set('idle'); this.ruleVolumes.set(null); }

  requestDelete(r: TagRule): void { this.pendingDelete.set(r); this.confirmOpen.set(true); }
  confirmDelete(): void {
    const r = this.pendingDelete();
    if (r) {
      this.rules.update(list => list.filter(x => x.id !== r.id).map((x, idx) => ({ ...x, position: idx + 1 })));
      this.toaster.show('Rule deleted', { tone: 'success' });
    }
    this.confirmOpen.set(false);
    this.pendingDelete.set(null);
  }
  cancelDelete(): void { this.confirmOpen.set(false); this.pendingDelete.set(null); }
}
