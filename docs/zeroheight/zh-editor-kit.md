# Éditer ZeroHeight par le navigateur (kit, 2026-11-16)

Validé sur Button Split, Visual Button, Crumb, Segmented Control, Link et Button Icon : sans crédit MCP, chaque modification a été vérifiée après rechargement.

## Accès
- Navigateur Playwright (Edge, `--browser msedge`), profil où l'utilisateur est connecté. Le cookie `remember_token` dure environ 400 jours. Si la page de connexion apparaît, arrêter et demander à l'utilisateur de se reconnecter.
- Page : `https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/<slug>`. Onglets : liens `article a[href*="/b/"]`.
- Chaque bloc éditable est un `.ProseMirror` qui expose `element.editor` (TipTap). Index 0 = introduction, index 1 = contenu de l'onglet courant.
- Sauvegarde automatique : attendre environ 5 s après la modification, puis recharger pour vérifier.
- Permissions : les modifications de structure (supprimer ou remplacer des blocs) demandent l'accord direct de l'utilisateur DANS la session qui agit. Une autorisation relayée à un agent est refusée par le contrôle de Claude Code.

## Lire les blocs
```js
const ed=document.querySelectorAll('.ProseMirror')[1].editor;
const out=[]; ed.state.doc.forEach((n,off,i)=>out.push({i,off,type:n.type.name,size:n.nodeSize,text:n.textContent.slice(0,120)}));
```
Types vus : `design-uploads` (visuel Figma), `heading` (attrs.level), `paragraph`, `bulletList`, `table` > `tableRow` > `tableCell` > `paragraph`, `columns`, `callout` (attrs.type `calloutBackground2`), `rules` (Do/Don't).

## Modifier
- Supprimer un bloc : `ed.chain().deleteRange({from:off,to:off+n.nodeSize}).run()`.
- Supprimer un bout de texte : `ed.view.dispatch(ed.state.tr.delete(from,to))`, avec `from = pos du textblock + 1 + index dans textContent`, seulement s'il n'y a que des nœuds texte dans le bloc. Un texte coupé par des marques (code, gras) ne se trouve pas par `n.text.indexOf` : passer par `textContent`.
- Remplacer une plage par du contenu : `ed.chain().insertContentAt({from,to}, [nœuds JSON]).run()`.
- Nœuds JSON (format relevé sur la page Button) :
  - titre : `{type:'heading',attrs:{blockId,level:2},content:[{type:'text',text}]}`
  - lien interne : marque `{type:'link',attrs:{blockId:'',href:'https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/<id6>',target:'_blank',rel:'noopener noreferrer nofollow',class:'zheditor-a'}}`
  - tableau : attrs `{blockId,displayBorders:true,showHeader:true,stickyHeader:false,fullWidth:false,showRowBackground:false,borderStyle:'full',horizontalTextAlignment:'left',verticalTextAlignment:'center'}` ; cellule `{type:'tableCell',attrs:{blockId:'',colspan:1,rowspan:1,colwidth:[200] ou null,verticalTextAlignment:null,horizontalTextAlignment:null},content:[paragraph]}`. La ligne d'en-tête est une rangée normale (showHeader).
  - blockId : 10 caractères hexadécimaux aléatoires.
- Conserver un bloc existant tel quel : `ed.state.doc.child(i).toJSON()`, à réinsérer.

## Patron Overview (page Button)
visuel `design-uploads` | H2 « Pick the right component » + phrase + tableau « The user wants to… / Use / Why » (liens vers les pages) | H2 sur les types + colonnes ou paragraphes | H2 « States » + visuel ou tableau + callout. Pas d'encadré de statut, pas de titre « Overview » répété, pas de listes When to use / When not to use (elles deviennent les lignes du tableau).

## Ids des pages (lien interne `/p/<id6>`)
Button 20fe33, Button Icon 64532a, Button Split 61a7c2, Segmented Control 374036, Tag 4114ba, Flyout Menu 89e8ce, Flyout Menu Item 380978, Crumb 0405bc, Button Load More 72f9cd, Breadcrumb 80837a, Button Range 948da2, Chip 030ec1, Pagination 4590c9, Tab 99e610, Tile 510534, Stepper 825623, Visual Button 828964, Link 52632d, Keycap 1032c3, Shortcut Keys 49b237, Shortcut Row 164dda, Keyboard Map 91c535, Flag 756efd, Action Card 43b236, Pie Chart 11c6d1, Page Title 67bb7a, Filter Drawer 90fb55, Spotlight 54d83f, Shortcuts Panel 04b0e6, Search Bar Home 3449f9, Search Bar Multi 15d363, Tag Filter Chip 99e410, Grid Selection 56f3ef, File Upload 879591.
