import { Component, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { SnackbarService } from '../ui/snackbar/snackbar.service';

export interface InspectRow { label: string; value: string; token?: string; }
export interface InspectSection { title: string; rows: InspectRow[]; }
export interface BoxModel {
  width: number; height: number;
  margin: [number, number, number, number];   // T R B L
  border: [number, number, number, number];
  padding: [number, number, number, number];
}
export interface InspectInfo {
  tag: string;
  classes: string[];
  box: BoxModel;
  sections: InspectSection[];
}

export interface Rect { x: number; y: number; w: number; h: number; }
export interface MeasureLine {
  orient: 'h' | 'v';
  left: number; top: number; len: number; label: string;
}

const PANEL_W = 340;

/**
 * Inspecteur de handoff in-app (v2), façon Zeplin / Figma Dev Mode.
 * - Panneau **docké à droite** qui pousse l'app (n'occulte pas le contenu).
 * - Survol : surligne + box model (margin/border/padding/content), typo, couleurs
 *   (avec tokens DS), layout fl/grid, position.
 * - Clic : sélectionne un élément. Survol d'un autre → **distances** (redlines).
 * - Alt+I active/désactive, Esc désélectionne puis sort.
 */
@Component({
  selector: 'app-inspector',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss',
  host: { '(document:keydown)': 'onKeydown($event)' },
})
export class InspectorComponent {
  private snackbar = inject(SnackbarService);

  active   = signal(false);
  selected = signal<HTMLElement | null>(null);
  hovered  = signal<HTMLElement | null>(null);
  private tick = signal(0); // force recompute des rects (scroll/move)

  /** Élément dont on affiche les infos : la sélection sinon le survol. */
  private focusEl = computed(() => this.selected() ?? this.hovered());
  info = computed<InspectInfo | null>(() => {
    this.tick();
    const el = this.focusEl();
    return el ? this.build(el) : null;
  });

  selectedRect = computed<Rect | null>(() => { this.tick(); return this.rectOf(this.selected()); });
  hoveredRect  = computed<Rect | null>(() => { this.tick(); return this.rectOf(this.hovered()); });

  /** Lignes de distance entre l'élément sélectionné et l'élément survolé. */
  measureLines = computed<MeasureLine[]>(() => {
    const s = this.selected(), h = this.hovered();
    if (!s || !h || s === h) return [];
    const a = s.getBoundingClientRect(), b = h.getBoundingClientRect();
    return this.gaps(a, b);
  });

  private colorMap = new Map<string, string>();
  private lenMap   = new Map<string, string>();
  private mapsBuilt = false;
  private canvas?: CanvasRenderingContext2D | null;

  private readonly onMove   = (e: MouseEvent) => this.pick(e);
  private readonly onClick  = (e: MouseEvent) => this.onInspectClick(e);
  private readonly onScroll = () => this.tick.update(v => v + 1);

  constructor() {
    effect(() => {
      if (this.active()) {
        window.addEventListener('mousemove', this.onMove, true);
        window.addEventListener('click', this.onClick, true);
        window.addEventListener('scroll', this.onScroll, true);
        document.body.style.transition = 'margin-right 0.15s ease';
        document.body.style.marginRight = PANEL_W + 'px';
      } else {
        window.removeEventListener('mousemove', this.onMove, true);
        window.removeEventListener('click', this.onClick, true);
        window.removeEventListener('scroll', this.onScroll, true);
        document.body.style.marginRight = '';
      }
    });
  }

  onKeydown(e: KeyboardEvent) {
    if (e.altKey && e.code === 'KeyI') {
      e.preventDefault();
      this.toggle();
    } else if (e.key === 'Escape' && this.active()) {
      if (this.selected()) this.selected.set(null);
      else this.deactivate();
    }
  }

  toggle() { this.active() ? this.deactivate() : this.activate(); }

  private activate() {
    this.buildMaps();
    this.active.set(true);
    this.selected.set(null);
    this.hovered.set(null);
  }
  deactivate() {
    this.active.set(false);
    this.selected.set(null);
    this.hovered.set(null);
  }

  private isOwn(el: Element | null): boolean { return !!el?.closest('app-inspector'); }

  private pick(e: MouseEvent) {
    if (!this.active()) return;
    const el = e.target as HTMLElement | null;
    if (!el || this.isOwn(el)) return;
    this.hovered.set(el);
  }

  private onInspectClick(e: MouseEvent) {
    const el = e.target as HTMLElement | null;
    if (this.isOwn(el)) return; // clics du panneau (copie) laissés passer
    e.preventDefault();
    e.stopPropagation();
    if (el) this.selected.set(this.selected() === el ? null : el);
  }

  private rectOf(el: HTMLElement | null): Rect | null {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }

  copy(row: InspectRow) {
    const text = row.token ? `var(${row.token})` : row.value;
    navigator.clipboard?.writeText(text).then(
      () => this.snackbar.show(`Copied ${text}`, { tone: 'success', icon: 'check' }),
      () => {},
    );
  }

  // ── Distances entre deux rects ─────────────────────────────────────────
  private gaps(a: DOMRect, b: DOMRect): MeasureLine[] {
    const out: MeasureLine[] = [];
    const cy = (Math.max(a.top, b.top) + Math.min(a.bottom, b.bottom)) / 2;
    const cx = (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2;
    // horizontal
    if (b.left >= a.right) out.push({ orient: 'h', left: a.right, top: cy, len: b.left - a.right, label: Math.round(b.left - a.right) + '' });
    else if (a.left >= b.right) out.push({ orient: 'h', left: b.right, top: cy, len: a.left - b.right, label: Math.round(a.left - b.right) + '' });
    // vertical
    if (b.top >= a.bottom) out.push({ orient: 'v', left: cx, top: a.bottom, len: b.top - a.bottom, label: Math.round(b.top - a.bottom) + '' });
    else if (a.top >= b.bottom) out.push({ orient: 'v', left: cx, top: b.bottom, len: a.top - b.bottom, label: Math.round(a.top - b.bottom) + '' });
    return out;
  }

  // ── Construction des infos ─────────────────────────────────────────────
  private build(el: HTMLElement): InspectInfo {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const px = (v: string) => Math.round(parseFloat(v) || 0);

    const box: BoxModel = {
      width: Math.round(r.width), height: Math.round(r.height),
      margin:  [px(cs.marginTop), px(cs.marginRight), px(cs.marginBottom), px(cs.marginLeft)],
      border:  [px(cs.borderTopWidth), px(cs.borderRightWidth), px(cs.borderBottomWidth), px(cs.borderLeftWidth)],
      padding: [px(cs.paddingTop), px(cs.paddingRight), px(cs.paddingBottom), px(cs.paddingLeft)],
    };

    const sections: InspectSection[] = [];

    // Layout
    const layoutRows: InspectRow[] = [{ label: 'Display', value: cs.display }];
    if (cs.display.includes('flex') || cs.display.includes('grid')) {
      if (cs.flexDirection) layoutRows.push({ label: 'Direction', value: cs.flexDirection });
      layoutRows.push({ label: 'Justify', value: cs.justifyContent });
      layoutRows.push({ label: 'Align', value: cs.alignItems });
      if (cs.gap && cs.gap !== 'normal') layoutRows.push({ label: 'Gap', value: cs.gap, token: this.lenMap.get(cs.gap.split(' ')[0]) });
    }
    sections.push({ title: 'Layout', rows: layoutRows });

    // Typography
    if (el.textContent && el.textContent.trim()) {
      sections.push({ title: 'Typography', rows: [
        { label: 'Family', value: cs.fontFamily.split(',')[0].replace(/["']/g, '') },
        { label: 'Size', value: cs.fontSize, token: this.lenMap.get(cs.fontSize) },
        { label: 'Weight', value: cs.fontWeight },
        { label: 'Line height', value: cs.lineHeight, token: this.lenMap.get(cs.lineHeight) },
        { label: 'Letter spacing', value: cs.letterSpacing === 'normal' ? '0' : cs.letterSpacing },
        this.colorRow('Color', cs.color),
      ]});
    }

    // Fills & borders
    const fillRows: InspectRow[] = [];
    const bg = cs.backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') fillRows.push(this.colorRow('Background', bg));
    if (box.border.some(b => b > 0)) {
      const c = this.colorRow('Border color', cs.borderTopColor);
      fillRows.push({ label: 'Border', value: `${cs.borderTopWidth} ${cs.borderTopStyle}`, token: c.token });
    }
    if (cs.borderRadius && cs.borderRadius !== '0px') fillRows.push({ label: 'Radius', value: cs.borderRadius, token: this.lenMap.get(cs.borderRadius) });
    if (cs.boxShadow && cs.boxShadow !== 'none') fillRows.push({ label: 'Shadow', value: cs.boxShadow });
    if (fillRows.length) sections.push({ title: 'Fills & borders', rows: fillRows });

    // Position
    sections.push({ title: 'Position', rows: [
      { label: 'X / Y', value: `${Math.round(r.x)}, ${Math.round(r.y)}` },
      { label: 'Position', value: cs.position },
    ]});

    return { tag: el.tagName.toLowerCase(), classes: Array.from(el.classList), box, sections };
  }

  private colorRow(label: string, raw: string): InspectRow {
    const norm = this.normColor(raw);
    return { label, value: norm, token: this.colorMap.get(norm) };
  }

  // ── Reverse maps depuis :root ──────────────────────────────────────────
  private buildMaps() {
    if (this.mapsBuilt) return;
    const cs = getComputedStyle(document.documentElement);
    for (let i = 0; i < cs.length; i++) {
      const name = cs[i];
      if (!name.startsWith('--foundation') && !name.startsWith('--semantic')) continue;
      const val = cs.getPropertyValue(name).trim();
      if (!val) continue;
      const semantic = name.startsWith('--semantic');
      if (this.looksColor(val)) {
        const key = this.normColor(val);
        if (!this.colorMap.has(key) || semantic) this.colorMap.set(key, name);
      } else if (/^-?\d/.test(val)) {
        if (!this.lenMap.has(val) || semantic) this.lenMap.set(val, name);
      }
    }
    this.mapsBuilt = true;
  }

  private looksColor(v: string): boolean {
    return v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl');
  }
  private normColor(v: string): string {
    if (!this.canvas) this.canvas = document.createElement('canvas').getContext('2d');
    if (!this.canvas) return v;
    try { this.canvas.fillStyle = '#000'; this.canvas.fillStyle = v; return this.canvas.fillStyle; }
    catch { return v; }
  }
}
