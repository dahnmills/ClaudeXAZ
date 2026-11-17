// Tutorial film: Button. Content only (texts, scenes, timings, what to capture). The engine is in ../engine.
// Timings in seconds of the film. The music bed phrases every 16 s; with offset 4 its changes land at 12 s and 28 s
// of the film and its final chord rings out from 42 s: cut the chapters on those.
// A component film stays generic: no feature screen, no feature name, no business label.
module.exports = {
  id: 'button',
  name: 'Button',
  family: 'Action',
  duration: 44,
  fps: 60,
  music: { file: 'bed-a.mp3', offset: 4 },
  files: { full: 'Qirin-Button-tutorial-1080p.mp4', light: 'Qirin-Button-tutorial-720p.mp4' },

  // ---- what to capture, from the real prototype (http://localhost:4450/#) ----
  // Source page: the component catalogue (/design-system-components), a neutral page with every ds-* live on it.
  capture: {
    async run(h) {
      const DS = '/design-system-components';
      // a ds-button of the page by its text, tagged with an id (moving one changes the order of the others)
      const pick = (text, id) => h.eval(([t, id]) => { const e = [...document.querySelectorAll('ds-button')].find(b => b.textContent.trim() === t); e.id = id; return '#' + id; }, [text, id]);

      // 1. The four types, isolated on a white stage, labels in English, no icon
      await h.go(DS);
      const T = [['primary', 'Validate', 'Primary'], ['secondary', 'Confirm', 'Secondary'], ['tertiary', 'Cancel', 'Tertiary'], ['plain', 'Apply', 'Plain']];
      for (const [type, src, label] of T) {
        const s = await pick(src, '__t-' + type);
        await h.eval(([s, label, type]) => __t.adopt(document.querySelector(s), { label, keepIcons: false, inputs: { type, disabled: false } }), [s, label, type]);
      }
      for (const [type] of T) await h.shot(`type-${type}`, `#__t-${type}`);

      // 2. One primary for the purpose line: Validate, default / hover / pressed
      await h.go(DS);
      const v = await pick('Validate', '__v');
      await h.eval(s => __t.adopt(document.querySelector(s), { label: 'Validate', keepIcons: false, inputs: { type: 'primary', disabled: false } }), v);
      const vc = await h.clipOf(v, 14);
      await h.shot('validate-default', v, { clip: vc, pad: 0 });
      await h.hover(v); await h.shot('validate-hover', v, { clip: vc, pad: 0 });
      await h.press(v); await h.shot('validate-active', v, { clip: vc, pad: 0 }); await h.release();

      // 3. The states, on a primary Save button
      await h.go(DS);
      const r = await pick('Show toast', '__s');
      await h.eval(s => __t.adopt(document.querySelector(s), { label: 'Save', keepIcons: false, inputs: { type: 'primary', disabled: false } }), r);
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

      // A generic screen made of live catalogue components: a "My profile" page (ds-page-title, ds-properties-panel)
      // under an "Edit contact details" ds-modal (ds-input-text, ds-input-email, Cancel Secondary + Save Primary).
      const compose = () => h.eval(() => {
        const all = s => [...document.querySelectorAll(s)];
        const st = __t.stage('display:block;padding:40px 56px;background:var(--semantic-color-static-background-main-primary);');
        window.__rows = phone => [{ title: 'Contact details', rows: [
          { label: 'Name', value: 'Jane Smith' }, { label: 'Email', value: 'jane.smith@example.com' },
          { label: 'Phone number', value: phone }, { label: 'City', value: 'London' } ] }];
        const title = document.querySelector('ds-page-title'); st.appendChild(title); __t.setIn(title, 'title', 'My profile');
        const wrap = document.createElement('div'); wrap.style.cssText = 'margin-top:24px;max-width:880px;'; st.appendChild(wrap);
        const panel = document.querySelector('ds-properties-panel'); panel.id = '__panel'; wrap.appendChild(panel);
        __t.setIn(panel, 'variant', 'card'); __t.setIn(panel, 'columns', 2); __t.setIn(panel, 'sections', window.__rows('—'));
        const modal = document.querySelector('ds-modal'); modal.id = '__modal'; st.appendChild(modal);
        __t.setIn(modal, 'size', 'small'); __t.setIn(modal, 'title', 'Edit contact details'); __t.setIn(modal, 'contentHeight', 'auto');
        const content = modal.querySelector('ds-modal-content'); content.querySelectorAll('p').forEach(p => p.remove());
        const form = document.createElement('div'); form.style.cssText = 'display:grid;gap:var(--semantic-measurement-spacing-m);'; content.appendChild(form);
        const inp = (el, id, label, value) => { el.id = id; form.appendChild(el); __t.setIn(el, 'label', label); __t.setIn(el, 'placeholder', ''); __t.setIn(el, 'value', value); };
        inp(all('ds-input-text').find(e => e.textContent.trim().startsWith('Name')), '__name', 'Name', 'Jane Smith');
        inp(document.querySelector('ds-input-email'), '__email', 'Email', 'jane.smith@example.com');
        inp(all('ds-input-text').find(e => e.textContent.trim().startsWith('Phone')), '__phone', 'Phone number', '');
        const save = modal.querySelector('ds-modal-footer ds-button'); save.id = '__save';
        save.querySelector('[class$="__label"]').textContent = 'Save'; __t.setIn(save, 'disabled', true);
        const cancel = all('ds-button').find(e => e.textContent.trim() === 'Cancel'); cancel.id = '__cancel';
        save.parentElement.insertBefore(cancel, save); __t.setIn(cancel, 'type', 'secondary');
        st.appendChild(document.querySelector('ds-toaster-container'));
      });

      // 4. Do / Don't: the footer of that modal, Cancel (Secondary) + Save (Primary); Don't: Cancel turns Primary
      await h.go(DS, { dpr: 3 }); await compose();
      await h.eval(() => __t.setIn(document.querySelector('#__save'), 'disabled', false));
      await h.away();
      const barClip = await h.eval(() => { const u = __t.union(['#__cancel', '#__save']); return { x: u.x - 12, y: u.y - 12, w: u.w + 24, h: u.h + 24 }; });
      await h.shot('do', null, { clip: barClip, pad: 0 });
      await h.eval(() => __t.setIn(document.querySelector('#__cancel'), 'type', 'primary'));
      await h.wait(300); await h.shot('dont', null, { clip: barClip, pad: 0 });

      // 5. In use: nothing changed, Save disabled -> type a phone number, Save active -> hover, press -> saved, toast
      await h.go(DS, { dpr: 2 }); await compose();
      const R = { field: '#__phone input', cancel: '#__cancel', save: '#__save', bar: ['#__cancel', '#__save'],
        box: '.ds-modal__box', panel: '#__panel' };
      await h.away(); await h.screen('use-0', R);
      await h.page.click(R.field); await h.away(); await h.screen('use-1', R);
      await h.page.keyboard.type('+44 20'); await h.screen('use-2', R);
      await h.page.keyboard.type(' 7946 0321');
      await h.eval(() => __t.setIn(document.querySelector('#__save'), 'disabled', false)); await h.wait(300);
      await h.screen('use-3', R);
      await h.hover(R.save); await h.screen('use-4', R);
      await h.press(R.save); await h.screen('use-5', R);
      await h.page.mouse.up(); await h.away();
      await h.eval(() => {
        __t.setIn(document.querySelector('#__modal'), 'open', false);
        __t.setIn(document.querySelector('#__panel'), 'sections', window.__rows('+44 20 7946 0321'));
        ng.getComponent(document.querySelector('app-design-system-components')).toaster
          .show('Your contact details are up to date.', { title: 'Changes saved', tone: 'success', duration: 0 });
      });
      await h.wait(800);
      await h.screen('use-6', { ...R, toast: 'ds-toaster-container' });
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
      scale: 2.2,
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
      shots: [[0, 'use-0'], [2.4, 'use-1'], [2.75, 'use-2'], [3.2, 'use-3'], [7.2, 'use-4'], [8.2, 'use-5'], [8.45, 'use-6']],
      // pointer: rect name (centre) or [x, y] in page px, time of arrival; click: true for a press at arrival
      cursor: [[0, [1000, 700]], [2.4, 'field', true], [3.6, [1080, 520]], [7.2, [896, 576]], [8.2, [896, 576], true], [8.45, [896, 576]], [10, [1000, 560]]],
      // camera: from t, eased over 0.9 s: null (whole page), rect name then zoom ([t, name, zoom]) or [t, [x, y, zoom]] (top-left of the view, page px)
      camera: [[0, null], [4.0, [470, 196, 1.8]], [8.5, null]],
      captions: [
        [0.4, 3.3, 'Nothing has changed yet: Save is <em>disabled</em>.'],
        [3.3, 7.0, 'Enter a value and it <em>comes alive</em>.'],
        [7.0, 9.0, 'One Primary: <em>Save</em>, the main action.'],
        [9.0, 11.6, 'Click it: the action runs and is <em>confirmed</em>.'],
      ],
      // callouts: [from, to, rect name, text, 'above' (default: below the rect)]
      callouts: [[4.8, 7.0, 'cancel', 'Secondary'], [5.2, 7.0, 'save', 'Primary'], [9.5, 11.6, 'toast', 'Confirmed by a toaster', 'above']] },

    { type: 'end', t: 39.6, d: 4.4, title: 'Button',
      lines: ['Full guidelines on <em>ZeroHeight</em>', 'Live examples in <em>Storybook</em>'],
      foot: 'Design System / Action / Button' },
  ],
};
