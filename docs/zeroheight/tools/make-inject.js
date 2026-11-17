// Build a Playwright run_code file that writes a page's tabs into ZeroHeight.
// Usage: node make-inject.js <data.json> <pageSlug> <tabsJson> <out.js>
// tabsJson: {"Overview":"<b-id>","Usage":"<b-id>",...}
const fs = require('fs');
const [,, dataPath, slug, tabsArg, out] = process.argv;
const data = fs.readFileSync(dataPath, 'utf8');
const tabs = JSON.parse(tabsArg);
const code = `async (page) => {
  const data = ${data};
  const B = 'https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/${slug}/b/';
  const tabs = ${JSON.stringify(tabs)};
  const log = [];
  for (const [name, id] of Object.entries(tabs)) {
    await page.goto(B + id); await page.waitForTimeout(3500);
    if (/login/.test(page.url())) return {error: 'login'};
    const r = await page.evaluate(({nodes, intro, first}) => {
      const eds = [...document.querySelectorAll('.ProseMirror')].map(e => e.editor).filter(Boolean);
      const out = {eds: eds.length};
      try {
        const ed = eds[eds.length - 1]; const s = ed.schema; const missing = new Set();
        const walk = n => { if (!s.nodes[n.type]) missing.add(n.type); (n.marks || []).forEach(m => { if (!s.marks[m.type]) missing.add('mark:' + m.type); }); (n.content || []).forEach(walk); };
        nodes.forEach(walk);
        if (missing.size) { out.missing = [...missing]; return out; }
        if (ed.state.doc.textContent.trim().length > 0) { out.skipped = 'tab not empty'; return out; }
        if (first && eds.length > 1 && !eds[0].state.doc.textContent.trim()) { eds[0].commands.setContent({type: 'doc', content: [{type: 'paragraph', content: [{type: 'text', text: intro}]}]}, true); out.intro = 'ok'; }
        ed.commands.setContent({type: 'doc', content: nodes}, true); out.blocks = ed.state.doc.childCount;
      } catch (e) { out.err = String(e).slice(0, 300); }
      return out;
    }, {nodes: data.tabs[name], intro: data.intro, first: name === 'Overview'});
    log.push(Object.assign({name}, r));
    await page.waitForTimeout(5500);
  }
  const ver = [];
  for (const [name, id] of Object.entries(tabs)) {
    await page.goto(B + id); await page.waitForTimeout(3500);
    ver.push(await page.evaluate(name => { const eds = [...document.querySelectorAll('.ProseMirror')].map(e => e.editor).filter(Boolean); return name + ': intro=' + eds[0].state.doc.textContent.slice(0, 25) + ' | blocks=' + eds[eds.length - 1].state.doc.childCount; }, name));
  }
  return {log, ver};
}`;
fs.writeFileSync(out, code);
console.log('written', out, code.length);
