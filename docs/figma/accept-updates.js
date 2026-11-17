// Library updates in Figma web (Playwright MCP, browser_run_code_unsafe with filename). LIST ONLY (dry run).
// Per file: Main menu > Libraries > Updates > "Show updates for all pages" > read the pending updates, then close.
// The Updates tab lists only the current page by default: always switch to all pages first.
async (page) => {
  const FILES = [
    ['Action', 'xCeEJPn6fliEshuE9fnrqs'], ['Feedback', 'fH3vmSNZR8r0sU3kN455CD'], ['Data Entry', '1wVY9FfjONIX6us9JmIm7U'],
    ['Data Display', 'VpConH5AUGyCqtp8PMqj1i'], ['Layout', 'bbgSPUChd18EVNGijjoZGn'],
    ['Coverbook', 'NflKzgx17mOn2JPoFaqnjW'], ['Reject Management', 'zUzOSE77EjbShM9u7yLthB'], ['Manual Underwriting', '9EXkGvyk2yGF9qFpRpV0Ey'],
    ['Search', 'LBLqJmlPqXmx9qksCyYGPb'], ['Buyer Summary', '0ZjZu0OjHdzGowm3hliM2M'], ['Exposure Card', '5OVzA6FZD7o8aGtfK5qo7g'],
    ['Component Status', 'wqlQIlGhJmMCfgc2XD1Umm'], ['ZeroHeight showcase', 'FS7qNdQx4Qyo9CkBgIWRMi'],
  ];
  const report = [];
  page.on('dialog', async (d) => { try { await d.dismiss(); } catch (e) {} });
  const txt = () => page.$$eval('[role="dialog"]', (ds) => ds.map((d) => d.innerText.replace(/\s+/g, ' ')).join(' | '));
  for (const [name, key] of FILES) {
    const r = { file: name };
    try { await page.goto('https://www.figma.com/design/' + key, { timeout: 30000 }); } catch (e) {}
    await page.waitForTimeout(15000);
    if (/login/.test(page.url())) { r.error = 'login'; report.push(r); return report; }
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Main menu' }).first().click(); await page.waitForTimeout(900);
    await page.getByRole('menuitem', { name: 'Libraries' }).first().click(); await page.waitForTimeout(3500);
    const tab = page.getByRole('tab', { name: /Updates/ });
    if (await tab.count()) { await tab.first().click(); await page.waitForTimeout(2500); }
    const sa = page.getByText(/Show updates for all pages/);
    if (await sa.count()) { await sa.first().click(); await page.waitForTimeout(6000); }
    const t = await txt();
    r.from = [...t.matchAll(/Updates from (.+?) Published/g)].map((m) => m[1].trim());
    r.items = [...t.matchAll(/([^|]{2,60}?) (\d+) instances? Update/g)].map((m) => m[1].trim().split(' ').slice(-4).join(' ') + ' x' + m[2]);
    r.upToDate = /No updates available/.test(t) && !r.from.length;
    await page.keyboard.press('Escape');
    report.push(r);
  }
  return report;
}
