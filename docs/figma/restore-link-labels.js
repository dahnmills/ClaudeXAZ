// restore-link-labels.js : corps de use_figma (a coller tel quel dans le parametre `code`).
// A EXECUTER SEULEMENT APRES publication des librairies Action et Feedback ET acceptation de la mise a jour
// dans le fichier consommateur. Repose sur le nouveau calque `Label` des Link (77367a8f...) les textes releves
// avant publication dans docs/figma/_overrides-before-publish.json.
//
// Parametres :
//   FILE_KEY         : fichier traite (doit etre le fileKey passe a use_figma).
//   PAGE_ID          : page a traiter (une seule page par appel). null = la page unique des releves de ce fichier.
//   DRY_RUN          : true = ne rien ecrire, renvoyer le diff. Passer a false pour reposer les textes.
//   INCLUDE_SKIPPED  : true = traiter aussi les releves marques skipByDefault (page Archives de Data Display).
//   RESTORE_VISIBILITY : true = remettre aussi la visibilite relevee du Label.
//
// Les releves sont recopies ci-dessous depuis le JSON (meme contenu). Si le JSON est regenere, recopier RECORDS.

const FILE_KEY = 'wqlQIlGhJmMCfgc2XD1Umm';
const PAGE_ID = null;
const DRY_RUN = true;
const INCLUDE_SKIPPED = false;
const RESTORE_VISIBILITY = false;

const NEW_LINK_SET_KEY = '77367a8f128498576f030e35e042f9434514056a';
const OLD_LINK_SET_KEY = 'b9493d2f368c2be7b05432781ca275cc35a896f3';

const CS = 'I13:7094;1514:4333;13:7167;38:13892;28:21770;38:11041;1498:3458;13:7224';
const CS_LABELS = ['Home', 'Crumb', 'Crumb', 'Crumb', 'Crumb', 'Crumb', 'Current page'];
const RECORDS = [
  {
    fileKey: 'wqlQIlGhJmMCfgc2XD1Umm', pageId: '6:3', instanceId: CS, component: 'Breadcrumb', skipByDefault: false,
    links: CS_LABELS.map((text, i) => ({ linkId: `${CS};298:${5479 + i}`, linkRelPath: 'Link', text, textVisible: true })),
  },
  {
    fileKey: 'VpConH5AUGyCqtp8PMqj1i', pageId: '1452:1720', instanceId: '1704:17329', component: 'Breadcrumb', skipByDefault: true,
    links: [0, 1, 2, 3, 4, 5, 6].map(i => ({ linkId: `1704:17329;298:${5479 + i}`, linkRelPath: 'Link', text: 'Label', textVisible: true })),
  },
];

if (typeof figma.fileKey === 'string' && figma.fileKey && figma.fileKey !== FILE_KEY) {
  throw new Error(`FILE_KEY (${FILE_KEY}) ne correspond pas au fichier ouvert (${figma.fileKey})`);
}
const mine = RECORDS.filter(r => r.fileKey === FILE_KEY && (INCLUDE_SKIPPED || !r.skipByDefault));
const pages = [...new Set(mine.map(r => r.pageId))];
if (!mine.length) return { fileKey: FILE_KEY, message: 'Aucun releve a traiter pour ce fichier', pages: [] };
const pageId = PAGE_ID || (pages.length === 1 ? pages[0] : null);
if (!pageId) return { fileKey: FILE_KEY, message: 'Plusieurs pages : relancer avec PAGE_ID', pages };

figma.skipInvisibleInstanceChildren = false;
const page = await figma.getNodeByIdAsync(pageId);
if (!page) throw new Error(`Page ${pageId} introuvable`);
await figma.setCurrentPageAsync(page);

// Retrouve un descendant par chemin de noms relatif ("A/B/C").
const byPath = (root, rel) => {
  let cur = root;
  for (const name of rel.split('/')) {
    if (!cur || !('children' in cur)) return null;
    cur = cur.children.find(c => c.name === name) || null;
  }
  return cur;
};
const setKeyOf = async inst => {
  const m = await inst.getMainComponentAsync();
  if (!m) return null;
  return m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent.key : m.key;
};

const report = { fileKey: FILE_KEY, pageId, dryRun: DRY_RUN, changed: [], unchanged: [], problems: [], mutatedNodeIds: [] };
// Les instances les moins imbriquees d'abord, pour que les surcharges plus profondes restent prioritaires.
const work = mine.filter(r => r.pageId === pageId)
  .flatMap(r => r.links.map(l => ({ r, l })))
  .sort((a, b) => a.l.linkId.split(';').length - b.l.linkId.split(';').length);

for (const { r, l } of work) {
  let link = await figma.getNodeByIdAsync(l.linkId);
  if (!link) {
    const inst = await figma.getNodeByIdAsync(r.instanceId);
    link = inst ? byPath(inst, l.linkRelPath) : null;
  }
  if (!link || link.type !== 'INSTANCE') { report.problems.push({ linkId: l.linkId, issue: 'Link introuvable' }); continue; }
  const key = await setKeyOf(link);
  if (key === OLD_LINK_SET_KEY) { report.problems.push({ linkId: link.id, issue: 'Encore l\'ancien Link : mise a jour de librairie non acceptee ?' }); continue; }
  if (key !== NEW_LINK_SET_KEY) report.problems.push({ linkId: link.id, issue: `Cle de Link inattendue ${key}` });
  const label = link.children.find(c => c.type === 'TEXT' && c.name === 'Label')
    || link.findOne(c => c.type === 'TEXT' && c.name === 'Label');
  if (!label) { report.problems.push({ linkId: link.id, issue: 'Calque Label introuvable' }); continue; }
  const needText = label.characters !== l.text;
  const needVis = RESTORE_VISIBILITY && label.visible !== l.textVisible;
  if (!needText && !needVis) { report.unchanged.push({ labelId: label.id, text: l.text }); continue; }
  report.changed.push({ labelId: label.id, from: label.characters, to: l.text, visible: needVis ? l.textVisible : undefined });
  if (DRY_RUN) continue;
  if (needText) {
    const fonts = label.characters.length
      ? label.getStyledTextSegments(['fontName']).map(s => s.fontName)
      : [label.fontName];
    for (const f of fonts) if (f && typeof f === 'object') await figma.loadFontAsync(f);
    label.characters = l.text;
  }
  if (needVis) label.visible = l.textVisible;
  report.mutatedNodeIds.push(label.id);
}
return report;
