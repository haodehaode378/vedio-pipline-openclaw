import { describe, it, expect } from 'vitest';
import { EnhancedMockLLMProvider } from '../modules/generation/enhanced-llm.js';
import type { ProductInput } from '../modules/product/types.js';
import type { TemplateRecommendation } from '../modules/templates/types.js';

const mockProduct: ProductInput = {
  name: '蓝牙耳机',
  category: '数码科技',
  price: 299,
  originalPrice: 499,
  description: '高品质蓝牙降噪耳机，30小时续航',
  targetAudience: '科技爱好者',
  keyFeatures: ['主动降噪', '30小时续航', 'IPX5防水'],
  marketingGoal: '种草',
  videoStyle: '科技简洁',
};

const mockTemplateRec: TemplateRecommendation = {
  familyId: 'TechClean',
  variantId: 'TechClean-standard-9:16-30s',
  configId: 'TechClean-standard-9:16-30s',
  reason: '适配数码科技类别',
  confidence: 0.85,
  fallbackUsed: false,
  supportedSceneTypes: ['hook', 'product_reveal', 'selling_point', 'cta'],
};

describe('EnhancedMockLLMProvider', () => {
  const llm = new EnhancedMockLLMProvider();

  describe('generateSellingPoints', () => {
    it('should generate selling points from keyFeatures', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      expect(sps.length).toBe(3);
      expect(sps[0].title).toBe('主动降噪');
      expect(sps[0].emphasis).toBe('high');
      expect(sps[1].emphasis).toBe('high');
      expect(sps[2].emphasis).toBe('medium');
    });

    it('should assign priorities sequentially', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      sps.forEach((sp, i) => {
        expect(sp.priority).toBe(i + 1);
      });
    });

    it('should assign categories to selling points', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const validCategories = ['功能', '品质', '价格', '情感', '场景'];
      sps.forEach((sp) => {
        expect(validCategories).toContain(sp.category);
      });
    });

    it('should generate fallback selling points when no keyFeatures', async () => {
      const input: ProductInput = { ...mockProduct, keyFeatures: undefined };
      const sps = await llm.generateSellingPoints(input);
      expect(sps.length).toBe(4);
      expect(sps[0].title).toBe('数码科技核心功能');
    });

    it('should limit to 4 selling points max', async () => {
      const input: ProductInput = {
        ...mockProduct,
        keyFeatures: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'],
      };
      const sps = await llm.generateSellingPoints(input);
      expect(sps.length).toBe(4);
    });
  });

  describe('generateStoryboard', () => {
    it('should generate a complete storyboard', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const sb = await llm.generateStoryboard(mockProduct, sps, mockTemplateRec);

      expect(sb.id).toBeDefined();
      expect(sb.videoMeta.title).toBe('蓝牙耳机 短视频');
      expect(sb.videoMeta.aspectRatio).toBe('9:16');
      expect(sb.videoMeta.duration).toBe(30);
      expect(sb.product.name).toBe('蓝牙耳机');
      expect(sb.scenes.length).toBeGreaterThan(0);
      expect(sb.captions.segments.length).toBeGreaterThan(0);
      expect(sb.voiceover.segments.length).toBeGreaterThan(0);
      expect(sb.template.familyId).toBe('TechClean');
    });

    it('should start with a hook scene', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const sb = await llm.generateStoryboard(mockProduct, sps, mockTemplateRec);
      expect(sb.scenes[0].type).toBe('hook');
    });

    it('should end with a CTA scene', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const sb = await llm.generateStoryboard(mockProduct, sps, mockTemplateRec);
      const lastScene = sb.scenes[sb.scenes.length - 1];
      expect(lastScene.type).toBe('cta');
      expect(lastScene.cta).toBeDefined();
    });

    it('should generate 6 scenes for 30s video', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const sb = await llm.generateStoryboard(mockProduct, sps, mockTemplateRec);
      expect(sb.scenes.length).toBe(6);
    });

    it('should generate scenes for 15s video', async () => {
      const input: ProductInput = { ...mockProduct, preferredDuration: 15 };
      const sps = await llm.generateSellingPoints(input);
      const sb = await llm.generateStoryboard(input, sps, mockTemplateRec);
      expect(sb.scenes.length).toBeGreaterThan(0);
      expect(sb.scenes[0].type).toBe('hook');
      expect(sb.scenes[sb.scenes.length - 1].type).toBe('cta');
    });

    it('should generate price_offer scene for generic categories with discount', async () => {
      // Use a generic category that falls through to the default logic (which includes price_offer)
      const input: ProductInput = { ...mockProduct, category: '服饰鞋包' as any };
      const sps = await llm.generateSellingPoints(input);
      const sb = await llm.generateStoryboard(input, sps, mockTemplateRec);
      const priceScene = sb.scenes.find((s) => s.type === 'price_offer');
      expect(priceScene).toBeDefined();
    });

    it('should have sceneIntent, layoutHint, templateSlot on all scenes', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const sb = await llm.generateStoryboard(mockProduct, sps, mockTemplateRec);
      for (const scene of sb.scenes) {
        expect(scene.sceneIntent).toBeTruthy();
        expect(scene.layoutHint).toBeTruthy();
        expect(scene.templateSlot).toBeTruthy();
      }
    });

    it('should generate caption segments for all scenes', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const sb = await llm.generateStoryboard(mockProduct, sps, mockTemplateRec);
      expect(sb.captions.segments.length).toBe(sb.scenes.length);
      for (const seg of sb.captions.segments) {
        expect(seg.style).toBeDefined();
        expect(seg.startTime).toBeGreaterThanOrEqual(0);
        expect(seg.endTime).toBeGreaterThan(seg.startTime);
      }
    });

    it('should generate voiceover with pace and emotion markers', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const sb = await llm.generateStoryboard(mockProduct, sps, mockTemplateRec);
      expect(sb.voiceover.overallPace).toBe('normal');
      for (const seg of sb.voiceover.segments) {
        expect(['slow', 'normal', 'fast']).toContain(seg.pace);
        expect(['neutral', 'excited', 'warm', 'urgent']).toContain(seg.emotion);
      }
    });

    it('should use fast/urgent pace for CTA scene', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const sb = await llm.generateStoryboard(mockProduct, sps, mockTemplateRec);
      const ctaIdx = sb.scenes.findIndex((s) => s.type === 'cta');
      expect(sb.voiceover.segments[ctaIdx].pace).toBe('fast');
      expect(sb.voiceover.segments[ctaIdx].emotion).toBe('urgent');
    });
  });

  describe('category differentiation', () => {
    it('should generate different hooks for different categories', async () => {
      const categories = ['数码科技', '美妆护肤', '食品饮料', '母婴用品'];
      const hooks: string[] = [];
      for (const cat of categories) {
        const input: ProductInput = { ...mockProduct, category: cat as any };
        const sps = await llm.generateSellingPoints(input);
        const sb = await llm.generateStoryboard(input, sps, mockTemplateRec);
        hooks.push(sb.scenes[0].title);
      }
      // All hooks should be different
      const uniqueHooks = new Set(hooks);
      expect(uniqueHooks.size).toBe(categories.length);
    });

    it('should generate comparison scene for 数码科技', async () => {
      const sps = await llm.generateSellingPoints(mockProduct);
      const sb = await llm.generateStoryboard(mockProduct, sps, mockTemplateRec);
      expect(sb.scenes.some((s) => s.type === 'comparison')).toBe(true);
    });

    it('should generate scenario scene for 美妆护肤', async () => {
      const input: ProductInput = { ...mockProduct, category: '美妆护肤' as any };
      const sps = await llm.generateSellingPoints(input);
      const sb = await llm.generateStoryboard(input, sps, mockTemplateRec);
      expect(sb.scenes.some((s) => s.type === 'scenario')).toBe(true);
    });

    it('should generate proof scene for 家居日用', async () => {
      const input: ProductInput = { ...mockProduct, category: '家居日用' as any };
      const sps = await llm.generateSellingPoints(input);
      const sb = await llm.generateStoryboard(input, sps, mockTemplateRec);
      expect(sb.scenes.some((s) => s.type === 'proof')).toBe(true);
    });
  });
});
