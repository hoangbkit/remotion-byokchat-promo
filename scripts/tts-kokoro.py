"""
Local voiceover with Kokoro v1.0 (via sherpa-onnx). This is the engine that generated the
voiceover bundled in this project. CPU only, no GPU or account needed.

  pip install sherpa-onnx soundfile numpy
  curl -L -o k.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2
  tar xjf k.tar.bz2
  python scripts/tts-kokoro.py --model-dir kokoro-multi-lang-v1_0

Output: public/voiceover/001.wav, 002.wav ... (one file per paragraph of voiceover/script.txt)
Speaker ids (v1.0): 3 = af_heart (default), 16 = am_michael, 11 = am_adam, 21 = bf_emma, 26 = bm_george
"""
import argparse, pathlib, re
import numpy as np
import sherpa_onnx, soundfile as sf

# Words the TTS lexicon doesn't know are spoken as written here (captions still use script.txt).
SPOKEN = {
    "BYOK": "bee why oh kay",
    "API": "A P I",
    "workspaces": "work spaces",
    "MCP": "em see pee",
    "OpenRouter": "Open Router",
}

ap = argparse.ArgumentParser()
ap.add_argument("--model-dir", required=True)
ap.add_argument("--speaker", type=int, default=3)
ap.add_argument("--speed", type=float, default=1.0)
ap.add_argument("--script", default="voiceover/script.txt")
ap.add_argument("--out", default="public/voiceover")
a = ap.parse_args()

m = pathlib.Path(a.model_dir)
cfg = sherpa_onnx.OfflineTtsConfig(
    model=sherpa_onnx.OfflineTtsModelConfig(
        kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
            model=str(m / "model.onnx"),
            voices=str(m / "voices.bin"),
            tokens=str(m / "tokens.txt"),
            data_dir=str(m / "espeak-ng-data"),
            dict_dir=str(m / "dict"),
            lexicon=str(m / "lexicon-us-en.txt"),
        ),
        num_threads=2,
    ),
)
tts = sherpa_onnx.OfflineTts(cfg)

def spoken(t: str) -> str:
    for k, v in SPOKEN.items():
        t = re.sub(rf"\b{k}\b", v, t)
    return t

paras = [p.strip() for p in re.split(r"\n\s*\n", pathlib.Path(a.script).read_text()) if p.strip()]
out = pathlib.Path(a.out); out.mkdir(parents=True, exist_ok=True)
for i, text in enumerate(paras, 1):
    audio = tts.generate(spoken(text), sid=a.speaker, speed=a.speed)
    samples = np.asarray(audio.samples, dtype=np.float32)
    if len(samples) == 0:
        raise SystemExit(f"clip {i} produced no audio: {text}")
    path = out / f"{i:03d}.wav"
    sf.write(str(path), samples, int(audio.sample_rate), subtype="PCM_16")
    print(f"{path}  {len(samples)/audio.sample_rate:.2f}s  {text[:56]}")
