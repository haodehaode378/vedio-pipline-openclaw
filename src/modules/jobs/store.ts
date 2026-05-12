import type { GenerationJob, JobStore } from './types.js';
import type { ProductInput } from '../product/types.js';

let jobCounter = 0;
function generateJobId(): string {
  return `job-${Date.now()}-${++jobCounter}`;
}

/** 内存任务存储 */
export class InMemoryJobStore implements JobStore {
  private jobs: Map<string, GenerationJob> = new Map();

  async create(input: ProductInput): Promise<GenerationJob> {
    const id = generateJobId();
    const now = new Date().toISOString();
    const job: GenerationJob = {
      id,
      input,
      status: 'queued',
      progress: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.jobs.set(id, job);
    return job;
  }

  async get(id: string): Promise<GenerationJob | undefined> {
    return this.jobs.get(id);
  }

  async list(): Promise<GenerationJob[]> {
    return Array.from(this.jobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async update(id: string, updates: Partial<GenerationJob>): Promise<GenerationJob> {
    const job = this.jobs.get(id);
    if (!job) throw new Error(`Job ${id} not found`);
    Object.assign(job, updates, { updatedAt: new Date().toISOString() });
    return job;
  }

  async delete(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }
}

/** 全局单例 */
export const jobStore = new InMemoryJobStore();
