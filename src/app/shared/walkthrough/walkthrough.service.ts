import { Injectable, inject } from '@angular/core';
import { driver, type Driver, type DriveStep } from 'driver.js';
import { ToasterService } from '../ui/toaster/toaster.service';
import type { Walkthrough, WalkthroughStep } from './walkthrough.model';

/** Délai laissé à l'étape suivante pour apparaître (drawer, chargement du board). */
const WAIT_FOR_NEXT_MS = 6000;
/** Au-delà, l'élément visé a disparu pour de bon (drawer fermé, Cancel) : on s'arrête. */
const LOST_AFTER_MS = 6500;
const WATCH_EVERY_MS = 250;
/** Un panneau qui glisse (ds-drawer : 320 ms) déplace l'élément après sa mise en
 *  avant : on recale la bulle et le curseur une fois le mouvement fini. */
const SETTLE_MS = 400;

/**
 * Joue un tour guidé avec driver.js. L'utilisateur fait chaque geste :
 * - étape « click » : pas de bouton, elle avance quand il clique l'élément mis en avant ;
 * - étape « gone » : elle avance quand l'élément nommé disparaît (ex. champ de renommage confirmé) ;
 * - étapes « next » / « done » : un bouton dans la bulle (intro, geste libre, fin).
 * Un curseur fantôme part de la bulle, rejoint l'élément à cliquer et le « tape » ;
 * l'élément mis en avant pulse doucement. S'il sort du parcours, l'élément visé
 * disparaît et le tour s'arrête au lieu de pointer dans le vide.
 */
@Injectable({ providedIn: 'root' })
export class WalkthroughService {
  private toaster = inject(ToasterService);
  private active: Driver | null = null;
  private tour: Walkthrough | null = null;
  private watch: ReturnType<typeof setInterval> | null = null;
  private cursor: HTMLElement | null = null;

  start(w: Walkthrough): void {
    this.stop();
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
      stagePadding: 4,
      stageRadius: 4,
      onHighlighted: () => this.onStep(),
      onDestroyed: () => this.cleanup(),
    });
    this.active.drive();
    this.watchSteps();
    document.addEventListener('keydown', this.onKeydown, true);
  }

  stop(): void {
    this.active?.destroy();
    this.cleanup();
  }

  private toDriveStep(s: WalkthroughStep): DriveStep {
    const hasButton = s.advance === 'next' || s.advance === 'done';
    return {
      element: s.element,
      advanceOnClick: s.advance === 'click',
      waitForElement: s.element ? WAIT_FOR_NEXT_MS : undefined,
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

  private currentStep(): WalkthroughStep | null {
    const i = this.active?.getActiveIndex();
    return i === undefined || !this.tour ? null : this.tour.steps[i] ?? null;
  }

  private onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.active) this.stop();
  };

  /** Nouvelle étape : curseur fantôme vers la cible, puis recalage après le mouvement. */
  private onStep(): void {
    this.placeCursor(true);
    setTimeout(() => {
      this.active?.refresh();
      this.placeCursor(false);
    }, SETTLE_MS);
  }

  /**
   * Suivi des étapes, à intervalle :
   * - « gone » : avance quand l'élément nommé, vu au moins une fois, a disparu ;
   * - toute étape ciblée : arrêt si son élément reste introuvable (sortie du parcours).
   */
  private watchSteps(): void {
    let missingSince: number | null = null;
    let goneSeen = false;
    let lastIndex: number | undefined;
    this.watch = setInterval(() => {
      const i = this.active?.getActiveIndex();
      const step = this.currentStep();
      if (i !== lastIndex) { lastIndex = i; goneSeen = false; missingSince = null; }
      if (!step?.element) return;

      if (step.advance === 'gone' && step.gone) {
        const there = !!document.querySelector(step.gone);
        if (there) goneSeen = true;
        else if (goneSeen) { this.active?.moveNext(); return; }
      }

      if (document.querySelector(step.element)) { missingSince = null; return; }
      missingSince ??= Date.now();
      if (Date.now() - missingSince > LOST_AFTER_MS) {
        this.stop();
        this.toaster.show('Start it again from the Help menu whenever you like.', { tone: 'info', title: 'Tour stopped' });
      }
    }, WATCH_EVERY_MS);
  }

  /** Curseur fantôme : seulement quand l'étape attend un clic de l'utilisateur. */
  private placeCursor(travel: boolean): void {
    const step = this.currentStep();
    const target = step?.element && step.advance === 'click' ? document.querySelector(step.element) : null;
    if (!target) { this.cursor?.classList.remove('qirin-tour-cursor--on'); return; }

    this.cursor ??= Object.assign(document.createElement('div'), { className: 'qirin-tour-cursor' });
    if (!this.cursor.isConnected) document.body.appendChild(this.cursor);

    const t = target.getBoundingClientRect();
    const p = document.querySelector('.driver-popover')?.getBoundingClientRect();
    const to = { x: t.left + t.width / 2, y: t.top + t.height / 2 };
    const from = travel && p ? { x: p.left + p.width / 2, y: p.top + p.height / 2 } : to;
    const c = this.cursor;
    c.style.setProperty('--from-x', `${from.x}px`);
    c.style.setProperty('--from-y', `${from.y}px`);
    c.style.setProperty('--to-x', `${to.x}px`);
    c.style.setProperty('--to-y', `${to.y}px`);
    // Relance l'animation : retrait, reflow, remise
    c.classList.remove('qirin-tour-cursor--on');
    void c.offsetWidth;
    c.classList.add('qirin-tour-cursor--on');
  }

  private cleanup(): void {
    if (this.watch) clearInterval(this.watch);
    this.watch = null;
    this.active = null;
    this.tour = null;
    this.cursor?.remove();
    document.removeEventListener('keydown', this.onKeydown, true);
  }
}
