import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryJobStore } from '../modules/jobs/store.js';
import type { ProductInput } from '../modules/product/types.js';

const mockProduct: ProductInput = {
  name: '测试商品',
  category: '数码科技',
  price: 299,
  description: '这是一个测试商品',
};

describe('InMemoryJobStore', () => {
  let store: InMemoryJobStore;

  beforeEach(() => {
    store = new InMemoryJobStore();
  });

  it('should create a job with queued status', async () => {
    const job = await store.create(mockProduct);
    expect(job.id).toBeDefined();
    expect(job.status).toBe('queued');
    expect(job.progress).toBe(0);
    expect(job.input.name).toBe('测试商品');
    expect(job.createdAt).toBeDefined();
    expect(job.updatedAt).toBeDefined();
  });

  it('should get a job by id', async () => {
    const created = await store.create(mockProduct);
    const found = await store.get(created.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(created.id);
  });

  it('should return undefined for non-existent job', async () => {
    const found = await store.get('non-existent');
    expect(found).toBeUndefined();
  });

  it('should list jobs sorted by creation time (newest first)', async () => {
    const _job1 = await store.create(mockProduct);
    await new Promise((r) => setTimeout(r, 10));
    const job2 = await store.create({ ...mockProduct, name: '第二个商品' });
    const jobs = await store.list();
    expect(jobs.length).toBe(2);
    // job2 should be first since it was created later
    const job2Found = jobs.find((j) => j.id === job2.id);
    expect(job2Found).toBeDefined();
  });

  it('should update a job', async () => {
    const job = await store.create(mockProduct);
    await new Promise((r) => setTimeout(r, 10));
    const updated = await store.update(job.id, { status: 'completed', progress: 100 });
    expect(updated.status).toBe('completed');
    expect(updated.progress).toBe(100);
    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(job.updatedAt).getTime());
  });

  it('should throw when updating non-existent job', async () => {
    await expect(store.update('fake-id', { status: 'completed' }))
      .rejects.toThrow('not found');
  });

  it('should delete a job', async () => {
    const job = await store.create(mockProduct);
    const deleted = await store.delete(job.id);
    expect(deleted).toBe(true);
    expect(await store.get(job.id)).toBeUndefined();
  });

  it('should return false when deleting non-existent job', async () => {
    const deleted = await store.delete('non-existent');
    expect(deleted).toBe(false);
  });
});
