# Reject Management : recherche UX sur la correction d'un rejet

Date : 21 octobre 2026. Périmètre : modale (ou autre contenant) ouverte au clic sur une ligne du tableau des rejets, qui sert à corriger les champs en erreur d'un rejet (60 à 80 champs au total, dont une partie en erreur, par exemple 12).

Contraintes posées par l'utilisateur en cours de recherche, intégrées ci-dessous :

1. Anti-objectif ferme : pas de navigation hub-and-spoke (écran récapitulatif, entrer dans une catégorie, revenir, entrer dans la suivante). Aucun aller-retour entre écrans.
2. Volume : 60 à 80 champs par rejet, tout afficher d'un coup est indigeste.

---

## 1. Méthode et limites

**Méthode.** Lecture du texte intégral des pages de guidelines via un navigateur Edge headless (extraction `innerText`), puis captures d'écran avec la phrase probante encadrée en rose. Recherches complémentaires via DuckDuckGo HTML. 30 pages lues, 12 captures retenues (`shots/`).

**Ce qui a été lu en entier :** GOV.UK (Error summary, Error message, Validation, Task list, Complete multiple tasks, Check answers), NN/g (10 guidelines erreurs de formulaire, Error-message guidelines, Progressive disclosure, Wizards, Modal & nonmodal dialogs, Tabs used right, Accordions on desktop, Flexibility and efficiency), Baymard (Inline validation, Adaptive error messages), SAP Fiori (Message popover, Message view, Dialog, Object page, Message handling overview), Carbon (Forms, Modal, Dialog pattern, Notifications, Data table), PatternFly (Form), Material 3 (Text fields, Dialogs), Clarity (Forms), Atlassian (Modal dialog), Polaris (archive Error messages, Banner, Modal), Smashing Magazine (Live validation UX, V. Friedman), Smart Interface Design Patterns (Bulk UX), ImportCSV (Data import UX), Adam Silver (Form design zero to hero), WCAG 2.2 Understanding 3.3.1 et 3.3.3 (source GitHub du W3C), VS Code (Errors & warnings).

**Limites.**
- Pages bloquées ou vides : w3.org (Cloudflare, contourné par les sources HTML sur GitHub), A List Apart (article de Luke Wroblewski sur l'inline validation, non lu : je ne le cite pas), Fiori *Form Field Validation* (rendu vide), Salesforce Lightning (pages d'erreurs introuvables sur le nouveau site), Microsoft Fluent / Dynamics (seulement de la doc développeur `addNotification`, pas de guideline UX), Atlassian Forms (page vide).
- NN/g n'a pas d'article dédié « hub-and-spoke » accessible ; le principe est documenté par l'article *Pogo sticking*, cité d'après l'extrait de recherche, non lu en entier.
- Baymard et GOV.UK testent surtout des publics grand public ou occasionnels. Nos utilisateurs sont des experts en usage quotidien : je signale à chaque fois quand la transposition est une inférence.
- Aucune source ne traite exactement « corriger un message rejeté par un système ». Les analogues les plus proches : messages backend de SAP Fiori, réparation d'import de données, panneau *Problems* de VS Code.

Convention : **[Source]** = ce que dit la source ; **[Inférence]** = mon application à notre cas.

---

## 2. Tableau des principes

