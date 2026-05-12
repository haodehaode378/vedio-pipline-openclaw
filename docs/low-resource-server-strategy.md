# ShopMotion v1.1 - 低配置服务器策略文档

## 概述

本文档说明为什么当前不运行项目、如何在低配置服务器上安全工作，以及如何迁移到高配置环境继续验证。

## 1. 当前低配置服务器限制

### 硬件限制
- **内存**：可能不足 2GB，无法同时运行 Node.js 服务 + Remotion 渲染
- **CPU**：单核或双核，渲染性能不足
- **磁盘**：可能空间有限，无法存储大量渲染产物
- **网络**：可能无法访问外部 API（LLM、TTS）

### 软件限制
- Node.js 已安装，但依赖可能未完整安装
- Remotion 渲染需要 Chrome/Chromium，可能未安装
- 无 GPU 加速，视频渲染极慢

## 2. 不建议运行的命令

| 命令 | 原因 | 风险 |
|------|------|------|
| `npm install` | 可能需要下载大量依赖 | 磁盘空间不足、网络超时 |
| `npm run dev` | 启动开发服务器 | 内存不足导致卡死 |
| `npm run build` | 构建生产版本 | 内存和 CPU 不足 |
| `npx remotion render` | 渲染视频 | 极度消耗资源，可能卡死服务器 |
| `npx remotion studio` | 启动 Remotion Studio | 需要 Chrome，内存消耗大 |

## 3. 可以安全执行的静态工作

| 工作类型 | 说明 | 安全性 |
|---------|------|--------|
| 代码审查 | 阅读和理解代码结构 | ✅ 完全安全 |
| 文档编写 | 创建和更新文档 | ✅ 完全安全 |
| 类型检查 | 静态分析 TypeScript 类型 | ✅ 安全（不运行） |
| 代码优化 | 重构和优化代码 | ✅ 安全 |
| 配置完善 | 增强模板和配置 | ✅ 安全 |
| Demo 数据 | 扩展示例数据 | ✅ 安全 |
| API 文档 | 完善接口文档 | ✅ 安全 |

## 4. 后续迁移到高配置服务器的步骤

### 第一步：环境准备
```bash
# 1. 确保 Node.js >= 18
node --version

# 2. 确保 npm >= 9
npm --version

# 3. 确保安装了 Chrome/Chromium
google-chrome --version
# 或
chromium-browser --version
```

### 第二步：项目迁移
```bash
# 1. 克隆项目
git clone <repo-url>
cd ShopMotion

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env，配置 FEISHU_WEBHOOK_URL（可选）
```

### 第三步：分阶段验证
```bash
# 阶段1：验证后端 API
npm run dev:server
# 测试：curl http://localhost:3001/api/categories

# 阶段2：验证前端页面
npm run dev:frontend
# 访问：http://localhost:5173

# 阶段3：验证 Remotion 渲染
npm run dev:remotion
# 访问：http://localhost:3000

# 阶段4：验证视频导出
npx remotion render src/remotion/index.tsx ShopMotionVideo output/video.mp4
```

## 5. 推荐 Node.js 版本

| 版本 | 推荐度 | 说明 |
|------|--------|------|
| Node.js 18 LTS | ⭐⭐⭐ | 稳定，兼容性好 |
| Node.js 20 LTS | ⭐⭐⭐⭐ | 推荐，性能更好 |
| Node.js 22 | ⭐⭐⭐⭐⭐ | 最新，性能最佳 |

## 6. 推荐内存和 CPU 配置

### 最低配置（仅运行 API + 前端）
- **内存**：2GB
- **CPU**：2 核
- **磁盘**：5GB

### 推荐配置（含 Remotion 渲染）
- **内存**：4GB+
- **CPU**：4 核+
- **磁盘**：20GB+
- **GPU**：可选，但能显著加速渲染

### 高性能配置（批量渲染）
- **内存**：8GB+
- **CPU**：8 核+
- **磁盘**：50GB+
- **GPU**：推荐

## 7. Remotion 渲染资源需求说明

### 单个 30 秒视频渲染
- **内存**：约 500MB-1GB
- **CPU**：约 2-4 核，渲染时间 1-5 分钟
- **磁盘**：输出文件约 10-50MB

### 批量渲染 10 个视频
- **内存**：约 2-4GB
- **CPU**：约 4-8 核，渲染时间 10-30 分钟
- **磁盘**：输出文件约 100-500MB

### 渲染优化建议
1. 使用 `--concurrency` 参数控制并发数
2. 先用低质量预览，确认后再高质量渲染
3. 分批渲染，避免一次性渲染太多

## 8. 如何分阶段验证

### Phase 1：API 验证（无需 Chrome）
```bash
npm run dev:server
# 测试所有 API 端点
curl http://localhost:3001/api/categories
curl http://localhost:3001/api/templates/families
curl -X POST http://localhost:3001/api/generate -H "Content-Type: application/json" -d '{"name":"测试","category":"数码科技","price":100}'
```

### Phase 2：前端验证（需要浏览器）
```bash
npm run dev:frontend
# 访问 http://localhost:5173
# 测试商品输入、Demo 填充、任务查看
```

### Phase 3：Remotion 预览（需要 Chrome）
```bash
npm run dev:remotion
# 访问 http://localhost:3000
# 在 Studio 中预览模板效果
```

### Phase 4：视频导出（需要足够资源）
```bash
npx remotion render src/remotion/index.tsx ShopMotionVideo output/video.mp4
# 检查输出文件
```

## 9. 如何最小成本验证 Remotion Composition

1. **使用低分辨率**：先用 480x854 验证，再提升到 1080x1920
2. **使用短视频**：先用 5 秒验证，再扩展到 30 秒
3. **使用简单模板**：先用 TechClean 验证，再测试其他模板
4. **单场景验证**：先渲染单个场景，再渲染完整视频

## 10. 如何避免服务器卡死

### 预防措施
1. **监控资源**：使用 `htop` 或 `top` 监控 CPU 和内存
2. **设置超时**：为渲染任务设置超时时间
3. **限制并发**：不要同时运行多个渲染任务
4. **预留内存**：确保系统有足够剩余内存

### 紧急处理
```bash
# 如果服务器卡死，使用 SSH 连接后：
# 1. 查找 Node.js 进程
ps aux | grep node

# 2. 终止特定进程
kill -9 <pid>

# 3. 或终止所有 Node.js 进程
pkill -f node
```

### 预警信号
- CPU 使用率持续 > 90%
- 内存使用率持续 > 85%
- 系统响应变慢
- 交换空间（swap）使用增加

## 总结

当前低配置服务器适合进行静态增强工作（代码、文档、配置），不适合运行项目或渲染视频。迁移到高配置服务器后，按照分阶段验证策略逐步验证各项功能。
