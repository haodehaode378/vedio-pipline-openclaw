// Shared visual components for Remotion templates
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import type { ColorTheme, TypographyScale } from '../../templates/types.js';

/** 商品名称展示块 */
export const ProductNameBlock: React.FC<{
  name: string;
  theme: ColorTheme;
  typography: TypographyScale;
  style?: 'centered' | 'left-aligned' | 'overlaid';
}> = ({ name, theme, typography, style = 'centered' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <div style={{
      fontSize: typography.titleSize,
      fontWeight: typography.titleWeight,
      fontFamily: typography.fontFamily,
      color: theme.text,
      textAlign: style === 'left-aligned' ? 'left' : 'center',
      transform: `scale(${interpolate(scale, [0, 1], [0.8, 1])})`,
      opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      lineHeight: 1.3,
    }}>
      {name}
    </div>
  );
};

/** 卖点卡片 */
export const SellingPointCard: React.FC<{
  title: string;
  description: string;
  theme: ColorTheme;
  typography: TypographyScale;
  cardStyle: 'rounded' | 'sharp' | 'glass' | 'minimal';
  index: number;
}> = ({ title, description, theme, typography, cardStyle, index }) => {
  const frame = useCurrentFrame();
  const delay = index * 10;
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY = interpolate(frame - delay, [0, 15], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const cardBg = cardStyle === 'glass' ? 'rgba(255,255,255,0.15)'
    : cardStyle === 'minimal' ? 'transparent'
    : theme.surface;
  const borderRadius = cardStyle === 'sharp' ? 4 : cardStyle === 'minimal' ? 0 : 16;
  const border = cardStyle === 'minimal' ? `2px solid ${theme.primary}` : 'none';

  return (
    <div style={{
      backgroundColor: cardBg,
      borderRadius,
      border,
      padding: cardStyle === 'minimal' ? '12px 16px' : '20px 28px',
      margin: '8px 0',
      opacity,
      transform: `translateY(${translateY}px)`,
      backdropFilter: cardStyle === 'glass' ? 'blur(10px)' : 'none',
    }}>
      <div style={{ fontSize: typography.bodySize + 4, fontWeight: 600, color: theme.primary, marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: typography.bodySize, color: theme.textSecondary, lineHeight: 1.4 }}>
        {description}
      </div>
    </div>
  );
};

/** 字幕显示块 */
export const CaptionBlock: React.FC<{
  text: string;
  theme: ColorTheme;
  typography: TypographyScale;
  layout: 'bottom-bar' | 'card' | 'highlight-keywords' | 'floating';
}> = ({ text, theme, typography, layout }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  if (layout === 'bottom-bar') {
    return (
      <div style={{
        position: 'absolute', bottom: 60, left: 20, right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff',
        padding: '12px 20px', borderRadius: 10,
        fontSize: typography.captionSize, textAlign: 'center',
        opacity, backdropFilter: 'blur(4px)',
      }}>
        {text}
      </div>
    );
  }

  if (layout === 'card') {
    return (
      <div style={{
        position: 'absolute', bottom: 60, left: 30, right: 30,
        backgroundColor: theme.surface, color: theme.text,
        padding: '16px 24px', borderRadius: 14,
        fontSize: typography.captionSize, textAlign: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)', opacity,
      }}>
        {text}
      </div>
    );
  }

  if (layout === 'highlight-keywords') {
    return (
      <div style={{
        position: 'absolute', bottom: 60, left: 20, right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff',
        padding: '10px 18px', borderRadius: 10,
        fontSize: typography.captionSize + 2, textAlign: 'center',
        fontWeight: 600, opacity,
      }}>
        {text}
      </div>
    );
  }

  // floating
  return (
    <div style={{
      position: 'absolute', bottom: 80, left: 40, right: 40,
      backgroundColor: 'rgba(255,255,255,0.9)', color: theme.text,
      padding: '14px 22px', borderRadius: 20,
      fontSize: typography.captionSize, textAlign: 'center',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)', opacity,
    }}>
      {text}
    </div>
  );
};

/** CTA 按钮 */
export const CTABlock: React.FC<{
  text: string;
  theme: ColorTheme;
  typography: TypographyScale;
  ctaStyle: 'button' | 'banner' | 'slide-up' | 'pulse';
}> = ({ text, theme, typography, ctaStyle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' });
  const pulseScale = ctaStyle === 'pulse'
    ? interpolate(Math.sin(frame * 0.15), [-1, 1], [0.95, 1.05])
    : 1;
  const slideY = ctaStyle === 'slide-up'
    ? interpolate(frame, [20, 40], [60, 0], { extrapolateRight: 'clamp' })
    : 0;

  if (ctaStyle === 'banner') {
    return (
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: theme.primary, color: '#fff',
        padding: '24px', textAlign: 'center',
        fontSize: typography.ctaSize, fontWeight: 700,
        opacity, fontFamily: typography.fontFamily,
      }}>
        {text}
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      color: theme.primary,
      padding: '18px 56px',
      borderRadius: 50,
      fontSize: typography.ctaSize,
      fontWeight: 700,
      fontFamily: typography.fontFamily,
      boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
      opacity,
      transform: `scale(${pulseScale}) translateY(${slideY}px)`,
      textAlign: 'center',
    }}>
      {text}
    </div>
  );
};

/** 价格展示 */
export const PriceBlock: React.FC<{
  price: number;
  originalPrice?: number;
  theme: ColorTheme;
  typography: TypographyScale;
}> = ({ price, originalPrice, theme, typography }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });
  const scale = spring({ frame, fps: 30, config: { damping: 8 } });

  return (
    <div style={{ textAlign: 'center', opacity, transform: `scale(${scale})` }}>
      {originalPrice && originalPrice > price && (
        <div style={{
          fontSize: typography.bodySize,
          color: theme.textSecondary,
          textDecoration: 'line-through',
          marginBottom: 4,
        }}>
          ¥{originalPrice}
        </div>
      )}
      <div style={{
        fontSize: typography.titleSize + 8,
        fontWeight: 800,
        color: theme.primary,
      }}>
        ¥{price}
      </div>
    </div>
  );
};

/** 进度指示器 */
export const ProgressIndicator: React.FC<{
  current: number;
  total: number;
  theme: ColorTheme;
}> = ({ current, total, theme }) => {
  return (
    <div style={{
      position: 'absolute', top: 20, left: 20, right: 20,
      display: 'flex', gap: 6,
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 2,
          backgroundColor: i <= current ? theme.primary : 'rgba(255,255,255,0.3)',
          transition: 'background-color 0.3s',
        }} />
      ))}
    </div>
  );
};

/** 商品图片占位 */
export const ProductImagePlaceholder: React.FC<{
  productName: string;
  theme: ColorTheme;
  layout: 'full-bg' | 'card' | 'split' | 'overlay';
}> = ({ productName, theme, layout }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  if (layout === 'full-bg') {
    return (
      <div style={{
        position: 'absolute', inset: 0,
        background: theme.gradient || `linear-gradient(135deg, ${theme.primary}22 0%, ${theme.secondary} 100%)`,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        opacity,
      }}>
        <div style={{
          fontSize: 80, fontWeight: 700, color: theme.primary, opacity: 0.15,
        }}>
          {productName.slice(0, 2)}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: layout === 'split' ? '40%' : 200,
      height: layout === 'split' ? '80%' : 200,
      borderRadius: 16,
      background: `linear-gradient(135deg, ${theme.primary}33, ${theme.secondary})`,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      opacity,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontSize: 48, opacity: 0.3 }}>📦</div>
    </div>
  );
};
