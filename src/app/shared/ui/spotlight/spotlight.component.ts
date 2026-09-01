import { Component, DestroyRef, ElementRef, computed, effect, inject, input, model, output, signal, viewChild } from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { type BadgeStatus } from '../badge/badge.component';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { FlagComponent, type FlagCode } from '../flag/flag.component';

/** Une entité indexée par la palette (buyer, application, …). */
export interface SpotlightItem {
  /** Identifiant métier affiché avec un `#` et copiable. */
  id: string;
  /** Libellé principal. */
  name: string;
  /** Type d'entité (« Buyer », « Application »…). */
  type: string;
  /** Icône produit à gauche du libellé. */
  icon?: IconName;
  /** Statut optionnel rendu en badge (« Open »…). */
  status?: string;
  statusTone?: BadgeStatus;
  /** Pays de l'entité, pour le filtre bulle. */
  country?: FlagCode;
}

/** Pays proposé dans le panneau de filtre (bulle drapeau). */
export interface SpotlightCountry {
  code: FlagCode;
  name: string;
}

/** Champ recherché — bulle « Aa / ID ». Nom par défaut. */
export type SpotlightMode = 'name' | 'id';

/** Bulle de filtre actuellement ouverte (une seule à la fois), ou aucune. */
type FilterPanel = 'country' | 'mode' | null;

/**
 * Doit rester synchronisé avec --sp-dur-morph dans spotlight.component.scss.
 * Volontairement plus court que la fission : c'est lui qui décide à quel moment
 * le bord droit du panneau réel a fini de reculer, et le col liquide ne peut se
 * pincer que DEHORS, au-delà de ce bord (voir sp-goo-bar-retract).
 */
const MORPH_MS = 220;
/**
 * Fission liquide (sens RETOUR uniquement). Doit rester synchronisé avec
 * --sp-dur-fission. Bien plus long que MORPH_MS : la rétraction raconte huit
 * étapes ordonnées (col qui s'amincit, rupture, deux lobes reliés, le col se
 * pince, rupture) là où l'aller n'est qu'une fusion.
 */
const FISSION_MS = 460;

/** Item + son rang absolu dans la liste plate (pour la sélection clavier). */
interface RankedItem {
  item: SpotlightItem;
  index: number;
}

/** Groupe rendu dans le dropdown. */
interface Section {
  key: 'results';
  label: string | null;
  items: RankedItem[];
}

/**
 * Palette de recherche « Spotlight » (⌘K / Ctrl+K).
 *
 * Props in / events out : la palette ne connaît pas la source de données ni la
 * navigation. On lui passe le corpus (`items`) et les récents (`recents`) ; elle
 * filtre, groupe (Résultats / Suggestions / Recent), gère la navigation clavier
 * et émet `selected` (ouvrir la fiche) et `copied` (copier l'ID).
 *
 * Le déclencheur global ⌘K est laissé à l'hôte : il pilote `open`.
 */
