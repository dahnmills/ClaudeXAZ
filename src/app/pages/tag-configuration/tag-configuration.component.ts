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
import { TooltipDirective }         from '../../shared/ui/tooltip/tooltip.directive';
import { FilterDrawerComponent, FilterDefinition, FilterValue } from '../../shared/ui/filter-drawer/filter-drawer.component';
import { TabComponent } from '../../shared/ui/tab/tab.component';
import { RuleCardComponent }        from './components/rule-card.component';
import { RuleModalComponent }       from './components/rule-modal.component';
import { FreshnessModalComponent }  from './components/freshness-modal.component';
import { TransExclModalComponent }  from './components/trans-excl-modal.component';
import {
  TagRule, Country, CountryCode, FreshnessConfig, StatusReasonCode, FILTER_KEYS, FilterKey,
  RuleSetHistoryEntry, RuleSetDraft,
} from './tag-configuration.models';
import {
  COUNTRIES, countryByCode, rulesForCountry, freshnessForCountry, codesForCountry, historyForCountry,
  legalFormsForCountry, seedDrafts,
  SENSITIVITY_OPTIONS, GRADE_OPTIONS, GRADE_TYPE_OPTIONS, FRESHNESS_OPTIONS,
} from './tag-configuration.data';
import { HistoryRowComponent, HistoryAction } from './components/history-row.component';
import { FunctionalNoticeComponent } from '../../shared/ui/functional-notice/functional-notice.component';
import { ImportRulesModalComponent } from './components/import-rules-modal.component';
import { ButtonSplitComponent } from '../../shared/ui/button-split/button-split.component';
import { StandaloneDropdownComponent } from '../../shared/ui/standalone-dropdown/standalone-dropdown.component';
import { NewSetChoiceModalComponent, NewSetAction, PreviousSet } from './components/new-set-choice-modal.component';

/** Un bouton désactivé qui ne dit pas pourquoi n'apprend rien : chaque blocage
 *  porte sa raison, lisible au survol comme au clavier. */
const READ_ONLY_REASON = 'You don\'t have the right to edit those rules. Contact your administrator if that\'s an error.';
// Les deux boutons de la page principale se grisent ensemble quand un brouillon
// existe : leurs deux raisons doivent envoyer au même endroit, l'historique, où
// le brouillon a sa ligne.
const DRAFT_EXISTS_REASON = 'A draft already exists for this country. Resume it or delete it from the History tab before starting another set.';
/** Sur la page principale on regarde la version active : reprendre ou supprimer
 *  un brouillon se fait depuis l'historique, où il a sa ligne. */
const DRAFT_BLOCKS_EDIT = 'A draft of this set is in progress. Resume it or delete it from the History tab.';

