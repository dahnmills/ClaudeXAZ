import { Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { IconComponent, type IconName } from '../../../shared/ui/icon/icon.component';
import { ButtonIconComponent } from '../../../shared/ui/button-icon/button-icon.component';
import { FlyoutMenuComponent } from '../../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../../shared/ui/flyout-menu/flyout-menu-item.component';
import { FlagComponent } from '../../../shared/ui/flag/flag.component';
import { TooltipDirective } from '../../../shared/ui/tooltip/tooltip.directive';
import { Country, RuleSetHistoryEntry } from '../tag-configuration.models';

/** Une action proposée sur une ligne d'historique. Dépend du statut de l'entrée. */
export interface HistoryAction {
  key: string;
  label: string;
  icon: IconName;
  disabled?: boolean;
  /** Raison de l'indisponibilité, au survol. Désactiver sans dire pourquoi n'apprend rien. */
  reason?: string;
}

/** One row of the History tab: a past rule-set publication, opens a detail drawer. */
@Component({
  selector: 'tag-history-row',
  standalone: true,
  imports: [
    CardComponent, BadgeComponent, IconComponent, ButtonIconComponent,
    FlyoutMenuComponent, FlyoutMenuItemComponent, FlagComponent, TooltipDirective,
  ],
  templateUrl: './history-row.component.html',
  styleUrl: './history-row.component.scss',
})
export class HistoryRowComponent {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  entry    = input.required<RuleSetHistoryEntry>();
  selected = input<boolean>(false);
  /** Renseigné quand la liste mélange plusieurs pays : la ligne porte alors son
   *  drapeau et sa devise, sans quoi on ne sait pas ce qu'on copie. */
  country  = input<Country | null>(null);
  actions  = input<HistoryAction[]>([]);

  opened = output<void>();
  action = output<string>();

  menuOpen = signal(false);

  /** Le numéro de set est attribué à la validation : un brouillon n'en a pas,
   *  et sa clé interne n'a rien à faire dans la colonne ID. */
  idLabel = computed(() => this.entry().status === 'Draft' ? '—' : this.entry().id);

  // Chaque ligne porte un badge : « Archived » est un état, pas une absence.
  statusBadge = computed(() => {
    switch (this.entry().status) {
      case 'Active':   return { label: 'Active',   status: 'info'    as const };
      case 'Draft':    return { label: 'Draft',    status: 'warning' as const };
      case 'Archived': return { label: 'Archived', status: 'neutral' as const };
    }
  });

  toggleMenu(): void { this.menuOpen.update(o => !o); }

  onAction(key: string): void {
    this.menuOpen.set(false);
    this.action.emit(key);
  }

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
