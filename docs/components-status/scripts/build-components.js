// Step 2 of the refresh (see ../README.md). Run from the repo root after extract-code.js.
// Build docs/components-status/components.json
// Run from the repo root: node build.js
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const TMP = path.join(__dirname, '.cache');
const code = require(path.join(TMP, 'code.json'));

const TODAY = '2026-11-06';
const SB = 'https://dahnmills.github.io/ClaudeXAZ/storybook/';
const ZH_BASE = 'https://qirin-design-system.zeroheight.com/styleguide/s/138794/p/';
const LIB = {
  action: 'xCeEJPn6fliEshuE9fnrqs',
  'data-display': 'VpConH5AUGyCqtp8PMqj1i',
  'data-entry': '1wVY9FfjONIX6us9JmIm7U',
  feedback: 'fH3vmSNZR8r0sU3kN455CD',
  layout: null, // Layout library file key not available (docs: "file not accessible")
};
const LOCAL_FILES = {
  search: 'LBLqJmlPqXmx9qksCyYGPb',
  'buyer-summary': '0ZjZu0OjHdzGowm3hliM2M',
  coverbook: 'NflKzgx17mOn2JPoFaqnjW',
  'reject-management': 'zUzOSE77EjbShM9u7yLthB',
  'manual-underwriting': '9EXkGvyk2yGF9qFpRpV0Ey',
  'exposure-card': '5OVzA6FZD7o8aGtfK5qo7g',
};

// ---- helpers --------------------------------------------------------------
const read = (p) => fs.readFileSync(p, 'utf8');
const corpus = ['docs/figma/qirin-figma-inventory.md', 'docs/figma/PLAYBOOK.md', 'docs/figma/progress.md', 'docs/figma/STATUS.md']
  .map(read).join('\n');
function expandKey(prefix) {
  const m = corpus.match(new RegExp(prefix + '[0-9a-f]{' + (40 - prefix.length) + '}'));
  if (!m) throw new Error('key not found ' + prefix);
  return m[0];
}
const KEYS = {};
const keyPrefixes = {
  button: 'ba6612f7', 'button-icon': '50cb3176', link: 'b9493d2f', chip: '1547bf75', tab: 'a1d28507',
  breadcrumb: '955f4ed5', crumb: 'fe536134', 'flyout-menu': '5d1147ac', badge: '990a9ef2', 'skeleton-item': 'ed7d5d07',
  card: '1d68f180', 'page-header': '659acf91', identifier: '53c3ac27', 'icon-tile': 'd0deb132', 'progress-bar': '4df39ca6',
  'standalone-dropdown': 'c8b538b2', header: '39e53cef', tag: '0543a49f', 'horizontal-card': 'f217735c',
  'search-bar': 'b084316c', 'widget-card': '987bbbe7', dropdown: '9274a067', drawer: '413684a3', modal: 'c81f6a2d',
  'radio-card': '50c847da', spinner: 'd19dd496', 'input-text': 'c88876bc', 'dropdown-flyout-menu': '2ce5aa69'.slice(0, 0) + '2ce5aa6c',
  toaster: '4cf21ce2', divider: '9498f5f5', 'side-navigation': '7472d0df', icon: 'cdf378d4', logo: 'd4206ee4',
  'breadcrumbs-topbox': '099403d1', 'tabs-topbox': '5126f0cd',
};
for (const [k, p] of Object.entries(keyPrefixes)) KEYS[k] = expandKey(p);

const nodeUrl = (fileKey, nodeId) => {
  if (!fileKey) return null;
  return nodeId ? `https://www.figma.com/design/${fileKey}?node-id=${nodeId.replace(':', '-')}` : `https://www.figma.com/design/${fileKey}`;
};

function parseZh(rel) {
  const file = `docs/zeroheight/${rel}.md`;
  if (!fs.existsSync(file)) return null;
  const lines = read(file).split('\n');
  const status = (lines[1] || '').replace('**Status**:', '').trim();
  const description = (lines[2] || '').trim();
  const figmaLine = lines.find((l) => l.startsWith('Figma:')) || '';
  const nm = figmaLine.match(/\(node `?(\d+:\d+)/);
  const km = figmaLine.match(/key `([0-9a-f]{40})`/);
  const sbTitles = [...figmaLine.matchAll(/`(Design System\/[^`]+|UI\/[^`]+)`/g)].map((m) => m[1]);
  // variants table
  const txt = lines.join('\n');
  const sec = txt.split('## Variants and properties')[1];
  let variants = [];
  if (sec) {
    const body = sec.split(/\n## /)[0].split('\n').filter((l) => l.startsWith('|')).slice(2);
    for (const row of body) {
      const c = row.split('|')[1];
      const name = (c || '').replace(/`/g, '').trim();
      if (!name || name.startsWith('(none)') || name.toLowerCase()==='none') continue;
      if (!variants.includes(name)) variants.push(name);
    }
  }
  return { file, status, description, node: nm ? nm[1] : null, key: km ? km[1] : null, sbTitles, variants };
}

const storyIndex = {}; // title -> {dir, file, autodocs, exports}
for (const d of code) for (const s of d.stories) if (s.title) storyIndex[s.title] = { dir: d.dir, ...s };
const compIndex = {}; // selector -> {dir, ...}
for (const d of code) for (const c of d.comps) compIndex[c.selector] = { dir: d.dir, dirInfo: d, ...c };

