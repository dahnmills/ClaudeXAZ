/**
 * Un seul flyout ouvert à la fois, à l'échelle du document.
 *
 * L'écoute du clic extérieur ne suffit pas : les déclencheurs qui appellent
 * `stopPropagation()` (pour ne pas réveiller un conteneur cliquable au-dessus)
 * empêchent le clic d'atteindre `document`, donc le flyout déjà ouvert ne
 * l'apprend jamais. Cinq `ds-select` et sept `ds-tag-filter-chip` cohabitent
 * dans la modale de règle TAG : deux listes superposées y sont visibles.
 *
 * Chaque atome à flyout déclare `closeFlyout()`, prend la main à l'ouverture
 * (`claimFlyout`) et la rend à la fermeture (`releaseFlyout`).
 */
export interface SingleOpenFlyout {
  closeFlyout(): void;
}

let current: SingleOpenFlyout | null = null;

export function claimFlyout(owner: SingleOpenFlyout): void {
  if (current && current !== owner) current.closeFlyout();
  current = owner;
}

export function releaseFlyout(owner: SingleOpenFlyout): void {
  if (current === owner) current = null;
}
