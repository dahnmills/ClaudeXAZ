import { Component, computed, inject, signal } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import {
  PageHeaderComponent,
  BreadcrumbsComponent,
  CrumbComponent,
  PageTitleComponent,
  IconComponent,
  BadgeComponent,
  ButtonComponent,
  ButtonIconComponent,
  CheckboxComponent,
  SelectComponent,
  InputTextComponent,
  ModalComponent,
  FlyoutMenuComponent,
  FlyoutMenuItemComponent,
  TableRowComponent,
  CellComponent,
  CellHeaderComponent,
  CellActionComponent,
  CellSelectionComponent,
  DateRangeComponent,
  SnackbarService,
  type DateRangeValue,
  type SelectOption,
} from '../../shared/ui';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { NOTIFICATION_ROWS } from './notification-module.mock';
import {
  type NotificationRow,
  type Distribution,
  type DistributionStatus,
  type GenerationStatus,
  type MediaDetail,
  distributionTone,
  mediaTone,
  generalTone,
  generationTone,
  toneToBadge,
  DISTRIBUTION_LABEL,
  MEDIA_LABEL,
  GENERAL_LABEL,
  GENERAL_MESSAGE,
  GENERATION_LABEL,
  GENERATION_PENDING_MESSAGE,
  ALERTING_MESSAGE,
} from './notification-module.model';

/** Une boîte média (Normal ou Backup) — statuts indépendants. */
interface MediaBox {
  key:    'normal' | 'backup';
  title:  string;   // « Normal media » / « Backup media »
  detail: MediaDetail;
}

@Component({
  selector: 'app-notification-module',
  standalone: true,
  imports: [
    LowerCasePipe,
    TopboxTestShellComponent,
    PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, PageTitleComponent,
    IconComponent, BadgeComponent,
    ButtonComponent, ButtonIconComponent,
    CheckboxComponent,
    SelectComponent, InputTextComponent, ModalComponent,
    FlyoutMenuComponent, FlyoutMenuItemComponent,
    TableRowComponent, CellComponent, CellHeaderComponent, CellActionComponent,
    CellSelectionComponent, DateRangeComponent,
  ],
  templateUrl: './notification-module.component.html',
  styleUrl: './notification-module.component.scss',
})
export class NotificationModuleComponent {
  private snackbar = inject(SnackbarService);

  readonly rows = NOTIFICATION_ROWS;

  // ── Tableau de fond ─────────────────────────────────────────────────────────
  sortDir  = signal<'asc' | 'desc' | null>('desc');
  menuFor  = signal<string | null>(null);

  // Options des filtres du bloc de recherche (statiques — proto).
  readonly statusCodeOptions: SelectOption[] = [
    { value: '',          label: 'All' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'partial',   label: 'Partially delivered' },
    { value: 'failed',    label: 'Distribution failed' },
    { value: 'action',    label: 'Action required' },
    { value: 'ongoing',   label: 'Ongoing' },
  ];
  readonly buOptions: SelectOption[] = [
    { value: '',     label: 'All' },
    { value: 'FR01', label: 'FR01' },
    { value: 'DE04', label: 'DE04' },
    { value: 'ES02', label: 'ES02' },
    { value: 'GB07', label: 'GB07' },
  ];
  readonly typeOptions: SelectOption[] = [
    { value: '',     label: 'All' },
    { value: 'grade',  label: 'Grade change' },
    { value: 'limit',  label: 'Limit decision' },
    { value: 'cancel', label: 'Cancellation' },
    { value: 'action', label: 'Action required' },
  ];
  statusCodeFilter = signal<string>('');
  buFilter         = signal<string>('');
  typeFilter       = signal<string>('');
  dateQuery        = signal<string>('');
  /** Ouverture du calendrier flottant du champ Date. */
  dateOpen         = signal<boolean>(false);
  /** Plage sélectionnée (liée au ds-date-range). */
  dateStart        = signal<Date | null>(null);
  dateEnd          = signal<Date | null>(null);

