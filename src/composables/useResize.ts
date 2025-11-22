import { type Ref } from 'vue'

export function useResize(scalableWrapper: Ref<HTMLElement | undefined>) {
  const resizeCamera = () => {
    if (!scalableWrapper.value) return
    
    const w = window.innerWidth
    const h = window.innerHeight
    let scale = Math.min(1, (w - 20) / 380)
    if (h < 650) scale = Math.min(scale, h / 700)
    
    scalableWrapper.value.style.transform = `scale(${scale})`
  }

  return {
    resizeCamera
  }
}