import { Component, ElementRef, computed, effect, inject, input, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  ModalComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  IconComponent,
  InputTextComponent,
  ToasterService,
} from '../../../shared/ui';
import type { RejectField, RejectRecord } from '../reject-record.model';
import type { Reject } from '../reject-management.data';

/** Carrefour, vue spéciale des erreurs, ou un bloc du message (son index). */
type Screen = 'hub' | 'errors' | number;

/** Un champ en cause, avec l'endroit du message d'où il vient. */
interface ErrorItem {
  field: RejectField;
  where: string;
}

/** Une sous-section d'un bloc : champs en cause d'abord, puis les renseignés, les vides repliés. */
interface BlockSection {
  key: string;
  name: string;
  fields: RejectField[];
  emptyCount: number;
}

/**
 * Correction d'un rejet, par un écran carrefour :
 * - en tête, la carte « Errors » réunit toutes les erreurs du message, toutes
 *   catégories confondues, pour les traiter d'une traite ;
 * - dessous, une carte par bloc du message, pour travailler un bloc dans son
 *   contexte. Fini, « Next » enchaîne sur le bloc suivant qui a des erreurs, sans
 *   repasser par le carrefour.
 * Le carrefour se met à jour à chaque correction. Resubmit n'est jamais grisé :
 * tant qu'il reste une erreur, il mène à la vue des erreurs.
 */
@Component({
  selector: 'rm-reject-correction-modal',
  standalone: true,
  imports: [NgTemplateOutlet, ModalComponent, BadgeComponent, ButtonComponent, CardComponent, IconComponent, InputTextComponent],
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

  readonly screen = signal<Screen>('hub');
  /** Valeurs saisies, par numéro de champ. */
  readonly values = signal<Record<number, string>>({});
  /** Sous-sections dont les champs vides sont dépliés. */
  readonly expanded = signal<Set<string>>(new Set());

  /** Un bloc complet demande presque tout l'écran ; le carrefour et les erreurs, leur seule hauteur. */
  readonly contentHeight = computed(() => typeof this.screen() === 'number' ? 'calc(100vh - 240px)' : 'auto');

  constructor() {
    // Chaque ouverture repart des valeurs reçues, sur le carrefour
    effect(() => {
      const rec = this.record();
      if (!this.open() || !rec) return;
      const init: Record<number, string> = {};
      for (const f of this.allFields()) init[f.n] = f.value;
      this.values.set(init);
      this.screen.set('hub');
      this.expanded.set(new Set());
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

  private isFilled(f: RejectField): boolean {
    return (this.values()[f.n] ?? '').trim() !== '';
  }

  /** Les champs en cause, dans l'ordre du message, avec leur emplacement. */
  readonly errors = computed<ErrorItem[]>(() =>
    (this.record()?.blocks ?? []).flatMap(b => b.sections.flatMap(s =>
      s.fields.filter(f => f.error).map(field => ({ field, where: `${b.name} › ${s.name}` })))));

  readonly openCount = computed(() => this.errors().filter(e => this.isOpenError(e.field)).length);

  errorsLabel(n: number): string {
    return `${n} ${n === 1 ? 'error' : 'errors'} to correct`;
  }

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

  // ── Carrefour ────────────────────────────────────────────────────────────
  /** Une carte par bloc du message, avec ce qu'il reste à y corriger. */
  readonly blockCards = computed(() => (this.record()?.blocks ?? []).map((b, index) => {
    const fields = b.sections.flatMap(s => s.fields);
    return {
      index,
      name: b.name,
      open: fields.filter(f => this.isOpenError(f)).length,
      filled: fields.filter(f => this.isFilled(f)).length,
      total: fields.length,
    };
  }));

  /** En entrant dans un bloc, la vue descend jusqu'à sa première erreur restante. */
  go(screen: Screen): void {
    this.screen.set(screen);
    this.expanded.set(new Set());
    setTimeout(() => {
      const content = this.el('ds-modal-content');
      content?.scrollTo({ top: 0 });
      if (typeof screen !== 'number') return;
      const first = this.record()?.blocks[screen]?.sections.flatMap(s => s.fields).find(f => this.isOpenError(f));
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
    const open = this.expanded();
    return (block?.sections ?? []).map((sec, si) => {
      const key = `${s}-${si}`;
      const atFault = sec.fields.filter(f => f.error);
      const filled = sec.fields.filter(f => !f.error && this.isFilled(f));
      const empty = sec.fields.filter(f => !f.error && !this.isFilled(f));
      return {
        key,
        name: sec.name,
        fields: open.has(key) ? [...atFault, ...filled, ...empty] : [...atFault, ...filled],
        emptyCount: open.has(key) ? 0 : empty.length,
      };
    });
  });

  showEmpty(key: string): void {
    this.expanded.update(set => new Set(set).add(key));
  }

  /** Bloc suivant qui a encore des erreurs, après le bloc courant. */
  readonly nextBlock = computed(() => {
    const s = this.screen();
    if (typeof s !== 'number') return null;
    const cards = this.blockCards();
    for (let i = 1; i < cards.length; i++) {
      const c = cards[(s + i) % cards.length];
      if (c.open > 0) return c;
    }
    return null;
  });

  /** Les champs longs prennent deux colonnes : un libellé ne passe jamais sur deux lignes. */
  isWide(f: RejectField): boolean {
    return f.label.length > 30 || f.length >= 70;
  }

  // ── Fin ──────────────────────────────────────────────────────────────────
  /** Jamais grisé : tant qu'il reste une erreur, Resubmit mène à la vue des erreurs. */
  resubmit(): void {
    const left = this.errors().find(e => this.isOpenError(e.field));
    if (left) {
      this.toaster.show(`${this.errorsLabel(this.openCount())} before resubmitting`, { tone: 'warning' });
      this.go('errors');
      setTimeout(() => this.el(`#rc-err-${left.field.n} input`)?.focus());
      return;
    }
    this.resubmitted.emit(this.reject()?.id ?? this.record()?.id ?? '');
  }

  private el(selector: string): HTMLElement | null {
    return (this.host.nativeElement as HTMLElement).querySelector(selector);
  }
}
