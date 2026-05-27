import type { FilterPrimitiveValue, FilterValue } from '../../shared/ui/filter-drawer/filter-drawer.component';
import type { Company } from './companies.mock';

function asArray(value: FilterValue | FilterPrimitiveValue | undefined): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

function asRecord(value: FilterValue | undefined): Record<string, FilterPrimitiveValue> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, FilterPrimitiveValue> : {};
}

function asString(value: FilterValue | FilterPrimitiveValue | undefined): string {
  return typeof value === 'string' ? value : '';
}

function asBool(value: FilterValue | FilterPrimitiveValue | undefined): boolean {
  return value === true;
}

function extractCompositeIdValues(record: Record<string, FilterPrimitiveValue>): { type: string; value: string }[] {
  const chips = Array.isArray(record['chips']) ? (record['chips'] as string[]) : [];
  return chips.map((chip) => {
    const [rawType, rawValue] = chip.split(' : ');
    return {
      type: (rawType ?? '').trim().toLowerCase().replace(/[^a-z]/g, ''),
      value: (rawValue ?? '').trim(),
    };
  });
}

function rangeMatches(value: number, rangeKey: string): boolean {
  switch (rangeKey) {
    case '<1M':     return value < 1_000_000;
    case '1M-10M':  return value >= 1_000_000   && value <= 10_000_000;
    case '10M-100M':return value >= 10_000_000  && value <= 100_000_000;
    case '>100M':   return value > 100_000_000;
    default:        return true;
  }
}

function moneyMatches(value: number, record: Record<string, FilterPrimitiveValue>): boolean {
  const ranges = Array.isArray(record['range']) ? (record['range'] as string[]) : [];
  const from = typeof record['from'] === 'number' ? record['from'] as number : null;
  const to   = typeof record['to']   === 'number' ? record['to']   as number : null;

  if (ranges.length > 0) {
    return ranges.some((key) => rangeMatches(value, key));
  }
  if (from !== null && value < from) return false;
  if (to   !== null && value > to)   return false;
  return true;
}

export function filterCompanies(rows: Company[], filters: Record<string, FilterValue>): Company[] {
  return rows.filter((row) => {
    const companyId = asString(filters['companyId']);
    if (companyId && !row.companyId.toLowerCase().includes(companyId.toLowerCase())) return false;

    const nationalId = asRecord(filters['nationalId']);
    const idChips = extractCompositeIdValues(nationalId);
    if (idChips.length > 0) {
      const match = idChips.some((chip) => {
        const typeMatches = chip.type === '' || row.nationalIdType.startsWith(chip.type.slice(0, 5));
        const valueMatches = chip.value === '' || row.nationalId.toLowerCase().includes(chip.value.toLowerCase());
        return typeMatches && valueMatches;
      });
      if (!match) return false;
    }

    const colors = asArray(filters['tradeSectorColor']);
    if (colors.length > 0 && !colors.includes(row.tradeSectorColor)) return false;

    const tradeSectorFamily = asRecord(filters['tradeSectorFamily']);
    const familyChips = Array.isArray(tradeSectorFamily['chips']) ? (tradeSectorFamily['chips'] as string[]) : [];
    if (familyChips.length > 0) {
      const ok = familyChips.some((chip) => row.tradeSectorFamily.toLowerCase() === chip.toLowerCase());
      if (!ok) return false;
    }

    const units = asArray(filters['businessUnits']);
    if (units.length > 0 && !units.includes(row.businessUnit)) return false;

    const grades = asArray(filters['grade']);
    if (grades.length > 0) {
      const order = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'NA'];
      const rowIndex = order.indexOf(row.grade);
      const selectedIndexes = grades.map((g) => order.indexOf(g)).filter((i) => i >= 0).sort((a, b) => a - b);
      if (selectedIndexes.length === 1) {
        if (rowIndex !== selectedIndexes[0]) return false;
      } else if (selectedIndexes.length >= 2) {
        const min = selectedIndexes[0];
        const max = selectedIndexes[selectedIndexes.length - 1];
        if (rowIndex < min || rowIndex > max) return false;
      }
    }

    if (asBool(filters['grade.acceptor']) && !row.acceptor) return false;
    if (asBool(filters['grade.source']) && !row.source) return false;

    const turnover = asRecord(filters['financials.turnover']);
    if (Object.keys(turnover).length > 0 && !moneyMatches(row.turnover, turnover)) return false;

    const operationProfit = asRecord(filters['financials.operationProfit']);
    if (Object.keys(operationProfit).length > 0 && !moneyMatches(row.operationProfit, operationProfit)) return false;

    const shareholderFunds = asRecord(filters['financials.shareholderFunds']);
    if (Object.keys(shareholderFunds).length > 0 && !moneyMatches(row.shareholderFunds, shareholderFunds)) return false;

    const totalAssets = asRecord(filters['financials.totalAssets']);
    if (Object.keys(totalAssets).length > 0 && !moneyMatches(row.totalAssets, totalAssets)) return false;

    const sensitivity = asArray(filters['sensitivity']);
    if (sensitivity.length > 0) {
      const order = ['S0', 'S1', 'S2P', 'SN'];
      const rowIndex = order.indexOf(row.sensitivity);
      const selectedIndexes = sensitivity.map((s) => order.indexOf(s)).filter((i) => i >= 0).sort((a, b) => a - b);
      if (selectedIndexes.length === 1) {
        if (rowIndex !== selectedIndexes[0]) return false;
      } else if (selectedIndexes.length >= 2) {
        const min = selectedIndexes[0];
        const max = selectedIndexes[selectedIndexes.length - 1];
        if (rowIndex < min || rowIndex > max) return false;
      }
    }

    const sruInsured = asArray(filters['sruInsured']);
    if (sruInsured.length > 0) {
      const wantsSru = sruInsured.includes('sru');
      const wantsInsured = sruInsured.includes('insured');
      if (wantsSru && wantsInsured && !(row.sru && row.insured)) return false;
      if (wantsSru && !wantsInsured && !row.sru) return false;
      if (!wantsSru && wantsInsured && !row.insured) return false;
    }

    const status = asArray(filters['status']);
    if (status.length > 0 && !status.includes(row.status)) return false;

    return true;
  });
}

export function formatMoney(value: number, currency = '€'): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1).replace('.0', '')}B ${currency}`;
  if (value >= 1_000_000)     return `${(value / 1_000_000).toFixed(1).replace('.0', '')}M ${currency}`;
  if (value >= 1_000)         return `${(value / 1_000).toFixed(0)}K ${currency}`;
  return `${value} ${currency}`;
}
