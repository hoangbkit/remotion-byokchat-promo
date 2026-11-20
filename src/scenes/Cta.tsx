import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, CTA_BUTTON, CTA_URL, FONT } from "../theme";
import { Appear, Sfx, clamp, easeOut, useSpring } from "../anim";
import { Icon, IconName } from "../ui/icons";
import { useAt } from "../ui/shared";
import { useLayout } from "../layout";
import type { SceneInfo } from "../timeline";

const FEATURES: [IconName, string][] = [
  ["chat", "Chat"],
  ["key", "Keys"],
  ["cube", "Tools"],
  ["folder", "Projects"],
  ["chart", "Usage"],
];

export const Cta: React.FC<{ scene: SceneInfo }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const at = useAt(scene);
  const iconP = useSpring(4, 12, 120, 0.9);
  const tKeys = at("Your", 60);
  const tStore = at("Get", 120);
  const btnP = useSpring(tStore, 12, 150);
  const shine = interpolate(frame, [tStore + 14, tStore + 44], [-0.3, 1.3], clamp);
  const pulse = 1 + Math.sin(Math.max(0, frame - tStore - 30) / 9) * 0.012;
  const float = Math.sin(frame / 24) * 4;

  return (
    <div style={{ position: "absolute", left: L.cx - 540 * L.stageK, top: L.stageTop, width: 1080, height: 1080, transform: `scale(${L.stageK})`, transformOrigin: "top left", fontFamily: FONT }}>
      <Sfx name="whoosh" at={0} volume={0.35} />
      <Sfx name="pop" at={4} volume={0.45} />
      {FEATURES.map((_, i) => (
        <Sfx key={i} name="pop-soft" at={20 + i * 5} volume={0.35} />
      ))}
      <Sfx name="shimmer" at={tKeys} volume={0.3} />
      <Sfx name="pop" at={tStore} volume={0.5} />
      <Sfx name="chime" at={tStore + 14} volume={0.5} />

      {[6, 24].map((d, i) => {
        const p = interpolate(frame - d, [0, 50], [0, 1], { ...clamp, easing: easeOut });
        return <div key={i} style={{ position: "absolute", left: 540 - 130, top: 250 - 130, width: 260, height: 260, borderRadius: "50%", border: `2px solid rgba(92,168,255,${0.45 * (1 - p)})`, transform: `scale(${0.8 + p * 2})` }} />;
      })}
      <div style={{ position: "absolute", left: 540 - 250, top: 250 - 250, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(92,168,255,0.34), rgba(92,168,255,0))", opacity: iconP }} />

      <div style={{ position: "absolute", left: 540 - 100, top: 150 + float, width: 200, height: 200, transform: `scale(${0.6 + 0.4 * iconP})`, opacity: Math.min(1, iconP * 1.6) }}>
        <Img src={staticFile("icon.png")} style={{ width: 200, height: 200, borderRadius: 45, boxShadow: "0 22px 60px rgba(30,90,200,0.5)" }} />
      </div>

      <Appear delay={12} y={30} style={{ position: "absolute", left: 0, right: 0, top: 392, textAlign: "center" }}>
        <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3.2, color: C.text, lineHeight: 1 }}>BYOK Chat</div>
      </Appear>
      <Appear delay={tKeys - 6} y={24} style={{ position: "absolute", left: 0, right: 0, top: 508, textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1.1, color: C.sub }}>
          Your keys. Your{" "}
          <span style={{ background: "linear-gradient(90deg,#8CC3FF,#5CA8FF 60%,#7B8CFF)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>models.</span>
        </div>
      </Appear>

      {/* feature recap tiles */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 618, display: "flex", justifyContent: "center", gap: 18 }}>
        {FEATURES.map(([ic, label], i) => (
          <Appear key={label} delay={20 + i * 5} y={26} scale={0.7}>
            <div style={{ width: 150, height: 112, borderRadius: 26, background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: "0 14px 34px rgba(0,0,0,0.32)", color: C.blue }}>
              <Icon name={ic} size={38} inkColor={C.card} />
              <div style={{ fontSize: 22, fontWeight: 600, color: C.text }}>{label}</div>
            </div>
          </Appear>
        ))}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 782, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: Math.min(1, btnP * 2), transform: `translateY(${(1 - btnP) * 30}px) scale(${(0.9 + 0.1 * btnP) * pulse})` }}>
        <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 16, padding: "0 46px", height: 96, borderRadius: 48, background: "linear-gradient(180deg,#76B7FF,#4C97F5)", color: C.ink, fontSize: 38, fontWeight: 700, letterSpacing: -0.8, boxShadow: "0 18px 50px rgba(60,140,240,0.55)" }}>
          <Icon name="download" size={36} color={C.ink} />
          {CTA_BUTTON}
          <div style={{ position: "absolute", top: 0, bottom: 0, width: 90, left: `${shine * 100}%`, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", transform: "skewX(-20deg)" }} />
        </div>
        {CTA_URL ? <div style={{ fontSize: 28, fontWeight: 600, color: C.sub }}>{CTA_URL}</div> : null}
      </div>
    </div>
  );
};
