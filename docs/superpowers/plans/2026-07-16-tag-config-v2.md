# TAG Configuration v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the TAG (Task After Grading) Configuration screen from scratch, faithful to Figma v1 structure plus the 4 Business Need v2 priorities.

**Architecture:** One page (toolbar + filter chips bar + list of collapsible rule cards) composing DS atoms strictly. Three modals (rule create/edit, freshness thresholds, TRANS-NA-EXCL) and two page-local components (`rule-card`, `tag-filter-chip`). All state is in-memory mock, mutated by the modals; interactive-realistic. No tabs, no pipeline, no system rules, no history.

**Tech Stack:** Angular 19 (standalone, signals, `@if`/`@for`), SCSS with semantic CSS custom properties, existing `shared/ui` design-system atoms.

## Global Constraints

- Angular 19 standalone only, no NgModule. Signals for reactivity (`signal`/`computed`/`input`/`output`/`model`). Control-flow blocks `@if`/`@for`/`@switch` — never `*ngIf`/`*ngFor`.
- SCSS only. **No hardcoded colours/spacing/radii/sizes** — every value references a semantic CSS custom property. No `style=""` inline in templates.
- **Composition strictness:** no native `<button>/<a>/<input>/<textarea>/<select>/<svg>` inside these components — use `ds-button`, `ds-button-icon`, `ds-link`, `ds-input-text`, `ds-icon`, etc. No restyled pill/box; reuse `ds-badge`, `ds-chip`, `ds-card`.
- Selector prefix `ds-` for reusable atoms; TAG-specific page components live in `pages/tag-configuration/components/` and may use a `tag-` selector prefix.
- Convention: **`null` = "Any"** (criterion inactive) everywhere in the data model.
- No test runner exists in this repo. The verification cycle per task = `npm run build` (compiles + typechecks; must succeed with no errors) and, where visual, checking the rendered result via the running app (`npm start`, route `#/review/tag-configuration` or `#/prototype/tag-configuration`) and/or Storybook. There is NO unit-test framework — do not add one.
- Route path `tag-configuration` and class name `TagConfigurationComponent` must stay unchanged (existing `app.routes.ts` + index-page link depend on them).
- Semantic tokens to use: blue accent (Current valid grade) = existing interactive/info blue tokens; orange accent (Last checked autograde) = `--semantic-color-static-text-main-functional-warning`; muted "Any" text = subtle/tertiary text token.

---

## File Structure

```
pages/tag-configuration/
├── tag-configuration.component.ts/.html/.scss   # page shell: toolbar + chips + list + modal hosts
├── tag-configuration.models.ts                  # types (RuleCriteria, TagRule, FreshnessConfig, StatusReasonCode, enums, DECISION_BADGE)
├── tag-configuration.data.ts                    # mock: countries, rules (incl. ~67 for Northern Europe), freshness, codes, referentials, value option lists
└── components/
    ├── tag-filter-chip.component.ts/.html/.scss  # NEW multi-select filter chip
    ├── rule-card.component.ts/.html/.scss         # one collapsible rule card
    ├── rule-modal.component.ts/.html/.scss        # create/edit rule
    ├── freshness-modal.component.ts/.html/.scss   # freshness thresholds
    └── trans-excl-modal.component.ts/.html/.scss  # TRANS-NA-EXCL codes
```

Task order builds bottom-up: delete old → model → data → filter-chip → rule-card → page skeleton wiring cards+filters → the 3 modals → final integration polish.

---

### Task 1: Remove old implementation & scaffold empty page

**Files:**
- Delete: `src/app/pages/tag-configuration/` (all files)
- Create: `src/app/pages/tag-configuration/tag-configuration.component.ts`
- Create: `src/app/pages/tag-configuration/tag-configuration.component.html`
- Create: `src/app/pages/tag-configuration/tag-configuration.component.scss`

**Interfaces:**
- Produces: `TagConfigurationComponent` (standalone, selector `app-tag-configuration`) — imported by `app.routes.ts` at path `tag-configuration`.

- [ ] **Step 1: Delete the old folder**

```bash
rm -rf src/app/pages/tag-configuration
```

- [ ] **Step 2: Create the minimal standalone component**

`tag-configuration.component.ts`:

```ts
import { Component } from '@angular/core';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { PageHeaderComponent }      from '../../shared/ui/page-header/page-header.component';
import { BreadcrumbsComponent }     from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent }           from '../../shared/ui/crumb/crumb.component';
import { PageTitleComponent }       from '../../shared/ui/page-title/page-title.component';

@Component({
  selector: 'app-tag-configuration',
  standalone: true,
  imports: [
    TopboxTestShellComponent, PageHeaderComponent,
    BreadcrumbsComponent, CrumbComponent, PageTitleComponent,
  ],
  templateUrl: './tag-configuration.component.html',
  styleUrl: './tag-configuration.component.scss',
})
export class TagConfigurationComponent {}
```

`tag-configuration.component.html`:

```html
<app-topbox-test-shell>
  <ds-page-header>
    <ds-breadcrumbs>
      <ds-crumb label="Home" />
      <ds-crumb label="TAG Configuration" [current]="true" />
    </ds-breadcrumbs>
    <ds-page-title title="Task After Grading Configuration" />
  </ds-page-header>

  <div class="tag-config">
    <!-- toolbar, chips, list added in later tasks -->
  </div>
</app-topbox-test-shell>
```

> Note: verify the exact `ds-page-header` / `ds-breadcrumbs` / `ds-crumb` / `ds-page-title` input names against an existing page (e.g. `pages/admin-data/admin-data.component.html`) and match them; adjust the snippet if the real inputs differ.

`tag-configuration.component.scss`:

```scss
.tag-config {
  display: flex;
  flex-direction: column;
  gap: var(--semantic-measurement-spacing-m);
  padding: 0 var(--semantic-measurement-spacing-xl);
}
```

> Note: confirm `--semantic-measurement-spacing-xl` exists (32px lateral padding per pattern); if the scale differs, use the semantic token that resolves to 32px.

- [ ] **Step 3: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds, no errors referencing `tag-configuration`.

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/tag-configuration
git commit -m "refactor: reset TAG configuration to empty scaffold"
```

---

### Task 2: Data model (`tag-configuration.models.ts`)

**Files:**
- Create: `src/app/pages/tag-configuration/tag-configuration.models.ts`

**Interfaces:**
- Produces: types `Sensitivity`, `Grade`, `GradeType`, `Freshness`, `Comparison`, `Decision`, `RuleStatus`, `CountryCode`; interfaces `RuleCriteria`, `TagRule`, `FreshnessConfig`, `StatusReasonCode`, `Country`; const `DECISION_BADGE`, `EMPTY_CRITERIA`, `FILTER_KEYS`.

- [ ] **Step 1: Write the model file**

```ts
export type Sensitivity = 'S0' | 'S1' | 'S2' | 'S2+' | 'S3' | 'SN' | 'None';
export type Grade =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'
  | 'NA' | 'noGrade';
export type GradeType  = 'Automatic' | 'Manual';
export type Freshness  = 'Fresh' | 'Outdated' | 'Old';
export type Comparison = 'Upgrade' | 'Same' | 'Downgrade';
export type Decision   = 'Accept' | 'Refuse' | 'CreateTask';
export type RuleStatus = 'Valid' | 'NC';
export type CountryCode = 'FR' | 'DE' | 'NE' | 'PT';

/** null = "Any" (criterion inactive, ignored in matching). */
export interface RuleCriteria {
  sensitivity:  Sensitivity[] | null;
  exposure:     { op: '>' | '<='; amount: number } | null;
  newAutoGrade: Grade[] | null;

  cvgValue:     Grade[] | null;
  cvgType:      GradeType[] | null;
  cvgFreshness: Freshness | null;
  transferred:  boolean | null;
  newVsCvg:     Comparison | null;

  lastAgValue:     Grade[] | null;
  lastAgFreshness: Freshness | null;
  newVsLastAg:     Comparison | null;

  nace:        string[] | null;
  legalForm:   string[] | null;
  companyRole: string[] | null;
}

export interface TagRule {
  id: string;
  position: number;
  decision: Decision;
  status: RuleStatus;
  criteria: RuleCriteria;
}

export interface FreshnessConfig {
  lastCheckedAutograde: { freshUpToMonths: number; oldAfterMonths: number };
  validManualGrade:     { freshUpToMonths: number; oldAfterMonths: number };
}

export interface StatusReasonCode { code: string; label: string; }

export interface Country { code: CountryCode; name: string; currency: string; }

export const EMPTY_CRITERIA: RuleCriteria = {
  sensitivity: null, exposure: null, newAutoGrade: null,
  cvgValue: null, cvgType: null, cvgFreshness: null, transferred: null, newVsCvg: null,
  lastAgValue: null, lastAgFreshness: null, newVsLastAg: null,
  nace: null, legalForm: null, companyRole: null,
};

export type BadgeStatus  = 'info' | 'warning' | 'success' | 'error' | 'neutral';
export type BadgeVariant = 'light' | 'strong';

export const DECISION_BADGE: Record<Decision, { label: string; status: BadgeStatus; variant: BadgeVariant }> = {
  Accept:     { label: 'Accept',      status: 'success', variant: 'strong' },
  Refuse:     { label: 'Refuse',      status: 'error',   variant: 'strong' },
  CreateTask: { label: 'Create task', status: 'warning', variant: 'strong' },
};

/** P4 filter chip keys (the 5 filterable criteria). */
export const FILTER_KEYS = ['sensitivity', 'newAutoGrade', 'cvgType', 'cvgValue', 'cvgFreshness'] as const;
export type FilterKey = typeof FILTER_KEYS[number];
```

- [ ] **Step 2: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds (file is unused so far but must typecheck).

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/tag-configuration/tag-configuration.models.ts
git commit -m "feat: TAG v2 data model aligned to BN swagger"
```

---

### Task 3: Mock data & value option lists (`tag-configuration.data.ts`)

**Files:**
- Create: `src/app/pages/tag-configuration/tag-configuration.data.ts`

**Interfaces:**
- Consumes: all types from `tag-configuration.models.ts`.
- Produces:
  - `COUNTRIES: Country[]`
  - `rulesForCountry(code: CountryCode): TagRule[]`
  - `freshnessForCountry(code: CountryCode): FreshnessConfig`
  - `codesForCountry(code: CountryCode): StatusReasonCode[]`
  - `STATUS_REASON_REFERENTIAL: StatusReasonCode[]`
  - Option lists: `SENSITIVITY_OPTIONS`, `GRADE_OPTIONS`, `GRADE_TYPE_OPTIONS`, `FRESHNESS_OPTIONS`, `COMPARISON_OPTIONS`, `DECISION_OPTIONS`, `COMPANY_ROLE_OPTIONS`, `NACE_OPTIONS`, `LEGAL_FORM_OPTIONS`, `EXPOSURE_OP_OPTIONS`, `TRANSFERRED_OPTIONS` — each `{ value: string; label: string }[]`. Where the criterion allows "Any" as an explicit filter/select value, the option list includes `{ value: 'Any', label: 'Any' }` as the first entry.

- [ ] **Step 1: Write the data file**

Provide concrete option lists and mock generators. Example shape (fill all lists fully):

