// Données de maquette de Portfolio Management.

/** Un acheteur du référentiel. L'identifiant est la clé, le nom sert à chercher. */
export interface Buyer {
  id: string;
  name: string;
}

export interface Portfolio {
  /** Identifiant technique, stable même si le titulaire est renommé. */
  id: string;
  /** Titulaire du portefeuille, au format login de l'application. */
  owner: string;
  /**
   * Acheteurs rattachés. C'est une liste et pas un compteur : le tableau affiche
   * sa longueur et la modale de mise à jour manipule les mêmes identifiants. Deux
   * vérités séparées finiraient par diverger pour rien.
   */
  buyerIds: string[];
}

/**
 * Référentiel d'acheteurs. Sert à deux choses : la colonne « Current buyers »
 * d'un portefeuille, et la colonne « Available buyers », qui est simplement le
 * reste du référentiel.
 */
export const BUYERS: Buyer[] = [
  { id: '137381425', name: 'VOLVO GROUP AB' },
  { id: '258094117', name: 'STORA ENSO OYJ' },
  { id: '419002733', name: 'EQUINOR ASA' },
  { id: '560118904', name: 'NOKIA OYJ' },
  { id: '604411290', name: 'ORSTED A/S' },
  { id: '671203845', name: 'MAERSK A/S' },
  { id: '702938411', name: 'SANDVIK AB' },
  { id: '733901284', name: 'KONE OYJ' },
  { id: '780112934', name: 'YARA INTERNATIONAL ASA' },
  { id: '812004573', name: 'NESTE OYJ' },
  { id: '859913002', name: 'SSAB AB' },
  { id: '901284773', name: 'TELENOR ASA' },
  { id: '118002934', name: 'ATLAS COPCO AB' },
  { id: '129384756', name: 'ERICSSON AB' },
  { id: '143092881', name: 'ELECTROLUX AB' },
  { id: '155201947', name: 'SKANSKA AB' },
  { id: '168447120', name: 'SCANIA AB' },
  { id: '172930845', name: 'HUSQVARNA AB' },
  { id: '188402113', name: 'ALFA LAVAL AB' },
  { id: '195028447', name: 'ASSA ABLOY AB' },
  { id: '203871129', name: 'SECURITAS AB' },
  { id: '214009382', name: 'TELIA COMPANY AB' },
  { id: '228104773', name: 'SWEDBANK AB' },
  { id: '233948210', name: 'NORSK HYDRO ASA' },
  { id: '247100583', name: 'AKER BP ASA' },
  { id: '259038411', name: 'SCHIBSTED ASA' },
  { id: '266401925', name: 'DNB BANK ASA' },
  { id: '271839004', name: 'GJENSIDIGE FORSIKRING ASA' },
  { id: '288120347', name: 'WARTSILA OYJ' },
  { id: '293004881', name: 'FORTUM OYJ' },
  { id: '304118002', name: 'UPM-KYMMENE OYJ' },
  { id: '318290047', name: 'METSO OYJ' },
  { id: '327004119', name: 'CARGOTEC OYJ' },
  { id: '339118240', name: 'VESTAS WIND SYSTEMS A/S' },
  { id: '348200731', name: 'NOVOZYMES A/S' },
  { id: '355019284', name: 'CARLSBERG A/S' },
  { id: '361284007', name: 'DSV A/S' },
  { id: '374900218', name: 'PANDORA A/S' },
  { id: '388102944', name: 'TRYG A/S' },
  { id: '397210058', name: 'ISS A/S' },
  // Suite du référentiel, ajoutée pour que les portefeuilles des autres titulaires
  // aient un contenu crédible : sans elle, sept portefeuilles sur huit tiendraient
  // une ou deux lignes et le périmètre consulté ne montrerait rien.
  { id: '401238877', name: 'SAAB AB' },
  { id: '412990031', name: 'ICA GRUPPEN AB' },
  { id: '427104558', name: 'HEXAGON AB' },
  { id: '438201976', name: 'EPIROC AB' },
  { id: '445930112', name: 'SKF AB' },
  { id: '457018834', name: 'TRELLEBORG AB' },
  { id: '468290047', name: 'NIBE INDUSTRIER AB' },
  { id: '473118206', name: 'SVENSKA CELLULOSA AB' },
  { id: '486004921', name: 'BOLIDEN AB' },
  { id: '495210773', name: 'HOLMEN AB' },
  { id: '502881034', name: 'KONGSBERG GRUPPEN ASA' },
  { id: '517093428', name: 'TOMRA SYSTEMS ASA' },
  { id: '526410095', name: 'ORKLA ASA' },
  { id: '538220741', name: 'MOWI ASA' },
  { id: '549001836', name: 'SALMAR ASA' },
  { id: '553928410', name: 'VEIDEKKE ASA' },
  { id: '568104227', name: 'ELKEM ASA' },
  { id: '574290118', name: 'BORREGAARD ASA' },
  { id: '589003641', name: 'GALP ENERGIA SGPS SA' },
  { id: '597118250', name: 'JERONIMO MARTINS SGPS SA' },
  { id: '608291043', name: 'EDP RENOVAVEIS SA' },
  { id: '615004778', name: 'SONAE SGPS SA' },
  { id: '627310982', name: 'SIEMENS ENERGY AG' },
  { id: '634128005', name: 'HENKEL AG' },
  { id: '648290117', name: 'BRENNTAG SE' },
  { id: '659003428', name: 'BABCOCK INTERNATIONAL GROUP PLC' },
];

