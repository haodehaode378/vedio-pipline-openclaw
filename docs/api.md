# ShopMotion v1.1 - API 文档

## 基础信息

- 基础路径: `http://localhost:3001/api`
- 响应格式: JSON
- 编码: UTF-8
- 验证状态: 未在当前低配置服务器验证

---

## 1. 模板列表接口

### GET /api/templates/families

获取所有模板家族列表。

**响应示例:**
```json
[
  {
    "id": "TechClean",
    "name": "科技简洁风",
    "nameEn": "Tech Clean",
    "description": "以极简线条和冷色调为主...",
    "suitableCategories": ["数码科技", "学习办公"],
    "suitableGoals": ["讲解", "品牌", "新品发布"],
    "colorTheme": { "primary": "#0066FF", "secondary": "#E8F0FE" },
    "visualDensity": "极简",
    "motionIntensity": "标准",
    "icon": "💻",
    "recommendedScenarios": ["新品发布会", "产品测评"],
    "recommendedProductTypes": ["蓝牙耳机", "智能手表"],
    "recommendedVideoStructure": ["痛点引入", "产品亮相", "CTA"],
    "recommendedCTAs": ["了解更多", "立即抢购"],
    "colorDescription": "冷色调科技蓝为主",
    "rhythmDescription": "中等节奏",
    "recommendedCaptionStyle": "简洁白色字幕条"
  }
]
```

**验证状态:** 未在当前低配置服务器验证

---

## 2. 模板推荐接口

### POST /api/templates/resolve

根据商品信息推荐最佳模板。

**请求体:**
```json
{
  "productCategory": "数码科技",
  "videoStyle": "科技简洁",
  "marketingGoal": "种草",
  "aspectRatio": "9:16",
  "duration": 30,
  "targetAudience": "科技爱好者",
  "manualFamilyId": null
}
```

**响应示例:**
```json
{
  "familyId": "TechClean",
  "variantId": "TechClean-standard-9:16-30s",
  "configId": "TechClean-standard-9:16-30s",
  "reason": "适配「数码科技」类别；适配「种草」营销目标",
  "confidence": 0.85,
  "fallbackUsed": false,
  "supportedSceneTypes": ["hook", "product_reveal", "selling_point", "scenario", "proof", "price_offer", "cta"]
}
```

**错误响应:**
```json
{
  "error": "Missing productCategory"
}
```

**验证状态:** 未在当前低配置服务器验证

---

## 3. 商品类别接口

### GET /api/categories

获取所有商品类别列表（20个类别）。

**响应示例:**
```json
[
  { "id": "数码科技", "label": "数码科技", "icon": "📱" },
  { "id": "美妆护肤", "label": "美妆护肤", "icon": "💄" },
  { "id": "食品饮料", "label": "食品饮料", "icon": "🍜" }
]
```

**验证状态:** 未在当前低配置服务器验证

---

## 4. Demo 商品接口

### GET /api/demo-products

获取所有 Demo 商品列表（30个商品）。

**响应示例:**
```json
[
  { "index": 0, "name": "无线降噪耳机 Pro", "category": "数码科技", "price": 599 },
  { "index": 1, "name": "玻尿酸精华液 30ml", "category": "美妆护肤", "price": 89 }
]
```

### GET /api/demo-products/:index

获取指定索引的 Demo 商品详情。

**响应示例:**
```json
{
  "name": "无线降噪耳机 Pro",
  "category": "数码科技",
  "price": 599,
  "originalPrice": 899,
  "description": "全新一代主动降噪耳机...",
  "targetAudience": "科技爱好者、通勤族",
  "keyFeatures": ["自适应降噪", "空间音频", "30小时续航", "IPX5防水"],
  "marketingGoal": "新品发布",
  "videoStyle": "科技简洁"
}
```

**错误响应:**
```json
{
  "error": "Demo product not found"
}
```

**验证状态:** 未在当前低配置服务器验证

---

## 5. 创建生成任务接口

### POST /api/generate

创建视频生成任务。

**请求体:**
```json
{
  "name": "蓝牙降噪耳机",
  "category": "数码科技",
  "price": 599,
  "originalPrice": 899,
  "description": "全新一代主动降噪耳机",
  "targetAudience": "科技爱好者",
  "keyFeatures": ["自适应降噪", "30小时续航"],
  "marketingGoal": "种草",
  "videoStyle": "科技简洁",
  "preferredDuration": 30,
  "preferredAspectRatio": "9:16"
}
```

**响应示例:**
```json
{
  "jobId": "job-1234567890-1",
  "status": "queued"
}
```

**错误响应:**
```json
{
  "error": "缺少必填字段: name, category, price"
}
```

**验证状态:** 未在当前低配置服务器验证

---

## 6. 查询任务接口

### GET /api/jobs

获取所有任务列表（按创建时间倒序）。

**响应示例:**
```json
[
  {
    "id": "job-1234567890-1",
    "input": { "name": "蓝牙降噪耳机", "category": "数码科技" },
    "status": "completed",
    "progress": 100,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:05.000Z"
  }
]
```

### GET /api/jobs/:id

