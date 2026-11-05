/**
 * Rejets de référence (retour métier du 2026-11-04, extraction v3) : trois cas
 * qui couvrent les trois façons de sortir d'un rejet.
 * 1. rec-1, identifiant en double : fusion des doublons hors du rejet, puis Delete.
 * 2. rec-4, code région non référencé : correction du champ dans le rejet, puis Resubmit.
 * 3. rec-5, fermeture de l'activité principale : inversion principale / secondaire
 *    sur la société, puis Resubmit tel quel.
 * Structure, codes et énumérations de l'extraction v3 ; noms de société,
 * identifiants, adresses et montants factices. Champs en cause = champs en rouge
 * dans l'extraction ; champs barrés = `notUsed` dans ADMIN_DATA_LAYOUT.
 * Suivent rec-2 (date de création, reportée sur la structure v3) et rec-3
 * (Payment History, structure v2 : rien n'y est barré).
 * Un nouveau jeu de données viendra : tout reste ici, rien dans les templates.
 */
import type { RejectField, RejectRecord, RejectResolution } from './reject-record.model';
import { REJECT_RECORDS } from './reject-records.data';
import { ADMIN_DATA_LAYOUT } from './reject-layout.data';

// ── Dataref Qirin ─────────────────────────────────────────────────────────────

export interface DatarefOption {
  code: string;
  name: string;
}

/** Codes région / état valides par pays : extrait factice du dataref Qirin
 *  (codes ISO 3166-2, à remplacer par le vrai dataref). */
export const REGION_DATAREF: Record<string, DatarefOption[]> = {
  GB: [
    { code: 'BDF', name: 'Bedford' },
    { code: 'BIR', name: 'Birmingham' },
    { code: 'BKM', name: 'Buckinghamshire' },
    { code: 'CAM', name: 'Cambridgeshire' },
    { code: 'LEC', name: 'Leicestershire' },
    { code: 'LIN', name: 'Lincolnshire' },
    { code: 'LND', name: 'London, City of' },
    { code: 'MIK', name: 'Milton Keynes' },
    { code: 'NNH', name: 'North Northamptonshire' },
    { code: 'OXF', name: 'Oxfordshire' },
    { code: 'WAR', name: 'Warwickshire' },
    { code: 'WNH', name: 'West Northamptonshire' },
  ],
};

// ── Construction des cas ──────────────────────────────────────────────────────

/** Champ renseigné dans un cas : valeur reçue, raison du rejet, liste dataref. */
type FieldPatch = string | Partial<Pick<RejectField, 'value' | 'error' | 'dataref'>>;

/** Un rejet Administrative Data sur la structure v3 : champs vides (ou à zéro
 *  comme dans l'extraction), puis les valeurs du cas, par numéro de champ. */
function adminReject(id: string, meta: Record<string, string>, values: Record<number, FieldPatch>,
                     resolution?: RejectResolution): RejectRecord {
  return {
    id,
    meta,
    resolution,
    blocks: ADMIN_DATA_LAYOUT.map(b => ({
      name: b.name,
      sections: b.sections.map(s => ({
        name: s.name,
        fields: s.fields.map(f => {
          const patch = values[f.n];
          return { ...f, ...(typeof patch === 'string' ? { value: patch } : patch) };
        }),
      })),
    })),
  };
}

// 1. Identifiant en double ─────────────────────────────────────────────────────
const DUP_ERROR = 'DUN 061234578 already belongs to Brazos Lab Supply Inc. (120734688)';

const DUPLICATE_ID = adminReject('rec-1', {
  'Sub-System': 'Administrative Data',
  'Reject Source': 'Functional',
  'Reject Type': 'Identifier DUN 061234578 already exists for another third party',
  'EHBU': 'ACI',
  'Provider ID': '30542851',
  'Date': '21/09/2026',
  'Euler Hermes ID': '120734519',
  'Country': 'US',
  'Identifier type': 'EULERID',
  'Identifier value': '120734519',
}, {
  1: 'AIDE', 2: '0140812345', 3: '0030542851', 4: '1', 6: '0000000003',
  8: '2026-09-21-06.03.11.000326',
  9: 'EULERID', 10: '120734519', 11: 'Brazos Lab Supply Inc.',
  14: '1200 Industrial Blvd', 15: 'Fort Worth', 17: '76177', 18: 'US',
  23: 'EN',
  36: { value: 'DUN', error: DUP_ERROR },
  37: { value: '061234578', error: DUP_ERROR },
}, {
  kind: 'delete',
  reason: 'DUN 061234578 already belongs to another company.',
  likelyCause: 'The company was probably created twice in Qirin: both records are the same buyer.',
  conflictingCompany: { name: 'Brazos Lab Supply Inc.', id: '120734688', country: 'US' },
  fieldsToCorrect: [],
  steps: [
    {
      text: 'Merge the two companies.',
      link: { label: 'Open company 120734688', href: '#/buyer-summary/120734688' },
      stub: {
        label: 'Start duplicate removal',
        title: 'Merge the 2 companies?',
        body: 'Duplicate removal merges Brazos Lab Supply Inc. (120734519) and Brazos Lab Supply Inc. (120734688) into one company, which keeps DUN 061234578. Prototype: the merge is simulated.',
        confirmLabel: 'Merge companies',
        done: 'Companies merged. This reject is now obsolete.',
      },
    },
    { text: 'Delete this reject, now obsolete.' },
  ],
});