/** Index par identifiant, pour retrouver un nom sans parcourir la liste. */
export const BUYERS_BY_ID: Map<string, Buyer> = new Map(BUYERS.map(b => [b.id, b]));

/**
 * Portefeuilles existants. `A.VERSE` reste le portefeuille de tête, celui de
 * l'écran legacy. Les sept autres couvrent plusieurs équipes et plusieurs pays :
 * sans eux, « Select another portfolio » proposerait treize titulaires dont un
 * seul aurait quelque chose à montrer.
 *
 * Invariant : un acheteur n'appartient qu'à un portefeuille à la fois. Les huit
 * acheteurs que `UPLOADED_ASSIGNMENTS` déclare `from: null` restent libres, sinon
 * appliquer le fichier les rattacherait deux fois. `J.DAHAN` et `M.LEROY` restent
 * sans portefeuille, ce sont ceux que le fichier crée ; `C.MARTIN`, `R.HANSEN` et
 * `H.SILVA` aussi, pour que le périmètre vide reste démontrable.
 */
export const PORTFOLIOS: Portfolio[] = [
  {
    id: 'PF-0002',
    owner: 'A.VERSE',
    buyerIds: [
      '137381425', '258094117', '419002733', '560118904',
      '118002934', '129384756', '143092881', '155201947',
      '168447120', '172930845', '188402113', '195028447',
      '203871129', '214009382', '228104773', '233948210',
      '247100583', '259038411', '266401925', '271839004',
      '288120347', '293004881',
    ],
  },
  {
    id: 'PF-0003',
    owner: 'E.DUBOIS',
    buyerIds: [
      '304118002', '318290047', '327004119',
      '339118240', '348200731', '355019284',
    ],
  },
  {
    id: 'PF-0004',
    owner: 'P.MOREAU',
    buyerIds: ['361284007', '374900218', '388102944', '397210058'],
  },
  {
    id: 'PF-0005',
    owner: 'S.OLSEN',
    buyerIds: [
      '502881034', '517093428', '526410095', '538220741',
      '549001836', '553928410', '568104227',
    ],
  },
  {
    id: 'PF-0006',
    owner: 'T.BERG',
    buyerIds: ['574290118', '401238877', '412990031', '427104558', '438201976'],
  },
  {
    id: 'PF-0007',
    owner: 'L.PEREIRA',
    buyerIds: ['589003641', '597118250', '608291043', '615004778', '445930112'],
  },
  {
    id: 'PF-0008',
    owner: 'K.NIELSEN',
    buyerIds: ['627310982', '634128005', '648290117', '457018834'],
  },
  {
    id: 'PF-0009',
    owner: 'O.WRIGHT',
    buyerIds: ['659003428', '468290047', '473118206', '486004921', '495210773'],
  },
];

