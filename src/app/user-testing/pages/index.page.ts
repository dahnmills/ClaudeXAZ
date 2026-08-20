import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SCREENS, versionLabel } from '../screens.data';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './index.page.html',
  styleUrl: './index.page.scss',
})
export class IndexPage {
  readonly screens = SCREENS;
  readonly versionLabel = versionLabel;
}
