import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SCREENS, versionLabel, type Screen } from '../screens.data';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './index.page.html',
  styleUrl: './index.page.scss',
})
export class IndexPage {
  /** Écrans sans catégorie d'abord, en liste, puis un groupe titré par catégorie. */
  readonly screens = SCREENS.filter(s => !s.category);
  readonly categories: { name: string; screens: Screen[] }[] = [...new Set(SCREENS.flatMap(s => s.category ? [s.category] : []))]
    .map(name => ({ name, screens: SCREENS.filter(s => s.category === name) }));
  readonly versionLabel = versionLabel;
}
