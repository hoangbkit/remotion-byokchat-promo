# BYOK Chat promo (1:1, 16:9 and 9:16, 30 fps, about 51 s)

Remotion project. The UI (chat, provider keys, MCP tool permissions, projects, usage analytics) is
**recreated as React components** and animated, it is not screenshots. Includes music, sound effects,
voiceover and burned-in captions.

## Run it
```bash
npm install
npm run dev            # Remotion Studio (preview, scrub, tweak; pick a format in the sidebar)
npm run render         # 1:1   1080x1080 -> out/byok-promo-1x1.mp4
npm run render:wide    # 16:9  1920x1080 -> out/byok-promo-16x9.mp4
npm run render:tall    # 9:16  1080x1920 -> out/byok-promo-9x16.mp4
npm run render:all     # all three
```
Node 18+ is enough. Fonts (Inter) are bundled, so rendering works offline.

## Formats (responsive layout)
Three compositions share the same scenes, audio and timeline: `ByokPromo` (1:1), `ByokPromoWide` (16:9),
`ByokPromoTall` (9:16). The layout adapts to the canvas in `src/layout.ts`:
- **1:1**: headline on top, UI stack below, captions at the bottom.
- **16:9**: text column on the left (brand, headline, captions), UI on the right, centered intro / end card.
- **9:16**: headline and UI in the middle, captions placed above the bottom area that TikTok / Reels / Shorts
  cover with their own UI. Keep key content out of the top ~150 px and bottom ~370 px.

`UIFrame` (in `src/ui/primitives.tsx`) measures each UI stack and scales it to fit the layout's UI box, so adding
or removing a card in a scene needs no manual sizing. For another ratio, add a `<Composition>` in `src/Root.tsx`;
`computeLayout` picks wide / tall / square from the aspect ratio, and you can tune the numbers there.

## Scenes (one per voiceover paragraph)
| # | Scene | File | What happens |
|---|---|---|---|
| 1 | hook | `src/scenes/Hook.tsx` | App icon reveal, "Your AI. Your keys.", an API key being entered |
| 2 | chat | `src/scenes/Chat.tsx` | Message typed and sent, files attached, reasoning, streamed answer, tool call completes |
| 3 | keys | `src/scenes/Keys.tsx` | Providers added one by one on the spoken names, Keychain note, default model, "direct" card |
| 4 | tools | `src/scenes/Tools.tsx` | MCP server connects, tool permissions flip Always / Ask / Off on the spoken words |
| 5 | projects | `src/scenes/Projects.tsx` | Project card, recent chats, instructions typed in |
| 6 | costs | `src/scenes/Costs.tsx` | Counters, daily bars, provider latency bars |
| 7 | cta | `src/scenes/Cta.tsx` | End card with the App Store button |

Shared pieces: `src/ui/` (icons, cards, captions, headline, background), `src/anim.tsx` (springs, typing, SFX helper).

## Change the voiceover
`voiceover/script.txt` has one paragraph per scene. The bundled voice was made locally with Kokoro:
```bash
pip install sherpa-onnx soundfile numpy
curl -L -o k.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/kokoro-multi-lang-v1_0.tar.bz2
tar xjf k.tar.bz2
python scripts/tts-kokoro.py --model-dir kokoro-multi-lang-v1_0 --speaker 3
```
Or use your usual Chatterbox setup: `python scripts/tts-chatterbox.py` (same output files).
Then `npm run normalize` (needs ffmpeg; evens out loudness to about -16 LUFS) and `npm run timeline`. Scene lengths follow the clip lengths, and captions plus the spoken-word
beats (provider cards, permission pills) follow the words.

Word timings are estimated from clip length by default. If you have Whisper sidecars, drop
`public/voiceover/001.json` ... next to the wavs (`{"words":[{"word","start","end"}]}`, seconds) and
`npm run timeline` will use them.

## Change music / SFX
`python scripts/make-audio.py` regenerates `public/audio/music.*` and `public/audio/sfx/*.wav`
(numpy + scipy only). Music is ducked under the voice in `src/Video.tsx` (`MUSIC_BASE`, `MUSIC_DUCK`).
Convert to mp3 with: `ffmpeg -i public/audio/music.wav -b:a 192k public/audio/music.mp3`.

## Other tweaks
- End-card URL line and button text: `src/theme.ts` (`CTA_URL`, `CTA_BUTTON`).
- Copy/UI text lives in each scene file. Headline text is the `<Headline text="..."/>` in each scene.
