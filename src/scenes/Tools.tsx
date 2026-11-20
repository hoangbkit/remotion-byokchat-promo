import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, MONO } from "../theme";
import { Appear, Sfx, clamp, countUp, useSpring } from "../anim";
import { Icon, IconName } from "../ui/icons";
import { Card, IconTile, Sub, Title, UIFrame } from "../ui/primitives";
import { CheckDot } from "../ui/bits";
import { Headline, useAt } from "../ui/shared";
import type { SceneInfo } from "../timeline";

type State = "Always" | "Ask" | "Off";

const StatePill: React.FC<{ state: State; flashAt: number; pulseAt?: number }> = ({ state, flashAt, pulseAt }) => {
  const frame = useCurrentFrame();
  const p = useSpring(flashAt, 11, 230);
  const flipped = frame >= flashAt;
  const pulse = pulseAt ? interpolate(frame, [pulseAt, pulseAt + 6, pulseAt + 22], [0, 1, 0], clamp) : 0;
  const colors: Record<State, { bg: string; fg: string }> = {
    Always: { bg: "rgba(92,168,255,0.22)", fg: C.blue },
    Ask: { bg: "rgba(92,168,255,0.14)", fg: C.blue },
    Off: { bg: "rgba(156,174,202,0.14)", fg: C.sub },
  };
  const c = colors[state];
  const s = flipped ? 0.78 + 0.22 * p : 1;
  return (
    <div style={{ padding: "6px 14px", borderRadius: 99, background: c.bg, color: c.fg, fontSize: 13.5, fontWeight: 600, minWidth: 54, textAlign: "center", transform: `scale(${s + pulse * 0.12})`, boxShadow: pulse > 0 ? `0 0 ${16 * pulse}px rgba(92,168,255,${0.6 * pulse})` : "none" }}>
      {state}
    </div>
  );
};

const Row: React.FC<{ name: string; fn: string; icons: [IconName, IconName]; initial: State; final: State; at: number; flipAt?: number; pulseAt?: number; last?: boolean }> = ({
  name,
  fn,
  icons,
  initial,
  final,
  at,
  flipAt,
  pulseAt,
  last,
}) => {
  const frame = useCurrentFrame();
  const flipped = flipAt !== undefined && frame >= flipAt;
  const state = flipped ? final : initial;
  const icon = state === "Always" ? icons[1] : state === "Off" ? "ban" : icons[0];
  const offDim = state === "Off" ? 0.62 : 1;
  return (
    <Appear delay={at} y={18} scale={0.97}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderBottom: last ? "none" : `1px solid ${C.border}`, opacity: offDim }}>
        <div style={{ width: 26, display: "flex", justifyContent: "center", color: state === "Off" ? C.sub : C.blue }}>
          <Icon name={icon} size={22} inkColor={C.card} />
        </div>
        <div style={{ flex: 1 }}>
          <Title style={{ fontSize: 15.5 }}>{name}</Title>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, marginTop: 1 }}>{fn}</div>
        </div>
        <StatePill state={state} flashAt={flipAt ?? 9999} pulseAt={pulseAt} />
      </div>
    </Appear>
  );
};

export const Tools: React.FC<{ scene: SceneInfo }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const at = useAt(scene);
  const tAlways = Math.max(70, at("Always", 96));
  const tAsk = Math.max(tAlways + 14, at("ask", 118));
  const tOff = Math.max(tAsk + 18, at("off", 150));
  const tBanner = tOff + 22;

  const n = Math.round(countUp(frame, 24, 26, 12));
  const checkAt = 52;
  const cp = useSpring(checkAt, 10, 220);
  const wave = interpolate(frame - tBanner, [6, 14, 22, 30, 38, 46], [0, 14, -10, 12, -6, 0], clamp);
  const countTicks: number[] = [];
  for (let f = 24; f < 50; f += 4) countTicks.push(f);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Headline text="Give every chat powerful tools" accent={4} />
      <Sfx name="pop" at={14} volume={0.4} />
      {countTicks.map((f) => (
        <Sfx key={f} name="count" at={f} volume={0.4} />
      ))}
      <Sfx name="chime" at={checkAt} volume={0.4} />
      <Sfx name="toggle" at={tAlways} volume={0.55} />
      <Sfx name="toggle" at={tAsk} volume={0.35} />
      <Sfx name="toggle" at={tOff} volume={0.55} />
      <Sfx name="pop" at={tBanner} volume={0.4} />

      <UIFrame width={410}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Appear delay={10} y={30}>
            <Card pad={11} r={18}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IconTile size={46} r={13}>
                  <Icon name="cube" size={26} />
                </IconTile>
                <div style={{ flex: 1 }}>
                  <Title style={{ fontSize: 19 }}>GitHub MCP</Title>
                  <Sub style={{ fontSize: 12.5 }}>Remote · {n} tools discovered</Sub>
                </div>
                {frame >= checkAt ? <CheckDot size={22} scale={cp} ring={Math.max(0, 1 - (frame - checkAt) / 16)} /> : <div style={{ width: 22 }} />}
              </div>
            </Card>
          </Appear>

          <Appear delay={22} y={30}>
            <Card pad={12} r={18}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                <Title style={{ fontSize: 19 }}>Tool permissions</Title>
                <Sub style={{ fontWeight: 600 }}>Per chat</Sub>
              </div>
              <Row name="Search repositories" fn="search_repositories" icons={["qcircle", "shieldCheck"]} initial="Ask" final="Always" at={34} flipAt={tAlways} />
              <Row name="Read files" fn="fetch_file" icons={["qcircle", "shieldCheck"]} initial="Ask" final="Ask" at={42} pulseAt={tAsk} />
              <Row name="Create issues" fn="create_issue" icons={["qcircle", "shieldCheck"]} initial="Ask" final="Ask" at={50} pulseAt={tAsk + 4} />
              <Row name="Delete files" fn="delete_file" icons={["qcircle", "shieldCheck"]} initial="Ask" final="Off" at={58} flipAt={tOff} last />
            </Card>
          </Appear>

          <Appear delay={tBanner} y={26}>
            <Card pad={11} r={18}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ transform: `rotate(${wave}deg)`, transformOrigin: "60% 90%" }}>
                  <Icon name="hand" size={30} color={C.blue} />
                </div>
                <div style={{ flex: 1 }}>
                  <Title style={{ fontSize: 17 }}>Approval stays in your hands</Title>
                  <Sub>Sensitive tools can ask before every run.</Sub>
                </div>
              </div>
            </Card>
          </Appear>
        </div>
      </UIFrame>
    </div>
  );
};