/**
 * Pays du périmètre UATR. Texte volontairement, pas un `FlagCode` : le registre de
 * drapeaux ne couvre pas tous les pays nordiques et un drapeau manquant sur une
 * ligne suffirait à faire douter du filtre.
 */
export type PortfolioCountry = 'France' | 'Norway' | 'Portugal' | 'Germany' | 'United Kingdom';

export const PORTFOLIO_COUNTRIES: PortfolioCountry[] =
  ['France', 'Germany', 'Norway', 'Portugal', 'United Kingdom'];

/** Une équipe d'analystes. Un pays par équipe, comme dans l'application legacy. */
export interface PortfolioTeam {
  id: string;
  name: string;
  country: PortfolioCountry;
}

/**
 * Un utilisateur qui peut porter un portefeuille. Il appartient à une équipe, et
 * c'est l'équipe qui porte le pays : deux vérités sur le pays finiraient par
 * diverger, et le filtre par pays devrait choisir laquelle croire.
 */
export interface PortfolioUser {
  /** Login applicatif, tel qu'il apparaît dans la colonne « Portfolio of ». */
  login: string;
  fullName: string;
  teamId: string;
}

export const PORTFOLIO_TEAMS: PortfolioTeam[] = [
  { id: 'TEAM-01', name: 'Group 1 UATR',      country: 'France' },
  { id: 'TEAM-02', name: 'Group 2 UATR',      country: 'France' },
  { id: 'TEAM-03', name: 'Group UATR 20',     country: 'Norway' },
  { id: 'TEAM-04', name: 'Group Demo UATR 3', country: 'Portugal' },
  { id: 'TEAM-05', name: 'Group 4 UATR',      country: 'Germany' },
  { id: 'TEAM-06', name: 'Group UK UATR',     country: 'United Kingdom' },
];

export const PORTFOLIO_TEAMS_BY_ID: Map<string, PortfolioTeam> =
  new Map(PORTFOLIO_TEAMS.map(t => [t.id, t]));

/**
 * Annuaire des titulaires possibles. `A.VERSE`, `J.DAHAN` et `M.LEROY` doivent y
 * figurer : ce sont les trois logins que le tableau et le fichier d'affectations
 * emploient déjà.
 */
export const PORTFOLIO_USERS: PortfolioUser[] = [
  { login: 'A.VERSE',   fullName: 'Alain Verse',      teamId: 'TEAM-01' },
  { login: 'E.DUBOIS',  fullName: 'Elise Dubois',     teamId: 'TEAM-01' },
  { login: 'P.MOREAU',  fullName: 'Paul Moreau',      teamId: 'TEAM-01' },
  { login: 'J.DAHAN',   fullName: 'Jonathan Dahan',   teamId: 'TEAM-02' },
  { login: 'C.MARTIN',  fullName: 'Claire Martin',    teamId: 'TEAM-02' },
  { login: 'S.OLSEN',   fullName: 'Sigrid Olsen',     teamId: 'TEAM-03' },
  { login: 'T.BERG',    fullName: 'Tore Berg',        teamId: 'TEAM-03' },
  { login: 'R.HANSEN',  fullName: 'Rikke Hansen',     teamId: 'TEAM-03' },
  { login: 'L.PEREIRA', fullName: 'Luis Pereira',     teamId: 'TEAM-04' },
  { login: 'H.SILVA',   fullName: 'Helena Silva',     teamId: 'TEAM-04' },
  { login: 'M.LEROY',   fullName: 'Marc Leroy',       teamId: 'TEAM-05' },
  { login: 'K.NIELSEN', fullName: 'Katrin Nielsen',   teamId: 'TEAM-05' },
  { login: 'O.WRIGHT',  fullName: 'Olivia Wright',    teamId: 'TEAM-06' },
];

