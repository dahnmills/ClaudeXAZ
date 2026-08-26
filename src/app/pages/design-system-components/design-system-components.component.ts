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

@Component({
  selector: 'app-design-system-components',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './design-system-components.component.html',
  styleUrl: './design-system-components.component.scss',
})
export class DesignSystemComponentsComponent {
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);

  readonly query = signal('');

  private readonly allComponents = [...DS_COMPONENTS].sort((a, b) => a.name.localeCompare(b.name));

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
    return resolveStorybookHref(entry, { baseURI: this.document.baseURI, devMode: isDevMode() });
  }

  previewSrc(entry: DsComponentEntry): SafeResourceUrl | null {
    const src = storybookIframeSrc(entry, { baseURI: this.document.baseURI, devMode: isDevMode() });
    return src ? this.sanitizer.bypassSecurityTrustResourceUrl(src) : null;
  }
}
