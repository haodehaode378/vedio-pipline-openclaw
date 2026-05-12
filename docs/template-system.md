# ShopMotion v1.1 - 模板系统文档

## 1. 模板系统目标

建立一个可扩展的 Remotion 模板体系，覆盖多行业、多商品类型、多营销风格，通过"模板家族 + 配置化变体 + 商品类别映射"扩展出 405+ 种模板组合。

## 2. 三层架构

### Layer 1: Template Family（模板家族）
定义视觉风格的整体调性，包括配色、字体、动效节奏、适用场景。

**15 个模板家族：**

| ID | 名称 | 适用类别 | 视觉特点 | 推荐场景 |
|---|---|---|---|---|
| TechClean | 科技简洁风 | 数码科技、学习办公 | 冷色调、极简线条 | 新品发布、产品测评 |
| TechPremium | 科技高端风 | 数码科技 | 深色背景、金属质感 | 品牌宣传、旗舰发布 |
| WarmLifestyle | 生活种草风 | 家居日用、厨房用品 | 暖色调、场景化 | 日常好物、家居改造 |
| SoftBeauty | 美妆柔和风 | 美妆护肤 | 粉色调、精致排版 | 美妆教程、护肤科普 |
| BoldPromo | 强促销风 | 食品饮料、服饰鞋包 | 高对比、大字号 | 限时秒杀、清仓促销 |
| FreshFood | 食品清新风 | 食品饮料 | 绿色调、食欲感 | 美食展示、健康饮食 |
| HomeComfort | 家居温馨风 | 家居日用 | 米色暖调、柔和光影 | 家居改造、收纳整理 |
| FashionLook | 服饰潮流风 | 服饰鞋包 | 黑白灰、大图展示 | 穿搭展示、新品上市 |
| SportEnergy | 运动活力风 | 健身运动 | 高饱和、动感配色 | 运动场景、健身训练 |
| BabyCare | 母婴安心风 | 母婴用品 | 马卡龙色、圆润造型 | 宝宝日常、育儿好物 |
| PetFriendly | 宠物亲和风 | 宠物用品 | 可爱风、温暖色调 | 萌宠日常、宠物好物 |
| StudyOffice | 学习办公风 | 学习办公 | 蓝绿色、简洁排版 | 办公效率、学习好物 |
| HealthCare | 健康个护风 | 个护健康 | 医疗绿、专业感 | 健康科普、个护好物 |
| AutoGear | 汽车用品风 | 汽车用品 | 深色金属、硬朗线条 | 车载好物、汽车改装 |
| FestivalGift | 节日礼赠风 | 节日礼品 | 红金色、喜庆感 | 节日送礼、礼盒开箱 |

### Layer 2: Template Variant（模板变体）
每个模板家族支持多个变体维度：
- **时长变体**: 15s / 30s / 45s
- **画幅变体**: 9:16 / 1:1 / 16:9
- **视觉密度**: 极简 / 标准 / 信息强化
- **表达目的**: 种草型 / 促销型 / 讲解型 / 品牌型
- **CTA 风格**: button / banner / slide-up / pulse
- **字幕样式**: bottom-bar / card / highlight-keywords / floating
- **背景风格**: solid / gradient / card-based / scene-based
- **动效节奏**: 舒缓 / 标准 / 快节奏

### Layer 3: Template Config（模板配置）
每个变体的具体配置项（22 个字段）：
- id, familyId, name, description
- supportedCategories, supportedAspectRatios, supportedDurations
- colorTheme, typographyScale
- titleLayout, captionLayout, productImageLayout
- sellingPointCardStyle, ctaStyle, backgroundStyle
- transitionStyle, sceneTypeMapping
- visualDensity, motionIntensity
- recommendedFor, fallbackBehavior

## 3. TemplateRegistry

模板注册表，管理所有模板家族和配置的注册、查询。

```typescript
const registry = new TemplateRegistry();
registry.familyCount;  // 15
registry.configCount;  // 45
registry.totalCombinations;  // 135+
```

**增强功能：**
- `getAllFamilies()` - 获取所有模板家族（含推荐场景、商品类型等增强字段）
- `getFamiliesByCategory(category)` - 按商品类别筛选适用家族
- `getFamiliesByGoal(goal)` - 按营销目标筛选适用家族
- `getConfigsByFamily(familyId)` - 获取家族下所有配置

## 4. TemplateResolver

模板解析器，根据商品信息自动推荐最佳模板。

