import { Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ButtonIconComponent } from '../../../shared/ui/button-icon/button-icon.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { FlyoutMenuComponent } from '../../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../../shared/ui/flyout-menu/flyout-menu-item.component';
import { TagRule, DECISION_BADGE } from '../tag-configuration.models';
import * as F from '../criteria-format';

/**
 * Rule card — collapsible card for one auto-grading rule (P4 list).
 * Header always visible: position, active-criteria summary, decision badge, ⋯ menu, chevron.
 * Body (shown when expanded) renders 4 criteria groups: Core / Current valid grade (blue) /
 * Last checked autograde (orange) / Other (grey, collapsible when all "Any").
 */
@Component({
  selector: 'tag-rule-card',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonComponent, ButtonIconComponent, IconComponent, FlyoutMenuComponent, FlyoutMenuItemComponent],
  templateUrl: './rule-card.component.html',
  styleUrl: './rule-card.component.scss',
})
export class RuleCardComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  rule     = input.required<TagRule>();
  currency = input<string>('EUR');
  expanded = input<boolean>(false);

  edit     = output<void>();
  remove   = output<void>();
  moveUp   = output<void>();
  moveDown = output<void>();
  toggled  = output<void>();

  menuOpen  = signal(false);
  otherOpen = signal(false);

  badge = computed(() => DECISION_BADGE[this.rule().decision]);
  c     = computed(() => this.rule().criteria);
  otherCollapsedByDefault = computed(() => F.otherAllAny(this.c()));

  // formatters exposed to template
  fmtList = F.fmtList; fmtFreshness = F.fmtFreshness; fmtComparison = F.fmtComparison;
  fmtTransferred = F.fmtTransferred; isAny = F.isAny;
  fmtExposure(): string { return F.fmtExposure(this.c().exposure, this.currency()); }

  /** Active-criteria summary segments for the collapsed header. */
  summary = computed(() => {
    const c = this.c(); const segs: { label: string; value: string }[] = [];
    if (!F.isAny(c.sensitivity))  segs.push({ label: 'Sensitivity',  value: F.fmtList(c.sensitivity) });
    if (c.exposure)               segs.push({ label: 'Exposure',     value: this.fmtExposure() });
    if (!F.isAny(c.newAutoGrade)) segs.push({ label: 'New autograde',value: F.fmtList(c.newAutoGrade) });
    if (!F.isAny(c.cvgValue))     segs.push({ label: 'CVG Value',    value: F.fmtList(c.cvgValue) });
    if (!F.isAny(c.cvgType))      segs.push({ label: 'CVG Type',     value: F.fmtList(c.cvgType) });
    if (c.cvgFreshness)           segs.push({ label: 'CVG Freshness',value: c.cvgFreshness });
    if (c.transferred != null)    segs.push({ label: 'Transferred',  value: F.fmtTransferred(c.transferred) });
    if (c.newVsCvg)               segs.push({ label: 'New vs CVG',    value: F.fmtComparison(c.newVsCvg) });
    if (!F.isAny(c.lastAgValue))  segs.push({ label: 'Last AG Value',value: F.fmtList(c.lastAgValue) });
    if (c.lastAgFreshness)        segs.push({ label: 'Last AG Freshness', value: c.lastAgFreshness });
    if (c.newVsLastAg)            segs.push({ label: 'New vs Last AG',value: F.fmtComparison(c.newVsLastAg) });
    if (!F.isAny(c.nace))         segs.push({ label: 'NACE',         value: F.fmtList(c.nace) });
    if (!F.isAny(c.legalForm))    segs.push({ label: 'Legal form',   value: F.fmtList(c.legalForm) });
    if (!F.isAny(c.companyRole))  segs.push({ label: 'Company role', value: F.fmtList(c.companyRole) });
    return segs;
  });

  toggle(): void { this.toggled.emit(); }

  toggleMenu(): void { this.menuOpen.update(o => !o); }
  toggleOther(): void { this.otherOpen.update(o => !o); }

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
