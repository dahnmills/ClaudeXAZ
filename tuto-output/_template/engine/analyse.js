// Music check: loudness per 0.5 s (full band and above 5 kHz, where the pre-phrase rolls live) + spectrogram PNG.
// Usage: node analyse.js <file.mp3>  -> prints the envelope, writes <file>.spec.png
const { execFileSync } = require('child_process');
const FF = process.env.FF || 'C:/Users/JDAHAN/documents/Qirin-Claude/brag-output/work/node_modules/ffmpeg-static/ffmpeg.exe';
const f = process.argv[2], SR = 22050, W = SR / 2;
const pcm = af => { const b = execFileSync(FF, ['-v', 'error', '-i', f, '-af', af, '-ac', '1', '-ar', String(SR), '-f', 's16le', '-'], { maxBuffer: 1e9 }); return new Int16Array(b.buffer, b.byteOffset, b.length / 2); };
const env = a => { const o = []; for (let i = 0; i + W <= a.length; i += W) { let s = 0; for (let j = i; j < i + W; j++) s += (a[j] / 32768) ** 2; o.push(Math.round(10 * Math.log10(s / W + 1e-12))); } return o; };
const full = env(pcm('anull')), hi = env(pcm('highpass=f=5000,highpass=f=5000'));
console.log('dur', (full.length / 2).toFixed(1), 's');
for (let i = 0; i < full.length; i += 8) console.log(String(i / 2).padStart(5), 'full', full.slice(i, i + 8).join(' ').padEnd(32), '| >5k', hi.slice(i, i + 8).join(' '));
execFileSync(FF, ['-v', 'error', '-y', '-i', f, '-lavfi', 'showspectrumpic=s=1600x500:legend=1:scale=log', f.replace(/\.\w+$/, '.spec.png')]);
