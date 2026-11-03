import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])',
  'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])', '[contenteditable="true"]',
].join(',');

/**
 * Boîte de dialogue modale (WAI-ARIA APG, Dialog) : le focus entre dans la
 * boîte à l'ouverture, Tab et Maj+Tab tournent à l'intérieur, et le focus
 * revient à l'élément qui l'avait à la fermeture.
 *
 * À poser sur la boîte rendue sous `@if (open())` : la création de la vue
 * vaut ouverture, sa destruction vaut fermeture.
 */
@Directive({
  selector: '[dsFocusTrap]',
  standalone: true,
  host: { 'tabindex': '-1' },
})
export class FocusTrapDirective implements AfterViewInit, OnDestroy {
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private returnTo: HTMLElement | null = null;

  ngAfterViewInit(): void {
    const active = document.activeElement;
    this.returnTo = active instanceof HTMLElement && active !== document.body ? active : null;
    // La boîte elle-même, pas son premier champ : le lecteur d'écran annonce
    // le titre du dialogue avant son contenu
    this.host.nativeElement.focus({ preventScroll: true });
  }

  ngOnDestroy(): void {
    const target = this.returnTo;
    // Après le démontage : l'élément d'origine peut redevenir atteignable
    // (modale suspendue qui revient) ou avoir disparu (slot remplacé)
    setTimeout(() => { if (target?.isConnected) target.focus({ preventScroll: true }); });
  }

  @HostListener('keydown', ['$event'])
  onKeydown(ev: KeyboardEvent): void {
    if (ev.key !== 'Tab') return;
    const box = this.host.nativeElement;
    const items = Array.from(box.querySelectorAll<HTMLElement>(FOCUSABLE))
      .filter(el => el.offsetParent !== null || el.getClientRects().length > 0);
    if (!items.length) { ev.preventDefault(); return; }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (ev.shiftKey && (active === first || active === box)) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && active === last) { ev.preventDefault(); first.focus(); }
  }
}
