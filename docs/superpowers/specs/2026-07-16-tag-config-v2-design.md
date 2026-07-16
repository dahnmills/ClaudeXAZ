# TAG Configuration v2 — Design Spec

**Date:** 2026-07-16
**Status:** Approved for planning
**Scope:** Full rebuild of the TAG (Task After Grading) Configuration screen for the Qirin prototype.

---

## 1. Context & decision

The existing Angular implementation (`src/app/pages/tag-configuration/`) was built from **bad intermediate specs** (an internal memo + prior iteration that invented tabs, a Pipeline view, system rules, an audit History, a draft bar). Those specs are abandoned.

The **last good baseline is Figma v1** (file `p92Fy4x6m1ywDSD0hnrVoV`, section "Proto Demo" node `296:29193`): a single page = toolbar + a flat list of rule cards + a few modals. On top of that baseline we apply the **4 priorities of Business Need TAG v2** (`docs/TAG/BN-TAG-v2-business-need.txt`) to reach the "after" state visualised in `docs/TAG/bn-delta-visual.html`.

**Decision: delete the whole existing `tag-configuration/` folder and rebuild from scratch**, faithful to Figma v1 structure + the 4 BN priorities. No tabs, no Pipeline, no system rules, no History. Prototype target = interactive-realistic (real filtering, real modal editing on in-memory mock), lives in the `/review` + `/prototype` zones, reachable at route `tag-configuration`.

**Non-goals (out of scope, per BN):** filter persistence across sessions, filters on Other-group criteria, bulk edit, rule duplication across countries, real API wiring (mock only).

---

## 2. Screens & the 4 priorities

| Prio | What | Where |
|------|------|-------|
| P1 | Rule card criteria restructure (14 criteria in 4 domain groups, muted "Any", collapsible Other) + Create/Edit modal (grouped, 5 label renames + 1 removal, +4 new fields) | rule-card + rule-modal |
| P2 | Edit freshness modal → 3-state model (2 thresholds per grade type), rows = Last checked autograde / Valid manual grade, validation `oldAfter ≥ freshUpTo` | freshness-modal |
| P3 | New TRANS-NA-EXCL modal + new toolbar button | trans-excl-modal + toolbar |
| P4 | Static filter chips bar above the list (5 multi-select chips, AND logic, "Any" = explicit value) | tag-filter-chip + page |

---

## 3. Architecture

Delete `src/app/pages/tag-configuration/` entirely, recreate:

```
pages/tag-configuration/
├── tag-configuration.component.ts/.html/.scss   # page: toolbar + chips bar + list
├── tag-configuration.models.ts                  # types aligned to BN swagger
├── tag-configuration.data.ts                    # mock rules + freshness + codes + referentials
└── components/
    ├── rule-card.component.*          # one collapsible rule card, 4 criteria groups
    ├── tag-filter-chip.component.*    # NEW — multi-select chip + flyout
    ├── rule-modal.component.*         # Create/Edit rule (14 criteria, 4 groups + outcome)
    ├── freshness-modal.component.*    # 2 thresholds × 2 grade types + validation
    └── trans-excl-modal.component.*   # TRANS-NA-EXCL codes (read-only + search-add)
```

**Composition strictness (per CLAUDE.md):** every visual element uses DS atoms — no native `<button>/<input>/<select>/<svg>`, no restyled pill/box. Only ONE new component is justified: `tag-filter-chip` (a multi-select filter chip, absent from the DS). All colours/spacing/radii reference semantic tokens. No hardcoded values.

---

## 4. Data model (`tag-configuration.models.ts`)

Convention: **`null` = "Any"** (criterion inactive, does not participate in matching) everywhere.

