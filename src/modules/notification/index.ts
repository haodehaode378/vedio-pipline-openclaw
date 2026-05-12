import type { NotificationProvider, NotificationPayload } from './types.js';

/** Mock 通知器 - 仅日志输出 */
export class MockNotifier implements NotificationProvider {
  async send(payload: NotificationPayload): Promise<boolean> {
    console.log(`[MockNotifier] ${payload.title}: ${payload.content}`);
    return true;
  }
  async sendProgressUpdate(jobId: string, phase: string, detail: string): Promise<boolean> {
    console.log(`[MockNotifier] 进度: ${jobId} - ${phase}: ${detail}`);
    return true;
  }
  async sendBlockedAlert(phase: string, reason: string, _options: string[]): Promise<boolean> {
    console.log(`[MockNotifier] 阻塞: ${phase} - ${reason}`);
    return true;
  }
  async sendFinalDelivery(summary: string): Promise<boolean> {
    console.log(`[MockNotifier] 最终交付: ${summary}`);
    return true;
  }
  async sendJobCreated(jobId: string, productName: string): Promise<boolean> {
    console.log(`[MockNotifier] 任务创建: ${jobId} - ${productName}`);
    return true;
  }
  async sendJobCompleted(jobId: string, productName: string): Promise<boolean> {
    console.log(`[MockNotifier] 任务完成: ${jobId} - ${productName}`);
    return true;
  }
  async sendJobFailed(jobId: string, error: string): Promise<boolean> {
    console.log(`[MockNotifier] 任务失败: ${jobId} - ${error}`);
    return true;
  }
  async sendTemplateResolved(jobId: string, familyId: string, reason: string): Promise<boolean> {
    console.log(`[MockNotifier] 模板解析: ${jobId} - ${familyId}: ${reason}`);
    return true;
  }
}

/** 飞书 Webhook 通知器 - 增强版 */
export class FeishuNotifier implements NotificationProvider {
  private webhookUrl: string | undefined;

  constructor() {
    this.webhookUrl = process.env.FEISHU_WEBHOOK_URL;
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    if (!this.webhookUrl) {
      console.log(`[Feishu] 未配置 Webhook，跳过通知: ${payload.title}`);
      return false;
    }
    return this.doSend(payload);
  }

  async sendProgressUpdate(jobId: string, phase: string, detail: string): Promise<boolean> {
    return this.send({
      title: '进度更新',
      content: `任务 ${jobId} | 阶段: ${phase} | ${detail}`,
      status: 'info',
      jobId,
      timestamp: new Date().toISOString(),
    });
  }

  async sendBlockedAlert(phase: string, reason: string, options: string[]): Promise<boolean> {
    return this.send({
      title: '阻塞提醒',
      content: `阶段: ${phase}\n原因: ${reason}\n选项: ${options.join(' / ')}`,
      status: 'warning',
      timestamp: new Date().toISOString(),
    });
  }

  async sendFinalDelivery(summary: string): Promise<boolean> {
    return this.send({
      title: 'v1 模板系统增强交付',
      content: summary,
      status: 'success',
      timestamp: new Date().toISOString(),
    });
  }

  async sendJobCreated(jobId: string, productName: string): Promise<boolean> {
    return this.send({
      title: '任务已创建',
      content: `商品「${productName}」的视频生成任务已创建`,
      status: 'info',
      jobId,
      timestamp: new Date().toISOString(),
    });
  }

  async sendJobCompleted(jobId: string, productName: string): Promise<boolean> {
    return this.send({
      title: '任务已完成',
      content: `商品「${productName}」的短视频分镜脚本已生成`,
      status: 'success',
      jobId,
      timestamp: new Date().toISOString(),
    });
  }

  async sendJobFailed(jobId: string, error: string): Promise<boolean> {
    return this.send({
      title: '任务失败',
      content: `任务 ${jobId} 处理失败: ${error}`,
      status: 'error',
      jobId,
      timestamp: new Date().toISOString(),
    });
  }

  async sendTemplateResolved(jobId: string, familyId: string, reason: string): Promise<boolean> {
    return this.send({
      title: '模板已解析',
      content: `任务 ${jobId} 推荐模板: ${familyId} | 原因: ${reason}`,
      status: 'info',
      jobId,
      timestamp: new Date().toISOString(),
    });
  }

  private async doSend(payload: NotificationPayload): Promise<boolean> {
    try {
      const statusEmoji = payload.status === 'success' ? '✅' : payload.status === 'error' ? '❌' : payload.status === 'warning' ? '⚠️' : 'ℹ️';
      const body = {
        msg_type: 'interactive',
        card: {
          header: {
            title: { tag: 'plain_text', content: `${statusEmoji} ShopMotion - ${payload.title}` },
            template: payload.status === 'success' ? 'green' : payload.status === 'error' ? 'red' : payload.status === 'warning' ? 'orange' : 'blue',
          },
          elements: [{
            tag: 'markdown',
            content: [`**状态**: ${payload.status}`, `**内容**: ${payload.content}`,
              payload.jobId ? `**任务ID**: ${payload.jobId}` : '',
              `**时间**: ${payload.timestamp}`].filter(Boolean).join('\n'),
          }],
        },
      };
      const response = await fetch(this.webhookUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.error(`[Feishu] Webhook 返回 ${response.status}`);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Feishu] 发送失败:', err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }
}

/** 创建通知器工厂 */
export function createNotifier(): NotificationProvider {
  if (process.env.FEISHU_WEBHOOK_URL) {
    return new FeishuNotifier();
  }
  return new MockNotifier();
}
