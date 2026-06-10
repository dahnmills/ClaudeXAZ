---
target: TAG Configuration page
total_score: 23
p0_count: 2
p1_count: 2
timestamp: 2026-06-08T13-39-29Z
slug: src-app-pages-tag-configuration
---
# Critique — TAG Configuration

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No save confirmation/toast; "Draft" badge is static, never reflects unsaved/saved state. |
| 2 | Match System / Real World | 3 | Strong domain language; criteria codes (05-10, S2,S3) lack a legend. |
| 3 | User Control and Freedom | 1 | Delete fires instantly from flyout, no confirm, no undo; reorder/duplicate silent. |
| 4 | Consistency and Standards | 3 | Good DS reuse; position-reorder affordance contradicts implementation. |
| 5 | Error Prevention | 1 | No validation; freshness fresh>old unguarded; empty catch-all rule allowed. |
| 6 | Recognition Rather Than Recall | 3 | Collapsed summary chips are excellent; code abbreviations need recall. |
| 7 | Flexibility and Efficiency | 2 | Expand-all good; reorder is O(n) menu clicks, no drag, no keyboard, no bulk. |
| 8 | Aesthetic and Minimalist Design | 4 | Standout: dense but clean, flat-at-rest, one blue. On-brief. |
| 9 | Error Recovery | 1 | No error states at all; exclusion Add silently no-ops. |
| 10 | Help and Documentation | 3 | Good inline scaffolding (intro line, accordion notes, freshness legend). |
| **Total** | | **23/40** | **Acceptable-low — static design ~30 dragged down by inert/unsafe write surface** |

## Anti-Patterns Verdict
Static composition does NOT read as AI slop (no hero-metric, no cream gradient, ~95% token discipline). Detector scan: clean (`[]`, 0 findings). The slop tell is behavioral: the 3 modals are Potemkin forms — rule modal discards all criteria on save (emits EMPTY_CRITERIA), freshness/exclusion use one-way [value] so edits never persist, exclusion Add silently no-ops. Survives a screenshot, fails a click-through.

## Priority Issues
- **[P0] Modals don't persist data.** Core job silently fails. Fix: two-way [(value)], build criteria from signals, parent inserts/replaces rule + confirmation + validation. → harden
- **[P0] Destructive actions irreversible, no confirm.** deleteRule fires from flyout, no dialog/undo. Persona explicitly fears breaking production grading. Fix: ds-confirm-dialog on delete + snackbar undo. → harden
- **[P1] No system-status feedback.** Dead "Draft" badge, no save/delete/reorder acknowledgement. Fix: wire dirty/saved state, snackbar on actions. → clarify
- **[P1] Position reorder affordance contradicts itself.** Hint says "change a position to reorder" but number is static span; reorder only via 3-dot menu. Fix: editable position or drag handles, align hint. → clarify/layout
- **[P2] Decision picker not accessible.** Raw buttons wrapping badges, no radiogroup/arrow-nav. Fix: radio-card/segmented-control or radio semantics. → harden

## Cognitive Load
4 full + 2 partial failures of 8. Decision points >4 options: rule modal (4 decisions + 14 criteria in one scroll), 3-dot flyout (5 items mixing safe+destructive).

## Persona Red Flags
- Alex (power): menu-only reorder, no drag/keyboard/bulk, silent form drop loses trust, no dry-run.
- Sam (a11y): decision picker no radio semantics, silent Add failure unannounced, modal focus-trap unconfirmed.
- Country admin (fears breaking grading): one-click delete no undo, no diff vs active version, dead Draft badge, empty catch-all rule allowed at position 1.

## Strengths
1. Collapsed rule-card summary = genuine information compression (3 chips + decision, one line, scans in one pass).
2. System rules correctly framed as recessed read-only class (pre-checks / fallback accordions).
3. Decision semantics textbook status-never-color-only (label+color+variant).