```ts
import {
  Country, CountryCode, TagRule, FreshnessConfig, StatusReasonCode,
  EMPTY_CRITERIA,
} from './tag-configuration.models';

export const COUNTRIES: Country[] = [
  { code: 'FR', name: 'France',          currency: 'EUR' },
  { code: 'DE', name: 'Germany',         currency: 'EUR' },
  { code: 'NE', name: 'Northern Europe', currency: 'EUR' },
  { code: 'PT', name: 'Portugal',        currency: 'EUR' },
];

export const SENSITIVITY_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'S0', label: 'S0' }, { value: 'S1', label: 'S1' },
  { value: 'S2', label: 'S2' }, { value: 'S2+', label: 'S2+' },
  { value: 'S3', label: 'S3' }, { value: 'SN', label: 'SN' },
  { value: 'None', label: 'None' },
];

export const GRADE_OPTIONS = [
  { value: 'Any', label: 'Any' },
  ...['01','02','03','04','05','06','07','08','09','10'].map(g => ({ value: g, label: g })),
  { value: 'NA', label: 'NA' }, { value: 'noGrade', label: '(no grade)' },
];

export const GRADE_TYPE_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Automatic', label: 'Automatic' }, { value: 'Manual', label: 'Manual' },
];

export const FRESHNESS_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Fresh', label: 'Fresh' }, { value: 'Outdated', label: 'Outdated' }, { value: 'Old', label: 'Old' },
];

export const COMPARISON_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Upgrade', label: '↑ Upgrade' }, { value: 'Same', label: '= Same' }, { value: 'Downgrade', label: '↓ Downgrade' },
];

export const DECISION_OPTIONS = [
  { value: 'Accept', label: 'Accept' }, { value: 'Refuse', label: 'Refuse' }, { value: 'CreateTask', label: 'Create task' },
];

export const COMPANY_ROLE_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: 'Insured', label: 'Insured' }, { value: 'Prospect', label: 'Prospect' },
  { value: 'FormerlyInsured', label: 'Formerly insured' }, { value: 'noRole', label: '(no role)' },
];

export const EXPOSURE_OP_OPTIONS = [
  { value: '>', label: '> (greater than)' }, { value: '<=', label: '≤ (less or equal)' },
];

export const TRANSFERRED_OPTIONS = [
  { value: 'Any', label: 'Any' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' },
];

export const NACE_OPTIONS = [
  { value: '62.01', label: '62.01 — Computer programming' },
  { value: '41.20', label: '41.20 — Construction of buildings' },
  { value: '46.90', label: '46.90 — Non-specialised wholesale' },
  { value: '68.20', label: '68.20 — Renting of real estate' },
  { value: '10.71', label: '10.71 — Bread & fresh pastry' },
];

export const LEGAL_FORM_OPTIONS = [
  { value: 'GmbH', label: 'GmbH' }, { value: 'AG', label: 'AG' },
  { value: 'SARL', label: 'SARL' }, { value: 'SA', label: 'SA' }, { value: 'Lda', label: 'Lda' },
];

export const STATUS_REASON_REFERENTIAL: StatusReasonCode[] = [
  { code: 'FAILL', label: 'Business bankruptcy' },
  { code: 'LIQJU', label: 'Liquidation' },
  { code: 'CESJU', label: 'Dissolved' },
  { code: 'SAUVG', label: 'Chapter 11' },
  { code: 'SURSI', label: 'Moratorium' },
  { code: 'LIQSI', label: 'Liquidation simplifiée' },
  { code: 'CLOFA', label: 'Closure of bankruptcy' },
  { code: 'CESEC', label: 'Ceased to trade' },
  { code: 'INTER', label: 'Disqualified' },
];

// --- mock generators ---

const FR_RULES: TagRule[] = [
  { id: 'fr-1', position: 1, decision: 'Accept', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['08','09','10'], cvgValue: ['04','05','06'], cvgType: ['Automatic'], cvgFreshness: 'Fresh' } },
  { id: 'fr-2', position: 2, decision: 'Refuse', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, sensitivity: ['S1'], cvgValue: ['04','05'], transferred: true } },
  { id: 'fr-3', position: 3, decision: 'CreateTask', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, newAutoGrade: ['04'], lastAgFreshness: 'Outdated' } },
  { id: 'fr-4', position: 4, decision: 'Accept', status: 'Valid',
    criteria: { ...EMPTY_CRITERIA, exposure: { op: '<=', amount: 100000 }, nace: ['62.01'] } },
  { id: 'fr-5', position: 5, decision: 'CreateTask', status: 'NC',
    criteria: { ...EMPTY_CRITERIA, companyRole: ['Prospect'] } },
];

// Northern Europe: generate ~67 rules to exercise P4 filtering.
function neRules(): TagRule[] {
  const sens = ['SN','S0','S1','S2','S3'] as const;
  const types = ['Automatic','Manual'] as const;
  const decisions = ['Accept','Refuse','CreateTask'] as const;
  const out: TagRule[] = [];
  let n = 1;
  for (const s of sens) {
    for (const t of types) {
      for (let i = 0; i < 7; i++) {
        out.push({
          id: `ne-${n}`, position: n, status: 'Valid',
          decision: decisions[n % 3],
          criteria: {
            ...EMPTY_CRITERIA,
            sensitivity: [s],
            cvgType: [t],
            cvgValue: i % 2 === 0 ? ['04','05'] : null,
            cvgFreshness: i % 3 === 0 ? 'Fresh' : null,
            newAutoGrade: i % 4 === 0 ? ['08'] : null,
          },
        });
        n++;
      }
    }
  }
  return out;   // 5 * 2 * 7 = 70 rules
}

const RULES: Record<CountryCode, TagRule[]> = {
  FR: FR_RULES,
  DE: [],                 // empty-state demo
  NE: neRules(),
  PT: FR_RULES.slice(0, 3).map((r, i) => ({ ...r, id: `pt-${i+1}`, position: i+1 })),
};

export function rulesForCountry(code: CountryCode): TagRule[] {
  return RULES[code].map(r => ({ ...r, criteria: { ...r.criteria } }));
}

const FRESHNESS: Record<CountryCode, FreshnessConfig> = {
  FR: { lastCheckedAutograde: { freshUpToMonths: 12, oldAfterMonths: 24 }, validManualGrade: { freshUpToMonths: 9,  oldAfterMonths: 18 } },
  DE: { lastCheckedAutograde: { freshUpToMonths: 12, oldAfterMonths: 24 }, validManualGrade: { freshUpToMonths: 9,  oldAfterMonths: 18 } },
  NE: { lastCheckedAutograde: { freshUpToMonths: 6,  oldAfterMonths: 18 }, validManualGrade: { freshUpToMonths: 6,  oldAfterMonths: 12 } },
  PT: { lastCheckedAutograde: { freshUpToMonths: 12, oldAfterMonths: 24 }, validManualGrade: { freshUpToMonths: 9,  oldAfterMonths: 18 } },
};

export function freshnessForCountry(code: CountryCode): FreshnessConfig {
  const f = FRESHNESS[code];
  return { lastCheckedAutograde: { ...f.lastCheckedAutograde }, validManualGrade: { ...f.validManualGrade } };
}

const CODES: Record<CountryCode, StatusReasonCode[]> = {
  FR: [ STATUS_REASON_REFERENTIAL[0], STATUS_REASON_REFERENTIAL[1], STATUS_REASON_REFERENTIAL[2], STATUS_REASON_REFERENTIAL[3], STATUS_REASON_REFERENTIAL[4] ],
  DE: [ STATUS_REASON_REFERENTIAL[0], STATUS_REASON_REFERENTIAL[1] ],
  NE: [],
  PT: [ STATUS_REASON_REFERENTIAL[0] ],
};

export function codesForCountry(code: CountryCode): StatusReasonCode[] {
  return CODES[code].map(c => ({ ...c }));
}
```

- [ ] **Step 2: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/pages/tag-configuration/tag-configuration.data.ts
git commit -m "feat: TAG v2 mock data + value option lists"
```

---

### Task 4: `tag-filter-chip` component (NEW)

**Files:**
- Create: `src/app/pages/tag-configuration/components/tag-filter-chip.component.ts`
- Create: `src/app/pages/tag-configuration/components/tag-filter-chip.component.html`
- Create: `src/app/pages/tag-configuration/components/tag-filter-chip.component.scss`

**Interfaces:**
- Consumes: `ds-chip` (`ChipComponent`), `ds-flyout-menu`/`ds-flyout-menu-item`, `ds-checkbox` (`CheckboxComponent`), `ds-link` (`LinkComponent`) from `shared/ui`.
- Produces: `TagFilterChipComponent`, selector `tag-filter-chip`.
  - Inputs: `label = input.required<string>()`, `options = input.required<{value:string;label:string}[]>()`, `selected = model<Set<string>>(new Set())`.
  - Output: none beyond the `selected` model (two-way).

- [ ] **Step 1: Read the DS atom APIs first**

Read `src/app/shared/ui/chip/chip.component.ts`, `src/app/shared/ui/flyout-menu/flyout-menu.component.ts`, `src/app/shared/ui/checkbox/checkbox.component.ts`, `src/app/shared/ui/link/link.component.ts` to confirm exact input/output names before wiring. Match them in the snippets below (adjust if the real API differs).

- [ ] **Step 2: Write the component TS**

```ts
import { Component, computed, input, model, signal } from '@angular/core';
import { ChipComponent } from '../../../shared/ui/chip/chip.component';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox.component';
import { LinkComponent } from '../../../shared/ui/link/link.component';

export interface FilterOption { value: string; label: string; }

@Component({
  selector: 'tag-filter-chip',
  standalone: true,
  imports: [ChipComponent, CheckboxComponent, LinkComponent],
  templateUrl: './tag-filter-chip.component.html',
  styleUrl: './tag-filter-chip.component.scss',
})
export class TagFilterChipComponent {
  label    = input.required<string>();
  options  = input.required<FilterOption[]>();
  selected = model<Set<string>>(new Set());

  open = signal(false);

  count = computed(() => this.selected().size);
  active = computed(() => this.count() > 0);
  chipLabel = computed(() => this.active() ? `${this.label()} · ${this.count()}` : this.label());

  toggleOpen(): void { this.open.update(o => !o); }
  close(): void { this.open.set(false); }

  isChecked(value: string): boolean { return this.selected().has(value); }

  toggleValue(value: string): void {
    const next = new Set(this.selected());
    next.has(value) ? next.delete(value) : next.add(value);
    this.selected.set(next);
  }

  clear(): void { this.selected.set(new Set()); }
}
```

- [ ] **Step 3: Write the template**

```html
<div class="tag-filter-chip">
  <ds-chip
    type="select"
    [label]="chipLabel()"
    [selected]="active()"
    (activated)="toggleOpen()" />

  @if (open()) {
    <div class="tag-filter-chip__flyout" role="menu">
      @for (opt of options(); track opt.value) {
        <ds-checkbox
          [label]="opt.label"
          [checked]="isChecked(opt.value)"
          (checkedChange)="toggleValue(opt.value)" />
      }
      <div class="tag-filter-chip__footer">
        <ds-link label="Clear" (clicked)="clear()" />
      </div>
    </div>
  }
