import { describe, it, expect } from 'vitest';
import { MockLLMProvider } from '../core/mock-llm-provider.js';
import type { ProductInput, SellingPoint, Storyboard } from '../types/index.js';

const sampleInput: ProductInput = {
  name: '超轻便携折叠伞',
  category: '日用百货',
  price: 59.9,
  description: '一款轻便耐用的折叠伞，适合日常通勤和旅行使用',
  targetAudience: '上班族',
  keyFeatures: ['UPF50+防晒', '重量仅200g', '一键开合'],
};

describe('MockLLMProvider', () => {
  const provider = new MockLLMProvider();

  describe('generateSellingPoints', () => {
    it('应返回3个卖点', async () => {
      const points = await provider.generateSellingPoints(sampleInput);
      expect(points).toHaveLength(3);
    });

    it('每个卖点应包含 id, title, description, priority', async () => {
      const points = await provider.generateSellingPoints(sampleInput);
      for (const sp of points) {
        expect(sp).toHaveProperty('id');
        expect(sp).toHaveProperty('title');
        expect(sp).toHaveProperty('description');
        expect(sp).toHaveProperty('priority');
        expect(typeof sp.id).toBe('string');
        expect(typeof sp.title).toBe('string');
        expect(typeof sp.description).toBe('string');
        expect(typeof sp.priority).toBe('number');
      }
    });

    it('priority 应从 1 开始递增', async () => {
      const points = await provider.generateSellingPoints(sampleInput);
      expect(points[0].priority).toBe(1);
      expect(points[1].priority).toBe(2);
      expect(points[2].priority).toBe(3);
    });

    it('使用 keyFeatures 时应返回对应的卖点标题', async () => {
      const points = await provider.generateSellingPoints(sampleInput);
      expect(points[0].title).toBe('UPF50+防晒');
      expect(points[1].title).toBe('重量仅200g');
      expect(points[2].title).toBe('一键开合');
    });

    it('无 keyFeatures 时应返回默认卖点', async () => {
      const inputNoFeatures: ProductInput = {
        name: '测试商品',
        category: '数码',
        price: 99,
        description: '测试描述',
      };
      const points = await provider.generateSellingPoints(inputNoFeatures);
      expect(points).toHaveLength(3);
      expect(points[0].title).toBe('数码核心功能');
    });
  });

  describe('generateStoryboard', () => {
    it('应返回完整的 Storyboard 结构', async () => {
      const sellingPoints = await provider.generateSellingPoints(sampleInput);
      const storyboard = await provider.generateStoryboard(sampleInput, sellingPoints);

      expect(storyboard).toHaveProperty('id');
      expect(storyboard).toHaveProperty('product');
      expect(storyboard).toHaveProperty('sellingPoints');
      expect(storyboard).toHaveProperty('scenes');
      expect(storyboard).toHaveProperty('style');
      expect(storyboard).toHaveProperty('totalDurationInFrames');
      expect(storyboard).toHaveProperty('fps');
    });

    it('应包含 hook + feature + cta 场景', async () => {
      const sellingPoints = await provider.generateSellingPoints(sampleInput);
      const storyboard = await provider.generateStoryboard(sampleInput, sellingPoints);

      const sceneTypes = storyboard.scenes.map((s) => s.type);
      expect(sceneTypes[0]).toBe('hook');
      expect(sceneTypes).toContain('cta');
      // hook + 3 features + cta = 5 scenes
      expect(storyboard.scenes).toHaveLength(5);
    });

    it('每个场景应包含必要的字段', async () => {
      const sellingPoints = await provider.generateSellingPoints(sampleInput);
      const storyboard = await provider.generateStoryboard(sampleInput, sellingPoints);

      for (const scene of storyboard.scenes) {
        expect(scene).toHaveProperty('id');
        expect(scene).toHaveProperty('type');
        expect(scene).toHaveProperty('durationInFrames');
        expect(scene).toHaveProperty('title');
        expect(scene).toHaveProperty('elements');
        expect(scene).toHaveProperty('captions');
        expect(typeof scene.durationInFrames).toBe('number');
        expect(scene.durationInFrames).toBeGreaterThan(0);
      }
    });

    it('totalDurationInFrames 应等于所有场景时长之和', async () => {
      const sellingPoints = await provider.generateSellingPoints(sampleInput);
      const storyboard = await provider.generateStoryboard(sampleInput, sellingPoints);

      const totalFromScenes = storyboard.scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
      expect(storyboard.totalDurationInFrames).toBe(totalFromScenes);
    });

    it('product 信息应与输入一致', async () => {
      const sellingPoints = await provider.generateSellingPoints(sampleInput);
      const storyboard = await provider.generateStoryboard(sampleInput, sellingPoints);

      expect(storyboard.product.name).toBe(sampleInput.name);
      expect(storyboard.product.category).toBe(sampleInput.category);
      expect(storyboard.product.price).toBe(sampleInput.price);
    });

    it('style 应包含必要配置', async () => {
      const sellingPoints = await provider.generateSellingPoints(sampleInput);
      const storyboard = await provider.generateStoryboard(sampleInput, sellingPoints);

      expect(storyboard.style).toHaveProperty('primaryColor');
      expect(storyboard.style).toHaveProperty('secondaryColor');
      expect(storyboard.style).toHaveProperty('fontFamily');
      expect(storyboard.style).toHaveProperty('aspectRatio');
      expect(storyboard.style.aspectRatio).toBe('9:16');
    });
  });
});
