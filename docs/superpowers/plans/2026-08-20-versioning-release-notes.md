# Versioning & Release Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every prototype screen a `major.minor.patch` version and add a filterable `/release-notes` page, fed by a canonical screen catalogue that also de-duplicates the two existing screen listings.

**Architecture:** One canonical data file (`screens.data.ts`) replaces the two hardcoded screen lists in `IndexPage` and `UserTestingHomePage`. A second data file (`release-notes.data.ts`) holds a hand-authored, git-versioned array of dated entries. A new standalone `ReleaseNotesComponent` reads both, filters client-side (category multi-toggle AND screen single-select), and is reachable from a 5th, always-visible Hub zone.

**Tech Stack:** Angular 19 standalone components, signals (`signal`/`computed`), `@if`/`@for`/`@switch` control flow, SCSS (meta-harness visual identity shared with Hub/`UserTestingHomePage` — hardcoded hex, not `_semantic.scss` product tokens, since these are harness pages, not product screens).

**Spec:** `docs/superpowers/specs/2026-08-20-versioning-release-notes-design.md`

## Global Constraints

- No backend: all data is static TS, git-versioned, hand-edited at push time (per spec §1, §6).
- No unit tests: static display + pure filter predicate, consistent with the rest of the prototype's meta-pages (spec §5). Verification = `ng build` + manual browser check.
- All 11 screens start at version `{ major: 1, minor: 0, patch: 0 }` (spec §1) — no historical backfill.
- Version bump rule: `feature` → bump `minor` (reset `patch` to 0); `fix`/`design`/`content` → bump `patch`; `major` is a manual judgment call, never automatic (spec §2).
- A `ReleaseNote.screens` array MAY be empty for meta/harness-level changes (e.g. tooling, listing pages) that don't map to one of the 11 tracked screens — such entries render with no screen tags, don't bump any version, and are excluded whenever a screen filter is active.
- Release Notes hub zone is NOT `adminOnly` — always visible, unlike Review/Résultats (spec §3).
- Meta/harness pages (`Hub`, `IndexPage`, `UserTestingHomePage`, `ReleaseNotesComponent`) share one visual language: `Inter` body, `'Bricolage Grotesque'` display, flat `#f6f5fa` background, `#2b6bff`-family blue as the default accent, white cards with `#e9e7f2` borders. Do not use `_semantic.scss` product tokens on these pages — this is deliberate, matching the existing `hub.page.scss`/`user-testing-home.page.scss`.

---

### Task 1: Canonical screen catalogue

**Files:**
- Create: `src/app/user-testing/screens.data.ts`

**Interfaces:**
- Produces: `interface ScreenVersion { major: number; minor: number; patch: number }`, `interface Screen { path: string; label: string; hint: string; version: ScreenVersion }`, `const SCREENS: Screen[]`, `function versionLabel(v: ScreenVersion): string`

- [ ] **Step 1: Create the catalogue file**

```ts
// src/app/user-testing/screens.data.ts
export interface ScreenVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface Screen {
  path: string;
  label: string;
  hint: string;
  version: ScreenVersion;
}

const V1: ScreenVersion = { major: 1, minor: 0, patch: 0 };

export const SCREENS: Screen[] = [
  { path: 'home', label: 'Home', hint: 'Accueil du produit', version: { ...V1 } },
  { path: 'accordion', label: 'With Accordion', hint: 'Variante accordéon', version: { ...V1 } },
  { path: 'modal', label: 'With Modal', hint: 'Variante modale', version: { ...V1 } },
  { path: 'filters', label: 'Filters', hint: 'Filtres de recherche', version: { ...V1 } },
  { path: 'search', label: 'Search', hint: 'Recherche d\'entreprises', version: { ...V1 } },
  { path: 'admin-data', label: 'Admin Data', hint: 'Édition des données admin', version: { ...V1 } },
  { path: 'tag-configuration', label: 'TAG Configuration', hint: 'Règles d\'auto-grading', version: { ...V1 } },
  { path: 'grade-story', label: 'Grade Story', hint: 'Récit de notation', version: { ...V1 } },
  { path: 'spotlight', label: 'Spotlight', hint: 'Mise en avant', version: { ...V1 } },
  { path: 'notification-module', label: 'Notification Module', hint: 'Centre de notifications', version: { ...V1 } },
  { path: 'buyer-summary/137381425', label: 'Buyer Summary', hint: 'Dossier acheteur', version: { ...V1 } },
];

export function versionLabel(v: ScreenVersion): string {
  return `v${v.major}.${v.minor}.${v.patch}`;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx ng build --configuration development`
