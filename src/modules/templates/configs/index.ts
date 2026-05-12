import type { TemplateConfig } from '../types.js';

/** 为每个模板家族生成基础配置 */
function createBaseConfigs(): TemplateConfig[] {
  const families = [
    { id: 'TechClean', name: '科技简洁风', cats: ['数码科技', '学习办公'], goals: ['讲解', '品牌', '新品发布'] },
    { id: 'TechPremium', name: '科技高端风', cats: ['数码科技'], goals: ['品牌', '新品发布'] },
    { id: 'WarmLifestyle', name: '生活种草风', cats: ['家居日用', '厨房用品', '户外旅行'], goals: ['种草', '新品发布'] },
    { id: 'SoftBeauty', name: '美妆柔和风', cats: ['美妆护肤'], goals: ['种草', '品牌'] },
    { id: 'BoldPromo', name: '强促销风', cats: ['食品饮料', '服饰鞋包', '家居日用'], goals: ['促销', '节日营销'] },
    { id: 'FreshFood', name: '食品清新风', cats: ['食品饮料', '厨房用品'], goals: ['种草', '促销'] },
    { id: 'HomeComfort', name: '家居温馨风', cats: ['家居日用', '厨房用品'], goals: ['种草', '品牌'] },
    { id: 'FashionLook', name: '服饰潮流风', cats: ['服饰鞋包'], goals: ['种草', '品牌'] },
    { id: 'SportEnergy', name: '运动活力风', cats: ['健身运动', '户外旅行'], goals: ['种草', '促销', '新品发布'] },
    { id: 'BabyCare', name: '母婴安心风', cats: ['母婴用品'], goals: ['种草', '品牌'] },
    { id: 'PetFriendly', name: '宠物亲和风', cats: ['宠物用品'], goals: ['种草', '促销'] },
    { id: 'StudyOffice', name: '学习办公风', cats: ['学习办公', '虚拟课程'], goals: ['讲解', '品牌'] },
    { id: 'HealthCare', name: '健康个护风', cats: ['个护健康', '食品饮料'], goals: ['讲解', '品牌', '种草'] },
    { id: 'AutoGear', name: '汽车用品风', cats: ['汽车用品'], goals: ['讲解', '促销'] },
    { id: 'FestivalGift', name: '节日礼赠风', cats: ['节日礼品', '食品饮料', '美妆护肤'], goals: ['节日营销', '促销', '品牌'] },
  ];

  const configs: TemplateConfig[] = [];

  for (const family of families) {
    // 标准配置
    configs.push({
      id: `${family.id}-standard-9:16-30s`,
      familyId: family.id,
      name: `${family.name}·标准竖版30秒`,
      description: `${family.name}的标准9:16竖版30秒配置，适合大多数电商短视频场景。`,
      supportedCategories: family.cats,
      supportedAspectRatios: ['9:16'],
      supportedDurations: [30],
      supportedMarketingGoals: family.goals,
      colorTheme: getFamilyColorTheme(family.id),
      typographyScale: getFamilyTypography(family.id),
      titleLayout: 'centered',
      captionLayout: 'bottom-bar',
      productImageLayout: 'card',
      sellingPointCardStyle: 'rounded',
      ctaStyle: 'button',
      backgroundStyle: 'gradient',
      transitionStyle: 'fade',
      sceneTypeMapping: {
        hook: '开场痛点引入',
        product_reveal: '商品亮相',
        selling_point: '卖点展示',
        scenario: '使用场景',
        comparison: '对比展示',
        proof: '证据可信度',
        price_offer: '价格优惠',
        cta: '行动引导',
      },
      visualDensity: '标准',
      motionIntensity: '标准',
      recommendedFor: family.cats,
      fallbackBehavior: 'use-default',
    });

    // 极简配置
    configs.push({
      id: `${family.id}-minimal-9:16-15s`,
      familyId: family.id,
      name: `${family.name}·极简竖版15秒`,
      description: `${family.name}的极简9:16竖版15秒配置，适合快节奏短视频投放。`,
      supportedCategories: family.cats,
      supportedAspectRatios: ['9:16'],
      supportedDurations: [15],
      supportedMarketingGoals: family.goals,
      colorTheme: getFamilyColorTheme(family.id),
      typographyScale: getFamilyTypography(family.id),
      titleLayout: 'centered',
      captionLayout: 'highlight-keywords',
      productImageLayout: 'full-bg',
      sellingPointCardStyle: 'minimal',
      ctaStyle: 'banner',
      backgroundStyle: 'solid',
      transitionStyle: 'zoom',
      sceneTypeMapping: {
        hook: '快速吸引注意',
        product_reveal: '商品大图',
        selling_point: '核心卖点',
        cta: '立即行动',
      },
      visualDensity: '极简',
      motionIntensity: '快节奏',
      recommendedFor: family.cats,
      fallbackBehavior: 'simplify',
    });

    // 信息强化配置
    configs.push({
      id: `${family.id}-detailed-9:16-45s`,
      familyId: family.id,
      name: `${family.name}·详细竖版45秒`,
      description: `${family.name}的详细9:16竖版45秒配置，适合深度讲解和多卖点展示。`,
      supportedCategories: family.cats,
      supportedAspectRatios: ['9:16'],
      supportedDurations: [45],
      supportedMarketingGoals: family.goals,
      colorTheme: getFamilyColorTheme(family.id),
      typographyScale: getFamilyTypography(family.id),
      titleLayout: 'left-aligned',
      captionLayout: 'card',
      productImageLayout: 'split',
      sellingPointCardStyle: 'glass',
      ctaStyle: 'slide-up',
      backgroundStyle: 'card-based',
      transitionStyle: 'slide',
      sceneTypeMapping: {
        hook: '痛点故事',
        product_reveal: '产品出场',
        selling_point: '卖点详解',
        scenario: '场景演示',
        comparison: '优劣对比',
        proof: '数据/评价',
        price_offer: '价格说明',
        cta: '行动号召',
      },
      visualDensity: '信息强化',
      motionIntensity: '标准',
      recommendedFor: family.cats,
      fallbackBehavior: 'use-default',
    });
  }

  return configs;
}

