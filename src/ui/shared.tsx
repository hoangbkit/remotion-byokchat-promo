import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";
import { Appear, clamp, easeOut, useSpring } from "../anim";
import { useLayout } from "../layout";
import type { SceneInfo } from "../timeline";

/** Persistent animated backdrop shared by all scenes. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, H, k } = useLayout();
  const t = frame / 30;
  const big = Math.max(W, H);
  const g1x = W * 0.76 + Math.sin(t * 0.35) * 90 * k, g1y = H * 0.08 + Math.cos(t * 0.28) * 50 * k;
  const g2x = W * 0.13 + Math.cos(t * 0.3) * 80 * k, g2y = H * 0.92 + Math.sin(t * 0.33) * 60 * k;
  const g3x = W * 0.5 + Math.sin(t * 0.22) * 120 * k, g3y = H * 0.55 + Math.cos(t * 0.25) * 90 * k;
  const dots = 36 * k;
  return (
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${C.bg1} 0%, ${C.bg0} 100%)` }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(${big * 0.83}px ${big * 0.65}px at ${g1x}px ${g1y}px, rgba(66,122,190,0.62), rgba(66,122,190,0) 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(${big * 0.65}px ${big * 0.52}px at ${g2x}px ${g2y}px, rgba(48,84,170,0.30), rgba(48,84,170,0) 70%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(${big * 0.5}px ${big * 0.4}px at ${g3x}px ${g3y}px, rgba(56,100,180,0.16), rgba(56,100,180,0) 70%)` }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(160,190,240,0.10) 1px, transparent 1.2px)",
          backgroundSize: `${dots}px ${dots}px`,
          backgroundPosition: `${(t * 6) % dots}px ${(t * 3) % dots}px`,
          maskImage: "radial-gradient(ellipse at 50% 45%, black 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 20%, transparent 78%)",
        }}
      />
    </div>
  );
};

/** Top-left brand + top-right progress dots. `activeStep` is 1..5 (feature scenes). */
export const BrandRow: React.FC<{ appearAt: number; exitAt: number; activeStep: number }> = ({ appearAt, exitAt, activeStep }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const p = useSpring(appearAt, 18, 130);
  const o = Math.min(interpolate(frame - appearAt, [0, 10], [0, 1], clamp), interpolate(frame, [exitAt - 10, exitAt], [1, 0], clamp));
  const { x, y, size } = L.brand;
  const k = L.k;
  return (
    <div style={{ position: "absolute", left: x, right: x, top: y, height: size * 1.08, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: o, transform: `translateY(${(1 - p) * -18}px)`, fontFamily: FONT }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 * k }}>
        <Img src={staticFile("icon.png")} style={{ width: size, height: size, borderRadius: size * 0.23 }} />
        <div style={{ fontSize: 30 * k, fontWeight: 600, color: C.text, letterSpacing: -0.3 }}>BYOK Chat</div>
      </div>
      <div style={{ display: "flex", gap: 8 * k }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              width: (i === activeStep ? 34 : 10) * k,
              height: 10 * k,
              borderRadius: 6 * k,
              background: i === activeStep ? C.blue : "rgba(156,174,202,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

/** Kinetic headline (wraps in narrow columns). `accent` is the index of the word drawn in the accent gradient. */
export const Headline: React.FC<{ text: string; delay?: number; accent?: number }> = ({ text, delay = 4, accent = -1 }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const h = L.headline;
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", left: h.x, top: h.y, width: h.w, display: "flex", flexWrap: "wrap", gap: `0 ${h.size * 0.29}px`, fontFamily: FONT, fontSize: h.size, fontWeight: 700, letterSpacing: -h.size * 0.032, lineHeight: 1.08, color: C.text }}>
      {words.map((w, i) => {
        const d = delay + i * 3;
        const p = interpolate(frame - d, [0, 16], [0, 1], { ...clamp, easing: easeOut });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * h.size * 0.6}px)`,
              filter: `blur(${(1 - p) * 10}px)`,
              ...(i === accent
                ? { background: "linear-gradient(90deg, #8CC3FF, #5CA8FF 60%, #7B8CFF)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Scene-level enter/exit. Pass `enter={0}` or `exit={0}` to disable fade on the first/last scene. */
export const SceneFade: React.FC<{ duration: number; enter?: number; exit?: number; children?: React.ReactNode }> = ({ duration, enter = 12, exit = 12, children }) => {
  const frame = useCurrentFrame();
  const ein = enter > 0 ? interpolate(frame, [0, enter], [0, 1], { ...clamp, easing: easeOut }) : 1;
  const eout = exit > 0 ? interpolate(frame, [duration - exit, duration], [1, 0], clamp) : 1;
  const o = Math.min(ein, eout);
  const out = exit > 0 ? interpolate(frame, [duration - exit, duration], [0, 1], clamp) : 0;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${(1 - ein) * 22 - out * 18}px) scale(${1 + out * 0.012})`, filter: `blur(${out * 6}px)` }}>
      {children}
    </div>
  );
};

/** Burned-in captions with the spoken word highlighted. Times come from the scene's word list (frames, scene-local). */
export const Captions: React.FC<{ scene: SceneInfo; centered?: boolean }> = ({ scene, centered }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const box = centered ? L.captionsCentered : L.captions;
  const words = scene.words;
  if (!words.length) return null;
  // chunk into phrases: break on sentence/comma ends or after ~6 words
  const chunks: { from: number; to: number }[] = [];
  let from = 0;
  words.forEach((w, i) => {
    const len = i - from + 1;
    const end = /[.!?]$/.test(w.w) || (/[,;:]$/.test(w.w) && len >= 3) || len >= 6 || i === words.length - 1;
    if (end) {
      chunks.push({ from, to: i });
      from = i + 1;
    }
  });
  const idx = chunks.findIndex((c, k) => {
    const start = words[c.from].s - 4;
    const next = chunks[k + 1];
    const stop = next ? words[next.from].s - 4 : words[c.to].e + 10;
    return frame >= start && frame < stop;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const start = words[chunk.from].s - 4;
  const o = interpolate(frame - start, [0, 6], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h, display: "flex", justifyContent: box.align === "left" ? "flex-start" : "center", alignItems: L.mode === "wide" && !centered ? "flex-start" : "center", opacity: o, transform: `translateY(${(1 - o) * 10}px)`, fontFamily: FONT }}>
      <div style={{ fontSize: box.size, fontWeight: 700, letterSpacing: -box.size * 0.016, textAlign: box.align, lineHeight: 1.15, textShadow: "0 2px 14px rgba(0,0,0,0.55)" }}>
        {words.slice(chunk.from, chunk.to + 1).map((w, k) => {
          const active = frame >= w.s - 1 && frame < w.e + 2;
          const past = frame >= w.e + 2;
          return (
            <span key={k} style={{ color: active ? C.blue : past ? "rgba(238,243,252,0.96)" : "rgba(238,243,252,0.62)" }}>
              {w.w}{" "}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Small helper so scene code can say `at("Gemini", 80)`. */
export const useAt = (scene: SceneInfo) => (word: string, fallback: number, nth = 0) => {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let seen = 0;
  for (const w of scene.words) {
    if (clean(w.w).startsWith(clean(word))) {
      if (seen === nth) return w.s;
      seen++;
    }
  }
  return fallback;
};
export { Appear, useVideoConfig };
