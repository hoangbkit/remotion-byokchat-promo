import { useVideoConfig } from "remotion";

export type Layout = {
  mode: "square" | "wide" | "tall";
  W: number;
  H: number;
  /** scale used for scenes designed on a 1080x1080 stage (hook / end card) */
  k: number;
  /** scale for the hook / end-card stage */
  stageK: number;
  cx: number;
  /** top of the 1080-stage for hook / end card scenes */
  stageTop: number;
  brand: { x: number; y: number; size: number };
  headline: { x: number; y: number; w: number; size: number };
  ui: { x: number; y: number; w: number; h: number };
  uiVAlign: "top" | "center";
  /** captions for feature scenes */
  captions: { x: number; y: number; w: number; h: number; size: number; align: "center" | "left" };
  /** captions for the centered hook / end card scenes */
  captionsCentered: { x: number; y: number; w: number; h: number; size: number; align: "center" };
};

export const computeLayout = (W: number, H: number): Layout => {
  const ratio = W / H;
  if (ratio > 1.3) {
    const k = H / 1080;
    return {
      mode: "wide", W, H, k, stageK: k, cx: W / 2, stageTop: 0,
      brand: { x: 110 * k, y: 64 * k, size: 52 * k },
      headline: { x: 110 * k, y: 300 * k, w: 780 * k, size: 88 * k },
      ui: { x: W / 2 + 10 * k, y: 112 * k, w: W / 2 - 120 * k, h: 900 * k },
      uiVAlign: "center",
      captions: { x: 110 * k, y: 770 * k, w: 780 * k, h: 150 * k, size: 44 * k, align: "left" },
      captionsCentered: { x: W / 2 - 600 * k, y: 944 * k, w: 1200 * k, h: 80 * k, size: 44 * k, align: "center" },
    };
  }
  if (ratio < 0.77) {
    const k = W / 1080;
    const padX = 72 * k;
    const topPad = 72 * k;
    const bottomPad = 72 * k;
    const brandSize = 52 * k;
    const headlineY = topPad + brandSize * 1.08 + 32 * k;
    const headlineSize = Math.min(78 * k, Math.round(H * 0.052));
    const headlineW = Math.min(W - 2 * padX, 9.75 * headlineSize);
    const headlineBottom = headlineY + headlineSize * 1.08 * 2;
    const capH = 116 * k;
    const capY = H - bottomPad - capH;
    const availH = Math.max(240 * k, capY - headlineBottom);
    const uiGap = Math.max(36 * k, Math.round(availH * 0.115));
    const uiY = headlineBottom + uiGap;
    const uiH = Math.max(200 * k, capY - uiGap - uiY);
    const stageK = Math.min(1.1 * k, (capY - topPad) / 960);
    const stageTop = (topPad + capY) / 2 - 525 * stageK;
    return {
      mode: "tall", W, H, k, stageK, cx: W / 2, stageTop,
      brand: { x: padX, y: topPad, size: brandSize },
      headline: { x: padX, y: headlineY, w: headlineW, size: headlineSize },
      ui: { x: padX, y: uiY, w: W - 2 * padX, h: uiH },
      uiVAlign: "center",
      captions: { x: 90 * k, y: capY, w: W - 180 * k, h: capH, size: 50 * k, align: "center" },
      captionsCentered: { x: 90 * k, y: capY, w: W - 180 * k, h: capH, size: 50 * k, align: "center" },
    };
  }
  const k = Math.min(W, H) / 1080;
  return {
    mode: "square", W, H, k, stageK: k, cx: W / 2, stageTop: (H - 1080 * k) / 2,
    brand: { x: 72 * k, y: 52 * k, size: 52 * k },
    headline: { x: 72 * k, y: 128 * k, w: W - 144 * k, size: 62 * k },
    ui: { x: 72 * k, y: 226 * k, w: W - 144 * k, h: 724 * k },
    uiVAlign: "top",
    captions: { x: 90 * k, y: H - 108 * k, w: W - 180 * k, h: 64 * k, size: 38 * k, align: "center" },
    captionsCentered: { x: 90 * k, y: H - 108 * k, w: W - 180 * k, h: 64 * k, size: 38 * k, align: "center" },
  };
};

export const useLayout = (): Layout => {
  const { width, height } = useVideoConfig();
  return computeLayout(width, height);
};