```ts
type Sensitivity = 'S0'|'S1'|'S2'|'S2+'|'S3'|'SN'|'None';
type Grade       = '01'|'02'|'03'|'04'|'05'|'06'|'07'|'08'|'09'|'10'|'NA'|'noGrade';
type GradeType   = 'Automatic'|'Manual';
type Freshness   = 'Fresh'|'Outdated'|'Old';
type Comparison  = 'Upgrade'|'Same'|'Downgrade';   // ↑ / = / ↓
type Decision    = 'Accept'|'Refuse'|'CreateTask';
type RuleStatus  = 'Valid'|'NC';

interface RuleCriteria {
  // Group 1 — Core
  sensitivity:  Sensitivity[] | null;
  exposure:     { op: '>'|'<='; amount: number } | null;
  newAutoGrade: Grade[] | null;
  // Group 2 — Current valid grade (blue accent)
  cvgValue:     Grade[] | null;
  cvgType:      GradeType[] | null;
  cvgFreshness: Freshness | null;
  transferred:  boolean | null;               // Any / Yes / No
  newVsCvg:     Comparison | null;
  // Group 3 — Last checked autograde (orange accent)
  lastAgValue:     Grade[] | null;
  lastAgFreshness: Freshness | null;
  newVsLastAg:     Comparison | null;
  // Group 4 — Other (collapsible)
  nace:        string[] | null;
  legalForm:   string[] | null;
  companyRole: string[] | null;               // Insured/Prospect/Formerly insured/noRole
}

interface TagRule {
  id: string;
  position: number;
  decision: Decision;
  status: RuleStatus;
  criteria: RuleCriteria;
}

interface FreshnessConfig {
  lastCheckedAutograde: { freshUpToMonths: number; oldAfterMonths: number };
  validManualGrade:     { freshUpToMonths: number; oldAfterMonths: number };
}

interface StatusReasonCode { code: string; label: string; }   // TRANS-NA-EXCL entry
```

**Swagger field mapping** (BN §P1): `sensitivityCriteria`, `exposureCriteria`, `newAutoGradeValueCriteria`, `currentValidGradesValueCriteria`, `currentValidGradesTypeCriteria`, `currentValidGradeFreshnessCriteria`, `transferredValidManualGradeCriteria`, `newAutoGradeComparisonWithCVGCriteria`, `lastCheckedAutoGradeValueCriteria`, `lastCheckedAutogradeFreshnessCriteria`, `newAutoGradeComparisonWithLastAGCriteria`, `mainTradeSectorCriteria`, `legalFormCriteria`, `companyRoleCriteria`, outcome `ruleDecisionCode`. Freshness: `freshnessConfiguration.{lastCheckedAutograde|validManualGrade}.{freshUpToMonths|oldAfterMonths}`. Exclusion: `preliminaryRuleConfiguration.statusReasonCodes`.

**Decision → badge** (semantic, kept from prior — a correct call independent of the bad specs):
`Accept`→success/strong, `Refuse`→error/strong, `CreateTask`→warning/strong. Via `ds-badge`, never a custom pill.

**Country/currency:** mock several countries (France/EUR, Germany/EUR, Northern Europe, Portugal/EUR). Northern Europe seeded with ~67 rules to exercise P4 filtering. Currency label on Exposure derives from the selected country.

---

## 5. Page — `tag-configuration.component`

Wrapped in `app-topbox-test-shell`, `ds-page-header` (breadcrumb Home › TAG Configuration + title "Task After Grading Configuration"). 32px lateral padding, 16px gaps, semantic tokens (per existing page-authoring pattern).

**Toolbar** (row below header):
- Left: `ds-select` country picker · `ds-link` "Expand all" / "Collapse all" (toggles `expandedAll`).
- Right: `ds-button` secondary "Edit freshness" → freshness-modal · `ds-button` secondary "Edit TRANS-NA-EXCL" (NEW, P3) → trans-excl-modal · `ds-button-split` "Create rule" → rule-modal (create mode).

