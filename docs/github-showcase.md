# ShopMotion v1.1 - GitHub 展示材料

## 1. GitHub 项目简介

ShopMotion 是一个电商带货短视频自动生成系统，基于 React + TypeScript + Node.js + Remotion 技术栈，通过智能模板推荐和分镜脚本生成，实现从商品输入到短视频输出的自动化流程。

## 2. 推荐仓库描述

```
🎬 ShopMotion - 电商带货短视频自动生成系统 | 基于 Remotion 的智能模板化视频生成，15个模板家族、405+种组合、20个商品类别
```

## 3. Topics 标签建议

```
remotion
react
typescript
video-generation
ecommerce
short-video
template-system
ai-video
automated-content
nodejs
express
vite
```

## 4. README 首屏文案

```markdown
# 🎬 ShopMotion

> 电商带货短视频自动生成系统 · 基于 Remotion 的智能模板化视频生成

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Remotion](https://img.shields.io/badge/Remotion-4.0-000000.svg)](https://www.remotion.dev/)

**15 个模板家族 | 405+ 种组合 | 20 个商品类别 | 30 个 Demo 商品**
```

## 5. 截图占位规划

### 主界面截图
```
![ShopMotion 主界面](docs/images/main-interface.png)
- 左侧：商品输入表单
- 右侧：分镜脚本预览
- 底部：Demo 商品一键填充
```

### 模板系统截图
```
![模板系统](docs/images/template-system.png)
- 统计卡片：15 家族 / 45 配置 / 405+ 组合
- 模板家族卡片网格
```

### 分镜脚本截图
```
![分镜脚本](docs/images/storyboard.png)
- 场景列表
- 字幕时间轴
- 卖点卡片
```

### API 文档截图
```
![API 文档](docs/images/api-docs.png)
- 12 个接口
- 请求/响应示例
```

## 6. Demo GIF 规划

### GIF 1：商品输入 → 模板推荐
```
时长：5秒
内容：
1. 用户输入商品名称
2. 选择商品类别
3. 系统自动推荐模板
4. 显示推荐理由和置信度
```

### GIF 2：Demo 商品一键填充
```
时长：3秒
内容：
1. 点击 Demo 商品按钮
2. 表单自动填充
3. 任务开始生成
```

### GIF 3：分镜脚本生成
```
时长：5秒
内容：
1. 任务状态从"排队中"变为"生成脚本中"
2. 进度条推进
3. 最终显示完整分镜脚本
```

## 7. Release Notes 草稿

### v1.1.0 - 静态增强版

**发布日期：** 2025-05-12

**新特性：**
- 🎨 模板系统增强：15 个模板家族，每个家族新增推荐场景、商品类型、视频结构等 7 个增强字段
- 📦 商品类别扩展：从 15 个扩展到 20 个（新增家电电器、珠宝配饰、软件工具、图书文创、本地生活服务）
- 🎮 Demo 商品扩展：从 12 个扩展到 30 个，覆盖全部 20 个类别
- 🎬 Storyboard 增强：新增 sceneIntent、layoutHint、templateSlot 字段，支持类别差异化分镜
- 📝 字幕增强：支持 ASS 格式导出，新增断句规则和密度自适应
- 🔊 旁白增强：新增语速和情感标记
- 📚 文档增强：新增 5 份文档（Storyboard 设计、字幕旁白、前端设计、低配置策略、GitHub 展示）

**改进：**
- 前端新增低配置服务器提示
- API 文档完善（12 个接口完整文档）
- 课程设计报告大纲完善
- PPT 汇报大纲完善（12 页）

**已知问题：**
- 真实 LLM/TTS API 未接入（使用 Mock）
- 真实视频渲染未验证
- 飞书 Webhook 实际发送未验证

### v1.0.0 - 模板系统增强版

**发布日期：** 2025-05-11

**新特性：**
- 🎨 15 个模板家族
- 📦 45 个模板配置
- 🎯 智能模板推荐算法
- 🎬 8 种场景类型的分镜生成
- 📝 SRT 字幕导出
- 🔔 飞书通知集成
- 🎮 12 个 Demo 商品
- 📚 12 份技术文档

## 8. Roadmap

### v1.2 - API 集成版（计划）
- [ ] 接入 OpenAI/Claude API 实现真实分镜生成
- [ ] 接入 MiniMax/Azure TTS 实现真实旁白合成
- [ ] 完成 Remotion 视频渲染验证
- [ ] 添加数据库持久化（PostgreSQL/SQLite）

### v1.3 - 渲染完善版（计划）
- [ ] 完成所有 15 个模板家族的 Remotion 渲染
- [ ] 支持 1:1 和 16:9 画幅渲染
- [ ] 添加视频预览功能
- [ ] 优化渲染性能

### v2.0 - 生产就绪版（计划）
- [ ] 用户认证和权限管理
- [ ] 批量视频生成
- [ ] 视频模板市场
- [ ] 数据分析和报表
- [ ] 部署到云服务器

---

## 注意事项

1. 所有截图和 GIF 需要在迁移到高配置服务器后制作
2. Release Notes 中的版本号和日期需要根据实际情况调整
3. Topics 标签可以根据 GitHub 的热门标签进行调整
4. README 首屏文案可以根据实际展示效果进行优化
