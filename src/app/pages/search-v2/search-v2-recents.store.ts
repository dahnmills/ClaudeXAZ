import { Injectable, signal } from '@angular/core';
import { recentKey, type RecentV2Entry, type RecentV2Input } from './search-v2-recents.model';
import { upsertFront, removeKind, type HistoryKind } from './search-v2-history';

/** Les deux objets partagent la liste : 20 laisse de la place à chacun. */
const MAX_RECENTS = 20;

/**
 * Recherches passées de la V2, buyers et policies mêlées. Singleton root,
 * séparé du store V1 : la V1 garde son historique intact.
 */
@Injectable({ providedIn: 'root' })
export class SearchV2RecentsStore {
  readonly entries = signal<RecentV2Entry[]>([]);

  /** Une recherche buyer sans saisie n'est pas retenue, comme en V1 ; une recherche policy vide l'est (BU, statuts). */
  record(entry: RecentV2Input): void {
    if (entry.kind === 'buyer' && !entry.query.trim()) return;
    const next = { ...entry, ts: Date.now() } as RecentV2Entry;
    this.entries.update(list => upsertFront(list, next, recentKey, MAX_RECENTS));
  }

  clear(kind?: HistoryKind): void {
    this.entries.update(list => removeKind(list, kind));
  }
}
