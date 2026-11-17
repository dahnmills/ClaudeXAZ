// Build one Playwright run_code file that fills several ZeroHeight pages.
// Usage: node build-batch.js <pages.json> <picks.json> <mdDir> <out.js>
// pages.json: [{title, md, slug, tabs:{Overview:id,...}}] ; picks.json: {mdName:{phrase,typesHeading,rows:[[want,[names],why]]}}
const fs = require('fs'), path = require('path'), cp = require('child_process');
const [,, pagesPath, picksPath, mdDir, out] = process.argv;
const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
const picks = JSON.parse(fs.readFileSync(picksPath, 'utf8'));
// page ids known in ZeroHeight (id6 of /p/<id6>)
const ids = {'Button':'20fe33','Button Icon':'64532a','Button Split':'61a7c2','Segmented Control':'374036','Tag':'4114ba','Flyout Menu':'89e8ce','Flyout Menu Item':'380978','Crumb':'0405bc','Button Load More':'72f9cd','Breadcrumb':'80837a','Button Range':'948da2','Chip':'030ec1','Pagination':'4590c9','Tab':'99e610','Tile':'510534','Stepper':'825623','Visual Button':'828964','Link':'52632d','Keycap':'1032c3','Shortcut Keys':'49b237','Shortcut Row':'164dda','Keyboard Map':'91c535','Flag':'756efd','Action Card':'43b236','Pie Chart':'11c6d1','Page Title':'67bb7a','Filter Drawer':'90fb55','Spotlight':'54d83f','Shortcuts Panel':'04b0e6','Search Bar Home':'3449f9','Search Bar Multi':'15d363','Tag Filter Chip':'99e410','Grid Selection':'56f3ef','File Upload':'879591','Badge':'368b0f'};
for (const p of pages) ids[p.title] = p.slug.split('-')[0];
const tool = path.join(__dirname, 'md-to-zh.js');
const batch = [];
for (const p of pages) {
  const pk = picks[p.md]; const own = p.title;
  const resolved = pk && Object.assign({}, pk, { rows: pk.rows.map(([want, names, why]) => [want, names.map(n => n === own ? [n + ' (this page)'] : (ids[n] ? [n, ids[n]] : [n])), why]) });
  const pickFile = path.join(path.dirname(out), p.md + '-pick.json'); if (resolved) fs.writeFileSync(pickFile, JSON.stringify(resolved));
  const json = cp.execFileSync('node', [tool, path.join(mdDir, p.md + '.md')].concat(resolved ? [pickFile] : []), { encoding: 'utf8', maxBuffer: 1 << 26 });
  batch.push({ slug: p.slug, tabs: p.tabs, data: JSON.parse(json) });
}
const code = `async (page) => {
  const batch = ${JSON.stringify(batch)};
  const B = 'https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/';
  const report = [];
  for (const pg of batch) {
    const log = [];
    for (const [name, id] of Object.entries(pg.tabs)) {
      await page.goto(B + pg.slug + '/b/' + id); await page.waitForTimeout(3500);
      if (/login/.test(page.url())) return {error: 'login', report};
      const r = await page.evaluate(({nodes, intro, first}) => {
        const eds = [...document.querySelectorAll('.ProseMirror')].map(e => e.editor).filter(Boolean);
        const out = {};
        try {
          const ed = eds[eds.length - 1]; const s = ed.schema; const missing = new Set();
          const walk = n => { if (!s.nodes[n.type]) missing.add(n.type); (n.marks || []).forEach(m => { if (!s.marks[m.type]) missing.add('mark:' + m.type); }); (n.content || []).forEach(walk); };
          nodes.forEach(walk);
          if (missing.size) { out.missing = [...missing]; return out; }
          if (ed.state.doc.textContent.trim().length > 0) { out.skipped = 1; return out; }
          if (first && eds.length > 1 && !eds[0].state.doc.textContent.trim()) eds[0].commands.setContent({type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: intro}]}]}, true);
          ed.commands.setContent({type: 'doc', content: nodes}, true); out.blocks = ed.state.doc.childCount;
        } catch (e) { out.err = String(e).slice(0, 200); }
        return out;
      }, {nodes: pg.data.tabs[name], intro: pg.data.intro, first: name === 'Overview'});
      log.push(name[0] + ':' + JSON.stringify(r));
      await page.waitForTimeout(5500);
    }
    report.push(pg.slug + ' ' + log.join(' '));
  }
  return report;
}`;
fs.writeFileSync(out, code); console.log('written', out, code.length);
