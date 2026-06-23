import { useAnalysisStore } from '@/store/analysisStore'
import { useAuthStore } from '@/store/authStore'
import { analyzeURL } from '@/lib/api'
import { generateAISummary, generateRiskPriorities } from '@/lib/openai'

export function useAnalysis() {
  const analysisStore = useAnalysisStore()
  const { user } = useAuthStore()

  const startAnalysis = async (url: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const target = await analysisStore.createTarget(user.uid, url)
      
      const results = await analyzeURL(url)
      const aiSummary = await generateAISummary(results)
      const aiPriority = await generateRiskPriorities(results)

      await analysisStore.updateTargetResults(target.id, {
        ...results,
        aiSummary,
        aiPriority,
      })

      return target
    } catch (error) {
      console.error('Analysis error:', error)
      throw error
    }
  }

  return {
    ...analysisStore,
    startAnalysis,
  }
}