function slugTitle(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
// First-story overrides for stories without autodocs (verified from design-system-audit.data.ts snapshot)
const NO_AUTODOCS_FIRST = {
  'Design System/Layout/Drawer': 'design-system-layout-drawer--default',
  'Design System/Data Entry/Inline Edit': 'design-system-data-entry-inline-edit--default',
};
function storyUrl(title) {
  if (!title) return null;
  const s = storyIndex[title];
  if (!s) return null;
  if (s.autodocs) return `${SB}?path=/docs/${slugTitle(title)}--docs`;
  const id = NO_AUTODOCS_FIRST[title] || `${slugTitle(title)}--${slugTitle(s.exports[0] || 'default')}`;
  return `${SB}?path=/story/${id}`;
}

// ---- record table -----------------------------------------------------------
// [id, name, selector, storyTitle, category, level, zhPage, description, extra]
// extra: {lib, figma:{node,key,name}, noFigma, comment, codeOnlyVia, vibecoded, noCode, variants}
const D = 'Design System/';
const R = [];
const add = (id, name, selector, story, category, level, zh, description, extra = {}) =>
  R.push({ id, name, selector, story, category, level, zh, description, extra });

// Action
add('button', 'Button', 'ds-button', D + 'Action/Button', 'action', 'atom', 'action/button', null,
  { lib: 'action', k: 'button', comment: 'No Negative tone in Figma but present in code (ButtonTone includes negative); Figma defaults differ for Loading state not yet in the ZeroHeight library sync.' });
add('button-load-more', 'Button Load More', null, D + 'Action/Button', 'action', 'atom', 'action/button-load-more', null,
  { lib: 'action', via: 'ds-button', story2: 'design-system-action-button--load-more', vibecoded: true, comment: 'Figma-only name: in code it is ds-button type="secondary" tone="accent" fullWidth (story LoadMore).' });
add('button-icon', 'Button Icon', 'ds-button-icon', D + 'Action/Button Icon', 'action', 'atom', 'action/button-icon', null,
  { lib: 'action', k: 'button-icon', comment: 'Code has no icon input (icon is projected); Figma exposes State, Type, Size, Reversed, Tone (incl. Negative), Focus.' });
add('button-range', 'Button Range', 'ds-button-range', D + 'Action/Button Range', 'action', 'atom', 'action/button-range', null,
  { lib: 'action', comment: 'Uses --semantic-measurement-spacing-2xs which does not exist in _semantic.scss (padding falls back to nothing).' });
add('button-range-group', 'Button Range Group', 'ds-button-range-group', D + 'Action/Button Range Group', 'action', 'molecule', 'action/button-range', 'A group of Button Range steps to pick a value, several values or a range.',
  { lib: 'action', shareFigma: true, comment: 'No separate Figma set: the group is composed from Button Range instances.' });
add('button-split', 'Button Split', 'ds-button-split', D + 'Action/Button Split', 'action', 'molecule', 'action/button-split', null,
  { lib: 'action', comment: 'Missing aria-expanded on the chevron button (ZeroHeight audit 2026-11-04).' });
add('visual-button', 'Visual Button', 'ds-visual-button', D + 'Action/Visual Button', 'action', 'molecule', 'action/visual-button', null,
  { lib: 'action', comment: 'Selected state uses --semantic-color-static-background-subtle-informative, which does not exist in _semantic.scss.' });
add('link', 'Link', 'ds-link', D + 'Action/Link', 'action', 'atom', 'action/link', null,
  { lib: 'action', k: 'link', comment: 'Figma: only [DEPRECATED] Link is published, the two current sets (688:4202, 689:4239) are not; Crumb uses 688:4202.' });
add('breadcrumbs', 'Breadcrumb', 'ds-breadcrumbs', D + 'Action/Breadcrumbs', 'action', 'molecule', 'action/breadcrumb', null,
  { lib: 'action', k: 'breadcrumb', comment: 'Figma name Breadcrumb, selector ds-breadcrumbs (plural).' });
add('crumb', 'Crumb', 'ds-crumb', D + 'Action/Crumb', 'action', 'atom', 'action/crumb', null,
  { lib: 'action', k: 'crumb' });
add('tab', 'Tab', 'ds-tab', D + 'Action/Tab', 'action', 'atom', 'action/tab', null,
  { lib: 'action', k: 'tab', comment: 'Library Tab has no icon; code has one per tab. The counter badge exists only as the counter input of ds-tab.' });
add('segmented-control', 'Segmented Control', 'ds-segmented-control', D + 'Action/Segmented Control', 'action', 'molecule', 'action/segmented-control', null,
  { lib: 'action', comment: 'Figma set is named "Component 1"; mode="radio" exists for settings (a11y), tabs mode is the default.' });
add('tag', 'Tag', 'ds-tag', D + 'Action/Tag', 'action', 'atom', 'action/tag', null,
  { lib: 'action', k: 'tag', comment: 'Figma defaults to Filter, code defaults to select; no Dropdown filter tag in code.' });
add('chip', 'Chip', 'ds-chip', D + 'Action/Chip', 'action', 'atom', 'action/chip', null,
  { lib: 'action', k: 'chip', comment: 'Remove glyph is a text character, not a ds-icon.' });
add('tile', 'Tile', 'ds-tile', D + 'Action/Tile', 'action', 'atom', 'action/tile', null,
  { lib: 'action', comment: 'Figma set is named "Tiles"; no focus-visible style in code; not used by any page yet.' });
add('flyout-menu', 'Flyout Menu', 'ds-flyout-menu', D + 'Action/Flyout Menu', 'action', 'molecule', 'action/flyout-menu', null,
  { lib: 'action', k: 'flyout-menu' });
add('flyout-menu-item', 'Flyout Menu Item', 'ds-flyout-menu-item', D + 'Internals/Flyout Menu Item', 'action', 'atom', 'action/flyout-menu-item', null,
  { lib: 'action', comment: 'Figma component is called Flyout Item; selectable/selected check sits in a fixed 20px slot.' });
add('flyout-menu-title', 'Flyout Menu Title', 'ds-flyout-menu-title', null, 'action', 'atom', 'action/flyout-menu', 'A non-interactive group title row inside a Flyout Menu.',
  { lib: 'action', shareFigma: true, comment: 'No story of its own; covered by the Flyout Menu stories.' });
add('pagination', 'Pagination', 'ds-pagination', D + 'Action/Pagination', 'action', 'molecule', 'action/pagination', null,
  { lib: 'action', comment: 'Uses native <button> instead of ds-button; no focus-visible style.' });
add('stepper', 'Stepper', 'ds-stepper', D + 'Navigation/Stepper', 'navigation', 'molecule', 'action/stepper', null,
  { lib: 'action', comment: 'Figma is only a WIP frame (no component set); steps are clickable divs without role.' });

// Data Entry
add('input-text', 'Input Text', 'ds-input-text', D + 'Data Entry/Input Text', 'data-entry', 'molecule', 'data-entry/input-text', null, { lib: 'data-entry', k: 'input-text' });
add('input-email', 'Input Email', 'ds-input-email', D + 'Data Entry/Input Email', 'data-entry', 'molecule', 'data-entry/input-email', null, { lib: 'data-entry' });
add('input-date', 'Input Date', 'ds-input-date', D + 'Data Entry/Input Date', 'data-entry', 'molecule', 'data-entry/input-date', null, { lib: 'data-entry' });
add('input-search', 'Input Search', 'ds-input-search', D + 'Data Entry/Input Search', 'data-entry', 'molecule', 'data-entry/input-search', null, { lib: 'data-entry', comment: 'Clear button is a native <button> (composition rule gap).' });
add('textarea', 'Text Area', 'ds-textarea', D + 'Data Entry/Textarea', 'data-entry', 'molecule', 'data-entry/text-area', null, { lib: 'data-entry', comment: 'Figma name Text Area, selector ds-textarea.' });
add('checkbox', 'Checkbox', 'ds-checkbox', D + 'Data Entry/Checkbox', 'data-entry', 'molecule', 'data-entry/checkbox', null, { lib: 'data-entry', comment: 'Some colors are set in TS (hard-coded values flagged by the ZeroHeight audit).' });
add('radio', 'Radio', 'ds-radio', D + 'Data Entry/Radio', 'data-entry', 'molecule', 'data-entry/radio', null, { lib: 'data-entry', comment: 'No arrow-key navigation inside a group.' });
add('toggle', 'Toggle', 'ds-toggle', D + 'Data Entry/Toggle', 'data-entry', 'molecule', 'data-entry/toggle', null, { lib: 'data-entry', comment: 'Hard-coded sizes and a 14px radius; no ariaLabel input.' });
add('select', 'Select', 'ds-select', D + 'Data Entry/Select', 'data-entry', 'molecule', 'data-entry/dropdown', 'A form field that opens a list of predefined options to choose one value.',
  { lib: 'data-entry', k: 'dropdown', comment: 'Figma has one Dropdown component, code has two (ds-select and ds-multi-select).' });
add('multi-select', 'Multi Select', 'ds-multi-select', D + 'Data Entry/Multi Select', 'data-entry', 'molecule', 'data-entry/dropdown', 'A form field that opens a list of options to choose several values, shown as tags.',
  { lib: 'data-entry', k: 'dropdown', comment: 'Maps to the same Figma Dropdown as ds-select (multi variant).' });
add('dropdown-flyout-menu', 'Dropdown Flyout Menu', null, D + 'Action/Flyout Menu', 'data-entry', 'molecule', 'data-entry/dropdown-flyout-menu', null,
  { lib: 'data-entry', k: 'dropdown-flyout-menu', via: 'ds-flyout-menu', vibecoded: true, comment: 'Figma-only name: implemented by ds-flyout-menu + ds-flyout-menu-item (single/multi, flat/grouped).' });
add('standalone-dropdown', 'Standalone Dropdown', 'ds-standalone-dropdown', D + 'Action/Standalone Dropdown', 'data-entry', 'molecule', 'data-entry/standalone-dropdown', null,
  { lib: 'data-entry', k: 'standalone-dropdown', comment: 'Story sits under Action while the Figma component lives in Data Entry.' });
add('inline-edit', 'Inline Edit', 'ds-inline-edit', D + 'Data Entry/Inline Edit', 'data-entry', 'molecule', 'data-entry/inline-edit', null, { lib: 'data-entry', comment: 'Story has no autodocs tag, so the Storybook link opens the Default story.' });
add('date-range', 'Date Range', 'ds-date-range', D + 'Data Entry/Date Range', 'data-entry', 'organism', 'data-entry/date-range', null, { lib: 'data-entry' });
add('checkbox-card', 'Checkbox Card', 'ds-checkbox-card', D + 'Data Entry/Checkbox Card', 'data-entry', 'organism', 'data-entry/checkbox-card', null,
  { lib: 'data-entry', comment: 'Selected border and checked box use --semantic-color-interactive-background-main-default, which does not exist; no focus-visible style.' });
add('radio-card', 'Radio Card', 'ds-radio-card', D + 'Data Entry/Radio Card', 'data-entry', 'organism', 'data-entry/radio-card', null,
  { lib: 'data-entry', k: 'radio-card', comment: 'Radio is redrawn instead of composing ds-radio.' });
add('select-button', 'Select Button', 'ds-select-button', D + 'Data Entry/Select Button', 'data-entry', 'molecule', 'data-entry/select-button', null, { lib: 'data-entry', comment: 'Not used by any page; no focus-visible style.' });
add('search-bar-scoped', 'Search Bar', 'ds-search-bar-scoped', D + 'Data Entry/Search Bar Scoped', 'data-entry', 'organism', 'data-entry/search-bar', null,
  { lib: 'data-entry', k: 'search-bar', comment: 'Figma master "Search Bar" (slots Filters/Options) maps to code ds-search-bar-scoped; Figma retired the Search Bar Scoped set.' });
add('more-criteria', 'More Criteria', 'ds-more-criteria', D + 'Data Entry/More Criteria', 'data-entry', 'organism', 'data-entry/more-criteria', null, { lib: 'data-entry' });
add('search-bar', 'Search Bar (home)', 'ds-search-bar', D + 'Data Entry/Search Bar', 'data-entry', 'organism', null, 'The single free-text search bar of the home page, with recent searches and an advanced-search link.',
  { noFigma: true, comment: 'Code-only; distinct from ds-search-bar-multi and ds-search-bar-scoped (checked in the audit).' });
add('search-bar-multi', 'Search Bar Multi', 'ds-search-bar-multi', D + 'Data Entry/Search Bar Multi', 'data-entry', 'organism', null, 'The earlier multi-type search bar (buyer ID type, country, query) used by Search v1.',
  { noFigma: true, comment: 'Code-only, superseded in Figma by the Search Bar master (slots).' });
add('tag-filter-chip', 'Tag Filter Chip', 'ds-tag-filter-chip', D + 'Data Entry/Tag Filter Chip', 'data-entry', 'molecule', null, 'A filter chip that opens an option list and shows the picked values as tags.',
  { noFigma: true, comment: 'Code-only; composes ds-chip internally.' });
add('grid-selection', 'Grid Selection', 'ds-grid-selection', D + 'Data Entry/Grid Selection', 'data-entry', 'molecule', null, 'A picker of board grid layouts (Buyer Summary card builder).',
  { noFigma: true, comment: 'Code-only; the Figma equivalent is the local Radio Card + Layout preview in the Buyer Summary file.' });
add('file-upload', 'File Upload', 'ds-file-upload', null, 'data-entry', 'molecule', null, 'A drop zone and file list to attach files with type and size limits.',
  { noFigma: true, comment: 'No story and no Figma component yet.' });

// Data Display
add('card', 'Card', 'ds-card', D + 'Data Display/Card', 'data-display', 'organism', 'data-display/card', null, { lib: 'data-display', k: 'card', comment: 'Figma has six Card types; code exposes tone/loading/elevated/noPadding (no subtle tone).' });
add('widget-card', 'Widget Card', 'ds-widget-card', D + 'Data Display/Widget Card', 'data-display', 'organism', 'data-display/widget-card', null, { lib: 'data-display', k: 'widget-card', comment: 'Figma name is Card with Slot.' });
add('table-row', 'Table Row', 'ds-table-row', D + 'Data Display/Table/Table Row', 'data-display', 'organism', 'data-display/table', null, { lib: 'data-display', comment: 'Figma page is Data Grid / Table; one set for header, row and cells.' });
add('cell', 'Table Cell', 'ds-cell', D + 'Data Display/Table/Cell', 'data-display', 'molecule', 'data-display/table', 'A data cell of a table row, with size and alignment.', { lib: 'data-display', shareFigma: true });
add('cell-header', 'Table Cell Header', 'ds-cell-header', D + 'Data Display/Table/Cell Header', 'data-display', 'molecule', 'data-display/table', 'A column header cell with optional sorting.', { lib: 'data-display', shareFigma: true });
add('cell-selection', 'Table Cell Selection', 'ds-cell-selection', D + 'Data Display/Table/Cell Selection', 'data-display', 'molecule', 'data-display/table', 'A checkbox or radio cell for row selection.', { lib: 'data-display', shareFigma: true });
add('cell-action', 'Table Cell Action', 'ds-cell-action', D + 'Data Display/Table/Cell Action', 'data-display', 'molecule', 'data-display/table', 'A row-end cell holding the row action menu trigger.', { lib: 'data-display', shareFigma: true });
add('collapsible-table', 'Collapsible Table', 'ds-collapsible-table', D + 'Data Display/Collapsible Table', 'data-display', 'organism', 'data-display/collapsible-table', null, { lib: 'data-display', comment: 'The story hand-writes its HTML table rows.' });
add('topbox', 'Topbox', 'ds-topbox', D + 'Layout/Topbox', 'data-display', 'organism', 'data-display/topbox', null, { lib: 'data-display', comment: 'Story sits under Layout while the Figma component lives in Data Display; uses a native <button> and a redrawn grade pill.' });
add('result-card', 'Result Card', 'ds-result-card', D + 'Data Display/Result Card', 'data-display', 'organism', 'data-display/horizontal-card', null,
  { lib: 'data-display', k: 'horizontal-card', comment: 'Figma retired Result Card in favour of the generic Horizontal Card (Type=Slot); the code component remains.' });
add('policy-result-card', 'Policy Result Card', 'ds-policy-result-card', D + 'Data Display/Policy Result Card', 'data-display', 'organism', 'data-display/horizontal-card', null,
  { lib: 'data-display', k: 'horizontal-card', comment: 'Figma retired Policy Result Card in favour of the Horizontal Card; the code component remains.' });
add('grade', 'Grade', 'ds-grade', D + 'Data Display/Grade', 'data-display', 'atom', 'data-display/grade', null, { lib: 'data-display', comment: 'The nc grade has insufficient contrast (white on grey-300).' });
add('policy-color', 'Policy Color', 'ds-policy-color', null, 'data-display', 'atom', 'data-display/policy-color', null,
  { lib: 'data-display', comment: 'ZeroHeight page still says "Tech Planned" but the component exists in code (added 2026-11-04); it has no story yet.' });
add('accordion', 'Accordion', 'ds-accordion', D + 'Data Display/Accordion', 'data-display', 'molecule', 'data-display/accordion', null, { lib: 'data-display', comment: 'No aria-controls on the trigger.' });
add('timeline', 'Timeline', 'ds-timeline', D + 'Data Display/Timeline', 'data-display', 'organism', 'data-display/timeline', null, { lib: 'data-display' });
add('timeline-event', 'Timeline Event', 'ds-timeline-event', D + 'Internals/Timeline Event', 'data-display', 'molecule', 'data-display/timeline', 'One dated event of a Timeline group, colored by status.', { lib: 'data-display', shareFigma: true });
add('identifier', 'Identifier', 'ds-identifier', D + 'Data Display/Identifier', 'data-display', 'atom', 'data-display/identifier', null,
  { lib: 'data-display', k: 'identifier', comment: 'Figma source has 2 variants (Copyable/Focus as booleans) but the published library still has 4: republish pending.' });
add('icon-tile', 'Icon Tile', 'ds-icon-tile', D + 'Foundation/Icon Tile', 'data-display', 'atom', 'data-display/icon-tile', null, { lib: 'data-display', k: 'icon-tile', comment: 'Code radius of 5px on size M maps to Border/Radius/S (4px) in Figma.' });
add('progress-bar', 'Progress Bar', 'ds-progress-bar', D + 'Feedback/Progress Bar', 'data-display', 'atom', 'data-display/progress-bar', null, { lib: 'data-display', k: 'progress-bar', comment: 'Story sits under Feedback while the Figma component lives in Data Display; no accessible name.' });
add('list-widget', 'List Widget', 'ds-list-widget', D + 'Data Display/List Widget', 'data-display', 'organism', 'data-display/list-item', null, { lib: 'data-display', comment: 'Figma List Item covers the entries of both ds-list-widget and ds-newsfeed.' });
add('newsfeed', 'Newsfeed', 'ds-newsfeed', D + 'Data Display/Newsfeed', 'data-display', 'organism', 'data-display/list-item', null, { lib: 'data-display', comment: 'Maps to the Figma List Item (news variant).' });
add('chart', 'Chart', 'ds-chart', D + 'Data Display/Chart', 'data-display', 'organism', 'data-display/chart', null, { lib: 'data-display', comment: 'No accessible name; hard-coded values flagged by the audit.' });
add('pie-chart', 'Pie Chart', 'ds-pie-chart', D + 'Data Display/Pie Chart', 'data-display', 'organism', null, 'A donut/pie chart from labelled segments.', { noFigma: true, comment: 'Code-only; no Figma component.' });
add('properties-panel', 'Properties Panel', 'ds-properties-panel', D + 'Data Display/Properties Panel', 'data-display', 'organism', null, 'A label/value list in 1 to 4 columns, as a card or flat.',
  { noFigma: true, comment: 'Retired from the Figma library (replaced by Card .Columns, which is private); heavily used in code.' });
add('action-card', 'Action Card', 'ds-action-card', D + 'Data Display/Action Card', 'data-display', 'organism', null, 'A card with icon, title and description that links to an action or area.',
  { noFigma: true, comment: 'Code-only; uses --semantic-color-static-background-subtle-informative, which does not exist.' });

// Feedback
add('badge', 'Badge', 'ds-badge', D + 'Feedback/Badge', 'feedback', 'atom', 'feedback/badge', null, { lib: 'feedback', k: 'badge', comment: 'Figma property Style corresponds to the code input variant.' });
add('badge-counter', 'Badge (counter)', null, D + 'Action/Tab', 'feedback', 'atom', 'feedback/badge-counter', null,
  { lib: 'feedback', via: 'ds-tab', vibecoded: true, story2: 'design-system-action-tab--with-counter', comment: 'Figma-only component: in code it exists only as the counter input of ds-tab.' });
add('skeleton-item', 'Skeleton Item', 'ds-skeleton-item', D + 'Feedback/Skeleton Item', 'feedback', 'atom', 'feedback/skeleton-item', null, { lib: 'feedback', k: 'skeleton-item' });
add('spinner', 'Spinner', 'ds-spinner', D + 'Feedback/Spinner', 'feedback', 'atom', 'feedback/spinner', null, { lib: 'feedback', k: 'spinner', comment: 'Figma variant property is the default name "Property 1".' });
add('toaster', 'Toaster', 'ds-toaster-container', D + 'Feedback/Toaster', 'feedback', 'molecule', 'feedback/toaster', null, { lib: 'feedback', k: 'toaster', usage: 'service:ToasterService', comment: 'Figma action is a Button, code uses a Link; hard-coded width.' });
add('snackbar', 'Snackbar', 'ds-snackbar', D + 'Feedback/Snackbar', 'feedback', 'molecule', 'feedback/snackbar', null, { lib: 'feedback', usage: 'service:SnackbarService' });
add('functional-notice', 'Functional Notice', 'ds-functional-notice', D + 'Feedback/Functional Notice', 'feedback', 'molecule', 'feedback/functional-notice', null,
  { lib: 'feedback', comment: 'No content slot in Figma while code projects content under the message; dismiss button passes icon="close" to ds-button-icon, which has no icon input.' });
add('tooltip', 'Tooltip', 'ds-tooltip', D + 'Feedback/Tooltip', 'feedback', 'molecule', 'feedback/tooltip', null, { lib: 'feedback', usage: 'tooltip', comment: 'Used through the [dsTooltip] directive; no aria-describedby and no Escape handling.' });
add('popover', 'Popover', 'ds-popover', D + 'Feedback/Popover', 'feedback', 'molecule', 'feedback/popover', null, { lib: 'feedback', comment: 'No role, no focus management, no Escape; close button passes icon="close" to ds-button-icon (no icon input).' });
add('confirm-dialog', 'Popin', 'ds-confirm-dialog', D + 'Feedback/Popin', 'feedback', 'molecule', 'feedback/popin', null,
  { lib: 'feedback', comment: 'Figma Popin = code ds-confirm-dialog. Figma Success tone has no code tone and danger reuses the warning glyph; role="alertdialog" is set on both the host and the inner box.' });

// Layout
add('header', 'Header', 'ds-header', D + 'Layout/Header', 'layout', 'organism', 'layout/header', null, { lib: 'layout', k: 'header' });
add('side-nav', 'Side Navigation', 'ds-side-nav', D + 'Layout/Side Nav', 'layout', 'organism', 'layout/side-navigation', null, { lib: 'layout', k: 'side-navigation', comment: 'Figma Side Navigation = code ds-side-nav; Open default is inverted between Figma and code.' });
add('side-nav-item', 'Side Navigation Item', 'ds-side-nav-item', D + 'Internals/Side Nav Item', 'layout', 'atom', 'layout/side-navigation', 'One entry of the side navigation rail.', { lib: 'layout', shareFigma: true });
add('page-header', 'Page Header', 'ds-page-header', D + 'Layout/Page Header', 'layout', 'organism', 'layout/page-header', null, { lib: 'data-display', k: 'page-header', comment: 'Figma component lives in the Data Display library (page Topbox), not in Layout.' });
add('page-title', 'Page Title', 'ds-page-title', D + 'Layout/Page Title', 'layout', 'molecule', null, 'The page heading with identifier, status badge and one optional action link.', { noFigma: true, comment: 'Code-only; the Figma Page Header carries the title inside its own layout.' });
add('modal', 'Modal', 'ds-modal', D + 'Layout/Modal', 'layout', 'organism', 'layout/modal', null, { lib: 'layout', k: 'modal', comment: 'Carries dsFocusTrap; hard-coded px and rgba in its SCSS; default Size differs between Figma and code.' });
add('modal-header', 'Modal Header', 'ds-modal-header', D + 'Internals/Modal Header', 'layout', 'molecule', 'layout/modal', 'The title bar of a Modal.', { lib: 'layout', shareFigma: true });
add('modal-content', 'Modal Content', 'ds-modal-content', D + 'Internals/Modal Content', 'layout', 'molecule', 'layout/modal', 'The scrollable body slot of a Modal.', { lib: 'layout', shareFigma: true });
add('modal-footer', 'Modal Footer', 'ds-modal-footer', D + 'Internals/Modal Footer', 'layout', 'molecule', 'layout/modal', 'The action bar of a Modal, with an optional back button.', { lib: 'layout', shareFigma: true });
add('drawer', 'Drawer', 'ds-drawer', D + 'Layout/Drawer', 'layout', 'organism', 'layout/drawer', null, { lib: 'layout', k: 'drawer', comment: 'Story has no autodocs tag, so the Storybook link opens the Default story.' });
add('filter-drawer', 'Filter Drawer', 'ds-filter-drawer', D + 'Layout/Filter Drawer', 'overlay', 'organism', null, 'A Drawer preset to build and save filters.', { noFigma: true, comment: 'Code-only; the Figma Drawer master is used with local contents.' });
add('flyout', 'Flyout', 'ds-flyout', D + 'Layout/Flyout', 'overlay', 'molecule', null, 'The base floating panel used by menus and dropdowns.', { noFigma: true, comment: 'Code-only base panel (no page uses it directly).' });
add('flyout-item', 'Flyout Item', 'ds-flyout-item', D + 'Internals/Flyout Item', 'overlay', 'atom', null, 'A row of the base Flyout panel.', { noFigma: true, comment: 'Code-only internal; Figma Flyout Item is covered by ds-flyout-menu-item.' });
add('flyout-section', 'Flyout Section', 'ds-flyout-section', D + 'Internals/Flyout Section', 'overlay', 'atom', null, 'A titled section of the base Flyout panel.', { noFigma: true });
add('spotlight', 'Spotlight', 'ds-spotlight', 'UI/Spotlight', 'overlay', 'organism', null, 'A command-palette search overlay with recents and keyboard navigation.', { noFigma: true, comment: 'Story title sits outside the Design System/* taxonomy (UI/Spotlight).' });
add('shortcuts-panel', 'Shortcuts Panel', 'ds-shortcuts-panel', null, 'overlay', 'organism', null, 'A panel listing keyboard shortcuts by group, with a keyboard map view.', { noFigma: true, comment: 'No story and no Figma component.' });
add('shortcut-row', 'Shortcut Row', 'ds-shortcut-row', null, 'other', 'molecule', null, 'One shortcut line: label, keys and context.', { noFigma: true, comment: 'Internal of Shortcuts Panel; no story.' });
add('keyboard-map', 'Keyboard Map', 'ds-keyboard-map', null, 'other', 'molecule', null, 'A keyboard-shaped map showing which keys have shortcuts.', { noFigma: true, comment: 'Internal of Shortcuts Panel; no story.' });
add('keycap', 'Keycap', 'ds-keycap', null, 'other', 'atom', null, 'A single keyboard key cap.', { noFigma: true, comment: 'No story and no Figma component.' });
add('shortcut-keys', 'Shortcut Keys', 'ds-shortcut-keys', null, 'other', 'atom', null, 'A sequence of Keycaps for one shortcut.', { noFigma: true, comment: 'No story and no Figma component.' });

// Foundations / other
add('icon', 'Icon', 'ds-icon', D + 'Foundation/Icon', 'other', 'atom', null, 'The SVG icon wrapper that renders a glyph from the code icon registry.', { k: 'icon', figmaName: 'Icon Functional (NDBX Web library)', comment: 'Figma wrapper is Icon Functional from the NDBX Web library; the code has its own registry, not NDBX. Figma library file is outside the Qirin files.' });
add('logo', 'Logo', 'ds-logo', D + 'Foundation/Logo', 'other', 'atom', null, 'The Qirin brand mark and app name, in default or reversed colors.', { k: 'logo', figmaName: 'Logo Qirin', comment: 'Figma component key known, library file not identified.' });
add('divider', 'Divider', 'ds-divider', D + 'Foundation/Divider', 'other', 'atom', null, 'A horizontal or vertical separator line.', { k: 'divider', figmaName: 'Divider', comment: 'Figma Divider has no vertical variant (vertical lines use a rotated instance).' });
add('flag', 'Flag', 'ds-flag', D + 'Foundation/Flag', 'other', 'atom', null, 'A country flag SVG from an ISO country code.', { noFigma: true, comment: 'Code-only; no Figma component.' });
add('focus-trap', 'Focus Trap', '[dsFocusTrap]', null, 'other', 'atom', null, 'A directive that traps focus inside a dialog and restores it to the trigger on close.', { noFigma: true, usage: 'dsFocusTrap', comment: 'Directive, not a visual component; no story. Applied on ds-modal and ds-confirm-dialog.' });

// Figma-only (no code selector)
add('breadcrumbs-topbox', 'Breadcrumbs - Topbox', null, null, 'data-display', 'molecule', null, 'The breadcrumb row variant used inside the Page Header.',
  { lib: 'data-display', k: 'breadcrumbs-topbox', noCode: true, comment: 'Figma-only sub-element of Page Header; in code it is the breadcrumb input of ds-page-header.' });
add('tabs-topbox', 'Tabs - Topbox', null, null, 'data-display', 'molecule', null, 'The tab row variant used inside the Page Header.',
  { lib: 'data-display', k: 'tabs-topbox', noCode: true, comment: 'Figma-only sub-element of Page Header; in code it is the tabs input of ds-page-header.' });

// Local components (per Figma feature files)
const LOCALS = [];
const L = (file, page, node, name, level, desc) => LOCALS.push({ file, page, node, name, level, desc });
// Search
L('search', 'search', '18:5346', 'Search shell', 'template', 'The Search page frame: Header, Page Header without topbox, and the active-tab content area.');
L('search', 'search', '20:766', 'Recent Search Card', 'molecule', 'A card for one recent search in the History view.');
L('search', 'search', '49:2986', 'Buyer content', 'molecule', 'Slot content of a Horizontal Card for a buyer result.');
L('search', 'search', '49:3127', 'Policy content', 'molecule', 'Slot content of a Horizontal Card for a policy or draft result.');
L('search', 'search', '49:3128', 'Score', 'atom', 'The score value shown at the end of a buyer result.');
L('search', 'search', '49:3145', 'Date', 'atom', 'The date block shown at the end of a policy result.');
L('search', 'search', '49:3146', 'Meta', 'atom', 'The meta line (viewed or searched date) of a history result.');
L('search', 'search', '49:3148', 'Action spacer', 'atom', 'A 24px spacer that keeps result rows aligned when an action is absent.');
L('search', 'search', '49:3149', 'Create action', 'atom', 'The "+ Create" action at the end of a result row.');
L('search', 'search', '49:3159', 'Buyer details', 'molecule', 'The expanded details panel of a buyer result (Card Columns).');
L('search', 'search', '49:4047', 'Policy details', 'molecule', 'The expanded details panel of a policy result (Card Columns).');
L('search', 'search', '53:1174', 'Buyer filters', 'molecule', 'The filter slot content of the Search Bar for buyers.');
L('search', 'search', '53:1226', 'Buyer options', 'molecule', 'The options slot content of the Search Bar for buyers.');
L('search', 'search', '53:1227', 'Policy filters', 'molecule', 'The filter slot content of the Search Bar for policies.');
L('search', 'search', '53:1373', 'Policy options', 'molecule', 'The options slot content of the Search Bar for policies.');
// Buyer Summary
L('buyer-summary', 'buyer-summary', '15:5169', 'Buyer Summary shell', 'template', 'The Buyer Summary page frame in Default and Editing modes with a content slot.');
L('buyer-summary', 'buyer-summary', '19:1820', 'Board actions', 'molecule', 'The action bar above a board (edit, add, manage).');
L('buyer-summary', 'buyer-summary', '34:1629', 'Board slot', 'molecule', 'An empty or targeted slot where a card can be placed in editing mode.');
L('buyer-summary', 'buyer-summary', '34:1630', 'Slot toolbar', 'molecule', 'The small toolbar shown on a board slot.');
L('buyer-summary', 'buyer-summary', '34:1645', 'Board editor bar', 'molecule', 'The bar shown while a board is being edited.');
L('buyer-summary', 'buyer-summary', '27:1597', 'Card content / Loading', 'molecule', 'The loading skeleton content of a board card.');
L('buyer-summary', 'buyer-summary', '37:1641', 'Modal content / Full properties', 'molecule', 'The body of the Full properties modal.');
L('buyer-summary', 'buyer-summary', '43:2470', 'Drawer content / Cards', 'molecule', 'The card catalog inside the Cards drawer.');
L('buyer-summary', 'buyer-summary', '45:2764', 'Drawer tabs / Cards & layouts', 'molecule', 'The tab bar of the Cards and layouts drawer.');
L('buyer-summary', 'buyer-summary', '62:2757', 'Layout preview', 'atom', 'A thumbnail of one of the six board grids.');
L('buyer-summary', 'buyer-summary', '71:1886', 'Drawer content / New board', 'molecule', 'The new-board drawer with the grid choice (Radio Card).');
L('buyer-summary', 'buyer-summary', '84:2062', 'Board row', 'molecule', 'One board in the Manage boards list (Horizontal Card based).');
L('buyer-summary', 'buyer-summary', '84:1762', 'Board row / Label', 'atom', 'The label slot of a Board row.');
L('buyer-summary', 'buyer-summary', '84:1812', 'Board row / Actions', 'atom', 'The action slot of a Board row.');
L('buyer-summary', 'buyer-summary', '63:3269', 'Create board', 'molecule', 'The "create board" entry of the boards drawer.');
L('buyer-summary', 'buyer-summary', '85:2354', 'Drawer content / Boards', 'molecule', 'The Manage boards drawer (list, renaming, custom board).');
// Coverbook
L('coverbook', 'coverbook', '12:6887', 'Coverbook shell', 'template', 'The Coverbook page frame for buyer and policy covers.');
L('coverbook', 'coverbook', '16:1764', 'Covers toolbar', 'molecule', 'The filter and column toolbar above the covers table.');
L('coverbook', 'coverbook', '20:1719', 'Policy summary panel', 'molecule', 'The policy summary panel of the policy covers page.');
L('coverbook', 'coverbook', '21:1851', 'Cover details modal content', 'molecule', 'The body of the cover details modal.');
L('coverbook', 'coverbook', '21:1914', 'Row menu', 'molecule', 'The row action menu of the covers table (View details only).');
L('coverbook', 'coverbook', '25:3805', 'Covers table Buyer credit limits', 'organism', 'The buyer credit limits table.');
L('coverbook', 'coverbook', '25:4722', 'Policy credit limits', 'organism', 'The policy credit limits table.');
L('coverbook', 'coverbook', '29:11254', 'Buyer grade based covers', 'organism', 'The buyer grade based covers table.');
L('coverbook', 'coverbook', '29:13648', 'Policy grade based covers', 'organism', 'The policy grade based covers table.');
// Reject Management
L('reject-management', 'reject-management', '16:11688', 'Reject Management shell', 'template', 'The Reject Management page frame with four tabs.');
L('reject-management', 'reject-management', '23:1688', 'Rejects toolbar', 'molecule', 'The toolbar and bulk actions above the rejects table.');
L('reject-management', 'reject-management', '25:4981', 'Rejects table', 'organism', 'The table of rejected records with selection.');
L('reject-management', 'reject-management', '31:4052', 'Resolution notice', 'molecule', 'The notice that explains a reject and its steps (local wrapper around Functional Notice).');
L('reject-management', 'reject-management', '37:4044', 'Block card', 'molecule', 'A card grouping the fields of one block of the rejected record.');
L('reject-management', 'reject-management', '43:4009', 'Field panel', 'molecule', 'The panel for a faulty field with its suggested correction.');
L('reject-management', 'reject-management', '47:4226', 'Correction modal footer', 'molecule', 'The footer actions (Back, Delete, Resubmit) of the correction modal.');
// Manual Underwriting
L('manual-underwriting', 'manual-underwriting', '28:2201', 'UW page shell', 'template', 'The Manual Underwriting page frame in Draft, To be validated and Validated statuses.');
L('manual-underwriting', 'manual-underwriting', '21:178', 'UW card', 'organism', 'A manual underwriting card with a "View details" action.');
L('manual-underwriting', 'manual-underwriting', '14:104', 'UW property row', 'atom', 'A label/value row inside a UW card.');
L('manual-underwriting', 'manual-underwriting', '15:27', 'UW content / Buyer', 'molecule', 'Card content for the buyer.');
L('manual-underwriting', 'manual-underwriting', '15:44', 'UW content / Current limit', 'molecule', 'Card content for the current limit.');
L('manual-underwriting', 'manual-underwriting', '15:64', 'UW content / Validation', 'molecule', 'Card content for the validation status.');
L('manual-underwriting', 'manual-underwriting', '15:93', 'UW content / Insured and policy', 'molecule', 'Card content for the insured and policy.');
L('manual-underwriting', 'manual-underwriting', '17:1483', 'UW content / Request', 'molecule', 'Card content for the request.');
L('manual-underwriting', 'manual-underwriting', '17:1647', 'UW content / Answer', 'molecule', 'Card content for the underwriter answer.');
L('manual-underwriting', 'manual-underwriting', '21:431', 'UW card menu', 'molecule', 'The overflow menu of a UW card.');
L('manual-underwriting', 'manual-underwriting', '29:1766', 'Modal content / View details', 'molecule', 'The body of the View details modal.');
L('manual-underwriting', 'manual-underwriting', '29:2368', 'Modal content / Complete form', 'molecule', 'The body and footer of the Complete modal.');
L('manual-underwriting', 'manual-underwriting', '32:1868', 'Modal content / Validate or reject', 'molecule', 'The body and footer of the Validate or reject modal.');
L('manual-underwriting', 'manual-underwriting', '32:1761', 'Modal content / Send', 'molecule', 'The body of the Send (transfer request) modal.');
// Changelog + Exposure
L('search', null, '8:57', 'Changelog entry', 'atom', 'One version entry of the Changelog page; the same local component exists in all six feature files.');
L('exposure-card', null, null, 'Exposure Card', 'organism', 'The Exposure Card component (variants carry sample content).');

const FILE_LABEL = { search: 'Search', 'buyer-summary': 'Buyer Summary', coverbook: 'Coverbook', 'reject-management': 'Reject Management', 'manual-underwriting': 'Manual Underwriting', 'exposure-card': 'Exposure Card' };
// ---- assemble ---------------------------------------------------------------
function gitLast(dir) { return cp.execSync(`git log -1 --format=%cs -- ${dir}`).toString().trim(); }
function gitInfo(dir) { return code.find((d) => d.dir === dir); }

const usageService = {};
function pagesUsing(re) {
  const set = new Set();
  const walk = (p) => { for (const f of fs.readdirSync(p)) { const q = path.join(p, f); if (fs.statSync(q).isDirectory()) walk(q); else if (/\.(html|ts)$/.test(f) && !f.includes('.spec')) { if (re.test(read(q))) set.add(q.split(path.sep)[3]); } } };
  walk('src/app/pages');
  return [...set].filter((x) => !['design-system-components', 'design-system-audit', 'grade-story'].includes(x)).sort();
}

const out = [];
const mismatches = [];
const zhUsed = new Set();
const sbTitlesMentioned = [];

for (const r of R) {
  const zh = r.zh ? parseZh(r.zh) : null;
  if (r.zh && !zh) throw new Error('missing zh ' + r.zh);
  if (zh) zhUsed.add(r.zh);
  const c = r.selector ? compIndex[r.selector] : null;
  if (r.selector && !c) throw new Error('missing selector ' + r.selector);
  const ex = r.extra;
  const vibecoded = ex.vibecoded === true || (!!c && !ex.noCode);
  const dir = c ? 'src/app/shared/ui/' + c.dir : null;

  // Figma
  let figma = { fileKey: null, nodeId: null, componentKey: null, url: null };
  let design = false;
  if (!ex.noFigma) {
    const lib = ex.lib;
    const fileKey = lib ? LIB[lib] : null;
    const nodeId = zh ? zh.node : null;
    const key = ex.k ? KEYS[ex.k] : (zh && zh.key) || null;
    if (nodeId || key || zh) {
      design = true;
      figma = { fileKey: fileKey || null, nodeId: nodeId || null, componentKey: key || null, url: nodeUrl(fileKey, nodeId) };
    }
  }
  if (ex.noFigma) design = false;
  // Special: components with only a known key (icon/logo/divider) count as designed
  if (ex.k && !design && !ex.noFigma) design = true;

  // Storybook
  let vibecodedUrl = null;
  if (r.story && storyIndex[r.story]) vibecodedUrl = storyUrl(r.story);
  if (ex.story2) vibecodedUrl = SB + "?path=/story/" + ex.story2;
  if (r.story && !storyIndex[r.story] && !ex.story2) throw new Error('story not found ' + r.story + ' for ' + r.id);
  const hasStory = !!vibecodedUrl;

  // ZeroHeight
  let zeroheight = { pageId: null, url: null, status: null, markdown: null };
  if (zh) zeroheight = { pageId: null, url: null, status: 'drafted', markdown: zh.file };
  const ZH_PAGES = { button: [9166118, '20fe33', 'hidden'], link: [9166113, null, 'stub-hidden'], 'button-icon': [9166114, null, 'stub-hidden'], 'button-split': [9166115, null, 'stub-hidden'], 'segmented-control': [9166116, null, 'stub-hidden'], tag: [9166117, null, 'stub-hidden'] };
  if (ZH_PAGES[r.id]) {
    const [pid, uid, st] = ZH_PAGES[r.id];
    zeroheight = { pageId: pid, url: uid ? ZH_BASE + uid : null, status: st, markdown: zh ? zh.file : null };
  }
  const hasDoc = !!zh;

  // description
  const description = r.description || (zh ? zh.description : '');

  // variants
  let variants = [], variantsSource = 'none';
  if (zh && zh.variants.length) { variants = zh.variants.slice(0, 12); variantsSource = 'figma'; }
  else if (c && c.inputs.length) { variants = c.inputs.slice(0, 12); variantsSource = 'code'; }

  // state
  let state;
  if (vibecoded && hasStory && design && hasDoc) state = 'ready';
  else if (vibecoded && hasStory) state = 'in-review';
  else state = 'draft';

  // dates / versions
  let lastChange = null, firstChange = null, commits = 0;
  if (!dir && ex.via) { const gi = gitInfo(compIndex[ex.via].dir); lastChange = gi.last; firstChange = gi.first; commits = gi.commits; }
  if (dir) { const gi = gitInfo(c.dir); lastChange = gi.last; firstChange = gi.first; commits = gi.commits; }
  else if (zh && !ex.via) { lastChange = cp.execSync(`git log -1 --format=%cs -- ${zh.file}`).toString().trim() || null; }
  const ageDays = firstChange ? Math.round((Date.parse(TODAY) - Date.parse(firstChange)) / 86400000) : 0;
  let version;
  if (!vibecoded) version = '0.1.0';
  else if (ageDays >= 30 && state !== 'draft') version = '1.0.0';
  else version = `0.${Math.max(1, Math.min(commits, 9))}.0`;

  // usedBy
  let usedByPages = [];
  if (c) {
    if (ex.usage && ex.usage.startsWith('service:')) usedByPages = pagesUsing(new RegExp(ex.usage.split(':')[1]));
    else if (ex.usage === 'tooltip') usedByPages = [...new Set([...c.usedByPages, ...compIndex['[dsTooltip]'].usedByPages])].sort();
    else if (ex.usage === 'dsFocusTrap') usedByPages = pagesUsing(/dsFocusTrap/);
    else usedByPages = c.usedByPages.slice().sort();
  }
  const usedBy = usedByPages.length;

  // commentary
  let commentary = ex.comment || '';
  if (!commentary) {
    const parts = [];
    if (zh && /WIP/.test(zh.status)) parts.push('Figma page marked Design WIP.');
    if (zh && /New/.test(zh.status)) parts.push('Figma component is new (🆕), not yet in the stable library set.'.replace(' (🆕)', ''));
    commentary = parts.join(' ') || (state === 'ready' ? 'Code, story, Figma and doc all in place.' : '');
  }
  if (!commentary) commentary = 'See state rule.';
  if (state !== 'ready') {
    const miss = [];
    if (!vibecoded) miss.push('code');
    if (!hasStory) miss.push('story');
    if (!design) miss.push('Figma');
    if (!hasDoc) miss.push('doc');
    commentary = commentary.replace(/\.?$/, '.') + ` Missing for ready: ${miss.join(', ')}.`;
  }

  out.push({
    id: r.id, name: r.name, selector: r.selector,
    category: r.category, level: r.level,
    figmaLibrary: ex.lib || null,
    description,
    availability: { design, vibecoded, dev: false },
    figma,
    storybook: { vibecodedUrl, devUrl: null, devStatus: 'planned' },
    zeroheight,
    version, state, lastChange,
    commentary,
    variants, variantsSource,
    usedBy, usedByPages,
    visual: { figmaNodeId: figma.nodeId, fileKey: figma.fileKey },
    codeFolder: dir,
  });

  // mismatches
  if (zh) for (const t of zh.sbTitles) sbTitlesMentioned.push({ id: r.id, title: t });
}

// locals
for (const l of LOCALS) {
  const id = 'local-' + l.file + '-' + l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const fileKey = LOCAL_FILES[l.file];
  const isExposure = l.file === 'exposure-card';
  const isChangelog = l.name === 'Changelog entry';
  out.push({
    id: isChangelog ? 'local-changelog-entry' : id,
    name: l.name, selector: null,
    category: 'local', level: l.level,
    figmaLibrary: null,
    description: l.desc,
    availability: { design: true, vibecoded: isExposure ? false : !isChangelog, dev: false },
    figma: { fileKey, nodeId: l.node, componentKey: null, url: nodeUrl(fileKey, l.node) },
    storybook: { vibecodedUrl: null, devUrl: null, devStatus: 'planned' },
    zeroheight: { pageId: null, url: null, status: null, markdown: null },
    version: isExposure ? '0.1.0' : '1.0.0',
    state: isExposure ? 'draft' : 'in-review',
    lastChange: l.page ? gitLast(`src/app/pages/${l.page}`) : (isExposure ? '2026-11-05' : null),
    commentary: isExposure
      ? 'Figma component built (file 5OVzA6FZD7o8aGtfK5qo7g, node id not recorded); code ds-exposure-card is on branch feat/exposure-cards (337befb7), not merged into main.'
      : isChangelog
        ? 'Figma-only documentation helper present in every feature file (nodes: Search 8:57, Buyer Summary 2:49, Coverbook 7:60, Reject Management 5:98, Manual Underwriting 11:49).'
        : `Local to the Qirin · ${FILE_LABEL[l.file]} Figma file (v1.0, Ready for dev); implemented inside src/app/pages/${l.page}, no story and no doc by design (not a library component).`,
    variants: [], variantsSource: 'none',
    usedBy: null, usedByPages: [],
    visual: { figmaNodeId: l.node, fileKey },
    codeFolder: l.page ? `src/app/pages/${l.page}` : null,
  });
}

// ---- mismatches --------------------------------------------------------------
const allSelectors = Object.keys(compIndex);
const covered = new Set(R.map((r) => r.selector).filter(Boolean));
for (const s of allSelectors) if (!covered.has(s) && s !== '[dsTooltip]') mismatches.push({ kind: 'code-not-in-status', ref: s, detail: 'Selector present in shared/ui but missing from this file.' });

for (const r of out) {
  if (r.category === 'local') continue;
  if (r.selector && !r.availability.design) mismatches.push({ kind: 'code-only', ref: r.id, selector: r.selector, detail: 'Component in shared/ui with no matching Figma library component.' });
  if (!r.selector && r.availability.design && r.figmaLibrary) mismatches.push({ kind: 'figma-only', ref: r.id, name: r.name, detail: r.commentary });
  if (r.selector && !r.zeroheight.markdown) mismatches.push({ kind: 'no-doc', ref: r.id, selector: r.selector, detail: 'No ZeroHeight Markdown page for this code component.' });
  if (r.selector && !r.storybook.vibecodedUrl && r.id !== 'focus-trap') mismatches.push({ kind: 'no-story', ref: r.id, selector: r.selector, detail: 'Code component without a Storybook story.' });
}
// name differences Figma vs selector
const nameDiff = [
  ['breadcrumbs', 'Breadcrumb (Figma) vs ds-breadcrumbs'],
  ['textarea', 'Text Area (Figma) vs ds-textarea'],
  ['select', 'Dropdown (Figma) vs ds-select + ds-multi-select'],
  ['multi-select', 'Dropdown (Figma) vs ds-select + ds-multi-select'],
  ['confirm-dialog', 'Popin (Figma) vs ds-confirm-dialog'],
  ['skeleton-item', 'Skeleton (Figma page) vs ds-skeleton-item'],
  ['toaster', 'Toaster (Figma) vs ds-toaster-container + ToasterService'],
  ['side-nav', 'Side Navigation (Figma) vs ds-side-nav'],
  ['search-bar-scoped', 'Search Bar (Figma) vs ds-search-bar-scoped (and a different code ds-search-bar exists)'],
  ['result-card', 'Horizontal Card (Figma) vs ds-result-card'],
  ['policy-result-card', 'Horizontal Card (Figma) vs ds-policy-result-card'],
  ['list-widget', 'List Item (Figma) vs ds-list-widget + ds-newsfeed'],
  ['newsfeed', 'List Item (Figma) vs ds-list-widget + ds-newsfeed'],
  ['widget-card', 'Card with Slot (Figma) vs ds-widget-card'],
  ['flyout-menu-item', 'Flyout Item (Figma) vs ds-flyout-menu-item'],
  ['table-row', 'Data Grid / Table (Figma) vs ds-table-row and ds-cell-*'],
  ['segmented-control', 'Component 1 (Figma set name) vs Segmented Control'],
  ['tile', 'Tiles (Figma set name) vs ds-tile'],
];
for (const [id, d] of nameDiff) mismatches.push({ kind: 'name-differs', ref: id, detail: d });
// figma-only items without a record
mismatches.push({ kind: 'figma-only', ref: 'progress-circle', name: 'Progress Circle', detail: 'WIP page in the Feedback file, no component set; no code.' });
mismatches.push({ kind: 'figma-only', ref: 'contextual-help', name: 'Contextual Help', detail: 'WIP page in the Feedback file, no component set; no code.' });
mismatches.push({ kind: 'figma-only', ref: 'deprecated-link', name: '[DEPRECATED] Link', detail: 'The only Link set published in the Action library; the two current Link sets are unpublished.' });
mismatches.push({ kind: 'figma-only', ref: 'task', name: 'Task (Layout)', detail: 'Layout library Task component is a checkbox row, unusable for lists; no code counterpart.' });
mismatches.push({ kind: 'figma-only', ref: 'private-atoms', name: '.Content, .Action, .Columns, ... (private atoms)', detail: 'Private Figma sub-elements prefixed with a dot are not listed as components by design.' });
// docs outdated / wrong
mismatches.push({ kind: 'docs-outdated', ref: 'policy-color', detail: 'ZeroHeight page says "Tech Planned / no shared/ui component yet" but ds-policy-color exists in shared/ui (added 2026-11-04).' });
mismatches.push({ kind: 'docs-only', ref: 'badge-counter', detail: 'Doc and Figma exist, no standalone code (counter input of ds-tab).' });
mismatches.push({ kind: 'docs-only', ref: 'button-load-more', detail: 'Doc and Figma exist, no standalone code (ds-button fullWidth).' });
mismatches.push({ kind: 'docs-only', ref: 'dropdown-flyout-menu', detail: 'Doc and Figma exist, code is ds-flyout-menu.' });
// ZH story titles not found in Storybook
for (const t of sbTitlesMentioned) if (!storyIndex[t.title]) mismatches.push({ kind: 'docs-story-missing', ref: t.id, detail: `ZeroHeight page cites Storybook title "${t.title}" which does not exist in the stories.` });
// storybook titles whose section differs from the category
for (const r of out) {
  if (r.category === 'local' || !r.selector) continue;
}
const secLib = { 'Action': 'action', 'Data Display': 'data-display', 'Data Entry': 'data-entry', 'Feedback': 'feedback', 'Layout': 'layout' };
for (const r of out) { if (r.category === 'local' || !r.selector || !r.figmaLibrary) continue; const rec = R.find((x) => x.id === r.id); const sec = rec.story && rec.story.split('/')[1]; if (sec && secLib[sec] && secLib[sec] !== r.figmaLibrary && !r.id.startsWith('modal-') && !['side-nav-item','flyout-menu-item'].includes(r.id)) mismatches.push({ kind: 'story-section-differs', ref: r.id, detail: `Storybook section ${sec} but Figma library ${r.figmaLibrary}.` }); }
// Figma retirement
mismatches.push({ kind: 'figma-retired', ref: 'result-card, policy-result-card, properties-panel, search-bar-scoped', detail: 'Retired from the Figma libraries on 2026-11-03 (replaced by Horizontal Card, Card .Columns and the Search Bar master) while the code components remain.' });
mismatches.push({ kind: 'code-branch-only', ref: 'exposure-card', detail: 'ds-exposure-card exists on branch feat/exposure-cards (337befb7) only; the Figma file 5OVzA6FZD7o8aGtfK5qo7g exists.' });

// ---- summary ---------------------------------------------------------------
const count = (arr, f) => arr.reduce((a, x) => { const k = f(x); a[k] = (a[k] || 0) + 1; return a; }, {});
const summary = {
  total: out.length,
  libraryComponents: out.filter((x) => x.category !== 'local').length,
  localComponents: out.filter((x) => x.category === 'local').length,
  byCategory: count(out, (x) => x.category),
  byLevel: count(out, (x) => x.level),
  byState: count(out, (x) => x.state),
  availability: {
    design: out.filter((x) => x.availability.design).length,
    vibecoded: out.filter((x) => x.availability.vibecoded).length,
    dev: out.filter((x) => x.availability.dev).length,
    storybook: out.filter((x) => x.storybook.vibecodedUrl).length,
    zeroheightMarkdown: out.filter((x) => x.zeroheight.markdown).length,
    designAndVibecoded: out.filter((x) => x.availability.design && x.availability.vibecoded).length,
    designOnly: out.filter((x) => x.availability.design && !x.availability.vibecoded).length,
    vibecodedOnly: out.filter((x) => !x.availability.design && x.availability.vibecoded).length,
  },
  mismatchesCount: mismatches.length,
};
const doc = {
  schemaVersion: 1,
  generatedAt: TODAY,
  source: 'docs/components-status/README.md',
  storybookBaseUrl: SB,
  zeroheight: { styleguideId: 138794, baseUrl: ZH_BASE },
  figmaFiles: { tokens: '4TxqgJPVFZc4ZKw4JZ6OAn', ...LIB, ...LOCAL_FILES, layoutMockup: 'bbgSPUChd18EVNGijjoZGn' },
  summary,
  components: out,
  mismatches,
};
fs.mkdirSync('docs/components-status', { recursive: true });
fs.writeFileSync('docs/components-status/components.json', JSON.stringify(doc, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 1));
