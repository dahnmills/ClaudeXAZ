import { Injectable, signal } from '@angular/core';

export interface BuyerCompany {
  name: string;
  companyId: string;
  city?: string;
  address?: string;
}

/**
 * Transfert de la company sélectionnée/créée entre la page Search et la page
 * Buyer Summary. Singleton root — survit à la navigation.
 *
 * `justCreated` pilote le toaster de succès affiché une seule fois à l'arrivée
 * (consommé via consumeJustCreated() pour ne pas se redéclencher).
 */
@Injectable({ providedIn: 'root' })
export class BuyerSummaryStore {
  readonly current = signal<BuyerCompany | null>(null);
  private readonly _justCreated = signal<boolean>(false);

  set(company: BuyerCompany, justCreated = false): void {
    this.current.set(company);
    this._justCreated.set(justCreated);
  }

  /** Lit le flag puis le remet à false (one-shot). */
  consumeJustCreated(): boolean {
    const v = this._justCreated();
    this._justCreated.set(false);
    return v;
  }
}
