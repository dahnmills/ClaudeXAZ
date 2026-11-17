# Documentation Figma Action B : Link, Crumb, Breadcrumb, Chip, Tag

Date : 2026-11-06. Fichier `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`). Ajouts uniquement : aucun composant, variante, frame existant ni section "ZeroHeight · ... illustrations" modifie, rien de publie, aucune variable ou collection creee.

## Ce qui a ete ajoute

Un cadre `Component documentation · <Nom>` par composant, 1280 px de large, auto-layout, calques nommes, couleurs / espacements / rayons relies aux variables Semantic (Tokens) et textes aux styles Body / Title de la librairie Tokens. Les composants montres sont de vraies instances agrandies, avec marqueurs numerotes (cercles + traits) et liste de l'anatomie dessous. Contenu : en-tete (nom, statut `Design: Ready / Tech: In code / ZeroHeight: draft`, description, ressources avec liens texte : code, selecteur, noeud Figma, Storybook, ZeroHeight), anatomie, tableau Figma <-> Angular (valeurs, defauts), etats, tokens (variable Figma + custom property), cadre Notes (ecarts connus), usage et a11y (3 lignes). Texte en anglais, sans tiret cadratin.

| Composant | Page | Cadre ajoute | Position (x, y) | Taille |
|-----------|------|--------------|-----------------|--------|
| Link | Link `77:256` | `960:3553` | -136, 2932 | 1280 x 2372 |
| Crumb | Breadcrumb `298:4382` | `960:6154` | 0, 3732 | 1280 x 2036 |
| Breadcrumb | Breadcrumb `298:4382` | `961:215` | 0, 6328 | 1280 x 1928 |
| Chip | Chip `456:152` | `961:2497` | 0, 2981 | 1280 x 2421 |
| Tag | Tag `101:2` | `962:238` | 0, 3695 | 1280 x 2406 |

Chaque cadre est place a 560 px sous le dernier element existant de la page (Crumb et Breadcrumb partagent une page : empiles, 560 px d'ecart). Controle par script : aucun chevauchement avec un noeud existant (liste vide pour les 5). Captures relues : rien ne deborde, texte lisible.

## Ce qui existait deja (laisse tel quel)

- Sur chaque page : deux cadres `_Design system header` (composant, et "Documentation" en gabarit), un `Versionning`, la section `ZeroHeight · <Nom> illustrations`.
- Descriptions des composants Figma (ajoutees par la passe de correction), liaisons gap / padding / rayon S.
- Les gabarits d'en-tete contiennent encore du texte de remplissage (Link : titre "Flyout Menu"; Chip, Tag : "Component description", "Doc text", statuts Draft; Breadcrumb : texte copie de Radio; URL placeholder `qirin.zeroheight.com/tag`). Non modifies par regle ; le nouveau cadre sert de reference. A remplacer a la main si l'utilisateur le souhaite.

## Ecarts restants (decisions, repris dans le cadre Notes de chaque page)

- Link : defaut Font Weight (Semi-Bold Figma / regular code), Accent vs neutral, Icon en 3 valeurs (288 variantes), gap `--foundation-spacing-4` en code, ton neutral melangeant Static et Interactive, sets annexes et `[DEPRECATED] Link`, focus sans variante.
- Crumb : Breadcrumb Figma n'utilise pas Crumb, Disabled absent, opacites cumulees (0.16), hauteur 20 px en dur, Crumb dans le cadre d'en-tete.
- Breadcrumb : 7 Link au lieu de Crumb, pas de slot (profondeur, actions), `Breadcrumbs - Topbox` a auditer, pas de `ol/li` en code.
- Chip : `type` absent de Figma, croix du filtre sans calque, slots d'icone, rayon 10000 (Round = 100), styles de texte non lies, couleurs hover/active du libelle inversees, layout vertical.
- Tag : defaut Type (Filter / select), Static non instance de `.Options`, 3 `.Options` homonymes, `Type=Dropdown` absent du code, styles de texte et fills bruts non lies, descriptions manquantes sur `.Options` Select et Static.
- Transverse : statut ZeroHeight indique "draft" (pages masquees) ; pas de pages ZH publiees pour mettre des liens definitifs.
