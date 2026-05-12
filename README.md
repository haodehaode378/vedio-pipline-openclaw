# 🎬 ShopMotion v1.1

**电商带货短视频自动生成系统 · 静态增强版**

> 基于 React + TypeScript + Node.js + Remotion 的电商带货短视频自动生成系统。通过智能模板推荐和分镜脚本生成，实现从商品输入到短视频输出的自动化流程。

---

## ✨ 核心特性

- 🎨 **15 个模板家族**：覆盖科技、美妆、食品、家居等 15 种视觉风格
- 📦 **20 个商品类别**：适配数码、美妆、食品、家居等 20 个电商大类
- 🎯 **智能模板推荐**：基于多维度加权评分的模板推荐算法
- 🎬 **8 种场景类型**：hook、product_reveal、selling_point 等完整分镜体系
- 📝 **多格式字幕**：支持 SRT、ASS、JSON 三种字幕导出格式
- 🔔 **飞书通知**：任务状态实时推送（安全的 Webhook 设计）
- 🎮 **30 个 Demo 商品**：一键体验，覆盖全部商品类别
- 📚 **完整文档**：13 份技术文档，覆盖架构、API、设计等

## 🛠 技术栈

| 层次 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript |
| 后端 | Express + TypeScript |
| 渲染 | Remotion |
| 构建 | Vite |
| 语言 | TypeScript（全栈） |

## 🏗 系统架构

```
用户输入 → 前端(React) → API(Express) → 核心模块
                                          ├── 模板系统（15家族/45配置/405+组合）
                                          ├── 分镜生成（8种场景类型）
                                          ├── 字幕系统（SRT/ASS/JSON）
                                          ├── 旁白系统（Mock TTS）
                                          └── 通知系统（飞书Webhook）
```

## 🎨 模板系统

### 15 个模板家族

| 家族 | 风格 | 适用类别 |
|------|------|---------|
| TechClean | 科技简洁 | 数码科技 |
| TechPremium | 科技高端 | 数码科技 |
| WarmLifestyle | 生活种草 | 家居日用 |
| SoftBeauty | 美妆柔和 | 美妆护肤 |
| BoldPromo | 强促销 | 食品饮料 |
| FreshFood | 食品清新 | 食品饮料 |
| HomeComfort | 家居温馨 | 家居日用 |
| FashionLook | 服饰潮流 | 服饰鞋包 |
| SportEnergy | 运动活力 | 健身运动 |
| BabyCare | 母婴安心 | 母婴用品 |
| PetFriendly | 宠物亲和 | 宠物用品 |
| StudyOffice | 学习办公 | 学习办公 |
| HealthCare | 健康个护 | 个护健康 |
| AutoGear | 汽车用品 | 汽车用品 |
| FestivalGift | 节日礼赠 | 节日礼品 |

### 扩展能力
15 家族 × 3 变体 × 3 画幅 × 3 时长 = **405+ 种组合**

## 📦 Demo 商品示例

30 个 Demo 商品覆盖 20 个商品类别：

```
📱 数码科技：无线降噪耳机 Pro          ¥599
💄 美妆护肤：玻尿酸精华液 30ml         ¥89
🍜 食品饮料：即食燕麦片 混合坚果味      ¥39.9
🏠 家居日用：316不锈钢智能保温杯        ¥129
👗 服饰鞋包：轻量透气跑步鞋            ¥299
💪 健身运动：筋膜枪Pro 深层按摩器       ¥399
👶 母婴用品：婴儿湿巾 80抽×5包         ¥29.9
🐾 宠物用品：全价猫粮 鸡肉味 2kg       ¥79
... 更多商品
```

## 🔌 API 概览

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/categories` | GET | 获取商品类别 |
| `/api/demo-products` | GET | 获取 Demo 商品 |
| `/api/templates/families` | GET | 获取模板家族 |
| `/api/templates/resolve` | POST | 推荐模板 |
| `/api/generate` | POST | 创建生成任务 |
| `/api/jobs` | GET | 任务列表 |
| `/api/jobs/:id/storyboard` | GET | 获取分镜脚本 |
| `/api/jobs/:id/captions.srt` | GET | 导出 SRT 字幕 |
| `/api/jobs/:id/voiceover` | GET | 获取旁白时间轴 |
| `/api/jobs/:id/regenerate` | POST | 重新生成 |

## 📚 文档目录

- [架构设计](docs/architecture.md)
- [API 文档](docs/api.md)
- [模板系统](docs/template-system.md)
- [类别映射](docs/category-template-mapping.md)
- [Storyboard 设计](docs/storyboard-design.md)
- [字幕与旁白](docs/caption-voiceover.md)
- [前端设计](docs/frontend-design.md)
- [渲染文档](docs/rendering.md)
- [部署指南](docs/deployment.md)
- [演示流程](docs/demo-flow.md)
- [飞书通知](docs/feishu-notification.md)
- [低配置服务器策略](docs/low-resource-server-strategy.md)
- [报告大纲](docs/report-outline.md)
- [答辩大纲](docs/presentation-outline.md)
- [GitHub 展示](docs/github-showcase.md)
- [迁移验证清单](docs/migration-validation-checklist.md)
- [最终交付总结](docs/final-delivery-summary.md)
- [未来规划](docs/future-work.md)

## ⚠️ 当前状态（v1.1 封版）

**ShopMotion v1.1 当前为静态增强完成版本，运行验证需迁移到高配置环境后完成。**

所有功能代码已编写完成，但由于当前服务器配置不足，以下环节均未进行运行验证：依赖安装、前端启动、后端启动、Remotion Studio、视频渲染、飞书 Webhook 实际发送、真实 LLM 接入、真实 TTS 接入。

### 已完成（静态代码层面）
- ✅ 模板系统（15 家族、45 配置）
- ✅ 商品分类（20 类别）
- ✅ Demo 数据（30 商品）
- ✅ 分镜生成逻辑（8 场景类型）
- ✅ 字幕导出逻辑（SRT/ASS/JSON）
- ✅ API 接口设计与实现（12 个）
- ✅ 文档（16 份）

### 未验证（全部需迁移后验证）
- ⚠️ npm install 未验证
- ⚠️ npm run dev 未验证
- ⚠️ 前端页面运行未验证
- ⚠️ 后端接口运行未验证
- ⚠️ Remotion Studio 未验证
- ⚠️ Remotion 视频渲染未验证
- ⚠️ 飞书 Webhook 实际发送未验证
- ⚠️ 真实 LLM 未接入
- ⚠️ 真实 TTS 未接入

## 🚀 快速开始

```bash
# 克隆项目
git clone <repo-url>
cd ShopMotion

# 安装依赖
npm install

# 启动后端 API
npm run dev:server

# 启动前端
npm run dev:frontend

# 启动 Remotion Studio（可选）
npm run dev:remotion
```

## 📄 License

MIT