/**
 * Périmètre consulté : un utilisateur ou une équipe. Le tableau se filtre sur
 * `owners`, ce qui rend les deux cas identiques côté page. Les compteurs sont
 * calculés à partir des portefeuilles réels, jamais écrits en dur : appliquer un
 * fichier d'affectations les change.
 */
export interface PortfolioScope {
  kind: 'user' | 'team';
  /** Login pour un utilisateur, identifiant d'équipe pour une équipe. */
  id: string;
  /** Ce que porte la ligne et, après bascule, le titre de page. */
  label: string;
  /** Nom complet du titulaire. Vide pour une équipe. */
  fullName: string;
  /** Équipe du titulaire ; pour une équipe, son propre nom. */
  teamName: string;
  country: PortfolioCountry;
  /** Logins couverts par le périmètre. */
  owners: string[];
  /** Membres du périmètre : 1 pour un utilisateur, N pour une équipe. */
  userCount: number;
  /** Portefeuilles réellement existants dans le périmètre. */
  portfolioCount: number;
  /** Acheteurs détenus, tous portefeuilles du périmètre confondus. */
  buyerCount: number;
  /**
   * Tout ce qui nomme le périmètre, en une chaîne. La recherche tape là-dedans :
   * on retrouve un collègue par son login, son nom, son équipe ou son pays sans
   * avoir à choisir le bon champ.
   */
  haystack: string;
}

/** Une ligne du fichier d'affectations : cet acheteur va dans ce portefeuille. */
export interface Assignment {
  buyerId: string;
  buyerName: string;
  /** Portefeuille actuel, `null` si l'acheteur n'était rattaché à personne. */
  from: string | null;
  /** Portefeuille demandé par le fichier. */
  to: string;
}

/**
 * Contenu simulé du fichier Excel. Aucun parsing réel : n'importe quel fichier
 * accepté rend ce lot. Quatre lignes sur douze touchent un acheteur déjà
 * rattaché, ce sont elles que l'écran fait valider avant d'appliquer. Les douze
 * identifiants existent dans `BUYERS`, sinon appliquer le fichier créerait des
 * acheteurs que la modale de mise à jour ne saurait pas nommer.
 */
export const UPLOADED_ASSIGNMENTS: Assignment[] = [
  { buyerId: '137381425', buyerName: 'VOLVO GROUP AB',         from: 'A.VERSE', to: 'J.DAHAN' },
  { buyerId: '258094117', buyerName: 'STORA ENSO OYJ',         from: 'A.VERSE', to: 'M.LEROY' },
  { buyerId: '419002733', buyerName: 'EQUINOR ASA',            from: 'A.VERSE', to: 'J.DAHAN' },
  { buyerId: '560118904', buyerName: 'NOKIA OYJ',              from: 'A.VERSE', to: 'M.LEROY' },
  { buyerId: '604411290', buyerName: 'ORSTED A/S',             from: null,      to: 'J.DAHAN' },
  { buyerId: '671203845', buyerName: 'MAERSK A/S',             from: null,      to: 'J.DAHAN' },
  { buyerId: '702938411', buyerName: 'SANDVIK AB',             from: null,      to: 'J.DAHAN' },
  { buyerId: '733901284', buyerName: 'KONE OYJ',               from: null,      to: 'J.DAHAN' },
  { buyerId: '780112934', buyerName: 'YARA INTERNATIONAL ASA', from: null,      to: 'J.DAHAN' },
  { buyerId: '812004573', buyerName: 'NESTE OYJ',              from: null,      to: 'M.LEROY' },
  { buyerId: '859913002', buyerName: 'SSAB AB',                from: null,      to: 'M.LEROY' },
  { buyerId: '901284773', buyerName: 'TELENOR ASA',            from: null,      to: 'M.LEROY' },
];
