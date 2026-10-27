import { Injectable, signal } from '@angular/core';
import type { PolicyResultData } from '../../shared/ui/policy-result-card/policy.model';
import { upsertFront } from './search-v2-history';

export interface ViewedPolicy {
  kind: 'policy';
  id: string;
  policy: PolicyResultData;
  ts: number;
}

const MAX_VIEWED = 10;

/**
 * Policies ouvertes depuis la V2. Les buyers consultés restent dans
 * ViewedBuyersStore (alimenté par la page Buyer Summary) : la page fusionne.
 */
@Injectable({ providedIn: 'root' })
export class SearchV2ViewedStore {
  readonly entries = signal<ViewedPolicy[]>([]);

  record(policy: PolicyResultData): void {
    const entry: ViewedPolicy = { kind: 'policy', id: policy.id, policy, ts: Date.now() };
    this.entries.update(list => upsertFront(list, entry, e => e.id, MAX_VIEWED));
  }

  clear(): void {
    this.entries.set([]);
  }
}
