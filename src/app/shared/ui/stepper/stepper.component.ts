import { Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface StepperStep {
  label: string;
}

export type StepStatus = 'completed' | 'current' | 'current-completed' | 'upcoming';

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
  /** Index max jamais atteint — toutes les étapes ≤ navigableUpTo sont cliquables. */
  navigableUpTo = input<number>(-1);
  /** Émis quand l'user clique sur une étape navigable (completed ou current). */
  stepChange = output<number>();

  total = computed(() => this.steps().length);

  statusOf(i: number): StepStatus {
    const isCompleted = this.completedSteps().includes(i);
    const isCurrent = i === this.current();
    if (isCurrent && isCompleted) return 'current-completed';
    if (isCompleted) return 'completed';
    if (isCurrent) return 'current';
    return 'upcoming';
  }

  isNavigable(i: number): boolean {
    return this.statusOf(i) !== 'upcoming' || i <= this.navigableUpTo();
  }
}
