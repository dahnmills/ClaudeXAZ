import { Component, signal } from '@angular/core';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { BreadcrumbsComponent } from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent } from '../../shared/ui/crumb/crumb.component';
import { PageTitleComponent } from '../../shared/ui/page-title/page-title.component';
import { GradeStoryRowComponent } from './components/grade-story-row.component';
import { TramScoreModalComponent } from './components/tram-score-modal.component';
import { TagExplanationModalComponent } from './components/tag-explanation-modal.component';
import { GRADE_STORY_ENTRIES } from './grade-story.data';
import { GradeStoryEntry } from './grade-story.models';

/**
 * Grade story page (BN AZTQIRIN-55735 prototype) — one autograde row per
 * entry, each with two independently clickable zones: the grade/score value
 * opens TRAM score details, the grade status opens the new TAG explanation
 * modal. Replaces the old "click anywhere on the row" behaviour.
 */
@Component({
  selector: 'app-grade-story',
  standalone: true,
  imports: [
    TopboxTestShellComponent, PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, PageTitleComponent,
    GradeStoryRowComponent, TramScoreModalComponent, TagExplanationModalComponent,
  ],
  templateUrl: './grade-story.component.html',
  styleUrl: './grade-story.component.scss',
})
export class GradeStoryComponent {
  entries = GRADE_STORY_ENTRIES;

  tramOpen = signal(false);
  tagOpen  = signal(false);
  selected = signal<GradeStoryEntry | null>(null);

  openTram(entry: GradeStoryEntry): void { this.selected.set(entry); this.tramOpen.set(true); }
  openTag(entry: GradeStoryEntry): void { this.selected.set(entry); this.tagOpen.set(true); }

  closeTram(): void { this.tramOpen.set(false); }
  closeTag(): void { this.tagOpen.set(false); }
}
