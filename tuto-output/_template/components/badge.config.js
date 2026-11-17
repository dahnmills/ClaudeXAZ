// Tutorial film: Badge (template test, preview only). Same engine and music grid as button.config.js:
// changes of the music at 12 s and 28 s, final chord rings out from 42 s.
module.exports = {
  id: 'badge',
  name: 'Badge',
  family: 'Feedback',
  duration: 44,
  fps: 60,
  music: { file: 'bed-a.mp3', offset: 4 },
  files: { full: 'Qirin-Badge-tutorial-1080p.mp4', light: 'Qirin-Badge-tutorial-720p.mp4' },

  capture: {
    async run(h) {
      const NM = '/notification-module';
      // one live badge, moved to the white stage and re-set for every status (label, status, variant are its inputs)
      await h.go(NM);
      const b = await h.eval(() => { const e = document.querySelector('ds-badge'); return __t.adopt(e); });
      const ST = [['info', 'In progress'], ['success', 'Accepted'], ['warning', 'Pending'], ['error', 'Refused'], ['neutral', 'Draft']];
      for (const variant of ['light', 'strong']) for (const [status, label] of ST) {
        await h.eval(([s, i]) => { const e = document.querySelector(s); for (const [k, v] of Object.entries(i)) __t.setIn(e, k, v); }, [b, { label, status, variant, size: 'm' }]);
        await h.shot(`${variant}-${status}`, b, { pad: 8 });
      }
      // in use: the Notification module list, as it is
      await h.go(NM, { dpr: 2 });
      await h.away();
      await h.screen('nm-0', { first: 'ds-badge', list: 'main' });
    },
  },

  scenes: [
    { type: 'title', t: 0, d: 3.4, kicker: 'Qirin design system', title: 'Badge', tag: 'Feedback' },
    { type: 'statement', t: 3.4, d: 4.2, chapter: 'What it is',
      text: 'A badge gives the <em>status</em> of an item, in a word.',
      sub: 'Read-only. Never a button, never a filter.',
      demo: { shots: { rest: 'light-success' }, scale: 3 } },
    { type: 'gallery', t: 7.6, d: 4.4, chapter: 'Five statuses',
      heading: 'Five statuses, each with <em>its color</em>.', scale: 2.6, items: [
        { shot: 'light-info', sub: 'Info' }, { shot: 'light-success', sub: 'Success' }, { shot: 'light-warning', sub: 'Warning' },
        { shot: 'light-error', sub: 'Error' }, { shot: 'light-neutral', sub: 'Neutral' } ] },
    { type: 'gallery', t: 12, d: 7, chapter: 'Two styles',
      heading: '<em>Light</em> in dense lists, <em>Strong</em> when it must stand out.', scale: 2.6, items: [
        { shot: 'light-success', sub: 'Light' }, { shot: 'strong-success', sub: 'Strong' },
        { shot: 'light-error', sub: 'Light' }, { shot: 'strong-error', sub: 'Strong' } ] },
    { type: 'screen', t: 19, d: 20.6, chapter: 'In use',
      shots: [[0, 'nm-0']], cursor: [[0, [1500, 900]]], camera: [[0, null], [3, 'first', 2]],
      captions: [[0.4, 8, 'In the Notification module: one status per row.']],
      callouts: [[3.6, 8, 'first', 'Strong badge']] },
    { type: 'end', t: 39.6, d: 4.4, title: 'Badge',
      lines: ['Full guidelines on <em>ZeroHeight</em>', 'Live examples in <em>Storybook</em>'],
      foot: 'Design System / Feedback / Badge' },
  ],
};
