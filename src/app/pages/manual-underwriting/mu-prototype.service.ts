import { Injectable, effect, signal } from '@angular/core';
import { HelpMenuExtrasService } from '../../shared/help-menu/help-menu-extras.service';

export type MuRights = 'can' | 'cannot';
export type MuUser = 'author' | 'other';
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
  /** Who is looking at the page: the author of the decision (four eyes: cannot validate) or another underwriter. */
  readonly user = signal<MuUser>('other');
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
      const user = this.user();
      extras.set({
        id: SECTION_ID,
        title: 'Prototype',
        items: [
          { id: 'rights-can', group: 'Your rights', label: 'Can complete', selected: rights === 'can', select: () => this.rights.set('can') },
          { id: 'rights-cannot', group: 'Your rights', label: 'Cannot complete', selected: rights === 'cannot', select: () => this.rights.set('cannot') },
          { id: 'status-draft', group: 'Request status', label: 'Draft', selected: status === 'draft', select: () => this.status.set('draft') },
          { id: 'status-tbv', group: 'Request status', label: 'To be validated', selected: status === 'to-be-validated', select: () => this.status.set('to-be-validated') },
          { id: 'status-validated', group: 'Request status', label: 'Validated', selected: status === 'validated', select: () => this.status.set('validated') },
          { id: 'user-other', group: 'Current user', label: 'Another underwriter', selected: user === 'other', select: () => this.user.set('other') },
          { id: 'user-author', group: 'Current user', label: 'Decision author', selected: user === 'author', select: () => this.user.set('author') },
        ],
      });
    });
  }

  activate() { this.active.set(true); }
  deactivate() { this.active.set(false); }
}
