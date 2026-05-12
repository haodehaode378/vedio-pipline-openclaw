// Enhanced Express Backend - Full v1 API Server
import express from 'express';
import cors from 'cors';
import type { Request, Response } from 'express';
import type { ProductInput } from '../product/types.js';
import type { GenerationStatus } from '../jobs/types.js';
import { jobStore } from '../jobs/store.js';
import { EnhancedMockLLMProvider } from '../generation/enhanced-llm.js';
import { resolver } from '../templates/resolver/index.js';
import { registry } from '../templates/registry/index.js';
import { categoryConfigs } from '../templates/presets/index.js';
import { demoProducts } from '../demo-data/products/index.js';
import { createNotifier } from '../notification/index.js';
import { generateSRT, generateCaptionsJSON } from '../captions/index.js';

const app = express();
app.use(cors());
app.use(express.json());

const llmProvider = new EnhancedMockLLMProvider();
const notifier = createNotifier();

// ==================== 商品相关 ====================

/** GET /api/categories - 获取商品类别列表 */
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(categoryConfigs.map((c) => ({ id: c.id, label: c.label, icon: c.icon })));
});

/** GET /api/demo-products - 获取 demo 商品列表 */
app.get('/api/demo-products', (_req: Request, res: Response) => {
  res.json(demoProducts.map((p, i) => ({ index: i, name: p.name, category: p.category, price: p.price })));
});

/** GET /api/demo-products/:index - 获取指定 demo 商品 */
app.get('/api/demo-products/:index', (req: Request, res: Response) => {
  const index = parseInt(req.params.index);
  if (isNaN(index) || index < 0 || index >= demoProducts.length) {
    return res.status(404).json({ error: 'Demo product not found' });
  }
  res.json(demoProducts[index]);
});

// ==================== 模板相关 ====================

/** GET /api/templates/families - 获取所有模板家族 */
app.get('/api/templates/families', (_req: Request, res: Response) => {
  res.json(registry.getAllFamilies());
});

/** GET /api/templates/families/:id - 获取指定模板家族 */
app.get('/api/templates/families/:id', (req: Request, res: Response) => {
  const family = registry.getFamily(req.params.id);
  if (!family) return res.status(404).json({ error: 'Template family not found' });
  res.json(family);
});

/** GET /api/templates/configs - 获取所有模板配置 */
app.get('/api/templates/configs', (_req: Request, res: Response) => {
  const familyId = req.query.familyId as string;
  if (familyId) {
    res.json(registry.getConfigsByFamily(familyId));
  } else {
    res.json(registry.getAllConfigs());
  }
});

/** GET /api/templates/stats - 获取模板统计 */
app.get('/api/templates/stats', (_req: Request, res: Response) => {
  res.json({
    familyCount: registry.familyCount,
    configCount: registry.configCount,
    totalCombinations: registry.totalCombinations,
  });
});

/** POST /api/templates/resolve - 推荐模板 */
app.post('/api/templates/resolve', (req: Request, res: Response) => {
  const { productCategory, videoStyle, marketingGoal, aspectRatio, duration, targetAudience, manualFamilyId } = req.body;
  if (!productCategory) {
    return res.status(400).json({ error: 'Missing productCategory' });
  }
  const recommendation = resolver.resolve({
    productCategory, videoStyle, marketingGoal, aspectRatio, duration, targetAudience, manualFamilyId,
  });
  res.json(recommendation);
});

// ==================== 任务相关 ====================

