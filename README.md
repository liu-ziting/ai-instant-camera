+# 📸 Retro Pro Camera V3

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5+-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI%20Powered-GLM--4.1V-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)

**一款融合复古美学与现代 AI 技术的智能相机应用**

_使用 Vue3 + TypeScript 重构，集成智谱 AI 视觉模型，为每张照片生成独特的 AI 文案_

</div>

---

## ✨ 功能特性

### 📷 核心拍摄功能

-   **实时预览**: 高清摄像头实时预览，支持 1080p 分辨率
-   **双摄切换**: 一键切换前置/后置摄像头，智能镜像处理
-   **专业快门**: 模拟真实相机快门体验，带触觉反馈
-   **闪光灯效果**: 逼真的闪光灯动画和全屏闪白效果
-   **照片弹出**: 拍照后的宝丽来照片弹出动画

### 🤖 AI 智能解读

-   **多场景识别**: 不仅限于宠物，支持人物、风景、物品等多种场景
-   **情感分析**: 深度分析图片内容，生成贴合场景的情感文案
-   **拟人化表达**: 宠物照片采用第一人称拟人化表达，生动有趣
-   **诗意文案**: 非宠物内容生成温馨治愈的诗意文案
-   **实时生成**: 基于智谱 AI GLM-4.1V-Thinking-Flash 模型，响应迅速

### 🎨 复古美学设计

-   **宝丽来风格**: 经典宝丽来相机外观设计
-   **材质纹理**: 真实的金属质感、皮革纹理和彩虹条纹
-   **打印机字体**: AI 文案采用等宽字体，模拟打印机颗粒感效果
-   **动画效果**: 丰富的 CSS3 动画，包括照片弹出、闪光等
-   **响应式设计**: 完美适配各种屏幕尺寸

### 🔧 技术亮点

-   **Vue3 Composition API**: 现代化的组件开发模式
-   **TypeScript**: 完整的类型安全保障
-   **模块化架构**: 功能解耦，易于维护和扩展
-   **性能优化**: Vite 构建工具，开发体验极佳
-   **错误处理**: 完善的错误处理和降级方案

---

## 🏗️ 技术架构

### 技术栈

```
Frontend Framework: Vue 3.5+ (Composition API)
Language: TypeScript 5.6+
Build Tool: Vite 5.4+
AI Service: 智谱AI GLM-4.1V-Thinking-Flash
Styling: CSS3 + CSS Variables
```

### 项目结构

```
retro-camera-vue/
├── 📁 public/                 # 静态资源
├── 📁 src/
│   ├── 📄 App.vue             # 主应用组件
│   ├── 📄 main.ts             # 应用入口点
│   ├── 📄 style.css           # 全局样式定义
│   ├── 📁 composables/        # Vue组合式函数
│   │   ├── 📄 useCamera.ts    # 摄像头管理逻辑
│   │   ├── 📄 useAI.ts        # AI接口调用逻辑
│   │   └── 📄 useResize.ts    # 响应式缩放逻辑
│   └── 📄 vite-env.d.ts       # TypeScript类型定义
├── 📄 package.json            # 项目依赖配置
├── 📄 tsconfig.json           # TypeScript配置
├── 📄 vite.config.ts          # Vite构建配置
└── 📄 README.md               # 项目文档
```

### 核心组合式函数

#### `useCamera.ts` - 摄像头管理

```typescript
interface CameraComposable {
    currentFacingMode: Ref<'user' | 'environment'>
    startCamera: () => Promise<void>
    toggleCamera: () => void
}
```

#### `useAI.ts` - AI 文案生成

```typescript
interface AIComposable {
    getAIText: (imageDataUrl: string) => Promise<string>
    isLoading: Ref<boolean>
}
```

#### `useResize.ts` - 响应式适配

```typescript
interface ResizeComposable {
    resizeCamera: () => void
}
```

---

## 🚀 开发指南

### 环境要求

