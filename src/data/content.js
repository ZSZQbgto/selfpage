export const profile = {
  name: '林屿',
  latin: 'LIN YU',
  monogram: 'YL',
  role: 'Graphics & Systems Engineer',
  kicker: 'PORTFOLIO · 2026',
  headline: ['把代码写成', '可触摸的', '光。'],
  tagline: '图形渲染与后端系统工程师。用 Java 与 Go 托住流量，用 OpenGL、WebGL 与 Blender 把想象渲染成画面。',
  intro: [
    '我是一名图形渲染与后端系统工程师。白天写 Java 与 Go，让服务在高并发下保持优雅；夜晚写 GLSL 与 Blender 脚本，把光和形状调成想要的样子。',
    '我相信好的工程同时是技术判断与审美判断。把一帧画面压进 16ms，和把一条请求链路的 P99 压到 50ms，本质上都是在有限资源里做取舍。',
  ],
  location: '杭州 · 中国',
  coords: '30.27° N / 120.15° E',
  status: '开放新的合作机会',
  email: 'hello@linyu.dev',
  socials: [
    { label: 'GitHub', handle: '@linyu', href: 'https://github.com/' },
    { label: '掘金', handle: '@linyu', href: 'https://juejin.cn/' },
    { label: 'Bilibili', handle: '@linyu', href: 'https://www.bilibili.com/' },
  ],
  stats: [
    { value: '6+', label: '年工程经验' },
    { value: '32', label: '已交付项目' },
    { value: '120k', label: '服务峰值 QPS' },
    { value: '60fps', label: '渲染帧率底线' },
  ],
  nav: [
    { id: 'about', index: '01', label: '关于' },
    { id: 'stack', index: '02', label: '技术栈' },
    { id: 'pipeline', index: '03', label: '渲染管线' },
    { id: 'work', index: '04', label: '作品' },
    { id: 'journey', index: '05', label: '历程' },
    { id: 'contact', index: '06', label: '联系' },
  ],
}

export const marquee = [
  'JAVA',
  'GO',
  'OPENGL',
  'WEBGL',
  'THREE.JS',
  'BLENDER',
  'GLSL',
  'REACT',
  'TYPESCRIPT',
  'KUBERNETES',
  'C++',
  'PYTHON',
]

export const techStack = [
  {
    key: 'java',
    name: 'Java',
    category: 'BACKEND',
    level: 92,
    years: '6 年',
    color: '#ffb26b',
    tagline: 'JVM 与高并发服务的稳定底座',
    description:
      '从 Spring Boot 到 Netty，从 GC 日志到线程模型，习惯用数据而不是直觉定位系统瓶颈。主导过日均 3 亿请求的交易链路拆分、限流与降级。',
    tags: ['Spring Boot', 'Netty', 'JVM Tuning', 'MySQL', 'Redis'],
  },
  {
    key: 'go',
    name: 'Go',
    category: 'BACKEND',
    level: 88,
    years: '4 年',
    color: '#5fd4f4',
    tagline: '云原生基础设施与低延迟中间件',
    description:
      '用 Go 写网关、调度器与数据管道。喜欢它克制的语法和可预测的调度，也喜欢 pprof 那种把一切都摊开给你看的坦诚。',
    tags: ['Gin', 'gRPC', 'Kubernetes', 'etcd', 'Prometheus'],
  },
  {
    key: 'opengl',
    name: 'OpenGL',
    category: 'GRAPHICS',
    level: 85,
    years: '5 年',
    color: '#8fd3ff',
    tagline: '手写图形管线，把每一帧拆开看',
    description:
      '从 VAO/VBO 到延迟渲染与 PBR，热衷用 RenderDoc 逐帧排查。实现过 SSAO、CSM 级联阴影、IBL 与环境光遮蔽，也在 compute shader 上做过粒子模拟。',
    tags: ['C++17', 'GLSL', 'PBR', 'Deferred Shading', 'RenderDoc'],
  },
  {
    key: 'webgl',
    name: 'WebGL / Three.js',
    category: 'GRAPHICS',
    level: 90,
    years: '4 年',
    color: '#a78bfa',
    tagline: '把实时 3D 带进浏览器',
    description:
      'Three.js 与原生 WebGL2 双修，做过百万级点云可视化，也做了你正在看的这个背景。关注 draw call、纹理带宽与移动端的优雅降级。',
    tags: ['Three.js', 'WebGL2', 'React', 'GLSL', 'Instancing'],
  },
  {
    key: 'blender',
    name: 'Blender',
    category: 'CREATIVE',
    level: 83,
    years: '5 年',
    color: '#ff9d5c',
    tagline: '程序化建模与资产自动化',
    description:
      '用 Python API 和 Geometry Nodes 把重复的美术劳动变成可复用的节点与脚本，搭建过从参数化建模、UV 展开到 glTF 导出的自动资产管线。',
    tags: ['Python API', 'Geometry Nodes', 'glTF', 'Cycles', 'Rigging'],
  },
  {
    key: 'glsl',
    name: 'GLSL',
    category: 'GRAPHICS',
    level: 86,
    years: '5 年',
    color: '#5eead4',
    tagline: '用数学描述光',
    description:
      '噪声、体积光、后处理与 GPGPU。相信一行好的 shader 胜过十页参数说明，也相信性能预算应该写进设计稿里。',
    tags: ['Shader', 'SDF', 'Noise', 'Post FX', 'GPGPU'],
  },
  {
    key: 'react',
    name: 'React / TypeScript',
    category: 'FRONTEND',
    level: 94,
    years: '6 年',
    color: '#67e8f9',
    tagline: '把复杂交互收拾干净',
    description:
      '组件边界、状态归属、可访问性与动效性能。用 React 承载 3D 场景与数据密集型界面，也维护过服务端渲染与可视化组件库。',
    tags: ['React 19', 'TypeScript', 'Vite', 'Zustand', 'A11y'],
  },
]

