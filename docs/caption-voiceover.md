# ShopMotion v1.1 - 字幕与旁白设计文档

## 概述

字幕（Caption）和旁白（Voiceover）是短视频的重要组成部分。ShopMotion 的字幕和旁白系统支持自动生成、时间轴对齐和多格式导出。

## 字幕系统

### CaptionSegment（字幕片段）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 片段唯一标识 |
| text | string | 字幕文本 |
| startTime | number | 开始时间（秒） |
| endTime | number | 结束时间（秒） |
| sceneId | string | 关联场景ID |
| style | string | 字幕样式（default/highlight/keyword） |
| breakPoints | number[] | 断句位置标记（可选） |

### CaptionTrack（字幕轨道）

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | CaptionSegment[] | 字幕片段列表 |
| language | string | 语言代码（如 'zh-CN'） |
| style | string | 字幕布局样式 |
| density | string | 字幕密度（sparse/normal/dense） |
| maxCharsPerLine | number | 每行最大字符数 |

### 字幕样式

| 样式 | 说明 | 适用场景 |
|------|------|---------|
| bottom-bar | 底部字幕条 | 默认样式 |
| card | 卡片式字幕 | 信息强化型 |
| highlight-keywords | 关键词高亮 | 极简型 |
| floating | 浮动字幕 | 创意型 |

### 字幕断句规则

1. **标点断句**：优先在标点符号（，。！？、；：）处断句
2. **语义断句**：在语义完整的词组处断句
3. **长度断句**：每行不超过最大字符数
4. **避免词中断句**：不在词语中间断句

### 中文短视频字幕风格

- 字体：PingFang SC / Microsoft YaHei
- 字号：42px（默认）/ 48px（高亮）/ 44px（关键词）
- 颜色：白色（默认）/ 黄色（高亮）/ 橙色（关键词）
- 描边：2px 深色描边
- 阴影：1px 阴影
- 位置：底部居中，距底边 80px

### 字幕密度建议

| 视频时长 | 密度 | 每行最大字符 | 说明 |
|---------|------|------------|------|
| 15s | sparse | 12 | 精简信息，突出重点 |
| 30s | normal | 16 | 平衡信息量和可读性 |
| 45s | dense | 16 | 信息量大，但保持可读 |

## 旁白系统

### VoiceoverSegment（旁白段落）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 段落唯一标识 |
| text | string | 旁白文本 |
| startTime | number | 开始时间（秒） |
| duration | number | 持续时长（秒） |
| sceneId | string | 关联场景ID |
| pace | string | 语速（slow/normal/fast） |
| emotion | string | 情感（neutral/excited/warm/urgent） |

### VoiceoverTimeline（旁白时间轴）

| 字段 | 类型 | 说明 |
|------|------|------|
| segments | VoiceoverSegment[] | 旁白段落列表 |
| totalDuration | number | 总时长（秒） |
| mockAudioUrl | string | Mock 音频URL |
| overallPace | string | 整体语速 |

### 语速标记

| 语速 | 说明 | 中文语速 | 适用场景 |
|------|------|---------|---------|
| slow | 慢速 | ~3字/秒 | 场景展示、产品质感 |
| normal | 正常 | ~4字/秒 | 卖点讲解、信息传达 |
| fast | 快速 | ~5字/秒 | 开场、CTA、价格优惠 |

### 情感标记

| 情感 | 说明 | 适用场景 |
|------|------|---------|
| neutral | 中性 | 信息传达、参数讲解 |
| excited | 兴奋 | 开场、促销、新品发布 |
| warm | 温暖 | 生活场景、母婴、宠物 |
| urgent | 紧迫 | CTA、限时优惠、倒计时 |

### 旁白与场景时长对齐规则

1. **时长对齐**：旁白时长 = 场景时长
2. **开始对齐**：旁白开始时间 = 场景开始时间
3. **结束对齐**：旁白结束时间 = 场景结束时间
4. **同步字幕**：旁白与字幕保持同步

## SRT 导出

### SRT 格式示例

```srt
1
00:00:00,200 --> 00:00:03,300
你还在犹豫？

2
00:00:03,500 --> 00:00:07,800
无线降噪耳机 Pro

3
00:00:08,000 --> 00:00:12,500
自适应降噪
```

### ASS 格式导出

支持 ASS（Advanced SubStation Alpha）格式导出，包含：
- 自定义字体样式
- 高亮和关键词样式
- 精确的时间码

### JSON 格式导出

```json
{
  "segments": [
    {
      "id": "cap-1",
      "text": "你还在犹豫？",
      "startTime": 0.2,
      "endTime": 3.3,
      "sceneId": "scene-1",
      "style": "keyword"
    }
  ],
  "language": "zh-CN",
  "style": "bottom-bar",
  "density": "normal",
  "maxCharsPerLine": 16
}
```

## 未验证项

- ⚠️ 真实 TTS 合成的旁白效果未验证（当前使用 Mock）
- ⚠️ 真实音频的时间轴对齐未验证
- ⚠️ ASS 格式在不同播放器中的兼容性未验证
- ⚠️ 中文断句算法的准确性未在大规模文本中验证
