import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Appear, Sfx, clamp, easeOut, useSpring } from "../anim";
import { Icon, IconName } from "../ui/icons";
import { Card, IconTile, Sub, Title, UIFrame } from "../ui/primitives";
import { CheckDot } from "../ui/bits";
import { Headline, useAt } from "../ui/shared";
import type { SceneInfo } from "../timeline";

const Provider: React.FC<{ icon: IconName; name: string; sub: string; at: number; last?: boolean }> = ({ icon, name, sub, at, last }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, 13, 170, 0.8);
  const checkAt = at + 9;
  const cp = useSpring(checkAt, 9, 220);
  const ring = Math.max(0, 1 - (frame - checkAt) / 16);
  const glow = interpolate(frame, [at, at + 6, at + 26], [0, 1, 0], clamp);
  return (
    <div style={{ opacity: interpolate(frame - at, [0, 6], [0, 1], clamp), transform: `scale(${0.78 + 0.22 * p}) translateY(${(1 - p) * 26}px)` }}>
      <Sfx name="pop" at={at} volume={0.42} />
      <Sfx name={last ? "chime" : "tick1"} at={checkAt} volume={last ? 0.4 : 0.35} />
      <Card pad={11} r={18} style={{ minHeight: 90, boxShadow: `0 8px 22px rgba(0,0,0,0.3), 0 0 ${26 * glow}px rgba(92,168,255,${0.55 * glow})`, borderColor: glow > 0.05 ? `rgba(92,168,255,${0.2 + 0.5 * glow})` : C.border }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <IconTile size={34}>
            <Icon name={icon} size={21} />
          </IconTile>
          {frame >= checkAt ? <CheckDot size={19} scale={cp} ring={ring} /> : <div style={{ width: 19 }} />}
        </div>
        <Title style={{ fontSize: 15.5, marginTop: 6 }}>{name}</Title>
        <Sub style={{ fontSize: 11.5 }}>{sub}</Sub>
      </Card>
    </div>
  );
};

export const Keys: React.FC<{ scene: SceneInfo }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const at = useAt(scene);
  const tOR = Math.max(60, at("OpenRouter", 72));
  const tAN = Math.max(tOR + 12, at("Anthropic", 98));
  const tGE = Math.max(tAN + 12, at("Gemini", 126));
  const tLO = Math.max(tGE + 12, at("local", 148));
  const tDef = tLO + 30;
  const tKeychain = at("keychain", 190);
  const tDirect = Math.max(tKeychain + 20, at("straight", 215));

  const plusPulse = interpolate(frame, [38, 46, 58], [1, 0.82, 1.1], clamp);
  const plusRing = interpolate(frame, [44, 70], [0, 1], clamp);
  const kc = interpolate(frame, [tKeychain, tKeychain + 8, tKeychain + 40], [0, 1, 0], clamp);
  const defGlow = interpolate(frame, [tDef + 4, tDef + 12, tDef + 40], [0, 1, 0], clamp);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Headline text="Bring your own API keys" accent={4} />
      <Sfx name="pop" at={14} volume={0.4} />
      <Sfx name="toggle" at={46} volume={0.5} />
      <Sfx name="shimmer" at={tKeychain} volume={0.3} />
      <Sfx name="pop" at={tDef} volume={0.4} />
      <Sfx name="whoosh-short" at={tDirect - 2} volume={0.3} />

      <UIFrame width={420}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Appear delay={10} y={30}>
            <Card pad={12} r={18} style={{ borderColor: kc > 0.05 ? `rgba(92,168,255,${0.2 + 0.5 * kc})` : C.border, boxShadow: `0 8px 22px rgba(0,0,0,0.3), 0 0 ${24 * kc}px rgba(92,168,255,${0.45 * kc})` }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <Title style={{ fontSize: 18 }}>Provider Accounts</Title>
                  <Sub style={{ display: "flex", alignItems: "center", gap: 5, color: kc > 0.3 ? C.blue : C.sub }}>
                    {kc > 0.02 ? <Icon name="lock" size={12} color={C.blue} /> : null}
                    Keys stay in Keychain on this device
                  </Sub>
                </div>
                <div style={{ position: "relative", width: 30, height: 30 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: 15, border: `2px solid ${C.blue}`, opacity: 0.6 * (1 - plusRing), transform: `scale(${1 + plusRing * 1.2})`, display: plusRing > 0 && plusRing < 1 ? "block" : "none" }} />
                  <div style={{ width: 30, height: 30, borderRadius: 15, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${plusPulse})` }}>
                    <Icon name="plus" size={17} color={C.ink} />
                  </div>
                </div>
              </div>
            </Card>
          </Appear>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Provider icon="wave" name="OpenRouter" sub="Multi-model access" at={tOR} />
            <Provider icon="sparkle" name="Anthropic" sub="Claude Sonnet 5" at={tAN} />
            <Provider icon="diamond" name="Gemini" sub="Gemini 3.6 Flash" at={tGE} />
            <Provider icon="globe" name="Local Server" sub="Compatible endpoint" at={tLO} last />
          </div>

          <Appear delay={tDef} y={26}>
            <Card pad={11} r={18} style={{ borderColor: defGlow > 0.05 ? `rgba(92,168,255,${0.2 + 0.45 * defGlow})` : C.border }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon name="badge" size={28} color={C.blue} />
                <div style={{ flex: 1 }}>
                  <Sub style={{ fontWeight: 600, color: C.sub }}>Default model</Sub>
                  <Title style={{ fontSize: 16 }}>Claude Sonnet 5 · Anthropic</Title>
                </div>
                <Icon name="selector" size={20} color={C.sub} />
              </div>
            </Card>
          </Appear>

          <Appear delay={tDirect} y={26}>
            <Card pad={12} r={18}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon name="shieldLock" size={28} color={C.blue} inkColor={C.card} />
                <div style={{ flex: 1 }}>
                  <Title style={{ fontSize: 16 }}>Direct to your providers</Title>
                  <Sub style={{ lineHeight: 1.3 }}>No BYOK account. No proxy between you and the endpoints you configure.</Sub>
                </div>
              </div>
            </Card>
          </Appear>
        </div>
      </UIFrame>
    </div>
  );
};
