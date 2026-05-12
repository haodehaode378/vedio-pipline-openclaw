import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import type { Server } from 'http';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  const appModule = await import('../modules/server/index.js');
  const app = appModule.default;

  await new Promise<void>((resolve) => {
    server = createServer(app);
    server.listen(0, () => {
      const addr = server.address();
      const port = typeof addr === 'object' && addr ? addr.port : 3001;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

describe('API Endpoints', () => {
  it('GET /api/categories should return categories', async () => {
    const res = await fetch(`${baseUrl}/api/categories`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(20);
    expect(data[0].id).toBeDefined();
    expect(data[0].label).toBeDefined();
  });

  it('GET /api/demo-products should return demo products', async () => {
    const res = await fetch(`${baseUrl}/api/demo-products`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(30);
  });

  it('GET /api/demo-products/0 should return first demo product', async () => {
    const res = await fetch(`${baseUrl}/api/demo-products/0`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBeDefined();
    expect(data.category).toBeDefined();
  });

  it('GET /api/demo-products/999 should return 404', async () => {
    const res = await fetch(`${baseUrl}/api/demo-products/999`);
    expect(res.status).toBe(404);
  });

  it('GET /api/templates/families should return template families', async () => {
    const res = await fetch(`${baseUrl}/api/templates/families`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(15);
  });

  it('GET /api/templates/families/TechClean should return TechClean family', async () => {
    const res = await fetch(`${baseUrl}/api/templates/families/TechClean`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBe('TechClean');
  });

  it('GET /api/templates/families/nonexistent should return 404', async () => {
    const res = await fetch(`${baseUrl}/api/templates/families/nonexistent`);
    expect(res.status).toBe(404);
  });

  it('GET /api/templates/configs should return all configs', async () => {
    const res = await fetch(`${baseUrl}/api/templates/configs`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(45);
  });

  it('GET /api/templates/configs?familyId=TechClean should filter by family', async () => {
    const res = await fetch(`${baseUrl}/api/templates/configs?familyId=TechClean`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(3);
    data.forEach((c: any) => expect(c.familyId).toBe('TechClean'));
  });

  it('GET /api/templates/stats should return stats', async () => {
    const res = await fetch(`${baseUrl}/api/templates/stats`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.familyCount).toBe(15);
    expect(data.configCount).toBe(45);
  });

  it('POST /api/templates/resolve should recommend template', async () => {
    const res = await fetch(`${baseUrl}/api/templates/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productCategory: '数码科技' }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.familyId).toBe('TechClean');
  });

  it('POST /api/templates/resolve should return 400 without productCategory', async () => {
    const res = await fetch(`${baseUrl}/api/templates/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/generate should create a job', async () => {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '测试耳机',
        category: '数码科技',
        price: 299,
        description: '测试描述',
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.jobId).toBeDefined();
    expect(data.status).toBe('queued');
  });

  it('POST /api/generate should return 400 without required fields', async () => {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '只有名字' }),
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/jobs should return job list', async () => {
    const res = await fetch(`${baseUrl}/api/jobs`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('GET /api/jobs/:id should return 404 for non-existent job', async () => {
    const res = await fetch(`${baseUrl}/api/jobs/non-existent`);
    expect(res.status).toBe(404);
  });

  it('DELETE /api/jobs/:id should return 404 for non-existent job', async () => {
    const res = await fetch(`${baseUrl}/api/jobs/non-existent`, { method: 'DELETE' });
    expect(res.status).toBe(404);
  });
});
