import { Component, OnDestroy, computed, effect, input, model, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { ButtonRangeStatus } from '../button-range/button-range.component';
import { ButtonRangeGroupComponent } from '../button-range/button-range-group.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { DividerComponent } from '../divider/divider.component';
import { DrawerComponent } from '../drawer/drawer.component';
import { IconComponent } from '../icon/icon.component';
import { InlineEditComponent } from '../inline-edit/inline-edit.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { RadioComponent } from '../radio/radio.component';
import { SelectComponent } from '../select/select.component';
import { TabComponent } from '../tab/tab.component';
import { TagComponent } from '../tag/tag.component';

export interface FilterOption {
  value: string;
  label: string;
  color?: string;
  from?: number | null;
  to?: number | null;
}

export type ButtonRangeMode = 'multi' | 'range' | 'single';

export type FilterPrimitiveValue = string | boolean | string[] | number | null | [number | null, number | null];

export type FilterValue =
  | FilterPrimitiveValue
  | Record<string, FilterPrimitiveValue>;

export type FilterType =
  | 'text'
  | 'checkbox'
  | 'select'
  | 'button-range'
  | 'checkbox-list'
  | 'composite-id'
  | 'search-chips'
  | 'tree'
  | 'range-currency'
  | 'group';

export interface TreeNode {
  value: string;
  label: string;
  children?: TreeNode[];
}

export interface FilterDefinition {
  id: string;
  label: string;
  type: FilterType;
  defaultOpen?: boolean;
  helperText?: string;
  placeholder?: string;
  value?: FilterValue;
  options?: FilterOption[];
  tree?: TreeNode[];
  idTypes?: FilterOption[];
  currencyMin?: number;
  currencyMax?: number;
  currencySymbol?: string;
  children?: FilterDefinition[];
  rangeMode?: ButtonRangeMode;
  appendedFilters?: FilterDefinition[];
  columns?: 1 | 2;
  searchable?: boolean;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, FilterValue>;
  createdAt: Date;
  updatedAt?: Date;
}

export type FilterDrawerTab = 'current' | 'saved';

@Component({
  selector: 'ds-filter-drawer',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    BadgeComponent,
    ButtonComponent,
    ButtonRangeGroupComponent,
    CheckboxComponent,
    DividerComponent,
    DrawerComponent,
    IconComponent,
    InlineEditComponent,
    InputTextComponent,
    RadioComponent,
    SelectComponent,
    TabComponent,
    TagComponent,
  ],
  templateUrl: './filter-drawer.component.html',
  styleUrl: './filter-drawer.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class FilterDrawerComponent implements OnDestroy {
  open = input<boolean>(false);
  title = input<string>('Filters');
  filters = input<FilterDefinition[]>([]);
  savedFilters = input<SavedFilter[]>([]);
  persistLocally = input<boolean>(false);
  activeSavedFilterId = input<string | null>(null);

  currentTab = model<FilterDrawerTab>('current');
  currentFilters = model<Record<string, FilterValue>>({});

  filtersChange = output<Record<string, FilterValue>>();
  savedFiltersChange = output<SavedFilter[]>();
  closed = output<void>();
  applied = output<Record<string, FilterValue>>();
  savedFilterApplied = output<SavedFilter>();
  savedFilterCreated = output<SavedFilter>();

  private readonly storageKey = 'ds-filter-drawer-saved';
  private readonly deleteAnimationMs = 480;
  private externalSavedFiltersLoaded = false;
  private localStorageLoaded = false;
  private wasOpen = false;
  private deleteTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  private appliedSnapshot = signal<Record<string, FilterValue>>({});
  private localSavedFilters = signal<SavedFilter[]>([]);
  private openSections = signal<Record<string, boolean>>({});
  private expandedTreeNodes = signal<Record<string, boolean>>({});
  private openIdTypeFlyouts = signal<Record<string, boolean>>({});

  saveFeedback = signal(false);
  savedFiltersChanged = signal(false);
  statusMessage = signal('');
  deletingSavedFilterIds = signal<Set<string>>(new Set());

  savedFiltersList = computed(() => this.localSavedFilters());

  activeFiltersCount = computed(() => this.getFilterKeys(this.currentFilters()).length);
  isDirty = computed(() => !this.filtersEqual(this.currentFilters(), this.appliedSnapshot()));

  hostClasses = computed(() => [
    'ds-filter-drawer',
    this.open() ? 'ds-filter-drawer--open' : '',
  ].filter(Boolean).join(' '));

  constructor() {
    effect(() => {
      const external = this.savedFilters();
      if (external.length > 0 || this.externalSavedFiltersLoaded) {
        this.localSavedFilters.set(this.cloneSavedFilters(external));
        this.externalSavedFiltersLoaded = true;
      } else if (this.persistLocally() && !this.localStorageLoaded) {
        this.localSavedFilters.set(this.loadSavedFilters());
        this.localStorageLoaded = true;
      }

      const isOpen = this.open();
      if (isOpen && !this.wasOpen) {
        this.appliedSnapshot.set(this.normalizeFilters(this.currentFilters()));
        this.statusMessage.set('');
        this.saveFeedback.set(false);
      }
      this.wasOpen = isOpen;
    });
  }

  ngOnDestroy(): void {
    this.deleteTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.deleteTimeouts.clear();
  }

  onClose(): void {
    this.closeOrDiscardDraft();
  }

  onApply(): void {
    const nextFilters = this.normalizeFilters(this.currentFilters());
    this.currentFilters.set(nextFilters);
    this.appliedSnapshot.set(nextFilters);
    this.filtersChange.emit(nextFilters);
    this.applied.emit(nextFilters);
    this.resetTransientState();
    this.closed.emit();
  }

  onReset(): void {
    this.currentFilters.set({});
    this.saveFeedback.set(false);
    this.statusMessage.set('');
  }

  onTabChange(tab: FilterDrawerTab): void {
    this.currentTab.set(tab);

    if (tab === 'saved') {
      this.savedFiltersChanged.set(false);
    }
  }

  onFilterValueChange(fieldId: string, value: FilterValue): void {
    this.currentFilters.update((filters) => {
      const nextFilters = { ...filters };

      if (!this.isActiveValue(value)) {
        delete nextFilters[fieldId];
      } else {
        nextFilters[fieldId] = value;
      }

      return nextFilters;
    });
    this.saveFeedback.set(false);
    this.statusMessage.set('');
  }

  onSaveCurrentFilters(): void {
    if (this.activeFiltersCount() === 0 || this.saveFeedback()) return;

    const now = new Date();
    const normalized = this.normalizeFilters(this.currentFilters());
    const newFilter: SavedFilter = {
      id: `filter-${now.getTime()}`,
      name: `My Filters: ${this.formatSavedFilterTimestamp(now)}`,
      filters: normalized,
      createdAt: now,
      updatedAt: now,
    };

    this.commitSavedFilters([...this.localSavedFilters(), newFilter]);
    this.appliedSnapshot.set(normalized);
    this.filtersChange.emit(normalized);
    this.savedFilterCreated.emit(newFilter);
    this.saveFeedback.set(true);
    this.savedFiltersChanged.set(true);
    this.statusMessage.set('');
  }

  onRenameSavedFilter(filter: SavedFilter, name: string): void {
    const cleanName = name.trim();
    if (!cleanName) return;

    const updatedFilters = this.localSavedFilters().map((item) => {
      if (item.id !== filter.id) return item;
      return { ...item, name: cleanName, updatedAt: new Date() };
    });

    this.commitSavedFilters(updatedFilters);
  }

  onApplySavedFilter(filter: SavedFilter): void {
    if (this.isSavedFilterDeleting(filter.id)) return;
    const next = this.cloneFilterRecord(filter.filters);
    this.currentFilters.set(next);
    this.appliedSnapshot.set(next);
    this.filtersChange.emit(next);
    this.applied.emit(next);
    this.savedFilterApplied.emit(filter);
    this.resetTransientState();
    this.closed.emit();
  }

  isActiveSavedFilter(filterId: string): boolean {
    return this.activeSavedFilterId() === filterId;
  }

  private cloneFilterRecord(filters: Record<string, FilterValue>): Record<string, FilterValue> {
    return Object.entries(filters).reduce<Record<string, FilterValue>>((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc[key] = [...value] as FilterValue;
      } else if (value && typeof value === 'object') {
        acc[key] = { ...(value as Record<string, FilterPrimitiveValue>) };
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  onDeleteSavedFilter(filterId: string): void {
    if (this.deletingSavedFilterIds().has(filterId)) return;

    this.statusMessage.set('');
    this.deletingSavedFilterIds.update((ids) => new Set(ids).add(filterId));

    const timeout = setTimeout(() => {
      const updatedFilters = this.localSavedFilters().filter((filter) => filter.id !== filterId);
      this.commitSavedFilters(updatedFilters);
      this.deletingSavedFilterIds.update((ids) => {
        const nextIds = new Set(ids);
        nextIds.delete(filterId);
        return nextIds;
      });
      this.deleteTimeouts.delete(filterId);
    }, this.deleteAnimationMs);

    this.deleteTimeouts.set(filterId, timeout);
  }

  getFilterValue(fieldId: string): string | boolean | number | '' {
    const value = this.currentFilters()[fieldId];
    if (Array.isArray(value)) return '';
    if (value === null || value === undefined || typeof value === 'object') return '';
    return value;
  }

  getFilterTextValue(fieldId: string): string {
    const value = this.getFilterValue(fieldId);
    return typeof value === 'string' ? value : '';
  }

  getFilterBoolValue(fieldId: string): boolean {
    return this.getFilterValue(fieldId) === true;
  }

  getFilterArrayValue(fieldId: string): string[] {
    const value = this.currentFilters()[fieldId];
    return Array.isArray(value) ? (value as string[]) : [];
  }

  getFilterRecordValue(fieldId: string): Record<string, FilterPrimitiveValue> {
    const value = this.currentFilters()[fieldId];
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, FilterPrimitiveValue> : {};
  }

  getSubValue(fieldId: string, subKey: string): FilterPrimitiveValue | undefined {
    return this.getFilterRecordValue(fieldId)[subKey];
  }

  getSubText(fieldId: string, subKey: string): string {
    const v = this.getSubValue(fieldId, subKey);
    return typeof v === 'string' ? v : '';
  }

  getSubArray(fieldId: string, subKey: string): string[] {
    const v = this.getSubValue(fieldId, subKey);
    return Array.isArray(v) ? (v as string[]) : [];
  }

  setSubValue(fieldId: string, subKey: string, value: FilterPrimitiveValue): void {
    const current = this.getFilterRecordValue(fieldId);
    const next = { ...current, [subKey]: value };
    this.onFilterValueChange(fieldId, next as FilterValue);
  }

  removeChip(fieldId: string, chip: string): void {
    const arr = this.getSubArray(fieldId, 'chips');
    this.setSubValue(fieldId, 'chips', arr.filter((c) => c !== chip));
  }

  getCheckboxListValue(fieldId: string, optionValue: string): boolean {
    return this.getFilterArrayValue(fieldId).includes(optionValue);
  }

  toggleCheckboxList(fieldId: string, optionValue: string, checked: boolean): void {
    const current = this.getFilterArrayValue(fieldId);
    const next = checked ? Array.from(new Set([...current, optionValue])) : current.filter((v) => v !== optionValue);
    this.onFilterValueChange(fieldId, next);
  }

  getRangeFrom(fieldId: string): number | null {
    const v = this.currentFilters()[fieldId];
    if (Array.isArray(v) && v.length === 2) return (v[0] as number | null) ?? null;
    return null;
  }

  getRangeTo(fieldId: string): number | null {
    const v = this.currentFilters()[fieldId];
    if (Array.isArray(v) && v.length === 2) return (v[1] as number | null) ?? null;
    return null;
  }

  setRangeBound(fieldId: string, idx: 0 | 1, raw: string): void {
    const num = raw === '' ? null : Number(raw);
    const safe = Number.isFinite(num as number) ? (num as number) : null;
    const tuple: [number | null, number | null] = [this.getRangeFrom(fieldId), this.getRangeTo(fieldId)];
    tuple[idx] = safe;
    this.onFilterValueChange(fieldId, tuple as FilterValue);
  }

  getFlatTreeLeaves(filter: FilterDefinition): TreeNode[] {
    const out: TreeNode[] = [];
    const walk = (nodes: TreeNode[] = []) => {
      nodes.forEach((n) => {
        if (n.children && n.children.length) walk(n.children);
        else out.push(n);
      });
    };
    walk(filter.tree);
    return out;
  }

  isTreeNodeSelected(fieldId: string, node: TreeNode): boolean {
    if (!node.children?.length) {
      return this.getFilterArrayValue(fieldId).includes(node.value);
    }
    const leaves = this.collectLeafValues(node);
    const current = this.getFilterArrayValue(fieldId);
    return leaves.length > 0 && leaves.some((v) => current.includes(v));
  }

  isTreeNodeIndeterminate(fieldId: string, node: TreeNode): boolean {
    if (!node.children?.length) return false;
    const leaves = this.collectLeafValues(node);
    const current = this.getFilterArrayValue(fieldId);
    const selectedCount = leaves.filter((v) => current.includes(v)).length;
    return selectedCount > 0 && selectedCount < leaves.length;
  }

  toggleTreeNode(fieldId: string, node: TreeNode): void {
    const leaves = node.children?.length ? this.collectLeafValues(node) : [node.value];
    const current = this.getFilterArrayValue(fieldId);
    const anySelected = leaves.some((v) => current.includes(v));
    const next = anySelected
      ? current.filter((v) => !leaves.includes(v))
      : Array.from(new Set([...current, ...leaves]));
    this.onFilterValueChange(fieldId, next);
  }

  private collectLeafValues(node: TreeNode): string[] {
    if (!node.children?.length) return [node.value];
    return node.children.flatMap((c) => this.collectLeafValues(c));
  }

  toggleIdTypeFlyout(filterId: string): void {
    this.openIdTypeFlyouts.update((state) => ({ ...state, [filterId]: !state[filterId] }));
  }

  isIdTypeFlyoutOpen(filterId: string): boolean {
    return this.openIdTypeFlyouts()[filterId] ?? false;
  }

  selectIdType(filter: FilterDefinition, typeValue: string): void {
    this.setSubValue(filter.id, 'type', typeValue);
    this.openIdTypeFlyouts.update((state) => ({ ...state, [filter.id]: false }));
  }

  getIdTypeValue(filter: FilterDefinition): string {
    const stored = this.getSubText(filter.id, 'type');
    if (stored) return stored;
    return filter.idTypes?.[0]?.value ?? '';
  }

  getIdTypeLabel(filter: FilterDefinition): string {
    const typeValue = this.getSubText(filter.id, 'type');
    const fallback = filter.idTypes?.[0];
    if (!fallback) return '';
    const match = filter.idTypes?.find((t) => t.value === typeValue);
    return (match ?? fallback).label;
  }

  addCompositeIdChip(filter: FilterDefinition): void {
    const record = this.getFilterRecordValue(filter.id);
    const typeValue = (record['type'] as string) ?? filter.idTypes?.[0]?.value ?? '';
    const value = ((record['value'] as string) ?? '').trim();
    if (!value) return;
    const chips = (record['chips'] as string[]) ?? [];
    const typeLabel = filter.idTypes?.find((t) => t.value === typeValue)?.label ?? typeValue.toUpperCase();
    const chip = `${typeLabel} : ${value}`;
    if (chips.includes(chip)) return;
    const next = { ...record, type: typeValue, chips: [...chips, chip], value: '' };
    this.onFilterValueChange(filter.id, next as FilterValue);
  }

  onCompositeIdEnter(filter: FilterDefinition, event: Event): void {
    event.preventDefault();
    this.addCompositeIdChip(filter);
  }

  removeCompositeIdChip(filterId: string, chip: string): void {
    this.removeChip(filterId, chip);
  }

  removeSearchChip(filterId: string, chip: string): void {
    const next = this.getFilterArrayValue(filterId).filter((c) => c !== chip);
    this.onFilterValueChange(filterId, next);
  }

  toggleSearchChipsOption(filter: FilterDefinition, optionLabel: string, checked: boolean): void {
    const chips = this.getSubArray(filter.id, 'chips');
    if (checked) {
      if (chips.includes(optionLabel)) return;
      this.setSubValue(filter.id, 'chips', [...chips, optionLabel]);
    } else {
      this.setSubValue(filter.id, 'chips', chips.filter((c) => c !== optionLabel));
    }
  }

  isSearchChipsOptionSelected(filter: FilterDefinition, optionLabel: string): boolean {
    return this.getSubArray(filter.id, 'chips').includes(optionLabel);
  }

  onSearchChipsEnter(filter: FilterDefinition, event: Event): void {
    event.preventDefault();
    const draft = this.getSubText(filter.id, 'draft').trim();
    if (!draft) return;
    const chips = this.getSubArray(filter.id, 'chips');
    if (chips.includes(draft)) return;
    const next = { ...this.getFilterRecordValue(filter.id), chips: [...chips, draft], draft: '' };
    this.onFilterValueChange(filter.id, next as FilterValue);
  }

  removeSearchChipsChip(filterId: string, chip: string): void {
    this.removeChip(filterId, chip);
  }

  formatCurrency(value: number | null, symbol = '€'): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }

  trackTreeNode = (_: number, node: TreeNode) => node.value;

  getFilteredOptions(filter: FilterDefinition): FilterOption[] {
    const options = filter.options ?? [];
    const query = this.getSubText(filter.id, 'draft').trim().toLowerCase();
    if (!query) return options;
    return options.filter((o) => o.label.toLowerCase().includes(query));
  }

  getFilteredTree(filter: FilterDefinition): TreeNode[] {
    const query = this.getSubText(filter.id, 'search').trim().toLowerCase();
    if (!query) return filter.tree ?? [];
    return this.filterTreeNodes(filter.tree ?? [], query);
  }

  private filterTreeNodes(nodes: TreeNode[], query: string): TreeNode[] {
    return nodes.reduce<TreeNode[]>((acc, node) => {
      const labelMatch = node.label.toLowerCase().includes(query);
      const filteredChildren = node.children ? this.filterTreeNodes(node.children, query) : undefined;
      if (labelMatch || (filteredChildren && filteredChildren.length > 0)) {
        acc.push({
          ...node,
          children: filteredChildren && filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }
      return acc;
    }, []);
  }

  isTreeNodeExpanded(filter: FilterDefinition, nodeValue: string): boolean {
    return this.expandedTreeNodes()[`${filter.id}:${nodeValue}`] ?? false;
  }

  toggleTreeNodeExpanded(filter: FilterDefinition, nodeValue: string): void {
    this.expandedTreeNodes.update((expanded) => ({
      ...expanded,
      [`${filter.id}:${nodeValue}`]: !this.isTreeNodeExpanded(filter, nodeValue),
    }));
  }

  getFilterOptions(filter: FilterDefinition): FilterOption[] {
    return filter.options ?? [];
  }

  getFilterKeys(filters: Record<string, FilterValue>): string[] {
    return Object.keys(filters).filter((key) => this.isActiveValue(filters[key]));
  }

  isSelectOptionSelected(filterId: string, optionValue: string): boolean {
    return this.getFilterTextValue(filterId) === optionValue;
  }

  isFilterOpen(filter: FilterDefinition): boolean {
    return this.openSections()[filter.id] ?? filter.defaultOpen ?? false;
  }

  toggleFilterSection(filter: FilterDefinition): void {
    this.openSections.update((sections) => ({
      ...sections,
      [filter.id]: !this.isFilterOpen(filter),
    }));
  }

  getFilterCountLabel(filter: FilterDefinition): string {
    return String(this.getActiveCountForFilter(filter));
  }

  hasActiveFilter(filter: FilterDefinition): boolean {
    return this.getActiveCountForFilter(filter) > 0;
  }

  filtersTabCounter = computed(() =>
    this.activeFiltersCount() > 0 ? this.activeFiltersCount() : null,
  );

  getButtonRangeStatus(filter: FilterDefinition, optionValue: string): ButtonRangeStatus {
    return this.computeRangeStatus(
      this.getFilterArrayValue(filter.id),
      this.getFilterOptions(filter),
      optionValue,
      filter.rangeMode ?? 'range',
    );
  }

  onButtonRangeClicked(filter: FilterDefinition, optionValue: string): void {
    const next = this.nextRangeSelection(
      this.getFilterArrayValue(filter.id),
      this.getFilterOptions(filter),
      optionValue,
      filter.rangeMode ?? 'range',
    );
    this.onFilterValueChange(filter.id, next);
  }

  isSubRangeSelected(filter: FilterDefinition, optionValue: string): boolean {
    return this.getSubArray(filter.id, 'range').includes(optionValue);
  }

  getSubRangeStatus(filter: FilterDefinition, optionValue: string): ButtonRangeStatus {
    return this.computeRangeStatus(
      this.getSubArray(filter.id, 'range'),
      this.getFilterOptions(filter),
      optionValue,
      filter.rangeMode ?? 'range',
    );
  }

  onSubRangeClicked(filter: FilterDefinition, optionValue: string): void {
    const next = this.nextRangeSelection(
      this.getSubArray(filter.id, 'range'),
      this.getFilterOptions(filter),
      optionValue,
      filter.rangeMode ?? 'range',
    );
    const record = this.getFilterRecordValue(filter.id);
    let updated: Record<string, FilterPrimitiveValue> = { ...record, range: next };
    if (next.length > 0) {
      const matched = this.getFilterOptions(filter).find((o) => o.value === next[next.length - 1]);
      if (matched) {
        updated = {
          ...updated,
          from: matched.from ?? null,
          to: matched.to ?? null,
        };
      }
    }
    this.onFilterValueChange(filter.id, updated as FilterValue);
  }

  setRangeCurrencyBound(filter: FilterDefinition, idx: 0 | 1, raw: string): void {
    const num = raw === '' ? null : Number(raw);
    const safe = Number.isFinite(num as number) ? (num as number) : null;
    const record = this.getFilterRecordValue(filter.id);
    const updated = {
      ...record,
      [idx === 0 ? 'from' : 'to']: safe,
      range: [],
    };
    this.onFilterValueChange(filter.id, updated as FilterValue);
  }

  getRangeCurrencyFrom(filterId: string): number | null {
    const v = this.getSubValue(filterId, 'from');
    return typeof v === 'number' ? v : null;
  }

  getRangeCurrencyTo(filterId: string): number | null {
    const v = this.getSubValue(filterId, 'to');
    return typeof v === 'number' ? v : null;
  }

  rangeCurrencySummary(filter: FilterDefinition): string {
    const range = this.getSubArray(filter.id, 'range');
    if (range.length === 0) {
      const from = this.getRangeCurrencyFrom(filter.id);
      const to = this.getRangeCurrencyTo(filter.id);
      if (from !== null || to !== null) {
        const sym = filter.currencySymbol ?? '€';
        return `${sym} ${from ?? '-'} - ${to ?? '-'}`;
      }
      return '';
    }
    const opts = this.getFilterOptions(filter);
    if (range.length === 1) return opts.find((o) => o.value === range[0])?.label ?? range[0];
    return `${opts.find((o) => o.value === range[0])?.label ?? range[0]} - ${opts.find((o) => o.value === range[range.length - 1])?.label ?? range[range.length - 1]}`;
  }

  isRangeCurrencyActive(filter: FilterDefinition): boolean {
    return this.countForOwnValuePublic(filter) > 0;
  }

  countForOwnValuePublic(filter: FilterDefinition): number {
    return this.countForOwnValue(filter);
  }

  private computeRangeStatus(selected: string[], rawOptions: FilterOption[], optionValue: string, mode: ButtonRangeMode): ButtonRangeStatus {
    if (selected.length === 0) return 'default';

    if (mode === 'multi' || mode === 'single') {
      return selected.includes(optionValue) ? 'selected' : 'default';
    }

    const options = rawOptions.map((option) => option.value);
    const index = options.indexOf(optionValue);
    if (index < 0) return 'default';

    const selectedIndexes = selected
      .map((value) => options.indexOf(value))
      .filter((value) => value >= 0)
      .sort((a, b) => a - b);
    if (selectedIndexes.length === 0) return 'default';
    const first = selectedIndexes[0];
    const last = selectedIndexes[selectedIndexes.length - 1];

    if (index === first || index === last) return 'selected';
    if (index > first && index < last) return 'between';
    return 'default';
  }

  private nextRangeSelection(selected: string[], rawOptions: FilterOption[], optionValue: string, mode: ButtonRangeMode): string[] {
    if (mode === 'single') {
      return selected.includes(optionValue) ? [] : [optionValue];
    }

    if (mode === 'multi') {
      return selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue];
    }

    const options = rawOptions.map((option) => option.value);

    if (selected.length !== 1 || selected.includes(optionValue)) {
      return [optionValue];
    }

    const firstIndex = options.indexOf(selected[0]);
    const nextIndex = options.indexOf(optionValue);

    if (firstIndex < 0 || nextIndex < 0) return [optionValue];

    const [start, end] = firstIndex < nextIndex ? [firstIndex, nextIndex] : [nextIndex, firstIndex];
    return [options[start], options[end]];
  }

  isSavedFilterDeleting(filterId: string): boolean {
    return this.deletingSavedFilterIds().has(filterId);
  }

  private formatSavedFilterTimestamp(date: Date): string {
    return new Intl.DateTimeFormat(undefined, {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  private closeOrDiscardDraft(): void {
    if (this.isDirty()) {
      this.currentFilters.set({ ...this.appliedSnapshot() });
    }

    this.resetTransientState();
    this.closed.emit();
  }

  private resetTransientState(): void {
    this.currentTab.set('current');
    this.saveFeedback.set(false);
    this.statusMessage.set('');
  }

  private normalizeFilters(filters: Record<string, FilterValue>): Record<string, FilterValue> {
    return Object.entries(filters).reduce<Record<string, FilterValue>>((acc, [key, value]) => {
      if (this.isActiveValue(value)) acc[key] = value;
      return acc;
    }, {});
  }

  private isActiveValue(value: FilterValue | FilterPrimitiveValue | null | undefined): boolean {
    if (value === null || value === undefined || value === '' || value === false) return false;
    if (Array.isArray(value)) {
      if (value.length === 2 && (typeof value[0] === 'number' || value[0] === null) && (typeof value[1] === 'number' || value[1] === null)) {
        return value[0] !== null || value[1] !== null;
      }
      return value.length > 0;
    }
    if (typeof value === 'object') {
      return Object.values(value).some((v) => this.isActiveValue(v as FilterPrimitiveValue));
    }
    return true;
  }

  private filtersEqual(
    first: Record<string, FilterValue>,
    second: Record<string, FilterValue>,
  ): boolean {
    const normalizedFirst = this.normalizeFilters(first);
    const normalizedSecond = this.normalizeFilters(second);
    const firstKeys = Object.keys(normalizedFirst).sort();
    const secondKeys = Object.keys(normalizedSecond).sort();

    if (firstKeys.length !== secondKeys.length) return false;
    return firstKeys.every((key, index) => key === secondKeys[index] && this.filterValuesEqual(normalizedFirst[key], normalizedSecond[key]));
  }

  private filterValuesEqual(first: FilterValue, second: FilterValue): boolean {
    if (Array.isArray(first) || Array.isArray(second)) {
      if (!Array.isArray(first) || !Array.isArray(second)) return false;
      if (first.length !== second.length) return false;
      return first.every((value, index) => value === second[index]);
    }
    if (typeof first === 'object' && typeof second === 'object' && first !== null && second !== null) {
      const a = first as Record<string, FilterPrimitiveValue>;
      const b = second as Record<string, FilterPrimitiveValue>;
      const ak = Object.keys(a).sort();
      const bk = Object.keys(b).sort();
      if (ak.length !== bk.length) return false;
      return ak.every((k, i) => k === bk[i] && this.filterValuesEqual(a[k] as FilterValue, b[k] as FilterValue));
    }
    return first === second;
  }

  getActiveCountForFilter(filter: FilterDefinition): number {
    if (filter.type === 'group' && filter.children) {
      return filter.children.reduce((sum, child) => sum + this.getActiveCountForFilter(child), 0);
    }
    let count = this.countForOwnValue(filter);
    if (filter.appendedFilters?.length) {
      count += filter.appendedFilters.reduce((sum, sub) => sum + this.getActiveCountForFilter(sub), 0);
    }
    return count;
  }

  countForOwnValue(filter: FilterDefinition): number {
    const value = this.currentFilters()[filter.id];
    if (value === undefined || value === null) return 0;

    if (filter.type === 'range-currency') {
      return this.isActiveValue(value as FilterValue) ? 1 : 0;
    }

    if (filter.type === 'composite-id' || filter.type === 'search-chips') {
      const chips = this.getSubArray(filter.id, 'chips');
      return chips.length;
    }

    if (Array.isArray(value)) {
      if (value.length === 2 && (typeof value[0] === 'number' || value[0] === null) && (typeof value[1] === 'number' || value[1] === null)) {
        return value[0] !== null || value[1] !== null ? 1 : 0;
      }
      return value.length;
    }
    if (typeof value === 'object') {
      return Object.values(value).filter((v) => this.isActiveValue(v as FilterPrimitiveValue)).length;
    }
    return this.isActiveValue(value as FilterPrimitiveValue) ? 1 : 0;
  }

  private commitSavedFilters(filters: SavedFilter[]): void {
    const normalized = this.cloneSavedFilters(filters);
    this.localSavedFilters.set(normalized);
    if (this.persistLocally()) {
      this.persistSavedFilters(normalized);
    }
    this.savedFiltersChange.emit(normalized);
  }

  private cloneSavedFilters(filters: SavedFilter[]): SavedFilter[] {
    return filters.map((filter) => ({
      ...filter,
      filters: { ...filter.filters },
      createdAt: new Date(filter.createdAt),
      updatedAt: filter.updatedAt ? new Date(filter.updatedAt) : undefined,
    }));
  }

  private loadSavedFilters(): SavedFilter[] {
    if (typeof localStorage === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? this.cloneSavedFilters(JSON.parse(stored) as SavedFilter[]) : [];
    } catch {
      return [];
    }
  }

  private persistSavedFilters(filters: SavedFilter[]): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(filters));
    } catch {
      return;
    }
  }
}
