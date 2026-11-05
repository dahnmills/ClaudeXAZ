# Stepper
**Status**: Design WIP · Tech In code
A vertical list of the steps of a flow that shows where the user is, what is done and what is blocked.
Figma: [Components] Action › page "↪ Stepper 🔴" under WIP (frame `Frame 1`, node 312:1333; no component set yet) · Storybook: `Design System/Navigation/Stepper` (id `design-system-navigation-stepper--default`) · Code: `shared/ui/stepper` (`ds-stepper`)

## Overview
Stepper guides the user through a wizard (company creation, company edit). Each step shows a marker, "Step N/M", its label and a status (completed, current, error, warning). The Figma page is still a work in progress (Status page: "In progress", version 1.0.0) and holds no published component, so this page documents the code. Embed the Storybook story `Default` as the live example.

## When to use / When not to use
- Use for a flow of three to seven steps that the user completes in order.
- Use when the user may go back to a completed step.
- Use error and warning statuses to point to the step that needs attention.
- Don't use for views the user can open in any order → use Tab instead.
- Don't use for the position of a page in the site → use Breadcrumb instead.
- Don't use for a progress value without steps → use Progress Bar instead.

## Anatomy
1. Step row: marker on the left, text on the right; a 1px vertical connector joins the markers.
2. Marker (24px circle): empty ring (upcoming), light blue ring (unlocked), blue ring with a dot (current), filled blue with a check (completed), red error icon or orange warning icon.
3. Index: "Step N/M", 12px, Grey/500.
4. Label: 14px semi-bold, Grey/900.
5. Status text: "Completed", "Error" or "Warning".

## Variants and properties
| Figma property | Type | Values (default in bold) | Code input | Notes |
|---|---|---|---|---|
| To be defined | | | `steps: { label: string }[]` (required) | No Figma component yet. |
| | | | `current: number` (default `0`) | 0-based index of the current step. |
| | | | `completedSteps: number[]` (default `[]`) | Stay completed after going back. |
| | | | `errorSteps: number[]`, `warningSteps: number[]` | Error wins over warning, which wins over the rest. |
| | | | `navigableUpTo: number` (default `-1`) | Highest step index the user reached; steps up to it are clickable. |
| | | | `stepChange` (output, `number`) | Emitted when the user clicks a navigable step. |

Status values computed per step: `completed`, `current`, `current-completed`, `unlocked`, `upcoming`, `error`, `warning`.

Slots: none.

Exposed nested instances: To be defined.

## States
| State | How it is triggered in code (pseudo-class or input) | Figma |
|---|---|---|
| Upcoming | index after `current` and after `navigableUpTo` | To be defined |
| Unlocked | index up to `navigableUpTo`, not completed, not current | To be defined |
| Current | `current` | To be defined |
| Completed / Current completed | `completedSteps` | To be defined |
| Error | `errorSteps` | To be defined |
| Warning | `warningSteps` | To be defined |
| Clickable | any navigable step (class `--clickable`) | To be defined |

## Tokens
| Element | Property | Semantic token (CSS var) | Foundation alias |
|---|---|---|---|
| List, row | gap | `--semantic-measurement-spacing-s` | `--foundation-spacing-8` |
| Connector, upcoming ring | color | `--semantic-color-static-border-subtle-tertiary` | `--foundation-color-grey-200` |
| Unlocked ring | color | `--semantic-color-interactive-background-medium-default` | `--foundation-color-blue-a-200` |
| Current ring, dot, completed fill | color | `--semantic-color-interactive-background-strong-default` | `--foundation-color-blue-a-500` |
| Completed check | color | `--semantic-color-static-text-main-reversed` | `--foundation-color-white-1000` |
| Halo around markers | color | `--semantic-color-static-background-main-primary` | `--foundation-color-white-1000` |
| Error icon, halo | color | `--semantic-color-static-icon-main-functional-negative`, `--semantic-color-static-border-main-functional-negative` | `--foundation-color-red-500` |
| Warning icon, halo | color | `--semantic-color-static-icon-main-functional-warning`, `--semantic-color-static-border-main-functional-warning` | `--foundation-color-orange-400` |
| Status text error / warning | color | `--semantic-color-static-text-main-functional-negative` / `-warning` | `--foundation-color-red-500` / `--foundation-color-orange-400` |
| Text | font-family | `--semantic-font-family` | `--foundation-font-family` |
| Index | size, color | `--semantic-font-text-style-size-s`, `--semantic-color-static-text-main-tertiary` | `--foundation-font-size-12`, `--foundation-color-grey-500` |
| Label | size, weight, color | `--semantic-font-text-style-size-m`, `--semantic-font-text-style-font-weight-semi-bold`, `--semantic-color-static-text-main-primary` | `--foundation-font-size-14`, `--foundation-font-weight-semi-bold`, `--foundation-color-grey-900` |

Values written outside tokens in the SCSS: row min-height 56px (70px with connector), connector width 1px and offsets (11px, 28px), marker 24 x 24px, ring 2px, dot 8 x 8px, halo 2px and 4px, line-heights 16px and 24px.

## Accessibility
- Steps are `div` elements with a click handler: they have no role, no tab stop and no keyboard activation. Keyboard users cannot move between steps from the stepper; the wizard's Back and Next buttons must cover it.
- The status is given in text ("Completed", "Error", "Warning") next to the icon, so it does not rely on color.
- The current step is not marked with `aria-current`; add it if the stepper becomes navigable by keyboard.

## Content guidelines
- Labels name the step's content with a noun or a short phrase ("Company identity", "Addresses").
- Keep labels on one line.
- Sentence case, no em dash.

## Do / Don't
- Do keep completed steps clickable so users can review them; don't lock the user out of a step they finished.
- Do show error on the step that holds the problem; don't flag only the last step.

## Related components
Composes: Icon (`ds-icon`) · Used by: Company Creation Wizard and Company Edit Wizard (app pages), no other DS component.

## Changelog
| Version | Date | Change |
|---|---|---|
| 1.0.0 | date unknown | Listed as "In progress" on the Status page of the Action file. No Versionning frame on the WIP page. |
