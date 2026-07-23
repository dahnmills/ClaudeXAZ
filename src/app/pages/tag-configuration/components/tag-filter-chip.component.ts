import { Component, ElementRef, HostListener, computed, inject, input, model, signal } from '@angular/core';
import { ChipComponent } from '../../../shared/ui/chip/chip.component';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { FlyoutMenuComponent } from '../../../shared/ui/flyout-menu/flyout-menu.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

export interface FilterOption { value: string; label: string; }

/**
 * Filter chip — opens a flyout of checkboxes for multi-select.
 * `variant="chip"` (default): ds-chip trigger, used in the P4 filter bar.
 * `variant="field"`: ds-select-styled bordered box + label, used as a
 * multi-value form field inside the rule modal (matches ds-select chrome
 * so it sits naturally in a grid of single-select dropdowns).
 */
@Component({
  selector: 'tag-filter-chip',
  standalone: true,
  imports: [ChipComponent, CheckboxComponent, ButtonComponent, FlyoutMenuComponent, IconComponent],
  templateUrl: './tag-filter-chip.component.html',
  styleUrl: './tag-filter-chip.component.scss',
})
export class TagFilterChipComponent {
  label       = input.required<string>();
  options     = input.required<FilterOption[]>();
  selected    = model<Set<string>>(new Set());
  variant     = input<'chip' | 'field'>('chip');
  placeholder = input<string>('Any');

  open = signal(false);

  private elRef = inject(ElementRef);

  private static nextId = 0;
  fieldId = `tag-filter-chip-${TagFilterChipComponent.nextId++}`;

  count     = computed(() => this.selected().size);
  active    = computed(() => this.count() > 0);
  chipLabel = computed(() => this.active() ? `${this.label()} · ${this.count()}` : this.label());
  fieldValue = computed(() => {
    const opts = this.options();
    const sel = this.selected();
    const labels = opts.filter(o => sel.has(o.value)).map(o => o.label);
    return labels.length ? labels.join(', ') : '';
  });

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
