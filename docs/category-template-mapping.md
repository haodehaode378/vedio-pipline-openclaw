# ShopMotion v1.1 - 商品类别与模板映射文档

## 概述

ShopMotion 支持 20 个商品大类，每个类别都有详细的模板推荐配置，确保生成的短视频风格与商品特性匹配。

## 20 个商品类别

| # | 类别 ID | 图标 | 推荐模板家族 | 推荐风格 | 推荐时长 |
|---|---------|------|-------------|---------|---------|
| 1 | 数码科技 | 📱 | TechClean, TechPremium | 科技简洁, 科技高端 | 30s, 45s |
| 2 | 美妆护肤 | 💄 | SoftBeauty | 美妆柔和 | 30s, 45s |
| 3 | 食品饮料 | 🍜 | FreshFood, BoldPromo, FestivalGift | 食品清新, 强促销, 节日礼赠 | 15s, 30s |
| 4 | 家居日用 | 🏠 | WarmLifestyle, HomeComfort | 生活种草, 家居温馨 | 30s, 45s |
| 5 | 服饰鞋包 | 👗 | FashionLook, BoldPromo | 服饰潮流, 强促销 | 15s, 30s |
| 6 | 健身运动 | 💪 | SportEnergy | 运动活力 | 15s, 30s |
| 7 | 母婴用品 | 👶 | BabyCare | 母婴安心 | 30s, 45s |
| 8 | 宠物用品 | 🐾 | PetFriendly | 宠物亲和 | 15s, 30s |
| 9 | 学习办公 | 📚 | StudyOffice | 学习办公 | 30s, 45s |
| 10 | 个护健康 | 🏥 | HealthCare | 健康个护 | 30s, 45s |
| 11 | 汽车用品 | 🚗 | AutoGear | 汽车用品 | 30s, 45s |
| 12 | 节日礼品 | 🎁 | FestivalGift | 节日礼赠 | 15s, 30s |
| 13 | 厨房用品 | 🍳 | WarmLifestyle, FreshFood, HomeComfort | 生活种草, 食品清新, 家居温馨 | 30s, 45s |
| 14 | 旅行户外 | 🏕️ | SportEnergy, WarmLifestyle | 运动活力, 生活种草 | 15s, 30s |
| 15 | 家电电器 | 🔌 | TechClean, WarmLifestyle, HomeComfort | 科技简洁, 生活种草, 家居温馨 | 30s, 45s |
| 16 | 珠宝配饰 | 💎 | SoftBeauty, FashionLook, FestivalGift | 美妆柔和, 服饰潮流, 节日礼赠 | 15s, 30s |
| 17 | 虚拟课程 | 🎓 | StudyOffice | 学习办公 | 30s, 45s |
| 18 | 软件工具 | 🖥️ | TechClean, StudyOffice | 科技简洁, 学习办公 | 30s, 45s |
| 19 | 图书文创 | 📖 | StudyOffice, WarmLifestyle, FestivalGift | 学习办公, 生活种草, 节日礼赠 | 15s, 30s |
| 20 | 本地生活服务 | 🏪 | WarmLifestyle, BoldPromo, SportEnergy | 生活种草, 强促销, 运动活力 | 15s, 30s |

## 类别配置字段说明

每个类别配置包含以下字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| id | 类别标识 | '数码科技' |
| label | 显示名称 | '数码科技' |
| icon | 图标 | '📱' |
| description | 类别描述 | '包括手机、耳机、平板...' |
| recommendedFamilies | 推荐模板家族 | ['TechClean', 'TechPremium'] |
| recommendedStyles | 推荐视频风格 | ['科技简洁', '科技高端'] |
| recommendedVideoDurations | 推荐视频时长 | [30, 45] |
| recommendedSellingPointTypes | 推荐卖点类型 | ['功能', '品质', '场景'] |
| recommendedCTAStyle | 推荐 CTA 样式 | 'button' |
| recommendedColorScheme | 推荐配色方案 | '冷色调科技蓝' |
| recommendedStructure | 推荐视频结构 | '痛点→产品亮相→参数→场景→CTA' |
| avoidFamilies | 不推荐的模板家族 | ['SoftBeauty', 'BabyCare'] |
| exampleProducts | 示例商品 | ['蓝牙耳机', '智能手表'] |
| sampleProducts | 扩展示例商品 | ['无线降噪耳机', '智能手环'] |
| riskNotes | 风险提示 | '不得虚假宣传参数' |

## 模板推荐算法

TemplateResolver 根据以下权重进行推荐：

1. **类别匹配**（权重 50）：商品类别与模板家族的 `suitableCategories` 匹配
2. **营销目标匹配**（权重 30）：营销目标与模板家族的 `suitableGoals` 匹配
3. **风格匹配**（权重 20）：用户选择的视频风格与模板家族匹配

## 特殊类别注意事项

### 美妆护肤
- ⚠️ 不得宣传医疗功效
- ⚠️ 不得使用"根治""治愈"等医疗用语
- 推荐使用柔和的视觉风格

### 母婴用品
- ⚠️ 不得承诺"绝对安全""零风险"
- 安全声明需有检测报告支撑
- 推荐使用温馨柔和的色调

### 食品饮料
- ⚠️ 不得夸大健康效果
- 不得使用"治病""抗癌"等医疗用语
- 推荐清新的视觉风格

### 个护健康
- ⚠️ 保健品不得宣传医疗功效
- 不得使用"治疗""治愈"等用语
- 推荐专业的视觉风格

### 虚拟课程
- ⚠️ 不得承诺"包过""保证就业"
- 课程内容描述需真实
- 推荐简洁专业的视觉风格
