# Retro Pro Camera V3 - Vue3 + TypeScript

一个使用Vue3和TypeScript重构的复古相机应用，保持原有功能和UI设计不变。

## 功能特性

- 📷 实时摄像头预览
- 🔄 前后摄像头切换
- ⚡ 拍照功能（带闪光灯效果）
- 🤖 AI宠物行为解读（智谱AI GLM-4.1V）
- 💾 照片保存
- 🎨 复古UI设计
- 📱 响应式布局

## 技术栈

- Vue 3 (Composition API)
- TypeScript
- Vite
- CSS3 (保持原有样式)

## 项目结构

```
src/
├── App.vue              # 主组件
├── main.ts             # 应用入口
├── style.css           # 全局样式
├── composables/        # 组合式函数
│   ├── useCamera.ts    # 摄像头管理
│   ├── useAI.ts        # AI文案生成
│   └── useResize.ts    # 响应式缩放
└── vite-env.d.ts       # 类型定义
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 改造说明

1. **组件化**: 将原HTML单页面拆分为Vue组件结构
2. **TypeScript**: 添加类型安全支持
3. **组合式API**: 使用Vue3的Composition API管理状态和逻辑
4. **模块化**: 将功能拆分为可复用的组合式函数
5. **响应式**: 保持原有的响应式设计
6. **样式保持**: 完全保留原有的CSS样式和动画效果
7. **AI集成**: 集成智谱AI GLM-4.1V模型，实现宠物行为解读功能

## AI功能说明

- 拍照后自动将图片上传到智谱AI接口
- AI会识别图片中的宠物并分析其情绪状态
- 用第一人称拟人化表达宠物的心理活动
- 如果图片中没有宠物，会提示"图片中没有宠物~"
- API调用失败时会显示备用文案
- 支持加载状态显示

## 浏览器兼容性

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

需要支持 `getUserMedia` API 和现代JavaScript特性。