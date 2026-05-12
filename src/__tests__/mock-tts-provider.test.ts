import { describe, it, expect } from 'vitest';
import { MockTTSProvider } from '../core/mock-tts-provider.js';

describe('MockTTSProvider', () => {
  const provider = new MockTTSProvider();

  describe('generateVoiceover', () => {
    it('应返回 audioUrl 和 durationInFrames', async () => {
      const result = await provider.generateVoiceover('这是一段测试文本');
      expect(result).toHaveProperty('audioUrl');
      expect(result).toHaveProperty('durationInFrames');
    });

    it('durationInFrames 应为正数', async () => {
      const result = await provider.generateVoiceover('这是一段测试文本');
      expect(result.durationInFrames).toBeGreaterThan(0);
    });

    it('durationInFrames 应大于等于 30（最短1秒）', async () => {
      const result = await provider.generateVoiceover('短');
      expect(result.durationInFrames).toBeGreaterThanOrEqual(30);
    });

    it('较长文本应有更长的时长', async () => {
      const shortResult = await provider.generateVoiceover('短文本');
      const longResult = await provider.generateVoiceover('这是一段比较长的文本，用来测试时长是否与文本长度成正比');
      expect(longResult.durationInFrames).toBeGreaterThanOrEqual(shortResult.durationInFrames);
    });

    it('audioUrl 应以 mock:// 开头', async () => {
      const result = await provider.generateVoiceover('测试');
      expect(result.audioUrl).toMatch(/^mock:\/\//);
    });

    it('空文本不应崩溃', async () => {
      const result = await provider.generateVoiceover('');
      expect(result.durationInFrames).toBeGreaterThanOrEqual(30);
      expect(result.audioUrl).toBeTruthy();
    });
  });
});
