import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Appear, Sfx, clamp, countUp, easeOut } from "../anim";
import { Icon } from "../ui/icons";
import { Card, Sub, Title, UIFrame } from "../ui/primitives";
import { Headline, useAt } from "../ui/shared";
import type { SceneInfo } from "../timeline";

const BARS = [38, 52, 34, 66, 56, 90, 72];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const PERF: [string, string, number][] = [
  ["Anthropic", "1.2s", 0.92],
  ["OpenRouter", "1.6s", 0.82],
  ["Gemini", "1.4s", 0.88],
];

export const Costs: React.FC<{ scene: SceneInfo }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const at = useAt(scene);
  const tChart = 44;
  const tPerf = Math.max(tChart + 50, at("costs", 80) + 10);
  const tBanner = Math.max(tPerf + 44, at("device", 120) - 6);
  const spendPulse = interpolate(frame, [at("costs", 80), at("costs", 80) + 6, at("costs", 80) + 28], [0, 1, 0], clamp);

  const spend = countUp(frame, 14, 34, 12.48);
  const req = Math.round(countUp(frame, 18, 34, 842));
  const tok = countUp(frame, 22, 34, 4.0);
  const day = countUp(frame, tChart, 36, 4.86);

  const countTicks: number[] = [];
  for (let f = 14; f < 46; f += 4) countTicks.push(f);

  const stat = (label: string, value: string, sub: string, d: number, hi = 0) => (
    <Appear delay={d} y={26} scale={0.92}>
      <Card pad={11} r={18} style={{ boxShadow: `0 8px 22px rgba(0,0,0,0.3), 0 0 ${26 * hi}px rgba(92,168,255,${0.5 * hi})`, borderColor: hi > 0.05 ? `rgba(92,168,255,${0.2 + 0.5 * hi})` : C.border }}>
        <Sub style={{ fontWeight: 600 }}>{label}</Sub>
        <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: -0.8, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.blue, marginTop: 1 }}>{sub}</div>
      </Card>
    </Appear>
  );

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Headline text="Know what every request costs" accent={4} />
      <Sfx name="pop" at={12} volume={0.4} />
      {countTicks.map((f) => (
        <Sfx key={f} name="count" at={f} volume={0.35} />
      ))}
      {BARS.map((_, i) => (
        <Sfx key={i} name="tick2" at={tChart + 6 + i * 4} volume={0.3} />
      ))}
      <Sfx name="chime" at={tChart + 38} volume={0.35} />
      <Sfx name="whoosh-short" at={tPerf} volume={0.28} />
      <Sfx name="shimmer" at={tBanner} volume={0.3} />

      <UIFrame width={410}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {stat("Spend", `$${spend.toFixed(2)}`, "This month", 10, spendPulse)}
            {stat("Requests", `${req}`, "+18%", 14)}
            {stat("Tokens", `${tok.toFixed(1)}M`, "in + out", 18)}
          </div>

          <Appear delay={tChart - 10} y={30}>
            <Card pad={12} r={20}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <Title style={{ fontSize: 18 }}>Daily usage</Title>
                  <Sub>Last 7 days</Sub>
                </div>
                <div style={{ fontSize: 23, fontWeight: 600, color: C.blue, fontVariantNumeric: "tabular-nums" }}>${day.toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 78, marginTop: 8 }}>
                {BARS.map((h, i) => {
                  const p = interpolate(frame, [tChart + 4 + i * 4, tChart + 24 + i * 4], [0, 1], { ...clamp, easing: easeOut });
                  const hi = i === 5;
                  return <div key={i} style={{ flex: 1, height: h * 0.82 * p, borderRadius: 6, background: hi ? C.blue : "#2F5282", boxShadow: hi && p > 0.9 ? "0 0 18px rgba(92,168,255,0.55)" : "none" }} />;
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                {DAYS.map((d, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 11.5, fontWeight: 600, color: C.dim }}>
                    {d}
                  </div>
                ))}
              </div>
            </Card>
          </Appear>

          <Appear delay={tPerf} y={30}>
            <Card pad={12} r={20}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Title style={{ fontSize: 18 }}>Provider performance</Title>
                <Sub style={{ fontWeight: 600, letterSpacing: 0.4 }}>TTFT</Sub>
              </div>
              {PERF.map(([name, val, frac], i) => {
                const p = interpolate(frame, [tPerf + 8 + i * 6, tPerf + 34 + i * 6], [0, 1], { ...clamp, easing: easeOut });
                return (
                  <div key={name} style={{ marginTop: 9 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 600 }}>
                      <span>{name}</span>
                      <span style={{ color: C.sub, fontWeight: 600, opacity: p }}>{val}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "rgba(156,174,202,0.16)", marginTop: 5, overflow: "hidden" }}>
                      <div style={{ width: `${frac * 100 * p}%`, height: "100%", borderRadius: 3, background: C.blue }} />
                    </div>
                  </div>
                );
              })}
            </Card>
          </Appear>

          <Appear delay={tBanner} y={24}>
            <Card pad={11} r={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <Icon name="shieldLock" size={24} color={C.blue} inkColor={C.card} />
                <Title style={{ fontSize: 16 }}>Usage analytics stay on this device.</Title>
              </div>
            </Card>
          </Appear>
        </div>
      </UIFrame>
    </div>
  );
};