// 2. Code région non référencé ─────────────────────────────────────────────────
const REGION_ERROR = 'NM is not a region code for GB in Qirin dataref';

const UNKNOWN_REGION = adminReject('rec-4', {
  'Sub-System': 'Administrative Data',
  'Reject Source': 'Functional',
  'Reject Type': 'The region/state code is not referenced for this country',
  'EHBU': 'TI',
  'Provider ID': '30542851',
  'Date': '16/10/2026',
  'Euler Hermes ID': '134612987',
  'Country': 'GB',
  'Identifier type': 'DUN',
  'Identifier value': '229876541',
}, {
  1: 'STHI', 2: '0140951234', 3: '0030542851', 4: '1',
  8: '2026-10-16-09.54.20.000657',
  9: 'DUN', 10: '229876541', 11: 'NORTHGATE ROOFING LTD',
  14: '12 MARKET STREET', 15: 'NORTHAMPTON',
  16: { value: 'NM', dataref: 'region', error: REGION_ERROR },
  17: 'NN1 2AB',
  18: { value: 'GB', error: 'The region is checked against this country' },
  20: 'C', 21: 'CESJU', 22: '16/10/2026', 23: 'EN',
  26: '25/07/2022', 27: '25/07/2022', 32: 'LTD',
  42: 'NORTHGATE ROOFING LTD', 44: '25/07/2022',
  81: '12 MARKET STREET', 83: 'NORTHAMPTON', 84: 'NM', 85: 'NN1 2AB', 87: 'GB',
  99: 'NORTHGATE ROOFING LTD', 101: '25/07/2022',
}, {
  kind: 'correct-and-resubmit',
  reason: 'Region code NM does not exist in Qirin dataref for Great Britain.',
  likelyCause: 'The provider takes its region codes from an external base that is not aligned with Qirin dataref.',
  fieldsToCorrect: [16],
  steps: [
    { text: 'Choose the right region code.', goToFields: true },
    { text: 'Resubmit.' },
  ],
});

// 3. Fermeture de l'activité principale ────────────────────────────────────────
const ACTIVITY_ERROR = 'SBI 6430 is the main activity of this company: only a secondary activity can be closed';

const MAIN_ACTIVITY = adminReject('rec-5', {
  'Sub-System': 'Administrative Data',
  'Reject Source': 'Functional',
  'Reject Type': 'A main activity cannot be closed',
  'EHBU': 'CBNL',
  'Provider ID': '30542851',
  'Date': '10/09/2026',
  'Euler Hermes ID': '87415532',
  'Country': 'NL',
  'Identifier type': 'EULERID',
  'Identifier value': '87415532',
}, {
  1: 'OACT', 2: '0140745678', 3: '0030542851', 4: '1', 6: '0000000002',
  8: '2026-09-10-11.07.59.000244',
  9: 'EULERID', 10: '87415532', 11: 'Heuvelland Golf B.V.',
  14: 'Kasteelweg', 15: 'Voerendaal', 17: '6367AB', 18: 'NL',
  23: 'EN',
  46: '0',
  47: { value: 'SBI', error: ACTIVITY_ERROR },
  48: { value: '6430', error: ACTIVITY_ERROR },
}, {
  kind: 'resubmit-as-is',
  reason: 'Activity 6430 (SBI) is the main activity: only a secondary one can be closed.',
  likelyCause: 'The activity exists twice on the company, as main and as secondary, under two nomenclatures. The integration removes one of them.',
  fieldsToCorrect: [],
  steps: [
    {
      text: 'Swap the main and the secondary activity.',
      link: { label: 'Open company activities', href: '#/admin-data' },
    },
    { text: 'Resubmit as is.' },
  ],
});

// rec-2 (extraction v2) reporté sur la structure v3, par nom technique ─────────
const V2_DATE = REJECT_RECORDS.find(r => r.id === 'rec-2')!;
const v2Values = new Map(V2_DATE.blocks.flatMap(b => b.sections.flatMap(s => s.fields)).map(f => [f.tech, f]));
const CREATION_DATE: RejectRecord = {
  ...adminReject(V2_DATE.id, V2_DATE.meta, {}),
  blocks: ADMIN_DATA_LAYOUT.map(b => ({
    name: b.name,
    sections: b.sections.map(s => ({
      name: s.name,
      fields: s.fields.map(f => {
        const old = v2Values.get(f.tech);
        return old ? { ...f, value: old.value, ...(old.error ? { error: old.error } : {}) } : f;
      }),
    })),
  })),
  resolution: {
    kind: 'correct-and-resubmit',
    reason: 'The creation date (01/12/2026) is after the date the reject was received.',
    steps: [
      { text: 'Enter the real creation date.', goToFields: true },
      { text: 'Resubmit.' },
    ],
  },
};

/** Tous les messages : les trois cas de référence en tête. */
export const REJECT_CASES: RejectRecord[] = [
  DUPLICATE_ID,
  UNKNOWN_REGION,
  MAIN_ACTIVITY,
  CREATION_DATE,
  REJECT_RECORDS.find(r => r.id === 'rec-3')!,
];
