# ShopMotion v1 - 渲染文档

## 1. 渲染入口

### Remotion Studio 预览
```bash
npm run dev:remotion
```
启动 Remotion Studio，在浏览器中预览视频效果。

### 渲染命令（预留）
```bash
npx remotion render src/modules/remotion/compositions/index.tsx ShopMotionVideo output/video.mp4
```

> ⚠️ **注意**: 当前版本不执行真实长时间渲染。以上命令为预留接口，需要安装完整 Remotion 依赖后才能执行。

## 2. RenderConfig

```typescript
interface RenderConfig {
  width: number;           // 视频宽度（默认 1080）
  height: number;          // 视频高度（默认 1920）
  fps: number;             // 帧率（默认 30）
  durationInFrames: number; // 总帧数
  outputPath: string;      // 输出路径
  quality: 'low' | 'medium' | 'high';
  format: 'mp4' | 'webm';
}
```

## 3. 输出路径规范

```
output/
├── {jobId}.mp4              # 主视频文件
├── {jobId}.srt              # SRT 字幕
├── {jobId}-captions.json    # JSON 字幕
├── {jobId}-voiceover.json   # 旁白时间轴
└── {jobId}-storyboard.json  # 分镜脚本
```

## 4. 渲染前检查

1. 确认 Storyboard 数据完整
2. 确认 TemplateConfig 存在
3. 确认所有场景时长之和等于总时长
4. 确认字幕时间轴与场景对齐
5. 确认输出目录可写

## 5. 渲染失败处理

1. 缺少模板配置 → 使用默认配置
2. 场景数据不完整 → 跳过该场景
3. 商品图片缺失 → 使用占位图形
4. 渲染超时 → 记录错误并标记任务失败
5. 磁盘空间不足 → 清理临时文件并报错

## 6. 当前状态

- ✅ Remotion Composition 入口已实现
- ✅ 模板配置驱动的场景渲染已实现
- ✅ 共享视觉组件已实现
- ⚠️ 真实视频渲染未验证（需要 FFmpeg 和完整 Remotion 环境）
- ⚠️ 大文件渲染性能未测试
