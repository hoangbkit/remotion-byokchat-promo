import React, { useLayoutEffect, useRef, useState } from "react";
import { C, FONT } from "../theme";
import { useLayout } from "../layout";

export const Card: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; pad?: number; r?: number }> = ({ children, style, pad = 12, r = 16 }) => (
  <div
    style={{
      background: `linear-gradient(180deg, ${C.cardHi} 0%, ${C.card} 100%)`,
      border: `1px solid ${C.border}`,
      borderRadius: r,
      padding: pad,
      boxShadow: "0 8px 22px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ children?: React.ReactNode; bg?: string; color?: string; style?: React.CSSProperties }> = ({
  children,
  bg = C.blueSoft,
  color = C.blue,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 10px",
      borderRadius: 99,
      background: bg,
      color,
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export const IconTile: React.FC<{ children?: React.ReactNode; size?: number; r?: number; bg?: string; style?: React.CSSProperties }> = ({
  children,
  size = 34,
  r = 11,
  bg = C.tile,
  style,
}) => (
  <div style={{ width: size, height: size, borderRadius: r, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.blue, flexShrink: 0, ...style }}>
    {children}
  </div>
);

/**
 * Places app-space UI (pt units) inside the layout's UI box and scales it to fit both the box
 * width and height (measured from its own content), so every aspect ratio works.
 */
export const UIFrame: React.FC<{ width: number; maxScale?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  width,
  maxScale = 3,
  children,
  style,
}) => {
  const L = useLayout();
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);
  useLayoutEffect(() => {
    if (ref.current && ref.current.offsetHeight !== h) setH(ref.current.offsetHeight);
  });
  const fitW = L.ui.w / width;
  const fitH = h > 0 ? L.ui.h / h : fitW;
  const s = Math.min(maxScale * L.k, fitW, fitH);
  const left = L.ui.x + (L.ui.w - width * s) / 2;
  const top = L.ui.y + (L.uiVAlign === "center" ? Math.max(0, (L.ui.h - h * s) / 2) : 0);
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left,
        top,
        width,
        transform: `scale(${s})`,
        transformOrigin: "top left",
        fontFamily: FONT,
        color: C.text,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Title: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.2, color: C.text, ...style }}>{children}</div>
);
export const Sub: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 12, fontWeight: 400, color: C.sub, ...style }}>{children}</div>
);