Expected: build succeeds (no new errors — pre-existing unused-import warnings on unrelated files are fine).

- [ ] **Step 3: Commit**

```bash
git add src/app/user-testing/screens.data.ts
git commit -m "feat(versioning): add canonical screen catalogue with versions"
```

---

### Task 2: `IndexPage` consumes the catalogue + shows version badges

**Files:**
- Modify: `src/app/user-testing/pages/index.page.ts`
- Modify: `src/app/user-testing/pages/index.page.html`
- Modify: `src/app/user-testing/pages/index.page.scss`

**Interfaces:**
- Consumes: `SCREENS: Screen[]`, `versionLabel(v: ScreenVersion): string` from Task 1 (`../screens.data`)
- Produces: `IndexPage.screens: Screen[]`, `IndexPage.versionLabel` (bound in template)

- [ ] **Step 1: Replace the local `SCREENS` array with the shared catalogue**

```ts
// src/app/user-testing/pages/index.page.ts
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
```

- [ ] **Step 2: Add the version badge to the card template**

```html
<!-- src/app/user-testing/pages/index.page.html -->
<main class="ix">
  <header class="ix__head">
    <span class="ix__eyebrow">Dev · Bac à sable</span>
    <h1 class="ix__title">Prototype Qirin</h1>
    <p class="ix__lead">
      Naviguez librement dans tous les écrans, avec l'inspecteur de handoff (Alt+I).
      Choisissez un écran à ouvrir.
    </p>
  </header>

  <ul class="ix__list">
    @for (s of screens; track s.path) {
      <li class="ix__item">
        <a class="ix__open" [routerLink]="s.path">
          <span class="ix__label-row">
            <span class="ix__label">{{ s.label }}</span>
            <span class="ix__version">{{ versionLabel(s.version) }}</span>
          </span>
          <span class="ix__hint">{{ s.hint }}</span>
          <code class="ix__url">/{{ s.path }}</code>
        </a>
      </li>
    }
  </ul>
</main>
```

- [ ] **Step 3: Update the grid areas and add the version pill style**

```scss
// src/app/user-testing/pages/index.page.scss
:host {
  display: block;
  min-height: 100vh;
  background: #f6f5fa;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.ix {
  max-width: 760px;
  margin: 0 auto;
  padding: 72px 24px 96px;

  &__head { margin-bottom: 36px; }
  &__eyebrow {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 100px;
    background: #e7eeff;
    color: #1a4fe0;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    margin-bottom: 14px;
  }
  &__title {
    margin: 0 0 10px;
    font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
    font-weight: 800;
    font-size: 38px;
    letter-spacing: -0.03em;
    color: #17151f;
  }
  &__lead {
    margin: 0;
    max-width: 62ch;
    color: #56526b;
    font-size: 15.5px;
    line-height: 1.55;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__item {
    display: flex;
    align-items: stretch;
    gap: 10px;
  }

  &__open {
    flex: 1 1 auto;
    min-width: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'label-row hint' 'url url';
    align-items: baseline;
    gap: 2px 12px;
    padding: 16px 20px;
    border: 1px solid #e9e7f2;
    border-radius: 14px;
    background: #ffffff;
    text-decoration: none;
    box-shadow: 0 1px 2px rgba(23, 21, 31, 0.04);
    transition: transform 0.14s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.14s, border-color 0.14s;

    &:hover {
      transform: translateY(-2px);
      border-color: #d7d3e8;
      box-shadow: 0 6px 18px rgba(23, 21, 31, 0.08);
    }
    &:focus-visible { outline: 2px solid #2b6bff; outline-offset: 2px; }
  }
  &__label-row { grid-area: label-row; display: flex; align-items: center; gap: 8px; }
  &__label { font-size: 15px; font-weight: 700; color: #17151f; }
  &__version {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 600;
    color: #1a4fe0;
    background: #e7eeff;
    padding: 2px 7px;
    border-radius: 100px;
  }
  &__hint { grid-area: hint; font-size: 13px; color: #8b8798; }
  &__url {
    grid-area: url;
    margin-top: 6px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    color: #56526b;
  }
}

@media (max-width: 560px) {
  .ix__item { flex-direction: column; }
}
```

