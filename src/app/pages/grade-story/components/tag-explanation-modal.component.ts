import { Component, computed, input, output } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { PropertiesPanelComponent, PropertySection } from '../../../shared/ui/properties-panel/properties-panel.component';
import { RuleCardComponent } from '../../tag-configuration/components/rule-card.component';
import { GradeStoryEntry } from '../grade-story.models';

/**
 * TAG explanation modal (BN AZTQIRIN-55735) — answers "why did this TAG
 * decision happen": the buyer inputs read at calculation time, and the
 * exact rule that matched them. Two distinct groups per the ticket's UX
 * challenge, stacked (not side-by-side) since the rule card's own 6-column
 * summary already needs full modal width to stay readable.
 */
@Component({
  selector: 'gs-tag-explanation-modal',
  standalone: true,
  imports: [ModalComponent, ButtonComponent, PropertiesPanelComponent, RuleCardComponent],
  templateUrl: './tag-explanation-modal.component.html',
  styleUrl: './tag-explanation-modal.component.scss',
})
export class TagExplanationModalComponent {
  open  = input<boolean>(false);
  entry = input<GradeStoryEntry | null>(null);

  closed = output<void>();

  inputSections = computed<PropertySection[]>(() => {
    const e = this.entry();
    if (!e) return [];
    const i = e.tagInputs;
    return [
      { title: 'Risk profile', rows: [
        { label: 'Sensitivity',             value: i.sensitivity },
        { label: 'Exposure',                value: i.exposure },
        { label: 'Buyer role',              value: i.buyerRole },
      ] },
      { title: 'Valid grade', rows: [
        { label: 'Value',      value: i.validGrade.value },
        { label: 'Type',       value: i.validGrade.type },
        { label: 'Freshness',  value: i.validGrade.freshness },
      ] },
      { title: 'Autograde', rows: [
        { label: 'Autograde value',         value: i.autoGradeValue },
        { label: 'Last accepted autograde', value: i.lastAcceptedAutograde },
        { label: 'NACE code',               value: i.naceCode },
        { label: 'Legal form',              value: i.legalForm },
      ] },
    ];
  });
}
