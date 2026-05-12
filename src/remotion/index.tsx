// Remotion entry point
import { registerRoot, Composition } from 'remotion';
import React from 'react';
import { ShopMotionVideo } from './ShopMotionVideo';
import type { Storyboard } from '../types/index.js';

/** Default storyboard for Remotion Studio preview */
const defaultStoryboard: Storyboard = {
  id: 'preview-sb',
  product: { name: '示例商品', category: '日用百货', price: 59.9 },
  sellingPoints: [
    { id: 'sp-1', title: '高性价比', description: '超值体验，物美价廉', priority: 1 },
    { id: 'sp-2', title: '品质保证', description: '严格品控，放心购买', priority: 2 },
    { id: 'sp-3', title: '便携设计', description: '轻巧易带，随时随地', priority: 3 },
  ],
  scenes: [
    {
      id: 'scene-hook',
      type: 'hook',
      durationInFrames: 90,
      title: '示例商品 — 你值得拥有',
      subtitle: '这是一款超值好物',
      elements: [
        { type: 'text', content: '示例商品', position: 'center' },
        { type: 'cta', text: '往下看 ↓', position: 'bottom' },
      ],
      voiceover: { text: '还在犹豫？看看这款示例商品！', startFrame: 0, durationInFrames: 90 },
      captions: [
        { text: '还在犹豫？', startFrame: 5, endFrame: 40 },
        { text: '看看这款示例商品！', startFrame: 40, endFrame: 90 },
      ],
    },
    {
      id: 'scene-feature-1',
      type: 'feature',
      durationInFrames: 90,
      title: '高性价比',
      subtitle: '超值体验，物美价廉',
      elements: [{ type: 'sellingPoint', sellingPointId: 'sp-1', position: 'center' }],
      voiceover: { text: '超值体验，物美价廉', startFrame: 90, durationInFrames: 90 },
      captions: [
        { text: '高性价比', startFrame: 95, endFrame: 135 },
        { text: '超值体验，物美价廉', startFrame: 135, endFrame: 180 },
      ],
    },
    {
      id: 'scene-cta',
      type: 'cta',
      durationInFrames: 90,
      title: '立即抢购',
      subtitle: '¥59.9',
      elements: [
        { type: 'cta', text: '立即购买', position: 'center' },
        { type: 'text', content: '仅售 ¥59.9', position: 'bottom' },
      ],
      voiceover: { text: '示例商品，现在下单仅需59.9元！', startFrame: 180, durationInFrames: 90 },
      captions: [{ text: '现在下单仅需 ¥59.9', startFrame: 185, endFrame: 270 }],
    },
  ],
  style: {
    primaryColor: '#FF4D4F',
    secondaryColor: '#FFF1F0',
    fontFamily: 'sans-serif',
    aspectRatio: '9:16',
  },
  totalDurationInFrames: 270,
  fps: 30,
};

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShopMotionVideo"
        component={ShopMotionVideo}
        durationInFrames={defaultStoryboard.totalDurationInFrames}
        fps={defaultStoryboard.fps}
        width={1080}
        height={1920}
        defaultProps={{ storyboard: defaultStoryboard }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