</div>
```

> Note: match `ds-chip`, `ds-checkbox`, `ds-link` input/output names to what Step 1 found (e.g. the checkbox output may be `checkedChange` or `change`; the link click may be `clicked` or `click`). If a `ds-flyout-menu` container fits better than a bare div, use it — but the div + tokens is acceptable since the flyout is a positioned surface, not a restyled interactive atom.

- [ ] **Step 4: Write the SCSS (tokens only)**

```scss
.tag-filter-chip {
  position: relative;
  display: inline-block;

  &__flyout {
    position: absolute;
    top: calc(100% + var(--semantic-measurement-spacing-xs));
    left: 0;
    z-index: 10;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    gap: var(--semantic-measurement-spacing-xs);
    padding: var(--semantic-measurement-spacing-s);
    background: var(--semantic-color-static-background-main-primary);
    border: 1px solid var(--semantic-color-static-border-main-tertiary);
    border-radius: var(--semantic-border-radius-s);
    box-shadow: var(--semantic-elevation-shadow-m, 0 4px 16px rgba(0,0,0,.12));
  }

  &__footer {
    border-top: 1px solid var(--semantic-color-static-border-subtle-tertiary);
    padding-top: var(--semantic-measurement-spacing-xs);
  }
}
```

> Note: confirm each token name exists in `_semantic.scss`; substitute the nearest correct semantic token where a name differs. The `box-shadow` fallback is only a safety net — prefer a real elevation token if one exists.

- [ ] **Step 5: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/tag-configuration/components/tag-filter-chip.component.*
git commit -m "feat: tag-filter-chip multi-select filter chip"
```

---

### Task 5: `rule-card` component

**Files:**
- Create: `src/app/pages/tag-configuration/components/rule-card.component.ts`
- Create: `src/app/pages/tag-configuration/components/rule-card.component.html`
- Create: `src/app/pages/tag-configuration/components/rule-card.component.scss`

**Interfaces:**
- Consumes: `ds-card`, `ds-badge`, `ds-button-icon`, `ds-icon`, `ds-flyout-menu`/`ds-flyout-menu-item`; types `TagRule`, `RuleCriteria`, `Decision`, `DECISION_BADGE`, `Country`.
- Produces: `RuleCardComponent`, selector `tag-rule-card`.
  - Inputs: `rule = input.required<TagRule>()`, `currency = input<string>('EUR')`, `expanded = input<boolean>(false)`.
  - Outputs: `edit = output<void>()`, `remove = output<void>()`, `moveUp = output<void>()`, `moveDown = output<void>()`, `toggled = output<void>()`.
  - Public helper (also used by the modal for its group rendering, keep exported): a pure formatter module — see Step 1.

- [ ] **Step 1: Create a shared criteria-formatting helper**

Create `src/app/pages/tag-configuration/criteria-format.ts`:

```ts
import { RuleCriteria, Comparison, Freshness } from './tag-configuration.models';

const COMPARISON_LABEL: Record<Comparison, string> = { Upgrade: '↑ Upgrade', Same: '= Same', Downgrade: '↓ Downgrade' };

export function fmtList(v: string[] | null): string {
  return v && v.length ? v.join(', ') : 'Any';
}
export function fmtFreshness(v: Freshness | null): string { return v ?? 'Any'; }
export function fmtComparison(v: Comparison | null): string { return v ? COMPARISON_LABEL[v] : 'Any'; }
export function fmtTransferred(v: boolean | null): string { return v == null ? 'Any' : (v ? 'Yes' : 'No'); }
export function fmtExposure(v: RuleCriteria['exposure'], currency: string): string {
  return v ? `${v.op} ${v.amount.toLocaleString('en-US')} ${currency}` : 'Any';
}
export function isAny(v: unknown): boolean {
  return v == null || (Array.isArray(v) && v.length === 0);
}
/** True when NACE + legal form + company role are all Any (Other group collapses by default). */
export function otherAllAny(c: RuleCriteria): boolean {
  return isAny(c.nace) && isAny(c.legalForm) && isAny(c.companyRole);
}
```

- [ ] **Step 2: Write the component TS**

```ts
import { Component, computed, input, output, signal } from '@angular/core';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { ButtonIconComponent } from '../../../shared/ui/button-icon/button-icon.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { FlyoutMenuComponent } from '../../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../../shared/ui/flyout-menu/flyout-menu-item.component';
import { TagRule, DECISION_BADGE } from '../tag-configuration.models';
import * as F from '../criteria-format';

@Component({
  selector: 'tag-rule-card',
  standalone: true,
  imports: [CardComponent, BadgeComponent, ButtonIconComponent, IconComponent, FlyoutMenuComponent, FlyoutMenuItemComponent],
  templateUrl: './rule-card.component.html',
  styleUrl: './rule-card.component.scss',
})
export class RuleCardComponent {
  rule     = input.required<TagRule>();
  currency = input<string>('EUR');
  expanded = input<boolean>(false);

  edit     = output<void>();
  remove   = output<void>();
  moveUp   = output<void>();
  moveDown = output<void>();
  toggled  = output<void>();

  menuOpen   = signal(false);
  otherOpen  = signal(false);
  isOpen     = computed(() => this.expanded());   // "Expand all" drives via input; local toggle re-emits

  badge = computed(() => DECISION_BADGE[this.rule().decision]);
  c     = computed(() => this.rule().criteria);
  otherCollapsedByDefault = computed(() => F.otherAllAny(this.c()));

  // formatters exposed to template
  fmtList = F.fmtList; fmtFreshness = F.fmtFreshness; fmtComparison = F.fmtComparison;
  fmtTransferred = F.fmtTransferred; isAny = F.isAny;
  fmtExposure(): string { return F.fmtExposure(this.c().exposure, this.currency()); }

  /** Active-criteria summary segments for the collapsed header. */
  summary = computed(() => {
    const c = this.c(); const segs: { label: string; value: string }[] = [];
    if (!F.isAny(c.sensitivity))  segs.push({ label: 'Sensitivity',  value: F.fmtList(c.sensitivity) });
    if (c.exposure)               segs.push({ label: 'Exposure',     value: this.fmtExposure() });
    if (!F.isAny(c.newAutoGrade)) segs.push({ label: 'New autograde',value: F.fmtList(c.newAutoGrade) });
    if (!F.isAny(c.cvgValue))     segs.push({ label: 'CVG Value',    value: F.fmtList(c.cvgValue) });
    if (!F.isAny(c.cvgType))      segs.push({ label: 'CVG Type',     value: F.fmtList(c.cvgType) });
    if (c.cvgFreshness)           segs.push({ label: 'CVG Freshness',value: c.cvgFreshness });
    if (c.transferred != null)    segs.push({ label: 'Transferred',  value: F.fmtTransferred(c.transferred) });
    if (c.newVsCvg)               segs.push({ label: 'New vs CVG',    value: F.fmtComparison(c.newVsCvg) });
    if (!F.isAny(c.lastAgValue))  segs.push({ label: 'Last AG Value',value: F.fmtList(c.lastAgValue) });
    if (c.lastAgFreshness)        segs.push({ label: 'Last AG Freshness', value: c.lastAgFreshness });
    if (c.newVsLastAg)            segs.push({ label: 'New vs Last AG',value: F.fmtComparison(c.newVsLastAg) });
    if (!F.isAny(c.nace))         segs.push({ label: 'NACE',         value: F.fmtList(c.nace) });
    if (!F.isAny(c.legalForm))    segs.push({ label: 'Legal form',   value: F.fmtList(c.legalForm) });
    if (!F.isAny(c.companyRole))  segs.push({ label: 'Company role', value: F.fmtList(c.companyRole) });
    return segs;
  });

  toggle(): void { this.toggled.emit(); }
  toggleMenu(e: Event): void { e.stopPropagation(); this.menuOpen.update(o => !o); }
  toggleOther(e: Event): void { e.stopPropagation(); this.otherOpen.update(o => !o); }
}
```

- [ ] **Step 3: Write the template**

Header always visible (clickable to toggle); the 4 groups render when `expanded()`. Each value uses the muted class when Any.

```html
<ds-card [noPadding]="true">
  <div class="rule-card__head" role="button" tabindex="0"
       (click)="toggle()" (keydown.enter)="toggle()">
    <span class="rule-card__pos">{{ rule().position }}</span>

    <div class="rule-card__summary">
      @for (s of summary(); track s.label) {
        <span class="rule-card__seg"><span class="rule-card__seg-label">{{ s.label }}</span> {{ s.value }}</span>
      }
      @if (summary().length === 0) {
        <span class="rule-card__seg rule-card__seg--any">No active criteria (matches all)</span>
      }
    </div>

    <ds-badge [status]="badge().status" [variant]="badge().variant" [label]="badge().label" />

    <div class="rule-card__actions" (click)="$event.stopPropagation()">
      <ds-button-icon icon="more-vertical" ariaLabel="Rule actions" (clicked)="toggleMenu($event)" />
      @if (menuOpen()) {
        <ds-flyout-menu>
          <ds-flyout-menu-item label="Edit"      (selected)="edit.emit(); menuOpen.set(false)" />
          <ds-flyout-menu-item label="Move up"   (selected)="moveUp.emit(); menuOpen.set(false)" />
          <ds-flyout-menu-item label="Move down" (selected)="moveDown.emit(); menuOpen.set(false)" />
          <ds-flyout-menu-item label="Delete"    (selected)="remove.emit(); menuOpen.set(false)" />
        </ds-flyout-menu>
      }
      <ds-icon [name]="expanded() ? 'chevron-up' : 'chevron-down'" [size]="16" />
    </div>
  </div>

  @if (expanded()) {
    <div class="rule-card__body">
      <!-- Group 1 -->
      <section class="rule-group">
        <h4 class="rule-group__title">Sensitivity · Exposure · New autograde</h4>
        <div class="rule-group__fields">
          <div class="rule-field"><span class="rule-field__label">Sensitivity</span>   <span class="rule-field__value" [class.rule-field__value--any]="isAny(c().sensitivity)">{{ fmtList(c().sensitivity) }}</span></div>
          <div class="rule-field"><span class="rule-field__label">Exposure</span>      <span class="rule-field__value" [class.rule-field__value--any]="!c().exposure">{{ fmtExposure() }}</span></div>
          <div class="rule-field"><span class="rule-field__label">New autograde</span> <span class="rule-field__value" [class.rule-field__value--any]="isAny(c().newAutoGrade)">{{ fmtList(c().newAutoGrade) }}</span></div>
        </div>
      </section>

      <!-- Group 2 (blue) -->
      <section class="rule-group rule-group--cvg">
        <h4 class="rule-group__title">Current valid grade</h4>
        <div class="rule-group__fields">
          <div class="rule-field"><span class="rule-field__label">Value</span>       <span class="rule-field__value" [class.rule-field__value--any]="isAny(c().cvgValue)">{{ fmtList(c().cvgValue) }}</span></div>
          <div class="rule-field"><span class="rule-field__label">Type</span>        <span class="rule-field__value" [class.rule-field__value--any]="isAny(c().cvgType)">{{ fmtList(c().cvgType) }}</span></div>
          <div class="rule-field"><span class="rule-field__label">Freshness</span>   <span class="rule-field__value" [class.rule-field__value--any]="!c().cvgFreshness">{{ fmtFreshness(c().cvgFreshness) }}</span></div>
          <div class="rule-field"><span class="rule-field__label">Transferred</span> <span class="rule-field__value" [class.rule-field__value--any]="c().transferred == null">{{ fmtTransferred(c().transferred) }}</span></div>
          <div class="rule-field"><span class="rule-field__label">New AG vs CVG</span><span class="rule-field__value" [class.rule-field__value--any]="!c().newVsCvg">{{ fmtComparison(c().newVsCvg) }}</span></div>
        </div>
      </section>

      <!-- Group 3 (orange) -->
      <section class="rule-group rule-group--lastag">
        <h4 class="rule-group__title">Last checked autograde</h4>
        <div class="rule-group__fields">
          <div class="rule-field"><span class="rule-field__label">Value</span>          <span class="rule-field__value" [class.rule-field__value--any]="isAny(c().lastAgValue)">{{ fmtList(c().lastAgValue) }}</span></div>
          <div class="rule-field"><span class="rule-field__label">Freshness</span>      <span class="rule-field__value" [class.rule-field__value--any]="!c().lastAgFreshness">{{ fmtFreshness(c().lastAgFreshness) }}</span></div>
          <div class="rule-field"><span class="rule-field__label">New AG vs Last AG</span><span class="rule-field__value" [class.rule-field__value--any]="!c().newVsLastAg">{{ fmtComparison(c().newVsLastAg) }}</span></div>
        </div>
      </section>

      <!-- Group 4 Other (collapsible) -->
      <section class="rule-group rule-group--other">
        @if (otherCollapsedByDefault() && !otherOpen()) {
          <button class="rule-group__toggle" type="button" (click)="toggleOther($event)">▸ Other — all Any</button>
        } @else {
          <h4 class="rule-group__title">Other</h4>
          <div class="rule-group__fields">
            <div class="rule-field"><span class="rule-field__label">NACE</span>         <span class="rule-field__value" [class.rule-field__value--any]="isAny(c().nace)">{{ fmtList(c().nace) }}</span></div>
            <div class="rule-field"><span class="rule-field__label">Legal form</span>   <span class="rule-field__value" [class.rule-field__value--any]="isAny(c().legalForm)">{{ fmtList(c().legalForm) }}</span></div>
            <div class="rule-field"><span class="rule-field__label">Company role</span> <span class="rule-field__value" [class.rule-field__value--any]="isAny(c().companyRole)">{{ fmtList(c().companyRole) }}</span></div>
          </div>
        }
      </section>
    </div>
  }
</ds-card>
```

