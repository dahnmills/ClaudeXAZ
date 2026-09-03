import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { LogoComponent } from '../../shared/ui/logo/logo.component';
import { TabComponent } from '../../shared/ui/tab/tab.component';
import { ButtonIconComponent } from '../../shared/ui/button-icon/button-icon.component';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { SideNavComponent } from '../../shared/ui/side-nav/side-nav.component';
import { SideNavItemComponent } from '../../shared/ui/side-nav/side-nav-item.component';
import { FlyoutMenuComponent } from '../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../shared/ui/flyout-menu/flyout-menu-item.component';
import { ShortcutsPanelComponent, type Shortcut } from '../../shared/ui/shortcuts-panel/shortcuts-panel.component';
import { SnackbarService } from '../../shared/ui/snackbar/snackbar.service';
import { ShortcutsService } from './shortcuts.service';
import {
  BOUND_SHORTCUTS,
  SHORTCUTS_BY_ID,
  SHORTCUT_GROUPS,
  allowedWhileTyping,
  eventSignature,
  inTextField,
  type ShortcutDef,
} from './shortcuts.data';

/** Zones qui préfixent les routes du proto. Un raccourci ne doit pas éjecter le
 *  testeur de son espace (compagnon de feedback en /review, cloisonnement en
 *  /user-testing) : on renavigue DANS le préfixe courant. */
const ZONE_PREFIXES = ['/review', '/prototype', '/user-testing'];

/**
 * Shell de layout pour les tests utilisateur Topbox :
 * Header (Qirin nav) + Side nav (icônes collapsed) + zone main.
 *
 * Porte aussi le clavier de l'application : c'est le seul composant présent sur
 * tous les écrans produit, donc le bon endroit pour écouter les raccourcis et
 * pour héberger le panneau d'aide-mémoire. Le catalogue et l'état vivent à côté
 * (shortcuts.data.ts, ShortcutsService) — ici il n'y a que l'écoute et le
 * dispatch.
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
    FlyoutMenuComponent,
    FlyoutMenuItemComponent,
    ShortcutsPanelComponent,
  ],
  templateUrl: './topbox-test-shell.component.html',
  styleUrl: './topbox-test-shell.component.scss',
  host: {
    '(document:click)':          'closeMenus()',
    '(document:keydown.escape)': 'closeMenus()',
    '(document:keydown)':        'onKeydown($event)',
  },
})
export class TopboxTestShellComponent {
  private router   = inject(Router);
  private snackbar = inject(SnackbarService);
  readonly shortcuts = inject(ShortcutsService);

  /** Pilote l'animation d'ouverture/fermeture du slot [slot=topbox-extension] */
  extensionExpanded = input<boolean>(false);
  showSidenav       = input<boolean>(true);
  /** Dims the global nav header (e.g. while a draft-mode snackbar is shown) without touching page content. */
  headerDimmed      = input<boolean>(false);
  sideNavCollapsed  = signal<boolean>(true);
  accountMenuOpen   = signal<boolean>(false);
  helpMenuOpen      = signal<boolean>(false);

  readonly shortcutGroups = SHORTCUT_GROUPS;

  toggleAccountMenu() {
    this.helpMenuOpen.set(false);
    this.accountMenuOpen.update(v => !v);
  }

  toggleHelpMenu() {
    this.accountMenuOpen.set(false);
    this.helpMenuOpen.update(v => !v);
  }

  closeMenus() {
    this.accountMenuOpen.set(false);
    this.helpMenuOpen.set(false);
  }

  openShortcutsPanel() {
    this.closeMenus();
    this.shortcuts.open();
  }

  extensionClasses = computed(() => [
    'ut-main__extension',
    this.extensionExpanded() ? 'ut-main__extension--expanded' : '',
  ].filter(Boolean).join(' '));

  // ── Clavier ──────────────────────────────────────────────────────────────

  onKeydown(ev: KeyboardEvent) {
    // Une combinaison en cours de composition (touche morte, IME) n'est pas un
    // raccourci : `ev.key` vaut alors « Dead » ou « Process ».
    if (ev.isComposing || ev.repeat) return;

    const signature = eventSignature(ev);
    if (signature === 'esc') {
      // Échap n'est pas un raccourci du catalogue : il ferme, sans jamais
      // empêcher les autres fermetures de la page de se produire aussi.
      this.shortcuts.close();
      return;
    }

    if (inTextField() && !allowedWhileTyping(signature)) return;

    const def = BOUND_SHORTCUTS.get(signature);
    if (!def) return;

    ev.preventDefault();
    this.run(def);
  }

  /** Ligne cliquée dans le panneau : même chemin que la frappe. */
  onPanelActivate(s: Shortcut) {
    const def = SHORTCUTS_BY_ID.get(s.id);
    if (def) this.run(def);
  }

  private run(def: ShortcutDef) {
    this.shortcuts.markUsed(def.id);

    // Les quelques raccourcis qui pilotent le shell lui-même.
    switch (def.id) {
      case 'panel':
        this.shortcuts.toggle();
        return;
      case 'view-sidenav':
        this.sideNavCollapsed.update(v => !v);
        this.notify(
          this.sideNavCollapsed() ? 'Side navigation collapsed' : 'Side navigation expanded',
        );
        return;
    }

    if (def.route) {
      this.router.navigateByUrl(this.zoned(def.route));
      return;
    }

    // Le reste n'est pas encore branché : le proto teste la découvrabilité et
    // la mémorisation des combinaisons, pas les écrans de destination. Le
    // retour est ce qui prouve que la frappe a bien été reçue.
    this.notify(`${def.label} — not wired in this prototype yet`);
  }

  /** Panneau ouvert : le retour va dans sa bande d'onglets. Le snackbar est ancré
   *  au même bord de fenêtre et recouvrirait la ligne qu'on vient de déclencher. */
  private notify(message: string) {
    if (this.shortcuts.panelOpen()) this.shortcuts.setNote(message);
    else this.snackbar.show(message, { tone: 'neutral' });
  }

  /** Préfixe une route de la zone courante (/review, /prototype, /user-testing). */
  private zoned(route: string): string {
    const url = this.router.url;
    const prefix = ZONE_PREFIXES.find(p => url === p || url.startsWith(`${p}/`));
    return prefix ? `${prefix}${route}` : route;
  }
}