export const aboutCards = [
  {
    icon: 'now',
    label: '现在',
    title: '在打磨 Aurora Engine 的延迟渲染管线，同时为团队搭建一套 Blender 程序化资产流水线。',
    wide: true,
  },
  {
    icon: 'pin',
    label: '坐标',
    title: '杭州 · 中国',
    text: 'UTC+8 / 远程友好',
  },
  {
    icon: 'book',
    label: '在读',
    title: '《Real-Time Rendering》',
    text: '第 4 版，第三次重读',
  },
  {
    icon: 'tool',
    label: '日常工具',
    title: 'Neovim · RenderDoc · Blender · Figma',
    text: '外加一杯手冲',
    wide: true,
  },
]

export const principles = [
  {
    index: '01',
    title: '先让它能跑',
    text: '再让它优雅。可工作的简单系统，永远胜过漂亮的空想架构。',
  },
  {
    index: '02',
    title: '性能是设计出来的',
    text: '帧预算和延迟预算从第一行代码开始，而不是上线前的一次抢救。',
  },
  {
    index: '03',
    title: '画面即产品',
    text: '渲染不只是技术指标，它最终要让人屏住呼吸一秒钟。',
  },
]

export const pipeline = [
  {
    index: '01',
    title: '顶点数据',
    en: 'Vertex Specification',
    text: 'VAO / VBO 把网格组织成 GPU 能高效读取的内存布局。',
  },
  {
    index: '02',
    title: '顶点着色器',
    en: 'Vertex Shader',
    text: '模型、视图、投影变换逐顶点执行，把坐标送进裁剪空间。',
  },
  {
    index: '03',
    title: '图元装配',
    en: 'Primitive Assembly',
    text: '三角形被组装、裁剪，只有落在视锥内的部分继续前进。',
  },
  {
    index: '04',
    title: '光栅化',
    en: 'Rasterization',
    text: '几何被离散成片元，顶点属性沿屏幕空间插值。',
  },
  {
    index: '05',
    title: '片元着色器',
    en: 'Fragment Shader',
    text: '逐像素计算光照、纹理与后处理，是画面质感的来源。',
  },
  {
    index: '06',
    title: '测试与混合',
    en: 'Tests & Blending',
    text: '深度、模板测试之后混合写入帧缓冲，一帧才算完成。',
  },
]

