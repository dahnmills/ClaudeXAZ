# CLAUDE.md — Design System Angular 19

## Stack & conventions générales

- **Framework** : Angular 19, mode standalone obligatoire (pas de NgModule)
- **Styles** : SCSS — pas de Tailwind, pas de CSS-in-JS
- **Réactivité** : Signals Angular (`signal()`, `computed()`, `input()`, `output()`)
- **Syntaxe template** : blocs de contrôle `@if`, `@for`, `@switch` (jamais `*ngIf`/`*ngFor`)
- **Pas de valeurs en dur** : toute couleur, espacement, taille ou rayon doit référencer un CSS custom property issu des tokens Figma
- **Source de vérité** : les fichiers Figma (Tokens, Components, Layout) — jamais le code

---

## Structure de dossiers

```
src/
├── styles/
│   ├── _tokens.scss          # CSS custom properties Foundation (valeurs brutes)
│   ├── _semantic.scss        # CSS custom properties Semantic (aliases → Foundation)
│   ├── _typography.scss      # Mixins et classes typographiques
│   └── styles.scss           # Point d'entrée global (importe tout)
│
└── app/
    └── shared/
        └── ui/               # Tous les composants du design system
            ├── badge/
            │   ├── badge.component.ts
            │   └── badge.component.scss
            ├── button/
            │   ├── button.component.ts
            │   └── button.component.scss
            ├── ... (un dossier par composant)
            └── index.ts      # Barrel export de tous les composants
```

---

## Mapping Tokens Figma → CSS custom properties

### Règle de nommage

Le chemin Figma complet est conservé, converti en kebab-case avec les slashes → tirets.

```
Figma : {Collection}/{Catégorie}/{Sous-catégorie}/...
CSS   : --{collection}-{catégorie}-{sous-catégorie}-...
```

### Foundation → `_tokens.scss`

```scss
// Figma: Foundation / Color / BlueA / 400
--foundation-color-blue-a-400: #008ED6;

// Figma: Foundation / Spacing / 16
--foundation-spacing-16: 16px;

// Figma: Foundation / Radius / 4
--foundation-radius-4: 4px;

// Figma: Foundation / Font / Size / 14
--foundation-font-size-14: 14px;
```

### Semantic → `_semantic.scss`

Les tokens sémantiques sont des **aliases vers Foundation**, jamais vers des valeurs brutes.

```scss
// Figma: Semantic / Color / Interactive / Background / Strong / Default
--semantic-color-interactive-background-strong-default: var(--foundation-color-blue-a-400);

// Figma: Semantic / Measurement / Spacing / M
--semantic-measurement-spacing-m: var(--foundation-spacing-16);

// Figma: Semantic / Border / Radius / S
--semantic-border-radius-s: var(--foundation-radius-4);
```

### Dans les composants SCSS

```scss
// CORRECT
.ds-button {
  background: var(--semantic-color-interactive-background-strong-default);
  padding: var(--semantic-measurement-spacing-xs) var(--semantic-measurement-spacing-s);
  border-radius: var(--semantic-border-radius-s);
}

// INTERDIT
.ds-button {
  background: #008ED6;   // ❌ valeur en dur
  padding: 8px 16px;     // ❌ valeur en dur
}
```

---

## Conventions de nommage des composants

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Sélecteur | `ds-{nom}` | `ds-button`, `ds-badge` |
| Fichier | `{nom}.component.ts` | `button.component.ts` |
| Classe TS | `{Nom}Component` | `ButtonComponent` |
| Dossier | `{nom}/` | `button/` |
| SCSS BEM | `.ds-{nom}__element--modifier` | `.ds-button__icon--left` |

Les composants internes Figma préfixés `.` (ex: `.Content`, `.Action`) sont des **sous-éléments** — ils ne génèrent pas de composant Angular autonome, mais des éléments/modificateurs SCSS ou des éléments de template internes.

---

## Patterns Angular à suivre

### Structure d'un composant

