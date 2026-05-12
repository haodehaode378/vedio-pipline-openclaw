# ShopMotion v1 - 飞书通知文档

## 概述

ShopMotion 支持通过飞书机器人 Webhook 推送任务状态通知。

## 配置方式

设置环境变量 `FEISHU_WEBHOOK_URL`：

```bash
export FEISHU_WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
```

> ⚠️ 安全要求：
> - 只能通过环境变量配置，禁止硬编码
> - 禁止将 Webhook URL 打印到日志
> - 禁止在 README 或文档中写入真实 Webhook

## 通知类型

| 类型 | 触发时机 | 格式 |
|------|---------|------|
| 任务创建 | POST /api/generate | ℹ️ 蓝色卡片 |
| 模板解析 | 模板推荐完成 | ℹ️ 蓝色卡片 |
| 任务完成 | 分镜脚本生成完成 | ✅ 绿色卡片 |
| 任务失败 | 处理过程出错 | ❌ 红色卡片 |
| 进度更新 | 阶段性进展 | ℹ️ 蓝色卡片 |
| 阻塞提醒 | 遇到阻塞 | ⚠️ 橙色卡片 |

## 降级策略

- `FEISHU_WEBHOOK_URL` 未配置 → 使用 MockNotifier（仅日志输出）
- 飞书发送失败 → 记录错误，不影响主流程
- 网络异常 → 捕获异常，记录失败原因

## 通知 Provider 接口

```typescript
interface NotificationProvider {
  send(payload: NotificationPayload): Promise<boolean>;
  sendProgressUpdate(jobId: string, phase: string, detail: string): Promise<boolean>;
  sendBlockedAlert(phase: string, reason: string, options: string[]): Promise<boolean>;
  sendFinalDelivery(summary: string): Promise<boolean>;
  sendJobCreated(jobId: string, productName: string): Promise<boolean>;
  sendJobCompleted(jobId: string, productName: string): Promise<boolean>;
  sendJobFailed(jobId: string, error: string): Promise<boolean>;
  sendTemplateResolved(jobId: string, familyId: string, reason: string): Promise<boolean>;
}
```

## 实现

- `MockNotifier` - 仅日志输出，用于开发环境
- `FeishuNotifier` - 真实飞书 Webhook 调用
- `createNotifier()` - 工厂方法，自动选择实现
