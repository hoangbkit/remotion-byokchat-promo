import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, MONO } from "../theme";
import { Appear, Sfx, clamp, easeOut, typed, useSpring } from "../anim";
import { Icon } from "../ui/icons";
import { CheckDot } from "../ui/bits";
import { useAt } from "../ui/shared";
import { useLayout } from "../layout";
import type { SceneInfo } from "../timeline";

export const Hook: React.FC<{ scene: SceneInfo }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const at = useAt(scene);
  const iconP = useSpring(6, 11, 110, 0.9);
  const rot = (1 - iconP) * -14;
  const tTitle = at("Meet", 28);
  const tTag = at("The", 70) + 4;
  const tKey = at("API", 105);
  const nDots = Math.round(interpolate(frame, [tKey + 4, tKey + 30], [0, 18], { ...clamp, easing: easeOut }));
  const keyText = "sk-ant-" + "•".repeat(nDots);
  const done = frame >= tKey + 32;
  const checkP = useSpring(tKey + 32, 10, 200);
  const float = Math.sin(frame / 22) * 5;

  return (
    <div style={{ position: "absolute", left: L.cx - 540 * L.k, top: L.stageTop, width: 1080, height: 1080, transform: `scale(${L.k})`, transformOrigin: "top left", fontFamily: FONT }}>
      <Sfx name="impact" at={5} volume={0.7} />
      <Sfx name="shimmer" at={tKey + 2} volume={0.35} />
      <Sfx name="chime" at={tKey + 32} volume={0.4} />

      {/* ripples */}
      {[10, 26, 42].map((d, i) => {
        const p = interpolate(frame - d, [0, 46], [0, 1], { ...clamp, easing: easeOut });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 150,
              top: 330 - 150,
              width: 300,
              height: 300,
              borderRadius: "50%",
              border: `2px solid rgba(92,168,255,${0.5 * (1 - p)})`,
              transform: `scale(${0.8 + p * 2.1})`,
            }}
          />
        );
      })}
      <div style={{ position: "absolute", left: 540 - 260, top: 330 - 260, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(92,168,255,0.38), rgba(92,168,255,0))", opacity: iconP }} />

      <div style={{ position: "absolute", left: 540 - 120, top: 210 + float, width: 240, height: 240, transform: `scale(${0.55 + 0.45 * iconP}) rotate(${rot}deg)`, opacity: Math.min(1, iconP * 1.6) }}>
        <Img src={staticFile("icon.png")} style={{ width: 240, height: 240, borderRadius: 54, boxShadow: "0 26px 70px rgba(30,90,200,0.55)" }} />
      </div>

      <Appear delay={tTitle} y={34} style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center" }}>
        <div style={{ fontSize: 100, fontWeight: 700, letterSpacing: -3.5, color: C.text, lineHeight: 1 }}>BYOK Chat</div>
      </Appear>
      <Appear delay={tTag} y={26} style={{ position: "absolute", left: 0, right: 0, top: 628, textAlign: "center" }}>
        <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: -1.2, color: C.sub }}>
          Your AI.{" "}
          <span style={{ background: "linear-gradient(90deg,#8CC3FF,#5CA8FF 60%,#7B8CFF)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Your keys.</span>
        </div>
      </Appear>

      <Appear delay={tKey - 6} y={30} scale={0.9} style={{ position: "absolute", left: 540 - 330, top: 770, width: 660 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, height: 88, padding: "0 30px", borderRadius: 44, background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`, border: `1px solid ${C.border}`, boxShadow: "0 14px 40px rgba(0,0,0,0.38)" }}>
          <Icon name="key" size={36} color={C.blue} />
          <div style={{ flex: 1, fontFamily: MONO, fontSize: 30, color: C.text, letterSpacing: 1, whiteSpace: "nowrap", overflow: "hidden" }}>
            {keyText}
            {!done ? <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1, color: C.blue }}>|</span> : null}
          </div>
          {done ? <CheckDot size={34} scale={checkP} ring={Math.max(0, 1 - (frame - (tKey + 32)) / 18)} /> : <div style={{ width: 34 }} />}
        </div>
      </Appear>
    </div>
  );
};
