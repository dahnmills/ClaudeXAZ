# Doc kit : documentation Figma des composants

Kit de documentation reutilisable pour les pages composant des librairies Figma Qirin. Il construit, a partir d'un objet `SPEC`, le cadre `Documentation · <Nom>` (1280 px, auto-layout, tout lie aux variables Semantic de la librairie Tokens).

Reference livree : page Button de `[Components] Action` (`xCeEJPn6fliEshuE9fnrqs`, page `44:554`), cadre `971:1014`.

## Fichiers
- `doc-kit.js` : la bibliotheque (`async function buildDoc(S, O)`), moins de 14 000 caracteres. Se colle telle quelle en tete d'un appel `use_figma` (limite 50 000), suivie du spec et de l'appel.
- Ce README : schema, mode d'emploi, regles.

## Mode d'emploi
1. Charger les outils Figma (`create_session`, `use_figma`, `get_screenshot`) et le skill `figma:figma-use`.
2. Lire `docs/zeroheight/<categorie>/<composant>.md`, `docs/components-status/components.json` (statut, version, liens) et le code `src/app/shared/ui/<composant>` pour remplir le spec. Le texte est en anglais, sans tiret cadratin.
3. Dans un seul `use_figma` : coller `doc-kit.js`, puis le spec, puis :
```js
const page = figma.root.children.find(p => p.id === 'PAGE_ID');
await figma.setCurrentPageAsync(page);
return await buildDoc(SPEC, { parentId: 'PAGE_ID', x: 0, y: 0, logoNodeId: '230:2138' });
```
   `x`, `y` : a droite du dernier element de la page, au moins 560 px d'ecart. `logoNodeId` : instance logo du gabarit `_Design system header` de la page (clonee dans le fil d'Ariane), facultatif.
4. `get_screenshot` section par section (les enfants de `Body`), telecharger le PNG hors du repo, le lire, critiquer, corriger le spec ou le kit, reconstruire (supprimer le cadre precedent cree par le kit avant).
5. Retour de `buildDoc` : `{ id, w, h, miss }`. `miss` doit etre vide (liste des variables introuvables dans Tokens/Semantic).

## Schema du spec
```
{
  name: 'Button',
  version: '1.0.0',                      // components.json
  status: { design: 'Ready', tech: 'In code', zeroheight: 'Draft (hidden)' },
  description: 'one or two sentences',
  links: { code: 'path (selector)',      // string simple ou { text, url }
           storybook: { text, url }, zeroheight: { text, url } },
  anatomy: { instanceNodeId, scale: 3,   // composant (COMPONENT, pas le set) a instancier, rescale
    markers: [{ n:'1', x:0..1, y:0..1, side:'t'|'b', dx?, label, desc }] },  // x,y = point vise en fraction de l'instance
                                         // sans x/y : repere de legende seul (pastille a contour)
  properties: [{ figma, values:[...], default, angular, notes }],           // values vide : cellule '—'
  states: [{ group, cols?, label, sub?, nodeId, rev?, ring? }],             // cols = nb de colonnes du groupe (1re vignette du groupe)
  tokens: [{ element, figmaVar, css, colorVar? , val? }],                   // colorVar : nom sans 'Color/' ; sinon val = chiffre dans une pastille
  notes: ['...'],                        // encart d'avertissement (ecarts Figma / code)
  usage: [{ t, x }]                      // cartes courtes usage / a11y
}
```
Tout bloc absent du spec est simplement omis. Les badges de statut prennent la couleur d'apres le mot : Ready / In code / Done / Live = positif ; WIP / Draft / Hidden / Planned = avertissement ; Deprecated / Missing / None = negatif ; autre = neutre.

