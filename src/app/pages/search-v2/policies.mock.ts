import {
  policyId, type SignedPolicy, type DraftPolicy, type PolicyResultData,
} from '../../shared/ui/policy-result-card/policy.model';

/** Date ISO à n jours d'aujourd'hui : la démo ne vieillit pas (renouvellements proches, etc.). */
function isoInDays(n: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

type SignedInput = Omit<SignedPolicy, 'id' | 'kind'>;
type DraftInput = Omit<DraftPolicy, 'id' | 'kind'>;

function pol(p: SignedInput): SignedPolicy {
  const data = { ...p, kind: 'policy' as const };
  return { ...data, id: policyId(data) };
}

function dft(p: DraftInput): DraftPolicy {
  const data = { ...p, kind: 'draft' as const };
  return { ...data, id: policyId(data) };
}

const MARSH = { brokerName: 'Marsh Ltd', brokerCompanyId: '80011290' };
const AON = { brokerName: 'Aon Risk Solutions', brokerCompanyId: '80022417' };

/** Assurés repris des buyers du mock : la démo reste cohérente. Chaque cas de
 *  la réunion du 27 octobre a au moins une police qui l'illustre. */
export const POLICIES: PolicyResultData[] = [
  // Même assuré, deux polices : une CAP et une Partial non-can (cas « sibling »)
  pol({ buCode: 'AT USA', policyNumber: 'C5012346', extension: '01', status: 'issued',
    policyName: 'Brooklyn Craft Goods Export', insuredName: 'Brooklyn Craft Goods LLC', insuredCompanyId: '10045521',
    insuredCountry: 'United States', product: 'CAP', segment: 'Mid Market', lob: 'Whole Turnover', ...MARSH,
    inceptionDate: isoInDays(-347), expiryDate: isoInDays(18), nextRenewalDate: isoInDays(18), inforceBu: 'AT USA' }),
  pol({ buCode: 'AT USA', policyNumber: 'C5012346', extension: '00', status: 'expired',
    policyName: 'Brooklyn Craft Goods Export', insuredName: 'Brooklyn Craft Goods LLC', insuredCompanyId: '10045521',
    insuredCountry: 'United States', product: 'CAP', segment: 'Mid Market', lob: 'Whole Turnover', ...MARSH,
    inceptionDate: isoInDays(-712), expiryDate: isoInDays(-347), inforceBu: 'AT USA' }),
  pol({ buCode: 'AT USA', policyNumber: 'N5012347', extension: null, status: 'issued',
    policyName: 'Brooklyn Craft Goods Non-Can', insuredName: 'Brooklyn Craft Goods LLC', insuredCompanyId: '10045521',
    insuredCountry: 'United States', product: 'Partial non-can', segment: 'Mid Market', lob: 'Single Risk', ...MARSH,
    inceptionDate: isoInDays(-120), expiryDate: isoInDays(245), nextRenewalDate: isoInDays(245), inforceBu: 'AT USA' }),

  // « food » : nom de police et nom d'assuré
  pol({ buCode: 'AT USA', policyNumber: 'C5012390', extension: null, status: 'issued',
    policyName: 'Atlantic Seafood Imports US', insuredName: 'Atlantic Seafood Imports Inc', insuredCompanyId: '10078812',
    insuredCountry: 'United States', product: 'CAP+', segment: 'Large Corporate', lob: 'Whole Turnover', ...AON,
    inceptionDate: isoInDays(-240), expiryDate: isoInDays(125), nextRenewalDate: isoInDays(125), inforceBu: 'AT USA' }),
  pol({ buCode: 'AT USA', policyNumber: 'C5012391', extension: null, status: 'cancelled',
    policyName: 'Atlantic Seafood Domestic', insuredName: 'Atlantic Seafood Imports Inc', insuredCompanyId: '10078812',
    insuredCountry: 'United States', product: 'CAP', ...AON,
    inceptionDate: isoInDays(-600), expiryDate: isoInDays(-235), cancellationDate: isoInDays(-410) }),

  // Extensions nombreuses, une extension à zéros
  pol({ buCode: 'AT UK', policyNumber: 'C7730012', extension: '0234', status: 'issued',
    policyName: 'Northwind Trading Domestic', insuredName: 'Northwind Trading Ltd', insuredCompanyId: '20031455',
    insuredCountry: 'United Kingdom', product: 'CAP', segment: 'SME', lob: 'Whole Turnover', ...MARSH,
    inceptionDate: isoInDays(-200), expiryDate: isoInDays(165), nextRenewalDate: isoInDays(165), inforceBu: 'AT UK' }),
  pol({ buCode: 'AT UK', policyNumber: 'C7730012', extension: '0233', status: 'expired',
    policyName: 'Northwind Trading Domestic', insuredName: 'Northwind Trading Ltd', insuredCompanyId: '20031455',
    insuredCountry: 'United Kingdom', product: 'CAP', segment: 'SME', lob: 'Whole Turnover', ...MARSH,
    inceptionDate: isoInDays(-565), expiryDate: isoInDays(-200), inforceBu: 'AT UK' }),
  // Sans extension, sans segment ni LOB (hors Compass)
  pol({ buCode: 'AT UK', policyNumber: 'C7730250', extension: null, status: 'issued',
    policyName: 'Galaxy Pharma Distribution', insuredName: 'Galaxy Pharma Distribution Ltd', insuredCompanyId: '40213377',
    insuredCountry: 'United Kingdom', product: 'CAP', ...AON,
    inceptionDate: isoInDays(-130), expiryDate: isoInDays(235), nextRenewalDate: isoInDays(235), inforceBu: 'AT UK' }),

  // Les Italiens : '1' et '001' sont deux extensions différentes
  pol({ buCode: 'AT Italy', policyNumber: 'C4410087', extension: '1', status: 'issued',
    policyName: 'Verde Agricoltura Export', insuredName: 'Verde Agricoltura SpA', insuredCompanyId: '30098210',
    insuredCountry: 'Italy', product: 'CAP', segment: 'Mid Market', lob: 'Single Risk',
    inceptionDate: isoInDays(-90), expiryDate: isoInDays(275), nextRenewalDate: isoInDays(275), inforceBu: 'AT Italy' }),
  pol({ buCode: 'AT Italy', policyNumber: 'C4410087', extension: '001', status: 'issued',
    policyName: 'Verde Agricoltura Domestic', insuredName: 'Verde Agricoltura SpA', insuredCompanyId: '30098210',
    insuredCountry: 'Italy', product: 'CAP', segment: 'Mid Market', lob: 'Whole Turnover',
    inceptionDate: isoInDays(-90), expiryDate: isoInDays(275), nextRenewalDate: isoInDays(275), inforceBu: 'AT Italy' }),

  // Même n° dans deux BU
  pol({ buCode: 'AT Belgium', policyNumber: 'C3301174', extension: null, status: 'issued',
    policyName: 'Immobilière du Marais Benelux', insuredName: 'Immobilière du Marais', insuredCompanyId: '50011873',
    insuredCountry: 'Belgium', product: 'CAP', segment: 'SME', lob: 'Whole Turnover',
    inceptionDate: isoInDays(-300), expiryDate: isoInDays(65), nextRenewalDate: isoInDays(65), inforceBu: 'AT Belgium' }),
  pol({ buCode: 'AT Brazil', policyNumber: 'C3301174', extension: null, status: 'issued',
    policyName: 'Iberia Food & Coffee Brasil', insuredName: 'Iberia Cafés y Tostados SL', insuredCompanyId: '60044129',
    insuredCountry: 'Spain', product: 'CAP+', segment: 'Mid Market', lob: 'Single Risk', ...AON,
    inceptionDate: isoInDays(-60), expiryDate: isoInDays(305), nextRenewalDate: isoInDays(305), inforceBu: 'AT Brazil' }),
  pol({ buCode: 'AT Belgium', policyNumber: 'C3301175', extension: '01', status: 'cancelled',
    policyName: 'Le Marais Retail', insuredName: 'Le Marais SARL', insuredCompanyId: '50011902',
    insuredCountry: 'France', product: 'CAP',
    inceptionDate: isoInDays(-500), expiryDate: isoInDays(-135), cancellationDate: isoInDays(-250) }),

  // Renouvellement dépassé, toujours Issued
  pol({ buCode: 'Acredia', policyNumber: 'C1100458', extension: null, status: 'issued',
    policyName: 'Nordsee Logistik Group', insuredName: 'Nordsee Logistik GmbH', insuredCompanyId: '70020034',
    insuredCountry: 'Germany', product: 'CAP', segment: 'Large Corporate', lob: 'Whole Turnover', ...MARSH,
    inceptionDate: isoInDays(-370), expiryDate: isoInDays(360), nextRenewalDate: isoInDays(-5), inforceBu: 'Acredia' }),
  pol({ buCode: 'Acredia', policyNumber: 'N1100459', extension: '01', status: 'issued',
    policyName: 'Danube Textiles Non-Can', insuredName: 'Danube Textiles Kft', insuredCompanyId: '70020177',
    insuredCountry: 'Hungary', product: 'Partial non-can',
    inceptionDate: isoInDays(-45), expiryDate: isoInDays(320), nextRenewalDate: isoInDays(320), inforceBu: 'Acredia' }),
  pol({ buCode: 'Acredia', policyNumber: 'C1100460', extension: null, status: 'cancelled',
    policyName: 'Stahlbau Müller Export', insuredName: 'Stahlbau Müller AG', insuredCompanyId: '70020301',
    insuredCountry: 'Switzerland', product: 'CAP',
    inceptionDate: isoInDays(-420), expiryDate: isoInDays(-55), cancellationDate: isoInDays(-150) }),

  // Fronted : BU AT USA, risque porté ailleurs ; sans segment ni LOB
  pol({ buCode: 'AT USA', policyNumber: 'C5012510', extension: null, status: 'issued',
    policyName: 'Helvetia Watch Components US', insuredName: 'Helvetia Watch Components', insuredCompanyId: '10091544',
    insuredCountry: 'Switzerland', product: 'CAP',
    inceptionDate: isoInDays(-20), expiryDate: isoInDays(345), nextRenewalDate: isoInDays(345), inforceBu: 'AT Brazil' }),

  // Drafts : un résultat par draft, étape atteinte et statut de la dernière version,
  // nombre de versions (APP comprise). Numéros en D (nouvelle nomenclature) ou en C,
  // comme dans l'existant.
  dft({ buCode: 'AT UK', policyNumber: 'D20431', extension: null, draftStage: 'nbi', status: 'pending', versionCount: 3,
    policyName: 'Nordic Food Supply', insuredName: 'Polaris Tech Nordic AB', insuredCompanyId: '20087731',
    insuredCountry: 'Sweden', product: 'CAP', segment: 'SME', lob: 'Core', ...MARSH,
    inceptionDate: isoInDays(65), expiryDate: isoInDays(430), inforceBu: 'AT UK' }),
  // Prospect resté au stade applicant
  dft({ buCode: 'AT UK', policyNumber: 'D20432', extension: null, draftStage: 'app', status: 'issued', versionCount: 1,
    policyName: 'Polaris Tech Nordic Export', insuredName: 'Polaris Tech Nordic AB', insuredCompanyId: '20087731',
    insuredCountry: 'Sweden', product: 'CAP',
    inceptionDate: isoInDays(95), expiryDate: isoInDays(460) }),
  dft({ buCode: 'AT Belgium', policyNumber: 'C10009627', extension: null, draftStage: 'nbi', status: 'inactive', versionCount: 3,
    policyName: 'Aurora Solar Benelux', insuredName: 'Aurora Solar Solutions BV', insuredCompanyId: '50077120',
    insuredCountry: 'Netherlands', product: 'CAP+', segment: 'STCI', lob: 'Core',
    inceptionDate: isoInDays(-57), expiryDate: isoInDays(308), inforceBu: 'AT Belgium' }),
  dft({ buCode: 'AT Belgium', policyNumber: 'D10009627', extension: null, draftStage: 'nbi', status: 'returned', versionCount: 2,
    policyName: 'Aurora Solar Wallonie', insuredName: 'Aurora Solar Solutions BV', insuredCompanyId: '50077120',
    insuredCountry: 'Netherlands', product: 'CAP',
    inceptionDate: isoInDays(35), expiryDate: isoInDays(400), inforceBu: 'AT Belgium' }),
  // NBI qui a donné lieu à la police N5012347
  dft({ buCode: 'AT USA', policyNumber: 'D20434', extension: null, draftStage: 'nbi', status: 'transformed', versionCount: 4,
    policyName: 'Brooklyn Craft Goods Non-Can', insuredName: 'Brooklyn Craft Goods LLC', insuredCompanyId: '10045521',
    insuredCountry: 'United States', product: 'Partial non-can', segment: 'Mid Market', lob: 'Single Risk', ...MARSH,
    inceptionDate: isoInDays(-120), expiryDate: isoInDays(245), inforceBu: 'AT USA' }),
  dft({ buCode: 'Acredia', policyNumber: 'D20435', extension: null, draftStage: 'nbi', status: 'aborted', versionCount: 47,
    policyName: 'Mistral Énergie France', insuredName: 'Mistral Énergie Renouvelable', insuredCountry: 'France', product: 'CAP',
    inceptionDate: isoInDays(-30), expiryDate: isoInDays(335) }),
];
