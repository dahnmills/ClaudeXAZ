import { Component, ElementRef, HostListener, computed, inject, input, model, signal } from '@angular/core';
import { ChipComponent } from '../../../shared/ui/chip/chip.component';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox.component';
import { LinkComponent } from '../../../shared/ui/link/link.component';
import { FlyoutMenuComponent } from '../../../shared/ui/flyout-menu/flyout-menu.component';

export interface FilterOption { value: string; label: string; }

/**
 * Filter chip — chip type="select" qui ouvre un flyout de checkboxes
 * pour une sélection multiple. Utilisé dans la barre de filtres (P4)
 * de la page TAG Configuration.
 */
@Component({
  selector: 'tag-filter-chip',
  standalone: true,
  imports: [ChipComponent, CheckboxComponent, LinkComponent, FlyoutMenuComponent],
  templateUrl: './tag-filter-chip.component.html',
  styleUrl: './tag-filter-chip.component.scss',
})
export class TagFilterChipComponent {
  label    = input.required<string>();
  options  = input.required<FilterOption[]>();
  selected = model<Set<string>>(new Set());

  open = signal(false);

  private elRef = inject(ElementRef);

  count     = computed(() => this.selected().size);
  active    = computed(() => this.count() > 0);
  chipLabel = computed(() => this.active() ? `${this.label()} · ${this.count()}` : this.label());

  toggleOpen(): void {
    this.open.update((o) => !o);
  }

  isChecked(value: string): boolean {
    return this.selected().has(value);
  }

  toggleValue(value: string): void {
    const next = new Set(this.selected());
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    this.selected.set(next);
  }

  clear(): void {
    this.selected.set(new Set());
  }

  @HostListener('document:click', ['$event'])
  onDocClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.elRef.nativeElement.contains(event.target as Node)) this.open.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.open.set(false);
  }
}
