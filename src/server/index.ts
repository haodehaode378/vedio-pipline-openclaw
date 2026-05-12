// Express Backend - Task API Server
import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import type { GenerationJob, ProductInput, GenerationStatus } from '../types/index.js';
import { MockLLMProvider } from '../core/mock-llm-provider.js';
import { FeishuWebhookNotifier } from '../feishu/notifier.js';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory job store
const jobs = new Map<string, GenerationJob>();
const llmProvider = new MockLLMProvider();
const notifier = new FeishuWebhookNotifier();

let jobCounter = 0;
function generateJobId(): string {
  return `job-${Date.now()}-${++jobCounter}`;
}

// POST /api/generate - Create a new generation job
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

    // Process async
    processJob(jobId, input).catch((err) => {
      console.error(`Job ${jobId} failed:`, err);
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/jobs/:id - Get job status
app.get('/api/jobs/:id', (req: Request, res: Response) => {
  const job = jobs.get(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

// GET /api/jobs/:id/storyboard - Get storyboard for completed job
app.get('/api/jobs/:id/storyboard', (req: Request, res: Response) => {
  const job = jobs.get(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  if (job.status !== 'completed' || !job.storyboard) {
    return res.status(400).json({ error: 'Storyboard not ready', status: job.status });
  }
  res.json(job.storyboard);
});

// GET /api/jobs - List all jobs
app.get('/api/jobs', (_req: Request, res: Response) => {
  const allJobs = Array.from(jobs.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  res.json(allJobs);
});

// Process job asynchronously
async function processJob(jobId: string, input: ProductInput): Promise<void> {
  const updateStatus = (status: GenerationStatus) => {
    const job = jobs.get(jobId)!;
    job.status = status;
    job.updatedAt = new Date().toISOString();
  };

  try {
    // Step 1: Analyzing
    updateStatus('analyzing');
    await notifier.send({
      title: '任务开始处理',
      content: `商品「${input.name}」开始生成分析`,
      status: 'info',
      jobId,
      timestamp: new Date().toISOString(),
    });
    await sleep(300);

    // Step 2: Generate selling points
    updateStatus('generating-selling-points');
    const sellingPoints = await llmProvider.generateSellingPoints(input);
    const job1 = jobs.get(jobId)!;
    job1.sellingPoints = sellingPoints;
    await notifier.send({
      title: '卖点生成完成',
      content: `已生成 ${sellingPoints.length} 个卖点`,
      status: 'info',
      jobId,
      timestamp: new Date().toISOString(),
    });

    // Step 3: Generate storyboard
    updateStatus('generating-storyboard');
    const storyboard = await llmProvider.generateStoryboard(input, sellingPoints);
    const job2 = jobs.get(jobId)!;
    job2.storyboard = storyboard;

    // Step 4: Completed
    updateStatus('completed');
    await notifier.send({
      title: '任务完成',
      content: `商品「${input.name}」的短视频分镜脚本已生成，共 ${storyboard.scenes.length} 个场景`,
      status: 'success',
      jobId,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const job = jobs.get(jobId);
    if (job) {
      job.status = 'failed';
      job.error = err instanceof Error ? err.message : 'Unknown error';
      job.updatedAt = new Date().toISOString();
    }
    await notifier.send({
      title: '任务失败',
      content: `商品「${input.name}」处理失败: ${err instanceof Error ? err.message : '未知错误'}`,
      status: 'error',
      jobId,
      timestamp: new Date().toISOString(),
    });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`ShopMotion API running on http://localhost:${PORT}`);
});

export default app;
