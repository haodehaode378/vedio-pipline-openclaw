import { describe, it, expect } from 'vitest';
import type {
  Scene,
  SceneType,
  CaptionTrack,
  VoiceoverTimeline,
  RenderConfig,
} from '../modules/storyboard/types.js';
import { sceneTypeMetas, getSceneTypeMeta } from '../modules/storyboard/types.js';

describe('Storyboard Types', () => {
  it('should define 8 scene types', () => {
    const types: SceneType[] = ['hook', 'product_reveal', 'selling_point', 'scenario', 'comparison', 'proof', 'price_offer', 'cta'];
    expect(types.length).toBe(8);
  });

  it('should have 8 scene type metas', () => {
    expect(sceneTypeMetas.length).toBe(8);
  });

  it('should have valid meta for each scene type', () => {
    for (const meta of sceneTypeMetas) {
      expect(meta.type).toBeTruthy();
      expect(meta.name).toBeTruthy();
      expect(meta.description).toBeTruthy();
      expect(meta.typicalDuration.length).toBe(2);
      expect(meta.typicalDuration[0]).toBeLessThan(meta.typicalDuration[1]);
      expect(meta.intent).toBeTruthy();
      expect(meta.templateSlot).toBeTruthy();
      expect(meta.layoutHints.length).toBeGreaterThan(0);
    }
  });

  it('should get scene type meta by type', () => {
    const hookMeta = getSceneTypeMeta('hook');
    expect(hookMeta).toBeDefined();
    expect(hookMeta!.name).toBe('开场痛点引入');
  });

  it('should return undefined for unknown scene type', () => {
    // @ts-expect-error testing invalid type
    const meta = getSceneTypeMeta('unknown');
    expect(meta).toBeUndefined();
  });

  it('should accept valid Scene object', () => {
    const scene: Scene = {
      id: 's1',
      type: 'hook',
      title: '标题',
      narration: '旁白',
      caption: '字幕',
      visualPrompt: '视觉提示',
      durationInSeconds: 5,
      layout: 'centered',
      sellingPointIds: [],
      transition: 'fade',
      sceneIntent: '吸引注意力',
      layoutHint: 'centered',
      templateSlot: 'scene-hook',
    };
    expect(scene.type).toBe('hook');
  });

  it('should accept valid CaptionTrack', () => {
    const track: CaptionTrack = {
      segments: [
        { id: 'c1', text: '测试', startTime: 0, endTime: 5, sceneId: 's1', style: 'default' },
      ],
      language: 'zh-CN',
      style: 'bottom-bar',
      density: 'normal',
      maxCharsPerLine: 16,
    };
    expect(track.segments.length).toBe(1);
  });

  it('should accept valid VoiceoverTimeline', () => {
    const timeline: VoiceoverTimeline = {
      segments: [
        { id: 'v1', text: '旁白', startTime: 0, duration: 5, sceneId: 's1', pace: 'normal', emotion: 'neutral' },
      ],
      totalDuration: 5,
      overallPace: 'normal',
    };
    expect(timeline.overallPace).toBe('normal');
  });

  it('should accept valid RenderConfig', () => {
    const config: RenderConfig = {
      width: 1080,
      height: 1920,
      fps: 30,
      durationInFrames: 900,
      outputPath: './output/test.mp4',
      quality: 'high',
      format: 'mp4',
    };
    expect(config.fps).toBe(30);
  });
});
