import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import type { GenerationJob, ProductInput, GenerationStatus } from '../types/index.js';
import { MockLLMProvider } from '../core/mock-llm-provider.js';

// Recreate server logic for testing (isolated instance)
function createTestApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const jobs = new Map<string, GenerationJob>();
  const llmProvider = new MockLLMProvider();
  let jobCounter = 0;

  function generateJobId(): string {
    return `test-job-${Date.now()}-${++jobCounter}`;
  }

  // Mock notifier that doesn't need Feishu
  const notifier = {
    async send() {
      return true;
    },
  };

  app.post('/api/generate', async (req: Request, res: Response) => {
    try {
      const input: ProductInput = req.body;
      if (!input.name || !input.category || !input.price) {
        return res.status(400).json({ error: 'Missing required fields: name, category, price' });
      }

      const jobId = generateJobId();
      const now = new Date().toISOString();
      const job: GenerationJob = {
        id: jobId,
        productInput: input,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      jobs.set(jobId, job);
      res.status(201).json({ jobId, status: job.status });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/jobs', (_req: Request, res: Response) => {
    const allJobs = Array.from(jobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    res.json(allJobs);
  });

  app.get('/api/jobs/:id', (req: Request, res: Response) => {
    const job = jobs.get(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  });

  return { app, jobs };
}

// Helper to make HTTP requests to express app
async function request(
  app: express.Express,
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; body: any }> {
  return new Promise((resolve) => {
    const http = require('http');
    const server = app.listen(0, () => {
      const port = (server.address() as any).port;
      const options = {
        hostname: 'localhost',
        port,
        path,
        method,
        headers: { 'Content-Type': 'application/json' },
      };

      const req = http.request(options, (res: any) => {
        let data = '';
        res.on('data', (chunk: string) => (data += chunk));
        res.on('end', () => {
          server.close();
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  });
}

describe('Express API Server', () => {
  let app: express.Express;
  let jobs: Map<string, GenerationJob>;

  beforeAll(() => {
    const testApp = createTestApp();
    app = testApp.app;
    jobs = testApp.jobs;
  });

  describe('POST /api/generate', () => {
    it('应创建生成任务并返回 jobId', async () => {
      const res = await request(app, 'POST', '/api/generate', {
        name: '测试商品',
        category: '数码',
        price: 99.9,
        description: '测试描述',
      });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('jobId');
      expect(res.body.status).toBe('pending');
    });

    it('缺少必填字段应返回 400', async () => {
      const res = await request(app, 'POST', '/api/generate', {
        name: '测试商品',
      });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/jobs', () => {
    it('应返回任务列表', async () => {
      // First create a job
      await request(app, 'POST', '/api/generate', {
        name: '列表测试商品',
        category: '百货',
        price: 10,
        description: '描述',
      });

      const res = await request(app, 'GET', '/api/jobs');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('应返回指定任务详情', async () => {
      // Create a job first
      const createRes = await request(app, 'POST', '/api/generate', {
        name: '详情测试商品',
        category: '百货',
        price: 20,
        description: '描述',
      });
      const { jobId } = createRes.body;

      const res = await request(app, 'GET', `/api/jobs/${jobId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(jobId);
      expect(res.body.productInput.name).toBe('详情测试商品');
    });

    it('不存在的 jobId 应返回 404', async () => {
      const res = await request(app, 'GET', '/api/jobs/nonexistent-id');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});
