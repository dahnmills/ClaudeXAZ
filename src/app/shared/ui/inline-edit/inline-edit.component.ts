import { Component, OnDestroy, computed, input, model, output, signal } from '@angular/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent } from '../icon/icon.component';
import { InputTextComponent } from '../input-text/input-text.component';

@Component({
  selector: 'ds-inline-edit',
  standalone: true,
  imports: [ButtonIconComponent, IconComponent, InputTextComponent],
  templateUrl: './inline-edit.component.html',
  styleUrl: './inline-edit.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class InlineEditComponent implements OnDestroy {
  value = model<string>('');

  placeholder = input<string>('Name');
  emptyLabel = input<string>('Untitled');
  required = input<boolean>(true);
  disabled = input<boolean>(false);
  deletable = input<boolean>(true);
  ariaLabel = input<string>('Edit value');
  deleteAriaLabel = input<string>('Delete value');

  saved = output<string>();
  cancelled = output<void>();
  editStarted = output<void>();
  deleted = output<void>();

  editing = signal(false);
  draft = signal('');
  attemptedSave = signal(false);
  savedFeedback = signal(false);

  private savedFeedbackTimeout: ReturnType<typeof setTimeout> | undefined;

  displayValue = computed(() => this.value().trim() || this.emptyLabel());
  showError = computed(() => this.attemptedSave() && this.required() && !this.draft().trim());
  hostClasses = computed(() => [
    'ds-inline-edit',
    this.editing() ? 'ds-inline-edit--editing' : '',
    this.savedFeedback() ? 'ds-inline-edit--saved' : '',
    this.disabled() ? 'ds-inline-edit--disabled' : '',
  ].filter(Boolean).join(' '));

  ngOnDestroy(): void {
    this.clearSavedFeedbackTimeout();
  }

  startEdit(): void {
    if (this.disabled()) return;
    this.clearSavedFeedback();
    this.draft.set(this.value());
    this.attemptedSave.set(false);
    this.editing.set(true);
    this.editStarted.emit();
  }

  commit(): void {
    if (this.disabled()) return;

    const nextValue = this.draft().trim();
    if (this.required() && !nextValue) {
      this.attemptedSave.set(true);
      return;
    }

    this.value.set(nextValue);
    this.editing.set(false);
    this.attemptedSave.set(false);
    this.saved.emit(nextValue);
    this.showSavedFeedback();
  }

  cancel(): void {
    this.editing.set(false);
    this.attemptedSave.set(false);
    this.draft.set(this.value());
    this.cancelled.emit();
  }

  onDelete(): void {
    if (this.disabled() || !this.deletable()) return;
    this.deleted.emit();
  }

  private showSavedFeedback(): void {
    this.clearSavedFeedbackTimeout();
    this.savedFeedback.set(true);
    this.savedFeedbackTimeout = setTimeout(() => {
      this.savedFeedback.set(false);
      this.savedFeedbackTimeout = undefined;
    }, 1200);
  }

  private clearSavedFeedback(): void {
    this.clearSavedFeedbackTimeout();
    this.savedFeedback.set(false);
  }

  private clearSavedFeedbackTimeout(): void {
    if (!this.savedFeedbackTimeout) return;
    clearTimeout(this.savedFeedbackTimeout);
    this.savedFeedbackTimeout = undefined;
  }
}