> Note: the `▸ Other` toggle uses a native `<button>` — replace with `ds-button` (plain/tertiary variant) to satisfy composition strictness; the snippet uses `<button>` only as a placeholder. Confirm `ds-button-icon` icon names (`more-vertical`, `chevron-up/down`) exist in the icon registry; add paths if missing (per CLAUDE.md).

- [ ] **Step 4: Write the SCSS (tokens only)**

Key rules: head is a flex row; summary segments wrap; `--any` values muted; group titles 11px uppercase tracked; blue title uses info/interactive token, orange title uses `--semantic-color-static-text-main-functional-warning`. All spacing/colour via semantic tokens.

```scss
.rule-card {
  &__head {
    display: flex; align-items: center; gap: var(--semantic-measurement-spacing-s);
    padding: var(--semantic-measurement-spacing-s) var(--semantic-measurement-spacing-m);
    cursor: pointer;
  }
  &__pos {
    flex: 0 0 auto; min-width: 24px; text-align: center;
    color: var(--semantic-color-static-text-main-tertiary);
    font-weight: 700;
  }
  &__summary { flex: 1; display: flex; flex-wrap: wrap; gap: var(--semantic-measurement-spacing-s); }
  &__seg { font-size: var(--foundation-font-size-12, 12px); }
  &__seg-label { color: var(--semantic-color-static-text-main-tertiary); }
  &__seg--any { color: var(--semantic-color-static-text-main-tertiary); font-style: italic; }
  &__actions { display: flex; align-items: center; gap: var(--semantic-measurement-spacing-xs); position: relative; }
  &__body {
    display: flex; flex-direction: column; gap: var(--semantic-measurement-spacing-m);
    padding: var(--semantic-measurement-spacing-m);
    border-top: 1px solid var(--semantic-color-static-border-subtle-tertiary);
  }
}
.rule-group {
  &__title {
    font-size: var(--foundation-font-size-11, 11px); text-transform: uppercase;
    letter-spacing: 0.08em; font-weight: 700; margin-bottom: var(--semantic-measurement-spacing-xs);
    color: var(--semantic-color-static-text-main-tertiary);
    border-bottom: 1px solid var(--semantic-color-static-border-subtle-tertiary);
    padding-bottom: var(--semantic-measurement-spacing-xs);
  }
  &--cvg    .rule-group__title { color: var(--semantic-color-interactive-text-strong-default); border-bottom-color: var(--semantic-color-interactive-border-subtle-default); }
  &--lastag .rule-group__title { color: var(--semantic-color-static-text-main-functional-warning); border-bottom-color: var(--semantic-color-static-border-subtle-functional-warning); }
  &__fields { display: flex; flex-wrap: wrap; gap: var(--semantic-measurement-spacing-l); }
}
.rule-field {
  display: flex; flex-direction: column; gap: 2px;
  &__label { font-size: var(--foundation-font-size-11, 11px); color: var(--semantic-color-static-text-main-tertiary); }
  &__value { font-size: var(--foundation-font-size-12, 12px); color: var(--semantic-color-static-text-main-primary); }
  &__value--any { color: var(--semantic-color-static-text-main-tertiary); font-style: italic; }
}
```

> Note: verify every token name against `_semantic.scss`/`_tokens.scss`; substitute the nearest correct token where a name differs. Avoid the `12px`/`11px` literal fallbacks if a real font-size token exists — use it directly.

- [ ] **Step 5: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/tag-configuration/components/rule-card.component.* src/app/pages/tag-configuration/criteria-format.ts
git commit -m "feat: rule-card with 4 grouped criteria + muted Any + collapsible Other"
```

---

### Task 6: Page skeleton — toolbar, chips bar, list, filtering

**Files:**
- Modify: `src/app/pages/tag-configuration/tag-configuration.component.ts`
- Modify: `src/app/pages/tag-configuration/tag-configuration.component.html`
- Modify: `src/app/pages/tag-configuration/tag-configuration.component.scss`

**Interfaces:**
- Consumes: `TagFilterChipComponent`, `RuleCardComponent`, data helpers, `ds-select`, `ds-link`, `ds-button`, `ds-button-split`, `ds-confirm-dialog`, `ds-toaster-container` + `ToasterService`.
- Produces: fully interactive list (country switch, filtering, expand-all, delete-with-undo). Modal open flags stubbed for Task 7-9.

- [ ] **Step 1: Write the component TS**

```ts
import { Component, computed, signal } from '@angular/core';
import { TopboxTestShellComponent } from '../../user-testing/topbox/topbox-test-shell.component';
import { PageHeaderComponent }      from '../../shared/ui/page-header/page-header.component';
import { BreadcrumbsComponent }     from '../../shared/ui/breadcrumbs/breadcrumbs.component';
import { CrumbComponent }           from '../../shared/ui/crumb/crumb.component';
import { PageTitleComponent }       from '../../shared/ui/page-title/page-title.component';
import { SelectComponent }          from '../../shared/ui/select/select.component';
import { LinkComponent }            from '../../shared/ui/link/link.component';
import { ButtonComponent }          from '../../shared/ui/button/button.component';
import { ButtonSplitComponent }     from '../../shared/ui/button-split/button-split.component';
import { ConfirmDialogComponent }   from '../../shared/ui/confirm-dialog/confirm-dialog.component';
import { ToasterContainerComponent } from '../../shared/ui/toaster/toaster-container.component';
import { ToasterService }           from '../../shared/ui/toaster/toaster.service';
import { inject } from '@angular/core';
import { TagFilterChipComponent }   from './components/tag-filter-chip.component';
import { RuleCardComponent }        from './components/rule-card.component';
import { TagRule, CountryCode, FILTER_KEYS, FilterKey } from './tag-configuration.models';
import {
  COUNTRIES, rulesForCountry,
  SENSITIVITY_OPTIONS, GRADE_OPTIONS, GRADE_TYPE_OPTIONS, FRESHNESS_OPTIONS,
} from './tag-configuration.data';

@Component({
  selector: 'app-tag-configuration',
  standalone: true,
  imports: [
    TopboxTestShellComponent, PageHeaderComponent, BreadcrumbsComponent, CrumbComponent, PageTitleComponent,
    SelectComponent, LinkComponent, ButtonComponent, ButtonSplitComponent,
    ConfirmDialogComponent, ToasterContainerComponent,
    TagFilterChipComponent, RuleCardComponent,
  ],
  templateUrl: './tag-configuration.component.html',
  styleUrl: './tag-configuration.component.scss',
})
export class TagConfigurationComponent {
  private toaster = inject(ToasterService);

  countries = COUNTRIES;
  countryOptions = COUNTRIES.map(c => ({ value: c.code, label: c.name }));
  country = signal<CountryCode>('FR');
  currentCountry = computed(() => COUNTRIES.find(c => c.code === this.country())!);

  rules = signal<TagRule[]>(rulesForCountry('FR'));
  expandedAll = signal(false);
  expandedIds = signal<Set<string>>(new Set());

  // filter chips
  filterOptions: Record<FilterKey, { value: string; label: string }[]> = {
    sensitivity: SENSITIVITY_OPTIONS, newAutoGrade: GRADE_OPTIONS,
    cvgType: GRADE_TYPE_OPTIONS, cvgValue: GRADE_OPTIONS, cvgFreshness: FRESHNESS_OPTIONS,
  };
  filterLabels: Record<FilterKey, string> = {
    sensitivity: 'Sensitivity', newAutoGrade: 'New autograde',
    cvgType: 'CVG - Type', cvgValue: 'CVG - Value', cvgFreshness: 'CVG - Freshness',
  };
  filters = signal<Record<FilterKey, Set<string>>>({
    sensitivity: new Set(), newAutoGrade: new Set(), cvgType: new Set(), cvgValue: new Set(), cvgFreshness: new Set(),
  });
  filterKeys = FILTER_KEYS;

  activeFilterCount = computed(() =>
    FILTER_KEYS.reduce((n, k) => n + (this.filters()[k].size > 0 ? 1 : 0), 0));

  filteredRules = computed(() => {
    const f = this.filters();
    return this.rules().filter(r => FILTER_KEYS.every(k => this.matches(r, k, f[k])));
  });

  hasRules = computed(() => this.rules().length > 0);

  // delete-undo
  confirmOpen = signal(false);
  pendingDelete = signal<TagRule | null>(null);

  onCountryChange(code: string): void {
    this.country.set(code as CountryCode);
    this.rules.set(rulesForCountry(code as CountryCode));
    this.resetFilters();
    this.expandedIds.set(new Set());
    this.expandedAll.set(false);
  }

  setFilter(key: FilterKey, values: Set<string>): void {
    this.filters.update(f => ({ ...f, [key]: values }));
  }
  resetFilters(): void {
    this.filters.set({ sensitivity: new Set(), newAutoGrade: new Set(), cvgType: new Set(), cvgValue: new Set(), cvgFreshness: new Set() });
  }

  private matches(r: TagRule, key: FilterKey, sel: Set<string>): boolean {
    if (sel.size === 0) return true;               // filter off
    const c = r.criteria;
    // "Any" selected → match rules where the criterion is explicitly Any (null/empty)
    const anySelected = sel.has('Any');
    const val = (() => {
      switch (key) {
        case 'sensitivity':  return c.sensitivity;
        case 'newAutoGrade': return c.newAutoGrade;
        case 'cvgType':      return c.cvgType;
        case 'cvgValue':     return c.cvgValue;
        case 'cvgFreshness': return c.cvgFreshness == null ? null : [c.cvgFreshness];
      }
    })();
    const isAny = val == null || (Array.isArray(val) && val.length === 0);
    if (isAny) return anySelected;
    // OR within the chip: rule matches if any of its values is selected
    return (val as string[]).some(v => sel.has(v));
  }

