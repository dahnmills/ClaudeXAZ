import { Injectable, signal } from '@angular/core';
import type { ResultCardData } from '../../shared/ui/result-card/result-card.component';
import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import { removeKind, type HistoryKind } from './search-v2-history';

export type FavoriteV2 =
  | { kind: 'buyer';  id: string; buyer: ResultCardData;   ts: number }
  | { kind: 'policy'; id: string; policy: PolicyResultData; ts: number };

export type FavoriteV2Input =
  | Omit<Extract<FavoriteV2, { kind: 'buyer' }>, 'ts'>
  | Omit<Extract<FavoriteV2, { kind: 'policy' }>, 'ts'>;

/** Favoris V2, buyers (clé Company ID) et policies (clé n°-extension), avec
 *  leur date d'ajout pour trier les sections de l'onglet Favorites. */
@Injectable({ providedIn: 'root' })
export class SearchV2FavoritesStore {
  readonly entries = signal<FavoriteV2[]>([]);

  has(kind: HistoryKind, id: string): boolean {
    return this.entries().some(f => f.kind === kind && f.id === id);
  }

  toggle(fav: FavoriteV2Input): void {
    if (this.has(fav.kind, fav.id)) {
      this.entries.update(list => list.filter(f => !(f.kind === fav.kind && f.id === fav.id)));
      return;
    }
    this.entries.update(list => [{ ...fav, ts: Date.now() } as FavoriteV2, ...list]);
  }

  clear(kind?: HistoryKind): void {
    this.entries.update(list => removeKind(list, kind));
  }
}
