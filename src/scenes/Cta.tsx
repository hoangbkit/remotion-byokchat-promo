import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, CTA_BUTTON, CTA_URL, FONT, MONO } from "../theme";
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

// ISO/IEC 18004 Version 3-M (29x29, 15% error correction) for https://apps.apple.com/app/id6799335915
const QR_V3M: string[] = [
  "11111110000011011111101111111",
  "10000010100011011011101000001",
  "10111010000110000000001011101",
  "10111010001100011010001011101",
  "10111010110000011011001011101",
  "10000010010101011101101000001",
  "11111110101010101010101111111",
  "00000000011001100110100000000",
  "10101010001011100101100010010",
  "10100100011101100110111101001",
  "10010110000010000010010100111",
  "00000100100101100100011100010",
  "10011110001110100100111101011",
  "11011001000100000110111001001",
  "00011111000101000010101011011",
  "10100101110000010100100101010",
  "00001111101000010111111101011",
  "01100100101001000000001001101",
  "10001110011100100100001010011",
  "01100001111111110111110101010",
  "10001110101010110100111110000",
  "00000000100000100001100010111",
  "11111110011001000011101011011",
  "10000010000000001110100011001",
  "10111010100000000100111110011",
  "10111010011111000101000010111",
  "10111010101101001001010111001",
  "10000010000001101101110000010",
  "11111110101110100111101010011",
];

const QrMatrix: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 29 29" shapeRendering="crispEdges" style={{ display: "block" }}>
    {QR_V3M.map((row, r) =>
      row.split("").map((cell, c) =>
        cell === "1" ? <rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} fill={C.ink} /> : null,
      ),
    )}
  </svg>
);

export const Cta: React.FC<{ scene: SceneInfo }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const at = useAt(scene);
  const iconP = useSpring(4, 12, 120, 0.9);
  const tKeys = at("Your", 60);
  const tStore = at("Get", 120);
  const stampP = useSpring(tStore, 13, 180, 0.85);
  const cardP = useSpring(tStore + 4, 14, 150, 0.9);
  const shine = interpolate(frame, [tStore + 16, tStore + 46], [-0.3, 1.3], clamp);
  const pulse = 1 + Math.sin(Math.max(0, frame - tStore - 30) / 9) * 0.012;
  const float = Math.sin(frame / 24) * 4;

  // Beat 2 lift: when "Get it on the App Store" starts, lift the top hero header slightly
  // and cross-fade the 5 recap tiles into the dedicated QR Stamp + App Store download lockup.
  const heroLift = interpolate(frame, [tStore - 6, tStore + 14], [0, -46], { ...clamp, easing: easeOut });
  const stampO = interpolate(frame, [tStore - 1, tStore + 6], [0, 1], clamp);
  // Stamp presses down from 1.32x -> 1.0x with a slight -10deg -> -3.5deg snap
  const stampScale = 1.32 - 0.32 * stampP;
  const stampRot = -10 + 6.5 * stampP;

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

      <div style={{ position: "absolute", inset: 0, transform: `translateY(${heroLift}px)` }}>
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
      </div>

      {/* Beat 1: feature recap tiles (exit cleanly as Beat 2 enters) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 618, display: "flex", justifyContent: "center", gap: 18, pointerEvents: "none" }}>
        {FEATURES.map(([ic, label], i) => {
          const outP = interpolate(frame, [tStore - 6 + i * 1.5, tStore + 5 + i * 1.5], [0, 1], { ...clamp, easing: easeOut });
          if (outP >= 1) return null;
          return (
            <Appear key={label} delay={20 + i * 5} y={26} scale={0.7}>
              <div
                style={{
                  width: 150,
                  height: 112,
                  borderRadius: 26,
                  background: `linear-gradient(180deg, ${C.cardHi}, ${C.card})`,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  boxShadow: "0 14px 34px rgba(0,0,0,0.32)",
                  color: C.blue,
                  opacity: 1 - outP,
                  transform: `translateY(${-outP * 24}px) scale(${1 - outP * 0.14})`,
                  filter: `blur(${outP * 6}px)`,
                }}
              >
                <Icon name={ic} size={38} inkColor={C.card} />
                <div style={{ fontSize: 22, fontWeight: 600, color: C.text }}>{label}</div>
              </div>
            </Appear>
          );
        })}
      </div>

      {/* Beat 2: Dedicated Download Stamp + App Store CTA lockup */}
      {frame >= tStore - 2 ? (
        <div
          style={{
            position: "absolute",
            left: 540 - 390,
            top: 554,
            width: 780,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 34,
          }}
        >
          {/* Postage / Pass QR Stamp */}
          <div
            style={{
              opacity: stampO,
              transform: `translateY(${(1 - stampP) * -18}px) scale(${stampScale}) rotate(${stampRot}deg)`,
              transformOrigin: "center center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 28,
                background: `linear-gradient(165deg, ${C.cardHi} 0%, ${C.card} 100%)`,
                border: "1.5px solid rgba(140,195,255,0.34)",
                boxShadow: "0 24px 56px rgba(0,0,0,0.46), 0 0 38px rgba(92,168,255,0.22)",
              }}
            >
              <div
                style={{
                  padding: 14,
                  borderRadius: 20,
                  border: "1.5px dashed rgba(140,195,255,0.34)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    padding: 14,
                    borderRadius: 16,
                    background: "#EEF4FF",
                    boxShadow: "inset 0 0 0 1px rgba(10,20,38,0.08)",
                  }}
                >
                  <QrMatrix size={168} />
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 2.2,
                    color: "#8CC3FF",
                    textTransform: "uppercase",
                  }}
                >
                  SCAN FOR iOS
                </div>
              </div>
            </div>
          </div>

          {/* Right CTA Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 18,
              opacity: Math.min(1, cardP * 1.8),
              transform: `translateX(${(1 - cardP) * 28}px) scale(${0.92 + 0.08 * cardP})`,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 99,
                background: "rgba(92,168,255,0.16)",
                border: "1px solid rgba(140,195,255,0.24)",
                color: "#8CC3FF",
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: 0.2,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 4, background: C.green, boxShadow: `0 0 10px ${C.green}` }} />
              Available on iPhone &amp; iPad
            </div>

            <div>
              <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1.1, color: C.text, lineHeight: 1.12 }}>
                Ready when your keys are.
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: C.sub, marginTop: 6 }}>
                Scan the stamp or grab it on the App Store.
              </div>
            </div>

            <div
              style={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 38px",
                height: 86,
                borderRadius: 43,
                background: "linear-gradient(180deg,#76B7FF,#4C97F5)",
                color: C.ink,
                fontSize: 33,
                fontWeight: 700,
                letterSpacing: -0.7,
                transform: `scale(${pulse})`,
                boxShadow: "0 18px 48px rgba(60,140,240,0.52)",
              }}
            >
              <Icon name="download" size={32} color={C.ink} />
              {CTA_BUTTON}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 90,
                  left: `${shine * 100}%`,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                  transform: "skewX(-20deg)",
                }}
              />
            </div>
            {CTA_URL ? <div style={{ fontSize: 22, fontWeight: 600, color: C.sub }}>{CTA_URL}</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