  toggleExpandAll(): void {
    const next = !this.expandedAll();
    this.expandedAll.set(next);
    this.expandedIds.set(next ? new Set(this.rules().map(r => r.id)) : new Set());
  }
  isExpanded(r: TagRule): boolean { return this.expandedIds().has(r.id); }
  toggleCard(r: TagRule): void {
    this.expandedIds.update(s => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; });
  }

  moveUp(r: TagRule): void { this.move(r, -1); }
  moveDown(r: TagRule): void { this.move(r, +1); }
  private move(r: TagRule, delta: number): void {
    const list = [...this.rules()].sort((a, b) => a.position - b.position);
    const i = list.findIndex(x => x.id === r.id);
    const j = i + delta;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    list.forEach((x, idx) => (x.position = idx + 1));
    this.rules.set([...list]);
    this.toaster.show?.({ message: 'Rule order updated' });
  }

  requestDelete(r: TagRule): void { this.pendingDelete.set(r); this.confirmOpen.set(true); }
  confirmDelete(): void {
    const r = this.pendingDelete();
    if (r) {
      const snapshot = this.rules();
      this.rules.update(list => list.filter(x => x.id !== r.id).map((x, idx) => ({ ...x, position: idx + 1 })));
      this.toaster.show?.({ message: `Rule deleted`, actionLabel: 'Undo', action: () => this.rules.set(snapshot) });
    }
    this.confirmOpen.set(false);
    this.pendingDelete.set(null);
  }
  cancelDelete(): void { this.confirmOpen.set(false); this.pendingDelete.set(null); }
}
```

> Note: match `ToasterService`'s real method signature (check `toaster.service.ts`) — the `show?.({...})` calls assume a `show({message, actionLabel?, action?})` API; adapt to the actual method (it may be `push`/`add`, and the undo action shape may differ). Match `ds-select`, `ds-button-split` input/output names to their real APIs.

- [ ] **Step 2: Write the template**

```html
<app-topbox-test-shell>
  <ds-page-header>
    <ds-breadcrumbs>
      <ds-crumb label="Home" />
      <ds-crumb label="TAG Configuration" [current]="true" />
    </ds-breadcrumbs>
    <ds-page-title title="Task After Grading Configuration" />
  </ds-page-header>

  <div class="tag-config">
    <!-- Toolbar -->
    <div class="tag-config__toolbar">
      <ds-select [options]="countryOptions" [value]="country()" (selectionChange)="onCountryChange($event)" />
      @if (hasRules()) {
        <ds-link [label]="expandedAll() ? 'Collapse all' : 'Expand all'" (clicked)="toggleExpandAll()" />
      }
      <span class="tag-config__spacer"></span>
      <ds-button type="secondary" label="Edit freshness" (clicked)="freshnessOpen.set(true)" />
      <ds-button type="secondary" label="Edit TRANS-NA-EXCL" (clicked)="transExclOpen.set(true)" />
      <ds-button-split label="Create rule" (clicked)="openCreate()" />
    </div>

    <!-- Filter chips (P4) -->
    @if (hasRules()) {
      <div class="tag-config__filters">
        <span class="tag-config__filters-label">Filters:</span>
        @for (key of filterKeys; track key) {
          <tag-filter-chip
            [label]="filterLabels[key]"
            [options]="filterOptions[key]"
            [selected]="filters()[key]"
            (selectedChange)="setFilter(key, $event)" />
        }
        @if (activeFilterCount() > 0) {
          <span class="tag-config__filters-result">{{ filteredRules().length }} of {{ rules().length }} rules</span>
          <ds-link label="Clear filters" (clicked)="resetFilters()" />
        }
      </div>
    }

    <!-- List -->
    @if (!hasRules()) {
      <div class="tag-config__empty">No rules have been set up for this country.</div>
    } @else if (filteredRules().length === 0) {
      <div class="tag-config__empty">No rules match the active filters.</div>
    } @else {
      <div class="tag-config__list">
        @for (r of filteredRules(); track r.id) {
          <tag-rule-card
            [rule]="r" [currency]="currentCountry().currency" [expanded]="isExpanded(r)"
            (toggled)="toggleCard(r)"
            (edit)="openEdit(r)"
            (remove)="requestDelete(r)"
            (moveUp)="moveUp(r)"
            (moveDown)="moveDown(r)" />
        }
      </div>
    }
  </div>

  <!-- delete confirm -->
  @if (confirmOpen()) {
    <ds-confirm-dialog
      tone="danger" title="Delete rule?" confirmLabel="Delete" cancelLabel="Cancel"
      (confirmed)="confirmDelete()" (cancelled)="cancelDelete()" />
  }

  <ds-toaster-container />
</app-topbox-test-shell>
```

> Note: `freshnessOpen`, `transExclOpen`, `openCreate`, `openEdit` are added in Tasks 7-9; for THIS task, add temporary stub signals/methods so it compiles: `freshnessOpen = signal(false); transExclOpen = signal(false); openCreate() {} openEdit(_r: TagRule) {}`. They get real bodies + modal markup in the next tasks. Match `ds-confirm-dialog` input/output names to its real API.

- [ ] **Step 3: Add the toolbar/filters/list SCSS (tokens only)**

```scss
.tag-config {
  &__toolbar { display: flex; align-items: center; gap: var(--semantic-measurement-spacing-s); }
  &__spacer  { flex: 1; }
  &__filters {
    display: flex; align-items: center; flex-wrap: wrap;
    gap: var(--semantic-measurement-spacing-s);
    padding: var(--semantic-measurement-spacing-s) 0;
  }
  &__filters-label  { font-size: var(--foundation-font-size-12, 12px); color: var(--semantic-color-static-text-main-tertiary); font-weight: 600; }
  &__filters-result { font-size: var(--foundation-font-size-12, 12px); color: var(--semantic-color-static-text-main-tertiary); }
  &__list  { display: flex; flex-direction: column; gap: var(--semantic-measurement-spacing-s); }
  &__empty {
    padding: var(--semantic-measurement-spacing-xxl, 48px) 0; text-align: center;
    color: var(--semantic-color-static-text-main-tertiary);
  }
}
```

- [ ] **Step 4: Build to verify it compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Visual check in the running app**

Run: `npm start`, open `http://localhost:4200/#/prototype/tag-configuration` (or `#/review/tag-configuration`).
Expected: France shows 5 cards; switching to Germany shows the empty state; Northern Europe shows ~70 cards; the 5 filter chips appear; selecting Sensitivity=SN AND CVG-Type=Manual on Northern Europe narrows the list; Expand all opens every card with 4 groups (blue CVG, orange Last AG), Any values muted, Other collapsed. Delete asks for confirmation and offers Undo.

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/tag-configuration/tag-configuration.component.*
git commit -m "feat: TAG page — toolbar, filter chips, list, filtering, delete-undo"
```

---

### Task 7: Rule create/edit modal

**Files:**
- Create: `src/app/pages/tag-configuration/components/rule-modal.component.ts`
- Create: `src/app/pages/tag-configuration/components/rule-modal.component.html`
- Create: `src/app/pages/tag-configuration/components/rule-modal.component.scss`
- Modify: `src/app/pages/tag-configuration/tag-configuration.component.ts` (wire open/save)
- Modify: `src/app/pages/tag-configuration/tag-configuration.component.html` (host modal)

**Interfaces:**
- Consumes: `ds-modal`, `ds-modal-header`, `ds-modal-content`, `ds-modal-footer`, `ds-select`, `ds-input-text`, `ds-segmented-control`, `ds-checkbox`, `ds-divider`, `ds-button`, `ds-confirm-dialog`; all option lists from data; `RuleCriteria`, `TagRule`, `EMPTY_CRITERIA`.
- Produces: `RuleModalComponent`, selector `tag-rule-modal`.
  - Inputs: `open = input<boolean>(false)`, `rule = input<TagRule | null>(null)` (null = create), `currency = input<string>('EUR')`.
  - Outputs: `save = output<TagRule>()`, `closed = output<void>()`.

- [ ] **Step 1: Read DS form-atom APIs**

Read `select`, `input-text`, `segmented-control`, `checkbox`, `divider`, `modal*` component TS files to confirm input/output names. Match them.

- [ ] **Step 2: Write the component TS**

Seed a local editable `RuleCriteria` + `decision` from `rule()` on open via `effect`; parse to `TagRule` on save. Multi-selects held as `Set<string>`, single-selects as strings ('Any' → null). Dirty-guard on close.

```ts
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { ModalHeaderComponent } from '../../../shared/ui/modal/modal-header.component';
import { ModalContentComponent } from '../../../shared/ui/modal/modal-content.component';
import { ModalFooterComponent } from '../../../shared/ui/modal/modal-footer.component';
import { SelectComponent } from '../../../shared/ui/select/select.component';
import { InputTextComponent } from '../../../shared/ui/input-text/input-text.component';
import { SegmentedControlComponent } from '../../../shared/ui/segmented-control/segmented-control.component';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox.component';
import { DividerComponent } from '../../../shared/ui/divider/divider.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ConfirmDialogComponent } from '../../../shared/ui/confirm-dialog/confirm-dialog.component';
import {
  TagRule, RuleCriteria, EMPTY_CRITERIA, Decision, Grade, Sensitivity, GradeType, Freshness, Comparison,
} from '../tag-configuration.models';
import {
  SENSITIVITY_OPTIONS, GRADE_OPTIONS, GRADE_TYPE_OPTIONS, FRESHNESS_OPTIONS,
  COMPARISON_OPTIONS, DECISION_OPTIONS, COMPANY_ROLE_OPTIONS, NACE_OPTIONS, LEGAL_FORM_OPTIONS,
  EXPOSURE_OP_OPTIONS, TRANSFERRED_OPTIONS,
} from '../tag-configuration.data';

@Component({
  selector: 'tag-rule-modal',
  standalone: true,
  imports: [
    ModalComponent, ModalHeaderComponent, ModalContentComponent, ModalFooterComponent,
    SelectComponent, InputTextComponent, SegmentedControlComponent, CheckboxComponent,
    DividerComponent, ButtonComponent, ConfirmDialogComponent,
  ],
  templateUrl: './rule-modal.component.html',
  styleUrl: './rule-modal.component.scss',
})
export class RuleModalComponent {
  open     = input<boolean>(false);
  rule     = input<TagRule | null>(null);
  currency = input<string>('EUR');

  save   = output<TagRule>();
  closed = output<void>();

  // option lists exposed
  SENSITIVITY_OPTIONS = SENSITIVITY_OPTIONS; GRADE_OPTIONS = GRADE_OPTIONS;
  GRADE_TYPE_OPTIONS = GRADE_TYPE_OPTIONS; FRESHNESS_OPTIONS = FRESHNESS_OPTIONS;
  COMPARISON_OPTIONS = COMPARISON_OPTIONS; DECISION_OPTIONS = DECISION_OPTIONS;
  COMPANY_ROLE_OPTIONS = COMPANY_ROLE_OPTIONS; NACE_OPTIONS = NACE_OPTIONS;
  LEGAL_FORM_OPTIONS = LEGAL_FORM_OPTIONS; EXPOSURE_OP_OPTIONS = EXPOSURE_OP_OPTIONS;
  TRANSFERRED_OPTIONS = TRANSFERRED_OPTIONS;

  isEdit = computed(() => this.rule() != null);
  title  = computed(() => this.isEdit() ? 'Edit rule' : 'Create a new rule');

  // editable local state (multi as Set<string>, single as string; '' or 'Any' = null)
  sensitivity  = signal<Set<string>>(new Set());
  exposureOp   = signal<string>('');
  exposureAmt  = signal<string>('');
  newAutoGrade = signal<Set<string>>(new Set());
  cvgValue     = signal<Set<string>>(new Set());
  cvgType      = signal<Set<string>>(new Set());
  cvgFreshness = signal<string>('Any');
  transferred  = signal<string>('Any');
  newVsCvg     = signal<string>('Any');
  lastAgValue  = signal<Set<string>>(new Set());
  lastAgFreshness = signal<string>('Any');
  newVsLastAg  = signal<string>('Any');
  nace         = signal<Set<string>>(new Set());
  legalForm    = signal<Set<string>>(new Set());
  companyRole  = signal<Set<string>>(new Set());
  decision     = signal<Decision>('Accept');

