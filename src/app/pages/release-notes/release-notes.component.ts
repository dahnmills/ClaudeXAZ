import { Component, computed, signal } from '@angular/core';
import { SCREENS, versionLabel } from '../../user-testing/screens.data';
import { CATEGORY_LABELS, ReleaseCategory, RELEASE_NOTES } from './release-notes.data';

@Component({
  selector: 'app-release-notes',
  standalone: true,
  imports: [],
  templateUrl: './release-notes.component.html',
  styleUrl: './release-notes.component.scss',
})
export class ReleaseNotesComponent {
  readonly categories: ReleaseCategory[] = ['feature', 'fix', 'design', 'content'];
  readonly categoryLabels = CATEGORY_LABELS;
  readonly screens = SCREENS;

  activeCategories = signal<Set<ReleaseCategory>>(new Set());
  selectedScreen = signal<string>('');

  entries = computed(() => {
    const cats = this.activeCategories();
    const screen = this.selectedScreen();
    return [...RELEASE_NOTES]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .filter((n) => cats.size === 0 || cats.has(n.category))
      .filter((n) => !screen || n.screens.includes(screen));
  });

  hasActiveFilter = computed(() => this.activeCategories().size > 0 || this.selectedScreen() !== '');

  toggleCategory(cat: ReleaseCategory): void {
    const next = new Set(this.activeCategories());
    if (next.has(cat)) {
      next.delete(cat);
    } else {
      next.add(cat);
    }
    this.activeCategories.set(next);
  }

  isActive(cat: ReleaseCategory): boolean {
    return this.activeCategories().has(cat);
  }

  onScreenChange(path: string): void {
    this.selectedScreen.set(path);
  }

  resetFilters(): void {
    this.activeCategories.set(new Set());
    this.selectedScreen.set('');
  }

  screenLabel(path: string): string {
    return this.screens.find((s) => s.path === path)?.label ?? path;
  }

  screenVersion(path: string): string {
    const s = this.screens.find((s) => s.path === path);
    return s ? versionLabel(s.version) : '';
  }
}
