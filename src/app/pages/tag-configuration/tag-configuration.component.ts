import { Component, computed, inject, signal } from '@angular/core';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { PageHeaderComponent }      from '../../shared/ui/page-header/page-header.component';
import { BreadcrumbsComponent }     from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent }           from '../../shared/ui/crumb/crumb.component';
import { PageTitleComponent }       from '../../shared/ui/page-title/page-title.component';
import { SelectComponent }          from '../../shared/ui/select/select.component';
import { LinkComponent }            from '../../shared/ui/link/link.component';
import { ButtonComponent }          from '../../shared/ui/button/button.component';
import { ButtonSplitComponent }     from '../../shared/ui/button-split/button-split.component';
import { ConfirmDialogComponent }   from '../../shared/ui/confirm-dialog/confirm-dialog.component';
import { ToasterContainerComponent } from '../../shared/ui/toaster/toaster-container.component';
import { ToasterService }           from '../../shared/ui/toaster/toaster.service';
import { TagFilterChipComponent }   from './components/tag-filter-chip.component';
import { RuleCardComponent }        from './components/rule-card.component';
import { RuleModalComponent }       from './components/rule-modal.component';
import { TagRule, CountryCode, FILTER_KEYS, FilterKey } from './tag-configuration.models';
import {
  COUNTRIES, rulesForCountry,
  SENSITIVITY_OPTIONS, GRADE_OPTIONS, GRADE_TYPE_OPTIONS, FRESHNESS_OPTIONS,
} from './tag-configuration.data';

@Component({
  selector: 'app-tag-configuration',
  standalone: true,
  imports: [
    TopboxTestShellComponent, PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, PageTitleComponent,
    SelectComponent, LinkComponent, ButtonComponent, ButtonSplitComponent,
    ConfirmDialogComponent, ToasterContainerComponent,
    TagFilterChipComponent, RuleCardComponent, RuleModalComponent,
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

  rules = signal<TagRule[]>(rulesForCountry('FR'));
  expandedAll = signal(false);
  expandedIds = signal<Set<string>>(new Set());

  // toolbar modal stubs — freshness/TRANS-NA-EXCL bodies land in Tasks 8-9
  freshnessOpen = signal(false);
  transExclOpen = signal(false);

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

  // filter chips
  filterOptions: Record<FilterKey, { value: string; label: string }[]> = {
    sensitivity: SENSITIVITY_OPTIONS, newAutoGrade: GRADE_OPTIONS,
    cvgType: GRADE_TYPE_OPTIONS, cvgValue: GRADE_OPTIONS, cvgFreshness: FRESHNESS_OPTIONS,
  };
  filterLabels: Record<FilterKey, string> = {
    sensitivity: 'Sensitivity', newAutoGrade: 'New autograde',
    cvgType: 'CVG - Type', cvgValue: 'CVG - Value', cvgFreshness: 'CVG - Freshness',
  };
  filters = signal<Record<FilterKey, Set<string>>>({
    sensitivity: new Set(), newAutoGrade: new Set(), cvgType: new Set(), cvgValue: new Set(), cvgFreshness: new Set(),
  });
  filterKeys = FILTER_KEYS;

  activeFilterCount = computed(() =>
    FILTER_KEYS.reduce((n, k) => n + (this.filters()[k].size > 0 ? 1 : 0), 0));

  filteredRules = computed(() => {
    const f = this.filters();
    return this.rules().filter(r => FILTER_KEYS.every(k => this.matches(r, k, f[k])));
  });

  hasRules = computed(() => this.rules().length > 0);

  // delete-undo
  confirmOpen = signal(false);
  pendingDelete = signal<TagRule | null>(null);

  onCountryChange(code: string): void {
    this.country.set(code as CountryCode);
    this.rules.set(rulesForCountry(code as CountryCode));
    this.resetFilters();
    this.expandedIds.set(new Set());
    this.expandedAll.set(false);
  }

  setFilter(key: FilterKey, values: Set<string>): void {
    this.filters.update(f => ({ ...f, [key]: values }));
  }
  resetFilters(): void {
    this.filters.set({ sensitivity: new Set(), newAutoGrade: new Set(), cvgType: new Set(), cvgValue: new Set(), cvgFreshness: new Set() });
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

  requestDelete(r: TagRule): void { this.pendingDelete.set(r); this.confirmOpen.set(true); }
  confirmDelete(): void {
    const r = this.pendingDelete();
    if (r) {
      const snapshot = this.rules();
      this.rules.update(list => list.filter(x => x.id !== r.id).map((x, idx) => ({ ...x, position: idx + 1 })));
      this.toaster.show('Rule deleted', { tone: 'success', actionLabel: 'Undo' }, () => this.rules.set(snapshot));
    }
    this.confirmOpen.set(false);
    this.pendingDelete.set(null);
  }
  cancelDelete(): void { this.confirmOpen.set(false); this.pendingDelete.set(null); }
}
