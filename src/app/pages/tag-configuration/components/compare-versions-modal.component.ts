import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { SelectComponent, SelectOption } from '../../../shared/ui/select/select.component';
import { PieChartComponent, PieChartSegment } from '../../../shared/ui/pie-chart/pie-chart.component';
import { RuleSetVersion } from '../tag-configuration.models';
import * as F from '../criteria-format';

interface DiffField { label: string; oldValue: string; newValue: string; changed: boolean; }
interface DiffRow {
  position: number;
  /** A rule with no match in "from" is brand new — its own highlight tone, no per-field diff. */
  isNew: boolean;
  fields: DiffField[];
  oldPct: string;
  newPct: string;
  badgeChanged: boolean;
}

/**
 * Compare rule versions (BN AZTQIRIN-56240 "Compare version" button) — picks
 * two rule-set snapshots (past validated versions, or the live draft) and
 * diffs volume stats + every rule field. No real backend: versions are
 * mocked per country (tag-configuration.data.ts), and "Validate" is a toast,
 * not a persisted publish.
 */
@Component({
  selector: 'tag-compare-versions-modal',
  standalone: true,
  imports: [ModalComponent, ButtonComponent, CardComponent, IconComponent, SelectComponent, PieChartComponent],
  templateUrl: './compare-versions-modal.component.html',
  styleUrl: './compare-versions-modal.component.scss',
})
export class CompareVersionsModalComponent {
  open         = input<boolean>(false);
  versions     = input.required<RuleSetVersion[]>();
  currentDraft = input.required<RuleSetVersion>();
  currency     = input<string>('EUR');
  /** Only the end-of-edit "Validate rules" flow may publish — a comparison opened
   * from the read-only view (just consulting history) must not offer to validate. */
  allowValidate = input<boolean>(false);

  closed            = output<void>();
  editRequested     = output<void>();
  validateRequested = output<void>();

  fromId = signal('');
  toId   = signal('');

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const all = this.allVersions();
      if (all.length < 2) return;
      this.fromId.set(all[all.length - 2].id);
      this.toId.set(all[all.length - 1].id);
    });
  }

  allVersions = computed<RuleSetVersion[]>(() => [...this.versions(), this.currentDraft()]);

  allOptions = computed<SelectOption[]>(() => this.allVersions().map(v => ({ value: v.id, label: v.label })));

  fromVersion = computed(() => this.allVersions().find(v => v.id === this.fromId()) ?? null);
  toVersion   = computed(() => this.allVersions().find(v => v.id === this.toId()) ?? null);

  /** Validating publishes the live draft — only offered when opened from the edit flow AND "to" IS the draft (not two past versions being consulted). */
  canValidate = computed(() => this.allowValidate() && this.toId() === this.currentDraft().id);

  private field(label: string, oldV: string, newV: string): DiffField {
    return { label, oldValue: oldV, newValue: newV, changed: oldV !== newV };
  }

  /** Only the fields that actually changed are shown — an unmodified rule shows nothing per Figma. */
  diffRows = computed<DiffRow[]>(() => {
    const from = this.fromVersion();
    const to = this.toVersion();
    if (!from || !to) return [];
    const currency = this.currency();

    return to.rules.map(newRule => {
      const oldRule = from.rules.find(r => r.id === newRule.id);
      const isNew = !oldRule;
      const oldC = oldRule?.criteria;
      const c = newRule.criteria;

      const candidates: [string, string | undefined, string][] = [
        ['Sensitivity', oldC && F.fmtList(oldC.sensitivity), F.fmtList(c.sensitivity)],
        ['Exposure', oldC && F.fmtExposure(oldC.exposure, currency), F.fmtExposure(c.exposure, currency)],
        ['New Auto Grade', oldC && F.fmtList(oldC.newAutoGrade), F.fmtList(c.newAutoGrade)],
        ['Current valid grade', oldC && F.fmtList(oldC.cvgValue), F.fmtList(c.cvgValue)],
        ['Current valid grade type', oldC && F.fmtList(oldC.cvgType), F.fmtList(c.cvgType)],
        ['Current valid grade freshness', oldC && F.fmtFreshness(oldC.cvgFreshness), F.fmtFreshness(c.cvgFreshness)],
        ['Transferred', oldC && F.fmtTransferred(oldC.transferred), F.fmtTransferred(c.transferred)],
        ['New AG vs current valid grade', oldC && F.fmtComparison(oldC.newVsCvg), F.fmtComparison(c.newVsCvg)],
        ['Last checked autograde', oldC && F.fmtList(oldC.lastAgValue), F.fmtList(c.lastAgValue)],
        ['Last checked autograde freshness', oldC && F.fmtFreshness(oldC.lastAgFreshness), F.fmtFreshness(c.lastAgFreshness)],
        ['New AG vs last checked autograde', oldC && F.fmtComparison(oldC.newVsLastAg), F.fmtComparison(c.newVsLastAg)],
        ['NACE', oldC && F.fmtList(oldC.nace), F.fmtList(c.nace)],
        ['Legal form', oldC && F.fmtList(oldC.legalForm), F.fmtList(c.legalForm)],
        ['Company role', oldC && F.fmtList(oldC.companyRole), F.fmtList(c.companyRole)],
        ['Outcome', oldRule?.decision, newRule.decision],
      ];
      const fields: DiffField[] = isNew
        ? candidates.filter(([, , newV]) => newV !== 'Any').map(([label, , newV]) => this.field(label, '', newV))
        : candidates.filter(([, oldV, newV]) => oldV !== newV).map(([label, oldV, newV]) => this.field(label, oldV!, newV));

      const oldPct = `${from.accepted.pct.toFixed(2)}%`;
      const newPct = `${to.accepted.pct.toFixed(2)}%`;
      return {
        position: newRule.position,
        isNew,
        fields,
        oldPct, newPct,
        badgeChanged: oldPct !== newPct,
      };
    });
  });

  donutSegments = computed<PieChartSegment[]>(() => {
    const from = this.fromVersion();
    const to = this.toVersion();
    if (!to) return [];
    const delta = (label: string, statTo: { pct: number }, statFrom?: { pct: number }) =>
      statFrom ? `${statFrom.pct.toFixed(2)}% → ${statTo.pct.toFixed(2)}%` : `${statTo.pct.toFixed(2)}%`;

    return [
      { label: '% JTDs',     value: to.jtd.pct,      tone: 'negative', tooltip: delta('% JTDs', to.jtd, from?.jtd) },
      { label: '% Accepted', value: to.accepted.pct, tone: 'warning',  tooltip: delta('% Accepted', to.accepted, from?.accepted) },
      { label: '% Refused',  value: to.refused.pct,  tone: 'brand',    tooltip: delta('% Refused', to.refused, from?.refused) },
    ];
  });
}
