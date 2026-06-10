# Product

## Register

product

## Users

Two B2B populations inside Allianz Trade, both expert and data-fluent:

- **Credit analysts** — search companies, inspect risk / grade / exposure, read dense buyer dossiers. Their context is high-volume, time-pressured triage where scanning speed and information density matter.
- **Country admins / configurators** — set up and maintain the automation rules (Task After Grading: per-country rule sets, freshness thresholds, status-exclusion lists). Their job is correctness and auditability, not speed: a misconfigured rule mis-grades real companies.

Most screens serve both: consultation (read a dossier, browse results) and configuration (shape the rules that drive auto-grading). The UI must stay legible under data density for analysts while staying unambiguous and reversible for admins.

## Product Purpose

Qirin is the credit-assessment workspace for Allianz Trade. It lets analysts find and evaluate buyers, and lets country admins configure the conditional logic (TAG rules) that decides whether a company is auto-accepted, refused, or sent to manual review. Success = decisions made faster and more consistently, with configuration that a non-developer admin can read, trust, and change without fear of breaking production grading.

## Brand Personality

Sober, reliable, dense. The voice of a serious financial tool: it earns confidence through rigor and clarity, not decoration. Three words: **trustworthy, precise, efficient.** Information density is a feature, not a flaw, but density never means clutter — hierarchy and whitespace do the heavy lifting so a dense screen still scans in one pass. Modern where it helps (clean spacing, crisp hierarchy, restrained micro-interactions), never flashy.

## Anti-references

- **Generic AI SaaS** — cream/sand body backgrounds, decorative gradients, gradient text, the hero-metric template, endless identical card grids, an uppercase tracked eyebrow above every section. None of it.
- **Visual overload** — glassmorphism, heavy shadows, non-functional bright colors, gratuitous animation. Every visual choice must serve reading or action.
- **Austere unreadable spreadsheets** — the opposite failure: gray-on-gray dense grids with no hierarchy, everything the same size, zero breathing room. Density without hierarchy is just noise.
- **Consumer / playful** — pastels, mascot illustrations, casual tone, emoji. This is a professional B2B credit tool.

## Design Principles

- **Density with hierarchy.** Show a lot, but make it scannable: scale, weight, and whitespace separate the signal from the supporting detail. A full screen should still read in one pass.
- **One view, one job.** Each page/tab serves a single objective; secondary actions live in modals or drawers, not crammed into the primary surface.
- **Status is never color-only.** Grades, decisions, and risk always carry a label or icon alongside their color, so meaning survives color-blindness and grayscale.
- **Configuration must be legible and reversible.** A country admin reads what a rule does at a glance and changes it without fear; nothing critical is hidden or one-click-irreversible.
- **Tokens are the source of truth.** Every color, space, and size flows from the Figma-backed token system (Foundation → Semantic). No hardcoded values, no one-off styles — consistency cascades from the design system.

## Accessibility & Inclusion

WCAG 2.1 AA. Body text ≥4.5:1 contrast, large text ≥3:1; visible focus states; full keyboard navigation; correct ARIA roles on interactive components. Reduced-motion alternatives for any animation. Status meaning never encoded by color alone (always paired with a label or icon), which also serves color-blind users.
