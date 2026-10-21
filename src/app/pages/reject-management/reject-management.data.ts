/** Données factices de Reject Management : quelques rejets par catégorie. */

export type RejectCategory = 'functional' | 'technical' | 'maintenance';

export interface Reject {
  id: string;
  category: RejectCategory;
  type: string;
  bu: string;
  provId: string;
  buyerId: string;
  idType: string;
  idValue: string;
  /** ISO, affiché "27 jul 2026" comme dans Figma. */
  date: string;
  country: string;
}

/** Colonnes du tableau, dans l'ordre de Figma. */
export type RejectColumn = 'type' | 'bu' | 'provId' | 'buyerId' | 'idType' | 'idValue' | 'date' | 'country';

export const REJECT_COLUMNS: { key: RejectColumn; title: string }[] = [
  { key: 'type',    title: 'Type' },
  { key: 'bu',      title: 'BU' },
  { key: 'provId',  title: 'Prov ID' },
  { key: 'buyerId', title: 'Buyer ID' },
  { key: 'idType',  title: 'ID Type' },
  { key: 'idValue', title: 'ID value' },
  { key: 'date',    title: 'Date' },
  { key: 'country', title: 'Ctry' },
];

/** Totaux affichés dans les onglets (Figma), la liste n'en montre qu'une page. */
export const REJECT_TOTALS: Record<'all' | RejectCategory, number> = {
  all: 1024,
  functional: 154,
  technical: 452,
  maintenance: 418,
};

let n = 0;
function r(category: RejectCategory, type: string, bu: string, provId: string, buyerId: string,
           idType: string, idValue: string, date: string, country: string): Reject {
  return { id: `rej-${++n}`, category, type, bu, provId, buyerId, idType, idValue, date, country };
}

export const REJECTS: Reject[] = [
  r('functional',  'Contract P2000044 is invalid',    'CBNL',   '0',     '110630689', 'CON',   'CBNL 200004400/', '2026-07-27', 'N/A'),
  r('functional',  'Contract P2000051 is invalid',    'CBNL',   '0',     '110630702', 'CON',   'CBNL 200005100/', '2026-07-27', 'N/A'),
  r('functional',  'Buyer limit exceeds policy cap',  'AT USA', '41208', '207815533', 'DUNS',  '080131726',       '2026-07-26', 'US'),
  r('functional',  'Unknown policy extension 07',     'AT FR',  '0',     '137381425', 'SIREN', '552100554',       '2026-07-25', 'FR'),
  r('technical',   'Mandatory ID value missing',      'CBNL',   '12087', '110630689', 'CON',   'N/A',             '2026-07-27', 'NL'),
  r('technical',   'Duplicate message received',      'AT DE',  '30551', '404117820', 'HRB',   'HRB 86891',       '2026-07-26', 'DE'),
  r('technical',   'Date format not recognised',      'AT IT',  '0',     '512209347', 'VAT',   'IT02727210343',   '2026-07-24', 'IT'),
  r('technical',   'Payload exceeds size limit',      'AT UK',  '77310', '608843112', 'CRN',   '00445790',        '2026-07-23', 'GB'),
  r('maintenance', 'Buyer 110630689 is closed',       'CBNL',   '0',     '110630689', 'CON',   'CBNL 200004400/', '2026-07-27', 'N/A'),
  r('maintenance', 'Address update pending review',   'AT FR',  '18842', '137381426', 'SIREN', '775670417',       '2026-07-26', 'FR'),
  r('maintenance', 'Merged buyer, old ID still used', 'AT ES',  '0',     '701553290', 'NIF',   'A28015865',       '2026-07-22', 'ES'),
];
