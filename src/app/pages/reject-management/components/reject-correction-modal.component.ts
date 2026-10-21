import { Component, ElementRef, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  ModalComponent,
  BadgeComponent,
  ButtonComponent,
  IconComponent,
  InputTextComponent,
  SegmentedControlComponent,
  SideNavItemComponent,
  ToasterService,
  type SegmentedOption,
} from '../../../shared/ui';
import type { RejectField, RejectRecord } from '../reject-record.model';
import type { Reject } from '../reject-management.data';

type Mode = 'correct' | 'browse';
type BrowseView = 'filled' | 'all';

/** Un champ en cause, avec l'endroit du message d'où il vient. */
interface ErrorItem {
  field: RejectField;
  where: string;
}

/** Une sous-section affichée en mode consultation. */
interface ShownSection {
  key: string;
  block: string;
  name: string;
  fields: RejectField[];
}

/**
 * Correction d'un rejet. Deux modes dans la même modale :
 * - Correct (à l'ouverture) : tous les champs en cause réunis en un seul bloc,
 *   l'un sous l'autre, chacun avec son emplacement. On enchaîne de haut en bas,
 *   sans structure de message à parcourir.
 * - Browse : tout le message, section par section, avec le carrefour des
 *   sections à gauche. Pour aller voir un champ voisin, puis revenir.
 * Resubmit n'est jamais grisé : tant qu'il reste une erreur, il y mène.
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
  /** La ligne du tableau : titre du rejet. */
  reject = input<Reject | null>(null);
  /** Le contenu du message rejeté. */
  record = input<RejectRecord | null>(null);

  closed = output<void>();
  resubmitted = output<string>();

  readonly mode = signal<Mode>('correct');
  readonly browseView = signal<BrowseView>('filled');
  /** Valeurs saisies, par numéro de champ. */
  readonly values = signal<Record<number, string>>({});
  readonly activeSection = signal<string | null>(null);

  /** Correct : la modale prend la hauteur de ses quelques champs. Browse : presque tout l'écran. */
  readonly contentHeight = computed(() => this.mode() === 'browse' ? 'calc(100vh - 240px)' : 'auto');

  constructor() {
    // Chaque ouverture repart des valeurs reçues, en mode correction
    effect(() => {
      const rec = this.record();
      if (!this.open() || !rec) return;
      const init: Record<number, string> = {};
      for (const f of this.allFields()) init[f.n] = f.value;
      this.values.set(init);
      this.mode.set('correct');
      this.browseView.set('filled');
      this.activeSection.set(null);
    });

    // La section active reste visible dans le carrefour
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

  /** Les champs en cause, dans l'ordre du message, avec leur emplacement. */
  readonly errors = computed<ErrorItem[]>(() =>
    (this.record()?.blocks ?? []).flatMap(b => b.sections.flatMap(s =>
      s.fields.filter(f => f.error).map(field => ({ field, where: `${b.name} › ${s.name}` })))));

  readonly openCount = computed(() => this.errors().filter(e => this.isOpenError(e.field)).length);
  readonly counterLabel = computed(() => {
    const n = this.openCount();
    return n === 0 ? 'All corrected' : `${n} to correct`;
  });

  /** Identité du message sur une ligne, sous le titre. */
  readonly identity = computed(() => {
    const m = this.record()?.meta ?? {};
    return [
      m['EHBU'],
      m['Provider ID'] && `Provider ${m['Provider ID']}`,
      m['Date'],
      m['Country'],
      m['Identifier type'] && `${m['Identifier type']} ${m['Identifier value'] ?? ''}`.trim(),
    ].filter(Boolean).join(' · ');
  });

  setValue(n: number, value: string): void {
    this.values.update(v => ({ ...v, [n]: value }));
  }

  // ── Mode consultation ────────────────────────────────────────────────────
  readonly filledCount = computed(() => this.allFields().filter(f => (this.values()[f.n] ?? '').trim() !== '').length);

  readonly browseOptions = computed<SegmentedOption[]>(() => [
    { value: 'filled', label: `Filled fields (${this.filledCount()})` },
    { value: 'all',    label: `All fields (${this.allFields().length})` },
  ]);

  setBrowseView(v: string): void {
    this.browseView.set(v === 'all' ? 'all' : 'filled');
  }

  browse(): void {
    this.mode.set('browse');
    this.activeSection.set(null);
  }

  backToCorrections(): void {
    this.mode.set('correct');
  }

  readonly sections = computed<ShownSection[]>(() => {
    const all = this.browseView() === 'all';
    const out: ShownSection[] = [];
    (this.record()?.blocks ?? []).forEach((b, bi) => b.sections.forEach((s, si) => {
      const kept = all ? s.fields : s.fields.filter(f => !!f.error || (this.values()[f.n] ?? '').trim() !== '');
      if (kept.length) out.push({ key: `${bi}-${si}`, block: b.name, name: s.name, fields: kept });
    }));
    return out;
  });

  /** Carrefour : toutes les sections ; une section sans champ renseigné bascule la vue sur All. */
  readonly rail = computed(() => (this.record()?.blocks ?? []).map((b, bi) => ({
    name: b.name,
    sections: b.sections.map((s, si) => ({
      key: `${bi}-${si}`,
      name: s.name,
      open: s.fields.filter(f => this.isOpenError(f)).length,
    })),
  })));

  goToSection(key: string): void {
    if (!this.sections().some(s => s.key === key)) this.browseView.set('all');
    this.activeSection.set(key);
    setTimeout(() => {
      const sec = this.el(`#rc-sec-${key}`);
      if (sec) this.scrollMain(sec.offsetTop);
    });
  }

  /** Les champs longs prennent deux colonnes : un libellé ne passe jamais sur deux lignes. */
  isWide(f: RejectField): boolean {
    return f.label.length > 30 || f.length >= 70;
  }

  // Défilement piloté par une ancre : la surbrillance automatique se tait le temps de l'animation
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

  /** Au défilement, le carrefour surligne la section dont le titre a atteint le haut. */
  onScroll(event: Event): void {
    if (this.steering) return;
    const main = event.target as HTMLElement;
    const gap = parseFloat(getComputedStyle(main).rowGap) || 0;
    const line = main.getBoundingClientRect().top + gap;
    let current: string | null = null;
    for (const sec of Array.from(main.querySelectorAll<HTMLElement>('.rc__section'))) {
      if (sec.getBoundingClientRect().top <= line) current = sec.id.replace('rc-sec-', '');
      else break;
    }
    if (current) this.activeSection.set(current);
  }

  // ── Fin ──────────────────────────────────────────────────────────────────
  /** Jamais grisé : tant qu'il reste une erreur, Resubmit y ramène. */
  resubmit(): void {
    const left = this.errors().find(e => this.isOpenError(e.field));
    if (left) {
      this.toaster.show(`${this.counterLabel()} before resubmitting`, { tone: 'warning' });
      this.mode.set('correct');
      setTimeout(() => this.el(`#rc-err-${left.field.n} input`)?.focus());
      return;
    }
    this.resubmitted.emit(this.reject()?.id ?? this.record()?.id ?? '');
  }

  private el(selector: string): HTMLElement | null {
    return (this.host.nativeElement as HTMLElement).querySelector(selector);
  }
}
