import type { ProductInput, SellingPoint } from '../product/types.js';
import type { Storyboard, Scene, CaptionTrack, VoiceoverTimeline, RenderConfig } from '../storyboard/types.js';
import type { TemplateRecommendation } from '../templates/types.js';
import { resolver } from '../templates/resolver/index.js';

let idCounter = 0;
function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++idCounter}`;
}

/** 增强版 Mock LLM Provider - v1.1 */
export class EnhancedMockLLMProvider {
  async generateSellingPoints(input: ProductInput): Promise<SellingPoint[]> {
    await sleep(300);

    const features = input.keyFeatures?.length
      ? input.keyFeatures
      : [`${input.category}核心功能`, '高性价比', '品质保证', '好评如潮'];

    const categories: Array<'功能' | '品质' | '价格' | '情感' | '场景'> = ['功能', '品质', '价格', '情感', '场景'];

    return features.slice(0, 4).map((feature, i) => ({
      id: nextId('sp'),
      title: feature,
      description: this.generateSellingPointDesc(input, feature, i),
      priority: i + 1,
      category: categories[i % categories.length],
      emphasis: i === 0 ? 'high' : i === 1 ? 'high' : 'medium',
    }));
  }

  async generateStoryboard(
    input: ProductInput,
    sellingPoints: SellingPoint[],
    templateRec: TemplateRecommendation,
  ): Promise<Storyboard> {
    await sleep(500);

    const duration = input.preferredDuration || 30;
    const fps = 30;
    const totalFrames = duration * fps;
    const sceneCount = this.getSceneCount(duration);
    const sceneDurations = this.distributeSceneDurations(totalFrames, sceneCount);

    const scenes: Scene[] = this.buildScenes(input, sellingPoints, sceneDurations, fps);
    const captions = this.buildCaptions(scenes, duration);
    const voiceover = this.buildVoiceover(scenes, fps);

    const renderConfig: RenderConfig = {
      width: 1080,
      height: 1920,
      fps,
      durationInFrames: totalFrames,
      outputPath: `./output/${nextId('video')}.mp4`,
      quality: 'high',
      format: 'mp4',
    };

    return {
      id: nextId('sb'),
      videoMeta: {
        title: `${input.name} 短视频`,
        aspectRatio: input.preferredAspectRatio || '9:16',
        duration,
        style: input.videoStyle || '生活种草',
        language: 'zh-CN',
        marketingGoal: input.marketingGoal || '种草',
      },
      product: {
        name: input.name,
        description: input.description,
        category: input.category,
        targetAudience: input.targetAudience,
        price: input.price,
        originalPrice: input.originalPrice,
        sellingPoints,
        imageUrl: input.imageUrl,
      },
      scenes,
      captions,
      voiceover,
      renderConfig,
      template: {
        familyId: templateRec.familyId,
        variantId: templateRec.variantId,
        configId: templateRec.configId,
      },
    };
  }

  private generateSellingPointDesc(input: ProductInput, feature: string, index: number): string {
    const templates = [
      `${input.name}搭载${feature}，带来前所未有的体验。`,
      `采用${feature}设计，让${input.name}更出色。`,
      `${feature}是${input.name}的核心亮点，深受用户好评。`,
      `${input.name}的${feature}，让每一次使用都充满惊喜。`,
    ];
    return templates[index % templates.length];
  }

  private getSceneCount(duration: number): number {
    if (duration <= 15) return 4;
    if (duration <= 30) return 6;
    return 8;
  }

  private distributeSceneDurations(totalFrames: number, sceneCount: number): number[] {
    const hookRatio = 0.15;
    const ctaRatio = 0.15;
    const hookFrames = Math.round(totalFrames * hookRatio);
    const ctaFrames = Math.round(totalFrames * ctaRatio);
    const middleFrames = totalFrames - hookFrames - ctaFrames;
    const middleCount = sceneCount - 2;
    const middleEach = Math.round(middleFrames / middleCount);

    const durations = [hookFrames];
    for (let i = 0; i < middleCount; i++) {
      durations.push(middleEach);
    }
    durations.push(ctaFrames);

    const sum = durations.reduce((a, b) => a + b, 0);
    if (sum !== totalFrames) {
      durations[durations.length - 1] += totalFrames - sum;
    }

    return durations;
  }

  private buildScenes(
    input: ProductInput,
    sellingPoints: SellingPoint[],
    durations: number[],
    fps: number,
  ): Scene[] {
    const scenes: Scene[] = [];
    const sceneTypes: Array<{
      type: Scene['type']; title: string; narration: string; caption: string;
      sceneIntent: string; layoutHint: string; templateSlot: string;
    }> = [];

    // Scene 1: Hook - 根据类别生成不同开场
    sceneTypes.push({
      type: 'hook',
      title: this.getHookTitle(input),
      narration: this.getHookNarration(input),
      caption: this.getHookCaption(input),
      sceneIntent: '抓住观众注意力，引发共鸣',
      layoutHint: 'centered',
      templateSlot: 'scene-hook',
    });

    // Scene 2: Product Reveal
    sceneTypes.push({
      type: 'product_reveal',
      title: input.name,
      narration: `这就是${input.name}，${input.description.slice(0, 40)}。`,
      caption: input.name,
      sceneIntent: '展示商品外观，建立第一印象',
      layoutHint: 'full-bleed',
      templateSlot: 'scene-product-reveal',
    });

    // Scene 3-N: 根据类别生成不同的中间场景
    const middleScenes = this.getMiddleSceneTypes(input, sellingPoints);
    sceneTypes.push(...middleScenes);

    // Last: CTA
    sceneTypes.push({
      type: 'cta',
      title: this.getCTATitle(input),
      narration: this.getCTANarration(input),
      caption: this.getCTACaption(input),
      sceneIntent: '促成转化，引导用户行动',
      layoutHint: 'centered',
      templateSlot: 'scene-cta',
    });

    for (let i = 0; i < sceneTypes.length; i++) {
      const st = sceneTypes[i];
      const durationInSeconds = durations[i] / fps;
      scenes.push({
        id: nextId('scene'),
        type: st.type,
        title: st.title,
        narration: st.narration,
        caption: st.caption,
        visualPrompt: `${st.type}场景：${input.name} - ${st.title}`,
        durationInSeconds,
        layout: st.layoutHint as Scene['layout'],
        sellingPointIds: st.type === 'selling_point' ? sellingPoints.slice(0, 2).map((sp) => sp.id) : [],
        transition: st.type === 'hook' ? 'zoom' : st.type === 'cta' ? 'fade' : 'slide',
        cta: st.type === 'cta' ? this.getCTAText(input) : undefined,
        sceneIntent: st.sceneIntent,
        layoutHint: st.layoutHint,
        templateSlot: st.templateSlot,
      });
    }

    return scenes;
  }

  /** 根据商品类别生成不同的中间场景类型 */
  private getMiddleSceneTypes(
    input: ProductInput,
    sellingPoints: SellingPoint[],
  ): Array<{
    type: Scene['type']; title: string; narration: string; caption: string;
    sceneIntent: string; layoutHint: string; templateSlot: string;
  }> {
    const scenes: Array<{
      type: Scene['type']; title: string; narration: string; caption: string;
      sceneIntent: string; layoutHint: string; templateSlot: string;
    }> = [];

    const category = input.category;

    // 美妆类：成分讲解 + 使用对比（不能写医疗功效）
    if (category === '美妆护肤' || category === '珠宝配饰') {
      for (const sp of sellingPoints.slice(0, 2)) {
        scenes.push({
          type: 'selling_point',
          title: sp.title,
          narration: sp.description,
          caption: sp.title,
          sceneIntent: '展示产品核心卖点和质感',
          layoutHint: 'card-grid',
          templateSlot: 'scene-selling-point',
        });
      }
      scenes.push({
        type: 'scenario',
        title: '使用效果',
        narration: `使用${input.name}后，让您的日常更加精致。`,
        caption: '精致生活，从现在开始',
        sceneIntent: '展示使用后的效果和生活方式',
        layoutHint: 'full-bleed',
        templateSlot: 'scene-scenario',
      });
      return scenes;
    }

    // 母婴类：安全材质 + 使用场景（不能写绝对安全承诺）
    if (category === '母婴用品') {
      for (const sp of sellingPoints.slice(0, 2)) {
        scenes.push({
          type: 'selling_point',
          title: sp.title,
          narration: sp.description,
          caption: sp.title,
          sceneIntent: '展示产品安全性和品质',
          layoutHint: 'card-grid',
          templateSlot: 'scene-selling-point',
        });
      }
      scenes.push({
        type: 'scenario',
        title: '温馨使用场景',
        narration: `${input.name}，陪伴宝宝健康成长。`,
        caption: '陪伴宝宝每一天',
        sceneIntent: '展示产品在宝宝日常生活中的使用',
        layoutHint: 'full-bleed',
        templateSlot: 'scene-scenario',
      });
      return scenes;
    }

    // 食品类：食欲场景 + 口味卖点（不能写夸大健康效果）
    if (category === '食品饮料') {
      scenes.push({
        type: 'scenario',
        title: '美食场景',
        narration: `${input.name}，让每一餐都充满期待。`,
        caption: '美味从这里开始',
        sceneIntent: '唤起食欲，展示食用场景',
        layoutHint: 'full-bleed',
        templateSlot: 'scene-scenario',
      });
      for (const sp of sellingPoints.slice(0, 2)) {
        scenes.push({
          type: 'selling_point',
          title: sp.title,
          narration: sp.description,
          caption: sp.title,
          sceneIntent: '展示口味和原料优势',
          layoutHint: 'card-grid',
          templateSlot: 'scene-selling-point',
        });
      }
      return scenes;
    }

    // 数码类：参数对比 + 场景演示
    if (category === '数码科技' || category === '软件工具' || category === '家电电器') {
      for (const sp of sellingPoints.slice(0, 2)) {
        scenes.push({
          type: 'selling_point',
          title: sp.title,
          narration: sp.description,
          caption: sp.title,
          sceneIntent: '展示核心参数和技术优势',
          layoutHint: 'split',
          templateSlot: 'scene-selling-point',
        });
      }
      scenes.push({
        type: 'comparison',
        title: '对比优势',
        narration: `相比传统方案，${input.name}带来全面提升。`,
        caption: '全面升级，超越期待',
        sceneIntent: '通过对比突出产品优势',
        layoutHint: 'split',
        templateSlot: 'scene-comparison',
      });
      return scenes;
    }

    // 家居类：使用前后 + 空间感
    if (category === '家居日用' || category === '厨房用品') {
      for (const sp of sellingPoints.slice(0, 1)) {
        scenes.push({
          type: 'selling_point',
          title: sp.title,
          narration: sp.description,
          caption: sp.title,
          sceneIntent: '展示产品功能和设计',
          layoutHint: 'card-grid',
          templateSlot: 'scene-selling-point',
        });
      }
      scenes.push({
        type: 'scenario',
        title: '使用场景',
        narration: `无论何时何地，${input.name}都是${input.targetAudience || '你'}的最佳选择。`,
        caption: '让生活更美好',
        sceneIntent: '展示产品融入生活场景',
        layoutHint: 'full-bleed',
        templateSlot: 'scene-scenario',
      });
      scenes.push({
        type: 'proof',
        title: '用户好评',
        narration: `${input.name}深受用户喜爱，好评如潮。`,
        caption: '万千用户的选择',
        sceneIntent: '通过用户评价建立信任',
        layoutHint: 'card-grid',
        templateSlot: 'scene-proof',
      });
      return scenes;
    }

    // 通用场景逻辑
    for (const sp of sellingPoints.slice(0, 2)) {
      scenes.push({
        type: 'selling_point',
        title: sp.title,
        narration: sp.description,
        caption: sp.title,
        sceneIntent: '展示产品核心卖点',
        layoutHint: 'card-grid',
        templateSlot: 'scene-selling-point',
      });
    }

    scenes.push({
      type: 'scenario',
      title: '使用场景',
      narration: `无论何时何地，${input.name}都是${input.targetAudience || '你'}的最佳选择。`,
      caption: '多种场景随心使用',
      sceneIntent: '展示产品在真实场景中的使用',
      layoutHint: 'full-bleed',
      templateSlot: 'scene-scenario',
    });

    scenes.push({
      type: 'proof',
      title: '品质保证',
      narration: `${input.name}经过严格品质检测，用户好评率超过95%。`,
      caption: '95%好评率',
      sceneIntent: '通过数据和评价建立信任',
      layoutHint: 'card-grid',
      templateSlot: 'scene-proof',
    });

    if (input.originalPrice && input.originalPrice > input.price) {
      const discount = Math.round((1 - input.price / input.originalPrice) * 100);
      scenes.push({
        type: 'price_offer',
        title: `限时${discount}%OFF`,
        narration: `原价${input.originalPrice}元，现在仅需${input.price}元，直降${input.originalPrice - input.price}元！`,
        caption: `¥${input.price} 原价¥${input.originalPrice}`,
        sceneIntent: '传达价格优势，营造紧迫感',
        layoutHint: 'centered',
        templateSlot: 'scene-price-offer',
      });
    }

    return scenes;
  }

  private getHookTitle(input: ProductInput): string {
    const hooks: Record<string, string> = {
      '数码科技': `你还在用老款${input.category}产品？`,
      '美妆护肤': '肌肤问题让你烦恼？',
      '食品饮料': '早餐还在凑合吃？',
      '家居日用': '家里总是乱糟糟？',
      '服饰鞋包': '穿搭总是差一点？',
      '健身运动': '运动后浑身酸痛？',
      '母婴用品': '宝宝用品你选对了吗？',
      '宠物用品': '还在为选猫粮发愁？',
      '学习办公': '打字效率太低？',
      '个护健康': '口腔问题困扰你？',
      '汽车用品': '车内总是不够整洁？',
      '节日礼品': '送礼不知道选什么？',
      '厨房用品': '做饭总是手忙脚乱？',
      '旅行户外': '露营装备太重了？',
      '虚拟课程': '想学新技能没方向？',
      '家电电器': '家务活太累人？',
      '珠宝配饰': '搭配总是少点什么？',
      '软件工具': '工作效率太低？',
      '图书文创': '想记录美好生活？',
      '本地生活服务': '想找靠谱的服务？',
    };
    return hooks[input.category] || `你还在为${input.category}发愁？`;
  }

  private getHookNarration(input: ProductInput): string {
    return `你还在为${input.category}的选择而烦恼吗？别急，看看这个！`;
  }

  private getHookCaption(input: ProductInput): string {
    return `你还在犹豫？`;
  }

  private getCTATitle(input: ProductInput): string {
    return '立即抢购';
  }

  private getCTANarration(input: ProductInput): string {
    return `${input.name}，现在下单仅需${input.price}元，数量有限，先到先得！`;
  }

  private getCTACaption(input: ProductInput): string {
    return `仅售 ¥${input.price} 立即下单`;
  }

  private getCTAText(input: ProductInput): string {
    const goal = input.marketingGoal;
    if (goal === '促销') return '🔥 限时抢购';
    if (goal === '新品发布') return '✨ 立即尝鲜';
    if (goal === '节日营销') return '🎁 立即选购';
    return '👉 立即购买';
  }

  private buildCaptions(scenes: Scene[], duration: number): CaptionTrack {
    const segments: Array<{
      id: string; text: string; startTime: number; endTime: number;
      sceneId: string; style: 'default' | 'highlight' | 'keyword';
    }> = [];

    let currentTime = 0;
    for (const scene of scenes) {
      segments.push({
        id: nextId('cap'),
        text: scene.caption,
        startTime: currentTime + 0.2,
        endTime: currentTime + scene.durationInSeconds - 0.2,
        sceneId: scene.id,
        style: scene.type === 'price_offer' ? 'highlight' : scene.type === 'hook' ? 'keyword' : 'default',
      });
      currentTime += scene.durationInSeconds;
    }

    // 根据时长调整字幕密度
    const density = duration <= 15 ? 'sparse' : duration <= 30 ? 'normal' : 'dense';
    const maxCharsPerLine = duration <= 15 ? 12 : 16;

    return { segments, language: 'zh-CN', style: 'bottom-bar', density, maxCharsPerLine };
  }

  private buildVoiceover(scenes: Scene[], fps: number): VoiceoverTimeline {
    const segments: Array<{
      id: string; text: string; startTime: number; duration: number; sceneId: string;
      pace?: 'slow' | 'normal' | 'fast';
      emotion?: 'neutral' | 'excited' | 'warm' | 'urgent';
    }> = [];

    let currentTime = 0;
    for (const scene of scenes) {
      // 根据场景类型设置语速和情感
      let pace: 'slow' | 'normal' | 'fast' = 'normal';
      let emotion: 'neutral' | 'excited' | 'warm' | 'urgent' = 'neutral';

      if (scene.type === 'hook') { pace = 'fast'; emotion = 'excited'; }
      else if (scene.type === 'cta') { pace = 'fast'; emotion = 'urgent'; }
      else if (scene.type === 'price_offer') { pace = 'fast'; emotion = 'excited'; }
      else if (scene.type === 'scenario') { pace = 'slow'; emotion = 'warm'; }
      else if (scene.type === 'proof') { pace = 'normal'; emotion = 'neutral'; }

      segments.push({
        id: nextId('vo'),
        text: scene.narration,
        startTime: currentTime,
        duration: scene.durationInSeconds,
        sceneId: scene.id,
        pace,
        emotion,
      });
      currentTime += scene.durationInSeconds;
    }

    return {
      segments,
      totalDuration: currentTime,
      mockAudioUrl: 'mock://tts/storyboard-preview.mp3',
      overallPace: 'normal',
    };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