```typescript
import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  // Inputs déclaratifs via signal (Angular 19)
  type = input<'primary' | 'secondary' | 'tertiary' | 'plain'>('primary');
  tone = input<'default' | 'accent'>('default');
  reversed = input<boolean>(false);
  disabled = input<boolean>(false);

  // Outputs
  clicked = output<void>();

  // Classes CSS calculées
  hostClass = computed(() => [
    `ds-button--${this.type()}`,
    `ds-button--tone-${this.tone()}`,
    this.reversed() && 'ds-button--reversed',
  ].filter(Boolean).join(' '));
}
```

### Gestion des états interactifs

| État Figma | Implémentation |
|-----------|---------------|
| `Hover` | Pseudo-classe `:hover` SCSS |
| `Active` | Pseudo-classe `:active` SCSS |
| `Disabled` | Input `disabled = input<boolean>(false)` + attribut HTML `[attr.disabled]` + `:disabled` SCSS |
| `Error` | Input `error = input<boolean>(false)` + classe CSS `--error` |
| `Read Only` | Input `readonly = input<boolean>(false)` + attribut HTML `[attr.readonly]` |
| `Focus` | Pseudo-classe `:focus-visible` SCSS |

Les états purement visuels (hover, active, focus) restent en CSS.  
Les états qui changent le comportement ou la structure (disabled, error, readonly) deviennent des inputs Angular.

### Syntaxe template

```html
<!-- Blocs de contrôle Angular 19 — obligatoire -->
@if (disabled()) {
  <span class="ds-button__overlay"></span>
}

@for (item of items(); track item.id) {
  <ds-badge [status]="item.status" />
}

@switch (type()) {
  @case ('primary') { <ng-content /> }
  @default { <ng-content /> }
}
```

### Variants Figma → Inputs Angular

| Propriété Figma | Input Angular |
|----------------|--------------|
| `Type` | `type = input<'primary' \| 'secondary' \| ...>()` |
| `Tone` | `tone = input<'default' \| 'accent' \| ...>()` |
| `Reversed` | `reversed = input<boolean>(false)` |
| `Size` | `size = input<'s' \| 'm'>('m')` |
| `Status` | `status = input<'info' \| 'success' \| 'warning' \| 'error'>()` |
| `Emphasis` | `emphasis = input<'high' \| 'medium' \| 'low'>('medium')` |
| `Style` | `style = input<'light' \| 'strong'>('light')` |

---

## Ordre de développement (atomes → organismes)

```
Atomes
├── 1. Badge
├── 2. Spinner
├── 3. Skeleton Item
├── 4. Button
├── 5. Button Icon

Molécules
├── 6. Checkbox
├── 7. Radio
├── 8. Input Text
├── 9. Input Email
├── 10. Input Date
├── 11. Inline Edit
├── 12. Dropdown + Dropdown Flyout Menu
├── 13. Functional Notice
├── 14. Toaster
├── 15. Snackbar
├── 16. Tooltip
├── 17. Popover

Organismes
├── 18. Checkbox Card
├── 19. Date Range
├── 20. Card
├── 21. Table (Header, Row, Cell, Selection)
└── 22. Drawer (page cible)
```

---

## Règles de cohérence entre composants

1. **Un composant par session de travail** — jamais de batch
2. **Toujours lire le composant dans Figma via MCP** avant de coder
3. **Référencer les composants validés** comme pattern pour les suivants
4. **Mettre à jour ce fichier** à chaque décision structurante validée
5. **Aucune valeur en dur** dans aucun `.scss` ou `.ts`
6. **Pas de `style=""` inline** dans les templates
7. **Export systématique** dans `src/app/shared/ui/index.ts` après validation
8. **Pas de logique métier** dans les composants UI — props in, events out

---

## Fichiers Figma de référence (clés MCP)

| Clé | Contenu |
|-----|---------|
| `4TxqgJPVFZc4ZKw4JZ6OAn` | Tokens (Foundation + Semantic) |
| `xCeEJPn6fliEshuE9fnrqs` | Composants Action (Button, Button Icon) |
| `VpConH5AUGyCqtp8PMqj1i` | Composants Data Display (Card, Table, Task) |
| `1wVY9FfjONIX6us9JmIm7U` | Composants Data Entry (Input, Checkbox, Radio…) |
| `fH3vmSNZR8r0sU3kN455CD` | Composants Feedback (Badge, Toaster, Notice…) |
| `bbgSPUChd18EVNGijjoZGn` | Maquette cible Layout (node `2865:10424`) |
