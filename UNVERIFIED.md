# ShopMotion v1.1 未验证项

> **最后更新：2026-05-12**
> 以下仅列出仍在当前环境中未完全验证的项目。已验证通过的项目见底部"已验证"部分。

---

## 未验证清单（4 项）

### 1. Remotion 视频渲染未验证
- **状态**：❌ 未验证
- **原因**：未执行 `npx remotion render`，需要 GPU 或高配服务器
- **影响**：无法导出真实 MP4 视频文件
- **验证方法**：迁移到高配置服务器后执行渲染命令

### 2. 飞书 Webhook 实际发送未验证
- **状态**：❌ 未验证
- **原因**：未配置 `FEISHU_WEBHOOK_URL` 环境变量
- **影响**：通知模块通过 MockNotifier 输出到控制台，从未实际发送飞书消息
- **验证方法**：设置环境变量后触发生成任务，检查飞书群是否收到消息

### 3. 真实 LLM 未接入
- **状态**：❌ 未接入
- **原因**：当前使用 `EnhancedMockLLMProvider`，未对接 OpenAI/Claude 等真实 API
- **影响**：卖点提取和分镜生成使用模拟数据，非真实 AI 生成
- **验证方法**：替换为真实 LLM Provider，配置 API Key 后测试

### 4. 真实 TTS 未接入
- **状态**：❌ 未接入
- **原因**：当前使用 `MockTTSProvider`，未对接 MiniMax/Azure TTS
- **影响**：旁白音频为 mock 数据，无真实语音合成
- **验证方法**：替换为真实 TTS Provider，配置 API Key 后测试

---

## 已验证（运行验证通过，2026-05-12）

### 构建与编译
- ✅ `npm install` 成功（582 packages）
- ✅ `npm run typecheck`（tsc --noEmit）零错误通过
- ✅ `npm run build`（tsc && vite build）构建成功，产物正常输出
- ✅ ESLint 零 error（7 个 warning 均为 `_` 前缀预期未使用变量）

### 测试
- ✅ vitest 测试框架配置完成
- ✅ 11 个测试文件、118 个测试用例全部通过
- ✅ 覆盖模块：JobStore、TemplateRegistry、TemplateResolver、EnhancedMockLLMProvider、Captions、Voiceover、Notification、DemoData、ProductTypes、StoryboardTypes、Server API

### 后端 API（12 个端点）
- ✅ `GET /api/categories` — 返回 20 个商品类别
- ✅ `GET /api/demo-products` — 返回 30 个 Demo 商品
- ✅ `GET /api/demo-products/:index` — 按索引获取商品（404 正常）
- ✅ `GET /api/templates/families` — 返回 15 个模板家族
- ✅ `GET /api/templates/families/:id` — 按 ID 获取家族（404 正常）
- ✅ `GET /api/templates/configs` — 返回 45 个模板配置，支持 familyId 过滤
- ✅ `GET /api/templates/stats` — 返回模板统计
- ✅ `POST /api/templates/resolve` — 模板推荐算法正常
- ✅ `POST /api/generate` — 创建生成任务，异步处理完成
- ✅ `GET /api/jobs` — 任务列表
- ✅ `GET /api/jobs/:id` — 任务详情（404 正常）
- ✅ `DELETE /api/jobs/:id` — 删除任务（404 正常）

### 前端
- ✅ Vite 开发服务器启动（port 5173/5174）
- ✅ HTML 页面正常加载，React SPA 渲染
- ✅ `/api` 代理配置正确

### 代码清理
- ✅ V1 遗留代码已删除（7 个文件 + 4 个旧测试）
- ✅ 仅保留 V1.1 模块代码

---

## 始终无需验证（静态审查即可）

- ✅ 类型定义完整性（TypeScript 类型覆盖所有数据结构）
- ✅ 模块间接口一致性（前后端使用相同类型定义）
- ✅ 安全约束（无硬编码密钥、无日志泄露、环境变量读取）
- ✅ 错误处理逻辑（try-catch 覆盖关键路径）
- ✅ 无硬编码密钥/Token/Webhook
- ✅ 无 Webhook URL 日志泄露
