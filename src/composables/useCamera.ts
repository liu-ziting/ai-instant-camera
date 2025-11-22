import { ref, type Ref } from 'vue'

export type FacingMode = 'user' | 'environment'

export function useCamera(videoRef: Ref<HTMLVideoElement | undefined>) {
  const currentFacingMode = ref<FacingMode>('user')
  const currentStream = ref<MediaStream | null>(null)

  const startCamera = async () => {
    // 停止之前的流
    if (currentStream.value) {
      currentStream.value.getTracks().forEach(track => track.stop())
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentFacingMode.value,
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        },
        audio: false
      })

      if (videoRef.value) {
        videoRef.value.srcObject = stream
        currentStream.value = stream
      }
    } catch (e) {
      console.error('摄像头启动失败:', e)
      alert('摄像头启动失败: ' + (e as Error).message)
    }
  }

  const toggleCamera = () => {
    // 切换状态
    currentFacingMode.value = currentFacingMode.value === 'user' ? 'environment' : 'user'

    // 简单的视觉反馈
    if (videoRef.value) {
      videoRef.value.style.opacity = '0'
      setTimeout(() => {
        startCamera().then(() => {
          if (videoRef.value) {
            videoRef.value.style.opacity = '0.8'
          }
        })
      }, 200)
    }
  }

  return {
    currentFacingMode,
    startCamera,
    toggleCamera
  }
}