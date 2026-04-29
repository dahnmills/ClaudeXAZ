import { Component, computed, input, output } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';

export type TopboxDataType  = 'policy' | 'buyer';
export type TopboxGradeColor = 'grade-1' | 'grade-2' | 'grade-3' | 'grade-4' | 'grade-5'
                              | 'grade-6' | 'grade-7' | 'grade-8' | 'grade-9' | 'grade-10'
                              | 'grade-none';

@Component({
  selector: 'ds-topbox',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './topbox.component.html',
  styleUrl: './topbox.component.scss',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class TopboxComponent {
  // Identité de l'entité affichée
  dataType = input<TopboxDataType>('buyer');
  icon     = input<IconName>('users');           // icône produit/résumé à gauche
  label    = input.required<string>();
  id       = input<string>('');                  // affiché dans la pastille # ID

  // Grade pill (M4 jaune, Y jaune, etc.)
  grade      = input<string | null>(null);
  gradeColor = input<TopboxGradeColor>('grade-4');

  // Badges critiques (Buyer)
  highRisk = input<boolean>(false);
  sru      = input<boolean>(false);
  sanction = input<boolean>(false);

  // Action à droite
  actionLabel        = input<string | null>('View full details');
  actionIcon         = input<IconName>('info-circle');
  actionIconPosition = input<'left' | 'right'>('left');
  /** 'button' = bouton classique avec label + icône — 'chevron' = chevron toggle (accordéon) */
  actionType         = input<'button' | 'chevron'>('button');
  /** N'a d'effet que si actionType === 'chevron' : pivote le chevron + classe d'état host */
  expanded           = input<boolean>(false);

  actionClicked = output<void>();

  hostClasses = computed(() => [
    'ds-topbox',
    `ds-topbox--data-${this.dataType()}`,
    `ds-topbox--action-${this.actionType()}`,
    this.expanded() ? 'ds-topbox--expanded' : '',
  ].filter(Boolean).join(' '));
}
