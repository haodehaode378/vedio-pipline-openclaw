import { describe, it, expect } from 'vitest';
import { TemplateResolver } from '../modules/templates/resolver/index.js';

describe('TemplateResolver', () => {
  const resolver = new TemplateResolver();

  it('should recommend TechClean for 数码科技 category', () => {
    const result = resolver.resolve({ productCategory: '数码科技' });
    expect(result.familyId).toBe('TechClean');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.fallbackUsed).toBe(false);
  });

  it('should recommend SoftBeauty for 美妆护肤 category', () => {
    const result = resolver.resolve({ productCategory: '美妆护肤' });
    expect(result.familyId).toBe('SoftBeauty');
  });

  it('should recommend a matching family for 食品饮料 category', () => {
    const result = resolver.resolve({ productCategory: '食品饮料' });
    // Multiple families match 食品饮料, the one with highest score wins
    expect(result.familyId).toBeTruthy();
    expect(result.confidence).toBe(0.85);
    expect(result.fallbackUsed).toBe(false);
  });

  it('should recommend BabyCare for 母婴用品 category', () => {
    const result = resolver.resolve({ productCategory: '母婴用品' });
    expect(result.familyId).toBe('BabyCare');
  });

  it('should use manual family id when provided', () => {
    const result = resolver.resolve({
      productCategory: '数码科技',
      manualFamilyId: 'BoldPromo',
    });
    expect(result.familyId).toBe('BoldPromo');
    expect(result.reason).toContain('手动指定');
  });

  it('should fall back to WarmLifestyle for unknown category', () => {
    const result = resolver.resolve({ productCategory: '未知类别' });
    expect(result.familyId).toBe('WarmLifestyle');
    expect(result.fallbackUsed).toBe(true);
    expect(result.confidence).toBe(0.3);
  });

  it('should include style matching in scoring', () => {
    const result = resolver.resolve({
      productCategory: '数码科技',
      videoStyle: '科技简洁',
    });
    expect(result.familyId).toBe('TechClean');
    expect(result.reason).toContain('科技简洁');
  });

  it('should include marketing goal in scoring', () => {
    const result = resolver.resolve({
      productCategory: '数码科技',
      marketingGoal: '种草',
    });
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should return valid configId', () => {
    const result = resolver.resolve({ productCategory: '数码科技' });
    expect(result.configId).toBeTruthy();
    expect(result.variantId).toBeTruthy();
  });

  it('should return supported scene types', () => {
    const result = resolver.resolve({ productCategory: '数码科技' });
    expect(result.supportedSceneTypes.length).toBeGreaterThan(0);
  });

  it('should handle all 20 product categories without error', () => {
    const categories = [
      '数码科技', '美妆护肤', '食品饮料', '家居日用', '服饰鞋包',
      '健身运动', '母婴用品', '宠物用品', '学习办公', '个护健康',
      '汽车用品', '节日礼品', '厨房用品', '旅行户外', '家电电器',
      '珠宝配饰', '虚拟课程', '软件工具', '图书文创', '本地生活服务',
    ];
    for (const category of categories) {
      const result = resolver.resolve({ productCategory: category });
      expect(result.familyId).toBeTruthy();
      expect(result.confidence).toBeGreaterThan(0);
    }
  });
});
