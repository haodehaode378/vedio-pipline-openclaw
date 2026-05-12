// ShopMotion - Core Type Definitions

/** 商品输入信息 */
export interface ProductInput {
  name: string;
  category: string;
  price: number;
  description: string;
  targetAudience?: string;
  keyFeatures?: string[];
}

/** 商品卖点 */
export interface SellingPoint {
  id: string;
  title: string;
  description: string;
  priority: number;
}

/** 视频风格配置 */
export interface VideoStyle {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
}

/** 字幕条目 */
export interface CaptionEntry {
  text: string;
  startFrame: number;
  endFrame: number;
}

/** 旁白段落 */
export interface VoiceoverSegment {
  text: string;
  startFrame: number;
  durationInFrames: number;
}

/** 画面元素类型 */
export type SceneElementType = 'text' | 'sellingPoint' | 'cta' | 'image';

/** 画面元素 */
export interface SceneElement {
  type: SceneElementType;
  content?: string;
  sellingPointId?: string;
  text?: string;
  position?: 'center' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/** 场景类型 */
export type SceneType = 'hook' | 'feature' | 'demo' | 'social-proof' | 'cta';

/** 单个场景/分镜 */
export interface Scene {
  id: string;
  type: SceneType;
  durationInFrames: number;
  title: string;
  subtitle?: string;
  elements: SceneElement[];
  voiceover?: VoiceoverSegment;
  captions: CaptionEntry[];
}

/** 完整分镜脚本 */
export interface Storyboard {
  id: string;
  product: {
    name: string;
    category: string;
    price: number;
  };
  sellingPoints: SellingPoint[];
  scenes: Scene[];
  style: VideoStyle;
  totalDurationInFrames: number;
  fps: number;
}

/** 生成任务状态 */
export type GenerationStatus =
  | 'pending'
  | 'analyzing'
  | 'generating-selling-points'
  | 'generating-storyboard'
  | 'completed'
  | 'failed';

/** 生成任务 */
export interface GenerationJob {
  id: string;
  productInput: ProductInput;
  status: GenerationStatus;
  storyboard?: Storyboard;
  sellingPoints?: SellingPoint[];
  createdAt: string;
  updatedAt: string;
  error?: string;
}

/** 飞书通知 Payload */
export interface NotificationPayload {
  title: string;
  content: string;
  status: 'info' | 'success' | 'error';
  jobId?: string;
  timestamp: string;
}

/** LLM Provider 接口 */
export interface LLMProvider {
  generateSellingPoints(input: ProductInput): Promise<SellingPoint[]>;
  generateStoryboard(input: ProductInput, sellingPoints: SellingPoint[]): Promise<Storyboard>;
}

/** TTS Provider 接口 */
export interface TTSProvider {
  generateVoiceover(text: string): Promise<{ audioUrl: string; durationInFrames: number }>;
}

/** 飞书通知接口 */
export interface FeishuNotifier {
  send(payload: NotificationPayload): Promise<boolean>;
}
