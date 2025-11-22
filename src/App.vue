<template>
  <div class="flash-overlay" :class="{ 'flash-anim': isFlashing }"></div>
  
  <div id="scalable-wrapper" ref="scalableWrapper">
    <div class="anim-photo" :class="{ 'eject-anim': isEjecting }">
      <div class="anim-photo-inner"></div>
    </div>
    <div class="slot-guard">
      <div class="slot-gap"></div>
    </div>

    <div class="camera-case">
      <div class="screw s-tl"></div>
      <div class="screw s-tr"></div>
      <div class="screw s-bl"></div>

      <div class="top-housing">
        <div class="viewfinder"></div>
        <div class="flash-module" :class="{ firing: isFlashFiring }">
          <div class="flash-bulb"></div>
        </div>
      </div>

      <div class="rainbow-strip"></div>

      <div class="lens-assembly">
        <div class="lens-ring-grip">
          <div class="lens-glass-frame">
            <video 
              ref="videoRef" 
              autoplay 
              playsinline 
              muted
              :class="{ 'rear-view': currentFacingMode === 'environment' }"
            ></video>
            <div class="lens-reflection"></div>
            <div class="lens-flare-purple"></div>
          </div>
        </div>
      </div>

      <!-- 切换摄像头按钮 -->
      <div class="toggle-btn" @click="toggleCamera" title="切换摄像头">
        <svg class="toggle-icon" viewBox="0 0 24 24">
          <path
            d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5-3.5 3.5z"
          />
        </svg>
      </div>

      <div class="shutter-housing">
        <button class="shutter-btn" @click="takePhoto" :disabled="isShooting"></button>
      </div>

      <!-- 主题切换按钮 -->
      <div class="theme-btn" @click="nextTheme" :title="`当前主题: ${theme.name}`">
        <svg class="theme-icon" viewBox="0 0 24 24">
          <path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      </div>
      
      <div class="brand-label">
        PRO-CAM <span class="ai-label">AI</span>
      </div>
    </div>
  </div>

  <div class="modal-overlay" :class="{ active: showModal }">
    <div class="polaroid-card">
      <div class="photo-frame">
        <img :src="capturedImage" alt="captured photo" />
      </div>
      <div class="text-area">
        <div v-if="isLoading" class="ai-text loading">
          <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          AI正在解读中...
        </div>
        <div v-else class="ai-text" :class="{ show: showAiText }">{{ aiText }}</div>
      </div>
    </div>
    <div class="action-btns">
      <button class="btn btn-retake" @click="closeModal">再拍一张</button>
    </div>
  </div>

  <canvas ref="canvasRef" style="display: none"></canvas>
  
  <!-- 开源项目说明 -->
  <div class="open-source-footer">
    <div class="footer-content">
      <span class="powered-by">Powered by Gemini 3</span>
      <span class="separator">•</span>
      <a href="https://github.com/liu-ziting/ai-instant-camera" target="_blank" class="github-link">
        <svg class="github-icon" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Github
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCamera } from './composables/useCamera'
import { useAI } from './composables/useAI'
import { useResize } from './composables/useResize'
import { useTheme } from './composables/useTheme'

const scalableWrapper = ref<HTMLElement>()
const videoRef = ref<HTMLVideoElement>()
const canvasRef = ref<HTMLCanvasElement>()

// 状态管理
const isShooting = ref(false)
const isFlashing = ref(false)
const isFlashFiring = ref(false)
const isEjecting = ref(false)
const showModal = ref(false)
const showAiText = ref(false)
const capturedImage = ref('')
const aiText = ref('')

// 使用组合式函数
const { currentFacingMode, startCamera, toggleCamera } = useCamera(videoRef)
const { getAIText, isLoading } = useAI()
const { resizeCamera } = useResize(scalableWrapper)
const { theme, nextTheme, initTheme } = useTheme()

// 拍照功能
const takePhoto = async () => {
  if (isShooting.value || !videoRef.value || !canvasRef.value) return
  
  isShooting.value = true

  // 闪光灯效果
  isFlashing.value = true
  setTimeout(() => {
    isFlashing.value = false
  }, 150)

  isFlashFiring.value = true
  setTimeout(() => {
    isFlashFiring.value = false
  }, 200)

  // 拍照
  const video = videoRef.value
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')!
  
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // 根据摄像头方向调整镜像
  if (currentFacingMode.value === 'user') {
    // 前置：镜像翻转绘制
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
  }

  ctx.drawImage(video, 0, 0)
  capturedImage.value = canvas.toDataURL('image/jpeg', 0.9)

  // 照片弹出动画
  isEjecting.value = true

  setTimeout(() => {
    showModal.value = true
    setTimeout(() => {
      isEjecting.value = false
    }, 300)
  }, 600)

  // 生成AI文案
  aiText.value = ''
  showAiText.value = false
  try {
    const text = await getAIText(capturedImage.value)
    aiText.value = text
    showAiText.value = true
  } catch (e) {
    console.error('AI文案生成失败:', e)
    // 如果AI调用失败，显示默认文案
    aiText.value = '📸 "这一刻的美好，值得被记录~"'
    showAiText.value = true
  }
}

// 关闭模态框
const closeModal = () => {
  showModal.value = false
  isShooting.value = false
}



onMounted(() => {
  // 首先初始化黑色主题
  initTheme()
  startCamera()
  resizeCamera()
  window.addEventListener('resize', resizeCamera)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCamera)
})
</script>