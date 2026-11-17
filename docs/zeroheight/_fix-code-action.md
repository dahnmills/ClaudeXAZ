# Correctifs code Action (a11y non cassants)

Pas de commit, pas de push. Aucune API publique retiree ou modifiee (seul ajout : input optionnel `ariaLabel` sur `ds-breadcrumbs`).

## Fait
1. tab: le `(click)` appelait `selected.set` (inexistant sur un input signal) ; il emet maintenant `clicked` sauf si disabled.
2. button-split: `aria-haspopup="menu"` et `aria-expanded` sur le chevron.
3. breadcrumbs: ordre DOM fil puis actions (l'ordre visuel est conserve, `order` retire du SCSS) ; `aria-label` "Breadcrumb" par defaut, surchargeable via `ariaLabel`.
4. pagination: `:focus-visible` (token `interactive-border-focus`), `aria-label="Page N"` sur les pages (`aria-current` existait deja).
5. stepper: etapes navigables en `role="button"` + `tabindex=0` + Enter/Espace, `aria-current="step"` sur l'etape courante, anneau de focus ; rendu inchange.
6. chip: `role=button` seulement si filter/select ; "×" remplace par `ds-icon close` 16 ; `font-size: 16px` supprime ; commentaire SCSS corrige.
7. crumb: commentaire de node corrige (705:4485).
8. Tokens inexistants: button-range `spacing-2xs` devient `spacing-xxs` (2px) ; visual-button `static-background-subtle-informative` devient `static-background-subtle-functional-informative` (blue-b-050).
9. stepper "Completed": `static-text-main-functional-positive` (meme vert, green-500).
Docs mises a jour : action/{tab,button-split,breadcrumb,pagination,stepper,chip,crumb,button-range,visual-button}.md et commentaires de components.json.

## Differe
- crumb: double attenuation disabled (0.40 x 0.40) conservee : la corriger changerait le rendu (lien et chevron); a decider visuellement.
- breadcrumbs: `<ol>/<li>` non fait : les `ds-crumb` sont projetes par le consommateur, il faudrait changer l'API ou le rendu.
- button-range: le padding horizontal etait invalide (donc 0) ; il vaut maintenant 2px, effet negligeable (contenu centre dans largeur fixe), a verifier visuellement.
- Pas de tests unitaires existants pour ces composants.

## Build
`npx ng build` : OK (avertissements preexistants : budget initial 1.91 Mo vs 1.50 Mo, budgets SCSS buyer-summary et card-builder-lab, html2canvas non ESM).
