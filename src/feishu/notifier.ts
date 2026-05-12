// Feishu Webhook Notifier - sends progress notifications to Feishu
import type { FeishuNotifier, NotificationPayload } from '../types/index.js';

export class FeishuWebhookNotifier implements FeishuNotifier {
  private webhookUrl: string | undefined;

  constructor() {
    // Only read from environment variable, never hardcode
    this.webhookUrl = process.env.FEISHU_WEBHOOK_URL;
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    if (!this.webhookUrl) {
      // No webhook configured, silently skip (don't log the URL)
      console.log(`[Feishu] Webhook not configured, skipping notification: ${payload.title}`);
      return false;
    }

    try {
      const statusEmoji = payload.status === 'success' ? '✅' : payload.status === 'error' ? '❌' : 'ℹ️';

      const body = {
        msg_type: 'interactive',
        card: {
          header: {
            title: {
              tag: 'plain_text',
              content: `${statusEmoji} ShopMotion - ${payload.title}`,
            },
            template: payload.status === 'success' ? 'green' : payload.status === 'error' ? 'red' : 'blue',
          },
          elements: [
            {
              tag: 'markdown',
              content: [
                `**状态**: ${payload.status}`,
                `**内容**: ${payload.content}`,
                payload.jobId ? `**任务ID**: ${payload.jobId}` : '',
                `**时间**: ${payload.timestamp}`,
              ]
                .filter(Boolean)
                .join('\n'),
            },
          ],
        },
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error(`[Feishu] Webhook returned ${response.status}`);
        return false;
      }

      return true;
    } catch (err) {
      console.error('[Feishu] Failed to send notification:', err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }
}
