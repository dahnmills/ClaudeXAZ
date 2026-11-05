import { Injectable, effect, signal } from '@angular/core';
import { HelpMenuExtrasService } from '../../shared/help-menu/help-menu-extras.service';

export type MuRights = 'can' | 'cannot';
export type MuStatus = 'draft' | 'to-be-validated' | 'validated';

const SECTION_ID = 'mu-prototype';

/**
 * Réglages de prototype de la page Manual Underwriting, pilotés depuis le menu
 * « ? » du header (section « Prototype », visible seulement tant que la page
 * est active).
 */
@Injectable({ providedIn: 'root' })
export class MuPrototypeService {
  readonly rights = signal<MuRights>('can');
  readonly status = signal<MuStatus>('draft');
  /** Posé par la page : true à l'init, false à la destruction. */
  readonly active = signal(false);

  constructor(extras: HelpMenuExtrasService) {
    effect(() => {
      if (!this.active()) {
        extras.remove(SECTION_ID);
        return;
      }
      const rights = this.rights();
      const status = this.status();
      extras.set({
        id: SECTION_ID,
        title: 'Prototype',
        items: [
          { id: 'rights-can', group: 'Your rights', label: 'Can complete', selected: rights === 'can', select: () => this.rights.set('can') },
          { id: 'rights-cannot', group: 'Your rights', label: 'Cannot complete', selected: rights === 'cannot', select: () => this.rights.set('cannot') },
          { id: 'status-draft', group: 'Request status', label: 'Draft', selected: status === 'draft', select: () => this.status.set('draft') },
          { id: 'status-tbv', group: 'Request status', label: 'To be validated', selected: status === 'to-be-validated', select: () => this.status.set('to-be-validated') },
          { id: 'status-validated', group: 'Request status', label: 'Validated', selected: status === 'validated', select: () => this.status.set('validated') },
        ],
      });
    });
  }

  activate() { this.active.set(true); }
  deactivate() { this.active.set(false); }
}
