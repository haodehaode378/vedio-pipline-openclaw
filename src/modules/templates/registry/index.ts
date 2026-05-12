import type { TemplateFamily, TemplateConfig } from '../types.js';
import { templateFamilies, getFamilyById } from '../families/index.js';
import { allTemplateConfigs, getConfigsByFamily, getConfigById } from '../configs/index.js';

/** 模板注册表 */
export class TemplateRegistry {
  private families: Map<string, TemplateFamily> = new Map();
  private configs: Map<string, TemplateConfig> = new Map();

  constructor() {
    // 注册所有模板家族
    for (const family of templateFamilies) {
      this.families.set(family.id, family);
    }
    // 注册所有模板配置
    for (const config of allTemplateConfigs) {
      this.configs.set(config.id, config);
    }
  }

  /** 获取所有模板家族 */
  getAllFamilies(): TemplateFamily[] {
    return Array.from(this.families.values());
  }

  /** 按 ID 获取模板家族 */
  getFamily(id: string): TemplateFamily | undefined {
    return this.families.get(id);
  }

  /** 获取所有模板配置 */
  getAllConfigs(): TemplateConfig[] {
    return Array.from(this.configs.values());
  }

  /** 按 ID 获取模板配置 */
  getConfig(id: string): TemplateConfig | undefined {
    return this.configs.get(id);
  }

  /** 按家族获取配置 */
  getConfigsByFamily(familyId: string): TemplateConfig[] {
    return Array.from(this.configs.values()).filter((c) => c.familyId === familyId);
  }

  /** 按商品类别获取适用的模板家族 */
  getFamiliesByCategory(category: string): TemplateFamily[] {
    return Array.from(this.families.values()).filter(
      (f) => f.suitableCategories.includes(category),
    );
  }

  /** 按营销目标获取适用的模板家族 */
  getFamiliesByGoal(goal: string): TemplateFamily[] {
    return Array.from(this.families.values()).filter(
      (f) => f.suitableGoals.includes(goal),
    );
  }

  /** 获取注册的家族数量 */
  get familyCount(): number {
    return this.families.size;
  }

  /** 获取注册的配置数量 */
  get configCount(): number {
    return this.configs.size;
  }

  /** 计算模板组合总数 */
  get totalCombinations(): number {
    let count = 0;
    for (const config of this.configs.values()) {
      count += config.supportedAspectRatios.length * config.supportedDurations.length;
    }
    return count;
  }
}

/** 全局单例 */
export const registry = new TemplateRegistry();