export const projects = [
  {
    id: 'aurora',
    index: '01',
    title: 'Aurora Engine',
    category: '实时渲染引擎',
    year: '2024 — 至今',
    description:
      '从零实现的 OpenGL 4.6 渲染器：延迟着色、IBL、级联阴影、SSAO 与 Bloom，配套场景编辑器与逐帧性能分析面板。',
    metric: '1080p · 144 fps',
    tags: ['C++17', 'OpenGL', 'GLSL', 'ImGui'],
    href: 'https://github.com/',
    visual: 'terrain',
    accent: '#8fd3ff',
  },
  {
    id: 'nebula',
    index: '02',
    title: 'Nebula Viz',
    category: 'WebGL 数据可视化',
    year: '2025',
    description:
      '面向天文数据的点云浏览器。分块 LOD、Web Worker 解码与实例化渲染，让百万级点云在浏览器里保持稳定帧率。',
    metric: '1.2M points · 60 fps',
    tags: ['Three.js', 'WebGL2', 'React', 'Rust / WASM'],
    href: 'https://github.com/',
    visual: 'nebula',
    accent: '#a78bfa',
  },
  {
    id: 'forge',
    index: '03',
    title: 'Forge',
    category: 'Blender 程序化资产',
    year: '2024',
    description:
      '把硬表面资产拆成可参数化的几何节点组，一键生成 200 多种变体，并自动完成 UV、烘焙与 glTF 导出。',
    metric: '200+ assets / 1 click',
    tags: ['Blender', 'Python', 'Geometry Nodes', 'glTF'],
    href: 'https://github.com/',
    visual: 'forge',
    accent: '#ff9d5c',
  },
  {
    id: 'pulse',
    index: '04',
    title: 'Pulse Gateway',
    category: 'Go 微服务网关',
    year: '2023',
    description:
      '基于 Go 的 API 网关：动态路由、JWT 鉴权、限流熔断与灰度发布。单实例稳定支撑 12 万 QPS，P99 延迟 8ms。',
    metric: '120k QPS · P99 8ms',
    tags: ['Go', 'gRPC', 'Redis', 'Kubernetes'],
    href: 'https://github.com/',
    visual: 'network',
    accent: '#5fd4f4',
  },
  {
    id: 'atlas',
    index: '05',
    title: 'Atlas Core',
    category: 'Java 交易中台',
    year: '2022 — 2023',
    description:
      '日均 3 亿请求的交易核心：Spring Cloud 微服务拆分、TCC 分布式事务、热点账户与全链路压测，把支付链路 P99 从 180ms 压到 46ms。',
    metric: '300M req/day · P99 46ms',
    tags: ['Java', 'Spring Cloud', 'MySQL', 'RocketMQ'],
    href: 'https://github.com/',
    visual: 'ledger',
    accent: '#ffb26b',
  },
]

export const journey = [
  {
    period: '2025 — 至今',
    role: '资深图形 / 后端工程师',
    org: '某科技公司 · 图形平台组',
    text: '负责实时渲染引擎与云原生基础设施，连接「好看的画面」和「扛得住的服务」。',
    tags: ['OpenGL', 'Go', 'Kubernetes'],
  },
  {
    period: '2023 — 2025',
    role: '全栈工程师',
    org: '某创业公司 · 从 0 到 1',
    text: '搭起可视化产品的前端与后端：Three.js 渲染、Go 服务与自动化资产管线。',
    tags: ['Three.js', 'React', 'Go'],
  },
  {
    period: '2021 — 2023',
    role: '后端工程师',
    org: '某互联网公司 · 交易中台',
    text: 'Java 微服务与高并发交易链路，做过服务拆分、限流降级与全链路压测。',
    tags: ['Java', 'Spring Cloud', 'MySQL'],
  },
  {
    period: '2019 — 2021',
    role: '计算机图形学 · 硕士',
    org: '图形学实验室',
    text: '研究实时渲染与程序化内容生成，顺手把实验室的离线管线做成了 Blender 插件。',
    tags: ['Graphics', 'Blender', 'C++'],
  },
]

export const contact = {
  kicker: '06 / CONTACT',
  title: ['有想法？', '一起把它', '做出来'],
  text: '无论是实时渲染、数据可视化，还是需要有人把后端稳稳扛住，都欢迎聊聊。通常 24 小时内回复。',
}
