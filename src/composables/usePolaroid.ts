export function usePolaroid() {
  // 生成颗粒感噪点
  const addGrainEffect = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number = 0.15) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // 生成随机噪点
      const noise = (Math.random() - 0.5) * intensity * 255

      // 应用噪点到RGB通道
      data[i] = Math.max(0, Math.min(255, data[i] + noise))     // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)) // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)) // B
      // Alpha通道保持不变
    }

    ctx.putImageData(imageData, 0, 0)
  }

  // 添加胶片色调效果
  const addFilmTone = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // 胶片色调调整 - 增加暖色调，降低对比度
      data[i] = Math.min(255, r * 1.1 + 10)     // 增强红色
      data[i + 1] = Math.min(255, g * 1.05 + 5) // 轻微增强绿色
      data[i + 2] = Math.min(255, b * 0.95)     // 轻微降低蓝色
    }

    ctx.putImageData(imageData, 0, 0)
  }

  // 生成带颗粒感的拍立得图片
  const generatePolaroidImage = async (
    imageDataUrl: string,
    text: string
  ): Promise<string> => {
    console.log('generatePolaroidImage 开始执行')
    return new Promise((resolve, reject) => {
      // 创建canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      console.log('Canvas 创建成功')

      // 加载原始图片
      const img = new Image()
      img.onload = () => {
        console.log('图片加载成功')

        // 拍立得标准尺寸：竖向长方形，照片区域为正方形，下方大片留白
        const polaroidWidth = 600
        const polaroidHeight = 750  // 约 4:5 比例
        const photoSize = 480       // 正方形照片
        const topMargin = 40
        const sideMargin = (polaroidWidth - photoSize) / 2
        const bottomWhiteSpace = polaroidHeight - photoSize - topMargin - 40

        // 设置canvas尺寸
        canvas.width = polaroidWidth
        canvas.height = polaroidHeight

        // 绘制拍立得白色背景
        ctx.fillStyle = '#fdfdfd'
        ctx.fillRect(0, 0, polaroidWidth, polaroidHeight)

        // 添加纸张纹理
        ctx.fillStyle = '#f8f8f8'
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * polaroidWidth
          const y = Math.random() * polaroidHeight
          const size = Math.random() * 1.5
          ctx.fillRect(x, y, size, size)
        }

        // 绘制照片区域（正方形）
        const photoX = sideMargin
        const photoY = topMargin

        // 绘制照片背景（黑色边框效果）
        ctx.fillStyle = '#000'
        ctx.fillRect(photoX - 2, photoY - 2, photoSize + 4, photoSize + 4)

        // 裁剪并绘制图片（正方形）
        ctx.save()
        ctx.rect(photoX, photoY, photoSize, photoSize)
        ctx.clip()

        // 计算图片缩放和居中（保持宽高比，填满正方形）
        const scale = Math.max(photoSize / img.width, photoSize / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const offsetX = photoX + (photoSize - scaledWidth) / 2
        const offsetY = photoY + (photoSize - scaledHeight) / 2

        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight)
        ctx.restore()

        // 添加胶片色调效果
        addFilmTone(ctx, polaroidWidth, polaroidHeight)

        // 添加颗粒感效果
        addGrainEffect(ctx, polaroidWidth, polaroidHeight, 0.12)

        // 绘制文字区域（在底部留白区域）
        const textStartY = photoY + photoSize + 30
        const textAreaHeight = bottomWhiteSpace - 60

        // 设置文字样式
        ctx.fillStyle = '#2c2c2c'
        ctx.font = 'bold 18px "Comic Sans MS", cursive, sans-serif'
        ctx.textAlign = 'center'

        // 文字换行处理
        const maxWidth = photoSize - 40
        const words = text.split('')
        let line = ''
        let y = textStartY
        const lineHeight = 26

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i]
          const metrics = ctx.measureText(testLine)

          if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line, polaroidWidth / 2, y)
            line = words[i]
            y += lineHeight

            // 防止文字超出底部
            if (y > textStartY + textAreaHeight - 40) break
          } else {
            line = testLine
          }
        }

        // 绘制最后一行
        if (line && y <= textStartY + textAreaHeight - 40) {
          ctx.fillText(line, polaroidWidth / 2, y)
        }

        // 重置阴影效果
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        // 添加时间戳和品牌标识（在底部）
        const bottomY = polaroidHeight - 20

        // 设置小字体样式
        ctx.font = 'bold 11px "Courier New", monospace'
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'

        // 左侧：时间戳
        ctx.textAlign = 'left'
        const now = new Date()
        const timestamp = now.toLocaleDateString('zh-CN') + ' ' + now.toLocaleTimeString('zh-CN', { hour12: false })
        ctx.fillText(timestamp, 30, bottomY)

        // 右侧：品牌标识
        ctx.textAlign = 'right'
        ctx.fillText('RETRO CAM AI', polaroidWidth - 30, bottomY)

        console.log('拍立得图片处理完成，准备返回')
        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }

      img.onerror = (error) => {
        console.error('图片加载失败:', error)
        reject(error)
      }

      console.log('开始加载图片')
      img.src = imageDataUrl
    })
  }

  // 检测是否为移动设备
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // 显示拍立得图片并提示用户保存
  const showPolaroidForSave = (dataUrl: string) => {
    // 创建全屏模态框
    const modal = document.createElement('div')
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `

    // 创建拍立得图片
    const img = document.createElement('img')
    img.src = dataUrl
    img.style.cssText = `
      max-width: 90%;
      max-height: 70%;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
      margin-bottom: 20px;
    `

    // 创建保存提示
    const instructions = document.createElement('div')
    instructions.style.cssText = `
      color: white;
      text-align: center;
      font-size: 18px;
      line-height: 1.6;
      margin-bottom: 30px;
      max-width: 400px;
    `

    const mobile = isMobile()
    instructions.innerHTML = mobile
      ? `<div style="font-size: 24px; margin-bottom: 10px;">📱</div>
         <div style="font-weight: bold; margin-bottom: 8px;">长按图片保存到相册</div>
         <div style="font-size: 14px; opacity: 0.8;">或者右键选择"保存图片"</div>`
      : `<div style="font-size: 24px; margin-bottom: 10px;">💻</div>
         <div style="font-weight: bold; margin-bottom: 8px;">右键图片选择"图片另存为"</div>
         <div style="font-size: 14px; opacity: 0.8;">或者拖拽图片到桌面</div>`

    // 创建关闭按钮
    const closeBtn = document.createElement('button')
    closeBtn.textContent = '关闭'
    closeBtn.style.cssText = `
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 16px;
      cursor: pointer;
      font-weight: 500;
      backdrop-filter: blur(10px);
      transition: all 0.2s ease;
    `

    closeBtn.onmouseover = () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.3)'
    }

    closeBtn.onmouseout = () => {
      closeBtn.style.background = 'rgba(255, 255, 255, 0.2)'
    }

    closeBtn.onclick = () => {
      document.body.removeChild(modal)
    }

    // 组装元素
    modal.appendChild(img)
    modal.appendChild(instructions)
    modal.appendChild(closeBtn)

    // 点击背景关闭
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    }

    // ESC键关闭
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.removeChild(modal)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // 添加到页面
    document.body.appendChild(modal)

    return true
  }

  // 生成并显示拍立得图片供用户保存
  const savePolaroid = async (imageDataUrl: string, text: string) => {
    try {
      // 生成拍立得图片
      const polaroidDataUrl = await generatePolaroidImage(imageDataUrl, text)

      // 直接显示图片让用户保存
      showPolaroidForSave(polaroidDataUrl)

      return true
    } catch (error) {
      console.error('生成拍立得图片失败:', error)
      alert('生成图片失败，请重试')
      return false
    }
  }

  return {
    generatePolaroidImage,
    savePolaroid
  }
}