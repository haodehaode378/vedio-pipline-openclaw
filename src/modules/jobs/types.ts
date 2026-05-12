/** 生成任务状态 - 增强版 */
export type GenerationStatus =
  | 'queued'
  | 'generating_script'
  | 'resolving_template'
  | 'generating_assets'
  | 'ready_for_preview'
  | 'rendering'
  | 'completed'
  | 'failed';

/** 渲染产物 */
export interface GenerationArtifact {
  type: 'storyboard' | 'captions-srt' | 'captions-json' | 'voiceover-timeline' | 'preview-url';
  path: string;
  size?: number;
  createdAt: string;
}

/** 生成任务 - 增强版 */
export interface GenerationJob {
  id: string;
  input: import('../product/types.js').ProductInput;
  storyboard?: import('../storyboard/types.js').Storyboard;
  templateRecommendation?: import('../templates/types.js').TemplateRecommendation;
  status: GenerationStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  error?: string;
  artifacts?: GenerationArtifact[];
}

/** JobStore 抽象 */
export interface JobStore {
  create(input: import('../product/types.js').ProductInput): Promise<GenerationJob>;
  get(id: string): Promise<GenerationJob | undefined>;
  list(): Promise<GenerationJob[]>;
  update(id: string, updates: Partial<GenerationJob>): Promise<GenerationJob>;
  delete(id: string): Promise<boolean>;
}
