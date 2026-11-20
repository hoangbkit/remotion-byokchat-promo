import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { Video } from "./Video";
import { timeline } from "./timeline";

// One video component, three canvases. The layout adapts to width/height (see src/layout.ts).
export const Root: React.FC = () => (
  <>
    <Composition id="ByokPromo" component={Video} durationInFrames={timeline.totalFrames} fps={timeline.fps} width={1080} height={1080} />
    <Composition id="ByokPromoWide" component={Video} durationInFrames={timeline.totalFrames} fps={timeline.fps} width={1920} height={1080} />
    <Composition id="ByokPromoTall" component={Video} durationInFrames={timeline.totalFrames} fps={timeline.fps} width={1080} height={1920} />
  </>
);
