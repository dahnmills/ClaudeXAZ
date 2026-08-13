import { Component, input, output } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { PropertiesPanelComponent, PropertySection } from '../../../shared/ui/properties-panel/properties-panel.component';
import { GradeStoryEntry } from '../grade-story.models';

/**
 * TRAM score details — placeholder content (BN AZTQIRIN-55735 keeps "same
 * content as today" for this modal; the real TRAM2/TRAM3 calculation
 * explanation lives outside this Design System prototype, so this stands in
 * as a plausible mock focused on proving the click-zone split, not on the
 * TRAM calculation itself).
 */
@Component({
  selector: 'gs-tram-score-modal',
  standalone: true,
  imports: [ModalComponent, ButtonComponent, PropertiesPanelComponent],
  templateUrl: './tram-score-modal.component.html',
  styleUrl: './tram-score-modal.component.scss',
})
export class TramScoreModalComponent {
  open  = input<boolean>(false);
  entry = input<GradeStoryEntry | null>(null);

  closed = output<void>();

  sections(entry: GradeStoryEntry): PropertySection[] {
    return [
      { title: 'TRAM calculation', rows: [
        { label: 'Model',       value: 'TRAM 3' },
        { label: 'Grade type',  value: entry.gradeType === 'manual' ? 'Manual' : 'Automatic' },
        { label: 'Score',       value: entry.score !== null ? entry.score.toFixed(2) : '-' },
        { label: 'Computed on', value: entry.date },
      ] },
    ];
  }
}
