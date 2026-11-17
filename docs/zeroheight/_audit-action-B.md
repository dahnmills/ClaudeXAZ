# Audit Action B : link, crumb, breadcrumb, chip, tag

Method: markdown page vs code (.ts/.html/.scss), stories, components.json. Tokens: every `--semantic-*` / `--foundation-*` named in the 5 pages exists in `_tokens.scss` / `_semantic.scss`. No em dash. Story ids valid. Used-by lists match the code.

## Link
OK. (Story `Default` omits `weight` and `external`; no doc impact.)

## Crumb
Corrected:
- `clicked` is not emitted when `disabled` (code: `if (!disabled()) emit`); doc said "Emitted on click".

To decide:
- Disabled crumb is dimmed twice: `.ds-crumb--disabled` host opacity 0.40 AND `ds-link` disabled opacity 0.40 (about 0.16 rendered). Fix in SCSS or accept.
- Code comment in `crumb.component.scss` cites Figma node 1709:14619; doc and components.json use 705:4485. Confirm the right node.

## Breadcrumb
To decide:
- Template puts the `actions` div BEFORE the trail in the DOM (visual order set by CSS `order`). Tab and screen-reader order reads actions before the trail. Doc does not mention it.
- `aria-label="Breadcrumb"` is fixed (not an input), not localizable. No `<ol>` list semantics. Doc states the current behavior correctly.

## Chip
Corrected:
- `selected` note: the blue style applies for any `type`, but `aria-pressed` only for `select`.

To decide:
- Static chip still carries `role="button"` (no tabindex, no action): misleading for assistive tech. Doc reports it as is. Suggest role only when interactive.
- `.ds-chip__close` uses a raw "×" and `font-size: 16px` (hard-coded, known in components.json commentary).
- SCSS header comment says "Tag = status badge": wrong (Badge is the status atom). Code comment only.

## Tag
OK. Doc matches code (type default `select`, outputs `toggled`/`removed`, 3px focus ring, tokens). Figma default Filter vs code select is already documented.

## components.json
Entries consistent with the pages (nodes, selectors, storybook slugs, usedBy). Tag `usedBy: 0` counts pages only; the doc lists consuming components (correct).
