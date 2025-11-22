export function useAI() {
  const aiPhrases = [
    '此时此刻，光影正好。',
    '岁月极美，在于它必然的流逝。',
    '万物皆有裂痕，那是光照进来的地方。',
    '且听风吟，且看花开。',
    '生活明朗，万物可爱。',
    '捕捉到了时间的缝隙。',
    '这一刻的温柔，值得被记录。',
    '目之所及，皆是回忆。',
    '光阴的故事，都在这里了。',
    '人间烟火气，最抚凡人心。',
    '定格，即是永恒。',
    '风起的时候，想念也开始了。'
  ]

  const getAIText = (): Promise<string> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * aiPhrases.length)
        resolve(aiPhrases[randomIndex])
      }, 1000)
    })
  }

  return {
    getAIText
  }
}