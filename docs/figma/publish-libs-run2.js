// Publish the Qirin Figma libraries from Figma web (Playwright MCP, browser_run_code_unsafe with filename).
// MODE 'dry': opens each Publish dialog, reads changes (added / modified / removed names), then Cancel.
// MODE 'publish': same, then publishes with the description. Removals are allowed only if every removed
// name is in EXPECTED_REMOVED for that library (otherwise that library is skipped).
async (page) => {
  const MODE = 'publish';
  const LIBS = [
    { name: 'Action', key: 'xCeEJPn6fliEshuE9fnrqs' },
    { name: 'Data Entry', key: '1wVY9FfjONIX6us9JmIm7U' },
    { name: 'Data Display', key: 'VpConH5AUGyCqtp8PMqj1i' },
    { name: 'Feedback', key: 'fH3vmSNZR8r0sU3kN455CD' },
    { name: 'Layout', key: 'bbgSPUChd18EVNGijjoZGn' },
  ];
  const EXPECTED_REMOVED = {};
  const DESC = '2026-11-17: nested library updates accepted (Qirin libraries and Tokens only, external libraries left pending). No removals.';

  const report = [];
  const openLibs = async () => {
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Main menu' }).first().click(); await page.waitForTimeout(900);
    await page.getByRole('menuitem', { name: 'Libraries' }).first().click(); await page.waitForTimeout(3000);
  };
  for (const L of LIBS) {
    const r = { lib: L.name };
    await page.goto('https://www.figma.com/design/' + L.key); await page.waitForTimeout(15000);
    if (/login/.test(page.url())) { r.error = 'login'; report.push(r); return report; }
    await openLibs();
    const btn = page.getByRole('button', { name: 'Publish this file' });
    if (!(await btn.count())) { r.error = 'no publish button (nothing to publish?)'; report.push(r); await page.keyboard.press('Escape'); continue; }
    await btn.first().click(); await page.waitForTimeout(4000);
    const dlg = page.getByRole('dialog').filter({ hasText: 'Publish library' });
    // expand every collapsed group so all rows are listed
    for (const g of await dlg.getByRole('button', { name: /Show|Expand|more/i }).all()) { try { await g.click(); } catch (e) {} }
    await page.waitForTimeout(800);
    const text = await dlg.innerText();
    r.changes = (text.match(/Changes \(\d+ of \d+\)/) || [''])[0];
    const lines = text.split('\n').map((s) => s.trim()).filter(Boolean);
    const tagged = (tag) => lines.flatMap((l, i) => (lines[i + 1] === tag ? [l] : []));
    r.added = tagged('Added'); r.removed = tagged('Removed'); r.modifiedCount = tagged('Modified').length;
    const allowed = EXPECTED_REMOVED[L.name] || [];
    const unexpected = r.removed.filter((n) => !allowed.includes(n));
    if (MODE !== 'publish' || unexpected.length) {
      if (unexpected.length && MODE === 'publish') r.error = 'unexpected removals: ' + unexpected.join(', ');
      await dlg.getByRole('button', { name: 'Cancel' }).click(); report.push(r); continue;
    }
    await dlg.getByRole('textbox', { name: 'Description of changes (optional)' }).fill(DESC.replace('<lib>', L.name.toLowerCase().replace(' ', '-')));
    await dlg.getByRole('button', { name: 'Publish', exact: true }).click();
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(4000); const t = await page.$$eval('[role="dialog"]', (ds) => ds.map((d) => d.innerText).join(' ')); if (!/Publishing/.test(t)) break; }
    await openLibs();
    r.after = await page.$$eval('[role="dialog"]', (ds) => ds.map((d) => d.innerText.replace(/\s+/g, ' ')).join(' | ').slice(0, 300));
    r.published = true;
    await page.keyboard.press('Escape');
    report.push(r);
  }
  return report;
}
