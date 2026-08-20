# Versioning & Release Notes — Design Spec

**Date:** 2026-08-20
**Status:** Approved for planning
**Scope:** Per-screen semver versioning + a filterable Release Notes page for the Qirin prototype, plus the ongoing process to keep it up to date.

---

## 1. Context & decision

The prototype currently lists its screens in two places that have drifted apart: `IndexPage` (`/prototype`, `/review`) and `UserTestingHomePage` (`/user-testing`, curated subset). Both hardcode their own `{path, label, hint}` list — no shared source, no notion of version.

**Decision:** introduce a single canonical screen catalogue (`SCREENS`), give each screen a `major.minor.patch` version, and add a new **Release Notes** page that lists dated, categorized entries describing what changed on which screen(s). The Hub gets a 5th zone, always visible, linking to it.

This is a **process commitment, not just a UI feature**: every push that changes a screen gets a new release-note entry (date, category, affected screen(s), title, description) written by Claude, and bumps that screen's version accordingly, in the same commit as the change.

**Non-goals:** no backend (static TS data, git-versioned), no automatic changelog generation from commits, no historical backfill (all screens start at `1.0.0`), no auth/roles beyond the existing `adminOnly` hub gate (Release Notes zone is explicitly NOT gated).

---

## 2. Data model

New file `src/app/user-testing/screens.data.ts` (canonical catalogue, replaces the duplicated arrays in `IndexPage` and `UserTestingHomePage`):

```ts
export interface ScreenVersion {
  major: number;
  minor: number;
  patch: number;
}

export interface Screen {
  path: string;        // matches PROTO_PAGES route path
  label: string;
  hint: string;
  version: ScreenVersion;
}

export const SCREENS: Screen[] = [ /* 11 entries, all starting at { major: 1, minor: 0, patch: 0 } */ ];

export function versionLabel(v: ScreenVersion): string {
  return `v${v.major}.${v.minor}.${v.patch}`;
}
```

New file `src/app/pages/release-notes/release-notes.data.ts`:

```ts
export type ReleaseCategory = 'feature' | 'fix' | 'design' | 'content';

export interface ReleaseNote {
  date: string;            // 'YYYY-MM-DD'
  category: ReleaseCategory;
  screens: string[];       // paths into SCREENS, e.g. ['tag-configuration']
  title: string;
  description: string;
}

export const RELEASE_NOTES: ReleaseNote[] = [ /* newest first; new entry prepended each push */ ];
```

**Version bump rule** (applied by Claude when authoring an entry, not code-enforced):
- `feature` → bump `minor` (reset `patch` to 0) on each affected screen
- `fix` / `design` / `content` → bump `patch`
- `major` bumps are a manual judgment call for genuine rebuilds/refonte, not driven by category

---

## 3. Components & routing

```
pages/release-notes/
├── release-notes.component.ts        # standalone, reads RELEASE_NOTES + SCREENS
├── release-notes.component.html      # header + filters + entry list
├── release-notes.component.scss      # meta-harness visual identity (see §4)
└── release-notes.data.ts             # RELEASE_NOTES array
```

- Route: `{ path: 'release-notes', component: ReleaseNotesComponent }` in `app.routes.ts`, top-level (same tier as `results`, not nested under a shell).
- `screens.data.ts` moves to `src/app/user-testing/screens.data.ts`; `IndexPage` and `UserTestingHomePage` import `SCREENS` instead of their local hardcoded arrays. `UserTestingHomePage` keeps its own explicit curated subset of paths (not all 11 screens are Useberry-eligible), just resolves label/hint/version from `SCREENS` instead of redefining them.
- Both listing pages render a version badge (`versionLabel(s.version)`) on each card.
- Hub (`hub.page.ts`): add a 5th `Zone` entry, `path: '/release-notes'`, no `adminOnly` flag (always visible, unlike Review/Résultats), new accent variant (e.g. `amber`) and a new icon case (`icon: 'notes'`) in the template's `@switch`.

---

## 4. Release Notes page — UI

Same visual language as Hub/`UserTestingHomePage` (Bricolage Grotesque title, Inter body, white cards, `#2b6bff`-family accents, radial-gradient-free flat background) — this is a meta/harness page, not a product screen, so it does not use `_semantic.scss` product tokens.

- Header: eyebrow "Changelog", title "Notes de version", lead sentence.
- Filter row: 
  - Category: 4 toggle pills (Feature / Fix / Design / Content), multi-select, active state = filled accent.
  - Screen: a native `<select>` populated from `SCREENS`, single choice, "Tous les écrans" default.
  - "Réinitialiser" text link, visible only when a filter is active.
- Filtering is AND between the two axes, OR within category pills (matches if entry.category is any of the toggled-on pills, or all pills off = show all).
- List: entries sorted newest-first (data is already authored newest-first, no re-sort needed beyond a defensive `.sort()` by date desc), grouped visually by date if consecutive entries share a date (simple date heading, no complex grouping logic).
- Each entry card: date, category badge, one tag per affected screen showing `label` + `versionLabel`, title (bold), description (body text).
- Empty state (filter combination matches nothing): simple centered message "Aucune note pour ces filtres."

---

## 5. Testing & verification

No unit tests: this is static display + a pure filter predicate over an in-memory array, consistent with the rest of the prototype's meta-pages (Hub, `UserTestingHomePage` have none either). Verification = `ng build` (compile safety) + manual check in the running dev server across all filter combinations and both breakpoints (desktop / ≤560px, matching the existing responsive behavior of `uth`/`ix`).

---

## 6. Ongoing process (not code, but part of this spec)

At every push that changes a screen's behavior, visuals, or copy:
1. Add one entry to `RELEASE_NOTES` (top of the array) — date, category, affected screen path(s), a short title, a one/two-sentence description of what changed and why.
2. Bump the `version` of each affected `Screen` in `SCREENS` per the rule in §2.
3. Both happen in the same commit as the change they describe.
