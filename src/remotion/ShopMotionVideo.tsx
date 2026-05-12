// Remotion Composition - Main entry point for ShopMotion video
import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import type { Storyboard, Scene, SellingPoint } from '../types/index.js';

/** Main Composition component */
export const ShopMotionVideo: React.FC<{ storyboard: Storyboard }> = ({ storyboard }) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {storyboard.scenes.map((scene, index) => {
        const startFrame = storyboard.scenes
          .slice(0, index)
          .reduce((sum, s) => sum + s.durationInFrames, 0);

        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={scene.durationInFrames}
          >
            <SceneRenderer
              scene={scene}
              sellingPoints={storyboard.sellingPoints}
              style={storyboard.style}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Single Scene Renderer */
const SceneRenderer: React.FC<{
  scene: Scene;
  sellingPoints: SellingPoint[];
  style: Storyboard['style'];
}> = ({ scene, sellingPoints, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = spring({ frame, fps, config: { damping: 12 } });

  const bgColor =
    scene.type === 'hook'
      ? style.primaryColor
      : scene.type === 'cta'
        ? style.primaryColor
        : style.secondaryColor;

  const textColor = scene.type === 'hook' || scene.type === 'cta' ? '#fff' : '#333';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: style.fontFamily,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        opacity,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: scene.type === 'hook' ? 64 : 48,
          fontWeight: 'bold',
          color: textColor,
          textAlign: 'center',
          marginBottom: 20,
          transform: `translateY(${interpolate(translateY, [0, 1], [50, 0])}px)`,
        }}
      >
        {scene.title}
      </div>

      {/* Subtitle */}
      {scene.subtitle && (
        <div
          style={{
            fontSize: 28,
            color: textColor,
            textAlign: 'center',
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' }),
            marginBottom: 30,
          }}
        >
          {scene.subtitle}
        </div>
      )}

      {/* Selling Points Cards */}
      {scene.elements
        .filter((e) => e.type === 'sellingPoint')
        .map((el) => {
          const sp = sellingPoints.find((s) => s.id === el.sellingPointId);
          if (!sp) return null;
          return (
            <div
              key={el.sellingPointId}
              style={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 16,
                padding: '24px 32px',
                margin: '10px 0',
                maxWidth: '80%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 'bold', color: style.primaryColor }}>
                {sp.title}
              </div>
              <div style={{ fontSize: 18, color: '#666', marginTop: 8 }}>{sp.description}</div>
            </div>
          );
        })}

      {/* CTA Button */}
      {scene.elements
        .filter((e) => e.type === 'cta')
        .map((el, i) => (
          <div
            key={i}
            style={{
              backgroundColor: scene.type === 'cta' ? '#fff' : style.primaryColor,
              color: scene.type === 'cta' ? style.primaryColor : '#fff',
              padding: '16px 48px',
              borderRadius: 50,
              fontSize: 28,
              fontWeight: 'bold',
              marginTop: 30,
              opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp' }),
            }}
          >
            {el.text}
          </div>
        ))}

      {/* Captions */}
      {scene.captions.map((cap, i) => {
        const localStart = cap.startFrame - (scene.voiceover?.startFrame ?? 0);
        const localEnd = cap.endFrame - (scene.voiceover?.startFrame ?? 0);
        if (frame < localStart || frame > localEnd) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: 80,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 22,
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: '8px 16px',
              margin: '0 40px',
              borderRadius: 8,
            }}
          >
            {cap.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
