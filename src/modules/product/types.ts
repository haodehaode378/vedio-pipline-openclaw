/** 商品输入信息 - 增强版 */
export interface ProductInput {
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  targetAudience?: string;
  keyFeatures?: string[];
  brand?: string;
  imageUrl?: string;
  marketingGoal?: MarketingGoal;
  videoStyle?: VideoStylePreset;
  preferredDuration?: VideoDuration;
  preferredAspectRatio?: AspectRatio;
}

/** 商品类别枚举 - 20个大类（v1.1 扩展） */
export type ProductCategory =
  | '数码科技'
  | '美妆护肤'
  | '食品饮料'
  | '家居日用'
  | '服饰鞋包'
  | '健身运动'
  | '母婴用品'
  | '宠物用品'
  | '学习办公'
  | '个护健康'
  | '汽车用品'
  | '节日礼品'
  | '厨房用品'
  | '旅行户外'
  | '家电电器'
  | '珠宝配饰'
  | '虚拟课程'
  | '软件工具'
  | '图书文创'
  | '本地生活服务';

/** 商品卖点 - 增强版 */
export interface SellingPoint {
  id: string;
  title: string;
  description: string;
  priority: number;
  category?: '功能' | '品质' | '价格' | '情感' | '场景';
  emphasis?: 'high' | 'medium' | 'low';
}

/** 营销目标 */
export type MarketingGoal =
  | '种草'
  | '促销'
  | '讲解'
  | '品牌'
  | '新品发布'
  | '节日营销';

/** 视频风格预设 */
export type VideoStylePreset =
  | '科技简洁'
  | '科技高端'
  | '生活种草'
  | '美妆柔和'
  | '强促销'
  | '食品清新'
  | '家居温馨'
  | '服饰潮流'
  | '运动活力'
  | '母婴安心'
  | '宠物亲和'
  | '学习办公'
  | '健康个护'
  | '汽车用品'
  | '节日礼赠';

/** 视频时长 */
export type VideoDuration = 15 | 30 | 45;

/** 画幅比 */
export type AspectRatio = '9:16' | '1:1' | '16:9';

/** 商品类别详细配置 - 增强版 */
export interface CategoryConfig {
  id: ProductCategory;
  label: string;
  icon: string;
  description: string;
  recommendedFamilies: string[];
  recommendedStyles: string[];
  recommendedVideoDurations: number[];
  recommendedSellingPointTypes: string[];
  recommendedCTAStyle: string;
  recommendedColorScheme: string;
  recommendedStructure: string;
  avoidFamilies: string[];
  exampleProducts: string[];
  sampleProducts: string[];
  riskNotes: string;
}
