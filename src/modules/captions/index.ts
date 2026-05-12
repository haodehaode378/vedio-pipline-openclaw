import type { CaptionTrack } from '../storyboard/types.js';

/** 生成 SRT 格式字幕 - 增强版 */
export function generateSRT(captions: CaptionTrack): string {
  return captions.segments
    .map((seg, i) => {
      const startTime = formatSRTTime(seg.startTime);
      const endTime = formatSRTTime(seg.endTime);
      // 应用断句规则：每行不超过 maxCharsPerLine
      const wrappedText = wrapText(seg.text, captions.maxCharsPerLine || 16);
      return `${i + 1}\n${startTime} --> ${endTime}\n${wrappedText}\n`;
    })
    .join('\n');
}

/** 生成 JSON 格式字幕 */
export function generateCaptionsJSON(captions: CaptionTrack): string {
  return JSON.stringify(captions, null, 2);
}

/** 生成 ASS 格式字幕（高级样式） */
export function generateASS(captions: CaptionTrack): string {
  const header = `[Script Info]
Title: ShopMotion Captions
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,PingFang SC,42,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,2,1,2,20,20,80,1
Style: Highlight,PingFang SC,48,&H0000FFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,3,1,2,20,20,80,1
Style: Keyword,PingFang SC,44,&H0000D4FF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,2,1,2,20,20,80,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  const events = captions.segments.map((seg) => {
    const start = formatASSTime(seg.startTime);
    const end = formatASSTime(seg.endTime);
    const _style = seg.style === 'highlight' ? 'Highlight' : seg.style === 'keyword' ? 'Keyword' : 'Default';
    const wrappedText = wrapText(seg.text, captions.maxCharsPerLine || 16).replace(/\n/g, '\\N');
    return `Dialogue: 0,${start},${end},,,0,0,0,,${wrappedText}`;
  }).join('\n');

  return header + events + '\n';
}

/** 文本断句：按最大字符数换行 */
function wrapText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;

  const lines: string[] = [];
  let remaining = text;

  while (remaining.length > maxChars) {
    // 优先在标点符号处断句
    let breakPoint = -1;
    const punctuation = ['，', '。', '！', '？', '、', '；', '：', ',', '.', '!', '?'];
    for (const p of punctuation) {
      const idx = remaining.lastIndexOf(p, maxChars);
      if (idx > 0 && idx > breakPoint) {
        breakPoint = idx + 1;
      }
    }

    // 如果没有标点，在空格处断句
    if (breakPoint <= 0) {
      const spaceIdx = remaining.lastIndexOf(' ', maxChars);
      if (spaceIdx > 0) {
        breakPoint = spaceIdx + 1;
      }
    }

    // 如果都没有，在最大字符处断句
    if (breakPoint <= 0) {
      breakPoint = maxChars;
    }

    lines.push(remaining.slice(0, breakPoint).trim());
    remaining = remaining.slice(breakPoint).trim();
  }

  if (remaining) {
    lines.push(remaining);
  }

  return lines.join('\n');
}

/** 格式化 SRT 时间码 */
function formatSRTTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad3(ms)}`;
}

/** 格式化 ASS 时间码 */
function formatASSTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const cs = Math.round((seconds % 1) * 100);
  return `${h}:${pad(m)}:${pad(s)}.${pad2(cs)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function pad3(n: number): string {
  return n.toString().padStart(3, '0');
}
