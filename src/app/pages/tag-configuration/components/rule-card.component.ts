import { Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { ButtonIconComponent } from '../../../shared/ui/button-icon/button-icon.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { FlyoutMenuComponent } from '../../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../../shared/ui/flyout-menu/flyout-menu-item.component';
import { PropertiesPanelComponent, PropertyRow, PropertySection } from '../../../shared/ui/properties-panel/properties-panel.component';
import { TagRule, DECISION_BADGE } from '../tag-configuration.models';
import * as F from '../criteria-format';

interface SummaryField { label: string; value: string; isAny: boolean; }

/**
 * Rule card: collapsible row for one auto-grading rule (P4 list).
 * Header always renders 7 fill-width columns (Sensitivity, Exposure, New
 * autograde, Last checked autograde, Current valid grade, Valid grade type,
 * Valid grade freshness) matching the BN's order-of-importance, label above
 * / bold value below. An "Any" value is muted (isAny flag) so it doesn't
 * compete with rules that actually constrain that criterion. Body (expanded)
 * adds the remaining criteria the same way.
 *
 * `mode="view"` (read-only, default page state): decision badge and chevron
 * only: no drag handle, no 3-dot menu, nothing editable.
 * `mode="edit"` (after "Edit rules"): drag handle for reorder, 3-dot menu
 * (Edit/Move/Delete).
 */
@Component({
  selector: 'tag-rule-card',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonIconComponent, IconComponent, FlyoutMenuComponent, FlyoutMenuItemComponent, PropertiesPanelComponent],
  templateUrl: './rule-card.component.html',
  styleUrl: './rule-card.component.scss',
})
export class RuleCardComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  rule     = input.required<TagRule>();
  currency = input<string>('EUR');
  expanded = input<boolean>(false);
  mode     = input<'view' | 'edit'>('view');
  /** Formes juridiques du pays courant. Une forme absente de cette liste vient
   *  d'un set copié d'un autre pays : on la garde (la retirer élargirait la
   *  règle) mais on la signale. Liste vide = pas de contrôle. */
  knownLegalForms = input<string[]>([]);
  /** Bornes du déplacement, calculées par la page sur la liste **affichée** : une
   *  entrée de menu qui ne peut rien faire se grise plutôt que de sortir en
   *  silence. */
  canMoveUp   = input<boolean>(true);
  canMoveDown = input<boolean>(true);

  edit     = output<void>();
  remove   = output<void>();
  moveUp   = output<void>();
  moveDown = output<void>();
  toggled  = output<void>();

  menuOpen = signal(false);

  decisionBadge = computed(() => DECISION_BADGE[this.rule().decision]);
  c = computed(() => this.rule().criteria);

  summaryRows = computed<SummaryField[]>(() => {
    const c = this.c();
    const row = (label: string, value: string, isAny: boolean): SummaryField => ({ label, value, isAny });
    return [
      row('Sensitivity',            F.fmtList(c.sensitivity),                              F.isAny(c.sensitivity)),
      row('Exposure',               F.fmtExposure(c.exposure, c.exposure?.currency ?? this.currency()), F.isAny(c.exposure)),
      row('New autograde',          F.fmtList(c.newAutoGrade),                              F.isAny(c.newAutoGrade)),
      row('Last checked autograde', F.fmtList(c.lastAgValue),                               F.isAny(c.lastAgValue)),
      row('Current valid grade',    F.fmtList(c.cvgValue),                                  F.isAny(c.cvgValue)),
      row('Valid grade type',       F.fmtList(c.cvgType),                                   F.isAny(c.cvgType)),
      row('Valid grade freshness',  F.fmtFreshness(c.cvgFreshness),                         F.isAny(c.cvgFreshness)),
    ];
  });

  // An explicit aria-label on the row overrides its accessible name entirely.
  // Without this, screen-reader users would hear only "Rule N, button" and
  // none of the actual criteria/decision/status the row displays.
  ariaLabel = computed(() => {
    const rows = this.summaryRows().map(r => `${r.label}: ${r.value}`).join(', ');
    return `Rule ${this.rule().position}. ${rows}. Decision: ${this.decisionBadge().label}.`;
  });

  /** Formes juridiques étrangères au pays : conservées, marquées. */
  unknownLegalForms = computed<string[]>(() => {
    const known = this.knownLegalForms();
    const forms = this.c().legalForm;
    if (!known.length || !forms?.length) return [];
    return forms.filter(f => !known.includes(f));
  });

  private legalFormRow = computed<PropertyRow>(() => {
    const forms = this.c().legalForm;
    const unknown = this.unknownLegalForms();
    if (!forms?.length) return { label: 'Legal form', value: 'Any', muted: true };
    if (!unknown.length) return { label: 'Legal form', value: forms.join(', ') };
    return {
      label: 'Legal form',
      labelIcon: 'warning-triangle',
      value: {
        kind: 'tags',
        tags: forms.map(f => ({ label: f, tone: unknown.includes(f) ? 'warning' as const : 'neutral' as const })),
      },
    };
  });

  /**
   * ds-properties-panel maps each section to one grid column (see admin-data
   * usage): 3 sections side by side matching the create/edit modal's own
   * card groups (Current valid grade / Last checked autograde / Other). Type
   * and Freshness for the current valid grade now live in the header summary
   * (promoted there), so this section doesn't repeat them.
   */
  detailSections = computed<PropertySection[]>(() => {
    const c = this.c();
    // `muted` reprend, en vue dépliée, l'atténuation déjà appliquée dans
    // l'en-tête replié : un « Any » n'est pas une valeur posée.
    return [
      { title: 'Current valid grade', rows: [
        { label: 'Transferred',                          value: F.fmtTransferred(c.transferred), muted: F.isAny(c.transferred) },
        { label: 'New autograde vs current valid grade', value: F.fmtComparison(c.newVsCvg),     muted: F.isAny(c.newVsCvg) },
      ] },
      { title: 'Last checked autograde', rows: [
        { label: 'Freshness',                                value: F.fmtFreshness(c.lastAgFreshness), muted: F.isAny(c.lastAgFreshness) },
        { label: 'New autograde vs last checked autograde',  value: F.fmtComparison(c.newVsLastAg),    muted: F.isAny(c.newVsLastAg) },
      ] },
      { title: 'Other', rows: [
        { label: 'NACE',         value: F.fmtList(c.nace),        muted: F.isAny(c.nace) },
        this.legalFormRow(),
        { label: 'Company role', value: F.fmtList(c.companyRole), muted: F.isAny(c.companyRole) },
      ] },
    ];
  });

  toggle(): void { this.toggled.emit(); }

  toggleMenu(): void { this.menuOpen.update(o => !o); }

  onEdit(): void { this.menuOpen.set(false); this.edit.emit(); }
  onMoveUp(): void { this.menuOpen.set(false); this.moveUp.emit(); }
  onMoveDown(): void { this.menuOpen.set(false); this.moveDown.emit(); }
  onRemove(): void { this.menuOpen.set(false); this.remove.emit(); }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) return;
    const target = event.target as Node | null;
    if (target && this.hostRef.nativeElement.contains(target)) return;
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOpen()) this.menuOpen.set(false);
  }
}
