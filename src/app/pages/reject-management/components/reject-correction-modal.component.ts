import { Component, ElementRef, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  ModalComponent,
  BadgeComponent,
  ButtonComponent,
  IconComponent,
  InputTextComponent,
  FunctionalNoticeComponent,
  PropertiesPanelComponent,
  SegmentedControlComponent,
  SideNavItemComponent,
  ToasterService,
  type PropertySection,
  type SegmentedOption,
} from '../../../shared/ui';
import type { RejectField, RejectRecord } from '../reject-record.model';
import type { Reject } from '../reject-management.data';

type FieldView = 'errors' | 'filled' | 'all';

/** Une sous-section telle qu'affichée : sa clé d'ancre et les champs retenus par la vue. */
interface ShownSection {
  key: string;
  block: string;
  name: string;
  fields: RejectField[];
  /** Champs de la section masqués par la vue, révélables sur place. */
  hiddenCount: number;
}

/**
 * Correction d'un rejet, sur un seul écran : jamais d'aller-retour entre un
 * récapitulatif et des sous-écrans. La colonne de gauche est le carrefour, elle
 * reste affichée : toutes les sections, leur compteur d'erreurs, un clic fait
 * défiler. À droite, la raison du rejet et l'identité du message, puis les
 * champs. Par défaut seuls les champs en cause sont montrés (un message compte
 * jusqu'à 126 champs, la plupart vides) ; les autres restent à un clic, section
 * par section ou pour tout le message. Erreur suivante / précédente enchaîne les
 * corrections sans chercher. Resubmit n'est jamais grisé : tant qu'il reste une
 * erreur, il y mène.
 */
@Component({
  selector: 'rm-reject-correction-modal',
  standalone: true,
  imports: [
    ModalComponent,
    BadgeComponent,
    ButtonComponent,
    IconComponent,
    InputTextComponent,
    FunctionalNoticeComponent,
    PropertiesPanelComponent,
    SegmentedControlComponent,
    SideNavItemComponent,
  ],
  templateUrl: './reject-correction-modal.component.html',
  styleUrl: './reject-correction-modal.component.scss',
})
export class RejectCorrectionModalComponent {
  private host = inject(ElementRef<HTMLElement>);
  private toaster = inject(ToasterService);

  open = input<boolean>(false);
  /** La ligne du tableau : titre et identité du rejet. */
  reject = input<Reject | null>(null);
  /** Le contenu du message rejeté. */
  record = input<RejectRecord | null>(null);

  closed = output<void>();
  resubmitted = output<string>();

  /** Presque toute la hauteur de l'écran : en-tête et pied de modale déduits. */
  readonly contentHeight = 'calc(100vh - 240px)';

  readonly view = signal<FieldView>('errors');
  /** Valeurs saisies, par numéro de champ. */
  readonly values = signal<Record<number, string>>({});
  /** Sections dépliées en entier malgré la vue. */
  readonly expanded = signal<Set<string>>(new Set());
  readonly activeSection = signal<string | null>(null);

  constructor() {
    // Chaque ouverture repart des valeurs reçues
    effect(() => {
      const rec = this.record();
      if (!this.open() || !rec) return;
      const init: Record<number, string> = {};
      for (const f of this.allFields()) init[f.n] = f.value;
      this.values.set(init);
      this.view.set('errors');
      this.expanded.set(new Set());
      this.activeSection.set(this.firstErrorSectionKey());
    });

    // La section active reste visible dans le carrefour, même quand il défile
    effect(() => {
      const key = this.activeSection();
      if (!key) return;
      setTimeout(() => this.el(`[data-rail="${key}"]`)?.scrollIntoView({ block: 'nearest' }));
    });
  }

  // ── Champs et erreurs ────────────────────────────────────────────────────
  readonly allFields = computed(() =>
    (this.record()?.blocks ?? []).flatMap(b => b.sections.flatMap(s => s.fields)));