获取指定任务详情。

**响应示例:**
```json
{
  "id": "job-1234567890-1",
  "input": { "name": "蓝牙降噪耳机", "category": "数码科技", "price": 599 },
  "status": "completed",
  "progress": 100,
  "storyboard": { ... },
  "templateRecommendation": { ... },
  "artifacts": [
    { "type": "storyboard", "path": "/api/jobs/job-1234567890-1/storyboard" },
    { "type": "captions-srt", "path": "/api/jobs/job-1234567890-1/captions.srt" }
  ]
}
```

**错误响应:**
```json
{
  "error": "任务不存在"
}
```

**验证状态:** 未在当前低配置服务器验证

---

## 7. 查询 Storyboard 接口

### GET /api/jobs/:id/storyboard

获取任务的分镜脚本。

**响应示例:**
```json
{
  "id": "sb-1234567890-1",
  "videoMeta": {
    "title": "蓝牙降噪耳机 短视频",
    "aspectRatio": "9:16",
    "duration": 30,
    "style": "科技简洁",
    "language": "zh-CN",
    "marketingGoal": "种草"
  },
  "product": {
    "name": "蓝牙降噪耳机",
    "description": "全新一代主动降噪耳机",
    "category": "数码科技",
    "price": 599,
    "sellingPoints": [...]
  },
  "scenes": [
    {
      "id": "scene-1",
      "type": "hook",
      "title": "你还在用老款产品？",
      "narration": "你还在为选择而烦恼吗？",
      "caption": "你还在犹豫？",
      "durationInSeconds": 3.5,
      "sceneIntent": "抓住观众注意力",
      "layoutHint": "centered",
      "templateSlot": "scene-hook"
    }
  ],
  "template": {
    "familyId": "TechClean",
    "variantId": "TechClean-standard-9:16-30s",
    "configId": "TechClean-standard-9:16-30s"
  }
}
```

**错误响应:**
```json
{
  "error": "分镜脚本未就绪",
  "status": "generating_script"
}
```

**验证状态:** 未在当前低配置服务器验证

---

## 8. 查询字幕接口

### GET /api/jobs/:id/captions

获取任务的字幕数据（JSON 格式）。

**响应示例:**
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

**验证状态:** 未在当前低配置服务器验证

---

## 9. 查询旁白接口

### GET /api/jobs/:id/voiceover

获取任务的旁白时间轴。

**响应示例:**
```json
{
  "segments": [
    {
      "id": "vo-1",
      "text": "你还在为选择而烦恼吗？",
      "startTime": 0,
      "duration": 3.5,
      "sceneId": "scene-1",
      "pace": "fast",
      "emotion": "excited"
    }
  ],
  "totalDuration": 30,
  "mockAudioUrl": "mock://tts/storyboard-preview.mp3",
  "overallPace": "normal"
}
```

**验证状态:** 未在当前低配置服务器验证

---

## 10. 导出 SRT 接口

### GET /api/jobs/:id/captions.srt

导出 SRT 格式字幕文件。

**响应:**
- Content-Type: `text/plain; charset=utf-8`
- Content-Disposition: `attachment; filename="job-{id}.srt"`

**SRT 内容示例:**
```srt
1
00:00:00,200 --> 00:00:03,300
你还在犹豫？

2
00:00:03,500 --> 00:00:07,800
蓝牙降噪耳机
```

**验证状态:** 未在当前低配置服务器验证

---

## 11. 删除任务接口

### DELETE /api/jobs/:id

删除指定任务。

**响应示例:**
```json
{
  "success": true
}
```

**错误响应:**
```json
{
  "error": "任务不存在"
}
```

**验证状态:** 未在当前低配置服务器验证

---

## 12. 重新生成接口

### POST /api/jobs/:id/regenerate

重新生成任务。

**响应示例:**
```json
{
  "jobId": "job-1234567890-1",
  "status": "queued"
}
```

**错误响应:**
```json
{
  "error": "任务不存在"
}
```

**验证状态:** 未在当前低配置服务器验证

---

## 任务状态流转

```
queued → generating_script → resolving_template → generating_assets → completed
                                                                    → failed
```

| 状态 | 说明 | 进度 |
|------|------|------|
| queued | 排队中 | 5% |
| generating_script | 生成脚本 | 25% |
| resolving_template | 解析模板 | 45% |
| generating_assets | 生成素材 | 65% |
| completed | 已完成 | 100% |
| failed | 失败 | 0% |

---

## 模板统计接口

### GET /api/templates/stats

获取模板系统统计信息。

**响应示例:**
```json
{
  "familyCount": 15,
  "configCount": 45,
  "totalCombinations": 135
}
```

### GET /api/templates/families/:id

获取指定模板家族详情。

### GET /api/templates/configs

获取模板配置列表。
- 查询参数: `familyId` (可选) - 按家族过滤

---

## 注意事项

1. 所有接口的验证状态均为"未在当前低配置服务器验证"
2. 真实 LLM/TTS API 未接入，当前使用 Mock 实现
3. 任务存储使用内存 Map，重启后数据丢失
4. 飞书 Webhook 通知需配置环境变量
