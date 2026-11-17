// Tutorial films: source material. Drives the real prototype (Angular dev server) with Edge and takes screenshots
// of the real ds-* components, in the states the config asks for. Nothing is drawn by hand: inputs are set on the
// live component instances (signal inputs), hover / press / focus are real pointer and keyboard events.
// Usage: node capture.js <component>   (config: ../components/<component>.config.js)
// Output: ../../<component>/work/shots/*.png + shots.json (CSS-px rect and capture scale of every shot)
const fs = require('fs'), path = require('path');
const { chromium } = require(process.env.PW || 'C:/Users/JDAHAN/AppData/Local/Temp/figma-ref/node_modules/playwright-core');

const name = process.argv[2];
if (!name) { console.log('usage: node capture.js <component>'); process.exit(1); }
const cfg = require(path.resolve(__dirname, '../components', `${name}.config.js`));
const BASE = process.env.BASE || cfg.capture.base || 'http://localhost:4450/#';
const out = path.resolve(__dirname, '../..', cfg.id, 'work/shots');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const shots = {};

// Helpers available in the page as window.__t
const INIT = () => {
  const SIG = o => Object.getOwnPropertySymbols(o).find(s => String(s) === 'Symbol(SIGNAL)');
  window.__t = {
    // set a signal input on a live component and run change detection
    setIn(el, k, v) { const c = ng.getComponent(el); const n = c[k][SIG(c[k])]; n.applyValueToInputSignal(n, v); ng.applyChanges(el); },
    // white stage over the page; components are moved into it (they stay alive and keep their styles)
    stage(css = '') {
      let st = document.getElementById('__stage');
      if (!st) { st = document.createElement('div'); st.id = '__stage'; document.body.appendChild(st); }
      st.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#fff;display:flex;gap:48px;align-items:center;justify-content:center;' + css;
      return st;
    },
    adopt(el, { label, keepIcons = true, inputs = {} } = {}) {
      __t.stage().appendChild(el);
      for (const [k, v] of Object.entries(inputs)) __t.setIn(el, k, v);
      if (!keepIcons) el.querySelectorAll('ds-icon').forEach(i => i.remove());
      if (label != null) { const l = el.querySelector('[class$="__label"]') || el; l.textContent = label; }
      el.id = el.id || ('__a' + Math.random().toString(36).slice(2, 7));
      return '#' + el.id;
    },
    rect(sel) { const e = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; },
    union(sels) { const rs = sels.map(s => __t.rect(s)).filter(Boolean); const x = Math.min(...rs.map(r => r.x)), y = Math.min(...rs.map(r => r.y)); return { x, y, w: Math.max(...rs.map(r => r.x + r.w)) - x, h: Math.max(...rs.map(r => r.y + r.h)) - y }; },
    // freeze every CSS animation under sel at time t (ms): real frames of a spinner, a skeleton...
    freeze(sel, t) { const e = document.querySelector(sel); (e ? e.getAnimations({ subtree: true }) : []).forEach(a => { a.pause(); a.currentTime = t; }); },
  };
};

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  let ctx, page;
  const h = {
    // open a route in a fresh page. vp: viewport in CSS px, dpr: capture scale
    async go(route, { vp = [1440, 810], dpr = 4, wait = 1500 } = {}) {
      if (ctx) await ctx.close();
      ctx = await browser.newContext({ viewport: { width: vp[0], height: vp[1] }, deviceScaleFactor: dpr });
      await ctx.addInitScript(INIT);
      page = await ctx.newPage();
      page.on('pageerror', e => console.log('pageerror:', e.message));
      await page.goto(BASE + route); await page.waitForLoadState('networkidle'); await page.waitForTimeout(wait);
      await page.addStyleTag({ content: '::-webkit-scrollbar{display:none} *{caret-color:transparent!important}' });
      h.page = page; h.dpr = dpr; h.vp = vp;
      return page;
    },
    eval: (fn, arg) => page.evaluate(fn, arg),
    wait: ms => page.waitForTimeout(ms),
    // screenshot of one element (or a rect), with a margin (focus ring, shadow). Same clip for every state of a set.
    async shot(id, target, { pad = 12, clip } = {}) {
      const r = clip || await page.evaluate(s => __t.rect(s), target);
      if (!r) throw new Error(`shot ${id}: nothing at ${target}`);
      const c = { x: Math.floor(r.x - pad), y: Math.floor(r.y - pad), w: Math.ceil(r.w + 2 * pad), h: Math.ceil(r.h + 2 * pad) };
      await page.screenshot({ path: path.join(out, `${id}.png`), clip: { x: c.x, y: c.y, width: c.w, height: c.h } });
      shots[id] = { ...c, dpr: h.dpr };
      console.log('shot', id, `${c.w}x${c.h}`);
      return c;
    },
    async clipOf(target, pad = 12) { const r = await page.evaluate(s => __t.rect(s), target); return { x: r.x - pad, y: r.y - pad, w: r.w + 2 * pad, h: r.h + 2 * pad }; },
    // full viewport, plus named rects measured in the same state (for the cursor, the camera and the callouts)
    async screen(id, rects = {}) {
      await page.screenshot({ path: path.join(out, `${id}.png`) });
      const m = await page.evaluate(rs => Object.fromEntries(Object.entries(rs).map(([k, s]) => [k, Array.isArray(s) ? __t.union(s) : __t.rect(s)])), rects);
      shots[id] = { x: 0, y: 0, w: h.vp[0], h: h.vp[1], dpr: h.dpr, rects: m };
      console.log('screen', id, Object.keys(m).filter(k => !m[k]).map(k => `missing rect ${k}`).join(' '));
    },
    // real pointer and keyboard
    async hover(sel) { await page.hover(sel); await page.waitForTimeout(350); },
    async away() { await page.mouse.move(2, 2); await page.waitForTimeout(350); },
    async press(sel) { const b = await page.locator(sel).first().boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(250); },
    async release() { await page.mouse.move(2, 2); await page.mouse.up(); await page.waitForTimeout(350); },
    async click(sel) { await page.locator(sel).first().click(); await page.waitForTimeout(500); },
    async keyFocus(sel) { await page.keyboard.press('Shift'); await page.evaluate(s => document.querySelector(s).focus(), sel); await page.waitForTimeout(300); },
    async blur() { await page.evaluate(() => document.activeElement && document.activeElement.blur()); },
    // n frames of a looping CSS animation (period in ms), named id-0 ... id-(n-1)
    async frames(id, sel, n, period, clip) {
      for (let i = 0; i < n; i++) { await page.evaluate(([s, t]) => __t.freeze(s, t), [sel, period * i / n]); await h.shot(`${id}-${i}`, sel, { clip, pad: 0 }); }
      shots[id] = { frames: n, period };
    },
  };
  await cfg.capture.run(h);
  fs.writeFileSync(path.join(out, 'shots.json'), JSON.stringify(shots, null, 1));
  await browser.close();
  console.log('done', Object.keys(shots).length, 'shots in', out);
})().catch(e => { console.error(e); process.exit(1); });
