"""
Generates the music bed and sound effects used by the video (pure numpy/scipy, no samples needed).

  pip install numpy scipy soundfile
  python scripts/make-audio.py          # writes public/audio/music.wav + public/audio/sfx/*.wav
  (optional) ffmpeg -i public/audio/music.wav -b:a 192k public/audio/music.mp3

Tweak BPM / chords / levels below and re-run to change the vibe.
"""
import pathlib
import numpy as np
import soundfile as sf
from scipy import signal

SR = 44100
OUT = pathlib.Path("public/audio")
(OUT / "sfx").mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)

def t_(dur): return np.arange(int(dur * SR)) / SR
def env_ad(n, a, d, curve=3.0):
    e = np.ones(n)
    na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    nd = n - na
    if nd > 0: e[na:] = np.exp(-curve * np.linspace(0, 1, nd))
    return e
def hz(note): return 440.0 * 2 ** ((note - 69) / 12)
def stereo(x, pan=0.0):
    l = np.sqrt(0.5 * (1 - pan)); r = np.sqrt(0.5 * (1 + pan))
    return np.stack([x * l, x * r], axis=1)
def norm(x, peak=0.9):
    return x * (peak / max(1e-9, np.max(np.abs(x))))
def lowpass(x, fc, order=2):
    sos = signal.butter(order, fc / (SR / 2), "low", output="sos"); return signal.sosfilt(sos, x, axis=0)
def highpass(x, fc, order=2):
    sos = signal.butter(order, fc / (SR / 2), "high", output="sos"); return signal.sosfilt(sos, x, axis=0)
def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], "band", output="sos"); return signal.sosfilt(sos, x, axis=0)
def reverb(x, seconds=2.2, wet=0.25, damp=3500):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-3.2 * np.linspace(0, 1, n))
    ir = lowpass(ir, damp)
    out = np.stack([signal.fftconvolve(x[:, c], ir)[: len(x)] for c in range(2)], axis=1)
    out *= np.max(np.abs(x)) / max(1e-9, np.max(np.abs(out)))
    return x * (1 - wet) + out * wet
def write(path, x): sf.write(str(path), x.astype(np.float32), SR, subtype="PCM_16")

# ---------------------------------------------------------------- SFX
def whoosh(dur=0.7):
    n = int(dur * SR); noise = rng.standard_normal(n)
    out = np.zeros(n); chunk = 512
    for i in range(0, n, chunk):
        p = i / n; fc = 300 + 5200 * np.sin(np.pi * p) ** 1.5
        sos = signal.butter(2, [max(80, fc * 0.5) / (SR / 2), min(0.99, fc / (SR / 2))], "band", output="sos")
        out[i:i + chunk] = signal.sosfilt(sos, noise[i:i + chunk])
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return stereo(out * e)
def pop(f0=720, f1=300, dur=0.14):
    t = t_(dur); f = f1 + (f0 - f1) * np.exp(-t * 40)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * env_ad(len(t), 0.002, dur, 7)
    return stereo(x * 0.9)
def tick(freq=2200, dur=0.045):
    t = t_(dur); n = len(t)
    x = highpass(rng.standard_normal(n), 3000) * np.exp(-t * 180) * 0.6
    x += np.sin(2 * np.pi * freq * t) * np.exp(-t * 150) * 0.5
    return stereo(x)
def send(dur=0.3):
    t = t_(dur); f = 500 + 1400 * (t / dur) ** 1.6
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / dur) ** 0.7 * 0.7
    return stereo(x + 0.15 * lowpass(rng.standard_normal(len(t)), 5000) * np.sin(np.pi * t / dur))
def chime(notes=(88, 95), dur=0.9, gap=0.09):
    n = int(dur * SR); x = np.zeros(n)
    for k, m in enumerate(notes):
        s = int(k * gap * SR); t = np.arange(n - s) / SR
        tone = np.sin(2 * np.pi * hz(m) * t) + 0.35 * np.sin(2 * np.pi * hz(m) * 2 * t) + 0.15 * np.sin(2 * np.pi * hz(m) * 3 * t)
        x[s:] += tone * np.exp(-t * 5.5) * 0.45
    return reverb(stereo(x), 1.2, 0.2)
def toggle(dur=0.11):
    t = t_(dur)
    x = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 55) * 0.8 + highpass(rng.standard_normal(len(t)), 2500) * np.exp(-t * 120) * 0.35
    return stereo(x)
def impact(dur=1.4):
    t = t_(dur); f = 38 + 90 * np.exp(-t * 9)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    x += lowpass(rng.standard_normal(len(t)), 1800) * np.exp(-t * 7) * 0.45
    return reverb(stereo(x * 0.9), 1.8, 0.25)
