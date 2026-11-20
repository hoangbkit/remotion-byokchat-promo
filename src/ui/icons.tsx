import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../theme";

export type IconName =
  | "sparkle" | "cube" | "doc" | "docSearch" | "check" | "shieldCheck" | "shieldLock" | "hand" | "plus" | "mic"
  | "arrowUp" | "brain" | "wave" | "diamond" | "globe" | "plane" | "search" | "person" | "bulb" | "qcircle"
  | "ban" | "chevron" | "selector" | "badge" | "key" | "lock" | "image" | "dollar" | "chat" | "folder"
  | "paperclip" | "chart" | "lines" | "download" | "dots";

const S = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const paths: Record<IconName, (c: string) => React.ReactNode> = {
  sparkle: () => (
    <>
      <path d="M11 2.5l2 5.9 5.9 2-5.9 2-2 5.9-2-5.9-5.9-2 5.9-2z" fill="currentColor" />
      <path d="M19 14.5l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" fill="currentColor" />
    </>
  ),
  cube: () => (
    <>
      <path d="M12 2.8l8 4.4-8 4.4-8-4.4z" fill="currentColor" />
      <path d="M4 7.9l7.4 4.1v8.6L4 16.5z" fill="currentColor" opacity={0.72} />
      <path d="M20 7.9l-7.4 4.1v8.6l7.4-4.1z" fill="currentColor" opacity={0.5} />
    </>
  ),
  doc: (c) => (
    <>
      <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="currentColor" />
      <path d="M14 3v5h5z" fill={c} opacity={0.35} />
    </>
  ),
  docSearch: () => (
    <>
      <path d="M12 3H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h4M12 3l5 5v2.5" {...S} strokeWidth={1.8} />
      <path d="M12 3v5h5" {...S} strokeWidth={1.8} />
      <circle cx="15.5" cy="16" r="3" {...S} strokeWidth={1.8} />
      <path d="M17.7 18.3l2.6 2.6" {...S} strokeWidth={1.8} />
    </>
  ),
  check: () => <path d="M5 12.8l4.6 4.6L19.2 7.6" {...S} strokeWidth={2.8} />,
  shieldCheck: (c) => (
    <>
      <path d="M12 2.8l7.2 2.9v5.6c0 4.6-3 8.4-7.2 9.9-4.2-1.5-7.2-5.3-7.2-9.9V5.7z" fill="currentColor" />
      <path d="M8.6 12l2.5 2.5 4.4-4.7" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  shieldLock: (c) => (
    <>
      <path d="M12 2.8l7.2 2.9v5.6c0 4.6-3 8.4-7.2 9.9-4.2-1.5-7.2-5.3-7.2-9.9V5.7z" fill="currentColor" />
      <rect x="8.9" y="10.8" width="6.2" height="5" rx="1.1" fill={c} />
      <path d="M10.2 10.8V9.6a1.8 1.8 0 0 1 3.6 0v1.2" fill="none" stroke={c} strokeWidth={1.6} strokeLinecap="round" />
    </>
  ),
  hand: () => (
    <path
      d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.4L3.4 16a2 2 0 0 1 3.2-2.4L8 15"
      {...S}
      strokeWidth={2}
      transform="translate(-1 0)"
    />
  ),
  plus: () => <path d="M12 5v14M5 12h14" {...S} strokeWidth={2.8} />,
  mic: () => (
    <>
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" fill="currentColor" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" {...S} strokeWidth={1.9} />
    </>
  ),
  arrowUp: () => <path d="M12 19V5M6 11l6-6 6 6" {...S} strokeWidth={2.8} />,
  brain: () => (
    <>
      <path d="M9.5 4a3 3 0 0 0-3 3 3 3 0 0 0-2 2.8A3 3 0 0 0 5.5 14 3 3 0 0 0 9 18.5 2.7 2.7 0 0 0 12 19V5.5A2.5 2.5 0 0 0 9.5 4z" {...S} strokeWidth={1.8} fill="currentColor" fillOpacity={0.25} />
      <path d="M14.5 4a3 3 0 0 1 3 3 3 3 0 0 1 2 2.8A3 3 0 0 1 18.5 14 3 3 0 0 1 15 18.5 2.7 2.7 0 0 1 12 19V5.5A2.5 2.5 0 0 1 14.5 4z" {...S} strokeWidth={1.8} fill="currentColor" fillOpacity={0.25} />
      <path d="M8.5 10h1.5M14 10h1.5M9 14h1.5M13.5 14H15" {...S} strokeWidth={1.5} />
    </>
  ),
  wave: () => <path d="M3 15.5c2.2-5.8 4.6-6.6 7-3.1 2.3 3.4 4.8 2.5 8.2-5" {...S} strokeWidth={2.8} />,
  diamond: () => <path d="M12 3.4l8.6 8.6-8.6 8.6L3.4 12z" fill="currentColor" stroke="currentColor" strokeWidth={2.4} strokeLinejoin="round" />,
  globe: () => (
    <>
      <circle cx="12" cy="12" r="9" {...S} strokeWidth={1.8} />
      <path d="M3 12h18M12 3c3.2 3.2 3.2 14.8 0 18M12 3c-3.2 3.2-3.2 14.8 0 18" {...S} strokeWidth={1.6} />
    </>
  ),
  plane: () => <path d="M21 3L3 10.2l7.3 3.1L13.4 21z" fill="currentColor" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />,
  search: () => (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" {...S} strokeWidth={2.4} />
      <path d="M15.6 15.6L21 21" {...S} strokeWidth={2.6} />
    </>
  ),
  person: () => (
    <>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4.5 21c0-4.4 3.4-7 7.5-7s7.5 2.6 7.5 7z" fill="currentColor" />
    </>
  ),
  bulb: () => (
    <>
      <path d="M12 2.5a6.5 6.5 0 0 0-3.6 11.9c.7.5 1.1 1.2 1.1 2h5c0-.8.4-1.5 1.1-2A6.5 6.5 0 0 0 12 2.5z" fill="currentColor" />
      <path d="M9.5 19h5M10.5 21.5h3" {...S} strokeWidth={1.8} />
    </>
  ),
  qcircle: (c) => (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M9.4 9.6a2.6 2.6 0 1 1 3.7 2.3c-.7.4-1.1.9-1.1 1.7" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" />
      <circle cx="12" cy="16.9" r="1.2" fill={c} />
    </>
  ),
  ban: () => (
    <>
      <circle cx="12" cy="12" r="9" {...S} strokeWidth={2} />
      <path d="M5.6 5.6l12.8 12.8" {...S} strokeWidth={2} />
    </>
  ),
  chevron: () => <path d="M9 5l7 7-7 7" {...S} strokeWidth={2.4} />,
  selector: () => <path d="M8 9l4-4 4 4M8 15l4 4 4-4" {...S} strokeWidth={2.2} />,
  badge: (c) => (
    <>
      <path d="M12 2l2.4 1.9 3-.2 1 2.9 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-1 2.9-3-.2L12 22l-2.4-1.9-3 .2-1-2.9-2.5-1.7.9-2.9-.9-2.9 2.5-1.7 1-2.9 3 .2z" fill="currentColor" />
      <path d="M8.3 12.2l2.7 2.7 4.7-5" fill="none" stroke={c} strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  key: () => <path d="M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" {...S} strokeWidth={2} />,
  lock: () => (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.2" fill="currentColor" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" {...S} strokeWidth={2} />
    </>
  ),
  image: () => (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" {...S} strokeWidth={1.8} />
      <circle cx="8.5" cy="10" r="1.6" fill="currentColor" />
      <path d="M4 17l5-4.5 3.5 3L16 12l4.2 4.2" {...S} strokeWidth={1.8} />
    </>
  ),
  dollar: (c) => (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M14.6 9.3c-.4-1-1.4-1.6-2.6-1.6-1.5 0-2.7.8-2.7 2 0 3 5.5 1.6 5.5 4.6 0 1.3-1.2 2.2-2.9 2.2-1.3 0-2.4-.7-2.8-1.8M12 5.8v1.9M12 16.5v1.9" fill="none" stroke={c} strokeWidth={1.9} strokeLinecap="round" />
    </>
  ),
  chat: () => <path d="M4 5.5h16v10.5H9.5L5 20v-4H4z" {...S} strokeWidth={2} />,
  folder: () => <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v8.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" fill="currentColor" />,
  paperclip: () => <path d="M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" {...S} strokeWidth={2} />,
  chart: () => <path d="M5 20v-8M12 20V5M19 20V9" {...S} strokeWidth={3.2} />,
  lines: () => <path d="M4 7h16M4 12h16M4 17h10" {...S} strokeWidth={2.2} />,
  download: () => <path d="M12 4v11M7 11l5 5 5-5M5 20h14" {...S} strokeWidth={2.4} />,
  dots: () => (
    <>
      <circle cx="12" cy="12" r="10" {...S} strokeWidth={1.8} />
      <circle cx="7.8" cy="12" r="1.3" fill="currentColor" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      <circle cx="16.2" cy="12" r="1.3" fill="currentColor" />
    </>
  ),
};

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; inkColor?: string; style?: React.CSSProperties }> = ({
  name,
  size = 20,
  color = "currentColor",
  inkColor = C.ink,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ color, display: "block", flexShrink: 0, ...style }}>
    {paths[name](inkColor)}
  </svg>
);

export const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = C.blue }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${frame * 14}deg)`, display: "block", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={3} />
      <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
};
