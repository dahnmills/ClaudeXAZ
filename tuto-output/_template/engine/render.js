// Tutorial films: frames from the composition. seek(t) per frame, screenshot 1920 x 1080.
// Usage: node render.js <component> stills 1.5 8 20   -> ../../<component>/work/stills/t1.50.jpg ...
//        node render.js <component> check               -> one-line / safe-area check every 0.25 s, prints the faults
//        node render.js <component> frames [from:to]    -> ../../<component>/work/frames/f00000.jpg ... (run ranges in parallel)
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require(process.env.PW || 'C:/Users/JDAHAN/AppData/Local/Temp/figma-ref/node_modules/playwright-core');

const [name, mode = 'stills', ...args] = process.argv.slice(2);
const cfg = require(path.resolve(__dirname, '../components', `${name}.config.js`));
const work = path.resolve(__dirname, '../..', cfg.id, 'work');
const shotsDir = path.join(work, 'shots');
const PORT = Number(process.env.PORT || 4470 + Math.floor(Math.random() * 20));
const { capture, ...content } = cfg;

const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  const p = u.startsWith('/shots/') ? path.join(shotsDir, u.slice(7)) : path.join(__dirname, 'comp.html');
  r.writeHead(200, { 'Content-Type': p.endsWith('.png') ? 'image/png' : 'text/html' });
  fs.createReadStream(p).pipe(r);
}).listen(PORT);

(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: Number(process.env.SCALE || 1) });
  await ctx.addInitScript(`window.CFG = ${JSON.stringify(content)}; window.SHOTS = ${fs.readFileSync(path.join(shotsDir, 'shots.json'), 'utf8')};`);
  const page = await ctx.newPage();
  page.on('console', m => (m.type() === 'error' || m.type() === 'warning') && console.log('console:', m.text()));
  page.on('pageerror', e => console.log('pageerror:', e.message));
  await page.goto(`http://localhost:${PORT}/`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.ready());
  await page.evaluate(() => window.seek(0));
  await page.waitForTimeout(300);
  const FPS = cfg.fps, total = Math.round(FPS * cfg.duration);

  if (mode === 'check') {
    const faults = new Map();
    for (let t = 0; t <= cfg.duration; t += .25) for (const f of await page.evaluate(t => (seek(t), check()), t)) if (!faults.has(f)) faults.set(f, t);
    console.log(faults.size ? [...faults].map(([f, t]) => `t=${t}: ${f}`).join('\n') : 'check: every line fits, on one line, inside the safe area');
  } else if (mode === 'stills') {
    const dir = path.join(work, 'stills'); fs.mkdirSync(dir, { recursive: true });
    for (const s of args.map(Number)) { await page.evaluate(t => seek(t), s); await page.screenshot({ path: path.join(dir, `t${s.toFixed(2)}.jpg`), type: 'jpeg', quality: 92 }); }
    console.log('stills in', dir);
  } else {
    const dir = path.join(work, 'frames'); fs.mkdirSync(dir, { recursive: true });
    const [a, b] = (args[0] || `0:${total - 1}`).split(':').map(Number);
    const t0 = Date.now();
    for (let f = a; f <= Math.min(b, total - 1); f++) {
      await page.evaluate(t => seek(t), f / FPS);
      await page.screenshot({ path: path.join(dir, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 93 });
      if (f % 300 === 0) console.log('frame', f, ((Date.now() - t0) / 1000).toFixed(0) + 's');
    }
  }
  await browser.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
