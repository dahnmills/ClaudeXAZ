import { Component, computed, effect, inject, signal } from '@angular/core';
import { SnackbarService } from '../ui/snackbar/snackbar.service';
import { FeedbackService } from './feedback.service';
import { FeedbackDraft, FeedbackRect, FeedbackTarget, Reaction } from './feedback.types';

interface Rect { x: number; y: number; w: number; h: number; }

/** Mode d'activité du picking. */
type Mode = 'off' | 'element' | 'zone';

/** Nature de la cible dont on parle dans le popover (fixé en bas-droite). */
type Placement = 'element' | 'zone' | 'screen';

/** Taille min d'une zone (px) pour être prise en compte. */
const MIN_ZONE = 12;
/** Largeur max de la vignette PNG stockée. */
const THUMB_MAX_W = 480;

/**
 * Echo — compagnon de feedback continu, non-invasif. Identité visuelle propre
 * (tokens --ec-*, bleu électrique), indépendante du design system Qirin.
 * Monté UNIQUEMENT dans le ReviewShell (`/review/*`) → n'apparaît jamais sur
 * les routes de dev normales.
 *
 * Deux gestes de ciblage (menu de la pastille) :
 *   • « Pointer un élément » → survol (halo) + clic sur un élément.
 *   • « Sélectionner une zone » → cliquer-glisser un rectangle libre.
 * Une vignette (html2canvas) accompagne le retour pour situer la cible.
 * Ossature de picking DOM inspirée de InspectorComponent.
 */
@Component({
  selector: 'app-feedback-companion',
  standalone: true,
  imports: [],
  templateUrl: './feedback-companion.component.html',
  styleUrl: './feedback-companion.component.scss',
  host: { '(document:keydown)': 'onKeydown($event)' },
})
export class FeedbackCompanionComponent {
  private feedback = inject(FeedbackService);
  private snackbar = inject(SnackbarService);

  /** Mode de ciblage courant. */
  mode = signal<Mode>('off');
  /** Menu de la pastille ouvert. */
  menuOpen = signal(false);

  /** Élément survolé en mode « element ». */
  private hovered = signal<HTMLElement | null>(null);
  private tick = signal(0);   // force le recompute des rects (scroll/resize)

  /** Rectangle en cours de tracé en mode « zone ». */
  private zoneDraft = signal<Rect | null>(null);
  zoneRect = computed(() => this.zoneDraft());

  /** Cible verrouillée + popover de saisie ouvert. */
  target = signal<FeedbackTarget | null>(null);
  placement = signal<Placement | null>(null);
  editorOpen = computed(() => this.placement() !== null);

  /** Surbrillance persistante de la cible retenue (élément ou zone). */
  selectedRect = signal<Rect | null>(null);

  /** Vignette capturée (data URL) + état de capture. */
  screenshot = signal<string | null>(null);
  capturing = signal(false);

  /** État du formulaire de saisie. */
  selectedReaction = signal<Reaction | null>(null);
  ratingValue = signal<number>(0);
  comment = signal('');

  canSubmit = computed(() =>
    this.selectedReaction() !== null ||
    this.ratingValue() > 0 ||
    this.comment().trim().length > 0,
  );

  hoveredRect = computed<Rect | null>(() => {
    this.tick();
    return this.mode() === 'element' ? this.rectOf(this.hovered()) : null;
  });

  private readonly onMove = (e: MouseEvent) => this.pick(e);
  private readonly onClick = (e: MouseEvent) => this.onPointerClick(e);
  private readonly onScroll = () => this.tick.update((v) => v + 1);
  private readonly onZoneDown = (e: MouseEvent) => this.zoneStart(e);
  private readonly onZoneMove = (e: MouseEvent) => this.zoneMove(e);
  private readonly onZoneUp = (e: MouseEvent) => this.zoneEnd(e);
  private zoneOrigin: { x: number; y: number } | null = null;

  constructor() {
    effect(() => {
      const m = this.mode();
      this.detach();
      if (m === 'element') {
        window.addEventListener('mousemove', this.onMove, true);
        window.addEventListener('click', this.onClick, true);
        window.addEventListener('scroll', this.onScroll, true);
        window.addEventListener('resize', this.onScroll, true);
      } else if (m === 'zone') {
        window.addEventListener('mousedown', this.onZoneDown, true);
        window.addEventListener('mousemove', this.onZoneMove, true);
        window.addEventListener('mouseup', this.onZoneUp, true);
      } else {
        this.hovered.set(null);
        this.zoneDraft.set(null);
      }
    });
  }

