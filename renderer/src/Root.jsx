import React from 'react';
import { Composition } from 'remotion';
import { EdlVideo } from './Video.jsx';

const emptyResolved = { fps: 30, totalFrames: 1, clips: [], punches: [], texts: [], audioSegs: [], music: null };

export const Root = () => (
  <Composition
    id="Edl"
    component={EdlVideo}
    durationInFrames={1}
    fps={30}
    width={960}
    height={540}
    defaultProps={{ resolved: emptyResolved, media: {}, width: 960, height: 540 }}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(1, props.resolved.totalFrames),
      fps: props.resolved.fps,
      width: props.width,
      height: props.height,
    })}
  />
);
