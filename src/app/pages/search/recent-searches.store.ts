import { Injectable, signal } from '@angular/core';
import type { SearchType, IdTypeOption } from '../../shared/ui/search-bar-multi/search-bar-multi.component';
import type { FlagCode } from '../../shared/ui/flag/flag.component';
import type { MoreCriteriaValues } from '../../shared/ui/more-criteria/more-criteria.component';

/**
 * Une recherche passée, avec tous ses critères. Deux recherches sur le même mot
 * ne se distinguent que par eux : le type, le pays, l'ID Type et les critères
 * complémentaires font partie de l'entrée, pas seulement de la requête.
 */
export interface RecentEntry {
  type: SearchType;
  query: string;
  country: FlagCode | null;
  idType: IdTypeOption | null;
  criteria: MoreCriteriaValues;
  ts: number;
}

const MAX_RECENTS = 10;

/**
 * Recherches passées, de la plus récente à la plus ancienne.
 *
 * Singleton root, comme les buyers consultés : ouvrir un buyer démonte la page
 * Search, et l'historique doit être là au retour. Porté par le composant, il
 * repartait de zéro à chaque aller-retour.
 */
@Injectable({ providedIn: 'root' })
export class RecentSearchesStore {
  readonly entries = signal<RecentEntry[]>([]);

  /**
   * Enregistre une recherche. Une recherche déjà connue remonte en tête au lieu
   * d'être listée deux fois : deux entrées ne coexistent que si un critère les
   * distingue. Spammer Search ne crée donc qu'une ligne, et rejouer une vieille
   * recherche la ramène en haut.
   */
  record(entry: Omit<RecentEntry, 'ts'>): void {
    if (!entry.query.trim()) return;
    const k = key(entry);
    this.entries.update(list => [
      { ...entry, ts: Date.now() },
      ...list.filter(e => key(e) !== k),
    ].slice(0, MAX_RECENTS));
  }

  clear(): void {
    this.entries.set([]);
  }
}

/** Signature d'une recherche : tout ce qui la distingue d'une autre. */
function key(e: Omit<RecentEntry, 'ts'>): string {
  const c = e.criteria;
  return JSON.stringify([
    e.type, e.query, e.country, e.idType,
    [...c.statuses].sort(), c.extendCountry, c.street, c.city, c.region, c.zip, c.phone,
  ]);
}
