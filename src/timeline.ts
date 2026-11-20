import data from "./timeline.json";

export type Word = { w: string; s: number; e: number };
export type SceneInfo = {
  id: string;
  start: number;
  duration: number;
  lead: number;
  voiceFrames: number;
  voiceFile: string | null;
  text: string;
  words: Word[];
};
export const timeline = data as unknown as {
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  scenes: SceneInfo[];
};

export const sceneById = (id: string) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`scene ${id} missing from timeline.json (run npm run timeline)`);
  return s;
};

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Local frame (inside the scene) when a spoken word starts. Falls back if the word isn't found. */
export const wordFrame = (scene: SceneInfo, word: string, fallback: number, nth = 0): number => {
  const target = clean(word);
  let seen = 0;
  for (const w of scene.words) {
    if (clean(w.w).startsWith(target) && target.length > 0) {
      if (seen === nth) return w.s;
      seen++;
    }
  }
  return fallback;
};
