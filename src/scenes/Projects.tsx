import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Appear, Sfx, clamp, countUp, typed } from "../anim";
import { Icon, IconName } from "../ui/icons";
import { Card, IconTile, Pill, Sub, Title, UIFrame } from "../ui/primitives";
import { Headline, useAt } from "../ui/shared";
import type { SceneInfo } from "../timeline";

const Chat: React.FC<{ icon: IconName; title: string; when: string; at: number; last?: boolean }> = ({ icon, title, when, at, last }) => (
  <Appear delay={at} y={16} x={24} scale={0.98}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: last ? "none" : `1px solid ${C.border}` }}>
      <div style={{ width: 26, display: "flex", justifyContent: "center", color: C.blue }}>
        <Icon name={icon} size={22} inkColor={C.card} />
      </div>
      <div style={{ flex: 1 }}>
        <Title style={{ fontSize: 15.5 }}>{title}</Title>
        <Sub>{when}</Sub>
      </div>
      <Icon name="chevron" size={16} color={C.dim} />
    </div>
  </Appear>
);

export const Projects: React.FC<{ scene: SceneInfo }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const at = useAt(scene);
  const tFiles = Math.max(52, at("files", 70));
  const tInstr = Math.max(tFiles + 40, at("instructions", 98));

  const convs = Math.round(countUp(frame, 22, 24, 12));
  const instrText = typed("Native iPhone UI · concise answers · ask before write tools", frame, tInstr + 10, 52);
  const ticks: number[] = [];
  for (let f = tInstr + 10; f < tInstr + 10 + 36; f += 3) ticks.push(f);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Headline text="Keep every project organized" accent={3} />
      <Sfx name="pop" at={12} volume={0.4} />
      {[34, 40, 46].map((f) => (
        <Sfx key={f} name="pop-soft" at={f} volume={0.38} />
      ))}
      {[0, 1, 2].map((i) => (
        <Sfx key={`c${i}`} name="tick1" at={tFiles + i * 8} volume={0.3} />
      ))}
      {ticks.map((f, i) => (
        <Sfx key={f} name={`tick${(i % 3) + 1}`} at={f} volume={0.18} />
      ))}

      <UIFrame width={400}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Appear delay={10} y={30}>
            <Card pad={12} r={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <IconTile size={50} r={14}>
                  <Icon name="plane" size={26} />
                </IconTile>
                <div style={{ flex: 1 }}>
                  <Title style={{ fontSize: 21 }}>BYOK Launch</Title>
                  <Sub style={{ fontSize: 13 }}>{convs} conversations</Sub>
                </div>
                <Icon name="dots" size={22} color={C.sub} />
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.35, color: C.sub, marginTop: 9 }}>Ship a minimal native AI workspace with direct provider access and safe tool use.</div>
              <div style={{ display: "flex", gap: 7, marginTop: 9 }}>
                {([
                  ["sparkle", "Sonnet 5", 34],
                  ["cube", "3 MCP", 40],
                  ["paperclip", "6 files", 46],
                ] as [IconName, string, number][]).map(([ic, label, d]) => (
                  <Appear key={label} delay={d} y={10} scale={0.7}>
                    <Pill style={{ fontSize: 12.5 }}>
                      <Icon name={ic} size={14} />
                      {label}
                    </Pill>
                  </Appear>
                ))}
              </div>
            </Card>
          </Appear>

          <Appear delay={26} y={30}>
            <Card pad={12} r={20}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                <Title style={{ fontSize: 19 }}>Recent chats</Title>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.blue }}>View all</div>
              </div>
              <Chat icon="badge" title="Release readiness review" when="2 min ago" at={tFiles - 16} />
              <Chat icon="image" title="App Store screenshot copy" when="Yesterday" at={tFiles - 8} />
              <Chat icon="dollar" title="Provider pricing research" when="Yesterday" at={tFiles} last />
            </Card>
          </Appear>

          <Appear delay={tInstr} y={26}>
            <Card pad={11} r={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon name="lines" size={26} color={C.blue} />
                <div style={{ flex: 1, minHeight: 36 }}>
                  <Title style={{ fontSize: 16 }}>Project instructions</Title>
                  <Sub style={{ fontSize: 12.5, minHeight: 16 }}>{instrText}</Sub>
                </div>
              </div>
            </Card>
          </Appear>
        </div>
      </UIFrame>
    </div>
  );
};
