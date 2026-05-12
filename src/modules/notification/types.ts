/** 通知 Payload - 增强版 */
export interface NotificationPayload {
  title: string;
  content: string;
  status: 'info' | 'success' | 'error' | 'warning';
  jobId?: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

/** 通知 Provider 抽象 */
export interface NotificationProvider {
  send(payload: NotificationPayload): Promise<boolean>;
  sendProgressUpdate(jobId: string, phase: string, detail: string): Promise<boolean>;
  sendBlockedAlert(phase: string, reason: string, options: string[]): Promise<boolean>;
  sendFinalDelivery(summary: string): Promise<boolean>;
  sendJobCreated(jobId: string, productName: string): Promise<boolean>;
  sendJobCompleted(jobId: string, productName: string): Promise<boolean>;
  sendJobFailed(jobId: string, error: string): Promise<boolean>;
  sendTemplateResolved(jobId: string, familyId: string, reason: string): Promise<boolean>;
}