function getFamilyColorTheme(familyId: string) {
  const themes: Record<string, any> = {
    TechClean: { primary: '#0066FF', secondary: '#E8F0FE', accent: '#00D4AA', background: '#F8FAFB', surface: '#FFFFFF', text: '#1A1A2E', textSecondary: '#6B7280' },
    TechPremium: { primary: '#C9A96E', secondary: '#1A1A2E', accent: '#E8D5B5', background: '#0D0D1A', surface: '#1A1A2E', text: '#F5F5F5', textSecondary: '#A0A0B0' },
    WarmLifestyle: { primary: '#FF8C42', secondary: '#FFF3E8', accent: '#FF6B6B', background: '#FFFAF5', surface: '#FFFFFF', text: '#2D2D2D', textSecondary: '#888888' },
    SoftBeauty: { primary: '#E8739E', secondary: '#FFF0F5', accent: '#FFB6C1', background: '#FFF8FB', surface: '#FFFFFF', text: '#4A3040', textSecondary: '#B08090' },
    BoldPromo: { primary: '#FF2D2D', secondary: '#FFEBE8', accent: '#FFD700', background: '#FFF5F5', surface: '#FFFFFF', text: '#1A1A1A', textSecondary: '#666666' },
    FreshFood: { primary: '#4CAF50', secondary: '#E8F5E9', accent: '#FF9800', background: '#FAFFF8', surface: '#FFFFFF', text: '#2E3A2E', textSecondary: '#7A8A7A' },
    HomeComfort: { primary: '#B8860B', secondary: '#FFF8E7', accent: '#D4A574', background: '#FFFCF5', surface: '#FFFFFF', text: '#3E3228', textSecondary: '#9A8A7A' },
    FashionLook: { primary: '#1A1A1A', secondary: '#F5F5F5', accent: '#FF4081', background: '#FAFAFA', surface: '#FFFFFF', text: '#1A1A1A', textSecondary: '#888888' },
    SportEnergy: { primary: '#FF5722', secondary: '#FFF3E0', accent: '#00E5FF', background: '#FFFBF5', surface: '#FFFFFF', text: '#1A1A1A', textSecondary: '#666666' },
    BabyCare: { primary: '#7E57C2', secondary: '#F3E5F5', accent: '#FF8A80', background: '#FFFBFE', surface: '#FFFFFF', text: '#3E2A4A', textSecondary: '#9A80A0' },
    PetFriendly: { primary: '#FF7043', secondary: '#FFF3E0', accent: '#66BB6A', background: '#FFFBF5', surface: '#FFFFFF', text: '#3E2723', textSecondary: '#8D6E63' },
    StudyOffice: { primary: '#1976D2', secondary: '#E3F2FD', accent: '#00BCD4', background: '#F8FBFF', surface: '#FFFFFF', text: '#1A2A3A', textSecondary: '#607D8B' },
    HealthCare: { primary: '#00897B', secondary: '#E0F2F1', accent: '#26A69A', background: '#F5FFFE', surface: '#FFFFFF', text: '#1A2E2A', textSecondary: '#607D7A' },
    AutoGear: { primary: '#F44336', secondary: '#FFEBEE', accent: '#B0BEC5', background: '#1A1A1A', surface: '#2D2D2D', text: '#F5F5F5', textSecondary: '#9E9E9E' },
    FestivalGift: { primary: '#D32F2F', secondary: '#FFF8E1', accent: '#FFD700', background: '#FFFBF5', surface: '#FFFFFF', text: '#3E1A1A', textSecondary: '#8A6060' },
  };
  return themes[familyId] || themes.TechClean;
}

function getFamilyTypography(familyId: string) {
  const base = { titleSize: 56, subtitleSize: 32, bodySize: 24, captionSize: 18, ctaSize: 28, titleWeight: 700, fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif' };
  const overrides: Record<string, any> = {
    TechPremium: { ...base, titleSize: 58, titleWeight: 600, fontFamily: '"Noto Serif SC", "SimSun", serif' },
    SoftBeauty: { ...base, titleSize: 52, titleWeight: 600, fontFamily: '"Noto Serif SC", "SimSun", serif' },
    HomeComfort: { ...base, titleSize: 52, titleWeight: 600, fontFamily: '"Noto Serif SC", "SimSun", serif' },
    FashionLook: { ...base, titleSize: 64, titleWeight: 800 },
    BoldPromo: { ...base, titleSize: 64, titleWeight: 800 },
    SportEnergy: { ...base, titleSize: 64, titleWeight: 800 },
    AutoGear: { ...base, titleSize: 64, titleWeight: 800 },
    FestivalGift: { ...base, titleSize: 52, titleWeight: 600, fontFamily: '"Noto Serif SC", "SimSun", serif' },
  };
  return overrides[familyId] || base;
}

export const allTemplateConfigs: TemplateConfig[] = createBaseConfigs();

export function getConfigsByFamily(familyId: string): TemplateConfig[] {
  return allTemplateConfigs.filter((c) => c.familyId === familyId);
}

export function getConfigById(id: string): TemplateConfig | undefined {
  return allTemplateConfigs.find((c) => c.id === id);
}
