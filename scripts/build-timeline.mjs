// Builds src/timeline.json from the voiceover clips in public/voiceover/*.wav.
// One paragraph of voiceover/script.txt = one scene = one clip (001.wav, 002.wav, ...).
// Optional word-timing sidecars (public/voiceover/001.json from Whisper) are used when present:
//   { "words": [{ "word": "Meet", "start": 0.1, "end": 0.4 }, ...] }  or a bare array of the same.
// Without sidecars, word timings are estimated from the clip length (good enough for captions).
import fs from "node:fs";
import path from "node:path";

const FPS = 30;
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const voDir = path.join(root, "public", "voiceover");

// scene id, minimum seconds (so every animation can finish), lead-in before voice, tail after voice
const SCENES = [
  { id: "hook", min: 4.8, lead: 0.9, tail: 0.6 },
  { id: "chat", min: 8.2, lead: 0.5, tail: 0.7 },
  { id: "keys", min: 9.2, lead: 0.5, tail: 0.8 },
  { id: "tools", min: 7.6, lead: 0.5, tail: 0.8 },
  { id: "projects", min: 6.6, lead: 0.5, tail: 0.8 },
  { id: "costs", min: 7.0, lead: 0.5, tail: 0.8 },
  { id: "cta", min: 6.0, lead: 0.6, tail: 2.4 },
];

function wavSeconds(file) {
  const b = fs.readFileSync(file);
  if (b.toString("ascii", 0, 4) !== "RIFF") throw new Error(`${file} is not a RIFF/WAV file`);
  let o = 12, rate = 0, ch = 1, bits = 16, data = 0;
  while (o + 8 <= b.length) {
    const id = b.toString("ascii", o, o + 4), size = b.readUInt32LE(o + 4);
    if (id === "fmt ") { ch = b.readUInt16LE(o + 10); rate = b.readUInt32LE(o + 12); bits = b.readUInt16LE(o + 22); }
    if (id === "data") { data = Math.min(size, b.length - o - 8); break; }
    o += 8 + size + (size % 2);
  }
  return data / (rate * ch * (bits / 8));
}

function estimateWords(text, dur) {
  const toks = text.split(/\s+/).filter(Boolean);
  const weights = toks.map((t) => t.replace(/[^\w]/g, "").length + 1.5 + (/[.!?]$/.test(t) ? 3 : /[,:;]$/.test(t) ? 1.5 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  const t0 = 0.04, span = Math.max(0.2, dur - 0.16);
  let acc = 0;
  return toks.map((t, i) => {
    const s = t0 + (acc / total) * span; acc += weights[i];
    const trail = /[.!?]$/.test(t) ? 3 : /[,:;]$/.test(t) ? 1.5 : 0;
    const e = t0 + ((acc - trail) / total) * span;
    return { w: t, s, e };
  });
}

function sidecarWords(file) {
  if (!fs.existsSync(file)) return null;
  try {
    const j = JSON.parse(fs.readFileSync(file, "utf8"));
    const arr = Array.isArray(j) ? j : j.words || (j.segments || []).flatMap((s) => s.words || []);
    const out = arr.map((x) => ({ w: String(x.word ?? x.text ?? "").trim(), s: Number(x.start), e: Number(x.end) })).filter((x) => x.w && Number.isFinite(x.s) && Number.isFinite(x.e));
    return out.length ? out : null;
  } catch { return null; }
}

const paras = fs.readFileSync(path.join(root, "voiceover", "script.txt"), "utf8").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
if (paras.length !== SCENES.length) console.warn(`! script.txt has ${paras.length} paragraphs but the video has ${SCENES.length} scenes`);

let cursor = 0;
const scenes = SCENES.map((sc, i) => {
  const text = paras[i] ?? "";
  const num = String(i + 1).padStart(3, "0");
  const wav = path.join(voDir, `${num}.wav`);
  const hasVo = fs.existsSync(wav);
  const dur = hasVo ? wavSeconds(wav) : 0;
  if (!hasVo) console.warn(`! missing ${path.relative(root, wav)} (scene "${sc.id}" will be silent)`);
  const lead = Math.round(sc.lead * FPS);
  const voFrames = Math.ceil(dur * FPS);
  const duration = Math.max(Math.round(sc.min * FPS), lead + voFrames + Math.round(sc.tail * FPS));
  const words = (hasVo ? sidecarWords(path.join(voDir, `${num}.json`)) ?? estimateWords(text, dur) : []).map((w) => ({
    w: w.w, s: lead + Math.round(w.s * FPS), e: lead + Math.max(Math.round(w.e * FPS), Math.round(w.s * FPS) + 2),
  }));
  const scene = { id: sc.id, start: cursor, duration, lead, voiceFrames: voFrames, voiceFile: hasVo ? `voiceover/${num}.wav` : null, text, words };
  cursor += duration;
  return scene;
});

const out = { fps: FPS, width: 1080, height: 1080, totalFrames: cursor, scenes };
fs.writeFileSync(path.join(root, "src", "timeline.json"), JSON.stringify(out, null, 2));
console.log(`timeline: ${scenes.length} scenes, ${cursor} frames = ${(cursor / FPS).toFixed(1)}s`);
scenes.forEach((s) => console.log(`  ${s.id.padEnd(9)} start ${(s.start / FPS).toFixed(1).padStart(5)}s  len ${(s.duration / FPS).toFixed(1)}s  voice ${(s.voiceFrames / FPS).toFixed(1)}s`));
