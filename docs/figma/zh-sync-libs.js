async (page) => {
  const files = [['Action','xCeEJPn6fliEshuE9fnrqs'],['Feedback','fH3vmSNZR8r0sU3kN455CD'],['Data Entry','1wVY9FfjONIX6us9JmIm7U'],['Data Display','VpConH5AUGyCqtp8PMqj1i'],['Layout','bbgSPUChd18EVNGijjoZGn']];
  const findFrame = async (re) => { for (const f of page.frames()) { try { if (await f.evaluate((s) => new RegExp(s).test(document.body ? document.body.innerText : ''), re)) return f; } catch (e) {} } return null; };
  const report = [];

  for (const [name, key] of files) {
    await page.goto('https://www.figma.com/design/' + key); await page.waitForTimeout(15000);
    await page.keyboard.press('Escape');
    await page.getByRole('button', {name: 'Main menu'}).first().click(); await page.waitForTimeout(900);
    await page.getByRole('menuitem', {name: /Actions/}).first().click(); await page.waitForTimeout(1200);
    await page.keyboard.type('zeroheight'); await page.waitForTimeout(2500);
    await page.getByRole('button', {name: 'zeroheight', exact: true}).first().click(); await page.waitForTimeout(10000);
    let p = await findFrame('Sync Options|Design sync|Sign in with zeroheight');
    if (!p) { report.push(name + ': plugin did not open'); continue; }
    const txt = await p.evaluate(() => document.body.innerText);
    if (/Sign in with zeroheight/.test(txt)) { report.push(name + ': plugin asks to sign in again'); return report; }
    if (/Sync Options/.test(txt)) { await p.getByText('Designs', {exact: true}).first().click(); await page.waitForTimeout(6000); p = await findFrame('Design sync'); }
    const before = (/Components \(\d+ items\)/.exec(await p.evaluate(() => document.body.innerText)) || [''])[0];
    await p.getByRole('button', {name: 'Sync and update all pages'}).first().click(); await page.waitForTimeout(5000);
    let t = '';
    for (let i = 0; i < 90; i++) { await page.waitForTimeout(8000); const f2 = await findFrame('Elapsed|Design sync'); if (!f2) continue; t = await f2.evaluate(() => document.body.innerText.replace(/\s+/g,' ')).catch(() => ''); const m = /(\d+) \/ (\d+) pages/.exec(t); if (m && m[1] === m[2]) break; if (!m && /Last updated/.test(t)) break; }
    await page.waitForTimeout(8000);
    const f3 = await findFrame('Elapsed|Design sync'); const fin = f3 ? await f3.evaluate(() => document.body.innerText.replace(/\s+/g,' ')).catch(() => '') : t;
    report.push(name + ': before ' + before + ' | ' + ((/\d+ \/ \d+ pages/.exec(fin) || [''])[0]) + ' ' + ((/Pages with errors \(\d+\)/.exec(fin) || [''])[0]) + ' ' + ((/Completed successfully \(\d+\)/.exec(fin) || [''])[0]));
  }
  return report;
}
