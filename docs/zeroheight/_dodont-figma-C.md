# Do / Don't Figma illustrations, lot C

Library [Components] Action (xCeEJPn6fliEshuE9fnrqs). Additive only, real component instances, fills and gaps bound to existing Semantic variables. Frames are 760x140 (Segmented Control), 520x160 (Tab), 760x200 or 760x340 (Pagination) on a Secondary background, in a white section placed 560 px right of the existing content.

## Segmented Control (page 302:2), section `ZeroHeight · Segmented Control illustrations` 944:4474
| ZH rule | Frame (nodeId) |
|---|---|
| Number of segments, Do | `do · segmented control · few short labels` 944:4475 |
| Number of segments, Don't | `dont · segmented control · long labels` 944:4501 |
| Disabled options, Do | `do · segmented control · disabled explained` 944:4535 |
| Disabled options, Don't | `dont · segmented control · disabled unexplained` 944:4562 |
Skipped: Role (radio vs tabs mode, Do/Don't). The mode is a code and a11y difference with no visual in Figma.

## Tab (page 56:228), section `ZeroHeight · Tab illustrations` 944:4797
| ZH rule | Frame (nodeId) |
|---|---|
| Purpose, Do | `do · tab · peer views` 944:4798 |
| Purpose, Don't | `dont · tab · step by step flow` 944:4848 |
| Width, Do | `do · tab · one line` 944:4898 |
| Width, Don't | `dont · tab · wrapping bar` 944:4964 |
| Counter, Do | `do · tab · counter on actionable view` 944:5078 |
| Counter, Don't | `dont · tab · counter on every tab` 944:5128 |
Note: the counter badge overlaps the next tab label at the default gap, so those two bars use Spacing/L.

## Pagination (page 52:779), section `ZeroHeight · Pagination illustrations` 944:5703
| ZH rule | Frame (nodeId) |
|---|---|
| Stable page size, Do | `do · pagination · stable page size` 944:5838 |
| Stable page size, Don't | `dont · pagination · changing page size` 944:5931 |
| Under the list, Do | `do · pagination · under the list` 944:6030 |
| Under the list, Don't | `dont · pagination · far from the list` 944:6129 |
Note: the list rows are plain frames and text bound to variables (the Action library has no list component). The page size frames use a short caption to carry the rule.

## Stepper (page 312:1332), nothing created
No Figma component exists (the WIP page holds only Frame 1, no component set), so no real instance is possible. Skipped rules:
- Completed steps, Do: keep completed steps clickable.
- Completed steps, Don't: lock the user out of a finished step.
- Errors, Do: show error on the step that holds the problem.
- Errors, Don't: flag only the last step.
To do once the Stepper component is built in Figma.
