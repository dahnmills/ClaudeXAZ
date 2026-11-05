import { Component, ElementRef, computed, effect, inject, input, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  ModalComponent,
  ButtonComponent,
  CardComponent,
  IconComponent,
  InputTextComponent,
  ConfirmDialogComponent,
  TooltipDirective,
  SelectComponent,
  LinkComponent,
  BadgeComponent,
  FunctionalNoticeComponent,
  ToasterService,
} from '../../../shared/ui';
import type { SelectOption } from '../../../shared/ui/select/select.component';
import type { RejectField, RejectRecord, RejectResolution, RejectStepStub } from '../reject-record.model';
import type { Reject } from '../reject-management.data';
import { REGION_DATAREF } from '../reject-cases.data';

/** Carrefour, vue spéciale des erreurs, ou un bloc du message (son index). */
type Screen = 'hub' | 'errors' | number;

/** Un champ en cause, avec l'endroit du message d'où il vient. */
interface ErrorItem {
  field: RejectField;
  where: string;
}

/** Une sous-section d'un bloc : champs en cause d'abord, puis les renseignés, puis les vides. */
interface BlockSection {
  key: string;
  name: string;
  fields: RejectField[];
}

/**
 * Correction d'un rejet, par un écran carrefour :
 * - en tête, la carte « Errors » réunit toutes les erreurs du message, toutes
 *   catégories confondues, pour les traiter d'une traite ;
 * - dessous, une carte par bloc du message, pour travailler un bloc dans son
 *   contexte ; Back ramène au carrefour.
 * Le carrefour se met à jour à chaque correction. Resubmit n'est jamais grisé :
 * avec des erreurs non corrigées, il demande confirmation. Delete passe la main
 * à la page, qui confirme.
 *
 * Quand le rejet a une résolution (retour métier du 2026-11-04), le carrefour
 * l'explique en tête : la raison en mots simples, la cause probable, les étapes
 * et l'action suggérée, mise en avant dans le footer. Seuls les champs listés
 * dans `fieldsToCorrect` se corrigent ; les autres champs en cause restent en
 * rouge, en lecture seule. Les champs barrés par le métier (`notUsed`) sont masqués.
 */
