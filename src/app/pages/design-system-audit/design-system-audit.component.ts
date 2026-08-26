import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, isDevMode, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ComponentStatus,
  DS_COMPONENTS,
  DsComponentEntry,
  MUTUALIZATION_TARGETS,
  storybookSlug,
} from './design-system-audit.data';

type StatusFilter = 'all' | ComponentStatus;

const STATUS_LABELS: Record<ComponentStatus, string> = {
  core: 'Core',
  niche: 'Usage ponctuel',
  orphan: 'Orphelin',
  duplicate: 'Doublon',
  internal: 'Interne',
};

@Component({
  selector: 'app-design-system-audit',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './design-system-audit.component.html',
  styleUrl: './design-system-audit.component.scss',
})
export class DesignSystemAuditComponent {
  private readonly document = inject(DOCUMENT);

  readonly statusLabels = STATUS_LABELS;
  readonly statusOptions: ComponentStatus[] = ['core', 'niche', 'orphan', 'duplicate', 'internal'];
  readonly mutualizationTargets = MUTUALIZATION_TARGETS;

  readonly statusFilter = signal<StatusFilter>('all');
  readonly query = signal('');

  private readonly allComponents = DS_COMPONENTS;

  readonly stats = computed(() => {
    const total = this.allComponents.length;
    const storied = this.allComponents.filter((c) => c.storybookTitle !== null).length;
    const adopted = this.allComponents.filter(
      (c) => (c.usageCount ?? 0) > 0 || (c.usagePages?.length ?? 0) > 0,
    ).length;
    const orphans = this.allComponents.filter((c) => c.status === 'orphan').length;
    const duplicates = this.allComponents.filter((c) => c.status === 'duplicate').length;
    const noStory = total - storied;
    return {
      total,
      storied,
      storiedPct: Math.round((storied / total) * 100),
      adopted,
      adoptedPct: Math.round((adopted / total) * 100),
      orphans,
      duplicates,
      noStory,
    };
  });

  readonly filtered = computed(() => {
    const status = this.statusFilter();
    const q = this.query().trim().toLowerCase();
    return this.allComponents
      .filter((c) => status === 'all' || c.status === status)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.folder.toLowerCase().includes(q))
      .sort((a, b) => (b.usageCount ?? -1) - (a.usageCount ?? -1));
  });

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter.set(status);
  }

  setQuery(value: string): void {
    this.query.set(value);
  }

  usageLabel(entry: DsComponentEntry): string {
    if (entry.usagePages?.length) return entry.usagePages.join(', ');
    if (entry.usageCount !== null) return `${entry.usageCount} usage${entry.usageCount === 1 ? '' : 's'}`;
    return 'Non détaillé';
  }

  storybookHref(entry: DsComponentEntry): string | null {
    if (!entry.storybookTitle) return null;
    const slug = storybookSlug(entry.storybookTitle);
    const page = entry.hasAutodocs ? `/docs/${slug}--docs` : `/story/${slug}--default`;
    // Dev: `npm run storybook` serves on its own port (6006), separate from
    // `ng serve` (4200) — there is no /storybook path locally. Prod: the
    // GitHub Pages build nests the static Storybook output under /storybook
    // inside this very app, so it must be reached relative to <base href>.
    const base = isDevMode() ? 'http://localhost:6006/' : `${this.document.baseURI}storybook/`;
    return `${base}?path=${page}`;
  }
}
