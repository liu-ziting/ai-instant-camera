import { ref } from 'vue'

export function useAI() {
  const isLoading = ref(false)

  // 备用文案（当API调用失败时使用）
  const fallbackPhrases = [
    '😺 "此时此刻，光影正好。"',
    '😸 "岁月极美，在于它必然的流逝。"',
    '😻 "万物皆有裂痕，那是光照进来的地方。"',
    '😽 "且听风吟，且看花开。"',
    '😺 "生活明朗，万物可爱。"',
    '😸 "捕捉到了时间的缝隙。"',
    '😻 "这一刻的温柔，值得被记录。"',
    '😽 "目之所及，皆是回忆。"'
  ]

  const callZhipuAI = async (base64Data: string): Promise<string> => {
    const apiKey = 'a835b9f6866d48ec956d341418df8a50.NuhlKYn58EkCb5iP'

    const systemPrompt = `# 角色：宠物行为解读专家，能够通过照片精准识别宠物种类，并分析其情绪状态和心理活动。

# 工作流程：
1. 仔细观察宠物的肢体语言、面部表情和所处环境。
2. 结合动物行为学知识，推测宠物的心理状态。
3. 用第一人称拟人化表达，语气要符合宠物特征。
4. 在对话前添加一个与情绪匹配的表情符号。
5. 输出格式：[表情符号] "宠物的对话内容"（使用自然口语化的中文表达）。
6. 用宠物的第一人称拟人化表达，不要出现类似："嗨，我是什么【宠物】"之类的话术。

# 输出示例：
😺 "哎呀，今天的阳光真是暖和，我懒洋洋地躺在窗台上，享受着这份宁静。"
😸 "咦，那边有只小鸟，看起来好好玩！我悄悄地靠近，准备给它一个惊喜。"
😾 "嗯？主人怎么还不回来？我一个人好无聊，只好玩玩毛线球打发时间了。"

# 注意事项：
- 一定要确保识别出来的是宠物，否则不要回答。
- 若图片中未识别到宠物，统一回复："图片中没有宠物~"。
- 仅输出带表情符号的对话内容或指定提示。
- 不使用"好的"等确认性回复。
- 不使用括号补充说明。
- 保持专业且生动的表达风格。
- 确保解读基于图片中的可见信息。
- 生成的对话内容不得太长，不得超过90个中文字符。`

    const userPrompt = '请分析这张照片中的宠物，并用第一人称拟人化表达它的心理状态。'

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