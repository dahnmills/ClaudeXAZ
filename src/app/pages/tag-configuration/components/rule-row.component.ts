import { Component, computed, input, output } from '@angular/core';
import { CardComponent }           from '../../../shared/ui/card/card.component';
import { BadgeComponent }          from '../../../shared/ui/badge/badge.component';
import { IconComponent }           from '../../../shared/ui/icon/icon.component';
import { CellActionComponent }     from '../../../shared/ui/table/cell-action.component';
import { FlyoutMenuComponent }     from '../../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../../shared/ui/flyout-menu/flyout-menu-item.component';
import { TagRule, TagFreshness, FreshnessConfig, DECISION_BADGE } from '../tag-configuration.models';

const FRESHNESS_LABEL: Record<TagFreshness, string> = { fresh: 'FRESH', outdated: 'OUTDATED', old: 'OLD' };

interface Crit { label: string; value: string; active: boolean; }

@Component({
  selector: 'tag-rule-row',
  standalone: true,
  imports: [
    CardComponent, BadgeComponent, IconComponent,
    CellActionComponent, FlyoutMenuComponent, FlyoutMenuItemComponent,
  ],
  templateUrl: './rule-row.component.html',
  styleUrl:    './rule-row.component.scss',
})
export class RuleRowComponent {
  rule       = input.required<TagRule>();
  expanded   = input<boolean>(false);   // expanded = the "Any" criteria breakdown is shown
  freshness  = input.required<FreshnessConfig>();
  totalRules = input<number>(1);
  editMode   = input<boolean>(false);

  editClicked    = output<void>();
  deleteClicked  = output<void>();
  duplicate      = output<void>();
  toggleExpand   = output<void>();
  positionChange = output<number>();

  badge   = computed(() => DECISION_BADGE[this.rule().decision]);
  isFirst = computed(() => this.rule().position <= 1);
  isLast  = computed(() => this.rule().position >= this.totalRules());

  private freshVal(f: TagFreshness | null, kind: 'lastVerified' | 'manualGrade'): string {
    if (!f) return 'Any';
    const cfg = this.freshness()[kind];
    const bound = f === 'fresh' ? `≤ ${cfg.freshMonths}m`
                : f === 'outdated' ? `${cfg.freshMonths + 1}–${cfg.outdatedMonths}m`
                : `> ${cfg.outdatedMonths}m`;
    return `${FRESHNESS_LABEL[f]} · ${bound}`;
  }

  private j(v: string[] | null): string { return v?.join(', ') ?? 'Any'; }

  private exposure(): string {
    const c = this.rule().criteria;
    const fmt = (n: number) => n.toLocaleString('en-US');
    if (c.exposureMin !== null && c.exposureMax !== null) return `${fmt(c.exposureMin)} – ${fmt(c.exposureMax)} €`;
    if (c.exposureMin !== null) return `> ${fmt(c.exposureMin)} €`;
    if (c.exposureMax !== null) return `≤ ${fmt(c.exposureMax)} €`;
    return 'Any';
  }

  /**
   * The 14 criteria as one flat list. Labels carry their group inline
   * ("Valid grade · Freshness" vs "Last AG · Freshness") so a cell reads
   * unambiguously without a full-width group band eating vertical space.
   */
  private allCrits = computed<Crit[]>(() => {
    const c = this.rule().criteria;
    return [
      { label: 'Sensitivity',            value: this.j(c.sensitivity),                                                      active: !!c.sensitivity },
      { label: 'Exposure',               value: this.exposure(),                                                            active: c.exposureMin !== null || c.exposureMax !== null },
      { label: 'New autograde',          value: c.newAutograde?.join(', ') ?? 'Any',                                        active: !!c.newAutograde },
      { label: 'Valid grade · Value',    value: this.j(c.validValue),                                                       active: !!c.validValue },
      { label: 'Valid grade · Type',     value: this.j(c.validType),                                                        active: !!c.validType },
      { label: 'Valid grade · Freshness',value: this.freshVal(c.validFreshness, 'manualGrade'),                             active: !!c.validFreshness },
      { label: 'Valid grade · Transferred', value: c.validTransferred === null ? 'Any' : (c.validTransferred ? 'Yes' : 'No'), active: c.validTransferred !== null },
      { label: 'Valid grade · vs New AG',value: c.validVsNew ?? 'Any',                                                      active: !!c.validVsNew },
      { label: 'Last AG · Value',        value: this.j(c.lastAgValue),                                                      active: !!c.lastAgValue },
      { label: 'Last AG · Freshness',    value: this.freshVal(c.lastAgFreshness, 'lastVerified'),                           active: !!c.lastAgFreshness },
      { label: 'Last AG · vs New AG',    value: c.lastAgVsNew ?? 'Any',                                                     active: !!c.lastAgVsNew },
      { label: 'NACE',                   value: this.j(c.nace),                                                             active: !!c.nace },
      { label: 'Legal form',             value: this.j(c.legalForm),                                                        active: !!c.legalForm },
      { label: 'Role',                   value: this.j(c.role),                                                             active: !!c.role },
    ];
  });

  activeCrits   = computed(() => this.allCrits().filter(c => c.active));
  inactiveCrits = computed(() => this.allCrits().filter(c => !c.active));
  inactiveCount = computed(() => this.inactiveCrits().length);
  hasActive     = computed(() => this.activeCrits().length > 0);

  moveUp(): void   { this.positionChange.emit(this.rule().position - 1); }
  moveDown(): void { this.positionChange.emit(this.rule().position + 1); }

  onPositionInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const n = parseInt(input.value, 10);
    if (Number.isNaN(n)) { input.value = String(this.rule().position); return; }
    this.positionChange.emit(n);
    queueMicrotask(() => { input.value = String(this.rule().position); });
  }
}
