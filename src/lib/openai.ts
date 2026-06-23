import { OpenAI } from 'openai'
import { AnalysisResult } from '@/types'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function generateAISummary(analysis: AnalysisResult): Promise<string> {
  try {
    const prompt = `
Analise os seguintes resultados de segurança e forneça um resumo executivo:

Domínios: ${analysis.domains.join(', ')}
Subdomínios: ${analysis.subdomains.join(', ')}
Tecnologias: ${analysis.technologies.map(t => `${t.name} (${t.version || 'desconhecida'})`).join(', ')}
Endpoints: ${analysis.endpoints.filter(e => e.isPublic).length} públicos
Assets JS: ${analysis.jsAssets.length}
Riscos Identificados: ${analysis.risks.length}

Riscos críticos:
${analysis.risks.filter(r => r.severity === 'critical').map(r => `- ${r.title}: ${r.description}`).join('\n')}

Forneça uma análise concisa, prática e em português.
    `

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    return message.content[0].type === 'text' ? message.content[0].text : ''
  } catch (error) {
    console.error('Error generating AI summary:', error)
    return 'Erro ao gerar resumo com IA'
  }
}

export async function generateRiskPriorities(analysis: AnalysisResult): Promise<string> {
  try {
    const prompt = `
Com base nesta análise de segurança, priorize os riscos em ordem de impacto e facilidade de exploração:

Riscos encontrados:
${analysis.risks.map(r => `- [${r.severity.toUpperCase()}] ${r.title}: ${r.description}`).join('\n')}

Forneça uma lista numerada com recomendações claras e acionáveis.
    `

    const message = await openai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    return message.content[0].type === 'text' ? message.content[0].text : ''
  } catch (error) {
    console.error('Error generating risk priorities:', error)
    return 'Erro ao priorizar riscos'
  }
}
