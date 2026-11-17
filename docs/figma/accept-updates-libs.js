// Accept library updates in Figma web (Playwright MCP, browser_run_code_unsafe with filename).
// For each file: Main menu > Libraries > Updates tab > read the list > "Update all" (MODE 'apply') or just list (MODE 'dry').
async (page) => {
  const MODE = 'apply';
  const FILES = [
    // libraries first (they nest each other), then feature files
    ['Action', 'xCeEJPn6fliEshuE9fnrqs'], ['Feedback', 'fH3vmSNZR8r0sU3kN455CD'], ['Data Entry', '1wVY9FfjONIX6us9JmIm7U'],
    ['Data Display', 'VpConH5AUGyCqtp8PMqj1i'], ['Layout', 'bbgSPUChd18EVNGijjoZGn'],
    ['Coverbook', 'NflKzgx17mOn2JPoFaqnjW'], ['Reject Management', 'zUzOSE77EjbShM9u7yLthB'], ['Manual Underwriting', '9EXkGvyk2yGF9qFpRpV0Ey'],
    ['Search', 'LBLqJmlPqXmx9qksCyYGPb'], ['Buyer Summary', '0ZjZu0OjHdzGowm3hliM2M'], ['Exposure Card', '5OVzA6FZD7o8aGtfK5qo7g'],
    ['Component Status', 'wqlQIlGhJmMCfgc2XD1Umm'], ['ZeroHeight showcase', 'FS7qNdQx4Qyo9CkBgIWRMi'],
  ];
  const ONLY = ['Action', 'Feedback', 'Data Entry', 'Data Display', 'Layout'];
  const report = [];
  const dialogText = () => page.$$eval('[role="dialog"]', (ds) => ds.map((d) => d.innerText).join('\n'));
  for (const [name, key] of FILES) {
    if (ONLY && !ONLY.includes(name)) continue;
    const r = { file: name };
    await page.goto('https://www.figma.com/design/' + key); await page.waitForTimeout(15000);
    if (/login/.test(page.url())) { r.error = 'login'; report.push(r); return report; }
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Main menu' }).first().click(); await page.waitForTimeout(900);
    await page.getByRole('menuitem', { name: 'Libraries' }).first().click(); await page.waitForTimeout(3500);
    const tab = page.getByRole('tab', { name: /Updates/ });
    if (await tab.count()) { await tab.first().click(); await page.waitForTimeout(3000); }
    const t = await dialogText();
    r.updates = (t.match(/(\d+) updates?/i) || [''])[0];
    r.libs = (t.split('\n').filter((l) => /\[Components\]|Tokens|Qirin/.test(l)).slice(0, 8));
    const all = page.getByRole('button', { name: /Update all/i });
    r.hasUpdateAll = (await all.count()) > 0;
    if (MODE === 'apply' && r.hasUpdateAll) {
      await all.first().click();
      for (let i = 0; i < 45; i++) { await page.waitForTimeout(4000); const tt = await dialogText(); if (!/Updating/i.test(tt)) break; }
      await page.waitForTimeout(3000);
      r.after = ((await dialogText()).match(/(\d+) updates?|No updates|up to date/i) || ['?'])[0];
      r.applied = true;
    }
    await page.keyboard.press('Escape');
    report.push(r);
  }
  return report;
}
