import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SCREENS, versionLabel } from '../../user-testing/screens.data';
import { CATEGORY_LABELS, RELEASE_NOTES } from './release-notes.data';

@Component({
  selector: 'app-release-note-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './release-note-detail.component.html',
  styleUrl: './release-note-detail.component.scss',
})
export class ReleaseNoteDetailComponent {
  private route = inject(ActivatedRoute);

  readonly categoryLabels = CATEGORY_LABELS;
  readonly screens = SCREENS;
  readonly entry = RELEASE_NOTES.find((n) => n.id === this.route.snapshot.paramMap.get('id'));

  screenLabel(path: string): string {
    return this.screens.find((s) => s.path === path)?.label ?? path;
  }

  screenVersion(path: string): string {
    const s = this.screens.find((s) => s.path === path);
    return s ? versionLabel(s.version) : '';
  }
}
