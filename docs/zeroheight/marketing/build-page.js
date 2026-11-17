// Builds the ZeroHeight page "Qirin for product teams (trial)" (43bfed) through the TipTap editor.
// Run with the Playwright MCP browser_run_code_unsafe (filename). Images are already uploaded.
async (page) => {
  await page.goto('https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/43bfed');
  await page.waitForSelector('.ProseMirror');
  await page.waitForTimeout(3000);
  return await page.evaluate(() => {
    const id = () => Math.random().toString(16).slice(2, 12).padEnd(10, '0');
    const t = (text, marks) => (marks ? { type: 'text', text, marks } : { type: 'text', text });
    const b = (text) => t(text, [{ type: 'strong', attrs: { blockId: '' } }]);
    const a = (text, href) => t(text, [{ type: 'link', attrs: { blockId: '', href, target: '_blank', rel: 'noopener noreferrer nofollow', class: 'zheditor-a' } }]);
    const p = (...c) => ({ type: 'paragraph', attrs: { blockId: id() }, content: c });
    const h = (level, text) => ({ type: 'heading', attrs: { blockId: id(), level }, content: [t(text)] });
    const img = (src, alt) => ({ type: 'image', attrs: { blockId: id(), image: src, caption: '', altText: alt, alignment: 'center', lightboxEnabled: true, previewPercent: 100, link: '', openInNewTab: false } });
    const cols = (...cs) => ({ type: 'columns', attrs: { blockId: id() }, content: cs.map((c) => ({ type: 'column', attrs: { blockId: '', width: Math.round(100 / cs.length) }, content: c })) });
    const ol = (...items) => ({ type: 'orderedList', attrs: { blockId: id(), start: 1 }, content: items.map((i) => ({ type: 'listItem', attrs: { blockId: '' }, content: [p(...i)] })) });
    const ZH = 'https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/';
    const FIG = 'https://www.figma.com/design/';
    const SB = 'https://dahnmills.github.io/ClaudeXAZ/storybook/';
    const IMG = {
      v1: '/uploads/NAeo5c9k2KAsXEsJgiyU3A.png', v2: '/uploads/bW3NSOrZIITZZojQsOSLUA.png',
      v3: '/uploads/zeWa914GeGWM9YZ2guNm9g.png', v4: '/uploads/16Hw-bv-_Yutt6HMDXfVWg.png',
    };
    const tiles = {
      type: 'shortcut-tiles',
      attrs: { blockId: id(), shortcutHeight: 's', shortcutColumns: 3, shortcutTiles: [
        { id: Date.now(), link: FIG + 'xCeEJPn6fliEshuE9fnrqs', title: 'Open the Figma libraries', description: 'Enable them in your file, start designing' },
        { id: Date.now() + 1, link: SB, title: 'Browse Storybook', description: 'Every component, live, with its inputs' },
        { id: Date.now() + 2, link: ZH + '515c45', title: 'Get started', description: 'The first steps for designers, developers and POs' },
      ] },
    };

    const body = [
      img(IMG.v1, 'Build Qirin screens faster, and get them right the first time. A table of credit requests made of Qirin components.'),
      tiles,

      h(2, 'What you get'),
      cols(
        [p(b('Design and code match.')), p(t('Every Figma component has its Angular twin with the same name, the same variants and the same states. What you hand off is what ships.'))],
        [p(b('Change once, update everywhere.')), p(t('Colors, spacing, radius and type come from tokens. Update a token or an atom and every screen that uses it follows.'))],
        [p(b('Accessible by default.')), p(t('WCAG AA contrast, visible focus, keyboard support, and status that never relies on color alone. You inherit it instead of rebuilding it.'))],
      ),

      h(2, "What's inside"),
      p(t('98 components in five Figma libraries, about 370 semantic tokens on top of a foundation palette, and usage guidelines plus a Storybook entry for every component.')),
      img(IMG.v2, 'The five component families: Action, Data Entry, Data Display, Feedback and Layout, each shown with real components.'),
      p(t('Open a library: '), a('Action', FIG + 'xCeEJPn6fliEshuE9fnrqs'), t(', '), a('Data Entry', FIG + '1wVY9FfjONIX6us9JmIm7U'), t(', '), a('Data Display', FIG + 'VpConH5AUGyCqtp8PMqj1i'), t(', '), a('Feedback', FIG + 'fH3vmSNZR8r0sU3kN455CD'), t(', '), a('Layout', FIG + 'bbgSPUChd18EVNGijjoZGn'), t('.')),

      h(2, 'Built for dense, serious screens'),
      p(t('Qirin screens show a lot of data to experts who decide fast. The system is tuned for that: compact tables, readable status, clear hierarchy, and one primary action per area. It favours clarity over decoration.')),
      img(IMG.v3, 'The same block twice. Hand-made: near-miss colors, two primary buttons, status shown by color only. With Qirin: one primary action, every status labelled.'),

      h(2, 'Get started'),
      cols(
        [h(3, 'Designers'), ol(
          [t('Enable the Qirin libraries in your Figma file (Assets, then Libraries).')],
          [t('Start from Layout: page header, side navigation, grid.')],
          [t('Pick components and keep their properties. Avoid detaching.')],
        )],
        [h(3, 'Developers'), ol(
          [t('Import the standalone Angular components from '), t('shared/ui', [{ type: 'code', attrs: { blockId: '' } }]), t('.')],
          [t('Use semantic tokens ('), t('--semantic-*', [{ type: 'code', attrs: { blockId: '' } }]), t('), never raw values.')],
          [t('Check the component in '), a('Storybook', SB), t(' before writing your own.')],
        )],
      ),

      img(IMG.v4, 'Missing something? Ask before you build it.'),
    ];

    const eds = document.querySelectorAll('.ProseMirror');
    const intro = eds[0].editor;
    intro.chain().setContent({ type: 'doc', content: [p(t('One design system for the credit workspace. Same components in Figma and in code, same tokens, ready to use.'))] }).run();
    const ed = eds[1].editor;
    ed.chain().setContent({ type: 'doc', content: body }).run();
    return ed.getJSON().content.map((n) => n.type).join(', ');
  });
}
