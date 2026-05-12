// Template family style renderers - 5 distinct visual styles
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import type { Storyboard, Scene } from '../../storyboard/types.js';
import type { TemplateConfig, ColorTheme, TypographyScale } from '../../templates/types.js';
import {
  ProductNameBlock, SellingPointCard, CaptionBlock, CTABlock,
  PriceBlock, ProgressIndicator, ProductImagePlaceholder,
} from '../shared/index.js';

/** 场景渲染器 - 根据模板配置应用不同样式 */
export const SceneRenderer: React.FC<{
  scene: Scene;
  storyboard: Storyboard;
  config: TemplateConfig;
  sceneIndex: number;
  totalScenes: number;
}> = ({ scene, storyboard, config, sceneIndex, totalScenes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = config.colorTheme;
  const typo = config.typographyScale;

  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const bg = getBackground(scene.type, theme, config.backgroundStyle);

  return (
    <AbsoluteFill style={{
      backgroundColor: bg,
      fontFamily: typo.fontFamily,
      opacity,
    }}>
      {/* 进度条 */}
      <ProgressIndicator current={sceneIndex} total={totalScenes} theme={theme} />

      {/* 背景元素 */}
      {(scene.type === 'hook' || scene.type === 'product_reveal') && (
        <ProductImagePlaceholder
          productName={storyboard.product.name}
          theme={theme}
          layout={config.productImageLayout}
        />
      )}

      {/* 主内容区 */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        height: '100%', padding: '60px 40px 120px',
        position: 'relative', zIndex: 1,
      }}>
        {/* 场景标题 */}
        {scene.type === 'hook' ? (
          <HookTitle scene={scene} theme={theme} typo={typo} layout={config.titleLayout} />
        ) : scene.type === 'product_reveal' ? (
          <ProductReveal scene={scene} storyboard={storyboard} theme={theme} typo={typo} />
        ) : scene.type === 'selling_point' ? (
          <SellingPointScene scene={scene} storyboard={storyboard} theme={theme} typo={typo} config={config} />
        ) : scene.type === 'scenario' ? (
          <ScenarioScene scene={scene} theme={theme} typo={typo} />
        ) : scene.type === 'proof' ? (
          <ProofScene scene={scene} theme={theme} typo={typo} />
        ) : scene.type === 'price_offer' ? (
          <PriceOfferScene scene={scene} storyboard={storyboard} theme={theme} typo={typo} />
        ) : scene.type === 'cta' ? (
          <CTAScene scene={scene} storyboard={storyboard} theme={theme} typo={typo} config={config} />
        ) : (
          <DefaultScene scene={scene} theme={theme} typo={typo} />
        )}
      </div>

      {/* 字幕 */}
      <CaptionBlock
        text={scene.caption}
        theme={theme}
        typography={typo}
        layout={config.captionLayout}
      />
    </AbsoluteFill>
  );
};

/** Hook 场景 - 不同模板家族有不同视觉风格 */
const HookTitle: React.FC<{
  scene: Scene; theme: ColorTheme; typo: TypographyScale;
  layout: string;
}> = ({ scene, theme, typo, layout }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 10 } });

  return (
    <div style={{ textAlign: layout === 'left-aligned' ? 'left' : 'center' }}>
      <div style={{
        fontSize: typo.titleSize + 8,
        fontWeight: typo.titleWeight,
        color: scene.type === 'hook' ? (theme.background === '#0D0D1A' || theme.background === '#1A1A1A' ? '#fff' : theme.text) : theme.text,
        transform: `scale(${interpolate(scale, [0, 1], [0.7, 1])})`,
        lineHeight: 1.2,
        marginBottom: 16,
      }}>
        {scene.title}
      </div>
      <div style={{
        fontSize: typo.subtitleSize,
        color: theme.textSecondary,
        opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {scene.narration}
      </div>
    </div>
  );
};

/** Product Reveal 场景 */
const ProductReveal: React.FC<{
  scene: Scene; storyboard: Storyboard;
  theme: ColorTheme; typo: TypographyScale;
}> = ({ scene, storyboard, theme, typo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 240, height: 240, borderRadius: 24,
        background: `linear-gradient(135deg, ${theme.primary}44, ${theme.secondary})`,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        margin: '0 auto 24px',
        transform: `scale(${scale})`,
        boxShadow: `0 12px 40px ${theme.primary}33`,
      }}>
        <div style={{ fontSize: 64 }}>📦</div>
      </div>
      <ProductNameBlock name={storyboard.product.name} theme={theme} typography={typo} />
      <div style={{
        fontSize: typo.bodySize, color: theme.textSecondary,
        marginTop: 12, maxWidth: '80%',
        opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {storyboard.product.description.slice(0, 60)}
      </div>
    </div>
  );
};

/** 卖点展示场景 */
const SellingPointScene: React.FC<{
  scene: Scene; storyboard: Storyboard;
  theme: ColorTheme; typo: TypographyScale;
  config: TemplateConfig;
}> = ({ scene, storyboard, theme, typo, config }) => {
  const sps = storyboard.product.sellingPoints.filter(
    (sp) => scene.sellingPointIds.includes(sp.id),
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        fontSize: typo.subtitleSize + 4, fontWeight: 600,
        color: theme.primary, textAlign: 'center', marginBottom: 20,
      }}>
        {scene.title}
      </div>
      {sps.map((sp, i) => (
        <SellingPointCard
          key={sp.id}
          title={sp.title}
          description={sp.description}
          theme={theme}
          typography={typo}
          cardStyle={config.sellingPointCardStyle}
          index={i}
        />
      ))}
    </div>
  );
};

