import type { ProductInput } from '../../product/types.js';

/** 30 个 Demo 商品样例 - 覆盖 20 个类别（v1.1 扩展版） */
export const demoProducts: ProductInput[] = [
  // 1. 数码科技
  {
    name: '无线降噪耳机 Pro',
    category: '数码科技',
    price: 599,
    originalPrice: 899,
    description: '全新一代主动降噪耳机，空间音频体验，30小时续航，IPX5防水。',
    targetAudience: '科技爱好者、通勤族',
    keyFeatures: ['自适应降噪', '空间音频', '30小时续航', 'IPX5防水'],
    marketingGoal: '新品发布',
    videoStyle: '科技简洁',
  },
  // 2. 美妆护肤
  {
    name: '玻尿酸精华液 30ml',
    category: '美妆护肤',
    price: 89,
    originalPrice: 159,
    description: '三重玻尿酸精华，深层补水保湿，改善干燥粗糙，适合所有肤质。',
    targetAudience: '18-35岁女性',
    keyFeatures: ['三重玻尿酸', '深层补水', '改善干燥', '全肤质适用'],
    marketingGoal: '种草',
    videoStyle: '美妆柔和',
  },
  // 3. 食品饮料
  {
    name: '即食燕麦片 混合坚果味 500g',
    category: '食品饮料',
    price: 39.9,
    originalPrice: 59.9,
    description: '澳洲进口燕麦，搭配6种坚果果干，高膳食纤维，早餐好选择。',
    targetAudience: '上班族、学生、健身人群',
    keyFeatures: ['澳洲进口燕麦', '6种坚果果干', '高膳食纤维', '免煮即食'],
    marketingGoal: '促销',
    videoStyle: '食品清新',
  },
  // 4. 家居日用
  {
    name: '316不锈钢智能保温杯',
    category: '家居日用',
    price: 129,
    originalPrice: 199,
    description: '316不锈钢内胆，12小时保温，LED温度显示，500ml大容量。',
    targetAudience: '上班族、学生',
    keyFeatures: ['316不锈钢', '12小时保温', 'LED温度显示', '500ml大容量'],
    marketingGoal: '种草',
    videoStyle: '生活种草',
  },
  // 5. 服饰鞋包
  {
    name: '轻量透气跑步鞋',
    category: '服饰鞋包',
    price: 299,
    originalPrice: 499,
    description: '飞织鞋面，EVA缓震中底，橡胶防滑大底，适合日常跑步训练。',
    targetAudience: '跑步爱好者、学生',
    keyFeatures: ['飞织透气鞋面', 'EVA缓震', '橡胶防滑底', '仅重220g'],
    marketingGoal: '种草',
    videoStyle: '服饰潮流',
  },
  // 6. 健身运动
  {
    name: '筋膜枪Pro 深层按摩器',
    category: '健身运动',
    price: 399,
    originalPrice: 599,
    description: '专业级深层肌肉按摩，6档力度调节，4款按摩头，静音设计。',
    targetAudience: '健身爱好者、上班族',
    keyFeatures: ['深层按摩技术', '6档力度', '4款按摩头', '超静音设计'],
    marketingGoal: '种草',
    videoStyle: '运动活力',
  },
  // 7. 母婴用品
  {
    name: '婴儿湿巾 80抽×5包',
    category: '母婴用品',
    price: 29.9,
    originalPrice: 49.9,
    description: '食品级材质，EDI纯水配方，无酒精无香精，宝宝手口专用。',
    targetAudience: '0-3岁宝宝家长',
    keyFeatures: ['食品级材质', 'EDI纯水', '无酒精无香精', '手口专用'],
    marketingGoal: '促销',
    videoStyle: '母婴安心',
  },
  // 8. 宠物用品
  {
    name: '全价猫粮 鸡肉味 2kg',
    category: '宠物用品',
    price: 79,
    originalPrice: 129,
    description: '鲜鸡肉配方，添加益生菌，美毛护肤，全年龄段猫咪适用。',
    targetAudience: '猫咪主人',
    keyFeatures: ['鲜鸡肉配方', '添加益生菌', '美毛护肤', '全年龄段适用'],
    marketingGoal: '种草',
    videoStyle: '宠物亲和',
  },
  // 9. 学习办公
  {
    name: '青轴机械键盘 87键',
    category: '学习办公',
    price: 199,
    originalPrice: 299,
    description: '青轴手感，RGB背光，PBT键帽，全键无冲，适合打字和游戏。',
    targetAudience: '程序员、学生、游戏玩家',
    keyFeatures: ['青轴段落感', 'RGB背光', 'PBT键帽', '全键无冲'],
    marketingGoal: '种草',
    videoStyle: '学习办公',
  },
  // 10. 个护健康
  {
    name: '声波电动牙刷',
    category: '个护健康',
    price: 149,
    originalPrice: 249,
    description: '每分钟38000次声波震动，5种清洁模式，IPX7防水，续航30天。',
    targetAudience: '注重口腔健康的人群',
    keyFeatures: ['38000次声波震动', '5种清洁模式', 'IPX7防水', '30天续航'],
    marketingGoal: '种草',
    videoStyle: '健康个护',
  },
  // 11. 汽车用品
  {
    name: '车载无线吸尘器',
    category: '汽车用品',
    price: 159,
    originalPrice: 259,
    description: '12000Pa大吸力，无线手持，HEPA过滤，车载家用两用。',
    targetAudience: '有车一族',
    keyFeatures: ['12000Pa大吸力', '无线手持', 'HEPA过滤', '车载家用两用'],
    marketingGoal: '促销',
    videoStyle: '汽车用品',
  },
  // 12. 节日礼品
  {
    name: '中秋月饼礼盒 经典口味',
    category: '节日礼品',
    price: 168,
    originalPrice: 238,
    description: '精装礼盒8枚装，蛋黄莲蓉、五仁、豆沙经典口味，送礼首选。',
    targetAudience: '送礼人群、企业采购',
    keyFeatures: ['精装礼盒', '8枚经典口味', '传统手工制作', '送礼首选'],
    marketingGoal: '节日营销',
    videoStyle: '节日礼赠',
  },
  // 13. 厨房用品
  {
    name: '多功能空气炸锅 5.5L',
    category: '厨房用品',
    price: 299,
    originalPrice: 459,
    description: '5.5L大容量，无油少脂烹饪，12种预设菜单，触控操作。',
    targetAudience: '家庭主妇、租房族',
    keyFeatures: ['5.5L大容量', '无油少脂', '12种预设菜单', '触控操作'],
    marketingGoal: '种草',
    videoStyle: '生活种草',
  },
  // 14. 旅行户外
  {
    name: '自动帐篷 3-4人',
    category: '旅行户外',
    price: 259,
    originalPrice: 399,
    description: '3秒自动展开，防雨防晒，通风设计，适合家庭露营。',
    targetAudience: '露营爱好者、家庭出游',
    keyFeatures: ['3秒自动展开', '防雨防晒', '通风设计', '3-4人空间'],
    marketingGoal: '种草',
    videoStyle: '运动活力',
  },
  // 15. 家电电器
  {
    name: '智能扫地机器人',
    category: '家电电器',
    price: 1299,
    originalPrice: 1999,
    description: 'LDS激光导航，4000Pa大吸力，自动集尘，APP远程控制。',
    targetAudience: '上班族、家庭用户',
    keyFeatures: ['LDS激光导航', '4000Pa大吸力', '自动集尘', 'APP远程控制'],
    marketingGoal: '促销',
    videoStyle: '科技简洁',
  },
  // 16. 珠宝配饰
  {
    name: '925银珍珠项链',
    category: '珠宝配饰',
    price: 199,
    originalPrice: 359,
    description: '925银链身，淡水珍珠吊坠，优雅百搭，送礼自用皆宜。',
    targetAudience: '20-40岁女性',
    keyFeatures: ['925银链身', '淡水珍珠', '优雅百搭', '精美礼盒'],
    marketingGoal: '种草',
    videoStyle: '美妆柔和',
  },
  // 17. 虚拟课程
  {
    name: 'Python编程入门课程',
    category: '虚拟课程',
    price: 99,
    originalPrice: 299,
    description: '零基础入门Python，48节课时，实战项目驱动，终身回看。',
    targetAudience: '编程初学者、大学生',
    keyFeatures: ['零基础入门', '48节课时', '实战项目', '终身回看'],
    marketingGoal: '促销',
    videoStyle: '学习办公',
  },
  // 18. 软件工具
  {
    name: 'AI写作助手 年费版',
    category: '软件工具',
    price: 199,
    originalPrice: 399,
    description: 'AI智能写作，支持多种文体，一键生成文章，提升写作效率。',
    targetAudience: '自媒体人、学生、职场人',
    keyFeatures: ['AI智能写作', '多种文体', '一键生成', '效率提升'],
    marketingGoal: '促销',
    videoStyle: '科技简洁',
  },
  // 19. 图书文创
  {
    name: '手账本套装 文艺风',
    category: '图书文创',
    price: 59,
    originalPrice: 99,
    description: 'A5手账本+和纸胶带+贴纸套装，文艺清新，记录美好生活。',
    targetAudience: '学生、手账爱好者',
    keyFeatures: ['A5手账本', '和纸胶带', '精美贴纸', '文艺清新'],
    marketingGoal: '种草',
    videoStyle: '生活种草',
  },
  // 20. 本地生活服务
  {
    name: '面部护理SPA套餐',
    category: '本地生活服务',
    price: 198,
    originalPrice: 398,
    description: '60分钟深层清洁+补水护理，专业美容师服务，预约即享。',
    targetAudience: '爱美女性',
    keyFeatures: ['60分钟护理', '深层清洁', '补水保湿', '专业美容师'],
    marketingGoal: '促销',
    videoStyle: '美妆柔和',
  },
  // 21-30: 补充商品覆盖更多场景
  {
    name: '多功能折叠收纳盒 三件套',
    category: '家居日用',
    price: 59.9,
    originalPrice: 99,
    description: '可折叠设计，三种尺寸，牛津布面料，衣柜收纳好帮手。',
    targetAudience: '租房族、整理爱好者',
    keyFeatures: ['可折叠设计', '三种尺寸', '牛津布面料', '承重力强'],
    marketingGoal: '种草',
    videoStyle: '家居温馨',
  },
  {
    name: '便携式蓝牙音箱',
    category: '数码科技',
    price: 199,
    originalPrice: 299,
    description: 'IPX7防水，20小时续航，TWS串联，低音增强，户外必备。',
    targetAudience: '音乐爱好者、户外玩家',
    keyFeatures: ['IPX7防水', '20小时续航', 'TWS串联', '低音增强'],
    marketingGoal: '新品发布',
    videoStyle: '科技简洁',
  },
  {
    name: '防晒喷雾 SPF50+',
    category: '美妆护肤',
    price: 69,
    originalPrice: 119,
    description: 'SPF50+高倍防晒，清爽不油腻，防水防汗，适合全身使用。',
    targetAudience: '18-35岁女性',
    keyFeatures: ['SPF50+高倍', '清爽不油腻', '防水防汗', '全身可用'],
    marketingGoal: '种草',
    videoStyle: '美妆柔和',
  },
  {
    name: '混合坚果礼盒 750g',
    category: '食品饮料',
    price: 89,
    originalPrice: 139,
    description: '6种精选坚果，独立小包装，每日坚果好伴侣，送礼自用皆宜。',
    targetAudience: '上班族、送礼人群',
    keyFeatures: ['6种精选坚果', '独立小包装', '新鲜烘焙', '精美礼盒'],
    marketingGoal: '促销',
    videoStyle: '食品清新',
  },
  {
    name: 'TPE瑜伽垫 加厚8mm',
    category: '健身运动',
    price: 129,
    originalPrice: 199,
    description: 'TPE环保材质，双面防滑，加厚8mm，回弹减震，附赠收纳袋。',
    targetAudience: '瑜伽爱好者、健身人群',
    keyFeatures: ['TPE环保材质', '双面防滑', '加厚8mm', '附赠收纳袋'],
    marketingGoal: '种草',
    videoStyle: '运动活力',
  },
  {
    name: 'PPSU宽口奶瓶 240ml',
    category: '母婴用品',
    price: 89,
    originalPrice: 139,
    description: 'PPSU材质耐高温，仿母乳奶嘴，防胀气设计，宽口易清洗。',
    targetAudience: '0-1岁宝宝家长',
    keyFeatures: ['PPSU材质', '仿母乳奶嘴', '防胀气设计', '宽口易清洗'],
    marketingGoal: '种草',
    videoStyle: '母婴安心',
  },
  {
    name: '宠物自动喂食器 4L',
    category: '宠物用品',
    price: 199,
    originalPrice: 299,
    description: '4L大容量，定时定量喂食，APP远程控制，语音呼唤功能。',
    targetAudience: '上班族宠物主人',
    keyFeatures: ['4L大容量', '定时定量', 'APP远程控制', '语音呼唤'],
    marketingGoal: '种草',
    videoStyle: '宠物亲和',
  },
  {
    name: '护眼台灯 LED可调',
    category: '学习办公',
    price: 169,
    originalPrice: 259,
    description: '无频闪无蓝光，色温亮度可调，Ra98高显色，USB充电。',
    targetAudience: '学生、上班族',
    keyFeatures: ['无频闪无蓝光', '色温亮度可调', 'Ra98高显色', 'USB充电'],
    marketingGoal: '种草',
    videoStyle: '学习办公',
  },
  {
    name: '4K行车记录仪',
    category: '汽车用品',
    price: 399,
    originalPrice: 599,
    description: '4K超高清，170°广角，夜视增强，停车监控，WiFi传输。',
    targetAudience: '有车一族',
    keyFeatures: ['4K超高清', '170°广角', '夜视增强', '停车监控'],
    marketingGoal: '讲解',
    videoStyle: '汽车用品',
  },
  {
    name: '永生花礼盒 玫瑰款',
    category: '节日礼品',
    price: 128,
    originalPrice: 198,
    description: '天然鲜花制作，保鲜3年以上，精美礼盒包装，送礼佳选。',
    targetAudience: '送礼人群',
    keyFeatures: ['天然鲜花', '保鲜3年+', '精美礼盒', '送礼佳选'],
    marketingGoal: '节日营销',
    videoStyle: '节日礼赠',
  },
];

/** 按类别获取 demo 商品 */
export function getDemoProductsByCategory(category: string): ProductInput[] {
  return demoProducts.filter((p) => p.category === category);
}

/** 按索引获取 demo 商品 */
export function getDemoProduct(index: number): ProductInput | undefined {
  return demoProducts[index];
}

/** 获取所有类别覆盖情况 */
export function getCategoryCoverage(): Record<string, number> {
  const coverage: Record<string, number> = {};
  for (const p of demoProducts) {
    coverage[p.category] = (coverage[p.category] || 0) + 1;
  }
  return coverage;
}
