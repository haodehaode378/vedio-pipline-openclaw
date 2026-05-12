import { describe, it, expect } from 'vitest';
import { generateSRT, generateCaptionsJSON, generateASS } from '../modules/captions/index.js';
import type { CaptionTrack } from '../modules/storyboard/types.js';

const mockCaptions: CaptionTrack = {
  segments: [
    { id: 'c1', text: '耳机线又缠了？', startTime: 0.2, endTime: 4.3, sceneId: 's1', style: 'highlight' },
    { id: 'c2', text: '蓝牙降噪耳机', startTime: 4.7, endTime: 8.8, sceneId: 's2', style: 'default' },
    { id: 'c3', text: '自适应降噪，智能识别环境噪音', startTime: 9.2, endTime: 13.8, sceneId: 's3', style: 'keyword' },
  ],
  language: 'zh-CN',
  style: 'bottom-bar',
  density: 'normal',
  maxCharsPerLine: 16,
};

describe('Caption Generation', () => {
  describe('generateSRT', () => {
    it('should generate valid SRT format', () => {
      const srt = generateSRT(mockCaptions);
      expect(srt).toContain('1\n');
      expect(srt).toContain('00:00:00,200 --> 00:00:04,300');
      expect(srt).toContain('耳机线又缠了？');
    });

    it('should include all segments', () => {
      const srt = generateSRT(mockCaptions);
      expect(srt).toContain('耳机线又缠了？');
      expect(srt).toContain('蓝牙降噪耳机');
    });

    it('should wrap long text', () => {
      const longCaptions: CaptionTrack = {
        ...mockCaptions,
        segments: [
          { id: 'c1', text: '这是一款非常优质的蓝牙降噪耳机产品推荐', startTime: 0, endTime: 5, sceneId: 's1', style: 'default' },
        ],
        maxCharsPerLine: 10,
      };
      const srt = generateSRT(longCaptions);
      expect(srt).toContain('\n');
    });
  });

  describe('generateCaptionsJSON', () => {
    it('should generate valid JSON', () => {
      const json = generateCaptionsJSON(mockCaptions);
      const parsed = JSON.parse(json);
      expect(parsed.segments.length).toBe(3);
      expect(parsed.language).toBe('zh-CN');
    });
  });

  describe('generateASS', () => {
    it('should generate valid ASS header', () => {
      const ass = generateASS(mockCaptions);
      expect(ass).toContain('[Script Info]');
      expect(ass).toContain('[V4+ Styles]');
      expect(ass).toContain('[Events]');
      expect(ass).toContain('ShopMotion Captions');
    });

    it('should include all dialogue events', () => {
      const ass = generateASS(mockCaptions);
      const dialogueCount = (ass.match(/Dialogue:/g) || []).length;
      expect(dialogueCount).toBe(3);
    });

    it('should map styles correctly', () => {
      const ass = generateASS(mockCaptions);
      expect(ass).toContain('Highlight');
      expect(ass).toContain('Keyword');
      expect(ass).toContain('Default');
    });

    it('should use correct ASS time format', () => {
      const ass = generateASS(mockCaptions);
      // ASS format: h:mm:ss.cc
      expect(ass).toMatch(/\d:\d{2}:\d{2}\.\d{2}/);
    });
  });
});