  /** Applique la plage date + heure (bouton Apply du ds-date-range) et ferme le flyout. */
  applyDate(v: DateRangeValue) {
    const { startDate: start, endDate: end, startTime, endTime } = v;
    if (start && end) {
      // Plage jour + heure : « Aug 8, 09:00 - Aug 12, 18:30, 2026 ».
      const dm = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const y = (d: Date) => d.getFullYear();
      const label = y(start) === y(end)
        ? `${dm(start)}, ${startTime} - ${dm(end)}, ${endTime}, ${y(end)}`
        : `${dm(start)}, ${startTime}, ${y(start)} - ${dm(end)}, ${endTime}, ${y(end)}`;
      this.dateQuery.set(label);
    }
    this.dateOpen.set(false);
  }
  policyQuery      = signal<string>('');
  extensionQuery   = signal<string>('');
  buyerQuery       = signal<string>('');
  notifIdQuery     = signal<string>('');
  /** Case « Include copy » du module de recherche (réf. Figma DS Draft Search 57:629). */
  includeCopy      = signal<boolean>(false);

  /** Sélection multiple des lignes (checkbox de tête de ligne). */
  selectedRows = signal<Set<string>>(new Set());

  // ── Modale « Distribution Details » ──────────────────────────────────────────
  modalOpen  = signal<boolean>(false);
  active     = signal<NotificationRow | null>(null);
  /** Filtre de statut actif (single-select façon « Change report » : All + statuts). */
  statusFilter = signal<DistributionStatus | 'all'>('all');
  /** Distribution sélectionnée dans la liste de gauche. */
  selectedDistId = signal<string | null>(null);

  // Statuts filtrables, dans l'ordre du ticket.
  readonly filterStatuses: DistributionStatus[] = ['distributed', 'failed', 'alerting', 'ongoing'];

  distributions = computed<Distribution[]>(() => this.active()?.details.distributions ?? []);

  /** Compteur par statut (affiché dans les pills de filtre). */
  statusCount(s: DistributionStatus): number {
    return this.distributions().filter(d => d.status === s).length;
  }
  totalCount = computed(() => this.distributions().length);

  /** Distributions après application du filtre de statut. */
  visibleDistributions = computed<Distribution[]>(() => {
    const f = this.statusFilter();
    const all = this.distributions();
    return f === 'all' ? all : all.filter(d => d.status === f);
  });

  /** Distribution actuellement affichée à droite. */
  currentDist = computed<Distribution | null>(() => {
    const visible = this.visibleDistributions();
    if (visible.length === 0) return null;
    const id = this.selectedDistId();
    return visible.find(d => d.id === id) ?? visible[0];
  });

  /** Les deux boîtes média (Normal / Backup) de la distribution courante. Statuts indépendants. */
  mediaBoxes = computed<MediaBox[]>(() => {
    const d = this.currentDist();
    if (!d) return [];
    return [
      { key: 'normal', title: 'Normal media', detail: d.normal },
      { key: 'backup', title: 'Backup media', detail: d.backup },
    ];
  });

  // ── Étape 1 : génération du document ─────────────────────────────────────────
  /** true si le document est prêt → la distribution peut avoir eu lieu. */
  isGenerated(r: NotificationRow) { return r.details.generationStatus === 'generated'; }
  generationLabel(s: GenerationStatus) { return GENERATION_LABEL[s]; }
  generationBadgeTone(s: GenerationStatus) { return toneToBadge(generationTone(s)); }
  /** Message affiché dans la modale quand le document est encore en génération. */
  generationPendingMessage(r: NotificationRow) {
    const g = r.details.generationStatus;
    return g === 'generated' ? '' : GENERATION_PENDING_MESSAGE[g];
  }

  // ── Alerte distribution (2 médias échoués) ───────────────────────────────────
  readonly alertingMessage = ALERTING_MESSAGE;
  isAlerting(d: Distribution | null) { return d?.status === 'alerting'; }

  // ── Helpers de rendu (couleurs / libellés) ──────────────────────────────────
  distLabel(s: DistributionStatus)  { return DISTRIBUTION_LABEL[s]; }
  mediaLabel = MEDIA_LABEL;
  generalLabel(s: NotificationRow)  { return GENERAL_LABEL[s.details.generalStatus]; }
  generalMessage(s: NotificationRow) { return GENERAL_MESSAGE[s.details.generalStatus]; }

  /** Classe de teinte pour l'icône de statut de distribution (cartes gauche). */
  distToneClass(s: DistributionStatus) { return `nm-tone--${distributionTone(s)}`; }
  /** Classe de teinte d'une boîte média selon SON propre statut. */
  mediaToneClass(m: MediaDetail)       { return `nm-tone--${mediaTone(m.status)}`; }
  generalBadgeTone(r: NotificationRow) { return toneToBadge(generalTone(r.details.generalStatus)); }
  mediaBadgeTone(m: MediaDetail)       { return toneToBadge(mediaTone(m.status)); }

