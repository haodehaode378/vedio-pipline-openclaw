# ShopMotion v1.1 迁移验证清单

> **适用场景**：将 ShopMotion v1.1 从当前低配置环境迁移到高配置服务器后，按本清单逐项验证。

---

## 1. 环境要求

### 服务器配置
| 项目 | 最低要求 | 推荐配置 |
|------|---------|---------|
| CPU | 2 核 | 4 核+ |
| 内存 | 4 GB | 8 GB+ |
| 磁盘 | 20 GB 可用空间 | 50 GB+ |
| 操作系统 | Linux / macOS / Windows | Ubuntu 22.04 LTS |
| 网络 | 可访问 npm registry | 稳定网络 |

### 软件要求
| 软件 | 版本要求 |
|------|---------|
| Node.js | >= 18.0.0（推荐 20 LTS） |
| npm | >= 9.0.0 |
| Git | >= 2.0 |

---

## 2. 迁移步骤

### 2.1 克隆/拷贝项目
```bash
# 方式一：Git 克隆
git clone <repo-url>
cd ShopMotion

# 方式二：直接拷贝
scp -r /path/to/ShopMotion user@new-server:/path/to/
cd /path/to/ShopMotion
```

### 2.2 检查 Node.js 版本
```bash
node --version   # 应 >= 18.0.0
npm --version    # 应 >= 9.0.0
```

---

## 3. 依赖安装验证

### 步骤
```bash
npm install
```

### 验证标准
- [ ] 命令执行无报错退出（exit code 0）
- [ ] `node_modules/` 目录已创建
- [ ] `package-lock.json` 已生成或更新
- [ ] 无 `ERESOLVE` 依赖冲突错误
- [ ] 无 `EACCES` 权限错误

### 常见失败处理
| 错误 | 处理方式 |
|------|---------|
| `ERESOLVE unable to resolve dependency tree` | `npm install --legacy-peer-deps` |
| `EACCES: permission denied` | 使用 nvm 管理 Node.js，避免 sudo |
| `ENOSPC: no space left on device` | 清理磁盘空间 |
| `npm ERR! code ETIMEDOUT` | 检查网络，或设置 npm 镜像源 |

---

## 4. 前端验证

### 步骤
```bash
npm run dev:frontend
```

### 验证标准
- [ ] Vite 开发服务器启动成功
- [ ] 控制台显示 `Local: http://localhost:5173`
- [ ] 浏览器打开 http://localhost:5173 无白屏
- [ ] 页面显示三个标签页（创建视频、任务历史、模板系统）
- [ ] 商品类别下拉框可选择 20 个类别
- [ ] Demo 商品按钮可点击并填充表单
- [ ] 浏览器控制台无严重报错（红色错误）

### 常见失败处理
| 错误 | 处理方式 |
|------|---------|
| `Module not found` | 重新 `npm install` |
| `Port 5173 already in available` | 关闭占用端口的进程，或修改 vite.config.ts |
| 白屏但无报错 | 检查浏览器控制台，可能是 API 地址配置问题 |

---

## 5. 后端 API 验证

### 步骤
```bash
# 终端 1：启动后端
npm run dev:server

# 终端 2：测试接口
```

### 验证标准
- [ ] Express 服务启动成功
- [ ] 控制台显示服务运行在 http://localhost:3001
- [ ] 以下接口均可正常返回 JSON：

```bash
# 获取商品类别
curl http://localhost:3001/api/categories
# 期望：返回包含 20 个类别的 JSON 数组

# 获取 Demo 商品
curl http://localhost:3001/api/demo-products
# 期望：返回包含 30 个商品的 JSON 数组

# 获取模板家族
curl http://localhost:3001/api/templates/families
# 期望：返回包含 15 个家族的 JSON 数组

# 创建生成任务（使用 Demo 商品）
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"productName":"测试商品","category":"electronics","price":99}'
# 期望：返回包含 jobId 的 JSON

# 获取任务列表
curl http://localhost:3001/api/jobs
# 期望：返回任务列表 JSON
```

### 常见失败处理
| 错误 | 处理方式 |
|------|---------|
| `EADDRINUSE: port 3001` | 关闭占用端口的进程 |
| `Cannot find module` | 重新 `npm install` |
| 接口返回 500 | 查看后端控制台日志 |

---

## 6. Remotion 验证

### 6.1 Remotion Studio 验证

#### 步骤
```bash
npm run dev:remotion
```

#### 验证标准
- [ ] Remotion Studio 启动成功
- [ ] 浏览器打开显示 Remotion 预览界面
- [ ] 可以看到 Composition 列表
- [ ] 选择某个 Composition 后可预览画面
- [ ] 无严重渲染错误

