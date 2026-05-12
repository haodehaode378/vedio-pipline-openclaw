import type { TemplateRecommendation, TemplateResolverInput } from '../types.js';
import { registry } from '../registry/index.js';

/** 模板解析器 - 根据商品信息推荐最佳模板 */
export class TemplateResolver {
  /**
   * 解析推荐模板
   */
  resolve(input: TemplateResolverInput): TemplateRecommendation {
    // 如果手动指定了模板家族，优先使用
    if (input.manualFamilyId) {
      const family = registry.getFamily(input.manualFamilyId);
      if (family) {
        return this.buildRecommendation(family.id, input, '手动指定模板家族', false);
      }
    }

    // 自动推荐逻辑
    return this.autoRecommend(input);
  }

  private autoRecommend(input: TemplateResolverInput): TemplateRecommendation {
    const families = registry.getAllFamilies();
    const scores: Array<{ id: string; score: number; reason: string }> = [];

    for (const family of families) {
      let score = 0;
      const reasons: string[] = [];

      // 类别匹配（权重最高）
      if (family.suitableCategories.includes(input.productCategory)) {
        score += 50;
        reasons.push(`适配「${input.productCategory}」类别`);
      }

      // 营销目标匹配
      if (input.marketingGoal && family.suitableGoals.includes(input.marketingGoal)) {
        score += 30;
        reasons.push(`适配「${input.marketingGoal}」营销目标`);
      }

      // 风格匹配
      if (input.videoStyle) {
        const styleFamilyMap: Record<string, string[]> = {
          '科技简洁': ['TechClean'],
          '科技高端': ['TechPremium'],
          '生活种草': ['WarmLifestyle'],
          '美妆柔和': ['SoftBeauty'],
          '强促销': ['BoldPromo'],
          '食品清新': ['FreshFood'],
          '家居温馨': ['HomeComfort'],
          '服饰潮流': ['FashionLook'],
          '运动活力': ['SportEnergy'],
          '母婴安心': ['BabyCare'],
          '宠物亲和': ['PetFriendly'],
          '学习办公': ['StudyOffice'],
          '健康个护': ['HealthCare'],
          '汽车用品': ['AutoGear'],
          '节日礼赠': ['FestivalGift'],
        };
        const matchingFamilies = styleFamilyMap[input.videoStyle] || [];
        if (matchingFamilies.includes(family.id)) {
          score += 20;
          reasons.push(`风格匹配「${input.videoStyle}」`);
        }
      }

      scores.push({ id: family.id, score, reason: reasons.join('；') || '默认推荐' });
    }

    // 按分数排序
    scores.sort((a, b) => b.score - a.score);
    const best = scores[0];

    // 如果最高分是 0，使用默认推荐
    if (best.score === 0) {
      return this.buildRecommendation('WarmLifestyle', input, '未找到精确匹配，使用通用生活种草风格作为默认', true);
    }

    return this.buildRecommendation(best.id, input, best.reason, false);
  }

  private buildRecommendation(
    familyId: string,
    input: TemplateResolverInput,
    reason: string,
    fallbackUsed: boolean,
  ): TemplateRecommendation {
    const configs = registry.getConfigsByFamily(familyId);

    // 根据时长选择配置
    let selectedConfig = configs.find((c) => {
      const durationMatch = input.duration ? c.supportedDurations.includes(input.duration) : true;
      const ratioMatch = input.aspectRatio ? c.supportedAspectRatios.includes(input.aspectRatio) : true;
      return durationMatch && ratioMatch;
    });

    // 回退到标准配置
    if (!selectedConfig) {
      selectedConfig = configs.find((c) => c.id.includes('standard')) || configs[0];
    }

    const variantId = selectedConfig?.id || `${familyId}-standard-9:16-30s`;

    return {
      familyId,
      variantId,
      configId: selectedConfig?.id || variantId,
      reason,
      confidence: fallbackUsed ? 0.3 : 0.85,
      fallbackUsed,
      supportedSceneTypes: Object.keys(selectedConfig?.sceneTypeMapping || {
        hook: '', product_reveal: '', selling_point: '', cta: '',
      }),
    };
  }
}

/** 全局单例 */
export const resolver = new TemplateResolver();