/** 使用场景 */
const ScenarioScene: React.FC<{
  scene: Scene; theme: ColorTheme; typo: TypographyScale;
}> = ({ scene, theme, typo }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 20 }}>🌟</div>
      <div style={{ fontSize: typo.titleSize, fontWeight: 600, color: theme.text, marginBottom: 12 }}>
        {scene.title}
      </div>
      <div style={{
        fontSize: typo.bodySize, color: theme.textSecondary,
        opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' }),
        maxWidth: '85%', lineHeight: 1.5,
      }}>
        {scene.narration}
      </div>
    </div>
  );
};

/** 证据/可信度场景 */
const ProofScene: React.FC<{
  scene: Scene; theme: ColorTheme; typo: TypographyScale;
}> = ({ scene, theme, typo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 8 } });

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: 100, fontWeight: 800, color: theme.primary,
        transform: `scale(${scale})`,
      }}>
        {scene.caption}
      </div>
      <div style={{
        fontSize: typo.subtitleSize, color: theme.text,
        marginTop: 16,
        opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        {scene.narration}
      </div>
    </div>
  );
};

/** 价格优惠场景 */
const PriceOfferScene: React.FC<{
  scene: Scene; storyboard: Storyboard;
  theme: ColorTheme; typo: TypographyScale;
}> = ({ scene, storyboard, theme, typo }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: typo.subtitleSize, fontWeight: 600,
        color: theme.primary, marginBottom: 20,
      }}>
        {scene.title}
      </div>
      <PriceBlock
        price={storyboard.product.price}
        originalPrice={storyboard.product.originalPrice}
        theme={theme}
        typography={typo}
      />
    </div>
  );
};

/** CTA 场景 */
const CTAScene: React.FC<{
  scene: Scene; storyboard: Storyboard;
  theme: ColorTheme; typo: TypographyScale;
  config: TemplateConfig;
}> = ({ scene, storyboard, theme, typo, config }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: typo.titleSize, fontWeight: 700,
        color: theme.text, marginBottom: 24,
      }}>
        {scene.title}
      </div>
      <CTABlock
        text={scene.cta || '立即购买'}
        theme={theme}
        typography={typo}
        ctaStyle={config.ctaStyle}
      />
      <div style={{
        fontSize: typo.bodySize, color: theme.textSecondary,
        marginTop: 20,
      }}>
        ¥{storyboard.product.price}
      </div>
    </div>
  );
};

/** 默认场景 */
const DefaultScene: React.FC<{
  scene: Scene; theme: ColorTheme; typo: TypographyScale;
}> = ({ scene, theme, typo }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: typo.titleSize, fontWeight: 600, color: theme.text }}>{scene.title}</div>
    <div style={{ fontSize: typo.bodySize, color: theme.textSecondary, marginTop: 12 }}>{scene.narration}</div>
  </div>
);

/** 获取背景色 */
function getBackground(sceneType: string, theme: ColorTheme, bgStyle: string): string {
  if (bgStyle === 'gradient' && theme.gradient) {
    return sceneType === 'hook' || sceneType === 'cta' ? theme.primary : theme.gradient;
  }
  if (sceneType === 'hook' || sceneType === 'cta') return theme.primary;
  if (sceneType === 'price_offer') return theme.accent + '22';
  return theme.background;
}