  confirmCloseOpen = signal(false);
  private baseline = '';

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const r = this.rule();
      const c = r?.criteria ?? EMPTY_CRITERIA;
      this.sensitivity.set(new Set(c.sensitivity ?? []));
      this.exposureOp.set(c.exposure?.op ?? '');
      this.exposureAmt.set(c.exposure ? String(c.exposure.amount) : '');
      this.newAutoGrade.set(new Set(c.newAutoGrade ?? []));
      this.cvgValue.set(new Set(c.cvgValue ?? []));
      this.cvgType.set(new Set(c.cvgType ?? []));
      this.cvgFreshness.set(c.cvgFreshness ?? 'Any');
      this.transferred.set(c.transferred == null ? 'Any' : (c.transferred ? 'Yes' : 'No'));
      this.newVsCvg.set(c.newVsCvg ?? 'Any');
      this.lastAgValue.set(new Set(c.lastAgValue ?? []));
      this.lastAgFreshness.set(c.lastAgFreshness ?? 'Any');
      this.newVsLastAg.set(c.newVsLastAg ?? 'Any');
      this.nace.set(new Set(c.nace ?? []));
      this.legalForm.set(new Set(c.legalForm ?? []));
      this.companyRole.set(new Set(c.companyRole ?? []));
      this.decision.set(r?.decision ?? 'Accept');
      this.baseline = this.snapshot();
    });
  }

  private setToNull<T>(s: Set<string>): T[] | null { return s.size ? ([...s] as T[]) : null; }
  private singleToNull<T>(v: string): T | null { return v && v !== 'Any' ? (v as T) : null; }

  private buildCriteria(): RuleCriteria {
    const amt = parseInt(this.exposureAmt(), 10);
    return {
      sensitivity: this.setToNull<Sensitivity>(this.sensitivity()),
      exposure: this.exposureOp() && !isNaN(amt) ? { op: this.exposureOp() as '>' | '<=', amount: amt } : null,
      newAutoGrade: this.setToNull<Grade>(this.newAutoGrade()),
      cvgValue: this.setToNull<Grade>(this.cvgValue()),
      cvgType: this.setToNull<GradeType>(this.cvgType()),
      cvgFreshness: this.singleToNull<Freshness>(this.cvgFreshness()),
      transferred: this.transferred() === 'Any' ? null : this.transferred() === 'Yes',
      newVsCvg: this.singleToNull<Comparison>(this.newVsCvg()),
      lastAgValue: this.setToNull<Grade>(this.lastAgValue()),
      lastAgFreshness: this.singleToNull<Freshness>(this.lastAgFreshness()),
      newVsLastAg: this.singleToNull<Comparison>(this.newVsLastAg()),
      nace: this.setToNull<string>(this.nace()),
      legalForm: this.setToNull<string>(this.legalForm()),
      companyRole: this.setToNull<string>(this.companyRole()),
    };
  }
  private snapshot(): string { return JSON.stringify(this.buildCriteria()) + this.decision(); }
  private isDirty(): boolean { return this.snapshot() !== this.baseline; }

  // exposure amount required when op set
  canSave = computed(() => !this.exposureOp() || (!!this.exposureAmt() && !isNaN(parseInt(this.exposureAmt(), 10))));

  toggleSet(sig: ReturnType<typeof signal<Set<string>>>, value: string): void {
    const next = new Set(sig()); next.has(value) ? next.delete(value) : next.add(value); sig.set(next);
  }

  onSave(): void {
    if (!this.canSave()) return;
    const r = this.rule();
    this.save.emit({
      id: r?.id ?? `r-${Date.now()}`,
      position: r?.position ?? 9999,
      status: r?.status ?? 'Valid',
      decision: this.decision(),
      criteria: this.buildCriteria(),
    });
  }
  requestClose(): void { this.isDirty() ? this.confirmCloseOpen.set(true) : this.closed.emit(); }
  confirmClose(): void { this.confirmCloseOpen.set(false); this.closed.emit(); }
  cancelClose(): void { this.confirmCloseOpen.set(false); }
}
```

> Note: `Date.now()` is fine in app runtime (the ban only applies to Workflow scripts). Match every DS atom API. If a real multi-select atom exists that's cleaner than checkbox-groups (e.g. `search-bar-multi` for NACE/Legal form search), use it; otherwise a checkbox group inside a labelled block is acceptable.

- [ ] **Step 3: Write the template**

Four grouped sections (matching card accents) + Outcome section. Multi-select criteria = a labelled block of `ds-checkbox`; single-select = `ds-select`; exposure = `ds-select` op + `ds-input-text` amount + currency; transferred = `ds-segmented-control`. Use the corrected labels. Footer: Cancel + Create/Save.

```html
@if (open()) {
  <ds-modal (backdrop)="requestClose()">
    <ds-modal-header [title]="title()" (close)="requestClose()" />
    <ds-modal-content>

      <section class="rm-group">
        <h4 class="rm-group__title">Sensitivity · Exposure · New autograde</h4>
        <div class="rm-field">
          <label class="rm-label">Sensitivity</label>
          <div class="rm-checks">
            @for (o of SENSITIVITY_OPTIONS; track o.value) {
              @if (o.value !== 'Any') {
                <ds-checkbox [label]="o.label" [checked]="sensitivity().has(o.value)" (checkedChange)="toggleSet(sensitivity, o.value)" />
              }
            }
          </div>
        </div>
        <div class="rm-field">
          <label class="rm-label">Exposure</label>
          <div class="rm-exposure">
            <ds-select [options]="EXPOSURE_OP_OPTIONS" [value]="exposureOp()" (selectionChange)="exposureOp.set($event)" placeholder="Any" />
            <ds-input-text [value]="exposureAmt()" (valueChange)="exposureAmt.set($event)" placeholder="Amount" />
            <span class="rm-currency">{{ currency() }}</span>
          </div>
        </div>
        <div class="rm-field">
          <label class="rm-label">New autograde</label>
          <div class="rm-checks">
            @for (o of GRADE_OPTIONS; track o.value) {
              @if (o.value !== 'Any') { <ds-checkbox [label]="o.label" [checked]="newAutoGrade().has(o.value)" (checkedChange)="toggleSet(newAutoGrade, o.value)" /> }
            }
          </div>
        </div>
      </section>

      <section class="rm-group rm-group--cvg">
        <h4 class="rm-group__title">Current valid grade</h4>
        <div class="rm-field">
          <label class="rm-label">Value</label>
          <div class="rm-checks">@for (o of GRADE_OPTIONS; track o.value) { @if (o.value !== 'Any') { <ds-checkbox [label]="o.label" [checked]="cvgValue().has(o.value)" (checkedChange)="toggleSet(cvgValue, o.value)" /> } }</div>
        </div>
        <div class="rm-field">
          <label class="rm-label">Type</label>
          <div class="rm-checks">@for (o of GRADE_TYPE_OPTIONS; track o.value) { @if (o.value !== 'Any') { <ds-checkbox [label]="o.label" [checked]="cvgType().has(o.value)" (checkedChange)="toggleSet(cvgType, o.value)" /> } }</div>
        </div>
        <div class="rm-field">
          <label class="rm-label">Freshness</label>
          <ds-select [options]="FRESHNESS_OPTIONS" [value]="cvgFreshness()" (selectionChange)="cvgFreshness.set($event)" />
        </div>
        <div class="rm-field">
          <label class="rm-label">Transferred</label>
          <ds-segmented-control [options]="TRANSFERRED_OPTIONS" [selected]="transferred()" (selectedChange)="transferred.set($event)" />
        </div>
        <div class="rm-field">
          <label class="rm-label">New AG vs CVG</label>
          <ds-select [options]="COMPARISON_OPTIONS" [value]="newVsCvg()" (selectionChange)="newVsCvg.set($event)" />
        </div>
      </section>

      <section class="rm-group rm-group--lastag">
        <h4 class="rm-group__title">Last checked autograde</h4>
        <div class="rm-field">
          <label class="rm-label">Value</label>
          <div class="rm-checks">@for (o of GRADE_OPTIONS; track o.value) { @if (o.value !== 'Any') { <ds-checkbox [label]="o.label" [checked]="lastAgValue().has(o.value)" (checkedChange)="toggleSet(lastAgValue, o.value)" /> } }</div>
        </div>
        <div class="rm-field">
          <label class="rm-label">Freshness</label>
          <ds-select [options]="FRESHNESS_OPTIONS" [value]="lastAgFreshness()" (selectionChange)="lastAgFreshness.set($event)" />
        </div>
        <div class="rm-field">
          <label class="rm-label">New AG vs Last AG</label>
          <ds-select [options]="COMPARISON_OPTIONS" [value]="newVsLastAg()" (selectionChange)="newVsLastAg.set($event)" />
        </div>
      </section>

      <section class="rm-group">
        <h4 class="rm-group__title">Other</h4>
        <div class="rm-field">
          <label class="rm-label">NACE</label>
          <div class="rm-checks">@for (o of NACE_OPTIONS; track o.value) { <ds-checkbox [label]="o.label" [checked]="nace().has(o.value)" (checkedChange)="toggleSet(nace, o.value)" /> }</div>
        </div>
        <div class="rm-field">
          <label class="rm-label">Legal form</label>
          <div class="rm-checks">@for (o of LEGAL_FORM_OPTIONS; track o.value) { <ds-checkbox [label]="o.label" [checked]="legalForm().has(o.value)" (checkedChange)="toggleSet(legalForm, o.value)" /> }</div>
        </div>
        <div class="rm-field">
          <label class="rm-label">Company role</label>
          <div class="rm-checks">@for (o of COMPANY_ROLE_OPTIONS; track o.value) { @if (o.value !== 'Any') { <ds-checkbox [label]="o.label" [checked]="companyRole().has(o.value)" (checkedChange)="toggleSet(companyRole, o.value)" /> } }</div>
        </div>
      </section>

      <ds-divider />
      <section class="rm-group">
        <h4 class="rm-group__title">Outcome</h4>
        <div class="rm-field">
          <label class="rm-label">TAG Decision</label>
          <ds-select [options]="DECISION_OPTIONS" [value]="decision()" (selectionChange)="decision.set($any($event))" />
        </div>
      </section>

    </ds-modal-content>
    <ds-modal-footer>
      <ds-button type="tertiary" label="Cancel" (clicked)="requestClose()" />
      <ds-button type="primary" [label]="isEdit() ? 'Save' : 'Create'" [disabled]="!canSave()" (clicked)="onSave()" />
    </ds-modal-footer>
  </ds-modal>

  @if (confirmCloseOpen()) {
    <ds-confirm-dialog tone="danger" title="Discard changes?" confirmLabel="Discard" cancelLabel="Keep editing"
      (confirmed)="confirmClose()" (cancelled)="cancelClose()" />
  }
}
```

> Note: match all DS modal/select/checkbox/segmented/divider input/output names to their real APIs; the snippet's names (`backdrop`, `close`, `valueChange`, `checkedChange`, `selectionChange`, `selectedChange`) are best-guesses to confirm. `$any($event)` casts the decision string.

- [ ] **Step 4: Write the SCSS (reuse group accent rules from rule-card, tokens only)**

```scss
.rm-group {
  margin-bottom: var(--semantic-measurement-spacing-l);
  &__title {
    font-size: var(--foundation-font-size-11, 11px); text-transform: uppercase; letter-spacing: 0.06em;
    font-weight: 700; color: var(--semantic-color-static-text-main-tertiary);
    border-bottom: 1px solid var(--semantic-color-static-border-subtle-tertiary);
    padding-bottom: var(--semantic-measurement-spacing-xs); margin-bottom: var(--semantic-measurement-spacing-s);
  }
  &--cvg    .rm-group__title { color: var(--semantic-color-interactive-text-strong-default); border-bottom-color: var(--semantic-color-interactive-border-subtle-default); }
  &--lastag .rm-group__title { color: var(--semantic-color-static-text-main-functional-warning); border-bottom-color: var(--semantic-color-static-border-subtle-functional-warning); }
}
.rm-field { display: flex; flex-direction: column; gap: var(--semantic-measurement-spacing-xs); margin-bottom: var(--semantic-measurement-spacing-s); }
.rm-label { font-size: var(--foundation-font-size-11, 11px); font-weight: 600; color: var(--semantic-color-static-text-main-secondary); }
.rm-checks { display: flex; flex-wrap: wrap; gap: var(--semantic-measurement-spacing-s); }
.rm-exposure { display: flex; align-items: center; gap: var(--semantic-measurement-spacing-xs); }
.rm-currency { font-size: var(--foundation-font-size-12, 12px); color: var(--semantic-color-static-text-main-tertiary); }
```

- [ ] **Step 5: Wire into the page**

In `tag-configuration.component.ts`: replace the stub `openCreate`/`openEdit`/`ruleModalOpen`:

```ts
ruleModalOpen = signal(false);
editingRule = signal<TagRule | null>(null);
openCreate(): void { this.editingRule.set(null); this.ruleModalOpen.set(true); }
openEdit(r: TagRule): void { this.editingRule.set(r); this.ruleModalOpen.set(true); }
onRuleSave(saved: TagRule): void {
  this.rules.update(list => {
    const i = list.findIndex(x => x.id === saved.id);
    if (i >= 0) { const copy = [...list]; copy[i] = saved; return copy; }
    return [...list, { ...saved, position: list.length + 1 }];
  });
  this.ruleModalOpen.set(false);
  this.toaster.show?.({ message: this.editingRule() ? 'Rule updated' : 'Rule created' });
}
```

Add `RuleModalComponent` to imports; host in template before `ds-toaster-container`:

```html
<tag-rule-modal
  [open]="ruleModalOpen()" [rule]="editingRule()" [currency]="currentCountry().currency"
  (save)="onRuleSave($event)" (closed)="ruleModalOpen.set(false)" />
