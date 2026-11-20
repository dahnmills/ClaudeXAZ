// Buyer Summary V2, Bento placement engine (benchmark section 3 and 5).
// Pure functions: the list order of the analyst is the model, the layout is
// computed from it (first free slot), then holes are closed by stretching.

import { type BentoCard, FORMATS, FORMAT_MAP, STRETCH } from './buyer-summary-v2.data';

export interface Placed {
  card: BentoCard;
  x: number;  // column, 0-based
  y: number;  // row, 0-based
  w: number;
  h: number;
}

/** Width in columns of a format on a board of `cols` columns. */
export function widthOf(format: string, cols: number): number {
  const f = FORMAT_MAP[format] ?? FORMATS[0];
  return f.w === 'full' ? cols : Math.min(f.w, cols);
}

/** First free slot, in list order, restarting from the top for each card
 *  (fills holes left higher up). Width is capped to the column count. */
function packBase(cards: BentoCard[], cols: number): Placed[] {
  const taken: boolean[][] = [];
  const free = (x: number, y: number, w: number, h: number) => {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) if (taken[yy]?.[xx]) return false;
    }
    return true;
  };
  const out: Placed[] = [];
  for (const card of cards) {
    const w = widthOf(card.format, cols);
    const h = (FORMAT_MAP[card.format] ?? FORMATS[0]).h;
    let placed = false;
    for (let y = 0; !placed; y++) {
      for (let x = 0; x + w <= cols && !placed; x++) {
        if (!free(x, y, w, h)) continue;
        for (let yy = y; yy < y + h; yy++) {
          taken[yy] ??= [];
          for (let xx = x; xx < x + w; xx++) taken[yy][xx] = true;
        }
        out.push({ card, x, y, w, h });
        placed = true;
      }
    }
  }
  return out;
}

/** Clean bottom edge: free cells inside the board's rectangle are taken by
 *  stretching a neighbouring card, but only a card that can show more when it
 *  grows (lists, tables, charts: STRETCH). Returns the cells left free. */
export function fillHoles(cards: Placed[], cols: number): number {
  const rows = cards.reduce((m, p) => Math.max(m, p.y + p.h), 0);
  const grid: (Placed | undefined)[][] = Array.from({ length: rows }, () => Array(cols).fill(undefined));
  const mark = (p: Placed) => {
    for (let y = p.y; y < p.y + p.h; y++) for (let x = p.x; x < p.x + p.w; x++) grid[y][x] = p;
  };
  cards.forEach(mark);
  const at = (x: number, y: number) => (x < 0 || x >= cols || y < 0 || y >= rows ? undefined : grid[y][x]);
  const rowFree = (x0: number, w: number, y: number) => {
    if (y < 0 || y >= rows) return false;
    for (let x = x0; x < x0 + w; x++) if (grid[y][x]) return false;
    return true;
  };
  const colFree = (x: number, y0: number, h: number) => {
    if (x < 0 || x >= cols) return false;
    for (let y = y0; y < y0 + h; y++) if (grid[y][x]) return false;
    return true;
  };
  const v = (p: Placed) => STRETCH[p.card.kind]?.v ?? false;
  const hz = (p: Placed) => STRETCH[p.card.kind]?.h ?? false;
  let changed = true;
  while (changed) {
    changed = false;
    for (let y = 0; y < rows && !changed; y++) {
      for (let x = 0; x < cols && !changed; x++) {
        if (grid[y][x]) continue;
        const above = at(x, y - 1);
        const below = at(x, y + 1);
        const left  = at(x - 1, y);
        const right = at(x + 1, y);
        if (above && v(above) && above.y + above.h === y && rowFree(above.x, above.w, y)) { above.h++; changed = true; }
        else if (below && v(below) && below.y === y + 1 && rowFree(below.x, below.w, y)) { below.y--; below.h++; changed = true; }
        else if (left && hz(left) && left.x + left.w === x && colFree(x, left.y, left.h)) { left.w++; changed = true; }
        else if (right && hz(right) && right.x === x + 1 && colFree(x, right.y, right.h)) { right.x--; right.w++; changed = true; }
        if (changed) cards.forEach(mark);
      }
    }
  }
  let holes = 0;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) if (!grid[y][x]) holes++;
  return holes;
}