- [ ] **Step 4: Verify it compiles**

Run: `npx ng build --configuration development`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/user-testing/pages/index.page.ts src/app/user-testing/pages/index.page.html src/app/user-testing/pages/index.page.scss
git commit -m "feat(versioning): wire IndexPage to shared screen catalogue + version badge"
```

---

### Task 3: `UserTestingHomePage` consumes the catalogue + shows version badges

**Files:**
- Modify: `src/app/user-testing/isolated/user-testing-home.page.ts`
- Modify: `src/app/user-testing/isolated/user-testing-home.page.html`
- Modify: `src/app/user-testing/isolated/user-testing-home.page.scss`

**Interfaces:**
- Consumes: `SCREENS: Screen[]`, `versionLabel(v: ScreenVersion): string` from Task 1 (`../screens.data`)
- Produces: `UserTestingHomePage.universes: Screen[]` (curated subset), `UserTestingHomePage.versionLabel`

- [ ] **Step 1: Replace the local `UNIVERSES` array with a curated path list resolved against the catalogue**

```ts
// src/app/user-testing/isolated/user-testing-home.page.ts
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SCREENS, Screen, versionLabel } from '../screens.data';

// Not every screen is Useberry-eligible — this curated order is intentional.
const CURATED_PATHS = [
  'search',
  'admin-data',
  'buyer-summary/137381425',
  'tag-configuration',
  'home',
  'filters',
  'accordion',
  'modal',
];

/**
 * Accueil privé des univers isolés (Useberry). Réservé à l'auteur : liste
 * chaque écran cloisonné avec son URL complète, prête à coller dans un test.
 * Chaque univers est mono-écran et verrouillé (voir lockIsolatedGuard).
 */
@Component({
  selector: 'app-ut-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-testing-home.page.html',
  styleUrl: './user-testing-home.page.scss',
})
export class UserTestingHomePage {
  readonly universes: Screen[] = CURATED_PATHS.map(
    (path) => SCREENS.find((s) => s.path === path)!,
  );
  readonly versionLabel = versionLabel;
  copied = signal<string | null>(null);

  /** URL absolue avec hash, prête à coller dans Useberry. */
  fullUrl(path: string): string {
    return `${location.origin}/#/user-testing/${path}`;
  }

  copyLabel(label: string): string {
    return `Copier l'URL de ${label}`;
  }

  copy(path: string): void {
    navigator.clipboard?.writeText(this.fullUrl(path)).then(
      () => {
        this.copied.set(path);
        setTimeout(() => this.copied.set(null), 1600);
      },
      () => {},
    );
  }
}
```

- [ ] **Step 2: Add the version badge to the card template**

```html
<!-- src/app/user-testing/isolated/user-testing-home.page.html -->
<main class="uth">
  <header class="uth__head">
    <span class="uth__eyebrow">Espace de test · privé</span>
    <h1 class="uth__title">Univers isolés</h1>
    <p class="uth__lead">
      Chaque écran est cloisonné pour Useberry : pas d'inspecteur, pas de widget de
      feedback, et aucune navigation vers un autre écran. Copiez l'URL d'un univers
      et collez-la dans votre test.
    </p>
  </header>

  <ul class="uth__list">
    @for (u of universes; track u.path) {
      <li class="uth__item">
        <a class="uth__open" [routerLink]="u.path">
          <span class="uth__label-row">
            <span class="uth__label">{{ u.label }}</span>
            <span class="uth__version">{{ versionLabel(u.version) }}</span>
          </span>
          <span class="uth__hint">{{ u.hint }}</span>
          <code class="uth__url">/user-testing/{{ u.path }}</code>
        </a>
        <button class="uth__copy" type="button" (click)="copy(u.path)" [attr.aria-label]="copyLabel(u.label)">
          @if (copied() === u.path) {
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Copié
          } @else {
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Copier l'URL
          }
        </button>
      </li>
    }
  </ul>
