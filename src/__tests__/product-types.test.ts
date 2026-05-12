import { describe, it, expect } from 'vitest';
import type { ProductInput, ProductCategory, SellingPoint, MarketingGoal, VideoStylePreset } from '../modules/product/types.js';

describe('Product Types', () => {
  it('should accept valid ProductInput', () => {
    const product: ProductInput = {
      name: '测试商品',
      category: '数码科技',
      price: 299,
      description: '测试描述',
    };
    expect(product.name).toBe('测试商品');
    expect(product.category).toBe('数码科技');
  });

  it('should accept all 20 product categories', () => {
    const categories: ProductCategory[] = [
      '数码科技', '美妆护肤', '食品饮料', '家居日用', '服饰鞋包',
      '健身运动', '母婴用品', '宠物用品', '学习办公', '个护健康',
      '汽车用品', '节日礼品', '厨房用品', '旅行户外', '家电电器',
      '珠宝配饰', '虚拟课程', '软件工具', '图书文创', '本地生活服务',
    ];
    expect(categories.length).toBe(20);
  });

  it('should accept all marketing goals', () => {
    const goals: MarketingGoal[] = ['种草', '促销', '讲解', '品牌', '新品发布', '节日营销'];
    expect(goals.length).toBe(6);
  });

  it('should accept all video style presets', () => {
    const styles: VideoStylePreset[] = [
      '科技简洁', '科技高端', '生活种草', '美妆柔和', '强促销',
      '食品清新', '家居温馨', '服饰潮流', '运动活力', '母婴安心',
      '宠物亲和', '学习办公', '健康个护', '汽车用品', '节日礼赠',
    ];
    expect(styles.length).toBe(15);
  });

  it('should accept valid SellingPoint', () => {
    const sp: SellingPoint = {
      id: 'sp-1',
      title: '降噪',
      description: '主动降噪功能',
      priority: 1,
      category: '功能',
      emphasis: 'high',
    };
    expect(sp.emphasis).toBe('high');
  });

  it('should accept optional fields in ProductInput', () => {
    const full: ProductInput = {
      name: '完整商品',
      category: '数码科技',
      price: 199,
      originalPrice: 299,
      description: '完整描述',
      targetAudience: '年轻人',
      keyFeatures: ['功能1', '功能2'],
      brand: '品牌',
      imageUrl: 'https://example.com/image.jpg',
      marketingGoal: '种草',
      videoStyle: '科技简洁',
      preferredDuration: 30,
      preferredAspectRatio: '9:16',
    };
    expect(full.originalPrice).toBe(299);
    expect(full.preferredDuration).toBe(30);
  });
});
