"""
Re-generate the voiceover with Chatterbox (e.g. on a free Colab T4), keeping the same file layout.

  pip install chatterbox-tts
  python scripts/tts-chatterbox.py                       # default voice
  python scripts/tts-chatterbox.py --ref my_voice.wav    # clone a reference voice

Reads voiceover/script.txt (one paragraph = one clip) and writes public/voiceover/001.wav, 002.wav ...
Then run `npm run timeline` so the video re-times itself to the new clip lengths.
Chatterbox can occasionally repeat a phrase - listen to each clip once.
"""
import argparse, pathlib, re
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

ap = argparse.ArgumentParser()
ap.add_argument("--ref", default=None, help="optional reference voice wav for cloning")
ap.add_argument("--script", default="voiceover/script.txt")
ap.add_argument("--out", default="public/voiceover")
ap.add_argument("--device", default="cuda")
a = ap.parse_args()

# spoken forms (captions still use script.txt as written)
SPOKEN = {"BYOK": "B Y O K", "API": "A P I", "MCP": "M C P"}
def spoken(t):
    for k, v in SPOKEN.items():
        t = re.sub(rf"\b{k}\b", v, t)
    return t

model = ChatterboxTTS.from_pretrained(device=a.device)
paras = [p.strip() for p in re.split(r"\n\s*\n", pathlib.Path(a.script).read_text()) if p.strip()]
out = pathlib.Path(a.out); out.mkdir(parents=True, exist_ok=True)
for i, text in enumerate(paras, 1):
    wav = model.generate(spoken(text), audio_prompt_path=a.ref) if a.ref else model.generate(spoken(text))
    path = out / f"{i:03d}.wav"
    ta.save(str(path), wav, model.sr)
    print(path, f"{wav.shape[-1] / model.sr:.2f}s")