```

- [ ] **Step 6: Build + visual check**

Run: `npm run build` (expect success), then `npm start`.
Expected: "Create rule" opens the modal with 4 groups + Outcome; corrected labels ("Company role", "Value", "Freshness", "Type", no "Type Valid grade"); Transferred is a 3-way segmented; editing a rule seeds its values; Save updates the card; discard-guard prompts when dirty.

- [ ] **Step 7: Commit**

```bash
git add src/app/pages/tag-configuration/components/rule-modal.component.* src/app/pages/tag-configuration/tag-configuration.component.*
git commit -m "feat: rule create/edit modal — 4 groups, corrected labels, +4 fields"
```

---

### Task 8: Freshness modal (P2)

**Files:**
- Create: `src/app/pages/tag-configuration/components/freshness-modal.component.ts`
- Create: `src/app/pages/tag-configuration/components/freshness-modal.component.html`
- Create: `src/app/pages/tag-configuration/components/freshness-modal.component.scss`
- Modify: `src/app/pages/tag-configuration/tag-configuration.component.ts` + `.html`

**Interfaces:**
- Consumes: `ds-modal*`, `ds-input-text`, `ds-functional-notice`, `ds-button`; `FreshnessConfig`, `freshnessForCountry`.
- Produces: `FreshnessModalComponent`, selector `tag-freshness-modal`.
  - Inputs: `open`, `config = input.required<FreshnessConfig>()`.
  - Outputs: `save = output<FreshnessConfig>()`, `closed = output<void>()`.

- [ ] **Step 1: Write the component TS**

Read `functional-notice` + `input-text` APIs first. Seed editable "new" values from config; keep "current" read-only display values from the seed baseline.

```ts
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { ModalHeaderComponent } from '../../../shared/ui/modal/modal-header.component';
import { ModalContentComponent } from '../../../shared/ui/modal/modal-content.component';
import { ModalFooterComponent } from '../../../shared/ui/modal/modal-footer.component';
import { InputTextComponent } from '../../../shared/ui/input-text/input-text.component';
import { FunctionalNoticeComponent } from '../../../shared/ui/functional-notice/functional-notice.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { FreshnessConfig } from '../tag-configuration.models';

@Component({
  selector: 'tag-freshness-modal',
  standalone: true,
  imports: [ModalComponent, ModalHeaderComponent, ModalContentComponent, ModalFooterComponent, InputTextComponent, FunctionalNoticeComponent, ButtonComponent],
  templateUrl: './freshness-modal.component.html',
  styleUrl: './freshness-modal.component.scss',
})
export class FreshnessModalComponent {
  open   = input<boolean>(false);
  config = input.required<FreshnessConfig>();
  save   = output<FreshnessConfig>();
  closed = output<void>();

  // current (read-only display)
  curLastFresh = signal(0); curLastOld = signal(0); curManFresh = signal(0); curManOld = signal(0);
  // new (editable, as strings for input)
  lastFresh = signal('0'); lastOld = signal('0'); manFresh = signal('0'); manOld = signal('0');

  constructor() {
    effect(() => {
      if (!this.open()) return;
      const c = this.config();
      this.curLastFresh.set(c.lastCheckedAutograde.freshUpToMonths);
      this.curLastOld.set(c.lastCheckedAutograde.oldAfterMonths);
      this.curManFresh.set(c.validManualGrade.freshUpToMonths);
      this.curManOld.set(c.validManualGrade.oldAfterMonths);
      this.lastFresh.set(String(c.lastCheckedAutograde.freshUpToMonths));
      this.lastOld.set(String(c.lastCheckedAutograde.oldAfterMonths));
      this.manFresh.set(String(c.validManualGrade.freshUpToMonths));
      this.manOld.set(String(c.validManualGrade.oldAfterMonths));
    });
  }

  private n(s: string): number { const v = parseInt(s, 10); return isNaN(v) ? 0 : v; }
  lastValid = computed(() => this.n(this.lastOld()) >= this.n(this.lastFresh()));
  manValid  = computed(() => this.n(this.manOld())  >= this.n(this.manFresh()));
  canSave   = computed(() => this.lastValid() && this.manValid());

  onSave(): void {
    if (!this.canSave()) return;
    this.save.emit({
      lastCheckedAutograde: { freshUpToMonths: this.n(this.lastFresh()), oldAfterMonths: this.n(this.lastOld()) },
      validManualGrade:     { freshUpToMonths: this.n(this.manFresh()),  oldAfterMonths: this.n(this.manOld()) },
    });
  }
}
```

- [ ] **Step 2: Write the template**

Two rows × (label + 2 read-only current + 2 editable new), with the validation notice per invalid row.

```html
@if (open()) {
  <ds-modal (backdrop)="closed.emit()">
    <ds-modal-header title="Edit grade freshness thresholds" (close)="closed.emit()" />
    <ds-modal-content>
      <p class="fm-intro">Defines Fresh / Outdated / Old boundaries. Changes apply to all rules for this country (draft — effective on next validation).</p>

      <div class="fm-table">
        <div class="fm-row fm-row--head">
          <span>Grade type</span><span>Current: Fresh up to</span><span>Current: Old after</span><span>New: Fresh up to</span><span>New: Old after</span>
        </div>

        <div class="fm-row">
          <span class="fm-type">Last checked autograde</span>
          <ds-input-text [value]="curLastFresh() + ' mo'" [disabled]="true" />
          <ds-input-text [value]="curLastOld() + ' mo'"   [disabled]="true" />
          <ds-input-text [value]="lastFresh()" (valueChange)="lastFresh.set($event)" />
          <ds-input-text [value]="lastOld()"   (valueChange)="lastOld.set($event)" [error]="!lastValid()" />
        </div>
        @if (!lastValid()) {
          <ds-functional-notice status="warning" message="Old after (months) must be ≥ Fresh up to (months)" />
        }

        <div class="fm-row">
          <span class="fm-type">Valid manual grade <em>(transferred or not)</em></span>
          <ds-input-text [value]="curManFresh() + ' mo'" [disabled]="true" />
          <ds-input-text [value]="curManOld() + ' mo'"   [disabled]="true" />
          <ds-input-text [value]="manFresh()" (valueChange)="manFresh.set($event)" />
          <ds-input-text [value]="manOld()"   (valueChange)="manOld.set($event)" [error]="!manValid()" />
        </div>
        @if (!manValid()) {
          <ds-functional-notice status="warning" message="Old after (months) must be ≥ Fresh up to (months)" />
        }
      </div>
    </ds-modal-content>
    <ds-modal-footer>
      <ds-button type="tertiary" label="Cancel" (clicked)="closed.emit()" />
      <ds-button type="primary" label="Validate" [disabled]="!canSave()" (clicked)="onSave()" />
    </ds-modal-footer>
  </ds-modal>
}
```

> Note: match `ds-functional-notice` API (`status`/`variant`, `message`/content projection) and `ds-input-text` (`disabled`, `error`, `valueChange`). If read-only is better expressed with a `readonly` attr than `disabled`, use it.

- [ ] **Step 3: Write the SCSS (CSS grid table, tokens only)**

```scss
.fm-intro { font-size: var(--foundation-font-size-12, 12px); color: var(--semantic-color-static-text-main-tertiary); margin-bottom: var(--semantic-measurement-spacing-m); }
.fm-table { display: flex; flex-direction: column; gap: var(--semantic-measurement-spacing-xs); }
.fm-row {
  display: grid; grid-template-columns: 1.6fr repeat(4, 1fr);
  align-items: center; gap: var(--semantic-measurement-spacing-s);
}
.fm-row--head {
  font-size: var(--foundation-font-size-11, 11px); font-weight: 600;
  color: var(--semantic-color-static-text-main-tertiary);
  padding-bottom: var(--semantic-measurement-spacing-xs);
  border-bottom: 1px solid var(--semantic-color-static-border-subtle-tertiary);
}
.fm-type { font-weight: 600; color: var(--semantic-color-static-text-main-primary); font-size: var(--foundation-font-size-12, 12px); }
.fm-type em { font-weight: 400; color: var(--semantic-color-static-text-main-tertiary); font-size: var(--foundation-font-size-11, 11px); }
```

- [ ] **Step 4: Wire into the page**

In `tag-configuration.component.ts`: add `freshness = signal(freshnessForCountry('FR'));` (import `freshnessForCountry`), set it in `onCountryChange` (`this.freshness.set(freshnessForCountry(code))`), replace the stub `freshnessOpen` if needed, add:

```ts
onFreshnessSave(cfg: FreshnessConfig): void {
  this.freshness.set(cfg);
  this.freshnessOpen.set(false);
  this.toaster.show?.({ message: 'Freshness thresholds saved (draft)' });
}
```

Add `FreshnessModalComponent` to imports; host in template:

```html
<tag-freshness-modal [open]="freshnessOpen()" [config]="freshness()" (save)="onFreshnessSave($event)" (closed)="freshnessOpen.set(false)" />
```

- [ ] **Step 5: Build + visual check**

Run: `npm run build` (success), `npm start`.
Expected: "Edit freshness" opens 2 rows × 5 cols; current cols read-only; editing New Old after below New Fresh up to shows the warning notice + disables Validate; valid values save + toast.

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/tag-configuration/components/freshness-modal.component.* src/app/pages/tag-configuration/tag-configuration.component.*
git commit -m "feat: freshness modal — 3-state model, 2 thresholds/type, validation"
```