def shimmer(dur=0.9):
    n = int(dur * SR); x = np.zeros(n)
    for k, m in enumerate((84, 88, 91, 96)):
        s = int(k * 0.07 * SR); t = np.arange(n - s) / SR
        x[s:] += np.sin(2 * np.pi * hz(m) * t) * np.exp(-t * 4.5) * 0.28
    return reverb(stereo(x), 1.6, 0.35)
def count_tick():
    t = t_(0.03); x = np.sin(2 * np.pi * 1500 * t) * np.exp(-t * 220) * 0.4
    return stereo(x)
def swipe(dur=0.28):
    return stereo(whoosh(dur)[:, 0] * 0.55)

sfx = {
    "whoosh": whoosh(0.7), "whoosh-short": swipe(0.28), "pop": pop(), "pop-soft": pop(560, 280, 0.12) * 0.7,
    "tick1": tick(2100), "tick2": tick(2500), "tick3": tick(1850), "send": send(), "chime": chime(),
    "chime-low": chime((83, 90), 0.9), "toggle": toggle(), "impact": impact(), "shimmer": shimmer(),
    "count": count_tick(),
}
for k, v in sfx.items(): write(OUT / "sfx" / f"{k}.wav", norm(v, 0.85))

# ---------------------------------------------------------------- Music
BPM = 98; BEAT = 60 / BPM; BAR = BEAT * 4; BARS = 28
total = BARS * BAR + 3
L = int(total * SR)
mix = np.zeros((L, 2))
chords = [(57, 60, 64, 67), (53, 57, 60, 64), (48, 52, 55, 60), (55, 59, 62, 67)]  # Am7 Fmaj7 Cmaj7 G
roots = [45, 41, 36, 43]

def add(buf, start, x):
    s = int(start * SR); e = min(len(buf), s + len(x))
    if s < len(buf) and e > s: buf[s:e] += x[: e - s]

pad = np.zeros((L, 2)); arp = np.zeros((L, 2)); bass = np.zeros((L, 2)); drums = np.zeros((L, 2))
for bar in range(BARS):
    ch = chords[bar % 4]; start = bar * BAR
    # pad: soft additive saw-ish voices, slow attack
    dur = BAR + 0.8; t = t_(dur); n = len(t)
    v = np.zeros(n)
    for note in ch:
        for det in (-0.07, 0.07):
            f = hz(note + 12) * 2 ** (det / 12)
            for h in range(1, 7):
                v += np.sin(2 * np.pi * f * h * t) / h ** 1.35
    e = np.minimum(1, t / 0.9) * np.minimum(1, (dur - t) / 0.8)
    v = lowpass(v * e, 2400) * 0.05
    add(pad, start, stereo(v))
    if bar >= 2:  # arp
        pattern = [0, 2, 1, 3, 2, 1, 3, 2]
        for i, idx in enumerate(pattern):
            note = ch[idx] + 24; tt = start + i * BEAT / 2
            d = 0.5; t = t_(d)
            x = (np.sin(2 * np.pi * hz(note) * t) + 0.4 * np.sin(2 * np.pi * hz(note) * 2 * t)) * np.exp(-t * 7) * 0.16
            add(arp, tt, stereo(x, pan=-0.35 if i % 2 == 0 else 0.35))
    # bass
    for b in (0, 2):
        if bar >= 1:
            t = t_(BEAT * 1.8); f = hz(roots[bar % 4])
            x = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2) * 0.34
            add(bass, start + b * BEAT, stereo(x))
    if bar >= 3:  # drums
        for b in range(4):
            t = t_(0.35); f = 48 + 90 * np.exp(-t * 30)
            k = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) * 0.5
            add(drums, start + b * BEAT, stereo(k))
        for i in range(8):
            if i % 2 == 1:
                t = t_(0.06); h = highpass(rng.standard_normal(len(t)), 7500) * np.exp(-t * 70) * 0.09
                add(drums, start + i * BEAT / 2, stereo(h, pan=0.2))
        t = t_(0.2); sn = bandpass(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 22) * 0.12
        add(drums, start + BEAT, stereo(sn)); add(drums, start + 3 * BEAT, stereo(sn))

pad = reverb(pad, 2.6, 0.35); arp = reverb(arp, 1.8, 0.3)
mix = pad + arp + bass + drums
# gentle sidechain pump from kick on the beat (after bar 3)
env = np.ones(L)
for bar in range(3, BARS):
    for b in range(4):
        s = int((bar * BAR + b * BEAT) * SR); n = int(0.22 * SR)
        if s + n < L: env[s:s + n] *= 1 - 0.25 * np.exp(-np.linspace(0, 6, n))
mix[:, 0] *= env; mix[:, 1] *= env
mix = highpass(mix, 35, 1)
mix = norm(np.tanh(mix * 1.1), 0.8)
write(OUT / "music.wav", mix)
print("music seconds:", round(total, 1))