  private detach() {
    window.removeEventListener('mousemove', this.onMove, true);
    window.removeEventListener('click', this.onClick, true);
    window.removeEventListener('scroll', this.onScroll, true);
    window.removeEventListener('resize', this.onScroll, true);
    window.removeEventListener('mousedown', this.onZoneDown, true);
    window.removeEventListener('mousemove', this.onZoneMove, true);
    window.removeEventListener('mouseup', this.onZoneUp, true);
  }

  // ── Raccourcis clavier ────────────────────────────────────────────────
  onKeydown(e: KeyboardEvent) {
    if (e.altKey && e.code === 'KeyF') {
      e.preventDefault();
      this.mode() === 'element' ? this.mode.set('off') : this.startElement();
    } else if (e.key === 'Escape') {
      if (this.editorOpen()) this.closeEditor();
      else if (this.mode() !== 'off') this.mode.set('off');
      else if (this.menuOpen()) this.menuOpen.set(false);
    }
  }

  // ── Pastille / menu ───────────────────────────────────────────────────
  toggleMenu() { this.menuOpen.update((v) => !v); }

  startElement() {
    this.menuOpen.set(false);
    this.closeEditor();
    this.mode.set('element');
  }

  startZone() {
    this.menuOpen.set(false);
    this.closeEditor();
    this.mode.set('zone');
  }

  /** Retour global sur l'écran courant (pas un élément). */
  startScreenFeedback() {
    this.menuOpen.set(false);
    this.mode.set('off');
    this.selectedRect.set(null);
    this.resetForm();
    this.screenshot.set(null);
    this.target.set(null);
    this.placement.set('screen');
  }

  // ── Mode élément : survol + clic ──────────────────────────────────────
  private isOwn(el: Element | null): boolean {
    return !!el?.closest('app-feedback-companion');
  }

  private pick(e: MouseEvent) {
    const el = e.target as HTMLElement | null;
    if (!el || this.isOwn(el)) return;
    this.hovered.set(el);
  }

  private onPointerClick(e: MouseEvent) {
    const el = e.target as HTMLElement | null;
    if (this.isOwn(el)) return;
    e.preventDefault();
    e.stopPropagation();
    if (el) this.captureElement(el);
  }

  private captureElement(el: HTMLElement) {
    const r = el.getBoundingClientRect();
    const rect: FeedbackRect = { x: r.x, y: r.y, w: r.width, h: r.height };
    const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ');
    const dsClasses = Array.from(el.classList).filter((c) => c.startsWith('ds-'));
    this.mode.set('off');
    this.selectedRect.set({ x: r.x, y: r.y, w: r.width, h: r.height });
    this.openEditor(
      {
        mode: 'element',
        selector: this.cssPath(el),
        text: text ? text.slice(0, 140) : null,
        label: dsClasses.length ? dsClasses.join(' ') : null,
        rect,
      },
      'element',
    );
    void this.capture(rect);
  }

  // ── Mode zone : cliquer-glisser ───────────────────────────────────────
  private zoneStart(e: MouseEvent) {
    // La couche de capture EST dans le companion : on ne rejette que la
    // pastille / le menu (dock), pas la surface de drag.
    if ((e.target as Element)?.closest('.fb-dock')) return;
    e.preventDefault();
    this.zoneOrigin = { x: e.clientX, y: e.clientY };
    this.zoneDraft.set({ x: e.clientX, y: e.clientY, w: 0, h: 0 });
  }

  private zoneMove(e: MouseEvent) {
    const o = this.zoneOrigin;
    if (!o) return;
    e.preventDefault();
    this.zoneDraft.set({
      x: Math.min(o.x, e.clientX),
      y: Math.min(o.y, e.clientY),
      w: Math.abs(e.clientX - o.x),
      h: Math.abs(e.clientY - o.y),
    });
  }

  private zoneEnd(e: MouseEvent) {
    const draft = this.zoneDraft();
    this.zoneOrigin = null;
    if (!draft || draft.w < MIN_ZONE || draft.h < MIN_ZONE) {
      this.zoneDraft.set(null);
      return;
    }
    e.preventDefault();
    const rect: FeedbackRect = { x: draft.x, y: draft.y, w: draft.w, h: draft.h };
    this.mode.set('off');
    this.zoneDraft.set(null);
    this.selectedRect.set({ x: rect.x, y: rect.y, w: rect.w, h: rect.h });
    this.openEditor(
      {
        mode: 'zone',
        selector: null,
        text: null,
        label: this.componentsInside(rect),
        rect,
      },
      'zone',
    );
    void this.capture(rect);
  }

