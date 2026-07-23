import { Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { ButtonIconComponent } from '../../../shared/ui/button-icon/button-icon.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { FlyoutMenuComponent } from '../../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../../shared/ui/flyout-menu/flyout-menu-item.component';
import { PropertiesPanelComponent, PropertySection } from '../../../shared/ui/properties-panel/properties-panel.component';
import { TagRule, DECISION_BADGE } from '../tag-configuration.models';
import * as F from '../criteria-format';

interface SummaryField { label: string; value: string; isAny: boolean; }

/**
 * Rule card — collapsible row for one auto-grading rule (P4 list).
 * Header always renders 6 fixed columns (Sensitivity, Exposure, New
 * autograde, Current valid grade, Last checked autograde, NACE) matching the
 * BN's order-of-importance — label above / bold value below. An "Any" value
 * is muted (isAny flag) so it doesn't compete with rules that actually
 * constrain that criterion. Body (expanded) adds the remaining 8 V2 criteria
 * the same way.
 *
 * `mode="view"` (read-only, default page state): single "Valid"/"N/C" status
 * badge, chevron only — no drag handle, no 3-dot menu, nothing editable.
 * `mode="edit"` (after "Edit rules"): drag handle for reorder, both status +
 * decision affordances, 3-dot menu (Edit/Move/Delete).
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
  /** % of tested volume this rule matched — shown after a "Test rules" run (BN AZTQIRIN-56240). */
  volume   = input<number | null>(null);

  edit     = output<void>();
  remove   = output<void>();
  moveUp   = output<void>();
  moveDown = output<void>();
  toggled  = output<void>();

  menuOpen = signal(false);

  statusBadge = computed(() => this.rule().status === 'Valid'
    ? { label: 'Valid', status: 'info' as const }
    : { label: 'N/C',   status: 'neutral' as const });
  decisionBadge = computed(() => DECISION_BADGE[this.rule().decision]);
  c = computed(() => this.rule().criteria);

  summaryRows = computed<SummaryField[]>(() => {
    const c = this.c();
    const row = (label: string, value: string, isAny: boolean): SummaryField => ({ label, value, isAny });
    return [
      row('Sensitivity',            F.fmtList(c.sensitivity),                              F.isAny(c.sensitivity)),
      row('Exposure',               F.fmtExposure(c.exposure, this.currency()),             F.isAny(c.exposure)),
      row('New autograde',          F.fmtList(c.newAutoGrade),                              F.isAny(c.newAutoGrade)),
      row('Current valid grade',    F.fmtList(c.cvgValue),                                  F.isAny(c.cvgValue)),
      row('Last checked autograde', F.fmtList(c.lastAgValue),                               F.isAny(c.lastAgValue)),
      row('NACE',                   F.fmtList(c.nace),                                      F.isAny(c.nace)),
    ];
  });

  // An explicit aria-label on the row overrides its accessible name entirely —
  // without this, screen-reader users would hear only "Rule N, button" and
  // none of the actual criteria/decision/status the row displays.
  ariaLabel = computed(() => {
    const rows = this.summaryRows().map(r => `${r.label}: ${r.value}`).join(', ');
    return `Rule ${this.rule().position}. ${rows}. Decision: ${this.decisionBadge().label}. Status: ${this.statusBadge().label}.`;
  });

  /**
   * ds-properties-panel maps each section to one grid column (see admin-data
   * usage) — 3 sections side by side matching the create/edit modal's own
   * card groups (Current valid grade / Last checked autograde / Other), so
   * the expanded body stays within roughly the same height as the tallest
   * section (CVG, 4 rows) instead of stacking a 4th block underneath.
   */
  detailSections = computed<PropertySection[]>(() => {
    const c = this.c();
    return [
      { title: 'Current valid grade', rows: [
        { label: 'Type',                            value: F.fmtList(c.cvgType) },
        { label: 'Freshness',                       value: F.fmtFreshness(c.cvgFreshness) },
        { label: 'Transferred',                     value: F.fmtTransferred(c.transferred) },
        { label: 'New autograde vs current valid grade', value: F.fmtComparison(c.newVsCvg) },
      ] },
      { title: 'Last checked autograde', rows: [
        { label: 'Freshness',                                value: F.fmtFreshness(c.lastAgFreshness) },
        { label: 'New autograde vs last checked autograde',  value: F.fmtComparison(c.newVsLastAg) },
      ] },
      { title: 'Other', rows: [
        { label: 'NACE',         value: F.fmtList(c.nace) },
        { label: 'Legal form',   value: F.fmtList(c.legalForm) },
        { label: 'Company role', value: F.fmtList(c.companyRole) },
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
