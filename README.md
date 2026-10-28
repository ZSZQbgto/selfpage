# 林屿 · 个人主页

一个用 **React 19 + Three.js + 原生 WebGL** 构建的单页个人作品集，集中展示 Java / Go / OpenGL / WebGL / Blender / GLSL / React 技术栈。页面视觉全部由代码生成：SVG 项目封面、CSS 光效与实时 GLSL，无外部图片依赖（`public/og-cover.jpg` 仅为社交分享预览图）。

## 启动

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # 产出 dist/
npm run preview  # 预览构建结果
```

## 页面结构

| 区块 | 内容 |
| --- | --- |
| Hero | Three.js 粒子结、环绕技术标签、Bloom 辉光、鼠标视差与滚动联动 |
| 技术栈 | 七组技术交互列表 + 熟练度环，支持鼠标 / 键盘切换，首屏 3D 标签同步高亮 |
| 渲染管线 | OpenGL 管线六阶段 + 实时 GLSL 片元着色器演示（原生 WebGL2） |
| 作品 | 五张项目卡片（含一张 Java 交易中台通栏卡），SVG 程序化封面、鼠标 3D 倾斜与聚光 |
| 历程 / 联系 | 时间线、邮件入口与社交链接 |

## 技术要点

- **Three.js 主视觉**：`src/three/HeroScene.js`。自定义粒子结、星场、标签 Sprite、轨道环与 `UnrealBloomPass` 后处理；DPR 上限 1.8，滚出首屏后自动暂停渲染。
- **原生 WebGL**：`src/components/ShaderPreview.jsx` 手写顶点/片元着色器，FBM 噪声实时生成极光渐变，进入视口才启动渲染循环。
- **可访问性**：语义化结构、跳转链接、键盘可操作 tabs、`aria` 标注、`prefers-reduced-motion` 降级、WebGL 不可用时的 CSS 视觉兜底。
- **响应式**：桌面 / 平板 / 手机三档布局，移动端自动调整 3D 相机与场景位置。

## 质量检查

先启动 `npm run dev`，然后（脚本默认使用本机 Chrome，可在文件顶部调整路径）：

```bash
node tools/shoot.mjs        # 桌面 / 移动端截图，输出到 .shots/
node tools/interact.mjs     # 移动端菜单跳转、键盘 tabs、横向溢出、降级检查
node tools/audit-a11y.mjs   # axe-core WCAG A/AA 扫描
```

设置 `PREVIEW_URL=http://127.0.0.1:4173/` 可对生产预览执行同样的检查。

## 自定义

所有文案、技术栈、项目、时间线与社交链接集中在 [`src/data/content.js`](src/data/content.js)，替换成你自己的信息即可。配色变量位于 [`src/styles/global.css`](src/styles/global.css) 顶部的 `:root`。

> 页面中的姓名、公司、邮箱与链接均为示例占位内容，发布前请替换。