  /** Un champ en cause est corrigé dès que sa valeur change et n'est pas vide. */
  isOpenError(f: RejectField): boolean {
    if (!f.error) return false;
    const v = (this.values()[f.n] ?? '').trim();
    return v === '' || v === f.value.trim();
  }

  readonly openErrors = computed(() => this.allFields().filter(f => this.isOpenError(f)));
  readonly errorTotal = computed(() => this.allFields().filter(f => f.error).length);
  readonly filledCount = computed(() => this.allFields().filter(f => (this.values()[f.n] ?? '').trim() !== '').length);

  readonly remainingLabel = computed(() => {
    const n = this.openErrors().length;
    return n === 0 ? 'All fields corrected' : `${n} ${n === 1 ? 'field' : 'fields'} to correct`;
  });

  readonly viewOptions = computed<SegmentedOption[]>(() => [
    { value: 'errors', label: `Fields to correct (${this.errorTotal()})` },
    { value: 'filled', label: `Filled fields (${this.filledCount()})` },
    { value: 'all',    label: `All fields (${this.allFields().length})` },
  ]);

  setView(v: string): void {
    this.view.set(v === 'filled' || v === 'all' ? v : 'errors');
    this.expanded.set(new Set());
  }

  // ── Identité du message ──────────────────────────────────────────────────
  readonly identity = computed<PropertySection[]>(() => {
    const m = this.record()?.meta ?? {};
    // Quatre colonnes de deux lignes : l'identité tient sur une bande basse
    const pairs = [['Sub-System', 'EHBU'], ['Provider ID', 'Date'], ['Euler Hermes ID', 'Country'], ['Identifier type', 'Identifier value']];
    return pairs.map(keys => ({ rows: keys.map(k => ({ label: k, value: m[k] ?? '', showEmptyPlaceholder: true })) }));
  });

  // ── Sections affichées selon la vue ──────────────────────────────────────
  private keep(f: RejectField, view: FieldView): boolean {
    if (view === 'all') return true;
    if (view === 'filled') return !!f.error || (this.values()[f.n] ?? '').trim() !== '';
    return !!f.error;
  }

  readonly sections = computed<ShownSection[]>(() => {
    const view = this.view();
    const open = this.expanded();
    const out: ShownSection[] = [];
    (this.record()?.blocks ?? []).forEach((b, bi) => b.sections.forEach((s, si) => {
      const key = `${bi}-${si}`;
      const kept = open.has(key) ? s.fields : s.fields.filter(f => this.keep(f, view));
      if (!kept.length) return;
      out.push({ key, block: b.name, name: s.name, fields: kept, hiddenCount: s.fields.length - kept.length });
    }));
    return out;
  });

  /** Colonne de gauche : tous les blocs et toutes les sections, quelle que soit la vue. */
  readonly rail = computed(() => (this.record()?.blocks ?? []).map((b, bi) => ({
    name: b.name,
    sections: b.sections.map((s, si) => ({
      key: `${bi}-${si}`,
      name: s.name,
      open: s.fields.filter(f => this.isOpenError(f)).length,
      hadErrors: s.fields.some(f => !!f.error),
    })),
  })));

  expandSection(key: string): void {
    this.expanded.update(set => new Set(set).add(key));
  }

  /** Une section absente de la vue y est ajoutée avant de défiler jusqu'à elle. */
  goToSection(key: string): void {
    if (!this.sections().some(s => s.key === key)) this.expandSection(key);
    this.activeSection.set(key);
    setTimeout(() => {
      const sec = this.el(`#rc-sec-${key}`);
      if (sec) this.scrollMain(sec.offsetTop - this.summaryBottom());
    });
  }

  /** Défilement piloté (ancre, erreur suivante) : la surbrillance automatique se tait le temps de l'animation. */
  private steering = false;
  private steerTimer?: ReturnType<typeof setTimeout>;

