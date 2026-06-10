---
target: TAG Configuration page
total_score: 30
p0_count: 2
p1_count: 2
timestamp: 2026-06-08T14-21-36Z
slug: src-app-pages-tag-configuration
---
# Critique #2 — TAG Configuration (post harden + polish)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Dirty badge + per-mutation toasts added. Badge still binary; country select implies per-country state that doesn't exist. |
| 2 | Match System / Real World | 4 | Domain language excellent and accurate. |
| 3 | User Control and Freedom | 3 | Delete now confirm + 8s undo (great). But no dirty-discard guard on rule modal (Cancel/Escape/backdrop loses edits). |
| 4 | Consistency and Standards | 3 | Strong tokens. Dual reposition model (inline input + menu); Settings h3 vs modal Label-role titles. |
| 5 | Error Prevention | 2 | Exposure/freshness validated. But criteria are free-text comma fields, no value validation; Transferred wiped on edit. |
| 6 | Recognition Rather Than Recall | 3 | Chips/expand strong. Modal makes admin recall sensitivity/grade/NACE codes from memory. |
| 7 | Flexibility and Efficiency | 3 | Expand-all, duplicate, inline reposition solid. No bulk ops, 14-field single scroll. |
| 8 | Aesthetic and Minimalist Design | 4 | Genuinely clean, flat-at-rest, compact 14px, density without clutter. |
| 9 | Error Recovery | 3 | Inline errors on exposure/freshness/dup-code clear. Text criteria have no error states. |
| 10 | Help and Documentation | 2 | Good inline help. No criteria-meaning help at entry, no link to grading model. |
| **Total** | | **30/40** | **Good, with safety gaps** (was 23/40) |

## Anti-Patterns Verdict
Passes the product slop test — a Linear/Stripe/Notion-fluent user trusts it on read. No hero-metric, no cream bg, no gradient, no eyebrow scaffolding. Detector: clean (0 findings). Residual smell: freshness color-fill state tiles edge toward functional-color-as-decoration (defensible as legend). Both prior P0s closed.

## Priority Issues (remaining)
- **[P0] "Transferred" criterion silently destroyed on edit.** rule-row renders Transferred Yes/No but rule-modal buildCriteria hardcodes validTransferred:null with no field. Editing any rule using it wipes the constraint. Fix: add Transferred ds-select to "Current valid grade" section, or remove from model+card. → harden
- **[P0] Country select implies per-country state that doesn't exist.** rules/freshness/exclusions/history are single global signals; switching country only changes label text, doesn't reset dirty. Fix: key data by country + reload + dirty-guard, OR demote to read-only label. → clarify
- **[P1] No dirty-discard guard on rule modal.** Cancel/Escape/backdrop discards 14-field edit silently. Fix: modal-local dirty flag + "Discard changes?" confirm. → harden
- **[P1] Structured criteria are validation-free free text.** Typos parse into never-matching rules. Fix: enum criteria (sensitivity/autograde/type) become multi-select; open codes get format validation. → clarify
- **[P2] Save is opaque and irreversible.** No change summary, no undo (unlike delete). Fix: confirm with change summary; restore-from-History as true undo. → onboard/clarify
- **[P3] Freshness state tiles read decorative.** Soften full color-fills to bordered tints. → quieter

## Cognitive Load
2 hard + 3 warnings of 8. >4-option point: rule modal = 14 criteria in one scroll (the editor didn't inherit the collapsed card's discipline). Decision picker (4) is at boundary, OK.

## Persona Red Flags
- Alex (power): 14-field scroll, no bulk/shortcut, inline reposition lacks discoverability cue.
- Sam (a11y): radiogroup/radio + aria-checked + reduced-motion present (strong); verify radio accessible-name comes from badge label; confirm modal focus-trap; check tint contrast.
- Country admin (fears breaking grading): Transferred-wipe + fake country switch are worst-case; save blind/irreversible. Delete now genuinely safe.

## Strengths
1. Delete-to-undo arc is textbook (confirm danger → soft-delete → 8s undo restoring snapshot).
2. Density-with-hierarchy is real (collapsed chips → expand → show-N-unused).
3. Domain fidelity + full token discipline + reduced-motion guards.
