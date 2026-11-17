// Accept ONLY the updates from the 5 Qirin libraries and Tokens (user decision 2026-11-17 16:40), never NDBX, A1,
// CM, Assets, [Common] or qirin--variables. Figma web, Playwright MCP (browser_run_code_unsafe with filename).
// Lessons built in:
// - the Updates tab lists only the current page: the "Show updates for all pages" switch must be ON (click it only
//   when the panel says "There may be updates available on other pages", otherwise you switch it off);
// - the Manage libraries panel can stay open across files and hides the Main menu: reuse it when it is there;
// - the list is virtualised: scroll it back to the top before each search, or headings drop out of the DOM;
// - library headings are H3 "Updates from <library>"; each item has a button "Update instances of <item>".
async (page) => {
  const FILES = [
    ['Feedback', 'fH3vmSNZR8r0sU3kN455CD'], ['Data Entry', '1wVY9FfjONIX6us9JmIm7U'], ['Data Display', 'VpConH5AUGyCqtp8PMqj1i'],
    ['Layout', 'bbgSPUChd18EVNGijjoZGn'], ['Action', 'xCeEJPn6fliEshuE9fnrqs'],
    ['Coverbook', 'NflKzgx17mOn2JPoFaqnjW'], ['Reject Management', 'zUzOSE77EjbShM9u7yLthB'], ['Manual Underwriting', '9EXkGvyk2yGF9qFpRpV0Ey'],
    ['Search', 'LBLqJmlPqXmx9qksCyYGPb'], ['Buyer Summary', '0ZjZu0OjHdzGowm3hliM2M'], ['Exposure Card', '5OVzA6FZD7o8aGtfK5qo7g'],
    ['Component Status', 'wqlQIlGhJmMCfgc2XD1Umm'], ['ZeroHeight showcase', 'FS7qNdQx4Qyo9CkBgIWRMi'],
  ];
  const ONLY = ['Coverbook', 'Reject Management', 'Manual Underwriting', 'Search', 'Buyer Summary', 'Exposure Card', 'Component Status', 'ZeroHeight showcase'];
  const ALLOWED = '^(\\[Components\\] (Action|Feedback|Data Entry|Data Display|Layout)|Tokens)$';
  page.on('dialog', async (d) => { try { await d.dismiss(); } catch (e) {} });
  const report = [];
  const libsOpen = () => page.evaluate(() => !![...document.querySelectorAll('[role=dialog]')].find((x) => /Manage libraries/.test(x.innerText)));
  const dlgText = () => page.$$eval('[role=dialog]', (ds) => ds.map((d) => d.innerText).join(' '));
  const openUpdates = async () => {
    if (!(await libsOpen())) {
      await page.keyboard.press('Escape');
      const mm = page.getByRole('button', { name: 'Main menu' }).first(); await mm.waitFor({ timeout: 90000 }); await mm.click(); await page.waitForTimeout(900);
      await page.getByRole('menuitem', { name: 'Libraries' }).first().click(); await page.waitForTimeout(3500);
    }
    const tab = page.getByRole('tab', { name: /Updates/ });
    if (await tab.count()) { await tab.first().click(); await page.waitForTimeout(2500); }
    if (/There may be updates available on other pages/.test(await dlgText())) { await page.getByText(/Show updates for all pages/).first().click(); await page.waitForTimeout(6000); }
  };
  const toTop = () => page.evaluate(() => {
    const d = [...document.querySelectorAll('[role=dialog]')].find((x) => /Manage libraries/.test(x.innerText)); if (!d) return;
    d.querySelectorAll('*').forEach((e) => { if (e.scrollHeight > e.clientHeight + 20 && e.scrollTop > 0) e.scrollTop = 0; });
  });
  const clickNext = () => page.evaluate((src) => {
    const allowed = new RegExp(src);
    const d = [...document.querySelectorAll('[role=dialog]')].find((x) => /Manage libraries/.test(x.innerText));
    if (!d) return { none: true, nodlg: true, rest: [] };
    let lib = null; const rest = [];
    const w = document.createTreeWalker(d, NodeFilter.SHOW_ELEMENT);
    for (let n = w.currentNode; n; n = w.nextNode()) {
      if (n.tagName === 'H3' && /^Updates from /.test((n.textContent || '').trim())) lib = n.textContent.trim().replace(/^Updates from /, '');
      if (n.tagName === 'BUTTON' && /^Update instances of /.test(n.getAttribute('aria-label') || '')) {
        const item = n.getAttribute('aria-label').replace(/^Update instances of /, '');
        if (lib && allowed.test(lib) && !n.disabled) { n.click(); return { lib, item }; }
        rest.push(lib + ': ' + item);
      }
    }
    return { none: true, rest };
  }, ALLOWED);

  for (const [name, key] of FILES) {
    if (ONLY && !ONLY.includes(name)) continue;
    const r = { file: name, updated: [], left: [] };
    for (let i = 0; i < 6; i++) { try { await page.goto('https://www.figma.com/design/' + key, { timeout: 30000 }); } catch (e) {} await page.waitForTimeout(4000); if (page.url().includes(key)) break; await page.waitForTimeout(15000); }
    await page.waitForTimeout(12000);
    if (/login/.test(page.url())) { r.error = 'login'; report.push(r); return report; }
    try { await openUpdates(); } catch (e) { r.error = 'could not open the Updates panel'; report.push(r); continue; }
    let empty = 0;
    for (let g = 0; g < 200; g++) {
      await toTop(); await page.waitForTimeout(700);
      const hit = await clickNext();
      if (hit.none) {
        if (hit.nodlg || (!hit.rest.length && empty < 2)) { empty++; await page.waitForTimeout(4000); try { await openUpdates(); } catch (e) {} continue; }
        r.left = [...new Set(hit.rest)]; break;
      }
      r.updated.push(hit.lib.replace('[Components] ', '') + ': ' + hit.item);
      for (let w = 0; w < 30; w++) { await page.waitForTimeout(2000); if (!/Updating/i.test(await dlgText())) break; }
      await page.waitForTimeout(1200);
    }
    r.count = r.updated.length;
    await page.waitForTimeout(20000); // let the save finish before leaving
    report.push(r);
  }
  return report;
}