| # | Principe | Source + URL | Ce que dit la source (citation courte ou résumé) | Application à Reject Management |
|---|---|---|---|---|
| P1 | Résumé d'erreurs en tête, toujours, avec liens vers chaque champ | GOV.UK Error summary, https://design-system.service.gov.uk/components/error-summary/ (capture `ux-01`) | « Always show an error summary when there is a validation error, even if there's only one. » Il faut déplacer le focus sur le résumé, lier chaque erreur au champ, et formuler le message à l'identique dans le résumé et à côté du champ. | [Inférence] Un résumé cliquable en tête du formulaire remplace l'écran 1. Même libellé dans le résumé et sous le champ. |
| P2 | Le résumé ne suffit jamais seul | NN/g, 10 Design Guidelines for Reporting Errors in Forms, https://www.nngroup.com/articles/errors-forms-design-guidelines/ (capture `ux-02`) | Un résumé « shouldn't be used as the only form of error indication » : l'utilisateur devrait chercher le champ et mémoriser le message. Garder le message à côté du champ réduit la charge de mémoire de travail. | [Inférence] Un écran 1 qui liste les erreurs puis renvoie vers un autre écran oblige précisément à mémoriser. Message + valeur rejetée sur le champ lui-même. |
| P3 | Grouper les messages par **section de l'interface**, filtrer par gravité | SAP Fiori, Message popover, https://experience.sap.com/fiori-design-web/message-popover/ (capture `ux-03`) | « Messages in the list are grouped by the section and subsection on the UI. » La gravité (error, warning, success, info) est un **filtre** par boutons segmentés, pas un niveau de groupement. Chaque message porte en sous-titre le libellé du champ et un lien qui fait défiler jusqu'au champ. | [Inférence] Le seul groupement est la catégorie métier (= section du formulaire). Le statut est un attribut du champ et un filtre éventuel. |
| P4 | Pas de filtre de gravité quand il n'y a qu'un type | SAP Fiori, Message view, https://experience.sap.com/fiori-design-web/message-view/ (capture `ux-04`) | « The filter bar is hidden if there is only one type of message (for example, only errors). » | Confirme directement la première moitié de l'hypothèse : avec un seul statut, le niveau « statut » est du bruit. |
| P5 | Bouton de messages = gravité max + compteur | SAP Fiori, Message popover (même URL) | Le bouton prend l'icône et la couleur du message le plus critique et affiche le nombre de messages de ce type. Il disparaît quand il n'y a plus de messages. | [Inférence] Compteur global « 12 erreurs à corriger » qui descend, puis disparaît ou passe au vert. |
| P6 | Un dialogue n'est pas fait pour beaucoup de champs | SAP Fiori, Dialog, https://experience.sap.com/fiori-design-web/dialog/ (capture `ux-05`) | Ne pas utiliser de dialogue « for creating objects with a large number of fields. Use an object page instead. » Et : « If you need a large number of editable fields, consider other solutions instead, such as navigation to a details page. » | [Inférence] 60 à 80 champs dans une modale classique est hors guideline. Contenant à revoir (voir section 5). |
| P7 | Une modale n'est pas une alternative à une page | Carbon, Dialogs, https://carbondesignsystem.com/patterns/dialog-pattern/ (capture `ux-06`) ; Carbon Modal, https://carbondesignsystem.com/components/modal/usage/ | « A modal is not an alternative to page. » Si la grande modale ne suffit pas, « a full page might be needed ». Éviter accordéons et onglets dans une modale, ils cachent de l'information. Ne pas utiliser de modale si l'utilisateur doit consulter des informations hors modale. | [Inférence] Si l'analyste doit consulter le tableau, l'historique du buyer ou la police pour corriger, la modale bloque ce contexte. |
| P8 | Atlassian : pas de modale pour l'interaction complexe | Atlassian, Modal dialog, https://atlassian.design/components/modal-dialog/usage | « Don't use a modal dialog for complex interactions or large tables. » Minimiser le défilement vertical. | Va dans le même sens que P6 et P7. |
| P9 | Page longue + barre d'ancres plutôt qu'onglets | SAP Fiori, Object page, https://experience.sap.com/fiori-design-web/object-page/ (capture `ux-07`) | L'anchor bar est la navigation par défaut de l'object page : des ancres sous l'en-tête, un clic fait défiler jusqu'à la section, la barre reste visible. Les onglets sont une variante. | [Inférence] Catégories = ancres sur une seule page défilante, avec compteur par ancre. Pas d'aller-retour. |
| P10 | Pas d'onglets si l'information doit être vue ensemble | NN/g, Tabs used right, https://www.nngroup.com/articles/tabs-used-right/ | Utiliser des onglets seulement quand l'utilisateur n'a pas besoin de voir simultanément le contenu de plusieurs onglets, sinon cela « taxes users' short-term memory ». | [Inférence] Si une erreur « Payment incident » se corrige en regardant un champ « Buyer identification », les onglets filtrants pénalisent. Ancres préférables. |
| P11 | Accordéons : tout montrer si la majorité est nécessaire, sinon replier | NN/g, Accordions on desktop, https://www.nngroup.com/articles/accordions-on-desktop/ (capture `ux-10`) | Quand l'audience a besoin de la majorité du contenu, « show all the content at once ». Sinon les accordéons aident à scanner. Permettre plusieurs sections ouvertes et un « Expand all ». | [Inférence] Ici l'analyste a besoin d'une minorité (12 sur 70) : replier ou filtrer les champs valides est justifié. Mais plusieurs sections ouvertes à la fois, jamais d'auto-fermeture. |
| P12 | Divulgation progressive, deux niveaux maximum | NN/g, Progressive disclosure, https://www.nngroup.com/articles/progressive-disclosure/ | Montrer d'abord ce qui est fréquemment nécessaire, le reste à la demande. « Designs that go beyond 2 disclosure levels typically have low usability. » | [Inférence] Niveau 1 = champs en erreur. Niveau 2 = tous les champs (toggle). Pas de troisième niveau (écran catégorie, puis section, puis champ). |
| P13 | « Afficher seulement les lignes en erreur » | Smart Interface Design Patterns, Bulk UX, https://smart-interface-design-patterns.com/articles/bulk-ux/ ; ImportCSV, https://www.importcsv.com/blog/data-import-ux | Étape « Repair » : « allow users to see only rows with errors ». Corriger dans l'outil même, en ligne, sans exporter ni recharger. | [Inférence] L'analogue le plus proche de notre cas (réparer des données rejetées). Valide un filtre « Champs en erreur / Tous les champs ». |
| P14 | Les experts n'aiment pas les assistants pas à pas | NN/g, Wizards, https://www.nngroup.com/articles/wizards/ (capture `ux-12`) | « Use wizards for novice users or infrequent processes. » Les assistants deviennent agaçants s'ils sont utilisés en boucle ; plus de clics ; difficile de comparer des informations entre étapes. | [Inférence] Écran 1 puis écran 2 = assistant à deux étapes, pour une tâche quotidienne d'expert. À éviter. |
| P15 | Accélérateurs pour l'usage répété | NN/g, Flexibility and efficiency of use, https://www.nngroup.com/articles/flexibility-efficiency-heuristic/ | Les raccourcis invisibles au novice accélèrent l'expert ; « accelerators improve repetitious usage ». | [Inférence] Raccourcis « erreur suivante / précédente » et « rejet suivant ». |
| P16 | Boucler sur les erreurs, panneau groupé par emplacement | VS Code, Errors & warnings, https://code.visualstudio.com/docs/editing/editingevolved (capture `ux-11`) | Panneau *Problems* groupé par fichier avec compteur par groupe ; Alt+F8 / Shift+Alt+F8 bouclent d'une erreur à l'autre en affichant le problème en ligne. | [Inférence] Analogue expert le plus parlant : groupement par emplacement (= catégorie), compteur par groupe, navigation clavier séquentielle. |
| P17 | Retirer l'erreur dès que le champ est corrigé | Baymard, Inline form validation, https://baymard.com/research-articles/inline-form-validation (capture `ux-08`) | Trois points critiques : éviter la validation prématurée, retirer le message dès que le champ est corrigé, utiliser une validation positive. Les participants fixaient le message en attendant qu'il disparaisse. | [Inférence] Le compteur global et le compteur de section descendent en direct, avec une coche sur le champ corrigé. |
| P18 | Reward early, punish late | Smashing Magazine, V. Friedman, https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/ (capture `ux-09`) | Sur un champ en erreur : valider à la frappe et retirer l'erreur dès que c'est bon. Sur un champ valide qu'on modifie : attendre la sortie du champ. Prévoir une issue si la validation se trompe. | [Inférence] Règle parfaite pour nos champs déjà rejetés : ils sont « en erreur » dès l'ouverture, donc validation immédiate à la frappe. |
| P19 | Validation sur blur pour les champs, alerte en tête pour le serveur | Carbon Forms, https://carbondesignsystem.com/patterns/forms-pattern/ ; PatternFly Form, https://www.patternfly.org/components/forms/form/design-guidelines | Carbon : valider à la perte de focus ; pour les erreurs serveur, une notification inline + les erreurs inline. Pour un long formulaire, ne pas désactiver le bouton principal. PatternFly : en validation sur soumission, une alerte inline sous l'en-tête du formulaire, toute largeur, en complément des erreurs de champ. | [Inférence] Nos erreurs viennent du serveur (rejet) : alerte/résumé en tête + erreur par champ. Bouton « Resubmit » jamais grisé. |
| P20 | Message précis, adapté à la cause exacte | Baymard, Adaptive error messages, https://baymard.com/research-articles/adaptive-validation-error-messages ; NN/g Error-message guidelines, https://www.nngroup.com/articles/error-message-guidelines/ | Baymard : 98 % des sites affichent des messages génériques alors que le backend connaît la cause exacte ; certains participants restent bloqués. NN/g : décrire précisément, proposer un remède, conserver la saisie de l'utilisateur. | [Inférence] Afficher la raison exacte du rejet (code + texte métier) et la valeur rejetée sur chaque champ. |
| P21 | Garder la valeur qui a échoué | GOV.UK Validation, https://design-system.service.gov.uk/patterns/validation/ | Réafficher le formulaire « with the form fields as the user filled them in » : voir ce qui n'allait pas, modifier, ne pas tout ressaisir. | [Inférence] Le champ est pré-rempli avec la valeur rejetée, éditable. Garder la valeur d'origine consultable après modification. |
| P22 | Erreur identifiée en texte, suggestion de correction | WCAG 2.2, 3.3.1 et 3.3.3 (source : https://github.com/w3c/wcag/tree/main/understanding/20) | 3.3.1 : l'élément en erreur est identifié et l'erreur décrite en texte (pas seulement la couleur). 3.3.3 : « Where errors are detected, suggest known ways to correct them. » | Obligation AA, cohérente avec PRODUCT.md. Couleur + icône + texte. |
| P23 | Couleur + icône | NN/g (guideline 4 et 5), Clarity Forms, https://clarity.design/documentation/forms ; Material 3 Text fields, https://m3.material.io/components/text-fields/guidelines | Rouge pour l'erreur, orange/jaune pour l'avertissement, toujours doublé d'une icône. M3 : remplacer le texte d'aide par le texte d'erreur pour éviter les sauts de mise en page. | Conforme aux atomes `input-*` existants. |
| P24 | Gravité : rouge = bloquant, jaune = avertissement du quotidien | Polaris (archive), Error messages, https://github.com/Shopify/polaris-react-archive/blob/main/polaris.shopify.com/content/content/error-messages.mdx ; Polaris Banner, https://shopify.dev/docs/apps/build/app-home/migrate-from-polaris-react/banner | Rouge pour le critique (dont les erreurs de validation), jaune pour les erreurs du flux quotidien ou les avertissements. « Keep field validation next to its field. Use s-banner when the message affects a section or the wider task. » | [Inférence] Si des warnings non bloquants existent, ils se distinguent par la couleur et le texte du champ, pas par une section séparée. Bannière de section seulement pour une erreur qui porte sur toute la catégorie. |
| P25 | Task list : seulement si plusieurs sessions et ordre libre | GOV.UK Task list, https://design-system.service.gov.uk/components/task-list/ ; Complete multiple tasks, https://design-system.service.gov.uk/patterns/complete-multiple-tasks/ | À utiliser seulement si les utilisateurs ne peuvent pas tout faire en une fois et doivent choisir l'ordre. « Try to simplify the service before you use a task list. » | [Inférence] L'écran 1 actuel est une task list. Nos corrections se font en une séance : le critère d'usage n'est pas rempli. |
| P26 | Le va-et-vient entre page de routage et page détail est un symptôme | NN/g, Pogo sticking, https://www.nngroup.com/articles/pogo-sticking/ (lu via extrait de recherche) | Le motif hub-and-spoke répété (page de routage, page profonde, retour immédiat) est appelé pogo sticking et signale des clics perdus. | Rejoint l'anti-objectif de l'utilisateur. |
| P27 | Actions de lot dans le tableau | Carbon Data table, https://carbondesignsystem.com/components/data-table/usage/ | Sélection multiple par cases, barre d'actions de lot à la hauteur d'une ligne. | [Inférence] Le lot se traite dans le tableau, pas dans le formulaire de correction (voir 6.4). |

---

## 3. Grouper par statut, par typologie, ou les deux ?

### Ce que disent les sources

- **[Source] Fiori** groupe les messages par **section de l'interface** et réserve la gravité à un **filtre**, masqué s'il n'y a qu'un type (P3, P4).
- **[Source] VS Code** groupe les problèmes par **emplacement** (fichier), avec un compteur par groupe, la gravité étant une icône par ligne (P16).
- **[Source] GOV.UK** ordonne le résumé d'erreurs dans l'ordre des champs du formulaire, sans regroupement par gravité (P1).
- **[Source] NN/g** : la valeur d'un message se mesure à la facilité de trouver le champ et de garder le message sous les yeux pendant la correction (P2). Grouper par gravité éloigne le message de son emplacement.
- Aucune source consultée ne recommande un groupement imbriqué gravité puis emplacement.

### Réponse

**Un seul niveau de groupement : la catégorie métier, qui est aussi la section du formulaire.** Le statut (bloquant / avertissement / corrigé) est un attribut porté par chaque champ et par le compteur de la section.

[Inférence] Le double groupement de l'écran 1 actuel fait doublon de deux façons : « Errors · 12 » répète la somme des catégories, et avec un seul statut le niveau « statut » ne distingue rien (exactement le cas où Fiori masque le filtre). Pire, la catégorie « Buyer Identification · 0 error » occupe une carte entière pour dire qu'il n'y a rien à faire.

**Quand le statut devient utile :** s'il existe vraiment deux natures d'anomalies, bloquantes (le rejet ne repassera pas) et avertissements (il repassera mais c'est suspect). Dans ce cas, toujours pas de second groupement : un **filtre ou tri** « Bloquants d'abord », et un compteur qui ne compte que les bloquants pour l'objectif « le rejet passe » (P5, P24).

---

## 4. Recommandation écran 1 : le supprimer

[Inférence, forte] L'écran 1 est un hub-and-spoke (P25, P26), donc exclu par la contrainte 1, et un assistant à deux étapes pour un usage expert quotidien (P14). Ce qu'il apporte réellement (combien d'erreurs, dans quelles catégories) se loge dans l'en-tête du formulaire :

- **En-tête collant du contenant** : identifiant du rejet, catégorie système (Functional / Technical / Maintenance), et compteur global « 12 champs à corriger » avec l'icône et la couleur de la gravité max (P5).
- **Résumé d'erreurs** juste dessous, lié aux champs, groupé par catégorie, même libellé que sous le champ (P1, P3). Repliable une fois lu, puisqu'il est redondant avec la barre d'ancres pour un expert.
- **Barre d'ancres des catégories** avec compteur par catégorie (`Payment incident 12`, `Buyer identification ✓`) : elle remplace les cartes de l'écran 1 sans changer d'écran (P9, P16).

Le focus arrive directement sur le **premier champ en erreur** (ou sur le résumé, selon GOV.UK pour l'accessibilité : à tester avec les analystes, voir section 7).

---

## 5. Recommandation écran 2 : le formulaire de correction

### 5.1 Contenant

**[Source]** Fiori, Carbon et Atlassian convergent : un dialogue avec un grand nombre de champs éditables est hors usage, il faut une page (P6, P7, P8). Carbon ajoute : pas de modale si l'utilisateur doit consulter de l'information à l'extérieur.

**[Inférence] Recommandation par ordre de préférence :**

1. **Page dédiée de correction** (`/rejects/:id`), ouverte depuis la ligne, avec « Rejet précédent / suivant » dans l'en-tête et un retour au tableau qui conserve filtres et position. C'est la forme Fiori *object page* : en-tête, barre d'ancres, sections défilantes.
2. À défaut, **modale plein écran** (ou quasi plein écran) qui reprend exactement cette structure. Elle garde l'impression de « rester dans le tableau » mais hérite des limites de la modale (contexte masqué).
3. **Drawer latéral** seulement si l'on ne montre que les champs en erreur. Pour 60 à 80 champs, sa largeur est insuffisante. Le Drawer figure dans l'ordre de développement du design system : il convient au détail de lecture, pas à la saisie massive.

La modale de taille standard actuelle est à écarter pour ce volume.

### 5.2 Ne montrer que les champs en erreur, ou tout ?

**[Source]** Divulgation progressive (P12), « see only rows with errors » en réparation de données (P13), accordéons à replier quand on n'a besoin que d'une minorité du contenu (P11). En sens inverse : ne pas cacher ce qui doit être vu en même temps (P10, P7).

**[Inférence] Recommandation :**

- **Par défaut : « Champs en erreur » (12 champs)**, chacun dans sa section de catégorie, avec en lecture seule les 2 ou 3 champs de contexte indispensables à la correction (à définir avec le métier : identifiant buyer, numéro de police, montant). Le contexte en lecture seule est la parade au risque de P10.
- **Contrôle segmenté** dans l'en-tête : `Champs en erreur (12)` / `Tous les champs (74)`. Atome existant `ds-segmented-control` en mode `tabs` (cela bascule une vue). Le basculement garde la position sur le champ actif.
- En mode « Tous les champs » : sections avec des champs en erreur **ouvertes**, sections sans erreur **repliées** avec leur nombre de champs, plusieurs sections ouvertes possibles, bouton « Tout déplier » (P11).
- **Pas d'onglets filtrants par catégorie** : ils cachent les autres catégories et forcent un aller-retour intra-écran (P10, P7). Une seule page défilante, des ancres pour sauter.
- Un champ corrigé **reste affiché** dans la vue « Champs en erreur » jusqu'à la fermeture, avec sa coche verte : s'il disparaissait, l'analyste perdrait le fil et ne pourrait plus se relire.

### 5.3 Anatomie d'un champ en erreur

[Source P20, P21, P22, P23 ; mise en forme : inférence]

- Libellé (semi-bold, règle CLAUDE.md), champ pré-rempli avec la **valeur rejetée**, éditable.
- Sous le champ : la **raison exacte** du rejet en langage métier, et la suggestion de correction si le système la connaît (WCAG 3.3.3). Le code technique en second plan.
- Après modification : « Valeur rejetée : XXX » reste visible en petit, avec un « Rétablir ».
- Icône + couleur + texte, jamais la couleur seule.

### 5.4 Navigation entre erreurs

[Source P15, P16 ; application : inférence]

- Boutons **« Erreur précédente / suivante »** dans l'en-tête collant, à côté du compteur, plus raccourcis clavier (à choisir pour ne pas entrer en conflit avec la saisie, par exemple Alt+↓ / Alt+↑ ; Alt+F8 est l'analogue VS Code).
- « Suivante » saute au prochain champ **non corrigé**, toutes catégories confondues, et fait défiler la barre d'ancres.
- La touche Entrée sur un champ corrigé pourrait passer à l'erreur suivante : séduisant pour la vitesse, mais risque de conflit avec les listes déroulantes. À tester, pas à imposer.

### 5.5 Validation et compteur qui descend

- **[Source] Baymard + Smashing (P17, P18)** : sur un champ déjà en erreur, valider dès la frappe et retirer l'erreur dès que c'est bon. Nos champs sont tous dans ce cas à l'ouverture.
- **[Source] Carbon / PatternFly (P19)** : validation à la sortie du champ pour les champs valides qu'on modifie, ne pas griser le bouton principal d'un long formulaire.
- **[Inférence]** Compteur global et compteurs d'ancres qui décrémentent en direct ; à zéro, l'en-tête passe en succès et le bouton « Resoumettre » devient l'action principale mise en avant. Un champ qui passe la validation locale peut encore échouer côté serveur : au renvoi, les nouvelles erreurs serveur reviennent dans la même structure (résumé + champ).
- Annonce `aria-live="polite"` du compteur (« 11 champs restants »), pas à chaque frappe mais à chaque changement d'état d'un champ.

---

## 6. Points spécifiques

### 6.1 Compteurs par section
[Source] Fiori (compteur sur le bouton de messages), VS Code (compteur par groupe), GOV.UK Task list (statut par tâche, « Completed » en noir sans fond pour attirer l'œil vers ce qui reste). [Inférence] Compteur sur chaque ancre ; à zéro, une coche discrète, pas un badge vert voyant : c'est ce qui reste qui doit attirer l'œil.

### 6.2 Bloquant vs avertissement
[Source] Polaris (rouge / jaune), Fiori (filtre par type). [Inférence] Le compteur principal ne compte que les bloquants. Les avertissements n'empêchent pas de resoumettre ; un filtre « Bloquants seulement » n'apparaît que s'il existe des avertissements (P4).

### 6.3 Erreurs qui ne concernent pas un champ
[Source] Fiori groupe ces messages sous « Last action » quand ils ne correspondent à aucun champ. [Inférence] Une erreur de type Technical ou Maintenance sans champ associé s'affiche en bannière en tête de la section concernée (Polaris : bannière quand le message porte sur une section, P24), ou en tête de page si elle porte sur tout le rejet.

### 6.4 Correction en lot de plusieurs rejets
[Source] Carbon : actions de lot dans le tableau ; Bulk UX : réparer dans l'outil, filtre sur les lignes en erreur. [Inférence] Deux besoins distincts :
- **Même erreur sur N rejets** (par exemple le même code buyer erroné) : action de lot depuis le tableau (« Corriger ce champ sur les 8 rejets sélectionnés »), avec aperçu avant application. C'est le gain le plus fort, mais il sort du périmètre du formulaire unitaire.
- **Enchaîner des rejets différents** : « Resoumettre et passer au suivant » dans le formulaire, qui respecte l'ordre et les filtres du tableau. Pas d'aller-retour vers le tableau entre deux rejets.

### 6.5 Validation au fil de la saisie
Voir 5.5. Attention, GOV.UK déconseille de valider à la sortie du champ (voir section 7).

---

## 7. Ce qui contredit ou nuance l'hypothèse

1. **Un seul groupement par catégorie : confirmé, avec une nuance.** Fiori et VS Code confirment. Mais si les rejets portent à la fois des bloquants et des avertissements, la gravité doit rester visible et filtrable (Fiori). Elle ne disparaît pas, elle change de place : du niveau de groupement vers le filtre et l'attribut du champ.
2. **Le résumé en tête pourrait être superflu pour des experts.** GOV.UK l'impose « même pour une seule erreur », mais pour un public grand public qui arrive sur une page rechargée. Fiori déconseille même le *message popover* dans un petit dialogue, où il masquerait les champs, et préfère alors l'erreur en ligne seule. Avec un compteur, une barre d'ancres avec compteurs et un bouton « erreur suivante », le résumé détaillé fait doublon à son tour. Recommandation : résumé **repliable**, replié par défaut après la première utilisation, à valider en test.
3. **L'hypothèse suppose la modale ; les sources la contredisent pour ce volume.** Fiori, Carbon et Atlassian déconseillent une modale pour un grand nombre de champs éditables. C'est la contradiction la plus nette : le choix du contenant pèse plus lourd que le choix du groupement.
4. **« Ne montrer que les champs en erreur » a un coût.** NN/g (onglets) et Carbon (modales) mettent en garde contre le fait de cacher une information nécessaire en même temps. Si corriger une erreur demande de lire des champs valides, le filtre seul échoue : il faut le contexte en lecture seule et le basculement « Tous les champs ».
5. **Le moment de validation fait débat.** GOV.UK : « Do not validate when the user moves away from a field », valider au clic sur Continuer. NN/g, Carbon, PatternFly et Baymard : valider en ligne, à la sortie du champ. La règle *reward early, punish late* (Smashing) tranche bien pour notre cas, où les champs sont en erreur dès l'ouverture, mais ce n'est pas un consensus.
6. **Le saut direct au formulaire n'est pas validé par une étude sur notre type de tâche.** Les preuves sont indirectes : assistants déconseillés aux experts, pogo sticking, Fiori. Aucune source ne mesure « écran récapitulatif puis formulaire » contre « formulaire direct » pour la correction de données rejetées.

---

## 8. Synthèse

| Question | Recommandation | Confiance |
|---|---|---|
| Grouper par statut puis typologie ? | Non. Un seul niveau, la catégorie = section du formulaire. Statut porté par le champ, filtre seulement s'il existe plusieurs gravités. | Élevée |
| Écran 1 ? | Le supprimer. Compteur + résumé repliable + barre d'ancres avec compteurs dans l'en-tête du formulaire. | Élevée (convergence des sources et contrainte utilisateur) |
| Contenant pour 60 à 80 champs | Page dédiée (object page) ; à défaut, modale plein écran. Pas de modale standard ni de drawer étroit. | Moyenne à élevée |
| Que montrer par défaut | Champs en erreur + contexte en lecture seule ; bascule « Tous les champs », sections repliées si sans erreur. | Moyenne (dépend du besoin de contexte, à tester) |
| Onglets ou ancres | Page unique défilante avec ancres. | Élevée |
| Navigation | Erreur suivante / précédente (boutons + clavier), « Resoumettre et suivant ». | Moyenne (analogues experts, pas d'étude directe) |
| Validation | Immédiate sur les champs en erreur, compteurs qui descendent en direct, bouton jamais grisé. | Moyenne à élevée |

## Captures

| Fichier | Contenu |
|---|---|
| `shots/ux-01-govuk-error-summary.png` | GOV.UK : résumé d'erreurs toujours, même pour une seule erreur |
| `shots/ux-02-nng-validation-summary.png` | NN/g : le résumé ne doit pas être la seule indication |
| `shots/ux-03-fiori-popover-grouping.png` | Fiori : messages groupés par section de l'interface |
| `shots/ux-04-fiori-messageview-filter.png` | Fiori : filtre de gravité masqué s'il n'y a qu'un type |
| `shots/ux-05-fiori-dialog-many-fields.png` | Fiori : pas de dialogue pour un grand nombre de champs |
| `shots/ux-06-carbon-modal-not-page.png` | Carbon : une modale n'est pas une alternative à une page |
| `shots/ux-07-fiori-objectpage-anchorbar.png` | Fiori : barre d'ancres de l'object page |
| `shots/ux-08-baymard-remove-error.png` | Baymard : retirer l'erreur dès la correction |
| `shots/ux-09-smashing-reward-early.png` | Smashing : reward early, punish late |
| `shots/ux-10-nng-accordion-showall.png` | NN/g : accordéons, tout montrer si la majorité est utile |
| `shots/ux-11-vscode-next-error.png` | VS Code : problèmes groupés par fichier, Alt+F8 pour boucler |
| `shots/ux-12-nng-wizards-experts.png` | NN/g : assistants réservés aux novices et aux tâches rares |
