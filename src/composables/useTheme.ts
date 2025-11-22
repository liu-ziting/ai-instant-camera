import { ref, computed } from 'vue'

export type ThemeType = 'classic' | 'white' | 'vintage' | 'neon'

export interface Theme {
  id: ThemeType
  name: string
  colors: {
    background: string
    cameraBody: string
    topHousing: string
    rainbow: string
    lens: string
    flash: string
    screws: string
    brand: string
  }
}

export const themes: Record<ThemeType, Theme> = {
  classic: {
    id: 'classic',
    name: '经典黑',
    colors: {
      background: 'radial-gradient(circle at center, #2c3e50 0%, #000 100%)',
      cameraBody: '#1a1a1a',
      topHousing: 'linear-gradient(to bottom, #333, #222)',
      rainbow: 'linear-gradient(to bottom, #5ac8fa 16.6%, #4cd964 16.6% 33.2%, #ffcc00 33.2% 49.8%, #ff9500 49.8% 66.4%, #ff3b30 66.4%)',
      lens: 'radial-gradient(circle at 30% 30%, #333, #000)',
      flash: '#444',
      screws: 'linear-gradient(45deg, #555, #222)',
      brand: '#e74c3c'
    }
  },
  white: {
    id: 'white',
    name: '纯净白',
    colors: {
      background: 'radial-gradient(circle at center, #f8f9fa 0%, #e9ecef 100%)',
      cameraBody: '#ffffff',
      topHousing: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
      rainbow: 'linear-gradient(to bottom, #ff6b6b 16.6%, #4ecdc4 16.6% 33.2%, #45b7d1 33.2% 49.8%, #96ceb4 49.8% 66.4%, #feca57 66.4%)',
      lens: 'radial-gradient(circle at 30% 30%, #dee2e6, #adb5bd)',
      flash: '#f8f9fa',
      screws: 'linear-gradient(45deg, #adb5bd, #6c757d)',
      brand: '#ff6b6b'
    }
  },
  vintage: {
    id: 'vintage',
    name: '复古棕',
    colors: {
      background: 'radial-gradient(circle at center, #8b4513 0%, #654321 100%)',
      cameraBody: '#d2691e',
      topHousing: 'linear-gradient(to bottom, #cd853f, #a0522d)',
      rainbow: 'linear-gradient(to bottom, #daa520 16.6%, #b8860b 16.6% 33.2%, #8b4513 33.2% 49.8%, #a0522d 49.8% 66.4%, #654321 66.4%)',
      lens: 'radial-gradient(circle at 30% 30%, #8b4513, #654321)',
      flash: '#f4a460',
      screws: 'linear-gradient(45deg, #8b4513, #654321)',
      brand: '#daa520'
    }
  },
  neon: {
    id: 'neon',
    name: '霓虹紫',
    colors: {
      background: 'radial-gradient(circle at center, #2d1b69 0%, #0f0f23 100%)',
      cameraBody: '#1a1a2e',
      topHousing: 'linear-gradient(to bottom, #16213e, #0f0f23)',
      rainbow: 'linear-gradient(to bottom, #ff006e 16.6%, #8338ec 16.6% 33.2%, #3a86ff 33.2% 49.8%, #06ffa5 49.8% 66.4%, #ffbe0b 66.4%)',
      lens: 'radial-gradient(circle at 30% 30%, #16213e, #0f0f23)',
      flash: '#8338ec',
      screws: 'linear-gradient(45deg, #8338ec, #3a86ff)',
      brand: '#ff006e'
    }
  }
}

export function useTheme() {
  const currentTheme = ref<ThemeType>('classic')
  
  const theme = computed(() => themes[currentTheme.value])
  
  const setTheme = (themeId: ThemeType) => {
    currentTheme.value = themeId
    applyTheme(themes[themeId])
  }
  
  const applyTheme = (themeData: Theme) => {
    const root = document.documentElement
    
    // 更新CSS变量
    root.style.setProperty('--bg-gradient', themeData.colors.background)
    root.style.setProperty('--cam-body', themeData.colors.cameraBody)
    root.style.setProperty('--top-housing', themeData.colors.topHousing)
    root.style.setProperty('--rainbow', themeData.colors.rainbow)
    root.style.setProperty('--lens-gradient', themeData.colors.lens)
    root.style.setProperty('--flash-color', themeData.colors.flash)
    root.style.setProperty('--screw-gradient', themeData.colors.screws)
    root.style.setProperty('--brand-color', themeData.colors.brand)
  }
  
  const nextTheme = () => {
    const themeIds = Object.keys(themes) as ThemeType[]
    const currentIndex = themeIds.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themeIds.length
    setTheme(themeIds[nextIndex])
  }
  
  // 初始化时应用默认的经典黑主题
  const initTheme = () => {
    applyTheme(themes.classic)
  }
  
  return {
    currentTheme,
    theme,
    themes,
    setTheme,
    nextTheme,
    initTheme
  }
}