function layout(cards: BentoCard[], cols: number, fill: boolean): { placed: Placed[]; holes: number; stretch: number } {
  const placed = packBase(cards, cols);
  const base = placed.reduce((s, p) => s + p.w * p.h, 0);
  const holes = fill ? fillHoles(placed, cols) : 0;
  const stretch = placed.reduce((s, p) => s + p.w * p.h, 0) - base;
  return { placed, holes, stretch };
}

/** Layout shown on the board. `settle`: when gaps remain, try swapping two
 *  cards, first near the end of the list, then anywhere (the analyst's order
 *  stays in the model), and keep the layout with the fewest gaps, then the
 *  least stretching. `fill`: close the holes by stretching (off while a card
 *  is resized, so the card under the pointer keeps the format it shows). */
export function packCards(cards: BentoCard[], cols: number, settle = true, fill = true): Placed[] {
  let best = layout(cards, cols, fill);
  const n = cards.length;
  const trySwaps = (from: number) => {
    for (let j = Math.max(1, n - 6); j < n && best.holes > 0; j++) {
      for (let i = from; i < j; i++) {
        const order = [...cards];
        [order[i], order[j]] = [order[j], order[i]];
        const r = layout(order, cols, fill);
        if (r.holes < best.holes || (r.holes === best.holes && r.stretch < best.stretch)) best = r;
      }
    }
  };
  if (settle && best.holes > 0) trySwaps(Math.max(0, n - 9));
  if (settle && best.holes > 0) trySwaps(0);
  // DOM in visual order: Tab and screen readers follow the eye
  return best.placed.sort((a, b) => a.y - b.y || a.x - b.x);
}

/** Free cells left on a board (0 = clean bottom edge). */
export function holesOf(cards: BentoCard[], cols: number): number {
  const placed = packCards(cards, cols);
  const rows = placed.reduce((m, p) => Math.max(m, p.y + p.h), 0);
  return rows * cols - placed.reduce((s, p) => s + p.w * p.h, 0);
}

/** The format among the fourteen closest to a box of w × h units. */
export function nearestFormat(w: number, h: number, cols: number): string {
  let best = FORMATS[0].id;
  let bestDist = Infinity;
  for (const f of FORMATS) {
    const fw = f.w === 'full' ? cols : f.w;
    if (fw > cols) continue;
    // Full width only when the pointer really reaches the last column
    const d = Math.abs(fw - w) + Math.abs(f.h - h) + (f.w === 'full' ? 0.1 : 0);
    if (d < bestDist) { best = f.id; bestDist = d; }
  }
  return best;
}

/** Next format one step wider / narrower / taller / shorter (keyboard resize). */
export function stepFormat(format: string, dw: number, dh: number, cols: number): string {
  const f = FORMAT_MAP[format] ?? FORMATS[0];
  const w = (f.w === 'full' ? cols : Math.min(f.w, cols)) + dw;
  const h = f.h + dh;
  if (w < 1 || h < 1) return format;
  // Only formats that really change in the asked direction
  const candidates = FORMATS.filter(c => {
    const cw = c.w === 'full' ? cols : c.w;
    if (cw > cols) return false;
    if (dw > 0 && cw <= (f.w === 'full' ? cols : f.w)) return false;
    if (dw < 0 && cw >= (f.w === 'full' ? cols : f.w)) return false;
    if (dh > 0 && c.h <= f.h) return false;
    if (dh < 0 && c.h >= f.h) return false;
    return true;
  });
  let best = format;
  let bestDist = Infinity;
  for (const c of candidates) {
    const cw = c.w === 'full' ? cols : c.w;
    const d = Math.abs(cw - w) + Math.abs(c.h - h) + (c.w === 'full' ? 0.1 : 0);
    if (d < bestDist) { best = c.id; bestDist = d; }
  }
  return best;
}
