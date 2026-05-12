/** 模板家族类型 - 增强版 */
export interface TemplateFamily {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  suitableCategories: string[];
  suitableGoals: string[];
  colorTheme: ColorTheme;
  typography: TypographyScale;
  visualDensity: '极简' | '标准' | '信息强化';
  motionIntensity: '舒缓' | '标准' | '快节奏';
  icon: string;
  /** 推荐适用场景 */
  recommendedScenarios: string[];
  /** 推荐商品类型 */
  recommendedProductTypes: string[];
  /** 推荐视频结构 */
  recommendedVideoStructure: string[];
  /** 推荐 CTA 文案 */
  recommendedCTAs: string[];
  /** 推荐配色说明 */
  colorDescription: string;
  /** 推荐节奏说明 */
  rhythmDescription: string;
  /** 推荐字幕风格 */
  recommendedCaptionStyle: string;
}

/** 模板变体维度 */
export interface TemplateVariant {
  id: string;
  familyId: string;
  duration: number;
  aspectRatio: string;
  goalType: string;
  displayMode: string;
  ctaStyle: string;
  captionStyle: string;
  backgroundStyle: string;
  priceDisplay: string;
}

/** 颜色主题 */
export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  gradient?: string;
}

/** 字体比例 */
export interface TypographyScale {
  titleSize: number;
  subtitleSize: number;
  bodySize: number;
  captionSize: number;
  ctaSize: number;
  titleWeight: number;
  fontFamily: string;
}

/** 模板配置 - 完整版 */
export interface TemplateConfig {
  id: string;
  familyId: string;
  name: string;
  description: string;
  supportedCategories: string[];
  supportedAspectRatios: string[];
  supportedDurations: number[];
  supportedMarketingGoals: string[];
  colorTheme: ColorTheme;
  typographyScale: TypographyScale;
  titleLayout: 'centered' | 'left-aligned' | 'overlaid' | 'bottom';
  captionLayout: 'bottom-bar' | 'card' | 'highlight-keywords' | 'floating';
  productImageLayout: 'full-bg' | 'card' | 'split' | 'overlay';
  sellingPointCardStyle: 'rounded' | 'sharp' | 'glass' | 'minimal';
  ctaStyle: 'button' | 'banner' | 'slide-up' | 'pulse';
  backgroundStyle: 'solid' | 'gradient' | 'card-based' | 'scene-based';
  transitionStyle: 'fade' | 'slide' | 'zoom' | 'dissolve';
  sceneTypeMapping: Record<string, string>;
  visualDensity: '极简' | '标准' | '信息强化';
  motionIntensity: '舒缓' | '标准' | '快节奏';
  recommendedFor: string[];
  fallbackBehavior: 'use-default' | 'skip-scene' | 'simplify';
}

/** 模板推荐结果 */
export interface TemplateRecommendation {
  familyId: string;
  variantId: string;
  configId: string;
  reason: string;
  confidence: number;
  fallbackUsed: boolean;
  supportedSceneTypes: string[];
}

/** TemplateResolver 输入 */
export interface TemplateResolverInput {
  productCategory: string;
  videoStyle?: string;
  marketingGoal?: string;
  aspectRatio?: string;
  duration?: number;
  targetAudience?: string;
  manualFamilyId?: string;
}
