// Remotion Composition Entry - Template-driven video composition
import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import type { Storyboard } from '../../storyboard/types.js';
import type { TemplateConfig } from '../../templates/types.js';
import { getConfigById } from '../../templates/configs/index.js';
import { SceneRenderer } from '../templates/SceneRenderer.js';

/** 主 Composition 组件 */
export const ShopMotionComposition: React.FC<{
  storyboard: Storyboard;
}> = ({ storyboard }) => {
  const { fps } = useVideoConfig();

  // 获取模板配置
  const config = getConfigById(storyboard.template.configId);

  if (!config) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: 32 }}>模板配置未找到: {storyboard.template.configId}</div>
      </AbsoluteFill>
    );
  }

  // 计算每个场景的起始帧
  let currentFrame = 0;
  const sceneSequences = storyboard.scenes.map((scene, index) => {
    const startFrame = currentFrame;
    const durationInFrames = Math.round(scene.durationInSeconds * fps);
    currentFrame += durationInFrames;
    return { scene, startFrame, durationInFrames, index };
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: config.colorTheme.background,
      fontFamily: config.typographyScale.fontFamily,
    }}>
      {sceneSequences.map(({ scene, startFrame, durationInFrames, index }) => (
        <Sequence
          key={scene.id}
          from={startFrame}
          durationInFrames={durationInFrames}
        >
          <SceneRenderer
            scene={scene}
            storyboard={storyboard}
            config={config}
            sceneIndex={index}
            totalScenes={storyboard.scenes.length}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** Remotion 入口 */
import { registerRoot, Composition } from 'remotion';

/** 默认 Storyboard 用于 Remotion Studio 预览 */
const defaultStoryboard: Storyboard = {
  id: 'preview-sb',
  videoMeta: {
    title: 'ShopMotion 预览',
    aspectRatio: '9:16',
    duration: 30,
    style: '科技简洁',
    language: 'zh-CN',
    marketingGoal: '种草',
  },
  product: {
    name: '蓝牙降噪耳机',
    description: '全新一代主动降噪耳机，30小时续航，IPX5防水。',
    category: '数码科技',
    targetAudience: '科技爱好者',
    price: 599,
    originalPrice: 899,
    sellingPoints: [
      { id: 'sp-1', title: '自适应降噪', description: '智能识别环境噪音，自动调节降噪深度', priority: 1, category: '功能', emphasis: 'high' },
      { id: 'sp-2', title: '30小时续航', description: '一次充电使用30小时，告别电量焦虑', priority: 2, category: '功能', emphasis: 'high' },
      { id: 'sp-3', title: 'IPX5防水', description: '运动出汗、雨天出行都不怕', priority: 3, category: '品质', emphasis: 'medium' },
    ],
  },
  scenes: [
    {
      id: 'scene-hook', type: 'hook', title: '你还在用有线耳机？',
      narration: '你还在为耳机线缠绕而烦恼吗？', caption: '耳机线又缠了？',
      visualPrompt: 'hook场景：耳机痛点', durationInSeconds: 4.5,
      layout: 'centered', sellingPointIds: [], transition: 'zoom',
    },
    {
      id: 'scene-reveal', type: 'product_reveal', title: '蓝牙降噪耳机',
      narration: '全新蓝牙降噪耳机，让音乐自由无拘束。', caption: '蓝牙降噪耳机',
      visualPrompt: '产品展示', durationInSeconds: 4.5,
      layout: 'centered', sellingPointIds: [], transition: 'fade',
    },
    {
      id: 'scene-sp1', type: 'selling_point', title: '自适应降噪',
      narration: '智能识别环境噪音，自动调节降噪深度。', caption: '自适应降噪',
      visualPrompt: '卖点展示', durationInSeconds: 5,
      layout: 'card-grid', sellingPointIds: ['sp-1'], transition: 'slide',
    },
    {
      id: 'scene-sp2', type: 'selling_point', title: '30小时续航',
      narration: '一次充电使用30小时，告别电量焦虑。', caption: '30小时续航',
      visualPrompt: '卖点展示', durationInSeconds: 5,
      layout: 'card-grid', sellingPointIds: ['sp-2'], transition: 'slide',
    },
    {
      id: 'scene-price', type: 'price_offer', title: '限时33%OFF',
      narration: '原价899元，现在仅需599元！', caption: '¥599 原价¥899',
      visualPrompt: '价格优惠', durationInSeconds: 4,
      layout: 'centered', sellingPointIds: [], transition: 'zoom',
    },
    {
      id: 'scene-cta', type: 'cta', title: '立即抢购',
      narration: '数量有限，先到先得！', caption: '仅售 ¥599 立即下单',
      visualPrompt: 'CTA引导', durationInSeconds: 7,
      layout: 'centered', sellingPointIds: [], transition: 'fade',
      cta: '✨ 立即购买',
    },
  ],
  captions: {
    segments: [
      { id: 'c1', text: '耳机线又缠了？', startTime: 0.2, endTime: 4.3, sceneId: 'scene-hook' },
      { id: 'c2', text: '蓝牙降噪耳机', startTime: 4.7, endTime: 8.8, sceneId: 'scene-reveal' },
      { id: 'c3', text: '自适应降噪', startTime: 9.2, endTime: 13.8, sceneId: 'scene-sp1' },
      { id: 'c4', text: '30小时续航', startTime: 14.2, endTime: 18.8, sceneId: 'scene-sp2' },
      { id: 'c5', text: '¥599 原价¥899', startTime: 19.2, endTime: 22.8, sceneId: 'scene-price' },
      { id: 'c6', text: '仅售 ¥599 立即下单', startTime: 23.2, endTime: 29.8, sceneId: 'scene-cta' },
    ],
    language: 'zh-CN',
    style: 'bottom-bar',
  },
  voiceover: {
    segments: [
      { id: 'v1', text: '你还在为耳机线缠绕而烦恼吗？', startTime: 0, duration: 4.5, sceneId: 'scene-hook' },
      { id: 'v2', text: '全新蓝牙降噪耳机，让音乐自由无拘束。', startTime: 4.5, duration: 4.5, sceneId: 'scene-reveal' },
      { id: 'v3', text: '智能识别环境噪音，自动调节降噪深度。', startTime: 9, duration: 5, sceneId: 'scene-sp1' },
      { id: 'v4', text: '一次充电使用30小时，告别电量焦虑。', startTime: 14, duration: 5, sceneId: 'scene-sp2' },
      { id: 'v5', text: '原价899元，现在仅需599元！', startTime: 19, duration: 4, sceneId: 'scene-price' },
      { id: 'v6', text: '数量有限，先到先得！', startTime: 23, duration: 7, sceneId: 'scene-cta' },
    ],
    totalDuration: 30,
    mockAudioUrl: 'mock://tts/preview.mp3',
  },
  renderConfig: {
    width: 1080, height: 1920, fps: 30, durationInFrames: 900,
    outputPath: './output/preview.mp4', quality: 'high', format: 'mp4',
  },
  template: {
    familyId: 'TechClean',
    variantId: 'TechClean-standard-9:16-30s',
    configId: 'TechClean-standard-9:16-30s',
  },
};

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ShopMotionVideo"
        component={ShopMotionComposition}
        durationInFrames={defaultStoryboard.renderConfig.durationInFrames}
        fps={defaultStoryboard.renderConfig.fps}
        width={defaultStoryboard.renderConfig.width}
        height={defaultStoryboard.renderConfig.height}
        defaultProps={{ storyboard: defaultStoryboard }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
