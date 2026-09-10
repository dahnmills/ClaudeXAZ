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
  /**
   * Élément qui contient à la fois le déclencheur et le flyout. Fourni, l'atome
   * se ferme aussi au clic ailleurs dans la page, modales comprises.
   */
  flyoutHost?(): HTMLElement;
}

let current: SingleOpenFlyout | null = null;

export function claimFlyout(owner: SingleOpenFlyout): void {
  if (current && current !== owner) current.closeFlyout();
  current = owner;
}

export function releaseFlyout(owner: SingleOpenFlyout): void {
  if (current === owner) current = null;
}

/**
 * Vrai quand une liste est ouverte quelque part. Sert aux conteneurs qui
 * répondent aussi à Échap : la couche la plus haute se ferme d'abord, une seule
 * par appui. Sans ça, Échap sur une liste ouverte dans une modale fermait les
 * deux d'un coup, et sur un brouillon modifié réveillait la popin de sortie.
 */
export function hasOpenFlyout(): boolean {
  return current !== null;
}

/**
 * Clic ailleurs : fermeture de la liste ouverte, écoutée **en phase de capture**.
 *
 * `ds-modal` arrête la propagation du clic sur sa boîte pour que le clic
 * intérieur ne compte pas comme un clic sur le fond. Un écouteur en phase de
 * bulle ne voit donc jamais un clic fait dans une modale, et une liste ouverte
 * dedans ne se fermait qu'en recliquant son déclencheur, en choisissant, ou en
 * ouvrant une autre liste. La capture passe avant que qui que ce soit puisse
 * arrêter la propagation.
 */
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event: MouseEvent) => {
    const owner = current;
    if (!owner?.flyoutHost) return;
    const target = event.target as Node | null;
    if (target && owner.flyoutHost().contains(target)) return;
    owner.closeFlyout();
  }, true);
}
