import { Component, computed, input, signal } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { LogoComponent } from '../../shared/ui/logo/logo.component';
import { TabComponent } from '../../shared/ui/tab/tab.component';
import { ButtonIconComponent } from '../../shared/ui/button-icon/button-icon.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { SideNavComponent } from '../../shared/ui/side-nav/side-nav.component';
import { SideNavItemComponent } from '../../shared/ui/side-nav/side-nav-item.component';

/**
 * Shell de layout pour les tests utilisateur Topbox :
 * Header (Qirin nav) + Side nav (icônes collapsed) + zone main.
 *
 * Slots :
 *   • [slot=topbox]            → barre Topbox au-dessus du page-header (full width)
 *   • [slot=topbox-extension]  → contenu inline juste sous la Topbox (ex. accordion)
 *   • default                  → corps principal (page-header + table mock + …)
 */
@Component({
  selector: 'app-topbox-test-shell',
  standalone: true,
  imports: [
    HeaderComponent,
    LogoComponent,
    TabComponent,
    ButtonIconComponent,
    IconComponent,
    SideNavComponent,
    SideNavItemComponent,
  ],
  templateUrl: './topbox-test-shell.component.html',
  styleUrl: './topbox-test-shell.component.scss',
})
export class TopboxTestShellComponent {
  /** Pilote l'animation d'ouverture/fermeture du slot [slot=topbox-extension] */
  extensionExpanded = input<boolean>(false);
  sideNavCollapsed = signal<boolean>(true);

  extensionClasses = computed(() => [
    'ut-main__extension',
    this.extensionExpanded() ? 'ut-main__extension--expanded' : '',
  ].filter(Boolean).join(' '));
}
