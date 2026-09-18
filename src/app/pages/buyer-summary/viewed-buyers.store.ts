import { Injectable, signal } from '@angular/core';
import type { BuyerCompany } from './buyer-summary.store';

export interface ViewedBuyer extends BuyerCompany {
  /** Horodatage de la dernière ouverture. */
  ts: number;
}

const MAX_VIEWED = 10;

/**
 * Buyers réellement ouverts, du plus récent au plus ancien.
 *
 * Alimenté par la page Buyer Summary, donc par tous les chemins d'accès à la
 * fois (résultat de recherche, création, spotlight, URL directe) et sans que
 * chacun ait à y penser. Lu par l'onglet « Recently viewed » de la page Search.
 * Singleton root : la liste survit à la navigation.
 */
@Injectable({ providedIn: 'root' })
export class ViewedBuyersStore {
  readonly entries = signal<ViewedBuyer[]>([]);

  /** Une deuxième visite remonte le buyer en tête au lieu de le dupliquer. */
  record(company: BuyerCompany): void {
    if (!company.companyId) return;
    this.entries.update(list => [
      { ...company, ts: Date.now() },
      ...list.filter(e => e.companyId !== company.companyId),
    ].slice(0, MAX_VIEWED));
  }

  clear(): void {
    this.entries.set([]);
  }
}
