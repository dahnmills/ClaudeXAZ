import type { SelectOption } from '../ui/select/select.component';

/**
 * Règles par pays pour la création et l'édition d'une company : le pays choisi
 * filtre les formes juridiques, les types d'identifiant, la zone administrative
 * et la nomenclature d'activité. Échantillon plausible pour le prototype, pas la
 * référence réglementaire : un acheteur allemand n'est pas une SARL.
 */
export interface CountryRule {
  code: string;
  label: string;
  legalForms: SelectOption[];
  identifierTypes: SelectOption[];
  /** Nom de la zone administrative dans ce pays (région, Land, comté, État…). */
  areaLabel: string;
  areas: SelectOption[];
  /** Nomenclatures d'activité en usage ; la première sert de défaut. */
  activityTypes: SelectOption[];
}

const o = (...labels: string[]): SelectOption[] =>
  labels.map(l => ({ value: l.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), label: l }));

export const COUNTRY_RULES: CountryRule[] = [
  {
    code: 'fr', label: 'France',
    legalForms: o('SARL', 'EURL', 'SAS', 'SASU', 'SA', 'SNC', 'SCI', 'Auto-entrepreneur'),
    identifierTypes: o('SIREN', 'SIRET', 'VAT', 'DUNS'),
    areaLabel: 'Region',
    areas: o('Île-de-France', 'Auvergne-Rhône-Alpes', "Provence-Alpes-Côte d'Azur", 'Occitanie', 'Nouvelle-Aquitaine', 'Hauts-de-France', 'Grand Est', 'Bretagne'),
    activityTypes: o('NAF', 'NACE'),
  },
  {
    code: 'de', label: 'Germany',
    legalForms: o('GmbH', 'UG (haftungsbeschränkt)', 'AG', 'KG', 'GmbH & Co. KG', 'OHG', 'GbR', 'e.K.'),
    identifierTypes: o('HRB number', 'HRA number', 'USt-IdNr (VAT)', 'Steuernummer', 'DUNS'),
    areaLabel: 'Federal state',
    areas: o('Baden-Württemberg', 'Bayern', 'Berlin', 'Hamburg', 'Hessen', 'Niedersachsen', 'Nordrhein-Westfalen', 'Sachsen'),
    activityTypes: o('WZ 2008', 'NACE'),
  },
  {
    code: 'gb', label: 'United Kingdom',
    legalForms: o('Ltd', 'PLC', 'LLP', 'LP', 'Sole trader', 'Partnership'),
    identifierTypes: o('Company number (CRN)', 'VAT', 'DUNS'),
    areaLabel: 'County',
    areas: o('Greater London', 'West Midlands', 'Greater Manchester', 'West Yorkshire', 'Hampshire', 'Kent', 'Bedfordshire', 'Scotland'),
    activityTypes: o('SIC', 'NACE'),
  },
  {
    code: 'es', label: 'Spain',
    legalForms: o('SL', 'SLU', 'SA', 'SC', 'SCP', 'Autónomo'),
    identifierTypes: o('NIF', 'CIF', 'VAT', 'DUNS'),
    areaLabel: 'Autonomous community',
    areas: o('Comunidad de Madrid', 'Cataluña', 'Andalucía', 'Comunidad Valenciana', 'País Vasco', 'Galicia'),
    activityTypes: o('CNAE', 'NACE'),
  },
  {
    code: 'it', label: 'Italy',
    legalForms: o('SRL', 'SRLS', 'SPA', 'SAS', 'SNC', 'Ditta individuale'),
    identifierTypes: o('Partita IVA', 'Codice fiscale', 'REA number', 'DUNS'),
    areaLabel: 'Region',
    areas: o('Lombardia', 'Lazio', 'Veneto', 'Emilia-Romagna', 'Piemonte', 'Toscana', 'Campania'),
    activityTypes: o('ATECO', 'NACE'),
  },
  {
    code: 'nl', label: 'Netherlands',
    legalForms: o('BV', 'NV', 'VOF', 'CV', 'Eenmanszaak', 'Stichting'),
    identifierTypes: o('KvK number', 'BTW (VAT)', 'DUNS'),
    areaLabel: 'Province',
    areas: o('Noord-Holland', 'Zuid-Holland', 'Utrecht', 'Noord-Brabant', 'Gelderland', 'Limburg'),
    activityTypes: o('SBI', 'NACE'),
  },
  {
    code: 'be', label: 'Belgium',
    legalForms: o('BV / SRL', 'NV / SA', 'CommV / SComm', 'VOF / SNC', 'Eenmanszaak'),
    identifierTypes: o('Enterprise number (BCE/KBO)', 'VAT', 'DUNS'),
    areaLabel: 'Region',
    areas: o('Brussels-Capital', 'Flanders', 'Wallonia'),
    activityTypes: o('NACE-BEL', 'NACE'),
  },
  {
    code: 'us', label: 'United States',
    legalForms: o('LLC', 'Inc.', 'Corp.', 'LP', 'LLP', 'Sole proprietorship'),
    identifierTypes: o('EIN', 'DUNS', 'State registration number'),
    areaLabel: 'State',
    areas: o('California', 'New York', 'Texas', 'Florida', 'Illinois', 'Delaware', 'Massachusetts'),
    activityTypes: o('NAICS', 'SIC'),
  },
];

export const COUNTRY_OPTIONS: SelectOption[] = COUNTRY_RULES.map(c => ({ value: c.code, label: c.label }));

/** Règles d'un pays, par code ; `undefined` tant qu'aucun pays n'est choisi. */
export function countryRule(code: string | undefined | null): CountryRule | undefined {
  return COUNTRY_RULES.find(c => c.code === code);
}

/** Code du pays pour un libellé (« United Kingdom » → « gb »), pour les données pré-remplies. */
export function countryCodeOf(label: string | undefined | null): string {
  return COUNTRY_RULES.find(c => c.label.toLowerCase() === (label ?? '').toLowerCase())?.code ?? '';
}
