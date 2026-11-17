// Convert a docs/zeroheight/<family>/<component>.md file into ZeroHeight (TipTap) JSON, one array of nodes per tab,
// following the Button page pattern. Usage: node md-to-zh.js <file.md> [pick.json] > out.json
// pick.json (optional): {"phrase":"...","rows":[["The user wants to", [["text"],["Link label","pageId6"]], "Why"], ...],"typesHeading":"..."}
const fs = require('fs');
const [,, mdPath, pickPath] = process.argv;
const md = fs.readFileSync(mdPath, 'utf8').replace(/\r/g, '');
const pick = pickPath ? JSON.parse(fs.readFileSync(pickPath, 'utf8')) : null;
const P = 'https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/';
const bid = () => Math.random().toString(16).slice(2, 12);

// inline: `code`, **bold**, [text](url), arrows → ":"
function inline(s) {
  s = s.replace(/ → /g, ': ').replace(/→/g, ':').replace(/ · /g, ', ');
  const out = []; const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g; let last = 0, m;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ type: 'text', text: s.slice(last, m.index) });
    const t = m[0];
    if (t[0] === '`') out.push({ type: 'text', text: t.slice(1, -1), marks: [{ type: 'code' }] });
    else if (t[0] === '*') out.push({ type: 'text', text: t.slice(2, -2), marks: [{ type: 'strong' }] });
    else { const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(t); out.push({ type: 'text', text: mm[1], marks: [{ type: 'link', attrs: { blockId: '', href: mm[2], target: '_blank', rel: 'noopener noreferrer nofollow', class: 'zheditor-a' } }] }); }
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ type: 'text', text: s.slice(last) });
  return out.filter(n => n.text.length);
}
const para = s => ({ type: 'paragraph', attrs: { blockId: bid() }, content: inline(s) });
const h2 = s => ({ type: 'heading', attrs: { blockId: bid(), level: 2 }, content: [{ type: 'text', text: s }] });
const h3 = s => ({ type: 'heading', attrs: { blockId: bid(), level: 3 }, content: [{ type: 'text', text: s }] });
const li = s => ({ type: 'listItem', attrs: { blockId: '' }, content: [para(s)] });
const ul = items => ({ type: 'bulletList', attrs: { blockId: bid() }, content: items.map(li) });
const ol = items => ({ type: 'orderedList', attrs: { blockId: bid(), start: 1 }, content: items.map(li) });
const cellOf = (content, i, n) => ({ type: 'tableCell', attrs: { blockId: '', colspan: 1, rowspan: 1, colwidth: i < n - 1 ? [200] : null, verticalTextAlignment: null, horizontalTextAlignment: null }, content: [{ type: 'paragraph', attrs: { blockId: bid() }, content }] });
const tableAttrs = () => ({ blockId: bid(), displayBorders: true, showHeader: true, stickyHeader: false, fullWidth: false, showRowBackground: false, borderStyle: 'full', horizontalTextAlignment: 'left', verticalTextAlignment: 'center' });
function table(rows) { const n = rows[0].length; return { type: 'table', attrs: tableAttrs(), content: rows.map(r => ({ type: 'tableRow', attrs: { blockId: '' }, content: r.map((c, i) => cellOf(inline(c.replace(/\\\|/g, '|')), i, n)) })) }; }

