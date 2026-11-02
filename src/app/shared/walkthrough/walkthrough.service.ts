import { Injectable, inject } from '@angular/core';
import { driver, type Driver, type DriveStep } from 'driver.js';
import { ToasterService } from '../ui/toaster/toaster.service';
import type { Walkthrough } from './walkthrough.model';

/** Délai laissé à l'étape suivante pour apparaître (drawer, chargement du board). */
const WAIT_FOR_NEXT_MS = 6000;
/** Au-delà, l'élément visé a disparu pour de bon (drawer fermé, Cancel) : on s'arrête. */
const LOST_AFTER_MS = 6500;
const WATCH_EVERY_MS = 250;
/** Un panneau qui glisse (ds-drawer : 320 ms) déplace l'élément après sa mise en
 *  avant : on recale la bulle une fois le mouvement fini. */
const SETTLE_MS = 400;

/**
 * Joue un parcours guidé avec driver.js. L'utilisateur fait chaque geste : une
 * étape « click » n'a pas de bouton Next, elle avance quand il clique l'élément
 * mis en avant. S'il sort du parcours (ferme le drawer, annule), l'élément visé
 * disparaît et le parcours s'arrête au lieu de pointer dans le vide.
 */
@Injectable({ providedIn: 'root' })
export class WalkthroughService {
  private toaster = inject(ToasterService);
  private active: Driver | null = null;
  private watch: ReturnType<typeof setInterval> | null = null;

  start(w: Walkthrough): void {
    this.stop();
    const steps: DriveStep[] = w.steps.map(s => ({
      element: s.element,
      advanceOnClick: s.advance === 'click',
      waitForElement: WAIT_FOR_NEXT_MS,
      popover: {
        title: s.title,
        description: s.description,
        side: s.side,
        align: 'start',
        showButtons: s.advance === 'click' ? ['close'] : ['next', 'close'],
      },
    }));

    this.active = driver({
      steps,
      showProgress: true,
      progressText: '{{current}} / {{total}}',
      doneBtnText: 'Done',
      closeBtnLabel: 'Quit the walkthrough',
      allowClose: true,
      // Les flèches feraient sauter une étape que l'utilisateur doit faire lui-même
      allowKeyboardControl: false,
      overlayClickBehavior: 'none',
      popoverClass: 'qirin-walkthrough',
      stagePadding: 4,
      stageRadius: 4,
      onHighlighted: () => setTimeout(() => this.active?.refresh(), SETTLE_MS),
      onDestroyed: () => this.cleanup(),
    });
    this.active.drive();
    this.watchTarget(w);
    document.addEventListener('keydown', this.onKeydown, true);
  }

  stop(): void {
    this.active?.destroy();
    this.cleanup();
  }

  private onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.active) this.stop();
  };

  /** Arrête le parcours si l'élément de l'étape en cours reste introuvable. */
  private watchTarget(w: Walkthrough): void {
    let missingSince: number | null = null;
    this.watch = setInterval(() => {
      const i = this.active?.getActiveIndex();
      if (i === undefined) return;
      const present = !!document.querySelector(w.steps[i].element);
      if (present) { missingSince = null; return; }
      missingSince ??= Date.now();
      if (Date.now() - missingSince > LOST_AFTER_MS) {
        this.stop();
        this.toaster.show('Start it again from the Help menu whenever you like.', { tone: 'info', title: 'Walkthrough stopped' });
      }
    }, WATCH_EVERY_MS);
  }

  private cleanup(): void {
    if (this.watch) clearInterval(this.watch);
    this.watch = null;
    this.active = null;
    document.removeEventListener('keydown', this.onKeydown, true);
  }
}