@Component({
  selector: 'rm-reject-correction-modal',
  standalone: true,
  imports: [NgTemplateOutlet, ModalComponent, ButtonComponent, CardComponent, IconComponent, InputTextComponent,
    ConfirmDialogComponent, TooltipDirective, SelectComponent, LinkComponent, BadgeComponent, FunctionalNoticeComponent],
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
  /** Comment sortir du rejet, quand on le sait. */
  resolution = input<RejectResolution | null>(null);
  /** Une popin de la page (confirmation de Delete) passe devant : la modale s'efface. */
  suspended = input<boolean>(false);

  closed = output<void>();
  resubmitted = output<string>();
  deleteRequested = output<string>();

  readonly screen = signal<Screen>('hub');
  /** Valeurs saisies, par numéro de champ. */
  readonly values = signal<Record<number, string>>({});

  /** Même hauteur que le wizard de création de société, sur tous les écrans : la modale ne saute pas. */
  readonly contentHeight = '520px';

  constructor() {
    // Chaque ouverture repart des valeurs reçues, sur le carrefour
    effect(() => {
      const rec = this.record();
      if (!this.open() || !rec) return;
      const init: Record<number, string> = {};
      for (const f of this.allFields()) init[f.n] = f.value;
      this.values.set(init);
      this.screen.set('hub');
      this.confirmOpen.set(false);
      this.stubOpen.set(null);
      this.doneSteps.set(new Set());
    });
  }

  // ── Champs et erreurs ────────────────────────────────────────────────────
  readonly allFields = computed(() =>
    (this.record()?.blocks ?? []).flatMap(b => b.sections.flatMap(s => s.fields)));

  /** Champs barrés par le métier : plus utilisés dans Qirin, ils ne s'affichent pas. */
  readonly hiddenCount = computed(() => this.allFields().filter(f => f.notUsed).length);

  /** Sans résolution connue, tout champ en cause se corrige dans le rejet. */
  isEditable(f: RejectField): boolean {
    const list = this.resolution()?.fieldsToCorrect;
    return !f.error || !list || list.includes(f.n);
  }

  /** En rouge : à corriger tant que la valeur n'a pas changé ; en lecture
   *  seule, la cause se règle ailleurs et le champ reste en rouge. */
  isShownInError(f: RejectField): boolean {
    if (!f.error) return false;
    if (this.isEditable(f)) return this.isOpenError(f);
    // Champ de contexte (le pays d'une région) : il s'éteint avec la correction
    return this.resolution()?.kind !== 'correct-and-resubmit' || this.openCount() > 0;
  }

  /** Un champ en cause est corrigé dès que sa valeur change et n'est pas vide. */
  isOpenError(f: RejectField): boolean {
    if (!f.error || !this.isEditable(f)) return false;
    const v = (this.values()[f.n] ?? '').trim();
    return v === '' || v === f.value.trim();
  }

  private isFilled(f: RejectField): boolean {
    return (this.values()[f.n] ?? '').trim() !== '';
  }

  /** Les champs en cause, dans l'ordre du message, avec leur emplacement. */
  readonly errors = computed<ErrorItem[]>(() =>
    (this.record()?.blocks ?? []).flatMap(b => b.sections.flatMap(s =>
      s.fields.filter(f => f.error && !f.notUsed).map(field => ({ field, where: `${b.name} › ${s.name}` })))));

  /** Vue Errors : les erreurs groupées par emplacement, une famille par sous-section. */
  readonly errorGroups = computed(() => {
    const groups: { where: string; items: ErrorItem[] }[] = [];
    for (const e of this.errors()) {
      const last = groups.at(-1);
      if (last?.where === e.where) last.items.push(e);
      else groups.push({ where: e.where, items: [e] });
    }
    return groups;
  });

  readonly openCount = computed(() => this.errors().filter(e => this.isOpenError(e.field)).length);

  /** Des champs en cause à corriger ici ? Sinon la carte les montre en lecture seule. */
  readonly hasEditableErrors = computed(() => this.errors().some(e => this.isEditable(e.field)));

  /** Libellé du lien vers les champs à corriger : « Go to the Region field ». */
  readonly goToFieldsLabel = computed(() => {
    const editable = this.errors().filter(e => this.isEditable(e.field));
    return editable.length === 1 ? `Go to the ${editable[0].field.label} field` : 'Go to the fields';
  });

  readonly causeLabel = computed(() => {
    const n = this.errors().length;
    return `${n} ${n === 1 ? 'field' : 'fields'} in cause, read only`;
  });

  errorsLabel(n: number): string {
    return `${n} ${n === 1 ? 'error' : 'errors'} to correct`;
  }

  /** Nom technique du champ, dans l'infobulle du « i » à côté du libellé. */
  techInfo(f: RejectField): string {
    const tech = f.tech && f.tech !== '-' ? ` · ${f.tech}` : '';
    return `#${f.n}${tech} · max ${f.length}`;
  }

  setValue(n: number, value: string): void {
    this.values.update(v => ({ ...v, [n]: value }));
  }

  /** Codes du dataref Qirin pour le pays du rejet. */
  datarefOptions(f: RejectField): SelectOption[] {
    if (f.dataref !== 'region') return [];
    const country = this.record()?.meta['Country'] ?? '';
    return (REGION_DATAREF[country] ?? []).map(o => ({ value: o.code, label: `${o.code} (${o.name})` }));
  }

  /** Valeur à prendre dans le dataref : on choisit dans la liste, on ne tape pas. */
  isChoice(f: RejectField): boolean {
    return this.isEditable(f) && this.datarefOptions(f).length > 0;
  }

  // ── Carrefour ────────────────────────────────────────────────────────────
  /** Une carte par bloc du message, avec ce qu'il reste à y corriger ; un bloc
   *  entièrement barré disparaît. */
  readonly blockCards = computed(() => (this.record()?.blocks ?? []).map((b, index) => {
    const fields = b.sections.flatMap(s => s.fields).filter(f => !f.notUsed);
    return {
      index,
      name: b.name,
      open: fields.filter(f => this.isOpenError(f)).length,
      filled: fields.filter(f => this.isFilled(f)).length,
      total: fields.length,
    };
  }).filter(c => c.total > 0));

  /** En entrant dans un bloc, la vue descend jusqu'à sa première erreur restante. */
  go(screen: Screen): void {
    this.screen.set(screen);
    setTimeout(() => {
      this.el('ds-modal-content')?.scrollTo({ top: 0 });
      this.el('.rc__panel')?.scrollTo({ top: 0 });
      if (typeof screen !== 'number') return;
      const first = this.record()?.blocks[screen]?.sections.flatMap(s => s.fields)
        .find(f => !f.notUsed && this.isOpenError(f));
      if (first) this.el(`#rc-field-${first.n}`)?.scrollIntoView({ block: 'center' });
    });
  }

  /** Titre de l'écran courant, à côté du retour au carrefour. */
  readonly screenTitle = computed(() => {
    const s = this.screen();
    if (s === 'errors') return 'Errors';
    if (typeof s === 'number') return this.record()?.blocks[s]?.name ?? '';
    return '';
  });

  // ── Un bloc ──────────────────────────────────────────────────────────────
  readonly blockSections = computed<BlockSection[]>(() => {
    const s = this.screen();
    if (typeof s !== 'number') return [];
    const block = this.record()?.blocks[s];
    return (block?.sections ?? []).map((sec, si) => {
      const key = `${s}-${si}`;
      const used = sec.fields.filter(f => !f.notUsed);
      const atFault = used.filter(f => f.error);
      const filled = used.filter(f => !f.error && this.isFilled(f));
      const empty = used.filter(f => !f.error && !this.isFilled(f));
      return {
        key,
        name: sec.name,
        fields: [...atFault, ...filled, ...empty],
      };
    }).filter(sec => sec.fields.length > 0);
  });

  /** Les champs longs prennent deux colonnes : un libellé ne passe jamais sur deux lignes. */
  isWide(f: RejectField): boolean {
    return f.label.length > 30 || f.length >= 70;
  }

  // ── Résolution ───────────────────────────────────────────────────────────
  /** Delete suggéré : il passe en action principale du footer. */
  /** Toujours une résolution à montrer : à défaut de cas connu, corriger les champs puis resoumettre. */
  readonly effective = computed<RejectResolution>(() => this.resolution() ?? {
    kind: 'correct-and-resubmit',
    reason: this.errors().length === 1 ? 'One field was rejected.' : `${this.errors().length} fields were rejected.`,
    steps: [{ text: 'Correct the fields in error.', goToFields: true }, { text: 'Resubmit.' }],
  });

  readonly suggestsDelete = computed(() => this.resolution()?.kind === 'delete');

  readonly suggestedLabel = computed(() => {
    switch (this.effective().kind) {
      case 'delete':               return 'Suggested: Delete';
      case 'resubmit-as-is':       return 'Suggested: Resubmit as is';
      case 'correct-and-resubmit': return 'Suggested: Correct, then Resubmit';
      default:                     return '';
    }
  });

  /** Le renvoi tel quel se dit sur le bouton. */
  readonly resubmitLabel = computed(() =>
    this.resolution()?.kind === 'resubmit-as-is' ? 'Resubmit as is' : 'Resubmit');

  /** Étapes faites hors du rejet (simulées dans le prototype), par index. */
  readonly doneSteps = signal<Set<number>>(new Set());
  readonly stubOpen = signal<{ index: number; stub: RejectStepStub } | null>(null);

  confirmStub(): void {
    const open = this.stubOpen();
    if (!open) return;
    this.doneSteps.update(set => new Set(set).add(open.index));
    this.stubOpen.set(null);
    this.toaster.show(open.stub.done, { tone: 'success' });
  }

  /** L'étape se fait dans le rejet : la vue Errors, focus sur le premier champ à corriger. */
  goToFields(): void {
    this.go('errors');
    const first = this.errors().find(e => this.isOpenError(e.field));
    if (!first) return;
    setTimeout(() => this.el(`#rc-err-${first.field.n} input, #rc-err-${first.field.n} button`)?.focus());
  }

  // ── Fin ──────────────────────────────────────────────────────────────────
  /** Confirmation d'un renvoi avec des champs en erreur laissés tels quels. */
  readonly confirmOpen = signal(false);

  /** Renvoyer sans rien corriger reste possible (la cause a pu être réglée en
   *  amont, comme pour Resubmit depuis le tableau) : on confirme seulement. Un
   *  champ en lecture seule ne compte pas : sa cause se règle hors du rejet. */
  resubmit(): void {
    if (this.openCount() > 0) {
      this.confirmOpen.set(true);
      return;
    }
    this.confirmResubmit();
  }

  confirmResubmit(): void {
    this.confirmOpen.set(false);
    this.resubmitted.emit(this.rejectId());
  }

  /** La suppression se confirme dans la page, qui ferme la modale ensuite. */
  requestDelete(): void {
    this.deleteRequested.emit(this.rejectId());
  }

  private rejectId(): string {
    return this.reject()?.id ?? this.record()?.id ?? '';
  }

  private el(selector: string): HTMLElement | null {
    return (this.host.nativeElement as HTMLElement).querySelector(selector);
  }
}
