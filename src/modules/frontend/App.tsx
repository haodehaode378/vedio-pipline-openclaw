// Enhanced Frontend - Full v1 Template System UI
import React, { useState, useEffect, useCallback } from 'react';
import type { ProductInput, ProductCategory, MarketingGoal, VideoStylePreset } from '../product/types.js';
import type { GenerationJob } from '../jobs/types.js';
import type { Storyboard, Scene } from '../storyboard/types.js';
import type { TemplateRecommendation } from '../templates/types.js';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

// ==================== Main App ====================
export const App: React.FC = () => {
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [templateRec, setTemplateRec] = useState<TemplateRecommendation | null>(null);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; label: string; icon: string }>>([]);
  const [demoProducts, setDemoProducts] = useState<Array<{ index: number; name: string; category: string; price: number }>>([]);
  const [templateFamilies, setTemplateFamilies] = useState<any[]>([]);
  const [templateStats, setTemplateStats] = useState({ familyCount: 0, configCount: 0, totalCombinations: 0 });
  const [activeTab, setActiveTab] = useState<'create' | 'history' | 'templates'>('create');

  useEffect(() => {
    fetchJobs();
    fetchCategories();
    fetchDemoProducts();
    fetchTemplateFamilies();
    fetchTemplateStats();
  }, []);

  const fetchJobs = async () => {
    try { const r = await fetch(`${API}/jobs`); setJobs(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchCategories = async () => {
    try { const r = await fetch(`${API}/categories`); setCategories(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchDemoProducts = async () => {
    try { const r = await fetch(`${API}/demo-products`); setDemoProducts(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchTemplateFamilies = async () => {
    try { const r = await fetch(`${API}/templates/families`); setTemplateFamilies(await r.json()); } catch (e) { console.error(e); }
  };
  const fetchTemplateStats = async () => {
    try { const r = await fetch(`${API}/templates/stats`); setTemplateStats(await r.json()); } catch (e) { console.error(e); }
  };

  const pollJob = useCallback(async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const r = await fetch(`${API}/jobs/${jobId}`);
        const data: GenerationJob = await r.json();
        setJob(data);
        if (data.status === 'completed') {
          clearInterval(interval);
          setLoading(false);
          const sbR = await fetch(`${API}/jobs/${jobId}/storyboard`);
          setStoryboard(await sbR.json());
          try {
            const tR = await fetch(`${API}/jobs/${jobId}/template`);
            setTemplateRec(await tR.json());
          } catch { /* template not ready yet */ }
          fetchJobs();
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setLoading(false);
          fetchJobs();
        }
      } catch (e) { console.error(e); }
    }, 800);
  }, []);

  const handleSubmit = async (input: ProductInput) => {
    setLoading(true); setJob(null); setStoryboard(null); setTemplateRec(null);
    try {
      const r = await fetch(`${API}/generate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await r.json();
      if (data.jobId) pollJob(data.jobId);
    } catch (e) { console.error(e); setLoading(false); }
  };

  const handleDemoFill = async (index: number) => {
    try {
      const r = await fetch(`${API}/demo-products/${index}`);
      const product = await r.json();
      handleSubmit(product);
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa', fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>🎬 ShopMotion v1</h1>
          <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: 14 }}>电商带货短视频自动生成系统 · 模板系统增强版</p>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, opacity: 0.9 }}>
          <span>📦 {templateStats.familyCount} 模板家族</span>
          <span>🎨 {templateStats.configCount} 配置</span>
          <span>🔀 {templateStats.totalCombinations} 组合</span>
        </div>
      </header>

      {/* Low Config Server Notice */}
      <div style={{ background: '#fff3cd', padding: '10px 32px', fontSize: 13, color: '#856404', borderBottom: '1px solid #ffc107' }}>
        ⚠️ 当前为低配置服务器环境，部分功能（真实渲染、TTS合成）尚未验证。如需完整体验，请迁移到高配置服务器。
      </div>

      {/* Tab Navigation */}
      <nav style={{ display: 'flex', gap: 0, background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 32px' }}>
        {([['create', '🚀 创建视频'], ['history', '📜 任务历史'], ['templates', '🎨 模板系统']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            style={{
              padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 15, fontWeight: activeTab === key ? 600 : 400,
              color: activeTab === key ? '#667eea' : '#666',
              borderBottom: activeTab === key ? '3px solid #667eea' : '3px solid transparent',
            }}>
            {label}
          </button>
        ))}
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {activeTab === 'create' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <ProductForm onSubmit={handleSubmit} loading={loading} categories={categories} />
              <DemoProductsBar products={demoProducts} onSelect={handleDemoFill} loading={loading} />
            </div>
            <div>
              {job && <JobStatusCard job={job} />}
              {templateRec && <TemplateRecommendationCard rec={templateRec} />}
              {storyboard && <StoryboardDisplay storyboard={storyboard} />}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <JobHistory jobs={jobs} onSelect={(j) => {
            setJob(j);
            if (j.storyboard) setStoryboard(j.storyboard);
            if (j.templateRecommendation) setTemplateRec(j.templateRecommendation);
            setActiveTab('create');
          }} />
        )}

        {activeTab === 'templates' && (
          <TemplateSystemView families={templateFamilies} stats={templateStats} categories={categories} />
        )}
      </div>
    </div>
  );
};

// ==================== Product Form ====================
const ProductForm: React.FC<{
  onSubmit: (input: ProductInput) => void;
  loading: boolean;
  categories: Array<{ id: string; label: string; icon: string }>;
}> = ({ onSubmit, loading, categories }) => {
  const [form, setForm] = useState<ProductInput>({
    name: '', category: '数码科技', price: 0, description: '',
    targetAudience: '', keyFeatures: [], marketingGoal: '种草',
    videoStyle: '科技简洁', preferredDuration: 30, preferredAspectRatio: '9:16',
  });
  const [featuresText, setFeaturesText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText.split('\n').map((s) => s.trim()).filter(Boolean);
    onSubmit({ ...form, keyFeatures: features.length ? features : undefined });
  };

  const styles: VideoStylePreset[] = ['科技简洁', '科技高端', '生活种草', '美妆柔和', '强促销', '食品清新', '家居温馨', '服饰潮流', '运动活力', '母婴安心', '宠物亲和', '学习办公', '健康个护', '汽车用品', '节日礼赠'];
  const goals: MarketingGoal[] = ['种草', '促销', '讲解', '品牌', '新品发布', '节日营销'];

  const inputStyle = { width: '100%', padding: '10px 12px', marginTop: 4, borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', marginBottom: 12, fontSize: 14, color: '#333' };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 20 }}>📝 商品信息</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <label style={labelStyle}>
          商品名称 *
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle} placeholder="例：蓝牙降噪耳机" />
        </label>
        <label style={labelStyle}>
          商品类别 *
          <select required value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
            style={inputStyle}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
        </label>
        <label style={labelStyle}>
          价格 *
          <input required type="number" min="0" step="0.01" value={form.price || ''}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            style={inputStyle} placeholder="599" />
        </label>
        <label style={labelStyle}>
          原价
          <input type="number" min="0" step="0.01" value={form.originalPrice || ''}
            onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || undefined })}
            style={inputStyle} placeholder="899" />
        </label>
      </div>
      <label style={labelStyle}>
        商品描述
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ ...inputStyle, minHeight: 60 }} placeholder="描述商品核心特点..." />
      </label>
      <label style={labelStyle}>
        目标人群
        <input value={form.targetAudience} onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
          style={inputStyle} placeholder="例：科技爱好者、通勤族" />
      </label>
      <label style={labelStyle}>
        核心卖点（每行一个）
        <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)}
          style={{ ...inputStyle, minHeight: 60 }} placeholder="自适应降噪&#10;30小时续航&#10;IPX5防水" />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
        <label style={labelStyle}>
          营销目标
          <select value={form.marketingGoal}
            onChange={(e) => setForm({ ...form, marketingGoal: e.target.value as MarketingGoal })}
            style={inputStyle}>
            {goals.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label style={labelStyle}>
          视频风格
          <select value={form.videoStyle}
            onChange={(e) => setForm({ ...form, videoStyle: e.target.value as VideoStylePreset })}
            style={inputStyle}>
            {styles.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label style={labelStyle}>
          视频时长
          <select value={form.preferredDuration}
            onChange={(e) => setForm({ ...form, preferredDuration: parseInt(e.target.value) as any })}
            style={inputStyle}>
            <option value={15}>15 秒</option>
            <option value={30}>30 秒</option>
            <option value={45}>45 秒</option>
          </select>
        </label>
      </div>

      <button type="submit" disabled={loading}
        style={{
          marginTop: 8, padding: '14px 32px',
          background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff', border: 'none', borderRadius: 10, fontSize: 16,
          cursor: loading ? 'not-allowed' : 'pointer', width: '100%', fontWeight: 600,
        }}>
        {loading ? '⏳ 生成中...' : '🚀 开始生成短视频'}
      </button>
    </form>
  );
};

// ==================== Demo Products Bar ====================
const DemoProductsBar: React.FC<{
  products: Array<{ index: number; name: string; category: string; price: number }>;
  onSelect: (index: number) => void;
  loading: boolean;
}> = ({ products, onSelect, loading }) => (
  <div style={{ background: '#fff', padding: 20, borderRadius: 12, marginTop: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
    <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>🎯 Demo 商品一键填充</h3>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {products.map((p) => (
        <button key={p.index} onClick={() => onSelect(p.index)} disabled={loading}
          style={{
            padding: '8px 14px', borderRadius: 20, border: '1px solid #e0e0e0',
            background: '#f9f9f9', cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 13, transition: 'all 0.2s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#667eea'; e.currentTarget.style.color = '#667eea'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#333'; }}>
          {p.name} · ¥{p.price}
        </button>
      ))}
    </div>
  </div>
);

// ==================== Job Status Card ====================
const statusLabels: Record<string, string> = {
  queued: '⏳ 排队中', generating_script: '📝 生成脚本中', resolving_template: '🎨 解析模板中',
  generating_assets: '🎬 生成素材中', ready_for_preview: '👀 预览就绪',
  rendering: '🎥 渲染中', completed: '✅ 已完成', failed: '❌ 失败',
};

const statusProgress: Record<string, number> = {
  queued: 5, generating_script: 25, resolving_template: 45,
  generating_assets: 65, ready_for_preview: 80, rendering: 90, completed: 100, failed: 0,
};

const JobStatusCard: React.FC<{ job: GenerationJob }> = ({ job }) => (
  <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
    <h3 style={{ margin: '0 0 12px' }}>📊 任务状态</h3>
    <div style={{ fontSize: 18, marginBottom: 8 }}>{statusLabels[job.status] || job.status}</div>
    {/* Progress bar */}
    <div style={{ background: '#f0f0f0', borderRadius: 4, height: 8, marginBottom: 12 }}>
      <div style={{
        background: job.status === 'failed' ? '#ff4d4f' : 'linear-gradient(90deg, #667eea, #764ba2)',
        height: '100%', borderRadius: 4, width: `${job.progress || statusProgress[job.status] || 0}%`,
        transition: 'width 0.5s',
      }} />
    </div>
    <div style={{ color: '#999', fontSize: 12 }}>任务ID: {job.id}</div>
    {job.error && <div style={{ color: 'red', marginTop: 8, fontSize: 13 }}>{job.error}</div>}
  </div>
);

// ==================== Template Recommendation Card ====================
const TemplateRecommendationCard: React.FC<{ rec: TemplateRecommendation }> = ({ rec }) => (
  <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16, border: '1px solid #e8e8e8' }}>
    <h3 style={{ margin: '0 0 12px' }}>🎨 模板推荐</h3>
    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      <div style={{ background: '#f0f0ff', padding: '8px 16px', borderRadius: 8, fontSize: 14 }}>
        <strong>模板家族：</strong>{rec.familyId}
      </div>
      <div style={{ background: '#f0fff0', padding: '8px 16px', borderRadius: 8, fontSize: 14 }}>
        <strong>置信度：</strong>{Math.round(rec.confidence * 100)}%
      </div>
    </div>
    <div style={{ fontSize: 13, color: '#666' }}>
      <strong>推荐理由：</strong>{rec.reason}
    </div>
    {rec.fallbackUsed && (
      <div style={{ fontSize: 12, color: '#ff9800', marginTop: 4 }}>⚠️ 使用了默认推荐（未找到精确匹配）</div>
    )}
    <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {rec.supportedSceneTypes.map((t) => (
        <span key={t} style={{ background: '#f5f5f5', padding: '3px 10px', borderRadius: 12, fontSize: 12, color: '#666' }}>{t}</span>
      ))}
    </div>
  </div>
);

// ==================== Storyboard Display ====================
const StoryboardDisplay: React.FC<{ storyboard: Storyboard }> = ({ storyboard }) => (
  <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
    <h2 style={{ margin: '0 0 16px' }}>🎬 分镜脚本</h2>
    <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 14, color: '#666', flexWrap: 'wrap' }}>
      <span>📦 {storyboard.product.name}</span>
      <span>💰 ¥{storyboard.product.price}</span>
      <span>⏱ {storyboard.videoMeta.duration}秒</span>
      <span>🎬 {storyboard.scenes.length}个场景</span>
      <span>🎨 {storyboard.template.familyId}</span>
    </div>

    {/* Selling Points */}
    <h3 style={{ fontSize: 16, margin: '12px 0 8px' }}>💡 卖点</h3>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      {storyboard.product.sellingPoints.map((sp) => (
        <div key={sp.id} style={{ background: '#f0f0ff', border: '1px solid #d0d0ff', borderRadius: 8, padding: '6px 14px', flex: '1 1 180px' }}>
          <div style={{ fontWeight: 600, color: '#667eea', fontSize: 13 }}>{sp.title}</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{sp.description.slice(0, 40)}</div>
        </div>
      ))}
    </div>

    {/* Captions */}
    <h3 style={{ fontSize: 16, margin: '12px 0 8px' }}>📝 字幕时间轴</h3>
    <div style={{ background: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13 }}>
      {storyboard.captions.segments.map((seg) => (
        <div key={seg.id} style={{ display: 'flex', gap: 12, padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ color: '#999', fontFamily: 'monospace', minWidth: 100 }}>
            {seg.startTime.toFixed(1)}s → {seg.endTime.toFixed(1)}s
          </span>
          <span>{seg.text}</span>
        </div>
      ))}
    </div>

    {/* Scenes */}
    <h3 style={{ fontSize: 16, margin: '12px 0 8px' }}>📋 场景列表</h3>
    {storyboard.scenes.map((scene, i) => (
      <SceneCard key={scene.id} scene={scene} index={i} />
    ))}

    {/* Export links */}
    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
      <a href={`${API}/jobs/${storyboard.id}/captions.srt`} target="_blank" rel="noopener"
        style={{ padding: '8px 16px', background: '#f5f5f5', borderRadius: 8, textDecoration: 'none', color: '#333', fontSize: 13 }}>
        📥 导出 SRT 字幕
      </a>
    </div>
  </div>
);

const SceneCard: React.FC<{ scene: Scene; index: number }> = ({ scene, index }) => {
  const emojis: Record<string, string> = {
    hook: '🎣', product_reveal: '📦', selling_point: '⭐', scenario: '🌟',
    comparison: '⚖️', proof: '✅', price_offer: '💰', cta: '🛒',
  };
  return (
    <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 8, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 18 }}>{emojis[scene.type] || '🎬'}</span>
          <strong> 场景 {index + 1}：</strong>{scene.title}
        </div>
        <span style={{ color: '#999', fontSize: 12 }}>{scene.durationInSeconds.toFixed(1)}s</span>
      </div>
      <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>🎙️ {scene.narration}</div>
      <div style={{ fontSize: 12, color: '#888' }}>📝 {scene.caption}</div>
    </div>
  );
};

// ==================== Job History ====================
const JobHistory: React.FC<{ jobs: GenerationJob[]; onSelect: (job: GenerationJob) => void }> = ({ jobs, onSelect }) => (
  <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
    <h2 style={{ margin: '0 0 16px' }}>📜 任务历史</h2>
    {jobs.length === 0 ? (
      <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>暂无任务</p>
    ) : (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
            <th style={{ textAlign: 'left', padding: 10 }}>商品</th>
            <th style={{ textAlign: 'left', padding: 10 }}>类别</th>
            <th style={{ textAlign: 'left', padding: 10 }}>模板</th>
            <th style={{ textAlign: 'left', padding: 10 }}>状态</th>
            <th style={{ textAlign: 'left', padding: 10 }}>时间</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} onClick={() => onSelect(j)} style={{ cursor: 'pointer', borderBottom: '1px solid #f5f5f5' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f9f9ff'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: 10 }}>{j.input.name}</td>
              <td style={{ padding: 10 }}>{j.input.category}</td>
              <td style={{ padding: 10 }}>{j.templateRecommendation?.familyId || '-'}</td>
              <td style={{ padding: 10 }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 12, fontSize: 12,
                  background: j.status === 'completed' ? '#e8f5e9' : j.status === 'failed' ? '#ffebee' : '#f5f5f5',
                  color: j.status === 'completed' ? '#2e7d32' : j.status === 'failed' ? '#c62828' : '#666',
                }}>
                  {statusLabels[j.status] || j.status}
                </span>
              </td>
              <td style={{ padding: 10, color: '#999', fontSize: 12 }}>{new Date(j.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

// ==================== Template System View ====================
const TemplateSystemView: React.FC<{
  families: any[];
  stats: { familyCount: number; configCount: number; totalCombinations: number };
  categories: Array<{ id: string; label: string; icon: string }>;
}> = ({ families, stats, categories: _categories }) => (
  <div>
    {/* Stats */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
      {[
        { label: '模板家族', value: stats.familyCount, color: '#667eea' },
        { label: '模板配置', value: stats.configCount, color: '#764ba2' },
        { label: '可扩展组合', value: stats.totalCombinations, color: '#f093fb' },
      ].map((s) => (
        <div key={s.label} style={{
          background: '#fff', padding: 24, borderRadius: 12, textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}`,
        }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>

    {/* Template Families Grid */}
    <h2 style={{ marginBottom: 16 }}>🎨 模板家族一览</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
      {families.map((f: any) => (
        <div key={f.id} style={{
          background: '#fff', padding: 20, borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderLeft: `4px solid ${f.colorTheme?.primary || '#667eea'}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 18 }}>{f.icon} {f.name}</h3>
            <span style={{ fontSize: 12, color: '#999' }}>{f.nameEn}</span>
          </div>
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, margin: '0 0 12px' }}>{f.description}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {f.suitableCategories?.map((c: string) => (
              <span key={c} style={{ background: '#f0f0ff', padding: '2px 10px', borderRadius: 12, fontSize: 12, color: '#667eea' }}>{c}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#999' }}>
            <span>密度: {f.visualDensity}</span>
            <span>动效: {f.motionIntensity}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default App;
