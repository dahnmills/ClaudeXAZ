import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, isDevMode, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import {
  DS_COMPONENTS,
  DsComponentEntry,
  storybookHref as resolveStorybookHref,
  storybookIframeSrc,
} from '../design-system-audit/design-system-audit.data';
import { LazyVisibleDirective } from './lazy-visible.directive';

@Component({
  selector: 'app-design-system-components',
  standalone: true,
  imports: [RouterLink, LazyVisibleDirective],
  templateUrl: './design-system-components.component.html',
  styleUrl: './design-system-components.component.scss',
})
export class DesignSystemComponentsComponent {
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);

  readonly query = signal('');

  // Only the previews the user has actually scrolled near get mounted —
  // all ~80 loading at once (each a full Storybook preview bundle) is
  // what made the local Storybook dev server hang/crash.
  private readonly revealed = signal<ReadonlySet<DsComponentEntry>>(new Set());

  reveal(entry: DsComponentEntry): void {
    if (this.revealed().has(entry)) return;
    this.revealed.update((set) => new Set(set).add(entry));
  }

  isRevealed(entry: DsComponentEntry): boolean {
    return this.revealed().has(entry);
  }

  private readonly allComponents = [...DS_COMPONENTS].sort((a, b) => a.name.localeCompare(b.name));

  // Computed once, not per change-detection cycle: bypassSecurityTrustResourceUrl
  // returns a fresh wrapper object every call, and Angular diffs [src] by
  // object identity — calling it straight from the template made the iframe
  // src "change" on every tick, so it kept reloading and never painted
  // (visible as a permanent grey/blank box in every card).
  private readonly hrefByEntry = new Map<DsComponentEntry, string | null>(
    this.allComponents.map((c) => [
      c,
      resolveStorybookHref(c, { baseURI: this.document.baseURI, devMode: isDevMode() }),
    ]),
  );
  private readonly previewByEntry = new Map<DsComponentEntry, SafeResourceUrl | null>(
    this.allComponents.map((c) => {
      const src = storybookIframeSrc(c, { baseURI: this.document.baseURI, devMode: isDevMode() });
      return [c, src ? this.sanitizer.bypassSecurityTrustResourceUrl(src) : null];
    }),
  );

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.allComponents;
    return this.allComponents.filter(
      (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.folder.toLowerCase().includes(q),
    );
  });

  setQuery(value: string): void {
    this.query.set(value);
  }

  storybookHref(entry: DsComponentEntry): string | null {
    return this.hrefByEntry.get(entry) ?? null;
  }

  previewSrc(entry: DsComponentEntry): SafeResourceUrl | null {
    return this.previewByEntry.get(entry) ?? null;
  }
}
