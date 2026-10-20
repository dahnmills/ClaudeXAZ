import type { PolicyResultData, PolicyKind, PolicyStatus } from '../../shared/ui/policy-result-card/policy.model';

/** Fabrique compacte : une ligne par police dans la table ci-dessous. */
function p(
  policyNumber: string, extension: string, kind: PolicyKind, status: PolicyStatus | null,
  policyholder: string, buCode: string, effectiveDate: string, expiryDate: string,
  covered: string, currency: string, buyers: number,
): PolicyResultData {
  return {
    id: `${policyNumber}-${extension}`,
    policyNumber, extension, kind, status, policyholder, buCode, effectiveDate, expiryDate,
    details: [
      { label: 'Covered amount', value: covered },
      { label: 'Currency',       value: currency },
      { label: 'Covered buyers', value: String(buyers) },
    ],
  };
}

/** Policyholders repris des buyers du mock V1 : la démo reste cohérente. */
export const POLICIES: PolicyResultData[] = [
  p('5012346', '01', 'policy', 'issued',    'Brooklyn Craft Goods LLC',     'AT USA',     '01 Jan 2026', '31 Dec 2026', '$2 000 000',   'USD', 14),
  p('5012346', '00', 'policy', 'expired',   'Brooklyn Craft Goods LLC',     'AT USA',     '01 Jan 2025', '31 Dec 2025', '$1 500 000',   'USD', 11),
  p('5012390', '00', 'policy', 'issued',    'Atlantic Seafood Imports Inc', 'AT USA',     '01 Mar 2026', '28 Feb 2027', '$3 200 000',   'USD', 22),
  p('5012391', '00', 'policy', 'cancelled', 'Atlantic Seafood Imports Inc', 'AT USA',     '01 Mar 2024', '28 Feb 2025', '$900 000',     'USD', 6),
  p('7730012', '02', 'policy', 'issued',    'Northwind Trading Ltd',        'AT UK',      '01 Apr 2026', '31 Mar 2027', '£1 800 000',   'GBP', 9),
  p('7730012', '01', 'policy', 'expired',   'Northwind Trading Ltd',        'AT UK',      '01 Apr 2025', '31 Mar 2026', '£1 600 000',   'GBP', 8),
  p('7730250', '00', 'policy', 'issued',    'Galaxy Pharma Distribution',   'AT UK',      '15 Jun 2026', '14 Jun 2027', '€2 400 000',   'EUR', 17),
  p('3301174', '00', 'policy', 'issued',    'Immobilière du Marais',        'AT Belgium', '01 Jan 2026', '31 Dec 2026', '€750 000',     'EUR', 4),
  p('3301175', '01', 'policy', 'cancelled', 'Le Marais SARL',               'AT Belgium', '01 Feb 2025', '31 Jan 2026', '€300 000',     'EUR', 2),
  p('8840221', '00', 'policy', 'issued',    'Iberia Cafés y Tostados SL',   'AT Brazil',  '01 May 2026', '30 Apr 2027', 'BRL 4 000 000','BRL', 12),
  p('8840222', '00', 'policy', 'expired',   'Verde Agricoltura SpA',        'AT Brazil',  '01 May 2024', '30 Apr 2025', 'BRL 2 100 000','BRL', 5),
  p('1100458', '00', 'policy', 'issued',    'Nordsee Logistik GmbH',        'Acredia',    '01 Jan 2026', '31 Dec 2026', '€5 000 000',   'EUR', 31),
  p('1100459', '01', 'policy', 'issued',    'Danube Textiles Kft',          'Acredia',    '01 Jul 2026', '30 Jun 2027', '€1 200 000',   'EUR', 7),
  p('1100460', '00', 'policy', 'cancelled', 'Stahlbau Müller AG',           'Acredia',    '01 Jan 2025', '31 Dec 2025', 'CHF 2 000 000','CHF', 10),
  p('5012510', '00', 'policy', 'issued',    'Helvetia Watch Components',    'AT USA',     '01 Sep 2026', '31 Aug 2027', '$1 100 000',   'USD', 5),
  p('D-20431', '00', 'draft',  null,        'Polaris Tech Nordic AB',       'AT UK',      '01 Jan 2027', '31 Dec 2027', '£900 000',     'GBP', 3),
  p('D-20432', '00', 'draft',  null,        'Aurora Solar Solutions BV',    'AT Belgium', '01 Jan 2027', '31 Dec 2027', '€600 000',     'EUR', 2),
  p('D-20433', '00', 'draft',  null,        'Brooklyn Craft Goods LLC',     'AT USA',     '01 Jan 2027', '31 Dec 2027', '$2 200 000',   'USD', 15),
  p('D-20434', '00', 'draft',  null,        'Mistral Énergie Renouvelable', 'Acredia',    '01 Mar 2027', '29 Feb 2028', '€1 000 000',   'EUR', 4),
];
