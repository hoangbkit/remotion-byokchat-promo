import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { Appear, Sfx, StreamText, clamp, easeOut, typed, useSpring } from "../anim";
import { Icon, Spinner } from "../ui/icons";
import { Card, IconTile, Pill, Sub, Title, UIFrame } from "../ui/primitives";
import { CheckDot } from "../ui/bits";
import { Headline } from "../ui/shared";
import type { SceneInfo } from "../timeline";

const MESSAGE = "Compare these two reports and tell me what actually changed.";
const ANSWER = "The biggest change is pricing: the new report lowers inference cost while increasing the context window. Reliability is roughly unchanged.";

export const Chat: React.FC<{ scene: SceneInfo }> = () => {
  const frame = useCurrentFrame();

  // timeline (local frames)
  const T = { header: 10, type: 24, send: 72, bubble: 75, chip1: 88, chip2: 94, reason: 100, answer: 124, tool: 186, toolDone: 208 };
  const cps = 40;
  const typedText = frame < T.send ? typed(MESSAGE, frame, T.type, cps) : "";
  const shownInput = typedText.length > 34 ? "…" + typedText.slice(-33) : typedText;
  const sendPress = interpolate(frame, [T.send - 2, T.send + 2, T.send + 10], [1, 0.82, 1.0], clamp);
  const sendGlow = frame >= T.type && frame < T.send ? 1 : 0;
  const thinking = frame >= T.reason && frame < T.answer;
  const answered = frame >= T.answer;
  const toolDone = frame >= T.toolDone;
  const checkP = useSpring(T.toolDone, 10, 200);

  const ticks: number[] = [];
  for (let f = T.type; f < T.type + Math.ceil(MESSAGE.length / (cps / 30)); f += 2) ticks.push(f);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Headline text="Chat with the models you love" accent={3} />

      <Sfx name="pop" at={T.header + 2} volume={0.45} />
      {ticks.map((f, i) => (
        <Sfx key={f} name={`tick${(i % 3) + 1}`} at={f} volume={0.22} />
      ))}
      <Sfx name="send" at={T.send} volume={0.5} />
      <Sfx name="pop-soft" at={T.chip1} volume={0.5} />
      <Sfx name="pop-soft" at={T.chip2} volume={0.5} />
      <Sfx name="pop" at={T.reason} volume={0.4} />
      <Sfx name="whoosh-short" at={T.answer - 4} volume={0.25} />
      <Sfx name="pop-soft" at={T.tool} volume={0.45} />
      <Sfx name="chime" at={T.toolDone} volume={0.45} />

      <UIFrame width={440}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* model header */}
          <Appear delay={T.header} y={30}>
            <Card pad={10} r={18}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: C.tile, display: "flex", alignItems: "center", justifyContent: "center", color: C.blue }}>
                  <Icon name="sparkle" size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <Title>Claude Opus 5.5</Title>
                  <Sub>Anthropic · Personal</Sub>
                </div>
                <Pill>
                  <Icon name="cube" size={14} /> 3 tools
                </Pill>
              </div>
            </Card>
          </Appear>

          {/* user bubble */}
          <div style={{ display: "flex", justifyContent: "flex-end", minHeight: 54 }}>
            <Appear delay={T.bubble} y={110} scale={0.9} damping={14}>
              <div style={{ background: C.blue, color: C.ink, borderRadius: 18, padding: "10px 14px", fontSize: 15, lineHeight: 1.3, fontWeight: 400, maxWidth: 300 }}>{MESSAGE}</div>
            </Appear>
          </div>

          {/* attachments */}
          <div style={{ display: "flex", gap: 8, minHeight: 30 }}>
            {["pricing.pdf", "benchmark.pdf"].map((n, i) => (
              <Appear key={n} delay={i === 0 ? T.chip1 : T.chip2} y={16} scale={0.8}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: 99, background: C.card, border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 600 }}>
                  <Icon name="doc" size={15} color={C.text} inkColor={C.card} />
                  {n}
                </div>
              </Appear>
            ))}
          </div>

          {/* reasoning + tool */}
          <Appear delay={T.reason} y={30}>
            <Card pad={12} r={18} style={{ minHeight: 168 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: C.sub, fontSize: 12.5, fontWeight: 600, height: 18 }}>
                {thinking ? <Spinner size={14} /> : <Icon name="brain" size={16} color={C.sub} />}
                {thinking ? "Reasoning…" : "Reasoned for 8s"}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.33, marginTop: 8, minHeight: 60, color: C.text }}>
                {answered ? <StreamText text={ANSWER} start={T.answer} wps={14} /> : null}
              </div>
              <div style={{ height: 1, background: C.border, margin: "10px 0 8px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: interpolate(frame, [T.tool, T.tool + 8], [0, 1], clamp), transform: `translateY(${(1 - interpolate(frame, [T.tool, T.tool + 12], [0, 1], { ...clamp, easing: easeOut })) * 10}px)` }}>
                <Icon name="docSearch" size={24} color={C.blue} />
                <div style={{ flex: 1 }}>
                  <Title style={{ fontSize: 15 }}>Compared 2 attached reports</Title>
                  <Sub>{toolDone ? "Tool completed successfully" : "Running tool…"}</Sub>
                </div>
                {toolDone ? <CheckDot size={20} scale={checkP} ring={Math.max(0, 1 - (frame - T.toolDone) / 16)} /> : <Spinner size={18} />}
              </div>
            </Card>
          </Appear>

          {/* composer */}
          <Appear delay={T.header + 6} y={24}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, height: 46, padding: "0 8px 0 12px", borderRadius: 23, background: C.card, border: `1px solid ${sendGlow ? "rgba(92,168,255,0.55)" : C.border}`, boxShadow: sendGlow ? "0 0 0 3px rgba(92,168,255,0.14)" : "none" }}>
              <Icon name="plus" size={20} color={C.sub} />
              <div style={{ flex: 1, fontSize: 15, color: shownInput ? C.text : C.dim, whiteSpace: "nowrap", overflow: "hidden" }}>
                {shownInput || "Message Claude Opus 5.5"}
                {sendGlow && Math.floor(frame / 8) % 2 === 0 ? <span style={{ color: C.blue }}>|</span> : null}
              </div>
              <Icon name="mic" size={19} color={C.sub} />
              <div style={{ width: 32, height: 32, borderRadius: 16, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sendPress})`, boxShadow: sendGlow ? "0 0 14px rgba(92,168,255,0.7)" : "none" }}>
                <Icon name="arrowUp" size={18} color={C.ink} />
              </div>
            </div>
          </Appear>
        </div>
      </UIFrame>
    </div>
  );
};
