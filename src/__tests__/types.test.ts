import { describe, it, expect } from 'vitest';
import type {
  ProductInput,
  SellingPoint,
  Storyboard,
  Scene,
  SceneElement,
  VideoStyle,
  GenerationJob,
  GenerationStatus,
  CaptionEntry,
  VoiceoverSegment,
} from '../types/index.js';

describe('类型兼容性验证', () => {
  describe('ProductInput', () => {
    it('应接受最少必填字段', () => {
      const input: ProductInput = {
        name: '测试商品',
        category: '数码',
        price: 99.9,
        description: '描述',
      };
      expect(input.name).toBe('测试商品');
      expect(input.category).toBe('数码');
      expect(input.price).toBe(99.9);
    });

    it('应接受可选字段', () => {
      const input: ProductInput = {
        name: '测试商品',
        category: '数码',
        price: 99.9,
        description: '描述',
        targetAudience: '年轻人',
        keyFeatures: ['卖点1', '卖点2'],
      };
      expect(input.targetAudience).toBe('年轻人');
      expect(input.keyFeatures).toHaveLength(2);
    });
  });

  describe('SellingPoint', () => {
    it('应包含 id, title, description, priority', () => {
      const sp: SellingPoint = {
        id: 'sp-1',
        title: '高品质',
        description: '质量过硬',
        priority: 1,
      };
      expect(sp.id).toBe('sp-1');
      expect(sp.priority).toBe(1);
    });
  });

  describe('Storyboard', () => {
    it('应包含完整的视频脚本结构', () => {
      const storyboard: Storyboard = {
        id: 'sb-1',
        product: { name: '商品', category: '类目', price: 10 },
        sellingPoints: [
          { id: 'sp-1', title: '卖点', description: '描述', priority: 1 },
        ],
        scenes: [
          {
            id: 'scene-1',
            type: 'hook',
            durationInFrames: 90,
            title: '标题',
            elements: [],
            captions: [],
          },
        ],
        style: {
          primaryColor: '#FF4D4F',
          secondaryColor: '#FFF1F0',
          fontFamily: 'sans-serif',
          aspectRatio: '9:16',
        },
        totalDurationInFrames: 90,
        fps: 30,
      };
      expect(storyboard.scenes).toHaveLength(1);
      expect(storyboard.fps).toBe(30);
    });
  });

  describe('Scene', () => {
    it('应支持所有场景类型', () => {
      const types: Array<Scene['type']> = ['hook', 'feature', 'demo', 'social-proof', 'cta'];
      for (const type of types) {
        const scene: Scene = {
          id: `scene-${type}`,
          type,
          durationInFrames: 90,
          title: `${type} scene`,
          elements: [],
          captions: [],
        };
        expect(scene.type).toBe(type);
      }
    });
  });

  describe('GenerationJob', () => {
    it('应包含任务状态', () => {
      const statuses: GenerationStatus[] = [
        'pending',
        'analyzing',
        'generating-selling-points',
        'generating-storyboard',
        'completed',
        'failed',
      ];
      expect(statuses).toHaveLength(6);
    });

    it('应创建基本任务对象', () => {
      const job: GenerationJob = {
        id: 'job-1',
        productInput: {
          name: '商品',
          category: '类目',
          price: 10,
          description: '描述',
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      expect(job.status).toBe('pending');
      expect(job.storyboard).toBeUndefined();
    });
  });
});