  /** Liste les composants `ds-*` dont le centre tombe dans la zone. */
  private componentsInside(rect: FeedbackRect): string | null {
    const found = new Set<string>();
    document.querySelectorAll('[class*="ds-"]').forEach((node) => {
      const r = (node as HTMLElement).getBoundingClientRect();
      const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      if (cx >= rect.x && cx <= rect.x + rect.w && cy >= rect.y && cy <= rect.y + rect.h) {
        const cls = Array.from((node as HTMLElement).classList).find((c) => c.startsWith('ds-'));
        if (cls) found.add(cls);
      }
    });
    return found.size ? Array.from(found).slice(0, 8).join(' ') : null;
  }

  // ── Capture d'écran (html2canvas, lazy) ────────────────────────────────
  private async capture(rect: FeedbackRect) {
    this.screenshot.set(null);
    this.capturing.set(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(document.body, {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.w,
        height: rect.h,
        scale: 1,
        logging: false,
        useCORS: true,
        backgroundColor: null,
        ignoreElements: (el) => el.tagName?.toLowerCase() === 'app-feedback-companion',
      });
      this.screenshot.set(this.downscale(canvas, THUMB_MAX_W));
    } catch {
      this.screenshot.set(null);   // capture optionnelle : on n'échoue jamais le retour
    } finally {
      this.capturing.set(false);
    }
  }

  private downscale(source: HTMLCanvasElement, maxW: number): string {
    const scale = Math.min(1, maxW / Math.max(1, source.width));
    if (scale >= 1) return source.toDataURL('image/png');
    const c = document.createElement('canvas');
    c.width = Math.round(source.width * scale);
    c.height = Math.round(source.height * scale);
    c.getContext('2d')?.drawImage(source, 0, 0, c.width, c.height);
    return c.toDataURL('image/png');
  }

  /** Chemin CSS court et lisible (tag + #id / .ds-* jusqu'à 4 niveaux). */
  private cssPath(el: HTMLElement): string {
    const parts: string[] = [];
    let node: HTMLElement | null = el;
    let depth = 0;
    while (node && node.nodeType === 1 && depth < 4) {
      let seg = node.tagName.toLowerCase();
      if (node.id) { seg += `#${node.id}`; parts.unshift(seg); break; }
      const dsClass = Array.from(node.classList).find((c) => c.startsWith('ds-'));
      if (dsClass) seg += `.${dsClass}`;
      parts.unshift(seg);
      node = node.parentElement;
      depth++;
    }
    return parts.join(' > ');
  }

  private rectOf(el: HTMLElement | null): Rect | null {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  }

  private openEditor(target: FeedbackTarget, placement: Placement) {
    this.resetForm();
    this.screenshot.set(null);
    this.target.set(target);
    this.placement.set(placement);
  }

  // ── Saisie ────────────────────────────────────────────────────────────
  private resetForm() {
    this.selectedReaction.set(null);
    this.ratingValue.set(0);
    this.comment.set('');
  }

  /** Sélectionne / dé-sélectionne une réaction (ne ferme rien). */
  toggleReaction(reaction: Reaction) {
    this.selectedReaction.update((cur) => (cur === reaction ? null : reaction));
  }

  /** Étoiles : reclic sur la même note la remet à zéro. */
  setRating(n: number) {
    this.ratingValue.update((cur) => (cur === n ? 0 : n));
  }

  onComment(ev: Event) {
    this.comment.set((ev.target as HTMLTextAreaElement).value);
  }

  /**
   * Envoi unifié : réaction + note + commentaire + vignette d'un seul coup.
   * Le `kind` reflète le signal le plus riche (screen > comment > rating > reaction).
   */
  submit() {
    if (!this.canSubmit()) return;
    const reaction = this.selectedReaction();
    const rating = this.ratingValue() > 0 ? this.ratingValue() : null;
    const comment = this.comment().trim() || null;

    let kind: FeedbackDraft['kind'];
    if (this.placement() === 'screen') kind = 'screen';
    else if (comment) kind = 'comment';
    else if (rating !== null) kind = 'rating';
    else kind = 'reaction';

    const draft: FeedbackDraft = {
      kind, reaction, rating, comment,
      target: this.target(),
      screenshot: this.screenshot(),
    };
    void this.feedback.submit(draft);
    this.snackbar.show('Merci pour votre retour', { tone: 'success', icon: 'check' });
    this.closeEditor();
  }

  closeEditor() {
    this.placement.set(null);
    this.target.set(null);
    this.selectedRect.set(null);
    this.screenshot.set(null);
    this.capturing.set(false);
    this.resetForm();
  }
}
