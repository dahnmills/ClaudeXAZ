import { Injectable, computed, signal } from '@angular/core';
import type { KeyboardMapView } from '../../shared/ui/shortcuts-panel/keyboard-map.component';
import {
  LAYOUT_OPTIONS,
  detectLayout,
  legendsDetected,
  letterRows,
  primeKeyboardLegends,
  type LayoutId,
} from './keyboard-layout';
import { SHORTCUT_LETTERS } from './shortcuts.data';

/**
 * État du panneau de raccourcis, hors des composants.
 *
 * Chaque écran monte sa propre instance de `app-topbox-test-shell`, donc une
 * navigation la détruit. Un signal local perdrait à chaque saut trois choses
 * qu'on veut justement garder : le panneau ouvert (on enchaîne les raccourcis en
 * le lisant), la liste des raccourcis déjà essayés (les touches passent en
 * bleu — c'est cumulé que ça a du sens) et la disposition clavier choisie. Un
 * service racine survit aux navigations, contrairement au composant.
 */
@Injectable({ providedIn: 'root' })
export class ShortcutsService {
  readonly panelOpen = signal<boolean>(false);

  /** Identifiants des raccourcis déclenchés au moins une fois. */
  readonly used = signal<string[]>([]);

  /**
   * Retour éphémère affiché en surimpression dans la bande d'onglets. Le
   * snackbar est ancré en bas de fenêtre : panneau ouvert, il recouvrirait la
   * ligne qu'on vient de déclencher.
   */
  readonly note = signal<string>('');
  private noteTimer: ReturnType<typeof setTimeout> | null = null;

  /** Disposition choisie à la main. `null` = on suit le navigateur. */
  private layoutPick = signal<LayoutId | null>(null);

  constructor() {
    // Les légendes servent au décodage des lettres (`normalizeEventKey`), donc
    // il faut les demander avant la première frappe, pas à l'ouverture du
    // panneau.
    primeKeyboardLegends();
  }

  open()   { this.panelOpen.set(true); }
  close()  { this.panelOpen.set(false); }
  toggle() { this.panelOpen.update((v) => !v); }

  markUsed(id: string) {
    this.used.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }

  setNote(message: string) {
    this.note.set(message);
    if (this.noteTimer) clearTimeout(this.noteTimer);
    this.noteTimer = setTimeout(() => this.note.set(''), 3200);
  }

  // ── Onglet Layout ─────────────────────────────────────────────────────────

  /** Vue de l'onglet Layout du panneau. */
  readonly keyboardView = computed<KeyboardMapView>(() => {
    const pick = this.layoutPick();
    return {
      layouts: LAYOUT_OPTIONS,
      layout: pick ?? detectLayout(),
      source: pick ? 'manual' : legendsDetected() ? 'browser' : 'guess',
      rows: letterRows(pick),
      lit: [...SHORTCUT_LETTERS],
    };
  });

  /** Choix de disposition. N'affecte QUE le dessin — voir keyboard-layout.ts. */
  setLayout(id: string) {
    const option = LAYOUT_OPTIONS.find((o) => o.value === id);
    if (option) this.layoutPick.set(option.value);
  }
}