// split into sections by "## "
const lines = md.split('\n');
const title = lines[0].replace(/^# /, '').trim();
const desc = (lines.find((l, i) => i > 1 && l && !l.startsWith('**') && !l.startsWith('Figma:')) || '').trim();
const sec = {}; let cur = null;
for (const l of lines.slice(1)) { const m = /^## (.+)/.exec(l); if (m) { cur = m[1].trim(); sec[cur] = []; continue; } if (cur) sec[cur].push(l); }
// parse a section body into nodes; tables with header separator
function body(ls) {
  const out = []; let i = 0;
  while (i < ls.length) {
    const l = ls[i];
    if (!l.trim()) { i++; continue; }
    if (/^\|/.test(l)) { const rows = []; while (i < ls.length && /^\|/.test(ls[i])) { if (!/^\|\s*-/.test(ls[i])) rows.push(ls[i].replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim())); i++; } out.push(table(rows)); continue; }
    if (/^- /.test(l)) { const it = []; while (i < ls.length && /^- /.test(ls[i])) { it.push(ls[i].slice(2)); i++; } out.push(ul(it)); continue; }
    if (/^\d+\. /.test(l)) { const it = []; while (i < ls.length && /^\d+\. /.test(ls[i])) { it.push(ls[i].replace(/^\d+\. /, '')); i++; } out.push(ol(it)); continue; }
    if (/^### /.test(l)) { out.push(h3(l.slice(4))); i++; continue; }
    out.push(para(l)); i++;
  }
  return out;
}
const get = (...names) => { for (const n of names) if (sec[n]) return sec[n]; return null; };
// Overview paragraph without the "Embed the Storybook story ..." and "Figma description:" sentences
const ovText = (get('Overview') || []).join(' ').replace(/Figma description: "[^"]*"\s*/g, '').replace(/Embed the Storybook story[^.]*\.\s*/g, '').replace(/ ?Embed [^.]*\./g, '').trim();
const whenLines = get('When to use / When not to use') || [];
const use = whenLines.filter(l => /^- (?!Don't)/.test(l)).map(l => l.slice(2));
const dont = whenLines.filter(l => /^- Don't/.test(l)).map(l => l.slice(2).replace(/^Don't use /, 'Not '));

const overview = [];
if (pick) {
  overview.push(h2('Pick the right component'), para(pick.phrase));
  const rows = [[[{ type: 'text', text: 'The user wants to…' }], [{ type: 'text', text: 'Use' }], [{ type: 'text', text: 'Why' }]]];
  for (const [want, use, why] of pick.rows) rows.push([[{ type: 'text', text: want }], use.flatMap((u, k) => { const parts = []; if (k) parts.push({ type: 'text', text: ', ' }); parts.push(u[1] ? { type: 'text', text: u[0], marks: [{ type: 'link', attrs: { blockId: '', href: P + u[1], target: '_blank', rel: 'noopener noreferrer nofollow', class: 'zheditor-a' } }] } : { type: 'text', text: u[0] }); return parts; }), [{ type: 'text', text: why }]]);
  overview.push({ type: 'table', attrs: tableAttrs(), content: rows.map(r => ({ type: 'tableRow', attrs: { blockId: '' }, content: r.map((c, i) => cellOf(c, i, 3)) })) });
}
overview.push(h2(pick && pick.typesHeading || 'Overview'), para(ovText));
if (get('States')) overview.push(h2('States'), ...body(get('States')));

const usage = [];
if (use.length) usage.push(h2('When to use'), ul(use));
if (dont.length) usage.push(h2('When not to use'), ul(dont));
if (get('Do / Don\'t')) usage.push(h2('Best practices'), ...body(get('Do / Don\'t')));
if (get('Content guidelines')) usage.push(h2('Writing the labels'), ...body(get('Content guidelines')));

const specs = [];
if (get('Anatomy')) specs.push(h2('Anatomy'), ...body(get('Anatomy')));
if (get('Variants and properties', 'Properties')) specs.push(h2('Properties'), ...body(get('Variants and properties', 'Properties')));
if (get('Tokens')) specs.push(h2('Tokens'), ...body(get('Tokens')));

const codeLine = (lines.find(l => l.startsWith('Figma:')) || '').split(' · ').find(s => s.startsWith('Code:'));
const code = [h2('In code')];
if (codeLine) code.push(para(codeLine.replace(/^Code: /, 'Component ')));
if (get('Accessibility')) code.push(h2('Accessibility'), ...body(get('Accessibility')));
if (get('Design decisions')) code.push(h2('Design decisions'), ...body(get('Design decisions')));
if (get('Related components')) code.push(h2('Related components'), ...body(get('Related components')));
if (get('Changelog')) code.push(h2('Changelog'), ...body(get('Changelog')));

process.stdout.write(JSON.stringify({ title, intro: desc, tabs: { Overview: overview, Usage: usage, Specs: specs, 'Code and accessibility': code } }));