@Component({
  selector: 'ds-spotlight',
  standalone: true,
  imports: [IconComponent, ButtonIconComponent, FlagComponent],
  templateUrl: './spotlight.component.html',
  styleUrl: './spotlight.component.scss',
  host: {
    'class': 'ds-spotlight',
    '[class.ds-spotlight--open]': 'open()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SpotlightComponent {
  open  = model<boolean>(false);
  query = model<string>('');

  /** Corpus recherché (mock côté hôte). */
  items = input<SpotlightItem[]>([]);
  /** Recherches récentes, affichées à vide. */
  recents = input<SpotlightItem[]>([]);
  placeholder = input<string>('Quick search');
  /** Nombre max de résultats directs avant de basculer le reste en suggestions. */
  maxResults = input<number>(4);
  /** Pays proposés dans le panneau de la bulle drapeau. */
  countries = input<SpotlightCountry[]>([]);

  /** L'utilisateur valide un résultat (clic / Enter). */
  selected = output<SpotlightItem>();
  /** L'utilisateur copie l'ID d'un résultat. */
  copied = output<SpotlightItem>();
  /** La palette se ferme (Esc, clic backdrop). */
  closed = output<void>();

  private inputEl = viewChild<ElementRef<HTMLInputElement>>('search');
  private host = inject(ElementRef<HTMLElement>);

  /** Index sélectionné dans la liste plate (navigation clavier). */
  activeIndex = signal<number>(0);

  // ── Bulles de filtre : pays + champ recherché ────────────────────────────
  /** Bulle ouverte (son panneau morph), une seule à la fois. */
  openPanel = signal<FilterPanel>(null);
  /** `null` = tous pays (bulle en état neutre). */
  selectedCountry = signal<FlagCode | null>(null);
  /** Nom par défaut ; bulle affiche "Aa" tant que non basculée sur "ID". */
  selectedMode = signal<SpotlightMode>('name');
  /**
   * Panneau en cours de FERMETURE : reste rendu (avec une classe `--out`) le
   * temps de son animation de sortie, pendant qu'`openPanel` est déjà à
   * `null`/une autre valeur. Sans ça, le contenu disparaît net (retiré du DOM
   * par `@if`) au lieu de sortir en fondu — ni liquide ni fluide.
   */
  closingPanel = signal<FilterPanel>(null);
  /** Pulse "liquide" (léger squish + flou) qui accompagne CHAQUE changement de bulle ouverte. */
  squish = signal<boolean>(false);
  /**
   * Vrai pendant tout le morph (largeur bulles↔barre) : pilote uniquement la
   * couche liquide décorative (.ds-spotlight__goo), qui comble l'espace
   * entre la barre et la bulle pour créer le col qui se pince/rompt. Le
   * contenu réel (icônes, texte) n'est jamais masqué — il reste visible tout
   * du long, seule la matière derrière lui se reforme.
   */
  morphing = signal<boolean>(false);
  /**
   * Vrai pendant la seule RÉTRACTION (dernier filtre refermé → les bulles
   * renaissent). Déclenche la timeline @keyframes de fission liquide, qui n'a
   * pas de sens à l'aller : avaler des bulles est une fusion, les recracher est
   * une fragmentation en huit étapes.
   */
  fission = signal<boolean>(false);

  private closingTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private squishTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private morphingTimeoutId: ReturnType<typeof setTimeout> | null = null;

  selectedCountryName = computed(
    () => this.countries().find(c => c.code === this.selectedCountry())?.name,
  );

  /**
   * Liste du panneau pays, filtrée par la BARRE PRINCIPALE : pas de second champ
   * de recherche dans le panneau, il doublonnait la barre juste au-dessus. La
   * requête métier de la barre est mise de côté pendant ce temps (voir
   * `stashQuery`), donc taper ici ne détruit pas ce qui avait déjà été saisi.
   */
  filteredCountries = computed(() => {
    const q = this.normalizedQuery();
    if (!q) return this.countries();
    return this.countries().filter(c => c.name.toLowerCase().includes(q));
  });

  /** La barre annonce son rôle courant : recherche métier, ou filtre du panneau. */
  barPlaceholder = computed(() =>
    this.openPanel() === 'country' ? 'Filter countries' : this.placeholder(),
  );

  /**
   * Icône à gauche de la barre : loupe par défaut, ou l'icône de la bulle en
   * cours d'ouverture (façon macOS : l'icône de catégorie remplace la loupe
   * une fois qu'on a "entré" dans un filtre).
   */
  barIcon = computed<IconName>(() => {
    const panel = this.openPanel();
    if (panel === 'country') return 'globe';
    if (panel === 'mode') return 'aa';
    return 'search';
  });

  private normalizedQuery = computed(() => this.query().trim().toLowerCase());

  /** Résultats directs : filtrés par pays/mode sélectionnés, puis par la requête. */
  private matches = computed<SpotlightItem[]>(() => {
    const q = this.normalizedQuery();
    if (!q) return [];
    const country = this.selectedCountry();
    const mode = this.selectedMode();
    return this.items().filter(it => {
      if (country && it.country !== country) return false;
      return mode === 'id' ? it.id.includes(q) : it.name.toLowerCase().includes(q);
    });
  });

  /**
   * Sections rendues. À vide → aucune (barre seule). Sinon une seule liste de
   * résultats directs. Chaque item porte son rang absolu, calculé ici une fois
   * → le template n'a aucune arithmétique d'index à faire.
   */
  sections = computed<Section[]>(() => {
    let rank = 0;
    const rankItems = (items: SpotlightItem[]): RankedItem[] =>
      items.map(item => ({ item, index: rank++ }));

    // À vide, la barre est SEULE (aucun dropdown) : les résultats
    // n'apparaissent qu'à la saisie.
    if (!this.normalizedQuery()) return [];
    const direct = this.matches().slice(0, this.maxResults());
    return direct.length ? [{ key: 'results', label: null, items: rankItems(direct) }] : [];
  });

  /** Liste plate des items visibles, pour la navigation clavier. */
  private flat = computed<RankedItem[]>(() => this.sections().flatMap(s => s.items));

  hasResults = computed(() => this.flat().length > 0);
  /** Aucun résultat après une saisie (≠ état vide initial). */
  emptyState = computed(() => !!this.normalizedQuery() && !this.hasResults());

  /**
   * Complétion inline (façon Spotlight macOS) : si le nom du résultat ACTIF
   * commence par la requête tapée, on propose le reste en texte fantôme dans la
   * barre. Accepté par Tab ou →. On préserve la casse d'origine du nom.
   */
  completion = computed<{ typed: string; ghost: string } | null>(() => {
    // Un panneau de filtre est ouvert : la barre ne cherche plus des entités, elle
    // filtre le panneau. Proposer un nom de buyer en texte fantôme n'aurait aucun
    // sens là — et Tab l'accepterait par-dessus le filtre en cours.
    if (this.openPanel()) return null;
    const raw = this.query();
    if (!raw || raw !== raw.trimStart()) return null; // pas de complétion si espace en tête
    const active = this.flat()[this.activeIndex()]?.item;
    if (!active) return null;
    const name = active.name;
    if (name.length <= raw.length) return null;
    // Préfixe insensible à la casse
    if (name.slice(0, raw.length).toLowerCase() !== raw.toLowerCase()) return null;
    return { typed: name.slice(0, raw.length), ghost: name.slice(raw.length) };
  });

  constructor() {
    // À chaque changement de requête, on ré-ancre la sélection sur le 1er item ;
    // et on focus le champ à l'ouverture.
    effect(() => {
      this.query();
      this.activeIndex.set(0);
    });
    effect(() => {
      if (this.open()) {
        queueMicrotask(() => this.inputEl()?.nativeElement.focus());
      }
    });
    // Verrouille le scroll de la page pendant que la palette est ouverte :
    // sans ça, l'apparition du panneau (position fixed) peut faire
    // apparaître/disparaître la scrollbar du document et provoquer un saut
    // visuel (glitch) au moment même de l'ouverture.
    effect(() => {
      document.body.style.overflow = this.open() ? 'hidden' : '';
    });
    inject(DestroyRef).onDestroy(() => {
      document.body.style.overflow = '';
      if (this.closingTimeoutId !== null) clearTimeout(this.closingTimeoutId);
      if (this.squishTimeoutId !== null) clearTimeout(this.squishTimeoutId);
      if (this.morphingTimeoutId !== null) clearTimeout(this.morphingTimeoutId);
    });
    // Squish liquide à CHAQUE changement de bulle ouverte (ouverture, retour,
    // bascule vers l'autre bulle) — pas seulement à l'ouverture. Ignore le
    // premier run (montage du composant, rien à animer).
    let firstRun = true;
    let prevPanel: FilterPanel = null;
    effect(() => {
      const panel = this.openPanel();
      if (firstRun) { firstRun = false; prevPanel = panel; return; }

      // Trois transitions possibles, et une seule mérite la fission :
      //   null → filtre   : la barre avale les bulles (fusion, MORPH_MS)
      //   filtre → filtre : la barre reste étendue, rien ne naît (squish seul)
      //   filtre → null   : les bulles renaissent de la matière → FISSION
      const collapsing = prevPanel !== null && panel === null;
      prevPanel = panel;

      this.squish.set(true);
      if (this.squishTimeoutId !== null) clearTimeout(this.squishTimeoutId);
      this.squishTimeoutId = setTimeout(() => this.squish.set(false), 120);

      // Couche liquide (goo) visible pendant tout le morph, derrière le
      // contenu réel (jamais masqué).
      this.morphing.set(true);
      this.fission.set(collapsing);
      if (this.morphingTimeoutId !== null) clearTimeout(this.morphingTimeoutId);
      this.morphingTimeoutId = setTimeout(() => {
        this.morphing.set(false);
        this.fission.set(false);
      }, collapsing ? FISSION_MS : MORPH_MS);
    });
  }

  isActive(index: number) { return this.activeIndex() === index; }

  onInput(ev: Event) {
    this.query.set((ev.target as HTMLInputElement).value);
  }

  // ── Bulles de filtre ──────────────────────────────────────────────────────
  togglePanel(panel: Exclude<FilterPanel, null>) {
    const current = this.openPanel();
    const next = current === panel ? null : panel;
    if (current) this.beginClosingAnimation(current);
    if (next === 'country' && current !== 'country') this.stashQuery();
    if (next !== 'country' && current === 'country') this.restoreQuery();
    this.openPanel.set(next);
    // Le focus reste sur la barre : c'est elle qui filtre le panneau pays.
    queueMicrotask(() => this.inputEl()?.nativeElement.focus());
  }

  /**
   * Panneau pays ouvert → la barre change de rôle (filtre de pays). On met la
   * requête métier de côté et on vide le champ, puis on la restitue à la
   * fermeture : sans ça, entrer dans le filtre écraserait la recherche en cours.
   */
  private stashedQuery: string | null = null;

  private stashQuery() {
    this.stashedQuery = this.query();
    this.query.set('');
  }

  private restoreQuery() {
    if (this.stashedQuery === null) return;
    this.query.set(this.stashedQuery);
    this.stashedQuery = null;
  }

  /**
   * Garde le panneau quitté monté (avec sa classe `--out`) le temps de sa
   * sortie. MORPH_MS et non une valeur plus courte : c'est la ligne de grille
   * qui le rogne, et la démonter avant la fin de ce morph laisserait disparaître
   * net le bandeau qu'il restait à refermer.
   */
  private beginClosingAnimation(panel: FilterPanel) {
    this.closingPanel.set(panel);
    if (this.closingTimeoutId !== null) clearTimeout(this.closingTimeoutId);
    this.closingTimeoutId = setTimeout(() => this.closingPanel.set(null), MORPH_MS);
  }

  pickCountry(code: FlagCode | null) {
    this.selectedCountry.set(code);
    this.closePanel();
  }

  pickMode(mode: SpotlightMode) {
    this.selectedMode.set(mode);
    this.closePanel();
  }

  /** Referme le panneau ouvert et rend le focus à la barre. Le chevron-retour l'appelle aussi. */
  closePanel() {
    const current = this.openPanel();
    if (current) this.beginClosingAnimation(current);
    if (current === 'country') this.restoreQuery();
    this.openPanel.set(null);
    queueMicrotask(() => this.inputEl()?.nativeElement.focus());
  }

  onKeydown(ev: KeyboardEvent) {
    if (!this.open()) return;

    // Un panneau de filtre est ouvert : Échap le referme, tout le reste
    // (navigation clavier de la liste) est ignoré tant qu'il est ouvert.
    if (this.openPanel()) {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        this.closePanel();
      }
      return;
    }

    switch (ev.key) {
      case 'Escape':
        ev.preventDefault();
        this.close();
        break;
      case 'ArrowDown':
        ev.preventDefault();
        this.move(1);
        break;
      case 'ArrowUp':
        ev.preventDefault();
        this.move(-1);
        break;
      case 'Tab':
      case 'ArrowRight': {
        // Tab / → : accepte la complétion fantôme si le curseur est en fin.
        const el = this.inputEl()?.nativeElement;
        const atEnd = el ? el.selectionStart === el.value.length : true;
        if (this.completion() && atEnd) {
          ev.preventDefault();
          this.acceptCompletion();
        }
        break;
      }
      case 'Enter': {
        ev.preventDefault();
        const entry = this.flat()[this.activeIndex()];
        if (entry) this.pick(entry.item);
        break;
      }
    }
  }

  /** Complète la requête avec le suffixe fantôme (nom complet du résultat actif). */
  private acceptCompletion() {
    const c = this.completion();
    if (!c) return;
    this.query.set(c.typed + c.ghost);
    queueMicrotask(() => {
      const el = this.inputEl()?.nativeElement;
      if (el) el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  private move(delta: number) {
    const n = this.flat().length;
    if (!n) return;
    this.activeIndex.update(i => (i + delta + n) % n);
  }

  pick(item: SpotlightItem) {
    this.selected.emit(item);
    this.close();
  }

  copy(ev: Event, item: SpotlightItem) {
    ev.stopPropagation();
    navigator.clipboard?.writeText(item.id).catch(() => {});
    this.copied.emit(item);
  }

  clear() {
    this.query.set('');
    this.inputEl()?.nativeElement.focus();
  }

  close() {
    // Fermeture pendant que le panneau pays est ouvert (clic backdrop) : la
    // requête mise de côté doit revenir, sinon elle est perdue en silence.
    if (this.openPanel() === 'country') this.restoreQuery();
    this.open.set(false);
    this.openPanel.set(null);
    this.closed.emit();
  }

  onBackdrop() { this.close(); }
}