## Ce que le kit produit
Bandeau (logo, fil d'Ariane, version, titre Display, description, carte de statuts, 3 cartes de liens cliquables via hyperlink), puis sections numerotees : Anatomy (instance agrandie, pastilles numerotees, traits de rappel, points cibles, legende), Properties (tableau zebre, valeurs en chips, defaut en bleu plein), States and variants (vignettes legendees, fond sombre pour `rev`, anneau de focus dessine pour `ring`), Tokens (pastille de couleur liee a la variable, nom Figma, custom property CSS), Notes (encart avertissement), Usage and accessibility (cartes), pied de page de marque avec liens.

## Regles
- Remplacer uniquement les cadres `Documentation · *` crees par les agents. Remplir les cadres existants `_Design system header` et `Versionning` est autorise (textes, tags, instances d'exemple Do / Dont), ne rien supprimer d'autre. Ne jamais toucher aux composants, variantes, ni aux sections `ZeroHeight · ... illustrations`. Ne pas publier.
- Aucun token, collection ou mode cree. Couleurs, espacements, rayons, bordures, tailles des pastilles, police, taille, interligne, graisse : tous lies a `Tokens / Semantic` par resolution du nom a l'execution (`figma.teamLibrary`, aucune cle a maintenir). Jamais Foundation direct.
- Les styles de texte de la librairie ne sont pas importables par cle (cles de `tokens-keys.md` perimees), donc le texte est lie variable par variable (famille, taille, interligne, graisse, interligne de lettres), comme les cadres existants.
- Couleurs de texte : blanc = `Color/Static/Text/Subtle/Primary` ; noir = `Color/Static/Background/Accent/Primary` ; `Static/Text/Main/Alt/*` est bleu clair, pas blanc. Le texte d'avertissement `Text/Main/Functional/Warning` (orange) echoue AA sur son fond : le kit utilise le texte principal sur l'encart.
- Les composants montres sont de vraies instances (`createInstance` sur le COMPONENT d'une variante).
- Aucun tiret cadratin dans le texte, hors la marque `—` de cellule vide. Pas de point median dans les titres (separateur ` - `), sauf le nom du cadre racine `Documentation · <Nom>` impose.

## Limites connues
- Largeurs de colonnes des tableaux et des vignettes : des nombres de mise en page (150, 330, 250, 390, 420, 300, 16 px de marge de numero), pas des tokens ; aucune variable de largeur n'existe a cette echelle.
- Le style de texte de librairie n'est pas applique, seulement ses variables : un changement de style dans la librairie ne se propage pas sans mise a jour du kit.
- L'anneau de focus est dessine (rectangle), il ne vient pas du composant.
- Le kit n'edite pas `_Design system header` / `Versionning` : ces cadres se remplissent a la main (script `setCharacters` apres `loadFontAsync` des segments, `setProperties({Status})` sur les tags). Pour le tag de `Versionning`, la propriete est sur l'instance imbriquee `I230:xxxx;1167:982`.
- Un texte a segments de polices mixtes echoue sur `loadFontAsync(node.fontName)` : toujours passer par `getStyledTextSegments(['fontName'])`.

## Exemple complet : Button
```js
const SPEC={name:'Button',version:'1.0.0',status:{design:'Ready',tech:'In code',zeroheight:'Draft (hidden)'},
description:'A button triggers an action on the current screen: submit, validate, open a flow, confirm a decision. Keep one Primary per area.',
links:{code:'src/app/shared/ui/button (ds-button)',
 storybook:{text:'Design System / Action / Button',url:'https://dahnmills.github.io/ClaudeXAZ/storybook/?path=/docs/design-system-action-button--docs'},
 zeroheight:{text:'Button page (hidden)',url:'https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/20fe33'}},
anatomy:{instanceNodeId:'44:559',scale:3,markers:[
 {n:'1',x:0.04,y:0.05,side:'t',label:'Container',desc:'Clickable surface: background, 1 px border, radius S. 32 px high (24 px for Plain).'},
 {n:'2',x:0.5,y:0.85,side:'b',label:'.Content',desc:'Private atom: icon and label in a row, gap 8. Its Icon property sets Left, Right or None.'},
 {n:'3',x:0.21,y:0.3,side:'t',label:'Icon Functional',desc:'Optional icon, swapped through the nested Icon instance.'},
 {n:'4',x:0.62,y:0.3,side:'t',label:'Label',desc:'Action text, one line, verb first.'},
 {n:'5',x:1,y:0.9,side:'b',label:'Border Focus',desc:'Keyboard focus ring, hidden by default.'},
 {n:'6',label:'Spinner',desc:'Loading state only: replaces the content, the width is kept.'}]},
properties:[
 {figma:'Type',values:['Primary','Secondary','Tertiary','Plain'],default:'Primary',angular:"type: 'primary' | 'secondary' | 'tertiary' | 'plain'",notes:'Plain has no padding and a 24 px height.'},
 {figma:'Tone',values:['Default','Accent','Positive'],default:'Default',angular:"tone: 'default' | 'accent' | 'positive' | 'negative'",notes:'Negative exists in code only.'},
 {figma:'Reversed',values:['False','True'],default:'False',angular:'reversed: boolean',notes:'For dark or brand surfaces.'},
 {figma:'State',values:['Default','Hover','Active','Disabled','Loading'],default:'Default',angular:'Hover, Active: CSS. disabled: boolean. loading: boolean',notes:'Focus is :focus-visible in code.'},
 {figma:'.Content > Icon',values:['Left','Right','None'],default:'Left',angular:'slots icon-left, icon-right',notes:'Exposed nested instance.'},
 {figma:'(code only)',values:[],angular:'fullWidth: boolean. clicked: output',notes:'fullWidth stretches the button to its container.'}],
states:[
 {cols:6,group:'State (Primary)',label:'Default',sub:'Rest',nodeId:'44:559'},
 {group:'State (Primary)',label:'Hover',sub:':hover',nodeId:'44:581'},
 {group:'State (Primary)',label:'Active',sub:':active',nodeId:'44:593'},
 {group:'State (Primary)',label:'Focus',sub:':focus-visible',nodeId:'44:559',ring:1},
 {group:'State (Primary)',label:'Disabled',sub:'disabled',nodeId:'44:571'},
 {group:'State (Primary)',label:'Loading',sub:'loading',nodeId:'750:530'},
 {cols:5,group:'Types and tones',label:'Secondary',sub:'Type',nodeId:'44:605'},
 {group:'Types and tones',label:'Tertiary',sub:'Type',nodeId:'44:617'},
 {group:'Types and tones',label:'Plain',sub:'Type, 24 px high',nodeId:'44:629'},
 {group:'Types and tones',label:'Accent',sub:'Tone',nodeId:'309:1057'},
 {group:'Types and tones',label:'Positive',sub:'Tone',nodeId:'750:1825'},
 {cols:4,group:'Reversed (dark or brand surfaces)',label:'Primary',sub:'Reversed',nodeId:'44:565',rev:1},
 {group:'Reversed (dark or brand surfaces)',label:'Secondary',sub:'Reversed',nodeId:'44:611',rev:1},
 {group:'Reversed (dark or brand surfaces)',label:'Tertiary',sub:'Reversed',nodeId:'44:623',rev:1},
 {group:'Reversed (dark or brand surfaces)',label:'Plain',sub:'Reversed',nodeId:'44:635',rev:1}],
tokens:[
 {element:'Primary background',figmaVar:'Color/Interactive/Background/Strong/Default',css:'--semantic-color-interactive-background-strong-default',colorVar:'Interactive/Background/Strong/Default'},
 {element:'Focus ring',figmaVar:'Color/Interactive/Border/Focus',css:'--semantic-color-interactive-border-focus',colorVar:'Interactive/Border/Focus'},
 {element:'Height',figmaVar:'Measurement/Spacing/XL',css:'--semantic-measurement-spacing-xl',val:'32'},
 {element:'Radius',figmaVar:'Border/Radius/S',css:'--semantic-border-radius-s',val:'4'}],   // liste complete : 12 lignes dans la page Button
notes:['Label weight: Figma SemiBold, code regular (400). Decision pending.','Tone Negative and fullWidth exist in code only. Figma has Default, Accent, Positive.'],
usage:[{t:'One Primary per area',x:'Put Secondary or Tertiary next to it, and Plain for a low-weight inline action.'},
 {t:'Keyboard',x:'Tab, Enter and Space. Disabled and Loading leave the tab order.'}]};
```

## Appliquer a une autre page (ex. Button Icon, page 12:118)
1. Reperer le COMPONENT par defaut et les COMPONENT d'etats dans la page (`findAllWithCriteria`), pas le `COMPONENT_SET`.
2. Placer les reperes d'anatomie par essais : `x`, `y` en fractions de l'instance, `side` haut ou bas, `dx` pour ecarter deux pastilles voisines (au moins 30 px entre pastilles du meme cote, apres `scale`).
3. Verifier chaque nom de variable dans `tokens` : `miss` signale ceux qui n'existent pas (les noms suivent `docs/figma/tokens-keys.md` et la collection Semantic, avec ses coquilles d'origine comme `Fuctional`).
4. Remplir ensuite les cadres `_Design system header` et `Versionning` de la page (statut, version, description, liens, changelog) et corriger leur fil d'Ariane.

## Ajouts (lot D)
- `anatomy.bg` : variable de fond du canevas d'anatomie (defaut `Static/Background/Main/Secondary`). A changer quand le composant est lui-meme gris (Tile : `Static/Background/Main/Primary`).
- `instanceNodeId` / `nodeId` peuvent designer une INSTANCE (clonee) en plus d'un COMPONENT : utile pour un menu dont le slot a ete rempli dans une instance temporaire (Flyout Menu), a supprimer ensuite.
- Sur les gabarits `_Design system header`, mettre les etiquettes de ressources en HUG et les liens en FILL + `textAutoResize HEIGHT` + alignement a gauche, sinon un libelle plus long que le modele se coupe.

## Planche Do / Don't (`board-kit.js`)
Decision utilisateur : la planche Do / Don't est un objet SEPARE du cadre `Documentation · <Nom>`. Elle transforme EN PLACE la section `ZeroHeight · <Nom> illustrations` (meme nom, memes nodeIds) : les frames `do · ...` / `dont · ...` sont reparentees (jamais dupliquees, jamais renommees) dans un cadre auto-layout `Do and Don't board` qui ajoute le decor. Reference livree : page Button, section `930:1069` (cadre interne `997:979`, 1280 x 2354).

### Fichier et appel
`board-kit.js` (environ 9 000 caracteres) : `async function buildBoard(S, O)`. A coller en tete d'un appel `use_figma`, suivi du spec :
```js
const page = figma.root.children.find(p => p.id === 'PAGE_ID');
await figma.setCurrentPageAsync(page);
return await buildBoard(SPEC, { sectionId: 'SECTION_ID', x: X, y: Y });   // x, y facultatifs ; O.w largeur mini (1280) ; O.pad marge de section (0)
```
Retour `{ id, boardId, w, h, miss }` ; `miss` doit etre vide. Relancable : les frames sont rapatriees dans la section, l'ancien cadre `Do and Don't board` est supprime, puis tout est reconstruit.

### Schema du spec
```
{ name: 'Button',                       // eyebrow
  intro: 'one line',                    // facultatif
  pairs: [{ key, doDesc, doNodeId, dontDesc, dontNodeId }],  // key = titre de la regle (rubrique ZeroHeight) ; meme key sur deux entrees consecutives = deux rangees sous un seul titre
  textOnly: [{ type: 'do'|'dont', text }],                  // regles sans image : carte grisee, mention "Text only"
  extras: [{ nodeId, label, text }] }                       // frames lues par ZeroHeight mais qui ne sont pas des regles (Anatomy...) : groupe "Other illustrations"
```
`doDesc` / `dontDesc` = texte EXACT de la regle ZeroHeight. Un `doNodeId` ou `dontNodeId` absent donne une carte pointillee "No Do / Don't illustrated for this rule." Toute frame de la section doit figurer dans `pairs` ou `extras` (sinon elle reste en vrac dans la section : a signaler).

### Regles
- Ne jamais renommer, dupliquer ni recreer une frame `do · ...` / `dont · ...` (les item-id des cartes `<rule>` ZeroHeight sont branches dessus). Apres chaque build, verifier par `getNodeByIdAsync` que tous les ids d'origine existent.
- Une colonne de paires, Do a gauche (bandeau et filet verts, icone check), Don't a droite (rouges, icone croix). Couleurs : `Static/Background/Functional/(Subtle/)Positive|Negative`, `Static/Border/Main/Functional/*`. Tout lie a `Tokens / Semantic` par nom (aucun token cree). Seules valeurs de mise en page : largeur mini 1280, trait pointille 4 / 4.
- La largeur du cadre s'adapte a la frame la plus large (2 colonnes + marges), mini 1280.
- Les frames d'illustration gardent leur taille d'origine (centrees dans leur cadre), pour que les exports ZeroHeight ne changent pas de ratio.
- Anglais, aucun tiret cadratin.

### Lister les regles ZeroHeight d'un composant
1. `list-pages` du MCP `allianz-trade` (styleguide 138794) : les pages composant sont masquees, relever l'id de la page.
2. `get-page` avec `format: "editor"`, lire l'onglet `Usage` (`<doc-tab name="Usage">`) : chaque `<heading level="3">` suivi de `<rules>` contient des blocs `<rule type="do|dont" item-id="...">texte</rule>`. Le titre h3 devient `key`, le texte devient `doDesc` / `dontDesc`.
3. Faire correspondre chaque regle a sa frame avec `docs/zeroheight/_dodont-figma-A.md` (tableau regle -> frame -> nodeId) ; une regle sans frame dessinable va en `textOnly`.

### Ordre de lecture de la page composant (gauche a droite, meme axe y)
gabarit `_Design system header` de l'utilisateur | cadre `Documentation · <Nom>` | planche Do / Don't | `Versionning`. On ne deplace que les objets crees par les agents (cadre Documentation, planche), avec au moins 560 px d'ecart et sans chevauchement : poser la planche a `x = x_doc + 1280 + 560`, `y = y_doc`. Les gabarits de l'utilisateur ne bougent jamais ; si `Versionning` est a gauche de l'en-tete (cas de la page Button), le signaler.

### Limites
- Un `SECTION` Figma ne gere pas l'auto-layout : le decor vit dans un cadre interne, la section est redimensionnee a sa taille.
- Les cartes ont une largeur fixe (moitie de la rangee) car deux enfants FILL de bases differentes se partageaient mal la rangee.
- Les chemins de glyphes check / croix sont dessines (vecteurs), pas des instances d'icone de la librairie.
- Une frame d'illustration plus large que ~560 px elargit toute la planche.

## Page normalisee (`page-kit.js`, 2026-11-16)
Decision utilisateur : une page composant = UNE section Figma au nom du composant, contenant sur une ligne, alignes en haut, 160 px de marge et 160 px entre cadres : `Versionning` | `_Design system header` (01 Component) | `Documentation · <Nom>` (02) | `Do/Don't` (03). Meme look pour les trois grands cadres (1800 px, bandeau Hero bleu clair + filet de marque, etiquette d'etape, titre 60, carte Status ou Resources, sections titre 40 + description 20 + boite grise, bandeau bas). Plus de section `ZeroHeight · X illustrations` : ZeroHeight vise les frames do/dont par id, pas leur section. References : Action > Button (section `Button` 4030:979) et Button Icon (4040:1005).

Appel (un par composant, sequentiel sur un meme fichier) : coller `page-kit.js`, puis
```js
const page = figma.root.children.find(p => p.id === 'PAGE_ID'); await figma.setCurrentPageAsync(page);
const K = await pageKit();
return await K.normalize({ headerId, versionningId, kitDocId, boardId, review: [idsObsoletes], name?, x?, y? });
```
- `headerId` : le `_Design system header` qui contient le COMPONENT_SET (restyle en place). `kitDocId` : cadre `Documentation · X` du doc kit (contenu deplace puis cadre supprime). `boardId` : cadre `Do and Don't board` (contenu deplace, section ZeroHeight videe puis supprimee). `review` : 2e gabarit `_Design system header` (ancien Do/Dont, doublon) et brouillons, ranges dans une section `<Nom> - To review` sous la ligne, jamais supprimes.
- Tout parametre absent est saute (page sans gabarit, sans Versionning, sans planche). Retour : `{section, doc, board, docSections, boardSections, dodont, lost, miss, overlaps}` ; `lost`, `miss`, `overlaps` doivent etre vides.
- Plusieurs composants sur une page : une section par composant, empilees verticalement (passer `x`, `y` : 400 px sous la precedente).
- Une rangee Do/Don't dont la frame depasse une demi-largeur passe en colonne (Do au-dessus du Don't). Les frames do/dont ne sont jamais redimensionnees.
