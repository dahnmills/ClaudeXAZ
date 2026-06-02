import { Component, computed, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface StepperStep {
  label: string;
}

export type StepStatus = 'completed' | 'current' | 'upcoming';

/**
 * Stepper vertical : liste d'étapes avec marqueur (numéro / check), libellé et
 * statut. Les étapes avant l'étape courante sont "completed", l'étape courante
 * "current", les suivantes "upcoming".
 */
@Component({
  selector: 'ds-stepper',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  host: { 'class': 'ds-stepper' },
})
export class StepperComponent {
  steps   = input.required<StepperStep[]>();
  /** Index (0-based) de l'étape courante. */
  current = input<number>(0);
  /** Indices des étapes déjà complétées (restent "completed" même après Back). */
  completedSteps = input<number[]>([]);

  total = computed(() => this.steps().length);

  statusOf(i: number): StepStatus {
    if (this.completedSteps().includes(i)) return 'completed';
    if (i === this.current()) return 'current';
    return 'upcoming';
  }
}
