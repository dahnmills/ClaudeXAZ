import { signal } from '@angular/core';

/**
 * Disposition clavier : lire ce qui est GRAVÉ sur les touches.
 *
 * Un `KeyboardEvent` porte deux identités de touche, et elles ne coïncident pas
 * hors QWERTY :
 *
 * - `event.code` est une POSITION physique, nommée d'après le QWERTY US. La
 *   touche marquée `M` d'un AZERTY français a pour `code` `Semicolon` ; la
 *   position appelée `KeyM`, elle, imprime `,`.
 * - `event.key` est le CARACTÈRE produit, donc la légende — sauf quand un
 *   modificateur compose autre chose (macOS : ⌥ + M donne `µ`).
 *
 * Un raccourci se retient par ce qu'on lit sur la touche. « Alt + M » doit donc
 * viser la touche marquée M, quelle que soit sa position. D'où ce module : il
 * expose la légende réelle par position quand le navigateur la donne
 * (`navigator.keyboard.getLayoutMap()`, Chromium), ce qui sert deux fois — au
 * décodage des événements (`normalizeEventKey`) et au dessin du clavier de
 * l'onglet Layout.
 *
 * Hors Chromium l'API n'existe pas : on retombe sur une table de dispositions
 * et l'utilisateur choisit la sienne dans l'onglet Layout. Ce choix n'affecte
 * QUE le dessin — le décodage, lui, passe par `event.key`, qui est déjà correct
 * partout où aucun modificateur ne compose de caractère.
 */

export type LayoutId = 'qwerty' | 'azerty' | 'qwertz';

export const LAYOUT_OPTIONS: readonly { value: LayoutId; label: string }[] = [
  { value: 'qwerty', label: 'QWERTY (US / UK)' },
  { value: 'azerty', label: 'AZERTY (French)' },
  { value: 'qwertz', label: 'QWERTZ (German)' },
];

/**
 * Les trois rangées de lettres, EN POSITIONS. `Quote` et `Comma` sont inclus
 * parce qu'ils portent une lettre sur certaines dispositions (`M` et `Ù` en
 * AZERTY) ; les positions qui n'impriment pas de lettre sont écartées au
 * moment du rendu, si bien que la même liste produit 10/9/7 touches en QWERTY
 * et 10/10/6 en AZERTY sans table par disposition.
 */
const PHYSICAL_ROWS: readonly (readonly string[])[] = [
  ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'],
  ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
  ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma'],
];

/** Repli quand le navigateur ne dit rien : les trois dispositions courantes. */
const FALLBACK_ROWS: Record<LayoutId, readonly string[]> = {
  qwerty: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
  azerty: ['azertyuiop', 'qsdfghjklm', 'wxcvbn'],
  qwertz: ['qwertzuiop', 'asdfghjkl', 'yxcvbnm'],
};

/**
 * Légendes lues dans le navigateur, par `code`. `null` = pas encore lu, ou API
 * absente — deux cas que l'appelant traite pareil (repli), d'où un seul état.
 */
const legends = signal<ReadonlyMap<string, string> | null>(null);

/** Lecture asynchrone, une fois. Silencieuse : l'absence d'API est un cas normal. */
export function primeKeyboardLegends(): void {
  if (legends() !== null || typeof navigator === 'undefined') return;

  const kb = (navigator as Navigator & {
    keyboard?: { getLayoutMap?: () => Promise<Map<string, string>> };
  }).keyboard;

  kb?.getLayoutMap?.()
    .then((map) => legends.set(new Map(map)))
    .catch(() => { /* permission refusée / contexte non sécurisé : on reste au repli */ });
}

/** Légende d'une position, si elle est connue ET qu'elle imprime une lettre. */
export function legendLetter(code: string): string | undefined {
  const value = legends()?.get(code);
  return value && /^[a-zA-Z]$/.test(value) ? value.toLowerCase() : undefined;
}

/** `true` quand les légendes viennent du navigateur et non d'une supposition. */
export function legendsDetected(): boolean {
  return legends() !== null;
}

/**
 * Disposition déduite des légendes. Deux positions suffisent : `KeyQ` imprime
 * `A` en AZERTY, et `KeyY` imprime `Z` en QWERTZ.
 */
export function detectLayout(): LayoutId {
  if (legendLetter('KeyQ') === 'a') return 'azerty';
  if (legendLetter('KeyY') === 'z') return 'qwertz';
  return 'qwerty';
}

/**
 * Les lettres du clavier, rangée par rangée, telles qu'imprimées.
 *
 * `layout` non nul = choix explicite de l'utilisateur, et il l'emporte sur les
 * légendes lues : sans ça, les pastilles de l'onglet Layout seraient des
 * commandes mortes sur les navigateurs qui exposent la disposition.
 */
export function letterRows(layout: LayoutId | null): readonly (readonly string[])[] {
  if (layout === null && legendsDetected()) {
    return PHYSICAL_ROWS
      .map((row) => row.map(legendLetter).filter((l): l is string => !!l))
      .filter((row) => row.length > 0);
  }
  return FALLBACK_ROWS[layout ?? detectLayout()].map((row) => [...row]);
}
