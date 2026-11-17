// Tutorial film: Button. Content only (texts, scenes, timings, what to capture). The engine is in ../engine.
// Timings in seconds of the film. The music bed phrases every 16 s; with offset 4 its changes land at 12 s and 28 s
// of the film and its final chord rings out from 42 s: cut the chapters on those.
module.exports = {
  id: 'button',
  name: 'Button',
  family: 'Action',
  duration: 44,
  fps: 60,
  music: { file: 'bed-a.mp3', offset: 4 },
  files: { full: 'Qirin-Button-tutorial-1080p.mp4', light: 'Qirin-Button-tutorial-720p.mp4' },

  // ---- what to capture, from the real prototype (http://localhost:4450/#) ----
  capture: {
    async run(h) {
      const RM = '/reject-management';
      // ids on every ds-button of the page first (moving one changes the order of the others)
      const tag = () => h.eval(() => document.querySelectorAll('ds-button').forEach((e, i) => e.id = '__b' + i));
      const btn = async i => '#__b' + i;

      // 1. The four types, isolated on a white stage, labels in English, no icon
      await h.go(RM); await tag();
      const T = [['primary', 3, 'Primary'], ['secondary', 2, 'Secondary'], ['tertiary', 1, 'Tertiary'], ['plain', 4, 'Plain']];
      for (const [type, i, label] of T) {
        const s = await btn(i);
        await h.eval(([s, label]) => __t.adopt(document.querySelector(s), { label, keepIcons: false, inputs: { disabled: false } }), [s, label]);
      }
      for (const [type, i] of T) await h.shot(`type-${type}`, `#__b${i}`);

      // 2. One primary for the purpose line: Validate, default / hover / pressed
      await h.go(RM); await tag();
      const v = await btn(3);
      await h.eval(s => __t.adopt(document.querySelector(s), { label: 'Validate', keepIcons: false, inputs: { disabled: false } }), v);
      const vc = await h.clipOf(v, 14);
      await h.shot('validate-default', v, { clip: vc, pad: 0 });
      await h.hover(v); await h.shot('validate-hover', v, { clip: vc, pad: 0 });
      await h.press(v); await h.shot('validate-active', v, { clip: vc, pad: 0 }); await h.release();

      // 3. The states, on the real Resubmit button (with its icon)
      await h.go(RM); await tag();
      const r = await btn(3);
      await h.eval(s => __t.adopt(document.querySelector(s), { inputs: { disabled: false } }), r);
      const rc = await h.clipOf(r, 14);
      const S = (id) => h.shot(id, r, { clip: rc, pad: 0 });
      await h.away(); await S('state-default');
      await h.hover(r); await S('state-hover');
      await h.press(r); await S('state-active'); await h.release();
      await h.keyFocus(r); await S('state-focus'); await h.blur();
      await h.eval(s => __t.setIn(document.querySelector(s), 'loading', true), r); await h.away();
      await h.frames('state-loading', r, 12, 750, rc);
      await h.eval(s => { const e = document.querySelector(s); __t.setIn(e, 'loading', false); __t.setIn(e, 'disabled', true); }, r);
      await h.away(); await S('state-disabled');

      // 4. Do / Don't: the real action bar of Reject Management, one row selected
      await h.go(RM, { dpr: 3 });
      await h.click('ds-table-row ds-cell-selection >> nth=1');
      await h.away();
      const ids = await h.eval(() => { const b = [...document.querySelectorAll('.rm-actions__buttons ds-button')]; b.forEach((e, i) => e.id = '__r' + i); return b.map(e => '#' + e.id); });
      const barClip = await h.eval(ids => { const u = __t.union(ids.slice(1)); return { x: u.x - 20, y: u.y - 16, w: u.w + 30, h: u.h + 32 }; }, ids);
      await h.shot('do', null, { clip: barClip, pad: 0 });
      await h.eval(s => __t.setIn(document.querySelector(s), 'type', 'primary'), ids[2]);
      await h.wait(300); await h.shot('dont', null, { clip: barClip, pad: 0 });

      // 5. In use: Reject Management, nothing selected -> two rows -> hover, press Resubmit -> rows gone, toast
      await h.go(RM, { dpr: 2 });
      const R = { cb1: 'ds-table-row:nth-of-type(2) ds-cell-selection', cb2: 'ds-table-row:nth-of-type(3) ds-cell-selection',
        del: '.rm-actions__buttons > ds-button:nth-last-of-type(2)', res: '.rm-actions__buttons > ds-button:last-of-type',
        bar: ['.rm-actions__buttons > ds-button:nth-last-of-type(2)', '.rm-actions__buttons > ds-button:last-of-type'],
        table: '.rm-table' };
      await h.away(); await h.screen('rm-0', R);
      await h.click('ds-table-row ds-cell-selection >> nth=1'); await h.away(); await h.screen('rm-1', R);
      await h.click('ds-table-row ds-cell-selection >> nth=2'); await h.away(); await h.screen('rm-2', R);
      await h.hover(R.res); await h.screen('rm-3', R);
      await h.press(R.res); await h.screen('rm-4', R);
      await h.page.mouse.up(); await h.away(); await h.wait(500);
      await h.screen('rm-5', { ...R, toast: 'ds-toaster-container' });
    },
  },

  // ---- the film ----
  scenes: [
    { type: 'title', t: 0, d: 3.4, kicker: 'Qirin design system', title: 'Button', tag: 'Action' },

    { type: 'statement', t: 3.4, d: 4.2, chapter: 'What it is',
      text: 'A button <em>triggers an action</em> on the current screen.',
      sub: 'Submit, validate, open a flow, confirm a decision.',
      demo: { shots: { rest: 'validate-default', hover: 'validate-hover', down: 'validate-active' }, scale: 2.6, hoverAt: 1.6, clickAt: 2.3 } },

    { type: 'gallery', t: 7.6, d: 4.4, chapter: 'Four types',
      heading: 'Four types, from the <em>strongest</em> to the lightest.',
      scale: 2.4, items: [
        { shot: 'type-primary', sub: 'The main action' },
        { shot: 'type-secondary', sub: 'Actions next to it' },
        { shot: 'type-tertiary', sub: 'Lighter actions' },
        { shot: 'type-plain', sub: 'Inline, in dense rows' },
      ] },

    { type: 'dodont', t: 12, d: 7, chapter: 'The key rule',
      heading: '<em>One Primary</em> per area.',
      sub: 'The main action stands out. The others step back.',
      scale: 1.5,
      do: { shot: 'do', text: 'One Primary, next to a Secondary' },
      dont: { shot: 'dont', text: 'Two Primary buttons side by side' } },

    { type: 'states', t: 19, d: 9, chapter: 'States',
      heading: 'It always tells you <em>what is happening</em>.',
      scale: 2.2, rest: 'state-default', items: [
        { kind: 'hover', shot: 'state-hover', down: 'state-active', caption: 'Hover', sub: 'Under the pointer' },
        { kind: 'focus', shot: 'state-focus', caption: 'Focus', sub: 'Ring on keyboard focus' },
        { kind: 'loading', shot: 'state-loading', caption: 'Loading', sub: 'While the request runs' },
        { kind: 'disabled', shot: 'state-disabled', caption: 'Disabled', sub: 'Say why it is not available' },
      ] },

    { type: 'screen', t: 28, d: 11.6, chapter: 'In use',
      // which capture is on screen from when (s, relative to the scene)
      shots: [[0, 'rm-0'], [2.0, 'rm-1'], [3.0, 'rm-2'], [7.2, 'rm-3'], [8.2, 'rm-4'], [8.45, 'rm-5']],
      // pointer: rect name (centre) or [x, y] in page px, time of arrival; click: true for a press at arrival
      cursor: [[0, [980, 700]], [1.9, 'cb1', true], [2.9, 'cb2', true], [7.2, 'res'], [8.2, 'res', true], [10, [1339, 545]]],
      // camera: from t, eased over 0.9 s: null (whole page), [rect name, zoom] or [x, y, zoom] (top-left of the view, page px)
      camera: [[0, null], [4.0, [805, 216, 2.28]], [9.0, null]],
      captions: [
        [0.4, 3.9, 'In Reject Management, nothing selected: actions <em>disabled</em>.'],
        [4.0, 7.0, 'Select rows and they <em>come alive</em>.'],
        [7.0, 9.0, 'One Primary: <em>Resubmit</em>, the main action.'],
        [9.0, 11.6, 'Click it: the action runs and is <em>confirmed</em>.'],
      ],
      // callouts: [from, to, rect name, text, 'above' (default: below the rect)]
      callouts: [[4.8, 7.0, 'del', 'Secondary'], [5.2, 7.0, 'res', 'Primary'], [9.3, 11.6, 'toast', 'Confirmed by a toaster', 'above']] },

    { type: 'end', t: 39.6, d: 4.4, title: 'Button',
      lines: ['Full guidelines on <em>ZeroHeight</em>', 'Live examples in <em>Storybook</em>'],
      foot: 'Design System / Action / Button' },
  ],
};
