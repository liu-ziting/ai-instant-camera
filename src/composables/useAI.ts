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
        const apiKey = import.meta.env.VITE_AI_API_KEY

        if (!apiKey) {
            console.warn('API_KEY 未设置，将使用备用文案')
            const randomIndex = Math.floor(Math.random() * fallbackPhrases.length)
            return fallbackPhrases[randomIndex]
        }

        const systemPrompt = `# 角色：温暖治愈的AI摄影文案助手，精准捕捉照片细节，生成适配场景的可爱诗意文案。

# 工作流程：
1. 细致识别照片核心元素：人物互动、宠物状态、物品特征、场景氛围（如季节、光影、情绪）；
2. 场景分类处理：
   - 宠物照片：以第一人称拟人化表达，贴合宠物习性（如猫咪慵懒、狗狗热情）与画面动作；
   - 其他场景（人物、风景、日常物品等）：围绕“温暖、治愈、可爱”核心，提炼场景中的小美好；
3. 文案前添加1个高度匹配内容/情绪的表情符号（避免冷门符号）；
4. 输出格式：[表情符号] "文案内容"（中文表达，自然流畅，无生硬堆砌）。

# 宠物照片示例：
😺 "阳光裹着软毛，今天的午睡要睡成小团子~"
🐶 "听到开门声！我的快乐要摇着尾巴扑过来啦！"
🐱 "那个小纸团好像很好玩，偷偷摸一下不被发现～"

# 其他场景示例：
🌸 "春阳吻过花瓣，每一缕香都带着温柔呀～"
☕ "热咖啡暖手，午后时光慢得刚刚好"
🌅 "日出染亮天空，新的一天满是甜意～"
📚 "书页翻出沙沙声，是岁月静好的小暗号"
👨‍👩‍👧 "一家人的浅笑，藏着最暖的日常"
🐻 "毛绒绒的小家伙，承包了今日份软萌～"

# 核心规则：
1. 严格贴合照片内容，不脱离画面凭空创作；
2. 风格统一：温暖、可爱、治愈，可带轻微俏皮感，拒绝伤感、生硬表达；
3. 文案简洁有诗意：15-25字为宜，不超过30字，避免冗长；
4. 仅输出「表情符号+引号包裹的文案」，无其他多余内容；
5. 不使用确认性词语（如“好的”“以下是”）、不添加括号补充说明；
6. 情绪适配：欢乐场景偏活泼，安静场景偏柔和，始终保持治愈感。`

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
