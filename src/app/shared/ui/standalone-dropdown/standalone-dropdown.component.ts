import {
  Component, ElementRef, HostListener, type OnDestroy,
  computed, inject, input, model, output, signal,
} from '@angular/core';
import { IconComponent, type IconName } from '../icon/icon.component';
import { FlyoutMenuComponent } from '../flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../flyout-menu/flyout-menu-item.component';
import { type SingleOpenFlyout, claimFlyout, releaseFlyout } from '../flyout-menu/single-open-flyout';
import type { SelectOption } from '../select/select.component';

export type StandaloneDropdownTone = 'default' | 'accent';

/**
 * Déclencheur de menu en texte, sans champ ni bordure.
 *
 * Deux usages, selon qu'on lui passe des options ou non :
 *
 *  • sans `options`, il ne fait qu'émettre `clicked` et le consommateur ouvre ce
 *    qu'il veut (menu d'actions, panneau, modale) ;
 *  • avec `options`, il porte lui-même sa liste de choix unique et suit les mêmes
 *    règles que `ds-select` : un seul flyout ouvert à la fois dans le document,
 *    fermeture au clic extérieur et à Échap, et **aucune coche dans la liste**.
 *    La valeur retenue se lit dans le déclencheur, pas dans le menu : une coche
 *    décalerait les libellés à chaque changement de choix.
 */
@Component({
  selector: 'ds-standalone-dropdown',
  standalone: true,
  imports: [IconComponent, FlyoutMenuComponent, FlyoutMenuItemComponent],
  templateUrl: './standalone-dropdown.component.html',
  styleUrl: './standalone-dropdown.component.scss',
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '[attr.aria-haspopup]': 'options().length ? "listbox" : null',
    '[attr.aria-expanded]': 'options().length ? open() : null',
    'role': 'button',
    '(click)': 'onTrigger($event)',
    '(keydown.enter)': 'onTrigger()',
    '(keydown.space)': '$event.preventDefault(); onTrigger()',
  },
})
export class StandaloneDropdownComponent implements SingleOpenFlyout, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  icon     = input<IconName | null>(null);
  /** Libellé fixe. Laissé vide, le déclencheur affiche le libellé de l'option retenue. */
  label    = input<string>('');
  tone     = input<StandaloneDropdownTone>('accent');
  disabled = input<boolean>(false);

  /** Liste de choix unique. Vide, le composant reste un simple déclencheur. */
  options = input<SelectOption[]>([]);
  value   = model<string>('');

  clicked         = output<void>();
  selectionChange = output<string>();

  readonly open = signal(false);

  readonly selectedLabel = computed(() => {
    const v = this.value();
    return v ? this.options().find(o => o.value === v)?.label ?? '' : '';
  });

  /** Ce que porte le déclencheur : le libellé fixe s'il existe, sinon le choix retenu. */
  readonly triggerLabel = computed(() => this.label() || this.selectedLabel());

  readonly hostClasses = computed(() => [
    'ds-standalone-dropdown',
    `ds-standalone-dropdown--tone-${this.tone()}`,
    this.disabled() ? 'ds-standalone-dropdown--disabled' : '',
    this.open()     ? 'ds-standalone-dropdown--open'     : '',
  ].filter(Boolean).join(' '));

  onTrigger(event?: Event): void {
    if (this.disabled()) return;
    // Un clic venu de la liste elle-même n'est pas un clic sur le déclencheur :
    // sans ce test il rouvrirait aussitôt la liste que le choix vient de fermer.
    const target = event?.target as HTMLElement | null;
    if (target?.closest('.ds-standalone-dropdown__flyout')) return;
    this.clicked.emit();
    if (!this.options().length) return;
    if (this.open()) {
      this.closeFlyout();
      return;
    }
    claimFlyout(this);
    this.open.set(true);
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    this.value.set(option.value);
    this.selectionChange.emit(option.value);
    this.closeFlyout();
  }

  closeFlyout(): void {
    releaseFlyout(this);
    this.open.set(false);
  }

  ngOnDestroy(): void {
    releaseFlyout(this);
  }

  /** Le clic extérieur est traité par le registre, en phase de capture. */
  flyoutHost(): HTMLElement {
    return this.hostRef.nativeElement;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.closeFlyout();
  }
}
