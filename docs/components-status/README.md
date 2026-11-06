# Component Status: single source of truth

`components.json` lists every component of the Qirin design system (library components and the
local components of the Figma feature files) with its availability in Figma, in code (vibecoded),
in Storybook and in ZeroHeight. A dashboard reads only this file.

## Refresh

From the repo root:

```
node docs/components-status/scripts/extract-code.js      # scans shared/ui, stories, pages, git log
node docs/components-status/scripts/build-components.js   # writes components.json
```

The record table (names, categories, levels, comments, Figma keys) lives in `build-components.js`.
Figma node ids and variant axes are read from `docs/zeroheight/**` (the `Figma:` line and the
"Variants and properties" table); component keys come from `docs/figma/qirin-figma-inventory.md`,
`PLAYBOOK.md` and `STATUS.md`. When a component is added or renamed, add one `add(...)` line.
Update the `ZH_PAGES` table when a ZeroHeight page is created or published.

## Top-level keys

`schemaVersion`, `generatedAt`, `storybookBaseUrl`, `zeroheight`, `figmaFiles`, `summary`,
`components` (array), `mismatches` (array, last).

## Component record

| Field | Meaning |
|-------|---------|
| `id`, `name`, `selector` | kebab slug, display name (Figma name when it differs from code), `ds-*` selector (null if Figma-only or local; `[dsFocusTrap]` is a directive) |
| `category` | `action`, `data-entry`, `data-display`, `feedback`, `layout`, `navigation`, `overlay`, `local`, `other`. Aligned with the Figma library where a Figma component exists; `navigation`, `overlay`, `other` are used for code-only components (Stepper, Spotlight, Icon, Divider...) |
| `figmaLibrary` | Figma library file the component belongs to (`action`, `data-display`, `data-entry`, `feedback`, `layout`), null if none |
| `level` | `atom`, `molecule`, `organism`, `template` (locals: page shells are `template`) |
| `description` | One English sentence (taken from the ZeroHeight page when it exists) |
| `availability` | `design` (a Figma component or key exists), `vibecoded` (code in `main`), `dev` (always false for now) |
| `figma` | `fileKey`, `nodeId` (`a:b`), `componentKey`, `url` (`https://www.figma.com/design/<fileKey>?node-id=a-b`). Null when unknown. The Layout library file key is not available, so Layout components have a `componentKey` but no `url` |
| `storybook` | `vibecodedUrl` = `https://dahnmills.github.io/ClaudeXAZ/storybook/?path=/docs/<id>--docs`, where `<id>` is the story `title` lowercased with every run of non `[a-z0-9]` replaced by `-` (same rule as `storybookSlug` in `design-system-audit.data.ts`). Stories without the `autodocs` tag (Drawer, Inline Edit) link to `/story/<id>--<first-story>`. `devUrl` is null and `devStatus` is `planned` |
| `zeroheight` | `pageId`, `url`, `status`, `markdown`. Only Button (page 9166118, uid 20fe33, `hidden`) and five hidden stubs (Link, Button Icon, Button Split, Segmented Control, Tag: ids known, uid unknown so `url` is null) exist in ZeroHeight. Every other page is `status: "drafted"` with the Markdown path in `markdown` |
| `version` | `1.0.0` when the component folder was created at least 30 days before `generatedAt` and `state` is not `draft`; otherwise `0.N.0` where N is the number of commits touching the folder (min 1, max 9); `0.1.0` when there is no code. Locals are `1.0.0` (Figma v1.0 Ready for dev) |
| `state` | `ready` = code + story + Figma + doc; `in-review` = code + story with Figma or doc missing; `draft` = anything less. `deprecated` is reserved (nothing is deprecated yet). Locals are capped at `in-review` (no story or doc by design); a local with no code (Exposure Card) is `draft` |
| `lastChange` | `git log -1 --format=%cs` of the code folder (the page folder for locals, the Markdown for doc-only records) |
| `commentary` | One short status or caveat. Only deviations verified in the repo (token missing from `_semantic.scss`, input absent from the component, story or Figma facts from `docs/figma` and `docs/zeroheight`) |
| `variants`, `variantsSource` | Figma property names from the ZeroHeight table (`figma`), else the code `input()` names (`code`), else empty |
| `usedBy`, `usedByPages` | Number and names of `src/app/pages/*` folders that use the selector (`<ds-x`), the directive attribute, or the service (Toaster, Snackbar). The showcase pages `design-system-components`, `design-system-audit`, `grade-story` are excluded. Null for locals |
| `visual` | `figmaNodeId` and `fileKey` of the node to preview (same as `figma.nodeId`) |
| `codeFolder` | Folder of the implementation |

## Mismatches

`kind` values: `code-only` (selector without Figma component), `figma-only` (Figma without code selector),
`no-doc`, `no-story`, `name-differs` (Figma name vs selector), `story-section-differs`,
`docs-outdated`, `docs-only`, `figma-retired` (retired from the libraries but still in code),
`code-branch-only`.

## Caveats

- The ZeroHeight Markdown is a snapshot of 2026-11-04 (`docs/zeroheight/_audit.md`); the file flags where code moved since.
- Node ids come from the Markdown, not from a live Figma read.
- `usedBy` counts pages in the working tree of `main`, including uncommitted edits.
