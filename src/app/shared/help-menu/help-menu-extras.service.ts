import { Injectable, signal } from '@angular/core';

export interface HelpMenuItem {
  id: string;
  /** Sous-titre de groupe, affiché quand il change d'une entrée à l'autre. */
  group?: string;
  label: string;
  selected: boolean;
  select: () => void;
}

export interface HelpMenuSection {
  id: string;
  title: string;
  items: HelpMenuItem[];
}

/**
 * Sections que les pages ajoutent au menu « ? » du header. Une page appelle
 * `set(section)` tant qu'elle est active et `remove(id)` en partant : le header
 * n'affiche rien de plus quand aucune section n'est enregistrée.
 */
@Injectable({ providedIn: 'root' })
export class HelpMenuExtrasService {
  readonly sections = signal<HelpMenuSection[]>([]);

  set(section: HelpMenuSection) {
    this.sections.update(list => {
      const i = list.findIndex(s => s.id === section.id);
      return i < 0 ? [...list, section] : list.map((s, k) => (k === i ? section : s));
    });
  }

  remove(id: string) {
    this.sections.update(list => list.filter(s => s.id !== id));
  }
}