-   **Node.js**: >= 18.0.0
-   **npm**: >= 8.0.0
-   **现代浏览器**: 支持 ES2020+和 WebRTC

### 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/your-username/retro-camera-vue.git
cd retro-camera-vue

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
# http://localhost:3000
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 构建产物位于 dist/ 目录
```

### 开发脚本

| 命令              | 描述           |
| ----------------- | -------------- |
| `npm run dev`     | 启动开发服务器 |
| `npm run build`   | 构建生产版本   |
| `npm run preview` | 预览构建结果   |

---

## 🤖 AI 功能详解

### 智谱 AI 集成

本项目集成了智谱 AI 的 GLM-4.1V-Thinking-Flash 多模态大模型，具备强大的图像理解和文本生成能力。

#### 功能特点

-   **多模态理解**: 同时处理图像和文本信息
-   **情感识别**: 准确识别图片中的情感色彩
-   **创意文案**: 生成富有创意和情感的文案内容
-   **快速响应**: 平均响应时间 < 2 秒

#### 文案生成策略

**宠物照片处理**:

```
输入: 宠物图片
处理: 识别宠物种类 → 分析表情动作 → 生成拟人化对话
输出: 😺 "今天的阳光真暖和，我要美美地睡个午觉~"
```

**通用场景处理**:

```
输入: 任意图片
处理: 场景识别 → 情感分析 → 诗意文案生成
输出: 🌸 "春天的花朵，带着温柔的问候。"
```

#### 错误处理机制

-   **网络异常**: 自动重试 + 备用文案
-   **API 限制**: 优雅降级到本地文案库
-   **内容过滤**: 确保输出内容健康正向

---

## 🎨 设计理念

### 复古美学

-   **色彩搭配**: 经典的黑白灰主色调 + 彩虹装饰条
-   **材质模拟**: CSS 实现的金属、皮革、玻璃质感
-   **细节雕琢**: 螺丝、反光、阴影等真实感细节

### 交互体验

-   **物理反馈**: 按钮按压、相机震动等拟物化交互
-   **动画流畅**: 60fps 的流畅动画体验
-   **响应迅速**: 优化的事件处理，减少延迟

### 字体设计

```css
/* 打印机风格字体 */
font-family: 'Courier New', 'Monaco', 'Menlo', 'Consolas', monospace;
/* 颗粒感效果 */
text-shadow: 1px 0px 0px rgba(0, 0, 0, 0.3), ...;
/* 打字机动画 */
animation: fadeInTypewriter 1.5s ease-out forwards;
```

---

## 📱 浏览器兼容性

| 浏览器  | 版本要求 | 支持状态    |
| ------- | -------- | ----------- |
| Chrome  | 88+      | ✅ 完全支持 |
| Firefox | 78+      | ✅ 完全支持 |
| Safari  | 14+      | ✅ 完全支持 |
| Edge    | 88+      | ✅ 完全支持 |

### 必需 API 支持

-   **MediaDevices.getUserMedia()**: 摄像头访问
-   **Canvas API**: 图像处理
-   **Fetch API**: 网络请求
-   **CSS Grid/Flexbox**: 布局支持

---

## 🔧 配置说明

### AI 接口配置

```typescript
// src/composables/useAI.ts
const apiKey = 'your-zhipu-ai-api-key'
const model = 'GLM-4.1V-Thinking-Flash'
```

### 摄像头配置

```typescript
// 支持的分辨率配置
const constraints = {
    video: {
        facingMode: 'user', // 'user' | 'environment'
        width: { ideal: 1080 },
        height: { ideal: 1080 }
    }
}
```

---

## 🚀 部署指南

### Vercel 部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署到Vercel
vercel --prod
```

### Netlify 部署

```bash
# 构建项目
npm run build

# 上传dist目录到Netlify
```

## 🙏 致谢

-   **Vue.js 团队** - 提供优秀的前端框架
-   **智谱 AI** - 提供强大的多模态 AI 能力
-   **开源社区** - 提供丰富的开发工具和资源
