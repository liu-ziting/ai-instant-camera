import { ref } from 'vue'

export function useAI() {
  const isLoading = ref(false)

  // 备用文案（当API调用失败时使用）
  const fallbackPhrases = [
    '�  "此刻的美好，值得被记录~"',
    '✨ "生活中的小确幸，就在这里。"',
    '🌟 "每一个瞬间，都闪闪发光。"',
    '� ""时光温柔，岁月可爱。"',
    '🎈 "简单的快乐，最是珍贵。"',
    '🌈 "美好总是不期而遇。"',
    '🍃 "温柔的时光，静静流淌。"',
    '🌸 "平凡的日子，也有诗意。"'
  ]

  const callZhipuAI = async (base64Data: string): Promise<string> => {
    const apiKey = 'a835b9f6866d48ec956d341418df8a50.NuhlKYn58EkCb5iP'

    const systemPrompt = `# 角色：温暖的AI摄影助手，能够识别照片内容并生成温馨可爱的文案。

# 工作流程：
1. 仔细观察照片中的内容，包括人物、动物、物品、场景等。
2. 如果是宠物照片，用第一人称拟人化表达宠物的心理状态。
3. 如果是其他内容，生成温馨、可爱、有诗意的文案。
4. 在文案前添加一个与内容或情绪匹配的表情符号。
5. 输出格式：[表情符号] "文案内容"（使用自然温暖的中文表达）。

# 宠物照片示例：
😺 "今天的阳光真暖和，我要在这里美美地睡个午觉~"
� "咦，那今边有什么好玩的？让我悄悄过去看看！"
� "主，人回来了！我好开心，尾巴都要摇断了！"

# 其他内容示例：
🌸 "春天的花朵，带着温柔的问候。"
☕ "一杯咖啡的温暖，足以慰藉整个午后。"
🌅 "每一个日出，都是新的希望开始。"
📚 "书页间藏着的，是岁月静好的时光。"
🏠 "家的温暖，就在这些平凡的瞬间里。"

# 注意事项：
- 根据图片内容灵活生成文案，不局限于宠物。
- 保持温暖、可爱、治愈的风格。
- 文案要简洁有诗意，不超过30个中文字符。
- 仅输出带表情符号的文案内容。
- 不使用"好的"等确认性回复。
- 不使用括号补充说明。`

    const userPrompt = '请分析这张照片的内容，生成一句温馨可爱的文案。'

    try {
      isLoading.value = true

      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'GLM-4.1V-Thinking-Flash',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Data}`
                  }
                },
                {
                  type: 'text',
                  text: userPrompt
                }
              ]
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()
      const result = data.choices[0]?.message?.content || '未能获取描述信息'

      isLoading.value = false
      return result

    } catch (error) {
      console.error('API调用失败:', error)
      isLoading.value = false

      // 返回备用文案
      const randomIndex = Math.floor(Math.random() * fallbackPhrases.length)
      return fallbackPhrases[randomIndex]
    }
  }

  // 从base64图片数据中提取纯base64字符串
  const extractBase64FromDataUrl = (dataUrl: string): string => {
    const base64Index = dataUrl.indexOf(',')
    return base64Index !== -1 ? dataUrl.substring(base64Index + 1) : dataUrl
  }

  const getAIText = async (imageDataUrl: string): Promise<string> => {
    const base64Data = extractBase64FromDataUrl(imageDataUrl)
    return await callZhipuAI(base64Data)
  }

  return {
    getAIText,
    isLoading
  }
}