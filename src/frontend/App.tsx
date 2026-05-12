// Frontend - Product Input Form + Job Status + Storyboard Display
import React, { useState, useEffect, useCallback } from 'react';
import type { ProductInput, GenerationJob, Storyboard, Scene, SellingPoint } from '../types/index.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

/** Main App Component */
export const App: React.FC = () => {
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(false);

  // Load existing jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE}/jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (e) {
      console.error('Failed to fetch jobs:', e);
    }
  };

  // Poll job status
  const pollJob = useCallback(async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/jobs/${jobId}`);
        const data: GenerationJob = await res.json();
        setJob(data);

        if (data.status === 'completed') {
          clearInterval(interval);
          setLoading(false);
          // Fetch storyboard
          const sbRes = await fetch(`${API_BASE}/jobs/${jobId}/storyboard`);
          const sbData = await sbRes.json();
          setStoryboard(sbData);
          fetchJobs();
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setLoading(false);
          fetchJobs();
        }
      } catch (e) {
        console.error('Poll error:', e);
      }
    }, 1000);
  }, []);

  // Submit new job
  const handleSubmit = async (input: ProductInput) => {
    setLoading(true);
    setJob(null);
    setStoryboard(null);

    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (data.jobId) {
        pollJob(data.jobId);
      }
    } catch (e) {
      console.error('Submit error:', e);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#FF4D4F' }}>🎬 ShopMotion</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>电商带货短视频自动生成系统</p>

      <ProductForm onSubmit={handleSubmit} loading={loading} />

      {job && <JobStatusCard job={job} />}

      {storyboard && <StoryboardDisplay storyboard={storyboard} />}

      {jobs.length > 0 && <JobHistory jobs={jobs} onSelect={(j) => { setJob(j); if (j.storyboard) setStoryboard(j.storyboard); }} />}
    </div>
  );
};

/** Product Input Form */
const ProductForm: React.FC<{ onSubmit: (input: ProductInput) => void; loading: boolean }> = ({
  onSubmit,
  loading,
}) => {
  const [form, setForm] = useState<ProductInput>({
    name: '',
    category: '',
    price: 0,
    description: '',
    targetAudience: '',
    keyFeatures: [],
  });
  const [featuresText, setFeaturesText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({ ...form, keyFeatures: features.length ? features : undefined });
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: 24, borderRadius: 12, marginBottom: 24 }}>
      <h2>商品信息输入</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        <label>
          商品名称 *
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 6, border: '1px solid #ddd' }}
            placeholder="例：超轻便携折叠伞"
          />
        </label>
        <label>
          商品类目 *
          <input
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 6, border: '1px solid #ddd' }}
            placeholder="例：日用百货"
          />
        </label>
        <label>
          价格 *
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.price || ''}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 6, border: '1px solid #ddd' }}
            placeholder="例：59.9"
          />
        </label>
        <label>
          商品描述
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 6, border: '1px solid #ddd', minHeight: 60 }}
            placeholder="描述商品的核心特点..."
          />
        </label>
        <label>
          目标人群
          <input
            value={form.targetAudience}
            onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
            style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 6, border: '1px solid #ddd' }}
            placeholder="例：上班族、学生"
          />
        </label>
        <label>
          核心卖点（每行一个）
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 6, border: '1px solid #ddd', minHeight: 60 }}
            placeholder="UPF50+防晒&#10;重量仅200g&#10;一键开合"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 16,
          padding: '12px 32px',
          backgroundColor: loading ? '#ccc' : '#FF4D4F',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        {loading ? '⏳ 生成中...' : '🚀 开始生成短视频'}
      </button>
    </form>
  );
};

/** Job Status Card */
const JobStatusCard: React.FC<{ job: GenerationJob }> = ({ job }) => {
  const statusLabels: Record<string, string> = {
    pending: '⏳ 排队中',
    analyzing: '🔍 分析中',
    'generating-selling-points': '💡 生成卖点中',
    'generating-storyboard': '🎬 生成分镜中',
    completed: '✅ 已完成',
    failed: '❌ 失败',
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <h3>任务状态</h3>
      <div style={{ fontSize: 18, marginBottom: 8 }}>{statusLabels[job.status] || job.status}</div>
      <div style={{ color: '#999', fontSize: 12 }}>任务ID: {job.id}</div>
      {job.error && <div style={{ color: 'red', marginTop: 8 }}>{job.error}</div>}
      {job.sellingPoints && job.sellingPoints.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>已生成卖点：</strong>
          <ul>
            {job.sellingPoints.map((sp) => (
              <li key={sp.id}>{sp.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/** Storyboard Display */
const StoryboardDisplay: React.FC<{ storyboard: Storyboard }> = ({ storyboard }) => {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 20, marginBottom: 24 }}>
      <h2>🎬 分镜脚本</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>商品：</strong>{storyboard.product.name} |
        <strong> 价格：</strong>¥{storyboard.product.price} |
        <strong> 总时长：</strong>{(storyboard.totalDurationInFrames / storyboard.fps).toFixed(1)}秒 |
        <strong> 场景数：</strong>{storyboard.scenes.length}
      </div>

      {/* Selling Points */}
      <h3>💡 卖点</h3>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        {storyboard.sellingPoints.map((sp) => (
          <div
            key={sp.id}
            style={{
              background: '#FFF1F0',
              border: '1px solid #FFCCC7',
              borderRadius: 8,
              padding: '8px 16px',
              flex: '1 1 200px',
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#FF4D4F' }}>{sp.title}</div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{sp.description}</div>
          </div>
        ))}
      </div>

      {/* Scenes */}
      <h3>📋 场景列表</h3>
      {storyboard.scenes.map((scene, i) => (
        <SceneCard key={scene.id} scene={scene} index={i} />
      ))}
    </div>
  );
};

/** Scene Card */
const SceneCard: React.FC<{ scene: Scene; index: number }> = ({ scene, index }) => {
  const typeEmoji: Record<string, string> = {
    hook: '🎣',
    feature: '⭐',
    demo: '🎯',
    'social-proof': '👥',
    cta: '🛒',
  };

  return (
    <div
      style={{
        background: '#fafafa',
        border: '1px solid #eee',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 20 }}>{typeEmoji[scene.type] || '🎬'}</span>
          <strong> 场景 {index + 1}：</strong>{scene.title}
        </div>
        <span style={{ color: '#999', fontSize: 12 }}>{(scene.durationInFrames / 30).toFixed(1)}s</span>
      </div>
      {scene.subtitle && <div style={{ color: '#666', marginBottom: 8 }}>{scene.subtitle}</div>}
      {scene.voiceover && (
        <div style={{ background: '#f0f0f0', padding: 8, borderRadius: 6, fontSize: 14, marginBottom: 8 }}>
          🎙️ 旁白：{scene.voiceover.text}
        </div>
      )}
      {scene.captions.length > 0 && (
        <div style={{ fontSize: 13, color: '#888' }}>
          📝 字幕：{scene.captions.map((c) => c.text).join(' → ')}
        </div>
      )}
    </div>
  );
};

/** Job History */
const JobHistory: React.FC<{ jobs: GenerationJob[]; onSelect: (job: GenerationJob) => void }> = ({
  jobs,
  onSelect,
}) => {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 20 }}>
      <h3>📜 历史任务</h3>
      {jobs.map((j) => (
        <div
          key={j.id}
          onClick={() => onSelect(j)}
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>{j.productInput.name}</span>
          <span style={{ color: j.status === 'completed' ? '#52c41a' : j.status === 'failed' ? '#ff4d4f' : '#999' }}>
            {j.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default App;