  private scrollMain(top: number): void {
    const main = this.el('.rc__main');
    if (!main) return;
    this.steering = true;
    clearTimeout(this.steerTimer);
    this.steerTimer = setTimeout(() => (this.steering = false), 1000);
    main.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  /** Bas du résumé collant, plus l'écart entre blocs de la colonne : ce qui défile se range sous lui. */
  private summaryBottom(): number {
    const main = this.el('.rc__main');
    const summary = this.el('.rc__summary');
    const gap = main ? parseFloat(getComputedStyle(main).rowGap) || 0 : 0;
    return (summary?.offsetHeight ?? 0) + gap;
  }

  /** Au défilement, le carrefour surligne la section dont le titre a passé le résumé. */
  onScroll(event: Event): void {
    if (this.steering) return;
    const main = event.target as HTMLElement;
    // Tolérance d'un écart de plus : une section posée par une ancre compte comme atteinte
    const line = main.getBoundingClientRect().top + 2 * this.summaryBottom() - (this.el('.rc__summary')?.offsetHeight ?? 0);
    let current: string | null = null;
    for (const sec of Array.from(main.querySelectorAll<HTMLElement>('.rc__section'))) {
      if (sec.getBoundingClientRect().top <= line) current = sec.id.replace('rc-sec-', '');
      else break;
    }
    if (current) this.activeSection.set(current);
  }

  // ── Saisie ───────────────────────────────────────────────────────────────
  setValue(n: number, value: string): void {
    this.values.update(v => ({ ...v, [n]: value }));
  }

  /** Les champs longs prennent deux colonnes : un libellé ne passe jamais sur deux lignes. */
  isWide(f: RejectField): boolean {
    return f.label.length > 30 || f.length >= 70;
  }

  // ── Erreur suivante / précédente ─────────────────────────────────────────
  private currentError = signal<number | null>(null);

  goToError(step: 1 | -1): void {
    const list = this.openErrors();
    if (!list.length) return;
    const at = list.findIndex(f => f.n === this.currentError());
    const next = at === -1 ? (step === 1 ? 0 : list.length - 1) : (at + step + list.length) % list.length;
    this.focusField(list[next]);
  }

  private focusField(f: RejectField): void {
    const key = this.sectionKeyOf(f);
    if (key && !this.sections().some(s => s.key === key && s.fields.includes(f))) this.expandSection(key);
    this.currentError.set(f.n);
    if (key) this.activeSection.set(key);
    setTimeout(() => {
      const field = this.el(`#rc-field-${f.n}`);
      if (!field) return;
      // Le champ remonte sous le résumé, avec le titre de sa section au-dessus quand il tient
      const sec = field.closest<HTMLElement>('.rc__section');
      const main = this.el('.rc__main');
      const near = (main?.clientHeight ?? 0) / 3;
      const top = sec && field.offsetTop - sec.offsetTop < near ? sec.offsetTop : field.offsetTop;
      this.scrollMain(top - this.summaryBottom());
      field.querySelector('input')?.focus({ preventScroll: true });
    });
  }

  onFieldFocus(f: RejectField): void {
    if (f.error) this.currentError.set(f.n);
  }

  // ── Fin ──────────────────────────────────────────────────────────────────
  /** Jamais grisé : tant qu'il reste une erreur, Resubmit y mène. */
  resubmit(): void {
    const left = this.openErrors();
    if (left.length) {
      this.toaster.show(`${this.remainingLabel()} before resubmitting`, { tone: 'warning' });
      this.focusField(left[0]);
      return;
    }
    const id = this.reject()?.id ?? this.record()?.id ?? '';
    this.resubmitted.emit(id);
  }

  private sectionKeyOf(f: RejectField): string | null {
    const blocks = this.record()?.blocks ?? [];
    for (let bi = 0; bi < blocks.length; bi++)
      for (let si = 0; si < blocks[bi].sections.length; si++)
        if (blocks[bi].sections[si].fields.includes(f)) return `${bi}-${si}`;
    return null;
  }

  private firstErrorSectionKey(): string | null {
    const f = this.allFields().find(x => x.error);
    return f ? this.sectionKeyOf(f) : null;
  }

  private el(selector: string): HTMLElement | null {
    return (this.host.nativeElement as HTMLElement).querySelector(selector);
  }
}
