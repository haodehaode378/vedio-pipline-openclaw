# ShopMotion v1.1 项目完成目标

> 项目根目录：`E:\ai-vedio-openclaw\vedio-pipline-openclaw`
> 技术栈：React 18 + TypeScript + Express + Remotion + Vite
> Token 不是问题，全力推进到可运行、可构建、可测试的完整状态。

---

## 总目标

将 ShopMotion 从"静态代码封版"推进到 **可运行、可构建、可测试的完整交付状态**，消除所有阻断性问题。

---

## Phase 1：构建修复（阻断所有后续工作）

### 1.1 安装缺失依赖
- 安装 `vitest` 到 devDependencies（测试文件导入了它但未声明）
- 安装 `eslint`、`@typescript-eslint/parser`、`@typescript-eslint/eslint-plugin`、`eslint-plugin-react`、`eslint-plugin-react-hooks` 到 devDependencies（`.eslintrc.json` 存在但依赖缺失）
- 安装 `@types/node`（服务端代码需要）
- 运行 `npm install` 确认依赖完整性

### 1.2 TypeScript 编译修复
- 运行 `npm run typecheck`，修复所有类型错误
- 检查 `tsconfig.json` 的 `paths` 配置是否与 `@/*` 别名一致（vite.config.ts 中有别名，tsconfig 也要配）
- 确保 V1.1 模块（`src/modules/`）的导入路径全部正确
- 确保 `tsc --noEmit` 零错误通过

### 1.3 Vite 构建验证
- 运行 `npm run build`（`tsc && vite build`），确保前端产物可正常生成
- 修复构建过程中遇到的任何问题

---

## Phase 2：清理死代码与重复文件

### 2.1 删除 V1 遗留代码
- 删除 `src/types/index.ts`（V1 类型，已被 `src/modules/product/types.ts` 等替代）
- 删除 `src/server/index.ts`（V1 服务端，已被 `src/modules/server/index.ts` 替代）
- 删除 `src/core/mock-llm-provider.ts`（已被 `src/modules/generation/enhanced-llm.ts` 替代）
- 删除 `src/core/mock-tts-provider.ts`（已被 `src/modules/voiceover/index.ts` 替代）
- 删除 `src/feishu/notifier.ts`（已被 `src/modules/notification/index.ts` 替代）
- 删除 `src/frontend/App.tsx` 和 `src/frontend/main.tsx`（已被 `src/modules/frontend/` 替代）
- 删除 `src/remotion/index.tsx` 和 `src/remotion/ShopMotionVideo.tsx`（已被 `src/modules/remotion/` 替代）

### 2.2 清理 V1 测试
- `src/__tests__/` 下的 4 个测试文件是针对 V1 类型写的，需确认是否要保留
- 如果保留，更新导入路径指向 V1.1 模块
- 如果删除，替换为新的 V1.1 测试（Phase 3）

---

## Phase 3：测试基础设施与测试补全

### 3.1 配置测试框架
- 在 `package.json` 中添加 `"test": "vitest run"` 和 `"test:watch": "vitest"` 脚本
- 创建 `vitest.config.ts`，配置路径别名、测试环境等
- 确保 `vitest` 可以正常运行

### 3.2 补全 V1.1 模块测试
为以下模块编写单元测试：

- **`src/modules/product/types.ts`** — 验证 20 个类别的枚举完整性、ProductInput 验证
- **`src/modules/jobs/store.ts`** — InMemoryJobStore 的 CRUD 操作、状态流转
- **`src/modules/templates/registry/index.ts`** — 注册、查询、过滤逻辑
- **`src/modules/templates/resolver/index.ts`** — 加权评分算法（category 50pts, goal 30pts, style 20pts）
- **`src/modules/generation/enhanced-llm.ts`** — 类别差异化分镜生成、风险约束
- **`src/modules/captions/index.ts`** — SRT/ASS/JSON 导出、中文断句算法
- **`src/modules/voiceover/index.ts`** — 时间线生成、语速/情感标记、时长估算
- **`src/modules/notification/index.ts`** — MockNotifier、FeishuNotifier fallback 逻辑
- **`src/modules/demo-data/products/index.ts`** — 30 个 Demo 商品覆盖度验证
- **`src/modules/server/index.ts`** — API 端点集成测试（至少覆盖核心接口）

### 3.3 测试目标
- 运行 `npm test` 全部通过
- 测试覆盖率 >= 80%（如可行）

---

## Phase 4：运行验证

### 4.1 后端启动
- 运行 `npm run dev:server`，确认 Express 在 3001 端口正常启动
- 验证所有 12 个 API 端点可响应：
  - `GET /api/categories`
  - `GET /api/demo-products`
  - `GET /api/templates/families`
  - `GET /api/templates/configs`
  - `GET /api/templates/stats`
  - `POST /api/templates/resolve`
  - `POST /api/generate`
  - `GET /api/jobs`
  - `GET /api/jobs/:id`
  - `GET /api/jobs/:id/storyboard`
  - `GET /api/jobs/:id/captions/srt`
  - `POST /api/jobs/:id/regenerate`

### 4.2 前端启动
- 运行 `npm run dev:frontend`，确认 Vite 在 5173 端口正常启动
- 浏览器访问 http://localhost:5173，验证三个 Tab（创建、历史、模板）可正常渲染
- 验证前端 → 后端 API 代理（vite.config.ts 中配置的 `/api` 代理）正常工作

### 4.3 Remotion 验证
- 运行 `npm run dev:remotion`，确认 Remotion Studio 可打开
- 验证分镜预览组件可渲染

---

## Phase 5：代码质量

### 5.1 ESLint
- 运行 `npx eslint src/`，修复所有 lint 错误
- 确保无 error 级别问题（warning 可酌情处理）

### 5.2 最终构建验证
- 运行 `npm run build`，确认 TypeScript 编译 + Vite 构建零错误
- 确认 `dist/` 产物目录正常生成

---

## Phase 6：文档更新

### 6.1 更新 UNVERIFIED.md
- 将已验证通过的项目标记为 ✅ 已验证
- 仅保留真正未验证的项目（真实 LLM/TTS 接入、飞书 Webhook 实际发送）

### 6.2 更新 PROGRESS.md
- 反映实际完成状态

### 6.3 更新 README.md（如需）
- 更新项目状态描述，反映已验证的事实

---

## 执行顺序

```
Phase 1（构建修复）→ Phase 2（清理死代码）→ Phase 3（测试）→ Phase 4（运行验证）→ Phase 5（代码质量）→ Phase 6（文档）
```

**每个 Phase 完成后验证通过再进入下一个。**

---

## 不在本次范围内

以下项目**不在本次完成目标内**，属于未来扩展：

- 真实 LLM API 接入（OpenAI/Claude）
- 真实 TTS API 接入（MiniMax/Azure）
- 真实飞书 Webhook 配置与测试
- Remotion 实际 MP4 渲染（需要 GPU/高配服务器）
- 生产部署配置（Dockerfile、CI/CD、PM2）
- 性能压测
