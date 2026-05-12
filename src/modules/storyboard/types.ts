/** 分镜脚本 - v1.1 增强版 */
export interface Storyboard {
  id: string;
  videoMeta: {
    title: string;
    aspectRatio: string;
    duration: number;
    style: string;
    language: string;
    marketingGoal: string;
  };
  product: {
    name: string;
    description: string;
    category: string;
    targetAudience?: string;
    price: number;
    originalPrice?: number;
    sellingPoints: import('../product/types.js').SellingPoint[];
    imageUrl?: string;
  };
  scenes: Scene[];
  captions: CaptionTrack;
  voiceover: VoiceoverTimeline;
  renderConfig: RenderConfig;
  template: {
    familyId: string;
    variantId: string;
    configId: string;
  };
}

/** 场景类型 - 增强版（8种场景类型） */
export type SceneType =
  | 'hook'
  | 'product_reveal'
  | 'selling_point'
  | 'scenario'
  | 'comparison'
  | 'proof'
  | 'price_offer'
  | 'cta';

/** 单个场景 - 增强版 */
export interface Scene {
  id: string;
  type: SceneType;
  title: string;
  narration: string;
  caption: string;
  visualPrompt: string;
  durationInSeconds: number;
  layout: 'centered' | 'split' | 'full-bleed' | 'card-grid';
  sellingPointIds: string[];
  transition: 'fade' | 'slide' | 'zoom' | 'dissolve';
  cta?: string;
  /** 场景意图说明 */
  sceneIntent: string;
  /** 布局提示 */
  layoutHint: string;
  /** 模板插槽映射 */
  templateSlot: string;
}

/** 字幕片段 - 增强版 */
export interface CaptionSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  sceneId: string;
  style: 'default' | 'highlight' | 'keyword';
  /** 断句位置标记 */
  breakPoints?: number[];
}

/** 字幕轨道 - 增强版 */
export interface CaptionTrack {
  segments: CaptionSegment[];
  language: string;
  style: 'bottom-bar' | 'card' | 'highlight-keywords' | 'floating';
  /** 字幕密度建议 */
  density: 'sparse' | 'normal' | 'dense';
  /** 最大字符数/行 */
  maxCharsPerLine: number;
}

/** 旁白段落 - 增强版 */
export interface VoiceoverSegment {
  id: string;
  text: string;
  startTime: number;
  duration: number;
  sceneId: string;
  /** 语速标记 */
  pace?: 'slow' | 'normal' | 'fast';
  /** 情感标记 */
  emotion?: 'neutral' | 'excited' | 'warm' | 'urgent';
}

/** 旁白时间轴 - 增强版 */
export interface VoiceoverTimeline {
  segments: VoiceoverSegment[];
  totalDuration: number;
  mockAudioUrl?: string;
  /** 整体语速 */
  overallPace: 'slow' | 'normal' | 'fast';
}

/** 渲染配置 */
export interface RenderConfig {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  outputPath: string;
  quality: 'low' | 'medium' | 'high';
  format: 'mp4' | 'webm';
}

/** 场景类型映射 */
export type SceneTypeMapping = Record<SceneType, string>;

/** 场景类型元数据 */
export interface SceneTypeMeta {
  type: SceneType;
  name: string;
  description: string;
  typicalDuration: [number, number]; // [min, max] seconds
  intent: string;
  layoutHints: string[];
  templateSlot: string;
}

/** 8种场景类型的元数据定义 */
export const sceneTypeMetas: SceneTypeMeta[] = [
  {
    type: 'hook',
    name: '开场痛点引入',
    description: '视频开场，用痛点或疑问吸引观众注意力',
    typicalDuration: [2, 5],
    intent: '抓住注意力，引发共鸣',
    layoutHints: ['centered', 'full-bleed'],
    templateSlot: 'scene-hook',
  },
  {
    type: 'product_reveal',
    name: '商品亮相',
    description: '展示商品外观和核心信息',
    typicalDuration: [3, 6],
    intent: '展示商品，建立第一印象',
    layoutHints: ['centered', 'full-bleed'],
    templateSlot: 'scene-product-reveal',
  },
  {
    type: 'selling_point',
    name: '卖点展示',
    description: '展示商品核心卖点和优势',
    typicalDuration: [3, 8],
    intent: '传达核心价值，说服用户',
    layoutHints: ['card-grid', 'split'],
    templateSlot: 'scene-selling-point',
  },
  {
    type: 'scenario',
    name: '使用场景',
    description: '展示商品在真实场景中的使用效果',
    typicalDuration: [3, 8],
    intent: '让用户想象自己使用商品的场景',
    layoutHints: ['full-bleed', 'split'],
    templateSlot: 'scene-scenario',
  },
  {
    type: 'comparison',
    name: '对比展示',
    description: '与竞品或使用前后进行对比',
    typicalDuration: [3, 6],
    intent: '突出优势，形成差异化',
    layoutHints: ['split', 'card-grid'],
    templateSlot: 'scene-comparison',
  },
  {
    type: 'proof',
    name: '证据可信度',
    description: '展示用户评价、数据、资质等信任背书',
    typicalDuration: [2, 5],
    intent: '建立信任，消除疑虑',
    layoutHints: ['card-grid', 'centered'],
    templateSlot: 'scene-proof',
  },
  {
    type: 'price_offer',
    name: '价格优惠',
    description: '展示价格信息和优惠活动',
    typicalDuration: [2, 4],
    intent: '传达价格优势，营造紧迫感',
    layoutHints: ['centered', 'full-bleed'],
    templateSlot: 'scene-price-offer',
  },
  {
    type: 'cta',
    name: '行动引导',
    description: '引导用户采取行动（点击、购买等）',
    typicalDuration: [2, 4],
    intent: '促成转化，引导行动',
    layoutHints: ['centered'],
    templateSlot: 'scene-cta',
  },
];

/** 获取场景类型元数据 */
export function getSceneTypeMeta(type: SceneType): SceneTypeMeta | undefined {
  return sceneTypeMetas.find((m) => m.type === type);
}
