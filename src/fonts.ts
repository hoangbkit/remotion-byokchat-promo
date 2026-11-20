import { continueRender, delayRender, staticFile } from "remotion";

// Inter is bundled in public/fonts so renders are offline-safe and deterministic.
const faces: [string, string][] = [
  ["400", "Inter-Regular.otf"],
  ["600", "Inter-SemiBold.otf"],
  ["700", "Inter-Bold.otf"],
];

if (typeof window !== "undefined") {
  const handle = delayRender("Loading Inter");
  Promise.all(
    faces.map(([weight, file]) =>
      new FontFace("Inter", `url(${staticFile(`fonts/${file}`)})`, { weight }).load().then((f) => {
        document.fonts.add(f);
      }),
    ),
  )
    .catch((e) => console.error("Font load failed", e))
    .finally(() => continueRender(handle));
}