### 6.2 Remotion 渲染验证

#### 步骤
```bash
npx remotion render src/index.ts ShopMotionDemo out/demo.mp4
```

#### 验证标准
- [ ] 渲染命令执行完成（exit code 0）
- [ ] `out/demo.mp4` 文件已生成
- [ ] 文件大小 > 0
- [ ] 使用视频播放器可正常播放
- [ ] 视频中可看到文字/图形内容（非黑屏）

### 常见失败处理
| 错误 | 处理方式 |
|------|---------|
| `Could not find Chrome/Chromium` | 安装 Chromium：`npx remotion browser ensure` |
| 渲染超时 | 增加 `--timeout` 参数，或简化 Composition |
| 内存不足 | 增加服务器内存，或减少并发渲染 |
| `Canvas not supported` | 确保 Node.js 版本 >= 18 |

---

## 7. 飞书通知验证

### 步骤
1. 在飞书群中创建自定义机器人，获取 Webhook URL
2. 配置环境变量：
```bash
export FEISHU_WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx"
```
3. 启动后端并触发任务：
```bash
npm run dev:server
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"productName":"飞书测试商品","category":"electronics","price":99}'
```

### 验证标准
- [ ] 后端日志显示"飞书通知已配置"
- [ ] 任务创建后飞书群收到通知消息
- [ ] 任务完成后飞书群收到完成通知
- [ ] 通知内容包含商品名称和任务状态
- [ ] 未配置 Webhook 时，服务正常运行不报错（降级到 MockNotifier）

### 常见失败处理
| 错误 | 处理方式 |
|------|---------|
| 飞书未收到消息 | 检查 Webhook URL 是否正确，检查网络连通性 |
| `400 Bad Request` | 检查消息格式是否符合飞书 API 规范 |
| 服务启动报错 | 检查环境变量是否正确设置 |

---

## 8. 真实 LLM 接入验证（可选）

### 步骤
1. 配置 OpenAI API Key：
```bash
export OPENAI_API_KEY="sk-xxxxxxxx"
```
2. 修改 LLM Provider 配置，将 MockLLMProvider 替换为真实 Provider
3. 重启后端，触发生成任务

### 验证标准
- [ ] API 调用成功，无 401/429 错误
- [ ] 分镜脚本内容为真实 AI 生成（非模板化 mock 数据）
- [ ] 不同商品生成不同的卖点和分镜
- [ ] Token 消耗在合理范围内

---

## 9. 真实 TTS 接入验证（可选）

### 步骤
1. 配置 TTS API Key（如 MiniMax / Azure）
2. 修改 TTS Provider 配置，将 MockTTSProvider 替换为真实 Provider
3. 重启后端，触发生成任务

### 验证标准
- [ ] TTS API 调用成功
- [ ] 生成的音频文件可正常播放
- [ ] 音频内容与旁白文本一致
- [ ] 语速和情感符合标记要求

---

## 10. 验收通过标准

以下所有项均通过后，可认为 ShopMotion v1.1 迁移验证完成：

| # | 验收项 | 通过条件 |
|---|--------|---------|
| 1 | 依赖安装 | `npm install` 无报错 |
| 2 | 前端启动 | `npm run dev:frontend` 成功，页面可访问 |
| 3 | 后端启动 | `npm run dev:server` 成功，API 可调用 |
| 4 | 模板系统 | `/api/templates/families` 返回 15 个家族 |
| 5 | 商品类别 | `/api/categories` 返回 20 个类别 |
| 6 | Demo 商品 | `/api/demo-products` 返回 30 个商品 |
| 7 | 任务创建 | `POST /api/generate` 返回成功 |
| 8 | 分镜生成 | `/api/jobs/:id/storyboard` 返回有效分镜 |
| 9 | 字幕导出 | `/api/jobs/:id/captions.srt` 返回有效 SRT |
| 10 | Remotion Studio | Studio 可启动并预览 |
| 11 | 视频渲染 | 可导出 MP4 文件并播放 |
| 12 | 飞书通知 | 配置 Webhook 后可收到通知（可选） |
| 13 | TypeScript 编译 | `npm run typecheck` 无错误 |

**注**：第 12 项（飞书通知）和 LLM/TTS 接入为可选项，不影响核心功能验收。

---

## 附录：环境变量清单

```bash
# 必需（飞书通知）
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx

# 可选（真实 LLM）
OPENAI_API_KEY=sk-xxxxxxxx

# 可选（真实 TTS）
MINIMAX_API_KEY=xxxxxxxx
MINIMAX_GROUP_ID=xxxxxxxx
```

所有环境变量均通过 `.env` 文件或系统环境变量配置，代码中不硬编码任何密钥。
