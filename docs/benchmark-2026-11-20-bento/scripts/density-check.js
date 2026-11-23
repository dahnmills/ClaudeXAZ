// Density check of the Buyer Summary V2 board (research 2026-11-23, question 5).
// Load it in the page (Playwright addScriptTag, or paste in the console) on
// #/buyer-summary-v2/:id, then call bentoDensity().
// Rule per card (blocking): at most 15 % of the card's inner height left empty
// under the content. Check per column of a multi-column card (indicative): 25 %.
// bentoDensity() returns { cards: [...], failures: [...], warnings: [...] }.
window.bentoDensity = () => {
  const CARD_MAX = 15, COL_MAX = 25;
  const visible = el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || el.hidden) return false;
    if (cs.display === 'contents') return true;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // Bottom of what is drawn: text, atoms, media; boxes only count by their content
  const contentBottom = root => {
    let b = -Infinity;
    const walk = el => {
      if (!visible(el)) return;
      const tag = el.tagName.toLowerCase();
      const leaf = tag.startsWith('ds-') || tag === 'svg' || tag === 'img' ||
        [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) ||
        (el.children.length === 0 && getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)');
      // Screen-reader only text is not drawn
      if (el.classList.contains('bento-sr')) return;
      if (leaf) { b = Math.max(b, el.getBoundingClientRect().bottom); return; }
      [...el.children].forEach(walk);
    };
    walk(root);
    return b;
  };
  const cards = [], failures = [], warnings = [];
  for (const cell of document.querySelectorAll('.bento-cell')) {
    const bc = cell.querySelector('.bc');
    if (!bc || cell.querySelector('.bc-skel, .bc-error')) continue;
    const title = bc.querySelector('.bc-title')?.textContent.trim().replace(/\s+/g, ' ');
    const cs = getComputedStyle(bc), r = bc.getBoundingClientRect();
    const top = r.top + parseFloat(cs.paddingTop), bottom = r.bottom - parseFloat(cs.paddingBottom);
    const inner = bottom - top;
    const empty = Math.max(0, Math.round(((bottom - contentBottom(bc)) / inner) * 100));
    const cols = [...bc.querySelectorAll('.bc-cols, .bc-split, .bc-tiles')].flatMap(c =>
      [...c.children].filter(visible).map((col, i) => ({
        col: i + 1,
        // Measured against the bottom of the columns' row, on the card's height
        empty: Math.max(0, Math.round(((Math.min(bottom, c.getBoundingClientRect().bottom) - contentBottom(col)) / inner) * 100)),
      })));
    const row = { title, format: cell.className.match(/bento-cell--f-(\S+)/)?.[1] ?? '', empty, cols };
    cards.push(row);
    if (empty > CARD_MAX) failures.push(`${title}: ${empty} % empty (rule ${CARD_MAX} %)`);
    // A column counts only when the card has more than one
    if (cols.length > 1) cols.filter(c => c.empty > COL_MAX)
      .forEach(c => warnings.push(`${title}, column ${c.col}: ${c.empty} % empty (check ${COL_MAX} %)`));
  }
  return { cards, failures, warnings };
};