</main>
```

- [ ] **Step 3: Update the grid areas and add the version pill style**

Apply the same `&__label-row`/`&__version` change as Task 2 Step 3, inside the existing `.uth` block — replace:

```scss
  &__open {
    flex: 1 1 auto;
    min-width: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'label hint' 'url url';
```

with:

```scss
  &__open {
    flex: 1 1 auto;
    min-width: 0;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'label-row hint' 'url url';
```

and replace:

```scss
  &__label { grid-area: label; font-size: 15px; font-weight: 700; color: #17151f; }
```

with:

```scss
  &__label-row { grid-area: label-row; display: flex; align-items: center; gap: 8px; }
  &__label { font-size: 15px; font-weight: 700; color: #17151f; }
  &__version {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 600;
    color: #1a4fe0;
    background: #e7eeff;
    padding: 2px 7px;
    border-radius: 100px;
  }
```

Rest of the file (`&__hint`, `&__url`, `&__copy`, media query) is unchanged.

- [ ] **Step 4: Verify it compiles**

Run: `npx ng build --configuration development`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/user-testing/isolated/user-testing-home.page.ts src/app/user-testing/isolated/user-testing-home.page.html src/app/user-testing/isolated/user-testing-home.page.scss
git commit -m "feat(versioning): wire UserTestingHomePage to shared screen catalogue + version badge"
```

---

### Task 4: Release notes data

**Files:**
- Create: `src/app/pages/release-notes/release-notes.data.ts`

**Interfaces:**
- Produces: `type ReleaseCategory = 'feature' | 'fix' | 'design' | 'content'`, `interface ReleaseNote { date: string; category: ReleaseCategory; screens: string[]; title: string; description: string }`, `const CATEGORY_LABELS: Record<ReleaseCategory, string>`, `const RELEASE_NOTES: ReleaseNote[]`

- [ ] **Step 1: Create the data file, seeded with the two entries this plan itself produces**

```ts
// src/app/pages/release-notes/release-notes.data.ts
export type ReleaseCategory = 'feature' | 'fix' | 'design' | 'content';

export interface ReleaseNote {
  date: string; // 'YYYY-MM-DD'
  category: ReleaseCategory;
  screens: string[]; // paths into SCREENS; empty array = meta/harness change
  title: string;
  description: string;
}

export const CATEGORY_LABELS: Record<ReleaseCategory, string> = {
  feature: 'Feature',
  fix: 'Fix',
  design: 'Design',
  content: 'Content',
};

// Newest first. Prepend a new entry here at every push that changes a screen.
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    date: '2026-08-20',
    category: 'feature',
    screens: [],
    title: 'Versioning par écran et notes de version',
    description:
      'Chaque écran a désormais un numéro de version (major.minor.patch). Une nouvelle page Notes de version recense les évolutions, filtrable par catégorie et par écran.',
  },
  {
    date: '2026-08-20',
    category: 'design',
    screens: [],
    title: 'Harmonisation des listings prototype et univers isolés',
    description:
      'Le listing de /prototype reprend le même langage visuel (cards, typographie, structure) que celui des univers isolés Useberry.',
  },
];
```

- [ ] **Step 2: Verify it compiles**

Run: `npx ng build --configuration development`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/release-notes/release-notes.data.ts
git commit -m "feat(versioning): add release notes data"
```

---

### Task 5: `ReleaseNotesComponent`

**Files:**
- Create: `src/app/pages/release-notes/release-notes.component.ts`
- Create: `src/app/pages/release-notes/release-notes.component.html`
- Create: `src/app/pages/release-notes/release-notes.component.scss`

**Interfaces:**
- Consumes: `SCREENS`, `versionLabel` from `../../user-testing/screens.data` (Task 1); `RELEASE_NOTES`, `ReleaseCategory`, `CATEGORY_LABELS` from `./release-notes.data` (Task 4)
- Produces: `ReleaseNotesComponent` (standalone, selector `app-release-notes`)

- [ ] **Step 1: Write the component class**

```ts
// src/app/pages/release-notes/release-notes.component.ts
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
```

- [ ] **Step 2: Write the template**

```html
<!-- src/app/pages/release-notes/release-notes.component.html -->
<main class="rn">
  <header class="rn__head">
    <span class="rn__eyebrow">Changelog</span>
    <h1 class="rn__title">Notes de version</h1>
    <p class="rn__lead">Historique des évolutions du prototype, écran par écran.</p>
  </header>

  <div class="rn__filters">
    <div class="rn__pills">
      @for (cat of categories; track cat) {
        <button
          type="button"
          class="rn__pill"
          [class.rn__pill--active]="isActive(cat)"
          (click)="toggleCategory(cat)"
        >
          {{ categoryLabels[cat] }}
        </button>
      }
    </div>

    <select class="rn__select" [value]="selectedScreen()" (change)="onScreenChange($any($event.target).value)">
      <option value="">Tous les écrans</option>
      @for (s of screens; track s.path) {
        <option [value]="s.path">{{ s.label }}</option>
      }
    </select>

    @if (hasActiveFilter()) {
      <button type="button" class="rn__reset" (click)="resetFilters()">Réinitialiser</button>
    }
  </div>

  @if (entries().length === 0) {
    <p class="rn__empty">Aucune note pour ces filtres.</p>
  } @else {
    <ul class="rn__list">
      @for (entry of entries(); track entry.date + entry.title) {
        <li class="rn__entry">
          <div class="rn__entry-head">
            <span class="rn__date">{{ entry.date }}</span>
            <span class="rn__badge rn__badge--{{ entry.category }}">{{ categoryLabels[entry.category] }}</span>
          </div>
          <h2 class="rn__entry-title">{{ entry.title }}</h2>
          <p class="rn__entry-desc">{{ entry.description }}</p>
          @if (entry.screens.length > 0) {
            <div class="rn__tags">
              @for (path of entry.screens; track path) {
                <span class="rn__tag">{{ screenLabel(path) }} · {{ screenVersion(path) }}</span>
              }
            </div>
          }
        </li>
      }
    </ul>
  }
</main>
```

- [ ] **Step 3: Write the styles**

```scss
// src/app/pages/release-notes/release-notes.component.scss
:host {
  display: block;
  min-height: 100vh;
  background: #f6f5fa;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.rn {
  max-width: 760px;
  margin: 0 auto;
  padding: 72px 24px 96px;

  &__head { margin-bottom: 28px; }
  &__eyebrow {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 100px;
    background: #e7eeff;
    color: #1a4fe0;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    margin-bottom: 14px;
  }
  &__title {
    margin: 0 0 10px;
    font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
    font-weight: 800;
    font-size: 38px;
    letter-spacing: -0.03em;
    color: #17151f;
  }
  &__lead {
    margin: 0;
    max-width: 62ch;
    color: #56526b;
    font-size: 15.5px;
    line-height: 1.55;
  }

  &__filters {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 28px 0 32px;
  }
  &__pills { display: flex; flex-wrap: wrap; gap: 8px; }
  &__pill {
    padding: 7px 14px;
    border-radius: 100px;
    border: 1px solid #e9e7f2;
    background: #ffffff;
    color: #56526b;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.14s, border-color 0.14s, color 0.14s;

    &:hover { border-color: #d7d3e8; }
    &:focus-visible { outline: 2px solid #2b6bff; outline-offset: 2px; }
    &--active {
      background: #2b6bff;
      border-color: #2b6bff;
      color: #ffffff;
    }
  }
  &__select {
    padding: 7px 12px;
    border-radius: 100px;
    border: 1px solid #e9e7f2;
    background: #ffffff;
    color: #17151f;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;

    &:focus-visible { outline: 2px solid #2b6bff; outline-offset: 2px; }
  }
  &__reset {
    padding: 7px 4px;
    border: none;
    background: none;
    color: #1a4fe0;
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }

  &__empty { color: #8b8798; font-size: 14px; }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  &__entry {
    padding: 18px 20px;
    border: 1px solid #e9e7f2;
    border-radius: 14px;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(23, 21, 31, 0.04);
  }
  &__entry-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  &__date {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 12px;
    color: #8b8798;
  }
  &__badge {
    padding: 2px 9px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;

    &--feature { background: #e7eeff; color: #1a4fe0; }
    &--fix { background: #fde8e6; color: #c23b2e; }
    &--design { background: #efeaff; color: #6a4be0; }
    &--content { background: #e4f6ee; color: #0f9e6e; }
  }
  &__entry-title {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 700;
    color: #17151f;
  }
  &__entry-desc {
    margin: 0;
    font-size: 14px;
    line-height: 1.55;
    color: #56526b;
  }
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
  }
  &__tag {
    padding: 3px 9px;
    border-radius: 100px;
    background: #f6f5fa;
    color: #56526b;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
  }
}

@media (max-width: 560px) {
  .rn__filters { flex-direction: column; align-items: flex-start; }
}
```

- [ ] **Step 4: Verify it compiles**

Run: `npx ng build --configuration development`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/release-notes/release-notes.component.ts src/app/pages/release-notes/release-notes.component.html src/app/pages/release-notes/release-notes.component.scss
git commit -m "feat(versioning): add ReleaseNotesComponent with category + screen filters"
```

---

### Task 6: Route `/release-notes`

**Files:**
- Modify: `src/app/app.routes.ts`

**Interfaces:**
- Consumes: `ReleaseNotesComponent` from Task 5 (`./pages/release-notes/release-notes.component`)

- [ ] **Step 1: Import and register the route**

Add the import near the other page imports:

```ts
import { ReleaseNotesComponent } from './pages/release-notes/release-notes.component';
```

Add the route next to `results`, top-level, no shell:

```ts
  // ── Notes de version ────────────────────────────────────────────────────
  { path: 'release-notes', component: ReleaseNotesComponent },
```

Resulting section of `src/app/app.routes.ts` (for context — insert immediately after the `results` route):

```ts
  // ── Récupération du brut (dashboard Echo) ───────────────────────────────
  { path: 'results', component: ResultsComponent },

  // ── Notes de version ────────────────────────────────────────────────────
  { path: 'release-notes', component: ReleaseNotesComponent },
```

- [ ] **Step 2: Verify it compiles**

Run: `npx ng build --configuration development`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/app.routes.ts
git commit -m "feat(versioning): register /release-notes route"
```

---

### Task 7: 5th Hub zone (always visible)

**Files:**
- Modify: `src/app/pages/hub/hub.page.ts`
- Modify: `src/app/pages/hub/hub.page.html`
- Modify: `src/app/pages/hub/hub.page.scss`

**Interfaces:**
- Consumes: route `/release-notes` from Task 6

- [ ] **Step 1: Add the zone entry and extend the `Zone` type**

```ts
// src/app/pages/hub/hub.page.ts
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubAdminService } from './hub-admin.service';

interface Zone {
  path: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  accent: 'blue' | 'violet' | 'green' | 'ink' | 'amber';
  icon: 'proto' | 'review' | 'isolated' | 'results' | 'notes';
  adminOnly?: boolean;
}

const ALL_ZONES: Zone[] = [
  {
    path: '/prototype', eyebrow: 'Dev', title: 'Prototype', accent: 'ink', icon: 'proto',
    desc: 'Naviguez librement dans tous les écrans, avec l\'inspecteur de handoff (Alt+I). Votre bac à sable de développement.',
    cta: 'Ouvrir les écrans',
  },
  {
    path: '/review', eyebrow: 'Testeurs', title: 'Espace de review', accent: 'blue', icon: 'review',
    desc: 'Les mêmes écrans, avec le widget Echo activé : les testeurs laissent réactions, notes et commentaires en continu.',
    cta: 'Entrer en review',
    adminOnly: true,
  },
  {
    path: '/user-testing', eyebrow: 'Useberry', title: 'Univers isolés', accent: 'violet', icon: 'isolated',
    desc: 'Chaque écran cloisonné, sans inspecteur ni feedback, verrouillé sur lui-même. Prêt à coller dans un test Useberry.',
    cta: 'Voir les univers',
  },
  {
    path: '/results', eyebrow: 'Analyse', title: 'Résultats Echo', accent: 'green', icon: 'results',
    desc: 'Le tableau de bord des retours : sentiment de la salle, verbatims, captures, filtres et export du brut.',
    cta: 'Ouvrir le dashboard',
    adminOnly: true,
  },
  {
    path: '/release-notes', eyebrow: 'Changelog', title: 'Notes de version', accent: 'amber', icon: 'notes',
    desc: 'Historique des évolutions par écran : features, fixes, ajustements de design et de contenu, filtrables.',
    cta: 'Voir les notes',
  },
];

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hub.page.html',
  styleUrl: './hub.page.scss',
})
export class HubPage {
  private admin = inject(HubAdminService);
  zones = computed(() =>
    this.admin.isAdmin() ? ALL_ZONES : ALL_ZONES.filter(z => !z.adminOnly)
  );
}
```

- [ ] **Step 2: Add the `notes` icon case**

In `src/app/pages/hub/hub.page.html`, inside the existing `@switch (z.icon)` block, add a case after `results`:

```html
            @case ('notes') { <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M4 4h16v16l-3-2-3 2-3-2-3 2-3-2-1 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> }
```

- [ ] **Step 3: Add the `amber` accent variant**

In `src/app/pages/hub/hub.page.scss`, inside the `.zone` block, add after `&--ink`:

```scss
  &--amber  { --accent: #d97706; --accent-wash: #fef3e2; }
```

- [ ] **Step 4: Verify it compiles**

Run: `npx ng build --configuration development`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/app/pages/hub/hub.page.ts src/app/pages/hub/hub.page.html src/app/pages/hub/hub.page.scss
git commit -m "feat(versioning): add always-visible Release Notes zone to Hub"
```

---

### Task 8: Manual verification pass

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npx ng serve --port 4300`

- [ ] **Step 2: Check the Hub**

Open `http://localhost:4300/#/`. Expected: 5 zones visible without admin mode (Prototype, Univers isolés, Notes de version — Review and Résultats stay hidden until admin unlock, unchanged from before). The amber "Notes de version" card opens `/release-notes`.

- [ ] **Step 3: Check the two screen listings**

Open `http://localhost:4300/#/prototype` and `http://localhost:4300/#/user-testing`. Expected: both show the same card style, each card has a `v1.0.0` badge next to its label. `/user-testing` still shows its 8 curated screens (not all 11) and keeps its "Copier l'URL" button; `/prototype` shows all 11 screens with no copy button.

- [ ] **Step 4: Check the Release Notes page**

Open `http://localhost:4300/#/release-notes`. Expected: 2 seeded entries, newest-first (both `2026-08-20`, order stable). Toggle the "Feature" pill: only the versioning entry shows. Toggle "Design" too: both show again (OR within category). Pick a screen from the select: since both seeded entries have `screens: []`, the list becomes empty and shows "Aucune note pour ces filtres." Click "Réinitialiser": both entries return.

- [ ] **Step 5: Check responsive layout**

Resize the viewport to ≤560px on `/prototype`, `/user-testing`, and `/release-notes`. Expected: cards stack, filter row on `/release-notes` wraps to a column, nothing overflows horizontally.

No commit for this task — it's verification only. If any check fails, fix the relevant task's files and re-run `npx ng build --configuration development` before re-checking.