@Component({
  selector: 'app-tag-configuration',
  standalone: true,
  imports: [
    TopboxTestShellComponent, PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, PageTitleComponent,
    SelectComponent, ButtonComponent, LinkComponent, FlyoutMenuComponent, FlyoutMenuItemComponent,
    SnackbarComponent, ConfirmDialogComponent, ToasterContainerComponent, TooltipDirective,
    RuleCardComponent, RuleModalComponent, FreshnessModalComponent,
    TransExclModalComponent, FilterDrawerComponent, CdkDropList, CdkDrag, CdkDragHandle, IconComponent,
    TabComponent, HistoryRowComponent,
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
  /** Valeur affichée par le sélecteur, en liaison bidirectionnelle : quand la
   *  sortie d'édition est annulée, il faut pouvoir la ramener au pays courant. */
  countryValue = signal<string>('FR');
  currentCountry = computed(() => countryByCode(this.country()));
  isReadOnly = computed(() => !!this.currentCountry().readOnly);

  /** Référentiel national de formes juridiques : sert d'options dans la modale
   *  et de contrôle sur les cartes (une forme étrangère est signalée). */
  legalFormOptions = computed(() => legalFormsForCountry(this.country()));
  knownLegalForms  = computed(() => this.legalFormOptions().map(o => o.value));

  activeTab = signal<'configuration' | 'history'>('configuration');

  // `rules` est toujours le jeu affiché : le jeu actif en consultation, la copie
  // de travail du brouillon en édition. Rien ne devient actif sans « Validate
  // rules », rien n'est enregistré comme brouillon sans « Save draft ».
  activeRules = signal<TagRule[]>(rulesForCountry('FR'));
  rules = signal<TagRule[]>(this.activeRules().map(r => ({ ...r, criteria: { ...r.criteria } })));
  expandedAll = signal(false);
  expandedIds = signal<Set<string>>(new Set());

  // --- brouillons persistés, un par pays ------------------------------------

  drafts = signal<Record<string, RuleSetDraft>>(seedDrafts());
  draft = computed<RuleSetDraft | null>(() => this.drafts()[this.country()] ?? null);
  hasDraft = computed(() => this.draft() != null);

  /** Origine du brouillon en cours d'édition, quand il vient d'un autre pays. */
  editCopiedFrom = signal<RuleSetDraft['copiedFrom'] | undefined>(undefined);

  // view (lecture seule, par défaut) vs edit (drag, menu 3 points, create/delete)
  mode = signal<'view' | 'edit'>('view');
  private editBaseline = signal<string>('');

  private snapshot(list: TagRule[]): string {
    return JSON.stringify(list.map(r => ({ p: r.position, d: r.decision, c: r.criteria })));
  }
  isDirty = computed(() => this.mode() === 'edit' && this.snapshot(this.rules()) !== this.editBaseline());

  private beginEdit(source: TagRule[]): void {
    const copy = source.map((r, i) => ({ ...r, position: i + 1, criteria: { ...r.criteria } }));
    this.rules.set(copy);
    this.editBaseline.set(this.snapshot(copy));
    this.mode.set('edit');
    this.activeTab.set('configuration');
    this.historyDetail.set(null);
  }

  /** Retour en consultation : l'écran remontre le jeu actif. Le brouillon, lui,
   *  n'existe que s'il a été enregistré : ce qui se voit dans l'historique. */
  private toView(): void {
    this.rules.set(this.activeRules().map(r => ({ ...r, criteria: { ...r.criteria } })));
    this.mode.set('view');
    this.editCopiedFrom.set(undefined);
    this.editBaseline.set('');
    this.expandedIds.set(new Set());
    this.expandedAll.set(false);
  }

  editRules(): void {
    this.editCopiedFrom.set(undefined);
    this.beginEdit(this.activeRules());
  }

  resumeDraft(): void {
    const d = this.draft();
    if (!d) return;
    this.editCopiedFrom.set(d.copiedFrom);
    this.beginEdit(d.rules);
  }

  saveDraft(): void {
    const rules = this.rules().map(r => ({ ...r, criteria: { ...r.criteria } }));
    const entry: RuleSetDraft = {
      country: this.country(),
      rules,
      lastEditedLabel: 'Just now',
      lastEditedBy: 'John Doe',
      copiedFrom: this.editCopiedFrom(),
    };
    this.drafts.update(map => ({ ...map, [this.country()]: entry }));
    this.editBaseline.set(this.snapshot(rules));
    this.toaster.show('Draft saved', { tone: 'success' });
  }

  // --- garde de sortie d'édition (trois issues) -----------------------------

  leaveConfirmOpen = signal(false);
  private pendingLeave: (() => void) | null = null;
  private pendingCancel: (() => void) | null = null;

  /** Toute sortie d'édition passe par ici. Sans modification, on sort sans rien
   *  demander : une confirmation qui ne protège rien n'est qu'un clic de plus. */
  private requestLeave(after: () => void, onCancel?: () => void): void {
    if (this.mode() !== 'edit' || !this.isDirty()) { after(); return; }
    this.pendingLeave = after;
    this.pendingCancel = onCancel ?? null;
    this.leaveConfirmOpen.set(true);
  }

  leaveEdit(): void { this.requestLeave(() => this.toView()); }

  keepEditing(): void {
    this.leaveConfirmOpen.set(false);
    this.pendingCancel?.();
    this.pendingLeave = null;
    this.pendingCancel = null;
  }
  discardAndLeave(): void {
    const after = this.pendingLeave;
    this.leaveConfirmOpen.set(false);
    this.pendingLeave = null; this.pendingCancel = null;
    this.toView();
    after?.();
    this.toaster.show('Changes discarded', { tone: 'info' });
  }
  saveDraftAndLeave(): void {
    const after = this.pendingLeave;
    this.leaveConfirmOpen.set(false);
    this.pendingLeave = null; this.pendingCancel = null;
    this.saveDraft();
    this.toView();
    after?.();
  }

  // --- suppression d'un brouillon ------------------------------------------

  deleteDraftOpen = signal(false);
  requestDeleteDraft(): void { this.deleteDraftOpen.set(true); }
  confirmDeleteDraft(): void {
    const code = this.country();
    this.drafts.update(map => { const next = { ...map }; delete next[code]; return next; });
    this.deleteDraftOpen.set(false);
    if (this.mode() === 'edit') this.toView();
    if (this.historyDetail()?.id === 'draft') this.historyDetail.set(null);
    this.toaster.show('Draft deleted', { tone: 'success' });
  }

  /** Drag indices refer to the rendered (filtered) list. Disabled whenever a filter is active so dragged/full-list indices can't drift apart. */
  canReorder = computed(() => this.activeFilterCount() === 0);

  onRuleDrop(event: CdkDragDrop<TagRule[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const list = [...this.filteredRules()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    list.forEach((r, idx) => (r.position = idx + 1));
    this.rules.set([...list]);
    this.toaster.show('Rule order updated', { tone: 'success' });
  }

  // Menu « Set parameters » de la barre d'édition : les seuils de fraîcheur et la
  // liste TRANS-NA-EXCL sont des valeurs du set, pas des réglages de la page.
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

  /** La règle est insérée **à** sa position, pas ajoutée en fin : la position
   *  choisie dans la modale est la seule promesse faite à l'utilisateur. */
  onRuleSave(saved: TagRule): void {
    const wasEdit = this.editingRule() != null;
    this.rules.update(list => {
      const rest = list.filter(x => x.id !== saved.id);
      const idx = Math.min(Math.max(saved.position - 1, 0), rest.length);
      rest.splice(idx, 0, saved);
      return rest.map((r, i) => ({ ...r, position: i + 1 }));
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
    if (code === this.country()) return;
    this.requestLeave(
      () => this.switchCountry(code as CountryCode),
      () => this.countryValue.set(this.country()),
    );
  }

  private switchCountry(code: CountryCode): void {
    this.country.set(code);
    this.countryValue.set(code);
    this.activeRules.set(rulesForCountry(code));
    this.rules.set(rulesForCountry(code));
    this.freshness.set(freshnessForCountry(code));
    this.exclusionCodes.set(codesForCountry(code));
    this.history.set(historyForCountry(code));
    this.historyDetail.set(null);
    this.appliedFilters.set({});
    this.currentFilters.set({});
    this.expandedIds.set(new Set());
    this.expandedAll.set(false);
    this.editCopiedFrom.set(undefined);
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

  // --- validation d'un brouillon en jeu actif ------------------------------

  validateOpen = signal(false);
  validateMessage = computed(() =>
    `The ${this.rules().length} rules of this draft become the active set for ${this.currentCountry().name}. `
    + 'The current active version is archived and stays available in History. This cannot be undone.');

  onValidateVersion(): void {
    const validated = this.rules().map(r => ({ ...r, criteria: { ...r.criteria } }));
    this.activeRules.set(validated);
    this.history.update(list => [{
      id: Math.floor(100000000 + Math.random() * 900000000).toString(),
      createdLabel: 'Just now', lastUpdateLabel: 'Just now', lastUpdateBy: 'John Doe',
      activePeriodLabel: 'Today → —', status: 'Active',
      rules: validated.map(r => ({ ...r, criteria: { ...r.criteria } })),
    }, ...list.map(h => h.status === 'Active' ? { ...h, status: 'Archived' as const } : h)]);
    // Le brouillon a été promu : le garder ferait croire à du travail en attente.
    const code = this.country();
    this.drafts.update(map => { const next = { ...map }; delete next[code]; return next; });
    this.validateOpen.set(false);
    this.toView();
    this.toaster.show('New rule version validated', { tone: 'success' });
  }

  // --- onglet History ------------------------------------------------------

  history = signal<RuleSetHistoryEntry[]>(historyForCountry('FR'));
  activeEntry = computed<RuleSetHistoryEntry | null>(() => this.history().find(h => h.status === 'Active') ?? null);

  /** Ligne DRAFT permanente : le brouillon survit à la sortie d'édition, donc il
   *  a sa place dans l'historique même quand on ne l'édite pas. */
  draftHistoryEntry = computed<RuleSetHistoryEntry | null>(() => {
    const d = this.draft();
    if (!d) return null;
    return {
      id: 'draft', createdLabel: '—',
      lastUpdateLabel: d.lastEditedLabel, lastUpdateBy: d.lastEditedBy,
      activePeriodLabel: '—', status: 'Draft',
      rules: d.rules,
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

  onTabChange(tab: 'configuration' | 'history'): void {
    this.requestLeave(() => { this.activeTab.set(tab); this.historyDetail.set(null); });
  }

  /** Les actions découlent du statut de l'entrée et du droit d'écriture du pays.
   *  Aucun modèle de rôle en plus. Export reste ouvert en lecture seule. */
  historyActions(entry: RuleSetHistoryEntry): HistoryAction[] {
    const ro = this.isReadOnly();
    const blocked = ro ? READ_ONLY_REASON : '';
    const draftBlocked = ro ? READ_ONLY_REASON : this.hasDraft() ? DRAFT_EXISTS_REASON : '';
    const view: HistoryAction = { key: 'view', label: 'View rules', icon: 'eye' };
    const exp: HistoryAction = { key: 'export', label: 'Export JSON', icon: 'download' };
    switch (entry.status) {
      case 'Draft':
        return [
          view,
          { key: 'resume', label: 'Resume draft', icon: 'edit', disabled: !!blocked, reason: blocked },
          exp,
          { key: 'delete', label: 'Delete draft', icon: 'trash', disabled: !!blocked, reason: blocked },
        ];
      case 'Active':
        return [
          view,
          { key: 'edit', label: 'Edit rules', icon: 'edit', disabled: !!draftBlocked, reason: draftBlocked },
          exp,
        ];
      case 'Archived':
        return [
          view,
          { key: 'new-from', label: 'New set from this version', icon: 'file-new', disabled: !!draftBlocked, reason: draftBlocked },
          exp,
        ];
    }
  }

  /** Mêmes actions en tête du détail, moins « View » : on y est déjà. Rangées de
   *  droite à gauche par importance décroissante : l'action propre au statut
   *  ferme la ligne à droite, le destructif se tient le plus loin d'elle. */
  private static readonly DETAIL_ACTION_ORDER = ['delete', 'export', 'resume', 'edit', 'new-from'];
  detailActions = computed<HistoryAction[]>(() => {
    const detail = this.historyDetail();
    if (!detail) return [];
    const order = TagConfigurationComponent.DETAIL_ACTION_ORDER;
    return this.historyActions(detail)
      .filter(a => a.key !== 'view')
      .sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  });

  onHistoryAction(entry: RuleSetHistoryEntry, key: string): void {
    switch (key) {
      case 'view':     this.openHistoryDetail(entry); break;
      case 'export':   this.exportRules(entry.rules, entry.status === 'Draft' ? 'draft' : entry.id); break;
      // L'édition vit dans l'onglet Configuration : y basculer évite un mode
      // d'édition orphelin dans l'historique.
      case 'resume':   this.resumeDraft(); break;
      case 'edit':     this.editRules(); break;
      case 'new-from': this.startDraftFrom(entry, this.currentCountry()); break;
      case 'delete':   this.requestDeleteDraft(); break;
    }
  }

  // --- Create new set ------------------------------------------------------

  newSetChoiceOpen = signal(false);
  /** Tous les pays : repartir du set d'un voisin est le vrai cas d'usage d'un
   *  pays qui démarre. C'est aussi ce qui rend l'alerte de divergence possible. */
  allSets: PreviousSet[] = COUNTRIES.flatMap(c => historyForCountry(c.code).map(entry => ({ entry, country: c })));

  onNewSetChosen(action: NewSetAction): void {
    this.newSetChoiceOpen.set(false);
    if (action === 'scratch') {
      this.editCopiedFrom.set(undefined);
      this.beginEdit([]);
    } else if (action === 'import') {
      this.importOpen.set(true);
    }
  }
  onNewSetFromPrevious(sel: PreviousSet): void {
    this.newSetChoiceOpen.set(false);
    this.startDraftFrom(sel.entry, sel.country);
  }

  private startDraftFrom(entry: RuleSetHistoryEntry, from: Country): void {
    const target = this.currentCountry();
    this.editCopiedFrom.set(from.code === target.code ? undefined : {
      country: from.code, countryName: from.name, currency: from.currency, setId: entry.id,
    });
    this.beginEdit(entry.rules);
    this.toaster.show('Rules loaded from a previous set (draft)', { tone: 'success' });
  }

  /** Rappel permanent au-dessus du brouillon : un set copié d'un autre pays garde
   *  ses montants et ses formes juridiques, on ne réécrit rien à la place de
   *  l'analyste : on lui dit quoi relire. */
  copiedFromNotice = computed<{ title: string; message: string } | null>(() => {
    const src = this.editCopiedFrom();
    if (!src) return null;
    const target = this.currentCountry();
    const known = this.knownLegalForms();
    const list = this.rules();
    const amountRules = list.filter(r => r.criteria.exposure).length;
    const foreign = [...new Set(list.flatMap(r => r.criteria.legalForm ?? []).filter(f => !known.includes(f)))];
    const formRules = list.filter(r => (r.criteria.legalForm ?? []).some(f => foreign.includes(f))).length;

    const parts: string[] = [];
    if (src.currency !== target.currency && amountRules > 0) {
      parts.push(`${amountRules} rule${amountRules === 1 ? '' : 's'} still carry exposure thresholds in ${src.currency}, and ${target.name} works in ${target.currency}. Nothing was converted.`);
    }
    if (foreign.length) {
      parts.push(`${formRules} rule${formRules === 1 ? '' : 's'} filter on ${foreign.join(', ')}, not used in ${target.name}. They are kept and flagged in the list, because dropping them would widen the rule.`);
    }
    if (!parts.length) parts.push('Review each rule before validating.');

    return { title: `Copied from ${src.countryName}, set #${src.setId}`, message: parts.join(' ') };
  });

  // --- Import / Export ----------------------------------------------------

  importOpen = signal(false);
  onRulesImported(imported: TagRule[]): void {
    if (this.mode() === 'view') this.beginEdit(imported);
    else this.rules.set(imported.map((r, i) => ({ ...r, position: i + 1 })));
    this.importOpen.set(false);
    this.toaster.show('Rules imported (draft)', { tone: 'success' });
  }

  /** L'export ne dépend ni du mode ni du droit d'écrire : lire et emporter ce
   *  qu'on lit est la même chose. */
  exportCurrent(): void {
    const label = this.mode() === 'edit' ? 'draft' : (this.activeEntry()?.id ?? 'current');
    this.exportRules(this.rules(), label);
  }

  exportRules(rules: TagRule[], label: string): void {
    const payload = {
      country: this.country(),
      countryName: this.currentCountry().name,
      currency: this.currentCountry().currency,
      set: label,
      rules,
    };
    this.download(JSON.stringify(payload, null, 2), 'application/json', `tag-rules-${this.country()}-${label}.json`);
  }

  private download(content: string, mime: string, filename: string): void {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- ce qu'on regarde ----------------------------------------------------

  /** Ni sous-titre sous le titre, ni badge après le titre : la version qu'on lit,
   *  sa date, son auteur et le brouillon éventuel se disent dans une notice au
   *  dessus de la liste : là où on lit les règles. Porte aussi le « read only »
   *  du pays, donc lisible sans survol, au clavier comme au doigt. */
  versionNotice = computed<{ title: string; message: string } | null>(() => {
    const detail = this.historyDetail();
    if (detail) {
      const title = detail.status === 'Draft'
        ? 'Draft (not validated)'
        : `${detail.status} version #${detail.id}`;
      return { title, message: `Last update ${detail.lastUpdateLabel} by ${detail.lastUpdateBy}.` };
    }
    // En édition, le bandeau de brouillon dit déjà où l'on est : deux bandeaux
    // qui parlent du même état, c'est un de trop.
    if (this.mode() === 'edit') return null;

    const active = this.activeEntry();
    const parts: string[] = [];
    if (active) parts.push(`Validated ${active.lastUpdateLabel} by ${active.lastUpdateBy}.`);
    const d = this.draft();
    if (d) parts.push(`A draft of this set is in progress, last edited ${d.lastEditedLabel} by ${d.lastEditedBy}. Resume or delete it from the History tab.`);
    if (this.isReadOnly()) parts.push('You have read-only access to this country\'s rules.');
    return {
      title: active ? `Active version #${active.id}` : 'No active set for this country',
      message: parts.join(' '),
    };
  });

  /** Le bandeau d'édition porte l'état du brouillon, plus seulement la consigne :
   *  c'est lui qui dit s'il reste quelque chose à enregistrer. */
  draftBannerText = computed(() => {
    if (this.isDirty()) return 'Draft mode: unsaved changes. Nothing is saved until you save or validate this draft.';
    const d = this.draft();
    return d
      ? `Draft mode: draft saved ${d.lastEditedLabel.toLowerCase()} by ${d.lastEditedBy}. Nothing is saved automatically.`
      : 'Draft mode: nothing is saved until you save or validate this draft.';
  });

  // --- raisons de blocage ------------------------------------------------

  editBlockedReason = computed(() =>
    this.isReadOnly() ? READ_ONLY_REASON : this.hasDraft() ? DRAFT_BLOCKS_EDIT : '');
  newSetBlockedReason = computed(() =>
    this.isReadOnly() ? READ_ONLY_REASON : this.hasDraft() ? DRAFT_EXISTS_REASON : '');
  validateBlockedReason = computed(() => this.hasRules() ? '' : 'Add at least one rule before validating this set.');

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
