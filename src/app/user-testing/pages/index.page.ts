import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-index-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="ut-index">
      <h1>User testing scenarios</h1>
      <p>Pick a scenario to open the prototype.</p>
      <ul>
        <li><a routerLink="/home">Home</a></li>
        <li><a routerLink="/accordion">With Accordion</a></li>
        <li><a routerLink="/modal">With Modal</a></li>
        <li><a routerLink="/search">Search</a></li>
      </ul>
    </main>
  `,
  styles: [`
    .ut-index {
      max-width: 640px;
      margin: 64px auto;
      padding: 0 24px;
      font-family: var(--semantic-font-family);
    }
    .ut-index h1 { font-size: 24px; margin: 0 0 8px; }
    .ut-index p { margin: 0 0 24px; color: var(--semantic-color-static-text-main-secondary); }
    .ut-index ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
    .ut-index a {
      display: block;
      padding: 16px 20px;
      border: 1px solid var(--semantic-color-static-border-subtle-tertiary);
      border-radius: 8px;
      color: var(--semantic-color-interactive-text-strong-default);
      text-decoration: none;
      font-weight: 600;
    }
    .ut-index a:hover { background: var(--semantic-color-static-background-main-secondary); }
  `],
})
export class IndexPage {}
