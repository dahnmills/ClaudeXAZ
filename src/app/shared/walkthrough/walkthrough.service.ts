import { Injectable, inject } from '@angular/core';
import { driver, type Driver, type DriveStep } from 'driver.js';
import { ToasterService } from '../ui/toaster/toaster.service';
import type { Walkthrough, WalkthroughStep } from './walkthrough.model';

const POLL_MS = 100;
/** L'élément suivant doit garder la même position sur 3 relevés (300 ms) : un
 *  drawer qui glisse ou un board qui charge a fini de bouger. */
const STABLE_POLLS = 3;
/** Délai maximal d'apparition de l'étape suivante (chargement du board : 2,4 s). */
const WAIT_MAX_MS = 8000;
/** Élément de l'étape en cours introuvable au-delà : l'utilisateur est sorti du parcours. */
const LOST_AFTER_MS = 2500;
/** Pendant l'attente, la bulle et le voile s'effacent en fondu : on voit la page
 *  charger au lieu d'une bulle qui pointe un cadre vide. */
const WAITING_CLASS = 'qirin-tour--waiting';
/** Fermeture : même fondu, puis driver.js démonte le tour. */
const CLOSING_CLASS = 'qirin-tour--closing';
/** Durée du fondu (aligné sur _walkthrough.scss). */
const FADE_MS = 260;
/** Glissement de la découpe du voile d'un élément au suivant. */
const STAGE_MS = 450;
/** Marge de la découpe du voile autour de l'élément : place pour l'onde de la bordure focus. */
const STAGE_PADDING = 14;

/**
 * Joue un tour guidé avec driver.js. L'utilisateur fait chaque geste :
 * - étape « click » : pas de bouton, elle avance quand il clique l'élément mis en avant ;
 * - étape « gone » : elle avance quand l'élément nommé disparaît (ex. champ de renommage confirmé) ;
 * - étapes « next » / « done » : un bouton dans la bulle (intro, geste libre, fin).
 * Le voile reste du début à la fin. Entre deux étapes, le tour attend que l'élément suivant soit à l'écran et immobile
 * avant de le montrer. S'il sort du parcours, le tour s'arrête au lieu de pointer dans le vide.
 */
@Injectable({ providedIn: 'root' })
export class WalkthroughService {
  private toaster = inject(ToasterService);
  private active: Driver | null = null;
  private tour: Walkthrough | null = null;
  private watch: ReturnType<typeof setInterval> | null = null;
  private waiting = false;
  private waitTick: ReturnType<typeof setInterval> | null = null;
  private detachClick: (() => void) | null = null;

  start(w: Walkthrough): void {
    this.kill();
    this.tour = w;
    this.active = driver({
      steps: w.steps.map(s => this.toDriveStep(s)),
      showProgress: true,
      progressText: '{{current}} / {{total}}',
      closeBtnLabel: 'Quit the tour',
      allowClose: true,
      // Les flèches feraient sauter une étape que l'utilisateur doit faire lui-même
      allowKeyboardControl: false,
      overlayClickBehavior: 'none',
      popoverClass: 'qirin-walkthrough',
      stagePadding: STAGE_PADDING,
      // Le voile du tour est celui du DS (modales, drawers)
      overlayColor: 'var(--semantic-color-overlay-backdrop)',
      overlayOpacity: 1,
      stageRadius: 8,
      duration: STAGE_MS,
      // Début de mise en avant : la bulle revient en fondu et le trou se rouvre pendant que
      // la découpe glisse vers l'élément (driver.js masque l'ancienne bulle dans le
      // même tick). Le clic est écouté dès maintenant : un utilisateur rapide ne
      // doit pas bloquer le tour.
      onHighlightStarted: el => {
        if (!this.waiting) document.body.classList.remove(WAITING_CLASS);
        this.armClick(el);
      },
      // Croix, Done : on fond le tour avant de le démonter
      onDestroyStarted: () => this.stop(),
      onDestroyed: () => this.cleanup(),
    });
    this.active.drive();
    this.watchSteps();
    document.addEventListener('keydown', this.onKeydown, true);
  }

  /** Ferme le tour en fondu. */
  stop(): void {
    if (!this.active || document.body.classList.contains(CLOSING_CLASS)) return;
    document.body.classList.add(CLOSING_CLASS);
    const closing = this.active;
    setTimeout(() => { if (this.active === closing) this.kill(); }, FADE_MS);
  }

  /** Ferme le tour sur-le-champ (remplacement par un autre tour). */
  private kill(): void {
    this.active?.destroy();
    this.cleanup();
  }

  private toDriveStep(s: WalkthroughStep): DriveStep {
    const hasButton = s.advance === 'next' || s.advance === 'done';
    return {
      element: s.element,
      popover: {
        title: s.title,
        description: s.description,
        side: s.side,
        align: 'start',
        showButtons: hasButton ? ['next', 'close'] : ['close'],
        nextBtnText: s.nextLabel ?? 'Next',
        doneBtnText: s.nextLabel ?? 'Done',
      },
    };
  }

  private step(i: number | undefined): WalkthroughStep | null {
    return i === undefined || !this.tour ? null : this.tour.steps[i] ?? null;
  }

