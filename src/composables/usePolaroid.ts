export function usePolaroid() {
  // 创建拍立得样式的图片
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

      // 拍立得尺寸 (3:4比例，底部留白区域)
      const polaroidWidth = 600
      const polaroidHeight = 750
      const photoWidth = 540
      const photoHeight = 540
      const textAreaHeight = 150
      const padding = 30

      canvas.width = polaroidWidth
      canvas.height = polaroidHeight

      // 绘制拍立得背景 (白色)
      ctx.fillStyle = '#fdfdfd'
      ctx.fillRect(0, 0, polaroidWidth, polaroidHeight)

      // 添加纸张纹理
      ctx.fillStyle = '#f8f8f8'
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * polaroidWidth
        const y = Math.random() * polaroidHeight
        const size = Math.random() * 2
        ctx.fillRect(x, y, size, size)
      }

      // 绘制阴影效果
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 10

      // 加载并绘制照片
      const img = new Image()
      img.onload = () => {
        console.log('图片加载成功')
        // 重置阴影
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        // 绘制照片区域
        const photoX = (polaroidWidth - photoWidth) / 2
        const photoY = padding

        // 绘制照片背景
        ctx.fillStyle = '#000'
        ctx.fillRect(photoX, photoY, photoWidth, photoHeight)

        // 计算图片缩放比例，保持宽高比
        const imgAspect = img.width / img.height
        const photoAspect = photoWidth / photoHeight

        let drawWidth, drawHeight, drawX, drawY

        if (imgAspect > photoAspect) {
          // 图片更宽，以高度为准
          drawHeight = photoHeight
          drawWidth = drawHeight * imgAspect
          drawX = photoX - (drawWidth - photoWidth) / 2
          drawY = photoY
        } else {
          // 图片更高，以宽度为准
          drawWidth = photoWidth
          drawHeight = drawWidth / imgAspect
          drawX = photoX
          drawY = photoY - (drawHeight - photoHeight) / 2
        }

        // 裁剪区域
        ctx.save()
        ctx.beginPath()
        ctx.rect(photoX, photoY, photoWidth, photoHeight)
        ctx.clip()

        // 绘制图片
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

        // 添加复古滤镜效果
        ctx.globalCompositeOperation = 'multiply'
        ctx.fillStyle = 'rgba(255, 230, 200, 0.1)'
        ctx.fillRect(photoX, photoY, photoWidth, photoHeight)

        ctx.globalCompositeOperation = 'source-over'
        ctx.restore()

        // 绘制照片边框
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.lineWidth = 1
        ctx.strokeRect(photoX, photoY, photoWidth, photoHeight)

        // 绘制文字区域
        const textY = photoY + photoHeight + 20
        const textAreaWidth = photoWidth
        const textX = photoX

        // 设置文字样式 (打印机风格)
        ctx.fillStyle = '#2c2c2c'
        ctx.font = 'bold 24px "Courier New", monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // 文字换行处理
        const maxWidth = textAreaWidth - 40
        const lineHeight = 32
        const words = text.split('')
        let line = ''
        let lines: string[] = []

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i]
          const metrics = ctx.measureText(testLine)

          if (metrics.width > maxWidth && line !== '') {
            lines.push(line)
            line = words[i]
          } else {
            line = testLine
          }
        }
        lines.push(line)

        // 绘制文字
        const totalTextHeight = lines.length * lineHeight
        const startY = textY + (textAreaHeight - totalTextHeight) / 2

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight

          // 添加打印机颗粒感效果
          ctx.save()

          // 主文字
          ctx.fillStyle = '#2c2c2c'
          ctx.fillText(line, textX + textAreaWidth / 2, y)

          // 添加轻微的阴影效果模拟打印机墨点
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
          ctx.fillText(line, textX + textAreaWidth / 2 + 1, y + 1)

          ctx.restore()
        })

        // 添加拍立得品牌标识 (可选)
        ctx.font = 'bold 12px "Courier New", monospace'
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.textAlign = 'right'
        ctx.fillText('RETRO CAM AI', polaroidWidth - 20, polaroidHeight - 15)

        // 添加时间戳
        const now = new Date()
        const timestamp = now.toLocaleDateString('zh-CN') + ' ' + now.toLocaleTimeString('zh-CN', { hour12: false })
        ctx.font = '10px "Courier New", monospace'
        ctx.textAlign = 'left'
        ctx.fillText(timestamp, 20, polaroidHeight - 15)

        // 返回生成的图片
        console.log('拍立得图片绘制完成，准备返回')
        resolve(canvas.toDataURL('image/jpeg', 0.9))
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