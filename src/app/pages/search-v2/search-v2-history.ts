/** Logique des historiques de la Search V2 (Recent search, Recently viewed,
 *  Favorites). Module pur, sans Angular : la page et les stores l'appellent,
 *  les tests node le lisent directement. */

export type HistoryKind = 'buyer' | 'policy';
export type HistoryFilter = 'all' | HistoryKind;
export type HistoryTab = 'searched' | 'viewed' | 'favorites';

export interface Stamped { kind: HistoryKind; ts: number; }

/** Du plus récent au plus ancien, sur une copie. */
export function byRecent<T extends { ts: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.ts - a.ts);
}

/** All = un seul fil chronologique ; sinon le seul objet demandé. */
export function filterHistory<T extends Stamped>(items: T[], f: HistoryFilter): T[] {
  return byRecent(f === 'all' ? items : items.filter(i => i.kind === f));
}

export function countByKind(items: Stamped[]): Record<HistoryFilter, number> {
  const buyer = items.filter(i => i.kind === 'buyer').length;
  return { all: items.length, buyer, policy: items.length - buyer };
}

/** Clear n'efface que ce qui est affiché. */
export function clearLabel(f: HistoryFilter): string {
  return f === 'all' ? 'Clear all' : f === 'buyer' ? 'Clear buyers' : 'Clear policies';
}

const EMPTY: Record<HistoryTab, Record<HistoryFilter, string>> = {
  searched: {
    all:    'No recent search',
    buyer:  'No buyer search yet',
    policy: 'No policy search yet',
  },
  viewed: {
    all:    'Nothing viewed yet. Open a buyer or a policy to find it here',
    buyer:  'No buyer viewed yet',
    policy: 'No policy viewed yet',
  },
  favorites: {
    all:    'No favorites yet. Star a result to add it here',
    buyer:  'No favorite buyer yet',
    policy: 'No favorite policy yet',
  },
};

export function emptyLabel(tab: HistoryTab, f: HistoryFilter): string {
  return EMPTY[tab][f];
}

/** Ajoute en tête ; une entrée de même clé remonte au lieu d'être dupliquée. */
export function upsertFront<T extends { ts: number }>(list: T[], entry: T, key: (e: T) => string, max: number): T[] {
  const k = key(entry);
  return [entry, ...list.filter(e => key(e) !== k)].slice(0, max);
}

/** Sans kind : tout. Avec kind : seulement cet objet, l'autre reste. */
export function removeKind<T extends Stamped>(list: T[], kind?: HistoryKind): T[] {
  return kind ? list.filter(e => e.kind !== kind) : [];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

/** Jours calendaires entre deux instants, en heure locale. */
function daysBetween(ts: number, now: number): number {
  const day = (t: number) => { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
  return Math.round((day(now) - day(ts)) / (24 * HOUR));
}

/** Date de carte : verbe d'abord (une recherche passée se distingue d'un objet
 *  consulté), relative sur la semaine, absolue au-delà, l'année seulement si
 *  elle diffère. */
export function historyDate(verb: 'Searched' | 'Viewed', ts: number, now: number): string {
  const days = daysBetween(ts, now);
  const d = new Date(ts);
  let when: string;
  if (days === 0) {
    const diff = now - ts;
    when = diff < MINUTE ? 'just now'
      : diff < HOUR ? `${Math.floor(diff / MINUTE)} min ago`
      : `${Math.floor(diff / HOUR)} h ago`;
  } else if (days === 1) {
    when = 'yesterday';
  } else if (days < 7) {
    when = `${days} days ago`;
  } else {
    const year = d.getFullYear() !== new Date(now).getFullYear() ? ` ${d.getFullYear()}` : '';
    when = `${d.getDate()} ${MONTHS[d.getMonth()]}${year}`;
  }
  return `${verb} ${when}`;
}

/** L'instant exact, pour l'infobulle : "29 Sep 2026, 14:32". */
export function fullDate(ts: number): string {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}
