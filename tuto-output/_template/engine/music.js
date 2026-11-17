// Music bed shared by every component tutorial (ElevenLabs music_v2_5, instrumental, no voice).
// One track serves all the films: the scene grid of each config is cut on its 16 s phrases (120 BPM, 8 bars).
// Usage (NODE_OPTIONS=--use-system-ca):
//   node music.js plan               -> ../music/plan.json (free: the model writes its plan from the brief)
//   node music.js compose [suffix]   -> ../music/bed<suffix>.mp3 (costs credits)
// The key is read from TUTO_ENV (default: the brag film's work/.env.local) and never printed.
const fs = require('fs'), path = require('path');
const ENV = process.env.TUTO_ENV || path.resolve(__dirname, '../../../brag-output-2026-10-15-bs/work/.env.local');
const key = (fs.readFileSync(ENV, 'utf8').match(/ELEVENLABS_API_KEY=(\S+)/) || [])[1];
const MODEL = 'music_v2_5', LEN = 48000;
const BRIEF = 'Instrumental only, 48 seconds, 120 BPM, a calm and confident corporate keynote score for a short product tutorial video, with no voice. '
  + 'Felt piano motif, warm round bass, soft muted plucks, light brushed percussion and a gentle kick, airy pads. Clear, precise, reassuring, quietly optimistic, '
  + 'a steady groove that never gets busy, so on-screen text reads easily. It opens softly with piano and pulse, the groove settles in, grows a little richer '
  + 'halfway through, and ends on a clean resolved chord on a downbeat that rings out naturally. '
  + 'Expensive modern mix, wide stereo. No risers, no white noise sweeps, no whooshes, no filter sweeps, no reverse cymbals, no drum rolls, no vocals.';
const NEG = ['risers', 'white noise sweeps', 'whooshes', 'filter sweeps', 'reverse cymbals', 'drum rolls', 'vocals', 'singing', 'aggressive drums'];
const dir = path.resolve(__dirname, '../music');
const api = async (url, body, method = 'POST') => {
  const r = await fetch(`https://api.elevenlabs.io${url}`, { method, headers: { 'xi-api-key': key, 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
  if (!r.ok) { console.error(r.status, (await r.text()).slice(0, 800)); process.exit(1); }
  return r;
};
(async () => {
  const [mode, suffix = ''] = process.argv.slice(2);
  if (mode === 'plan') {
    const plan = await (await api('/v1/music/plan', { prompt: BRIEF, music_length_ms: LEN, model_id: MODEL })).json();
    const list = plan.chunks || plan.sections || [];
    list.forEach(c => { for (const k of ['negative_styles', 'negative_local_styles']) if (c[k]) c[k] = [...new Set([...c[k], ...NEG])]; });
    fs.writeFileSync(path.join(dir, 'plan.json'), JSON.stringify(plan, null, 1));
    console.log(JSON.stringify(plan, null, 1)); return;
  }
  if (mode === 'compose') {
    const plan = JSON.parse(fs.readFileSync(path.join(dir, 'plan.json'), 'utf8'));
    const r = await api('/v1/music?output_format=mp3_44100_128', { composition_plan: plan, model_id: MODEL });
    const out = path.join(dir, `bed${suffix}.mp3`);
    fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
    // the key has no user_read: the cost is read from the response headers when the API sends it
    const cost = [...r.headers].filter(([k]) => /cost|credit|character/i.test(k));
    console.log('written', out, cost.length ? JSON.stringify(cost) : '(no cost header)'); return;
  }
  console.log('usage: node music.js plan|compose [suffix]');
})();