**Filter chips bar** (P4, between toolbar and list; visible only when a country is selected AND it has rules):
- 5 × `tag-filter-chip`: "Sensitivity", "New autograde", "CVG - Type", "CVG - Value", "CVG - Freshness".
- Each = multi-select; value list = the criterion's values **plus "Any" as an explicit selectable option**.
- Selecting "Any" filters to rules whose criterion is explicitly Any (NOT equivalent to no filter).
- Filters cumulative (AND across chips; OR within a chip's selected values).
- Active chip (≥1 selected) shows filled/selected state + count badge.
- A small result line: "N rules shown of M" + a "Clear filters" `ds-link` when any filter active.

**List:**
- `@for` over `filteredRules()` (tracked by id), renders `rule-card`.
- Empty state (illustration + "No rules have been set up for this country") when the selected country has 0 rules; a distinct "No rules match the active filters" state when filters exclude all.

**State (signals):**
```
country: signal<CountryCode>
rules: signal<TagRule[]>                       // mock, mutated by modals
freshness: signal<FreshnessConfig>
exclusionCodes: signal<StatusReasonCode[]>
filters: signal<Record<FilterKey, Set<string>>>   // 5 keys
expandedAll: signal<boolean>
filteredRules = computed(...)                  // country scope + AND chip logic
```
Modal open flags: `ruleModalOpen`, `freshnessModalOpen`, `transExclModalOpen`, plus `editingRule` for edit mode.

Mutations (create/edit/delete rule, save freshness, save codes) update the signals in memory and fire a `ToasterService` toast.

---

## 6. `rule-card.component`

Composes `ds-card`. Inputs: `rule`, `expanded` (or self-managed via `expandedAll` + local override), `currency`. Outputs: `edit`, `delete`, `moveUp`, `moveDown`, `positionChange`, `toggle`.

- **Header (clickable, role=button, toggles):** position number (discreet neutral chip) · active-criteria summary (label/value segments, wraps; Any omitted) · `ds-badge` decision · `ds-button-icon` ⋯ menu (Edit / Move up / Move down / Delete) · chevron. Position control + menu `stopPropagation`.
- **Body (expanded):** 4 groups via `ds-properties-panel` (variant flat), full width, each group its own section:
  1. "Sensitivity · Exposure · New autograde" — no accent.
  2. "Current valid grade" — **blue** accent header: Value / Type / Freshness / Transferred / New AG vs CVG.
  3. "Last checked autograde" — **orange** accent header (`--semantic-color-static-text-main-functional-warning`): Value / Freshness / New AG vs Last AG.
  4. "Other" — grey, **collapsible**; collapsed by default when NACE + Legal form + Company role are all Any (shows "▸ Other — all Any"). Expandable manually. State does not persist across sessions.
- **"Any" styling:** muted grey token text. Non-Any values: normal weight, tinted with the group accent.
- Value formatting: grade lists shown comma-joined (avoid the `-` join that implied a false range — a known prior defect); comparisons render ↑/=/↓ + word; exposure renders `> 500,000 EUR`.
- Delete → `ds-confirm-dialog` (danger) + undo toast (restores snapshot).

---

## 7. `tag-filter-chip.component` (NEW)

The single new DS-level molecule. Inputs: `label`, `options: {value,label}[]` (includes the explicit "Any"), `selected: Set<string>` (model). Output: `selectedChange`.

- Trigger = `ds-chip` (`type="select"`), label + count badge when `selected.size > 0`, `selected` state styling.
- Click → opens a `ds-flyout-menu` anchored to the chip.
- Flyout body = a `ds-checkbox` per option (multi-select). Footer: "Clear" `ds-link`.
- Emits the updated Set on every toggle. Closes on outside click / Escape.
- Fully keyboard accessible (chip focusable, flyout items reachable).

---

## 8. Modals

All use `ds-modal` + `ds-modal-header` / `ds-modal-content` / `ds-modal-footer`. All wired: seed from inputs via `effect(() => if (open()) …)`, parse on save, emit typed objects, dirty-guard via `ds-confirm-dialog` on close when changed.

### 8.1 rule-modal (Create / Edit)
- Title "Create a new rule" / "Edit rule". Same 4 groups as the card, same accents, same collapsible Other logic.
- Field controls:
  - Multi-select (`ds-checkbox` in a flyout, or an existing multi-select atom): Sensitivity, New autograde, CVG Value, CVG Type, Last AG Value, NACE (+search), Legal form (+search), Company role.
  - Single-select (`ds-select`): CVG Freshness, New AG vs CVG, Last AG Freshness, New AG vs Last AG, TAG Decision.
  - Exposure = composite: `ds-select` operator (`>` / `<=`) + `ds-input-text` amount + currency label from country.
  - Transferred = `ds-segmented-control` (Any / Yes / No).
- **Label corrections (BN P1.D):** "Buyer Role"→"Company role"; "Valide Grade"→"Value"; "Auto Grade Freshness"→"Freshness"; "Auto Grade"→"Value" (Last AG group); "Manual grade type"→"Type"; **remove** "Type Valid grade" (duplicate).
- **New fields (BN P1.E):** Transferred, New AG vs CVG, Last AG Freshness, New AG vs Last AG.
- Outcome "TAG Decision" always visible, separated by `ds-divider`.
- Validation: sensitivity/autograde value sanity + exposure amount required when op set; `canSave` gates. Save emits a full `TagRule`.

### 8.2 freshness-modal (P2)
- Title "Edit grade freshness thresholds".
- Table, 2 rows × 5 columns:
  - Col 1: grade type label — Row 1 "Last checked autograde", Row 2 "Valid manual grade (transferred or not)".
  - Col 2–3: Current Fresh up to / Old after — **read-only** (muted input style).
  - Col 4–5: New Fresh up to / New Old after — editable `ds-input-text` (months).
- Constraint `oldAfterMonths ≥ freshUpToMonths` per row; violation → `ds-functional-notice` (warning) inline "Old after (months) must be ≥ Fresh up to (months)"; Save disabled while violated.
- Save emits new `FreshnessConfig` (draft — no immediate production effect; conveyed in copy).

### 8.3 trans-excl-modal (P3, NEW)
- Title "Edit TRANS-NA-EXCL". Context subtitle: "Status reason codes excluded from TRANS-NA calculation for [country]. Changes follow the DRAFT/VALIDATED lifecycle." + `ds-tag` "Draft".
- "Current codes" section: read-only list, one row per code = code key (bold) + description + remove `ds-button-icon`. Uses `ds-properties-panel` or `ds-table-row` (DS list primitive), not raw rows.
- "Add codes" section: `ds-input-search` (placeholder "Search codes…") + multi-select results in a `ds-flyout-menu`. Referential mock stands in for `/riskinfo/v3/dataRef/tableTypes/COMPANY_STATUS_REASON/codes`.
- Empty list save explicitly allowed; when empty show `ds-functional-notice` (info) "No codes configured — saving will allow all status reason codes."
- Footer: Cancel (ghost) + Save (primary). Save emits `StatusReasonCode[]`.

---

## 9. Interactivity summary

- Country switch reloads rules/freshness/codes for that country; filters reset.
- Filter chips filter the list live (AND across chips, OR within chip).
- Cards expand/collapse individually + "Expand all"/"Collapse all".
- Modals open, seed, edit the in-memory mock, validate, and persist on save with a toast.
- Delete is guarded + undoable.

---

## 10. Tokens

All semantic. Blue accent (Current valid grade) = existing interactive/info blue tokens. Orange accent (Last checked autograde) = existing `--semantic-color-static-*-functional-warning` (orange) tokens. Muted "Any" text = existing subtle/tertiary text token. **No new tokens required.**

---

## 11. Wiring & cleanup

- Delete old folder; recreate per §3.
- Route `tag-configuration` (`app.routes.ts`) and the index-page link stay unchanged (same path, same `TagConfigurationComponent` class name).
- No changes to shared DS atoms except adding `tag-filter-chip` — which lives in the page's `components/`, NOT in `shared/ui/`, since it is TAG-specific (revisit promoting it to `shared/ui/` only if reused elsewhere).

---

## 12. Acceptance criteria (from BN)

P1: card columns = 14 criteria + outcome, grouped with headers; Any muted; Other collapsed when all Any; modal labels corrected (5 renames + 1 removal); modal has all 14 fields.
P2: 2 thresholds per grade type; rows Last checked autograde / Valid manual grade; current read-only; validation oldAfter ≥ freshUpTo.
P3: toolbar button visible; modal shows current codes read-only; multi-select+search add/remove; empty save allowed; draft lifecycle copy.
P4: chips bar visible when rules exist; 5 chips; each multi-select with "Any" selectable; AND logic; active chip distinct state.
