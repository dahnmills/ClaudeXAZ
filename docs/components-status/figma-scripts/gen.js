// usage: node gen.js <pageKey> <batchIdx> [batchSize] [tableId]
const fs = require('fs'), path = require('path');
const D = require('C:/Users/JDAHAN/Documents/Qirin-Claude/docs/components-status/components.json');
const lib = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8');
const tbl = fs.readFileSync(path.join(__dirname, 'table.js'), 'utf8');
const PAGES = {
  action: { id: '6:3', title: 'Action', cats: ['action'] },
  entry: { id: '6:4', title: 'Data entry', cats: ['data-entry'] },
  display: { id: '6:5', title: 'Data display', cats: ['data-display'] },
  feedback: { id: '6:6', title: 'Feedback', cats: ['feedback'] },
  layout: { id: '6:7', title: 'Layout', cats: ['layout'] },
  nav: { id: '6:8', title: 'Navigation and overlay', cats: ['navigation', 'overlay', 'other'] },
  local: { id: '6:9', title: 'Local components', cats: ['local'] },
};
const FEATS = [['local-search-', 'Search'], ['local-buyer-summary-', 'Buyer Summary'], ['local-coverbook-', 'Coverbook'], ['local-reject-management-', 'Reject Management'], ['local-manual-underwriting-', 'Manual Underwriting'], ['local-exposure-card', 'Exposure Card']];
const feat = c => { for (const [p, n] of FEATS) if (c.id.startsWith(p)) return n; return 'Other'; };
const FORDER = ['Search', 'Buyer Summary', 'Coverbook', 'Reject Management', 'Manual Underwriting', 'Exposure Card', 'Other'];
const [pk, bi, bs, tid] = [process.argv[2], +process.argv[3] || 0, +process.argv[4] || 15, process.argv[5]];
const P = PAGES[pk];
let comps = D.components.filter(c => P.cats.includes(c.category));
const nm = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
if (pk === 'local') comps.sort((a, b) => FORDER.indexOf(feat(a)) - FORDER.indexOf(feat(b)) || nm(a, b));
else comps.sort(nm);
// preview keys
const PK = [];
const rowOf = c => {
  const key = c.category !== 'local' && c.figma && c.figma.componentKey;
  let ki = -1;
  if (key) { ki = PK.indexOf(key); if (ki < 0) { PK.push(key); ki = PK.length - 1; } }
  const sb = c.storybook && c.storybook.vibecodedUrl ? c.storybook.vibecodedUrl.split('?path=/')[1] : '';
  const sel = c.selector || (c.category === 'local' ? 'Local, ' + feat(c) : 'Figma only');
  const a = c.availability;
  return [c.name, sel, c.level, c.description, (a.design ? '1' : '0') + (a.vibecoded ? '1' : '0') + (a.dev ? '1' : '0'),
    c.figma && c.figma.url || '', sb, c.zeroheight && c.zeroheight.url || '', c.version, c.state, c.lastChange, c.commentary || '', ki];
};
const ALLROWS = []; let lastG = null;
for (const c of comps) {
  if (pk === 'local') { const g = feat(c); if (g !== lastG) { ALLROWS.push(g); lastG = g; } }
  ALLROWS.push(rowOf(c));
}
// per-row key table must be global to the page: precomputed above in rowOf
const batches = []; for (let i = 0; i < ALLROWS.length; i += bs) batches.push(ALLROWS.slice(i, i + bs));
if (bi >= batches.length) { console.log('NO BATCH; batches=' + batches.length); process.exit(0); }
const rows = batches[bi];
const need = [...new Set(rows.filter(r => Array.isArray(r) && r[12] >= 0).map(r => r[12]))];
const maxName = Math.max(...comps.map(c => c.name.length), 4);
const nameW = Math.max(200, Math.round(maxName * 8.6 + 28 + 16));
const cols = [
  { k: 'preview', h: 'Preview', w: 128 }, { k: 'name', h: 'Name', w: nameW }, { k: 'level', h: 'Level', w: 112 },
  { k: 'desc', h: 'Description', w: 340 }, { k: 'avail', h: 'Availability', w: 260 }, { k: 'figma', h: 'Figma', w: 96 },
  { k: 'sbv', h: 'Storybook vibecoded', w: 200 }, { k: 'sbd', h: 'Storybook dev', w: 160 }, { k: 'zh', h: 'ZeroHeight', w: 130 },
  { k: 'ver', h: 'Version', w: 104 }, { k: 'state', h: 'State', w: 128 }, { k: 'last', h: 'Last change', w: 140 }, { k: 'com', h: 'Comment', w: 360 },
];
const totalW = cols.reduce((s, c) => s + c.w, 0);
const keyMap = {}; need.forEach(i => keyMap[i] = PK[i]);
const driver = `
const PAGE_ID=${JSON.stringify(P.id)},TITLE=${JSON.stringify(P.title)},COLS=${JSON.stringify(cols)},TW=${totalW},COUNT=${comps.length},TID=${JSON.stringify(tid || null)},KEYS=${JSON.stringify(keyMap)};
const ROWS=${JSON.stringify(rows)};
await ld();
await figma.setCurrentPageAsync(await figma.getNodeByIdAsync(PAGE_ID));
const PSETS={};const fails=[];
for(const[i,k]of Object.entries(KEYS)){try{PSETS[i]=await figma.importComponentSetByKeyAsync(k)}catch(e){try{PSETS[i]=await figma.importComponentByKeyAsync(k)}catch(e2){fails.push('import '+k)}}}
for(const c of [...figma.currentPage.children])if(!TID)c.remove();
let table,wrap;
if(!TID){
 wrap=af('Component Status / '+TITLE,'VERTICAL',{px:'xl',py:'x3',g:'l',fill:'bgMain'});wrap.layoutSizingHorizontal='FIXED';wrap.resize(1280,wrap.height);wrap.x=200;wrap.y=200;
 const hd=af('Heading','VERTICAL',{g:'xs'});wrap.appendChild(hd);hd.layoutSizingHorizontal='FILL';
 hd.appendChild(await tx(TITLE,'h2','tPri',{name:'Title'}));hd.appendChild(await tx(COUNT+' components, sorted by name. Scroll the table sideways for every column.','lR','tSec',{name:'Subtitle'}));
 const vp=af('Table viewport','VERTICAL',{fill:'bgMain',bd:'bdr',r:'rM'});wrap.appendChild(vp);vp.layoutSizingHorizontal='FILL';vp.clipsContent=true;vp.overflowDirection='HORIZONTAL';
 table=af('Table','VERTICAL');vp.appendChild(table);table.layoutSizingHorizontal='FIXED';table.resize(TW,table.height);
 await mkHeader(table,COLS);
}else{table=await figma.getNodeByIdAsync(TID);}
const ids=[];
for(const r of ROWS){if(typeof r==='string'){ids.push((await mkGroup(table,r)).id)}else{ids.push((await mkRow(table,COLS,r,PSETS,fails)).id)}}
return {wrap:wrap&&wrap.id,table:table.id,tableH:Math.round(table.height),tableW:Math.round(table.width),rows:ids.length,rowH:table.children.slice(-1)[0].height,fails,batchOf:'${bi + 1}/${batches.length}'};
`;
const out = lib + '\n' + tbl + '\n' + driver;
fs.writeFileSync(path.join(__dirname, `out_${pk}_${bi}.js`), out);
console.log(pk, 'batch', bi + 1, '/', batches.length, 'rows', rows.length, 'chars', out.length, 'total comps', comps.length, 'PK', PK.length);
