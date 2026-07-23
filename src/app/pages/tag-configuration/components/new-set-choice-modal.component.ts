import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { VisualButtonComponent } from '../../../shared/ui/visual-button/visual-button.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { HistoryRowComponent } from './history-row.component';
import { RuleSetHistoryEntry } from '../tag-configuration.models';

export type NewSetAction = 'previous' | 'scratch' | 'import';

/**
 * "Create new set" entry point — pick previous set / blank / JSON upload as
 * a selectable card, then confirm with Next. Choosing "Previous set" moves
 * to a second step listing past rule-sets to pick from (same row layout as
 * the History tab) before confirming.
 */
@Component({
  selector: 'tag-new-set-choice-modal',
  standalone: true,
  imports: [ModalComponent, VisualButtonComponent, IconComponent, ButtonComponent, HistoryRowComponent],
  templateUrl: './new-set-choice-modal.component.html',
  styleUrl: './new-set-choice-modal.component.scss',
})
export class NewSetChoiceModalComponent {
  open    = input<boolean>(false);
  history = input<RuleSetHistoryEntry[]>([]);

  chosen = output<NewSetAction>();
  fromPrevious = output<RuleSetHistoryEntry>();
  closed = output<void>();

  step = signal<'choice' | 'previous'>('choice');
  selectedAction = signal<NewSetAction | null>(null);
  selectedEntry = signal<RuleSetHistoryEntry | null>(null);

  constructor() {
    effect(() => {
      if (!this.open()) return;
      this.step.set('choice');
      this.selectedAction.set(null);
      this.selectedEntry.set(null);
    });
  }

  title = computed(() => this.step() === 'previous' ? 'Select a previous set' : 'Create new set of rules');
  canGoNext = computed(() => this.step() === 'previous' ? !!this.selectedEntry() : !!this.selectedAction());

  select(action: NewSetAction): void { this.selectedAction.set(action); }
  selectEntry(entry: RuleSetHistoryEntry): void { this.selectedEntry.set(entry); }

  back(): void { this.step.set('choice'); this.selectedEntry.set(null); }

  next(): void {
    if (this.step() === 'choice') {
      const action = this.selectedAction();
      if (!action) return;
      if (action === 'previous') { this.step.set('previous'); return; }
      this.chosen.emit(action);
      return;
    }
    const entry = this.selectedEntry();
    if (!entry) return;
    this.fromPrevious.emit(entry);
  }
}
