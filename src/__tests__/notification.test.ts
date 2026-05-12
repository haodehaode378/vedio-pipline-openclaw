import { describe, it, expect } from 'vitest';
import { MockNotifier, FeishuNotifier, createNotifier } from '../modules/notification/index.js';

describe('MockNotifier', () => {
  const notifier = new MockNotifier();

  it('should send notification and return true', async () => {
    const result = await notifier.send({
      title: '测试',
      content: '内容',
      status: 'info',
      timestamp: new Date().toISOString(),
    });
    expect(result).toBe(true);
  });

  it('should send job created notification', async () => {
    const result = await notifier.sendJobCreated('job-1', '测试商品');
    expect(result).toBe(true);
  });

  it('should send job completed notification', async () => {
    const result = await notifier.sendJobCompleted('job-1', '测试商品');
    expect(result).toBe(true);
  });

  it('should send job failed notification', async () => {
    const result = await notifier.sendJobFailed('job-1', '测试错误');
    expect(result).toBe(true);
  });

  it('should send template resolved notification', async () => {
    const result = await notifier.sendTemplateResolved('job-1', 'TechClean', '适配类别');
    expect(result).toBe(true);
  });

  it('should send progress update', async () => {
    const result = await notifier.sendProgressUpdate('job-1', '生成中', '50%');
    expect(result).toBe(true);
  });

  it('should send blocked alert', async () => {
    const result = await notifier.sendBlockedAlert('渲染', '资源不足', ['重试', '跳过']);
    expect(result).toBe(true);
  });

  it('should send final delivery', async () => {
    const result = await notifier.sendFinalDelivery('交付完成');
    expect(result).toBe(true);
  });
});

describe('FeishuNotifier', () => {
  it('should return false when webhook URL not configured', async () => {
    const notifier = new FeishuNotifier();
    const result = await notifier.send({
      title: '测试',
      content: '内容',
      status: 'info',
      timestamp: new Date().toISOString(),
    });
    expect(result).toBe(false);
  });
});

describe('createNotifier', () => {
  it('should create MockNotifier when no webhook URL', () => {
    delete process.env.FEISHU_WEBHOOK_URL;
    const notifier = createNotifier();
    expect(notifier).toBeInstanceOf(MockNotifier);
  });

  it('should create FeishuNotifier when webhook URL is set', () => {
    process.env.FEISHU_WEBHOOK_URL = 'https://test.webhook.url';
    const notifier = createNotifier();
    expect(notifier).toBeInstanceOf(FeishuNotifier);
    delete process.env.FEISHU_WEBHOOK_URL;
  });
});
