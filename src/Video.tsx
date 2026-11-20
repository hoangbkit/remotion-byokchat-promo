import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C } from "./theme";
import { timeline, sceneById } from "./timeline";
import { Background, BrandRow, Captions, SceneFade } from "./ui/shared";
import { Hook } from "./scenes/Hook";
import { Chat } from "./scenes/Chat";
import { Keys } from "./scenes/Keys";
import { Tools } from "./scenes/Tools";
import { Projects } from "./scenes/Projects";
import { Costs } from "./scenes/Costs";
import { Cta } from "./scenes/Cta";

const COMPONENTS: Record<string, React.FC<{ scene: (typeof timeline.scenes)[number] }>> = {
  hook: Hook,
  chat: Chat,
  keys: Keys,
  tools: Tools,
  projects: Projects,
  costs: Costs,
  cta: Cta,
};
const STEP: Record<string, number> = { chat: 1, keys: 2, tools: 3, projects: 4, costs: 5 };

const MUSIC_BASE = 0.4;
const MUSIC_DUCK = 0.36; // fraction of base while the voiceover plays

const Music: React.FC = () => {
  const total = timeline.totalFrames;
  const spans = timeline.scenes.filter((s) => s.voiceFile).map((s) => [s.start + s.lead, s.start + s.lead + s.voiceFrames] as const);
  return (
    <Audio
      src={staticFile("audio/music.mp3")}
      volume={(f) => {
        let duck = 1;
        for (const [a, b] of spans) duck = Math.min(duck, interpolate(f, [a - 10, a + 4, b - 2, b + 16], [1, MUSIC_DUCK, MUSIC_DUCK, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
        const fadeIn = interpolate(f, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const fadeOut = interpolate(f, [total - 60, total - 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return MUSIC_BASE * duck * fadeIn * fadeOut;
      }}
    />
  );
};

const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const chat = sceneById("chat");
  const cta = sceneById("cta");
  const step = timeline.scenes.reduce((acc, s) => (STEP[s.id] && frame >= s.start ? STEP[s.id] : acc), 1);
  return (
    <Sequence from={chat.start} durationInFrames={cta.start - chat.start + 4} layout="none">
      <BrandRow appearAt={8} exitAt={cta.start - chat.start} activeStep={step} />
    </Sequence>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg0, overflow: "hidden" }}>
    <Background />
    <Brand />
    {timeline.scenes.map((sc, i) => {
      const Comp = COMPONENTS[sc.id];
      return (
        <Sequence key={sc.id} from={sc.start} durationInFrames={sc.duration} name={sc.id}>
          <SceneFade duration={sc.duration} enter={i === 0 ? 1 : 12} exit={i === timeline.scenes.length - 1 ? 30 : 12}>
            <Comp scene={sc} />
          </SceneFade>
          <Captions scene={sc} centered={sc.id === "hook" || sc.id === "cta"} />
          {sc.voiceFile ? (
            <Sequence from={sc.lead} durationInFrames={sc.voiceFrames + 6} layout="none">
              <Audio src={staticFile(sc.voiceFile)} volume={1} />
            </Sequence>
          ) : null}
        </Sequence>
      );
    })}
    {timeline.scenes.slice(1).map((sc) => (
      <Sequence key={`w-${sc.id}`} from={Math.max(0, sc.start - 3)} durationInFrames={30} layout="none">
        <Audio src={staticFile("audio/sfx/whoosh-short.wav")} volume={0.3} />
      </Sequence>
    ))}
    <Music />
  </AbsoluteFill>
);
