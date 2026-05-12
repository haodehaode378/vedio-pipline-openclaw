import { describe, it, expect } from 'vitest';
import { MockTTSProvider } from '../modules/voiceover/index.js';

describe('MockTTSProvider', () => {
  const tts = new MockTTSProvider();

  describe('generateVoiceover', () => {
    it('should return audio URL and duration', async () => {
      const result = await tts.generateVoiceover('你好世界');
      expect(result.audioUrl).toMatch(/^mock:\/\/tts\//);
      expect(result.durationInFrames).toBeGreaterThan(0);
    });

    it('should estimate duration based on text length', async () => {
      const short = await tts.generateVoiceover('短');
      const long = await tts.generateVoiceover('这是一段比较长的测试文本内容');
      expect(long.durationInFrames).toBeGreaterThan(short.durationInFrames);
    });
  });

  describe('generateTimeline', () => {
    it('should generate timeline from segments', async () => {
      const segments = [
        { text: '场景一', startTime: 0, duration: 5, sceneId: 's1' },
        { text: '场景二', startTime: 5, duration: 5, sceneId: 's2' },
      ];
      const timeline = await tts.generateTimeline(segments);
      expect(timeline.segments.length).toBe(2);
      expect(timeline.totalDuration).toBe(10);
      expect(timeline.overallPace).toBe('normal');
      expect(timeline.mockAudioUrl).toMatch(/^mock:\/\//);
    });

    it('should preserve pace and emotion markers', async () => {
      const segments = [
        { text: '开场', startTime: 0, duration: 3, sceneId: 's1', pace: 'fast' as const, emotion: 'excited' as const },
      ];
      const timeline = await tts.generateTimeline(segments);
      expect(timeline.segments[0].pace).toBe('fast');
      expect(timeline.segments[0].emotion).toBe('excited');
    });

    it('should default pace and emotion when not provided', async () => {
      const segments = [
        { text: '普通段', startTime: 0, duration: 3, sceneId: 's1' },
      ];
      const timeline = await tts.generateTimeline(segments);
      expect(timeline.segments[0].pace).toBe('normal');
      expect(timeline.segments[0].emotion).toBe('neutral');
    });
  });

  describe('generateVoiceoverTexts', () => {
    it('should extract text list from timeline', async () => {
      const segments = [
        { text: '文本一', startTime: 0, duration: 3, sceneId: 's1' },
        { text: '文本二', startTime: 3, duration: 4, sceneId: 's2' },
      ];
      const timeline = await tts.generateTimeline(segments);
      const texts = tts.generateVoiceoverTexts(timeline);
      expect(texts.length).toBe(2);
      expect(texts[0].text).toBe('文本一');
      expect(texts[1].text).toBe('文本二');
      expect(texts[0].index).toBe(0);
    });
  });

  describe('estimateTotalDuration', () => {
    it('should estimate duration for normal pace', () => {
      const duration = tts.estimateTotalDuration([
        { text: '一二三四', pace: 'normal' },
      ]);
      expect(duration).toBe(1); // 4 chars / 4 chars-per-second = 1s
    });

    it('should estimate longer for slow pace', () => {
      const slow = tts.estimateTotalDuration([{ text: '一二三四', pace: 'slow' }]);
      const normal = tts.estimateTotalDuration([{ text: '一二三四', pace: 'normal' }]);
      expect(slow).toBeGreaterThan(normal);
    });

    it('should estimate shorter for fast pace', () => {
      const fast = tts.estimateTotalDuration([{ text: '一二三四五六七八', pace: 'fast' }]);
      const normal = tts.estimateTotalDuration([{ text: '一二三四五六七八', pace: 'normal' }]);
      expect(fast).toBeLessThan(normal);
    });

    it('should return at least 1 second per segment', () => {
      const duration = tts.estimateTotalDuration([{ text: '一', pace: 'fast' }]);
      expect(duration).toBeGreaterThanOrEqual(1);
    });
  });
});
