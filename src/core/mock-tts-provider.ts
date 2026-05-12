// Mock TTS Provider - returns mock audio URLs and duration
import type { TTSProvider } from '../types/index.js';

export class MockTTSProvider implements TTSProvider {
  async generateVoiceover(text: string): Promise<{ audioUrl: string; durationInFrames: number }> {
    // Simulate TTS processing delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Estimate duration: ~3 characters per frame at 30fps (rough Chinese speech rate)
    const estimatedFrames = Math.max(30, Math.ceil(text.length / 3) * 30);

    return {
      audioUrl: `mock://tts/${encodeURIComponent(text.slice(0, 20))}.mp3`,
      durationInFrames: estimatedFrames,
    };
  }
}