---

### Task 9: TRANS-NA-EXCL modal (P3)

**Files:**
- Create: `src/app/pages/tag-configuration/components/trans-excl-modal.component.ts`
- Create: `src/app/pages/tag-configuration/components/trans-excl-modal.component.html`
- Create: `src/app/pages/tag-configuration/components/trans-excl-modal.component.scss`
- Modify: `src/app/pages/tag-configuration/tag-configuration.component.ts` + `.html`

**Interfaces:**
- Consumes: `ds-modal*`, `ds-input-search`, `ds-button`, `ds-button-icon`, `ds-functional-notice`, `ds-tag`, `ds-flyout-menu`/`ds-flyout-menu-item`; `StatusReasonCode`, `STATUS_REASON_REFERENTIAL`.
- Produces: `TransExclModalComponent`, selector `tag-trans-excl-modal`.
  - Inputs: `open`, `codes = input.required<StatusReasonCode[]>()`, `countryName = input<string>('')`.
  - Outputs: `save = output<StatusReasonCode[]>()`, `closed = output<void>()`.

- [ ] **Step 1: Write the component TS**

```ts
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { ModalComponent } from '../../../shared/ui/modal/modal.component';
import { ModalHeaderComponent } from '../../../shared/ui/modal/modal-header.component';
import { ModalContentComponent } from '../../../shared/ui/modal/modal-content.component';
import { ModalFooterComponent } from '../../../shared/ui/modal/modal-footer.component';
import { InputSearchComponent } from '../../../shared/ui/input-search/input-search.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ButtonIconComponent } from '../../../shared/ui/button-icon/button-icon.component';
import { FunctionalNoticeComponent } from '../../../shared/ui/functional-notice/functional-notice.component';
import { TagComponent } from '../../../shared/ui/tag/tag.component';
import { FlyoutMenuComponent } from '../../../shared/ui/flyout-menu/flyout-menu.component';
import { FlyoutMenuItemComponent } from '../../../shared/ui/flyout-menu/flyout-menu-item.component';
import { StatusReasonCode } from '../tag-configuration.models';
import { STATUS_REASON_REFERENTIAL } from '../tag-configuration.data';

@Component({
  selector: 'tag-trans-excl-modal',
  standalone: true,
  imports: [
    ModalComponent, ModalHeaderComponent, ModalContentComponent, ModalFooterComponent,
    InputSearchComponent, ButtonComponent, ButtonIconComponent, FunctionalNoticeComponent, TagComponent,
    FlyoutMenuComponent, FlyoutMenuItemComponent,
  ],
  templateUrl: './trans-excl-modal.component.html',
  styleUrl: './trans-excl-modal.component.scss',
})
export class TransExclModalComponent {
  open        = input<boolean>(false);
  codes       = input.required<StatusReasonCode[]>();
  countryName = input<string>('');
  save   = output<StatusReasonCode[]>();
  closed = output<void>();

  local  = signal<StatusReasonCode[]>([]);
  search = signal('');

  constructor() {
    effect(() => { if (this.open()) { this.local.set(this.codes().map(c => ({ ...c }))); this.search.set(''); } });
  }

  isEmpty = computed(() => this.local().length === 0);

  candidates = computed(() => {
    const have = new Set(this.local().map(c => c.code));
    const q = this.search().trim().toLowerCase();
    return STATUS_REASON_REFERENTIAL
      .filter(c => !have.has(c.code))
      .filter(c => !q || c.code.toLowerCase().includes(q) || c.label.toLowerCase().includes(q));
  });

  add(c: StatusReasonCode): void { this.local.update(l => [...l, { ...c }]); this.search.set(''); }
  removeCode(code: string): void { this.local.update(l => l.filter(c => c.code !== code)); }
  onSave(): void { this.save.emit(this.local()); }   // empty list allowed
}
```

- [ ] **Step 2: Write the template**

```html
@if (open()) {
  <ds-modal (backdrop)="closed.emit()">
    <ds-modal-header title="Edit TRANS-NA-EXCL" (close)="closed.emit()" />
    <ds-modal-content>
      <p class="te-intro">
        Status reason codes excluded from TRANS-NA calculation for <strong>{{ countryName() }}</strong>.
        Changes follow the DRAFT/VALIDATED lifecycle. <ds-tag label="Draft" type="static" />
      </p>

      <h4 class="te-section">Current codes</h4>
      @if (isEmpty()) {
        <ds-functional-notice status="info" message="No codes configured — saving will allow all status reason codes." />
      } @else {
        <div class="te-list">
          @for (c of local(); track c.code) {
            <div class="te-code">
              <span class="te-key">{{ c.code }}</span>
              <span class="te-desc">{{ c.label }}</span>
              <ds-button-icon icon="close" ariaLabel="Remove code" (clicked)="removeCode(c.code)" />
            </div>
          }
        </div>
      }

      <h4 class="te-section">Add codes</h4>
      <ds-input-search [value]="search()" (valueChange)="search.set($event)" placeholder="Search codes…" />
      @if (search()) {
        <ds-flyout-menu>
          @for (c of candidates(); track c.code) {
            <ds-flyout-menu-item [label]="c.code + ' — ' + c.label" (selected)="add(c)" />
          }
          @if (candidates().length === 0) {
            <ds-flyout-menu-item label="No matching codes" [disabled]="true" />
          }
        </ds-flyout-menu>
      }
    </ds-modal-content>
    <ds-modal-footer>
      <ds-button type="tertiary" label="Cancel" (clicked)="closed.emit()" />
      <ds-button type="primary" label="Save" (clicked)="onSave()" />
    </ds-modal-footer>
  </ds-modal>
}
```

> Note: match `ds-input-search`, `ds-tag`, `ds-functional-notice`, `ds-flyout-menu*` APIs. Confirm `close` icon name in the registry.

- [ ] **Step 3: Write the SCSS (tokens only)**

```scss
.te-intro { font-size: var(--foundation-font-size-12, 12px); color: var(--semantic-color-static-text-main-tertiary); margin-bottom: var(--semantic-measurement-spacing-m); display: flex; align-items: center; gap: var(--semantic-measurement-spacing-xs); flex-wrap: wrap; }
.te-section { font-size: var(--foundation-font-size-11, 11px); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; color: var(--semantic-color-static-text-main-tertiary); margin: var(--semantic-measurement-spacing-m) 0 var(--semantic-measurement-spacing-s); }
.te-list { display: flex; flex-direction: column; border: 1px solid var(--semantic-color-static-border-main-tertiary); border-radius: var(--semantic-border-radius-s); overflow: hidden; }
.te-code { display: flex; align-items: center; gap: var(--semantic-measurement-spacing-s); padding: var(--semantic-measurement-spacing-xs) var(--semantic-measurement-spacing-s); border-bottom: 1px solid var(--semantic-color-static-border-subtle-tertiary); }
.te-code:last-child { border-bottom: none; }
.te-key { font-weight: 700; color: var(--semantic-color-interactive-text-strong-default); min-width: 56px; }
.te-desc { flex: 1; color: var(--semantic-color-static-text-main-secondary); font-size: var(--foundation-font-size-12, 12px); }
```

- [ ] **Step 4: Wire into the page**

In `tag-configuration.component.ts`: add `exclusionCodes = signal(codesForCountry('FR'));` (import `codesForCountry`), set in `onCountryChange`, replace stub `transExclOpen`, add:

```ts
onCodesSave(codes: StatusReasonCode[]): void {
  this.exclusionCodes.set(codes);
  this.transExclOpen.set(false);
  this.toaster.show?.({ message: 'Exclusion list saved (draft)' });
}
```

Add `TransExclModalComponent` to imports; host in template:

```html
<tag-trans-excl-modal
  [open]="transExclOpen()" [codes]="exclusionCodes()" [countryName]="currentCountry().name"
  (save)="onCodesSave($event)" (closed)="transExclOpen.set(false)" />
```

- [ ] **Step 5: Build + visual check**

Run: `npm run build` (success), `npm start`.
Expected: "Edit TRANS-NA-EXCL" opens; France shows 5 codes read-only with remove buttons; searching filters the referential; adding/removing works; removing all shows the info notice; Save allowed on empty list + toast. Northern Europe starts empty (info notice).

- [ ] **Step 6: Commit**

```bash
git add src/app/pages/tag-configuration/components/trans-excl-modal.component.* src/app/pages/tag-configuration/tag-configuration.component.*
git commit -m "feat: TRANS-NA-EXCL modal — read-only codes + search-add, empty allowed"
```

---

### Task 10: Final integration pass + acceptance sweep

**Files:**
- Modify: any of the above as needed for polish.

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: success, zero errors/warnings referencing tag-configuration.

- [ ] **Step 2: Acceptance sweep (visual, `npm start`)**

Walk each BN acceptance criterion and confirm on the running app:
- P1: card = 14 criteria in 4 groups with headers; Any muted; Other collapsed when all Any; modal labels corrected (Company role / Value / Freshness / Type; no "Type Valid grade"); modal has all 14 fields + Transferred/New AG vs CVG/Last AG Freshness/New AG vs Last AG.
- P2: freshness modal 2 thresholds/type; rows Last checked autograde / Valid manual grade; current read-only; validation oldAfter ≥ freshUpTo.
- P3: toolbar button; read-only current codes; search add/remove; empty save allowed; draft copy.
- P4: chips bar visible when rules exist; 5 chips; each multi-select with "Any" selectable; AND across chips; active chip distinct + count.

- [ ] **Step 3: Grep for hardcoded values / native tags (composition + token compliance)**

Run: `grep -rn "#[0-9a-fA-F]\{3,6\}\|px)\|<button\|<input\|<select\|<svg\|style=\"" src/app/pages/tag-configuration --include=*.html --include=*.scss --include=*.ts`
Expected: no raw hex colours, no stray `px` outside token fallbacks, no native form/interactive tags (except inside DS atoms, which live elsewhere), no inline `style=""`. Fix any hit.

- [ ] **Step 4: Update the CLAUDE.md TAG reference & memory if a structural decision changed**

If any structural decision diverged from the spec during implementation, note it. (Optional; skip if faithful.)

- [ ] **Step 5: Final commit**

```bash
git add -A src/app/pages/tag-configuration
git commit -m "chore: TAG v2 integration pass — acceptance sweep, token/composition cleanup"
```

---

## Self-Review Notes

- **Spec coverage:** P1 (Tasks 5, 7) · P2 (Task 8) · P3 (Task 9) · P4 (Tasks 4, 6). Model/data (Tasks 2, 3). Page shell/filtering/delete (Task 6). Deletion of old code (Task 1). Integration (Task 10). All spec sections mapped.
- **Type consistency:** `RuleCriteria`/`TagRule`/`FreshnessConfig`/`StatusReasonCode` defined in Task 2, consumed with identical field names in Tasks 3, 5, 7, 8, 9. `FilterKey`/`FILTER_KEYS` defined Task 2, used Task 6. Formatters in `criteria-format.ts` (Task 5) used only by rule-card.
- **Known adaptation:** every DS atom binding (input/output names) is a best-guess to be confirmed against the real component TS before wiring — flagged in each task's Step-1 note. This is the single biggest execution risk; the implementer must read the atom before binding, not after.
- **No test runner:** verification is `npm run build` + visual check, per Global Constraints. This is deliberate, not a placeholder.