  isMediaStarted(m: MediaDetail) { return m.status !== 'not-started'; }

  /** Icône de statut affichée dans la carte de distribution. */
  distIcon(s: DistributionStatus): 'check-circle' | 'error-circle' | 'warning-triangle' | 'in-progress' {
    switch (s) {
      case 'distributed': return 'check-circle';
      case 'failed':      return 'error-circle';
      case 'alerting':    return 'warning-triangle';
      case 'ongoing':     return 'in-progress';
    }
  }

  // Découpe "2026-08-11 09:42" → { date: "2026-08-11", time: "09:42" }.
  execDate(r: NotificationRow) { return r.executionTime.split(' ')[0] ?? r.executionTime; }
  execTime(r: NotificationRow) { return r.executionTime.split(' ')[1] ?? ''; }

  // ── Sélection des lignes (checkbox) ──────────────────────────────────────────
  isRowSelected(id: string) { return this.selectedRows().has(id); }

  toggleRow(id: string, checked: boolean) {
    const next = new Set(this.selectedRows());
    checked ? next.add(id) : next.delete(id);
    this.selectedRows.set(next);
  }

  allSelected = computed(() =>
    this.rows.length > 0 && this.selectedRows().size === this.rows.length);

  toggleAll(checked: boolean) {
    this.selectedRows.set(checked ? new Set(this.rows.map(r => r.id)) : new Set());
  }

  // ── Actions tableau de fond ──────────────────────────────────────────────────
  toggleSort() {
    this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
  }

  openDetails(row: NotificationRow) {
    this.active.set(row);
    this.statusFilter.set('all');
    this.selectedDistId.set(row.details.distributions[0]?.id ?? null);
    this.modalOpen.set(true);
    this.menuFor.set(null);
  }

  closeModal() {
    this.modalOpen.set(false);
    this.active.set(null); // évite que la ligne reste en état "active" (fond bleu) après fermeture
  }

  // ── Actions modale ───────────────────────────────────────────────────────────
  setStatusFilter(s: DistributionStatus | 'all') {
    this.statusFilter.set(s);
    // Repointe sur la 1re distribution visible après filtrage.
    const cur = this.currentDist();
    if (cur) this.selectedDistId.set(cur.id);
  }

  isStatusActive(s: DistributionStatus | 'all') { return this.statusFilter() === s; }

  selectDistribution(id: string) {
    this.selectedDistId.set(id);
  }

  isDistSelected(id: string) {
    return this.currentDist()?.id === id;
  }

  copyNotificationId() {
    const id = this.active()?.details.info.notificationId;
    if (!id) return;
    navigator.clipboard?.writeText(id).catch(() => {});
    this.snackbar.show(`Notification ID ${id} copied`, { tone: 'success', icon: 'copy' });
  }

  /** Copie l'ID de la distribution affichée (au-dessus des boîtes de comparaison). */
  copyDistributionId() {
    const id = this.currentDist()?.id;
    if (!id) return;
    navigator.clipboard?.writeText(id).catch(() => {});
    this.snackbar.show(`Distribution ID ${id} copied`, { tone: 'success', icon: 'copy' });
  }

  // ── Lecteur PDF simulé ───────────────────────────────────────────────────────
  pdfOpen = signal<boolean>(false);
  pdfZoom = signal<number>(100);

  /** Nom de fichier simulé du rapport de la notification active. */
  pdfName = computed(() => {
    const id = this.active()?.details.info.notificationId ?? 'report';
    return `distribution-report-${id}.pdf`;
  });

  download() {
    // Simule l'ouverture du rapport dans un lecteur PDF (modale dédiée).
    this.pdfZoom.set(100);
    this.pdfOpen.set(true);
  }

  closePdf() { this.pdfOpen.set(false); }

  zoomIn()  { this.pdfZoom.update(z => Math.min(z + 25, 200)); }
  zoomOut() { this.pdfZoom.update(z => Math.max(z - 25, 50)); }

  /** Téléchargement réel (bouton dans le lecteur) → feedback snackbar. */
  savePdf() {
    this.snackbar.show(`${this.pdfName()} downloaded`, { tone: 'success', icon: 'download' });
  }

  // ── Champ Date : calendrier flottant (ds-date-range) ─────────────────────────
  toggleDate() { this.dateOpen.update(o => !o); }
  closeDate()  { this.dateOpen.set(false); }
}