  private onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.active) this.stop();
  };

  /** Étape « click » : le clic de l'utilisateur part vers l'application, puis le tour attend la suite. */
  private armClick(el: Element | undefined): void {
    this.detachClick?.();
    this.detachClick = null;
    if (!el || this.step(this.active?.getActiveIndex())?.advance !== 'click') return;
    const onClick = () => { this.detachClick?.(); this.detachClick = null; this.advanceWhenReady(); };
    el.addEventListener('click', onClick, true);
    this.detachClick = () => el.removeEventListener('click', onClick, true);
  }

  /** Efface la bulle et referme le trou du voile, attend que l'élément de l'étape
   *  suivante soit là et immobile, puis le montre. */
  private advanceWhenReady(): void {
    const next = this.step((this.active?.getActiveIndex() ?? -1) + 1);
    if (!next?.element) { this.active?.moveNext(); return; }

    this.waiting = true;
    document.body.classList.add(WAITING_CLASS);
    this.closeHole();
    const started = Date.now();
    let last = '';
    let stable = 0;
    this.waitTick = setInterval(() => {
      const r = document.querySelector(next.element!)?.getBoundingClientRect();
      const key = r && r.width && r.height ? `${r.left},${r.top},${r.width},${r.height}` : '';
      stable = key && key === last ? stable + 1 : 0;
      last = key;
      if (stable >= STABLE_POLLS) {
        // La bulle reste masquée jusqu'au début de l'étape suivante
        // (onHighlightStarted) : sinon l'ancienne bulle réapparaît un instant.
        this.endWait({ keepHidden: true });
        this.openFrom(next.element!);
        this.active?.moveNext();
      } else if (Date.now() - started > WAIT_MAX_MS) {
        this.lost();
      }
    }, POLL_MS);
  }

  /**
   * Referme le trou du voile au clic : le voile devient uniforme pendant que la page
   * réagit. Le clic décale souvent la page (un drawer s'ouvre et pousse le contenu) ;
   * un trou laissé en place éclairerait un emplacement devenu vide. driver.js ne
   * redessine le voile qu'à l'étape suivante (ou au scroll / resize).
   */
  private closeHole(): void {
    const path = document.querySelector('.driver-overlay path');
    const w = window.innerWidth, h = window.innerHeight;
    path?.setAttribute('d', `M${w},0L0,0L0,${h}L${w},${h}L${w},0Z`);
  }

  /**
   * Fait partir l'ouverture du trou du centre du nouvel élément : driver.js anime la
   * découpe depuis sa dernière position connue, qu'on ramène à ce point. Le trou
   * s'ouvre sur place au lieu de glisser depuis l'ancien emplacement.
   */
  private openFrom(selector: string): void {
    const r = document.querySelector(selector)?.getBoundingClientRect();
    const state = this.active?.getState() as Record<string, unknown> | undefined;
    if (!r || !state) return;
    state['__activeStagePosition'] = { x: r.left + r.width / 2, y: r.top + r.height / 2, width: 0, height: 0 };
  }

  private endWait(opts: { keepHidden?: boolean } = {}): void {
    if (this.waitTick) clearInterval(this.waitTick);
    this.waitTick = null;
    this.waiting = false;
    if (!opts.keepHidden) document.body.classList.remove(WAITING_CLASS);
  }

  /**
   * Suivi de l'étape en cours, hors attente :
   * - « gone » : avance quand l'élément nommé, vu au moins une fois, a disparu ;
   * - toute étape ciblée : arrêt si son élément reste introuvable (sortie du parcours).
   */
  private watchSteps(): void {
    let missingSince: number | null = null;
    let goneSeen = false;
    let lastIndex: number | undefined;
    this.watch = setInterval(() => {
      if (this.waiting) return;
      const i = this.active?.getActiveIndex();
      const s = this.step(i);
      if (i !== lastIndex) { lastIndex = i; goneSeen = false; missingSince = null; }
      if (!s?.element) return;

      if (s.advance === 'gone' && s.gone) {
        if (document.querySelector(s.gone)) goneSeen = true;
        else if (goneSeen) { this.advanceWhenReady(); return; }
      }

      if (document.querySelector(s.element)) { missingSince = null; return; }
      missingSince ??= Date.now();
      if (Date.now() - missingSince > LOST_AFTER_MS) this.lost();
    }, POLL_MS * 2);
  }

  private lost(): void {
    // Déjà en train de fermer : un seul toast
    if (!this.active || document.body.classList.contains(CLOSING_CLASS)) return;
    this.endWait({ keepHidden: true });
    this.stop();
    this.toaster.show('Start it again from the Help menu whenever you like.', { tone: 'info', title: 'Tour stopped' });
  }

  private cleanup(): void {
    if (this.watch) clearInterval(this.watch);
    this.watch = null;
    this.detachClick?.();
    this.detachClick = null;
    this.endWait();
    document.body.classList.remove(CLOSING_CLASS);
    this.active = null;
    this.tour = null;
    document.removeEventListener('keydown', this.onKeydown, true);
  }
}
