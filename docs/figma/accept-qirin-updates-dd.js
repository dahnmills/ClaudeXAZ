// Accept ONLY the updates from the 5 Qirin libraries and Tokens (decision 2026-11-17 16:40), never NDBX, A1, CM
// or qirin--variables. Figma web, Playwright MCP (browser_run_code_unsafe with filename).
// Per file: Libraries > Updates > "Show updates for all pages", then click every "Update instances of X" button
// that sits under an "Updates from <allowed library>" heading, one at a time (the list re-renders after each).
async (page) => {
  const FILES = [
    ['Feedback', 'fH3vmSNZR8r0sU3kN455CD'], ['Data Entry', '1wVY9FfjONIX6us9JmIm7U'], ['Data Display', 'VpConH5AUGyCqtp8PMqj1i'],
    ['Layout', 'bbgSPUChd18EVNGijjoZGn'], ['Action', 'xCeEJPn6fliEshuE9fnrqs'],
    ['Coverbook', 'NflKzgx17mOn2JPoFaqnjW'], ['Reject Management', 'zUzOSE77EjbShM9u7yLthB'], ['Manual Underwriting', '9EXkGvyk2yGF9qFpRpV0Ey'],
    ['Search', 'LBLqJmlPqXmx9qksCyYGPb'], ['Buyer Summary', '0ZjZu0OjHdzGowm3hliM2M'], ['Exposure Card', '5OVzA6FZD7o8aGtfK5qo7g'],
    ['Component Status', 'wqlQIlGhJmMCfgc2XD1Umm'], ['ZeroHeight showcase', 'FS7qNdQx4Qyo9CkBgIWRMi'],
  ];
  const ONLY = ['Data Display'];
  const ALLOWED = /^(\[Components\] (Action|Feedback|Data Entry|Data Display|Layout)|Tokens)$/;
  page.on('dialog', async (d) => { try { await d.dismiss(); } catch (e) {} });
  const report = [];

  const openUpdates = async () => {
    await page.keyboard.press('Escape');
    const mm = page.getByRole('button', { name: 'Main menu' }).first(); await mm.waitFor({ timeout: 90000 }); await mm.click(); await page.waitForTimeout(900);
    await page.getByRole('menuitem', { name: 'Libraries' }).first().click(); await page.waitForTimeout(3500);
    const tab = page.getByRole('tab', { name: /Updates/ });
    if (await tab.count()) { await tab.first().click(); await page.waitForTimeout(2500); }
    // toggle: switch it on only when it is off (the panel then says there may be updates on other pages)
    const t0 = await page.$$eval('[role=dialog]', (ds) => ds.map((d) => d.innerText).join(' '));
    if (/There may be updates available on other pages/.test(t0)) { await page.getByText(/Show updates for all pages/).first().click(); await page.waitForTimeout(6000); }
  };
  // In DOM order: headings "Updates from X" and buttons "Update instances of Y" -> [{lib, item, idx}]
  const scan = () => page.evaluate(() => {
    const d = [...document.querySelectorAll('[role=dialog]')].find((x) => /Manage libraries/.test(x.innerText)); if (!d) return [];
    const out = []; let lib = null; let idx = 0;
    const walker = document.createTreeWalker(d, NodeFilter.SHOW_ELEMENT);
    for (let n = walker.currentNode; n; n = walker.nextNode()) {
      if (n.tagName === 'H3' && /^Updates from /.test((n.textContent || '').trim())) lib = n.textContent.trim().replace(/^Updates from /, '');
      if (n.tagName === 'BUTTON') {
        const a = n.getAttribute('aria-label') || '';
        if (/^Update instances of /.test(a)) { n.setAttribute('data-qirin-upd', String(idx)); out.push({ lib, item: a.replace(/^Update instances of /, ''), idx }); idx++; }
      }
    }
    return out;
  });

  for (const [name, key] of FILES) {
    if (ONLY && !ONLY.includes(name)) continue;
    const r = { file: name, updated: [], skippedExternal: [] };
    for (let i = 0; i < 6; i++) { try { await page.goto('https://www.figma.com/design/' + key, { timeout: 30000 }); } catch (e) {} await page.waitForTimeout(4000); if (page.url().includes(key)) break; await page.waitForTimeout(15000); }
    await page.waitForTimeout(12000);
    if (/login/.test(page.url())) { r.error = 'login'; report.push(r); return report; }
    await openUpdates();
    for (let guard = 0; guard < 120; guard++) {
      const hit = await page.evaluate((allowedSrc) => {
        const allowed = new RegExp(allowedSrc);
        const d = [...document.querySelectorAll('[role=dialog]')].find((x) => /Manage libraries/.test(x.innerText)); if (!d) return { none: true, rest: [] };
        let lib = null; const rest = [];
        const walker = document.createTreeWalker(d, NodeFilter.SHOW_ELEMENT);
        for (let n = walker.currentNode; n; n = walker.nextNode()) {
          if (n.tagName === 'H3' && /^Updates from /.test((n.textContent || '').trim())) lib = n.textContent.trim().replace(/^Updates from /, '');
          if (n.tagName === 'BUTTON' && /^Update instances of /.test(n.getAttribute('aria-label') || '')) {
            const item = n.getAttribute('aria-label').replace(/^Update instances of /, '');
            if (lib && allowed.test(lib) && !n.disabled) { n.click(); return { lib, item }; }
            rest.push(lib + ': ' + item);
          }
        }
        return { none: true, rest };
      }, ALLOWED.source);
      if (hit.none && !hit.rest.length && (r.retries = (r.retries || 0) + 1) <= 3) { await page.waitForTimeout(5000); await openUpdates(); continue; }
      if (hit.none) { r.skippedExternal = [...new Set(hit.rest)]; break; }
      r.updated.push(hit.lib.replace('[Components] ', '') + ': ' + hit.item);
      for (let w = 0; w < 30; w++) { await page.waitForTimeout(2000); const t = await page.$$eval('[role="dialog"]', (ds) => ds.map((x) => x.innerText).join(' ')); if (!/Updating/i.test(t)) break; }
      await page.waitForTimeout(1500);
      if (!(await page.locator('[role=dialog]').count())) await openUpdates();
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(20000); // let the save finish before leaving
    report.push(r);
  }
  return report;
}
