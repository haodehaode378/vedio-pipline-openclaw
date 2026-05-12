# ShopMotion v1.1 - Storyboard 设计文档

## 概述

Storyboard（分镜脚本）是 ShopMotion 的核心产物，它定义了短视频的完整内容结构，包括场景序列、字幕时间轴和旁白时间轴。

## 8 种场景类型

| 类型 | 名称 | 典型时长 | 意图 | 布局 |
|------|------|---------|------|------|
| hook | 开场痛点引入 | 2-5s | 抓住注意力，引发共鸣 | centered, full-bleed |
| product_reveal | 商品亮相 | 3-6s | 展示商品，建立第一印象 | centered, full-bleed |
| selling_point | 卖点展示 | 3-8s | 传达核心价值，说服用户 | card-grid, split |
| scenario | 使用场景 | 3-8s | 让用户想象使用场景 | full-bleed, split |
| comparison | 对比展示 | 3-6s | 突出优势，形成差异化 | split, card-grid |
| proof | 证据可信度 | 2-5s | 建立信任，消除疑虑 | card-grid, centered |
| price_offer | 价格优惠 | 2-4s | 传达价格优势，营造紧迫感 | centered, full-bleed |
| cta | 行动引导 | 2-4s | 促成转化，引导行动 | centered |

## 场景结构

每个场景包含以下增强字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| id | 场景唯一标识 | 'scene-1234567890-1' |
| type | 场景类型 | 'hook' |
| title | 场景标题 | '你还在用老款产品？' |
| narration | 旁白文案 | '你还在为选择而烦恼吗？' |
| caption | 字幕文案 | '你还在犹豫？' |
| visualPrompt | 视觉提示 | 'hook场景：产品名 - 标题' |
| durationInSeconds | 场景时长 | 3.5 |
| layout | 布局方式 | 'centered' |
| sellingPointIds | 关联卖点ID | ['sp-1', 'sp-2'] |
| transition | 转场效果 | 'zoom' |
| cta | CTA文案（仅cta场景） | '立即购买' |
| sceneIntent | 场景意图 | '抓住观众注意力' |
| layoutHint | 布局提示 | 'centered' |
| templateSlot | 模板插槽 | 'scene-hook' |

## 类别差异化分镜逻辑

不同商品类别应有不同的默认分镜结构：

### 美妆护肤类
```
hook → product_reveal → selling_point(成分) → selling_point(质地) → scenario(使用效果) → cta
```
- ⚠️ 不得写医疗功效
- 重点展示产品质感和使用效果

### 母婴用品类
```
hook → product_reveal → selling_point(安全材质) → selling_point(设计) → scenario(温馨场景) → cta
```
- ⚠️ 不得写绝对安全承诺
- 重点展示安全性和温馨感

### 食品饮料类
```
hook → product_reveal → scenario(美食场景) → selling_point(口味) → selling_point(原料) → cta
```
- ⚠️ 不得写夸大健康效果
- 重点唤起食欲和展示口味

### 数码科技类
```
hook → product_reveal → selling_point(参数) → selling_point(功能) → comparison(对比) → cta
```
- 重点突出参数、场景和对比

### 家居日用类
```
hook → product_reveal → selling_point(功能) → scenario(使用场景) → proof(好评) → cta
```
- 重点突出使用前后、空间感和生活方式

### 服饰鞋包类
```
hook → product_reveal → selling_point(设计) → scenario(穿搭效果) → price_offer → cta
```
- 重点展示穿搭效果和潮流感

### 健身运动类
```
hook → product_reveal → selling_point(性能) → scenario(运动场景) → proof(效果) → cta
```
- 重点展示运动场景和产品性能

### 汽车用品类
```
hook → product_reveal → selling_point(参数) → scenario(安装演示) → comparison(对比) → cta
```
- 重点突出性能参数和使用演示

## 字幕设计

### 断句规则
- 每行不超过 16 个字符（15秒视频不超过 12 个字符）
- 在标点符号处断句
- 在语义完整处断句
- 避免在词组中间断句

### 字幕密度建议
| 视频时长 | 字幕密度 | 每行最大字符 |
|---------|---------|------------|
| 15s | sparse（稀疏） | 12 |
| 30s | normal（正常） | 16 |
| 45s | dense（密集） | 16 |

### 字幕样式
- **default**：默认白色字幕条
- **highlight**：高亮显示（用于价格、优惠等）
- **keyword**：关键词高亮（用于开场痛点等）

## 旁白设计

### 语速标记
- **slow**：慢速（用于场景展示、产品质感）
- **normal**：正常速度（用于卖点讲解）
- **fast**：快速（用于开场、CTA、价格优惠）

### 情感标记
- **neutral**：中性（用于信息传达）
- **excited**：兴奋（用于开场、促销）
- **warm**：温暖（用于生活场景、母婴）
- **urgent**：紧迫（用于 CTA、限时优惠）

### 旁白与场景时长对齐规则
- 旁白时长 = 场景时长
- 旁白开始时间 = 场景开始时间
- 旁白结束时间 = 场景结束时间
- 确保旁白与字幕同步

## 模板插槽映射

每个场景类型对应一个模板插槽，Remotion 模板根据插槽选择对应的渲染组件：

| 场景类型 | 模板插槽 | 渲染组件 |
|---------|---------|---------|
| hook | scene-hook | HookSceneComponent |
| product_reveal | scene-product-reveal | ProductRevealComponent |
| selling_point | scene-selling-point | SellingPointComponent |
| scenario | scene-scenario | ScenarioComponent |
| comparison | scene-comparison | ComparisonComponent |
| proof | scene-proof | ProofComponent |
| price_offer | scene-price-offer | PriceOfferComponent |
| cta | scene-cta | CTAComponent |

## 未验证项

- ⚠️ 真实 LLM API 生成的分镜质量未验证（当前使用 Mock）
- ⚠️ 真实 TTS 合成的旁白效果未验证（当前使用 Mock）
- ⚠️ 不同类别的分镜逻辑差异未在真实渲染中验证
