import type { RejectField } from '../reject-record.model';

/** Une rangée a 6 unités : un champ normal en prend 2 (3 par rangée), un champ large 4. */
export const ROW_UNITS = 6;
export const FIELD_UNITS = 2;
export const WIDE_FIELD_UNITS = 4;

/** Un libellé long ou une valeur longue demande un champ large : jamais de libellé sur deux lignes. */
export function isWideField(f: Pick<RejectField, 'label' | 'length'>): boolean {
  return f.label.length > 30 || f.length >= 70;
}

export interface LaidOutField<T> {
  field: T;
  /** Unités de la rangée occupées par le champ (2 à 6). */
  span: number;
}

/**
 * Répartit les champs, dans leur ordre, en rangées toujours pleines. Remplissage
 * glouton : quand le champ suivant ne tient pas, la rangée en cours est complétée
 * en élargissant ses champs, de façon égale (les derniers reçoivent le reste).
 * Un champ seul prend toute la rangée. Aucun trou, jamais.
 */
export function layoutFields<T extends Pick<RejectField, 'label' | 'length'>>(fields: readonly T[]): LaidOutField<T>[] {
  const out: LaidOutField<T>[] = [];
  let row: LaidOutField<T>[] = [];
  let used = 0;

  const close = () => {
    if (!row.length) return;
    let extra = ROW_UNITS - used;
    // Les champs naturellement larges de la rangée gardent leur avance ; on répartit
    // le surplus par pas de 1 unité, en commençant par le dernier champ
    const n = row.length;
    const base = Math.floor(extra / n);
    for (const item of row) item.span += base;
    extra -= base * n;
    for (let i = n - 1; i >= 0 && extra > 0; i--, extra--) row[i].span += 1;
    out.push(...row);
    row = [];
    used = 0;
  };

  for (const field of fields) {
    const units = isWideField(field) ? WIDE_FIELD_UNITS : FIELD_UNITS;
    if (used + units > ROW_UNITS) close();
    row.push({ field, span: units });
    used += units;
    if (used === ROW_UNITS) close();
  }
  close();
  return out;
}
