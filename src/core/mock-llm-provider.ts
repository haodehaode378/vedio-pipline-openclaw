// Mock LLM Provider - generates mock selling points and storyboards
import type {
  LLMProvider,
  ProductInput,
  SellingPoint,
  Storyboard,
  Scene,
  CaptionEntry,
  VoiceoverSegment,
} from '../types/index.js';

let idCounter = 0;
function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

export class MockLLMProvider implements LLMProvider {
  async generateSellingPoints(input: ProductInput): Promise<SellingPoint[]> {
    // Simulate LLM delay
    await sleep(500);

    const features = input.keyFeatures?.length
      ? input.keyFeatures
      : [`${input.category}核心功能`, '高性价比', '品质保证'];

    return features.slice(0, 3).map((feature, i) => ({
      id: nextId('sp'),
      title: feature,
      description: `${input.name}的${feature}，满足${input.targetAudience || '广大用户'}需求`,
      priority: i + 1,
    }));
  }

  async generateStoryboard(
    input: ProductInput,
    sellingPoints: SellingPoint[],
  ): Promise<Storyboard> {
    await sleep(800);

    const fps = 30;
    const scenes: Scene[] = [];

    // Scene 1: Hook
    const hookDuration = 90;
    scenes.push({
      id: nextId('scene'),
      type: 'hook',
      durationInFrames: hookDuration,
      title: `${input.name} — 你值得拥有`,
      subtitle: input.description.slice(0, 50),
      elements: [
        { type: 'text', content: input.name, position: 'center' },
        { type: 'cta', text: '往下看 ↓', position: 'bottom' },
      ],
      voiceover: {
        text: `还在犹豫？看看这款${input.name}！`,
        startFrame: 0,
        durationInFrames: hookDuration,
      },
      captions: [
        { text: `还在犹豫？`, startFrame: 5, endFrame: 40 },
        { text: `看看这款${input.name}！`, startFrame: 40, endFrame: hookDuration },
      ],
    });

    // Scene 2-N: Feature scenes for each selling point
    let frameOffset = hookDuration;
    sellingPoints.forEach((sp, i) => {
      const duration = 90;
      const scene: Scene = {
        id: nextId('scene'),
        type: 'feature',
        durationInFrames: duration,
        title: sp.title,
        subtitle: sp.description,
        elements: [
          { type: 'sellingPoint', sellingPointId: sp.id, position: 'center' },
          { type: 'text', content: `卖点 ${i + 1}`, position: 'top' },
        ],
        voiceover: {
          text: sp.description,
          startFrame: frameOffset,
          durationInFrames: duration,
        },
        captions: [
          { text: sp.title, startFrame: frameOffset + 5, endFrame: frameOffset + 45 },
          { text: sp.description.slice(0, 30), startFrame: frameOffset + 45, endFrame: frameOffset + duration },
        ],
      };
      scenes.push(scene);
      frameOffset += duration;
    });

    // Final CTA scene
    const ctaDuration = 90;
    scenes.push({
      id: nextId('scene'),
      type: 'cta',
      durationInFrames: ctaDuration,
      title: '立即抢购',
      subtitle: `¥${input.price}`,
      elements: [
        { type: 'cta', text: '立即购买', position: 'center' },
        { type: 'text', content: `仅售 ¥${input.price}`, position: 'bottom' },
      ],
      voiceover: {
        text: `${input.name}，现在下单仅需${input.price}元！`,
        startFrame: frameOffset,
        durationInFrames: ctaDuration,
      },
      captions: [
        { text: `现在下单仅需 ¥${input.price}`, startFrame: frameOffset + 5, endFrame: frameOffset + ctaDuration },
      ],
    });

    const totalDuration = frameOffset + ctaDuration;

    return {
      id: nextId('sb'),
      product: {
        name: input.name,
        category: input.category,
        price: input.price,
      },
      sellingPoints,
      scenes,
      style: {
        primaryColor: '#FF4D4F',
        secondaryColor: '#FFF1F0',
        fontFamily: 'sans-serif',
        aspectRatio: '9:16',
      },
      totalDurationInFrames: totalDuration,
      fps,
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
