import type { VoiceoverTimeline, VoiceoverSegment } from '../storyboard/types.js';

/** Mock TTS Provider - v1.1 增强版 */
export class MockTTSProvider {
  async generateVoiceover(text: string): Promise<{ audioUrl: string; durationInFrames: number }> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const estimatedFrames = Math.max(30, Math.ceil(text.length / 3) * 30);
    return {
      audioUrl: `mock://tts/${encodeURIComponent(text.slice(0, 20))}.mp3`,
      durationInFrames: estimatedFrames,
    };
  }

  /** 为整个 Storyboard 生成旁白时间轴 */
  async generateTimeline(segments: Array<{
    text: string; startTime: number; duration: number; sceneId: string;
    pace?: 'slow' | 'normal' | 'fast';
    emotion?: 'neutral' | 'excited' | 'warm' | 'urgent';
  }>): Promise<VoiceoverTimeline> {
    const voSegments: VoiceoverSegment[] = segments.map((s, i) => ({
      id: `vo-${Date.now()}-${i}`,
      text: s.text,
      startTime: s.startTime,
      duration: s.duration,
      sceneId: s.sceneId,
      pace: s.pace || 'normal',
      emotion: s.emotion || 'neutral',
    }));

    const totalDuration = segments.reduce((max, s) => Math.max(max, s.startTime + s.duration), 0);

    return {
      segments: voSegments,
      totalDuration,
      mockAudioUrl: 'mock://tts/storyboard-full.mp3',
      overallPace: 'normal',
    };
  }

  /** 生成旁白文本列表（用于 TTS 合成） */
  generateVoiceoverTexts(timeline: VoiceoverTimeline): Array<{
    index: number;
    text: string;
    startTime: number;
    duration: number;
    pace: string;
    emotion: string;
  }> {
    return timeline.segments.map((seg, i) => ({
      index: i,
      text: seg.text,
      startTime: seg.startTime,
      duration: seg.duration,
      pace: seg.pace || 'normal',
      emotion: seg.emotion || 'neutral',
    }));
  }

  /** 估算旁白总时长 */
  estimateTotalDuration(segments: Array<{ text: string; pace?: string }>): number {
    return segments.reduce((total, seg) => {
      // 中文语速估算：正常约 4 字/秒，慢速约 3 字/秒，快速约 5 字/秒
      const charsPerSecond = seg.pace === 'slow' ? 3 : seg.pace === 'fast' ? 5 : 4;
      const duration = Math.max(1, seg.text.length / charsPerSecond);
      return total + duration;
    }, 0);
  }
}

export const mockTTS = new MockTTSProvider();