/** POST /api/generate - 创建生成任务 */
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const input: ProductInput = req.body;
    if (!input.name || !input.category || !input.price) {
      return res.status(400).json({ error: '缺少必填字段: name, category, price' });
    }

    const job = await jobStore.create(input);
    res.status(201).json({ jobId: job.id, status: job.status });

    // 异步处理
    processJob(job.id, input).catch((err) => {
      console.error(`Job ${job.id} failed:`, err);
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/** GET /api/jobs - 任务列表 */
app.get('/api/jobs', async (_req: Request, res: Response) => {
  const jobs = await jobStore.list();
  res.json(jobs);
});

/** GET /api/jobs/:id - 任务详情 */
app.get('/api/jobs/:id', async (req: Request, res: Response) => {
  const job = await jobStore.get(req.params.id);
  if (!job) return res.status(404).json({ error: '任务不存在' });
  res.json(job);
});

/** GET /api/jobs/:id/storyboard - 获取分镜脚本 */
app.get('/api/jobs/:id/storyboard', async (req: Request, res: Response) => {
  const job = await jobStore.get(req.params.id);
  if (!job) return res.status(404).json({ error: '任务不存在' });
  if (!job.storyboard) return res.status(400).json({ error: '分镜脚本未就绪', status: job.status });
  res.json(job.storyboard);
});

/** GET /api/jobs/:id/template - 获取模板推荐 */
app.get('/api/jobs/:id/template', async (req: Request, res: Response) => {
  const job = await jobStore.get(req.params.id);
  if (!job) return res.status(404).json({ error: '任务不存在' });
  if (!job.templateRecommendation) return res.status(400).json({ error: '模板推荐未就绪', status: job.status });
  res.json(job.templateRecommendation);
});

/** GET /api/jobs/:id/captions - 获取字幕 */
app.get('/api/jobs/:id/captions', async (req: Request, res: Response) => {
  const job = await jobStore.get(req.params.id);
  if (!job) return res.status(404).json({ error: '任务不存在' });
  if (!job.storyboard) return res.status(400).json({ error: '字幕未就绪' });
  res.json(job.storyboard.captions);
});

/** GET /api/jobs/:id/captions.srt - 导出 SRT 字幕 */
app.get('/api/jobs/:id/captions.srt', async (req: Request, res: Response) => {
  const job = await jobStore.get(req.params.id);
  if (!job) return res.status(404).json({ error: '任务不存在' });
  if (!job.storyboard) return res.status(400).json({ error: '字幕未就绪' });
  const srt = generateSRT(job.storyboard.captions);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="job-${job.id}.srt"`);
  res.send(srt);
});

/** GET /api/jobs/:id/voiceover - 获取旁白时间轴 */
app.get('/api/jobs/:id/voiceover', async (req: Request, res: Response) => {
  const job = await jobStore.get(req.params.id);
  if (!job) return res.status(404).json({ error: '任务不存在' });
  if (!job.storyboard) return res.status(400).json({ error: '旁白未就绪' });
  res.json(job.storyboard.voiceover);
});

/** DELETE /api/jobs/:id - 删除任务 */
app.delete('/api/jobs/:id', async (req: Request, res: Response) => {
  const deleted = await jobStore.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: '任务不存在' });
  res.json({ success: true });
});

/** POST /api/jobs/:id/regenerate - 重新生成 */
app.post('/api/jobs/:id/regenerate', async (req: Request, res: Response) => {
  const job = await jobStore.get(req.params.id);
  if (!job) return res.status(404).json({ error: '任务不存在' });
  await jobStore.update(job.id, { status: 'queued', progress: 0, error: undefined, storyboard: undefined, templateRecommendation: undefined });
  res.json({ jobId: job.id, status: 'queued' });
  processJob(job.id, job.input).catch(console.error);
});

// ==================== 任务处理流程 ====================

async function processJob(jobId: string, input: ProductInput): Promise<void> {
  const updateStatus = async (status: GenerationStatus, progress: number) => {
    await jobStore.update(jobId, { status, progress });
  };

  try {
    // Step 1: 生成脚本
    await updateStatus('generating_script', 10);
    await notifier.sendJobCreated(jobId, input.name);
    await sleep(200);

    const sellingPoints = await llmProvider.generateSellingPoints(input);
    await jobStore.update(jobId, { progress: 30 });

    // Step 2: 解析模板
    await updateStatus('resolving_template', 40);
    const templateRec = resolver.resolve({
      productCategory: input.category,
      videoStyle: input.videoStyle,
      marketingGoal: input.marketingGoal,
      aspectRatio: input.preferredAspectRatio,
      duration: input.preferredDuration,
      targetAudience: input.targetAudience,
    });
    await jobStore.update(jobId, { templateRecommendation: templateRec });
    await notifier.sendTemplateResolved(jobId, templateRec.familyId, templateRec.reason);
    await sleep(200);

    // Step 3: 生成分镜
    await updateStatus('generating_assets', 60);
    const storyboard = await llmProvider.generateStoryboard(input, sellingPoints, templateRec);
    await jobStore.update(jobId, { storyboard, progress: 80 });

    // Step 4: 完成
    await updateStatus('completed', 100);
    await jobStore.update(jobId, {
      artifacts: [
        { type: 'storyboard', path: `/api/jobs/${jobId}/storyboard`, createdAt: new Date().toISOString() },
        { type: 'captions-srt', path: `/api/jobs/${jobId}/captions.srt`, createdAt: new Date().toISOString() },
        { type: 'captions-json', path: `/api/jobs/${jobId}/captions`, createdAt: new Date().toISOString() },
        { type: 'voiceover-timeline', path: `/api/jobs/${jobId}/voiceover`, createdAt: new Date().toISOString() },
      ],
    });
    await notifier.sendJobCompleted(jobId, input.name);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : '未知错误';
    await jobStore.update(jobId, { status: 'failed', error: errorMsg });
    await notifier.sendJobFailed(jobId, errorMsg);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`ShopMotion API v1 running on http://localhost:${PORT}`);
  console.log(`Template families: ${registry.familyCount}, configs: ${registry.configCount}`);
});

export default app;
