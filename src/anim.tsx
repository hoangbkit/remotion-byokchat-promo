import React from "react";
import { Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 -> 1 spring starting at `delay` (local frames). */
export const useSpring = (delay = 0, damping = 16, stiffness = 150, mass = 0.8) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness, mass } });
};

export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: easeOut });

type AppearProps = {
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  damping?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};
/** Springy fade/slide/scale-in wrapper. */
export const Appear: React.FC<AppearProps> = ({ delay = 0, y = 28, x = 0, scale = 0.94, damping = 16, style, children }) => {
  const frame = useCurrentFrame();
  const p = useSpring(delay, damping);
  const o = interpolate(frame - delay, [0, 8], [0, 1], clamp);
  return (
    <div
      style={{
        opacity: o,
        transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px) scale(${scale + (1 - scale) * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** One-shot sound effect at a local frame of the surrounding Sequence. */
export const Sfx: React.FC<{ name: string; at: number; volume?: number }> = ({ name, at, volume = 0.5 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={90} layout="none">
    <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);

export const typed = (text: string, frame: number, start: number, cps: number, fps = 30) => {
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / fps) * cps)));
  return text.slice(0, n);
};

export const countUp = (frame: number, start: number, dur: number, to: number) =>
  to * interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

/** Reveals words of `text` progressively (LLM streaming feel). Returns the shown words with the last one fading in. */
export const StreamText: React.FC<{ text: string; start: number; wps: number; style?: React.CSSProperties; cursor?: boolean }> = ({
  text,
  start,
  wps,
  style,
  cursor = true,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const shown = Math.max(0, ((frame - start) / 30) * wps);
  const full = Math.floor(shown);
  const done = full >= words.length;
  return (
    <span style={style}>
      {words.map((w, i) => {
        if (i > full) return null;
        const o = i < full ? 1 : shown - full;
        return (
          <span key={i} style={{ opacity: o }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
      {cursor && !done && shown > 0 ? (
        <span style={{ display: "inline-block", width: 7, height: 15, background: "#5CA8FF", marginLeft: 2, verticalAlign: "-2px", borderRadius: 2 }} />
      ) : null}
    </span>
  );
};
