import React from "react";
import { C } from "../theme";
import { Icon } from "./icons";

export const CheckDot: React.FC<{ size?: number; scale?: number; ring?: number }> = ({ size = 20, scale = 1, ring = 0 }) => (
  <div style={{ position: "relative", width: size, height: size, flexShrink: 0, transform: `scale(${scale})` }}>
    {ring > 0 ? (
      <div style={{ position: "absolute", inset: -size * 0.5 * ring, borderRadius: "50%", border: `2px solid ${C.green}`, opacity: 1 - ring }} />
    ) : null}
    <div style={{ width: size, height: size, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#06260F" }}>
      <Icon name="check" size={size * 0.66} color="#06260F" />
    </div>
  </div>
);