**输入:**
- productCategory（商品类别）
- videoStyle（视频风格，可选）
- marketingGoal（营销目标，可选）
- aspectRatio（画幅，可选）
- duration（时长，可选）
- targetAudience（目标人群，可选）
- manualFamilyId（手动指定，可选）

**输出:**
- familyId, variantId, configId
- reason（推荐理由）
- confidence（置信度）
- fallbackUsed（是否使用了默认推荐）
- supportedSceneTypes

**推荐算法:**
1. 类别匹配（权重 50）
2. 营销目标匹配（权重 30）
3. 风格匹配（权重 20）
4. 按总分排序，取最高分
5. 无匹配时使用 WarmLifestyle 作为默认

## 5. 从 15 个家族扩展到 405+ 组合

### 当前配置
- 15 个模板家族
- 每家族 3 个基础配置（极简/标准/详细）
- 共 45 个模板配置
- 每配置支持 1-3 种画幅 × 1-3 种时长
- 总计 135+ 种可直接使用的模板组合

### 扩展路径到 405+ 组合

| 扩展维度 | 当前值 | 扩展后 | 增量 |
|---------|--------|--------|------|
| 模板家族 | 15 | 15 | ×1 |
| 变体类型 | 3 | 3 | ×1 |
| 画幅支持 | 1 | 3 | ×3 |
| 时长变体 | 1 | 3 | ×3 |
| **总计** | **45** | **405** | **×9** |

**具体扩展方法：**
1. **画幅扩展**：为每个配置添加 `1:1`（方形）和 `16:9`（横版）支持
2. **时长扩展**：为每个配置添加 `15s`、`30s`、`45s` 三种时长变体
3. **组合计算**：15 家族 × 3 变体 × 3 画幅 × 3 时长 = **405 种组合**

### 进一步扩展（未来）
- 增加新模板家族 → +27 组合/家族
- 增加配色方案变体 → ×2-3 倍
- 增加季节/节日主题 → +100 种
- 最终可达 **1000+ 种组合**

## 6. 共享组件与配置化渲染

采用"共享基础组件 + 家族配置 + 变体渲染"方式：
- `ProductNameBlock` - 商品名称展示
- `SellingPointCard` - 卖点卡片（4 种样式）
- `CaptionBlock` - 字幕显示（4 种布局）
- `CTABlock` - CTA 按钮（4 种动效）
- `PriceBlock` - 价格展示
- `ProgressIndicator` - 进度指示器
- `ProductImagePlaceholder` - 商品图片占位

所有组件通过 TemplateConfig 配置驱动，不同模板家族通过不同配置实现视觉差异。

## 7. 每个模板家族的增强信息

每个模板家族现在包含以下增强字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| recommendedScenarios | 推荐适用场景 | ['新品发布会', '产品测评'] |
| recommendedProductTypes | 推荐商品类型 | ['蓝牙耳机', '智能手表'] |
| recommendedVideoStructure | 推荐视频结构 | ['痛点引入', '产品亮相', 'CTA'] |
| recommendedCTAs | 推荐 CTA 文案 | ['了解更多', '立即抢购'] |
| colorDescription | 配色说明 | '冷色调科技蓝为主' |
| rhythmDescription | 节奏说明 | '中等节奏，每个场景2-4秒' |
| recommendedCaptionStyle | 字幕风格 | '简洁白色字幕条' |

## 8. 新增模板家族指南

1. 在 `families/index.ts` 添加 TemplateFamily 定义（含增强字段）
2. 在 `configs/index.ts` 自动生成 3 个基础配置
3. 在 `presets/index.ts` 更新类别映射
4. 在 `SceneRenderer.tsx` 添加特定场景渲染逻辑（可选）
5. 更新文档和 demo 数据

## 9. 质量保障

### 配置一致性检查
- ✅ 15 个家族的 `suitableCategories` 与 `presets/index.ts` 中的 `recommendedFamilies` 一致
- ✅ 45 个配置的 `familyId` 均指向已注册的家族
- ✅ 所有配置的 `supportedCategories` 与家族的 `suitableCategories` 一致
- ✅ 无重复配置 ID

### 去重与公共配置
- 颜色主题和字体配置通过 `getFamilyColorTheme()` 和 `getFamilyTypography()` 统一管理
- 场景类型映射（sceneTypeMapping）在三个变体间有差异化
- 避免简单复制粘贴，每个变体有明确的差异化设计
