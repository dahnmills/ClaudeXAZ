import { Component, computed, input, model, output, signal } from '@angular/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IconComponent } from '../icon/icon.component';
import { TabComponent } from '../tab/tab.component';
import { ShortcutRowComponent } from './shortcut-row.component';
import { KeyboardMapComponent, type KeyboardMapView } from './keyboard-map.component';
import type { KeyCombo } from '../keycap/shortcut-keys.component';

/** Une entrée du catalogue, telle qu'AFFICHÉE (touches déjà résolues pour l'OS). */
export interface Shortcut {
  /** Identifiant stable — clé de l'état « déjà utilisé ». Un même raccourci
   *  peut apparaître dans plusieurs catégories : le même `id` garantit que les
   *  deux lignes s'allument ensemble. */
  id: string;
  label: string;
  keys: KeyCombo;
  /** Portée, quand le raccourci n'est pas disponible partout. */
  context?: string;
}

export interface ShortcutGroup {
  key: string;
  label: string;
  shortcuts: readonly Shortcut[];
}

/** Clé de l'onglet Layout. Préfixée pour ne pouvoir collisionner avec aucune
 *  catégorie du catalogue — ce n'en est pas une, elle ne liste rien. */
const LAYOUT_KEY = '__layout';

/**
 * Organisme — panneau d'aide-mémoire des raccourcis clavier, docké en bas.
 *
 * Trois partis pris, tirés de l'observation des panneaux qui marchent (Figma,
 * Linear, Gmail) :
 *
 * 1. **Docké, pas modal.** Aucun backdrop, aucun piège de focus : on doit
 *    pouvoir ESSAYER un raccourci pendant qu'on le lit, et voir ses touches
 *    passer en bleu. Un modal casse exactement ça.
 * 2. **Une catégorie à la fois, en colonnes.** Le balayage vertical dans une
 *    colonne courte bat le défilement dans une liste de 50 lignes.
 * 3. **Une seule bande de châssis.** Onglets + croix, rien d'autre. Titre,
 *    compteur et champ de recherche ont été retirés : ils prenaient 40 % du
 *    panneau pour ne rien apprendre à personne.
 *
 * Purement présentationnel : ni catalogue en dur, ni écoute clavier, ni
 * navigation. L'hôte fournit `groups` (déjà résolus pour l'OS) et `used`, et
 * reçoit `activated` quand une ligne est cliquée.
 */
@Component({
  selector: 'ds-shortcuts-panel',
  standalone: true,
  imports: [
    ButtonIconComponent,
    IconComponent,
    TabComponent,
    ShortcutRowComponent,
    KeyboardMapComponent,
  ],
  templateUrl: './shortcuts-panel.component.html',
  styleUrl: './shortcuts-panel.component.scss',
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class ShortcutsPanelComponent {
  open   = model<boolean>(false);
  groups = input.required<readonly ShortcutGroup[]>();
  /** Identifiants des raccourcis déjà déclenchés. */
  used   = input<readonly string[]>([]);
  /** Retour de la dernière action, affiché en surimpression à droite des onglets. */
  note   = input<string>('');
  /** Fourni = un onglet « Layout » s'ajoute en fin de bande. Absent = pas d'onglet. */
  keyboard = input<KeyboardMapView | null>(null);

  activated = output<Shortcut>();
  /** Disposition choisie dans l'onglet Layout. */
  layoutChange = output<string>();

  /** `null` = aucune sélection explicite → première catégorie. */
  private category = signal<string | null>(null);

  readonly layoutKey = LAYOUT_KEY;

  /** Retombe sur la première catégorie si la sélection n'existe plus — y compris
   *  quand l'onglet Layout était actif et que `keyboard` disparaît. */
  activeKey = computed<string>(() => {
    const wanted = this.category();
    if (wanted === LAYOUT_KEY) return this.keyboard() ? LAYOUT_KEY : (this.groups()[0]?.key ?? '');
    const groups = this.groups();
    if (wanted && groups.some((g) => g.key === wanted)) return wanted;
    return groups[0]?.key ?? '';
  });

  showLayout = computed<boolean>(() => this.activeKey() === LAYOUT_KEY);

  private usedSet = computed(() => new Set(this.used()));

  /** Les raccourcis de la catégorie active. */
  visibleShortcuts = computed<readonly Shortcut[]>(
    () => this.groups().find((g) => g.key === this.activeKey())?.shortcuts ?? [],
  );

  isUsed(s: Shortcut): boolean {
    return this.usedSet().has(s.id);
  }

  pickCategory(key: string) {
    this.category.set(key);
  }

  close() {
    if (this.open()) this.open.set(false);
  }
}
