// Tutorial films: soundtrack + encode. Music only (no voice): the bed from ../music, started at music.offset,
// faded in over 0.8 s, cut at the film length (its own ring-out ends it), loudness -16 LUFS.
// Usage: node encode.js <component>  -> ../../<component>/<files.full> (1920 x 1080, 60 fps) and <files.light> (1280 x 720, 30 fps)
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const FF = process.env.FF || 'C:/Users/JDAHAN/documents/Qirin-Claude/brag-output/work/node_modules/ffmpeg-static/ffmpeg.exe';
const cfg = require(path.resolve(__dirname, '../components', `${process.argv[2]}.config.js`));
const dir = path.resolve(__dirname, '../..', cfg.id), work = path.join(dir, 'work'), D = cfg.duration;
const run = a => execFileSync(FF, ['-nostdin', '-y', '-loglevel', 'error', ...a], { stdio: 'inherit' });
const wav = path.join(work, 'audio.wav');
run(['-ss', String(cfg.music.offset), '-t', String(D), '-i', path.resolve(__dirname, '../music', cfg.music.file),
  '-af', `afade=t=in:st=0:d=0.8,afade=t=out:st=${D - 0.6}:d=0.6,loudnorm=I=-16:TP=-1.5:LRA=9`, '-ar', '48000', '-ac', '2', wav]);
const frames = path.join(work, 'frames/f%05d.jpg');
// poster = the settled title (cfg.poster s), baked as frame 0 so it is the idle thumbnail (ZeroHeight, players)
const F = n => path.join(work, 'frames', `f${String(n).padStart(5, '0')}.jpg`), orig = path.join(work, 'f00000.orig.jpg');
if (!fs.existsSync(orig)) fs.copyFileSync(F(0), orig);
fs.copyFileSync(F(Math.round(cfg.fps * (cfg.poster ?? 2.5))), path.join(dir, 'poster.jpg'));
fs.copyFileSync(path.join(dir, 'poster.jpg'), F(0));
const enc = (out, vf, fps, crf, ab) => run(['-framerate', String(cfg.fps), '-i', frames, '-i', wav, '-vf', vf, '-r', String(fps),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', ab, '-shortest', '-movflags', '+faststart', path.join(dir, out)]);
enc(cfg.files.full, 'null', cfg.fps, 18, '192k');
enc(cfg.files.light, 'scale=1280:720:flags=lanczos', 30, 26, '128k');
for (const f of [cfg.files.full, cfg.files.light]) console.log(f, (fs.statSync(path.join(dir, f)).size / 1e6).toFixed(1), 'MB');
