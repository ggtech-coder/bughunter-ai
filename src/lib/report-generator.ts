import { Target } from '@/types'

export function generateReportHTML(targets: Target[], title: string, reportType: string): string {
  const date = new Date().toLocaleDateString('pt-BR')

  const targetSections = targets
    .map((target) => {
      const analysis = target.analysisResults
      const risks = analysis.risks || []
      const critical = risks.filter((r) => r.severity === 'critical')
      const high = risks.filter((r) => r.severity === 'high')

      return `
        <div style="margin-bottom: 40px; border-bottom: 2px solid #e2e8f0; padding-bottom: 30px;">
          <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 10px;">${target.url}</h2>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">
            Domínio: ${target.domain} | Analisado em: ${new Date(target.updatedAt).toLocaleDateString('pt-BR')}
          </p>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
            <div style="background: #fef2f2; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="color: #dc2626; font-size: 28px; font-weight: bold; margin: 0;">${critical.length}</p>
              <p style="color: #7f1d1d; font-size: 12px; margin: 5px 0 0 0;">Críticos</p>
            </div>
            <div style="background: #fff7ed; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="color: #ea580c; font-size: 28px; font-weight: bold; margin: 0;">${high.length}</p>
              <p style="color: #7c2d12; font-size: 12px; margin: 5px 0 0 0;">Altos</p>
            </div>
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; text-align: center;">
              <p style="color: #2563eb; font-size: 28px; font-weight: bold; margin: 0;">${analysis.technologies?.length || 0}</p>
              <p style="color: #1e3a8a; font-size: 12px; margin: 5px 0 0 0;">Tecnologias</p>
            </div>
          </div>

          ${reportType !== 'summary' ? `
          <h3 style="color: #334155; font-size: 18px; margin: 20px 0 10px 0;">Riscos Identificados</h3>
          ${risks.map((risk) => `
            <div style="background: ${
              risk.severity === 'critical' ? '#fef2f2' :
              risk.severity === 'high' ? '#fff7ed' :
              risk.severity === 'medium' ? '#fefce8' : '#eff6ff'
            }; border-left: 4px solid ${
              risk.severity === 'critical' ? '#dc2626' :
              risk.severity === 'high' ? '#ea580c' :
              risk.severity === 'medium' ? '#ca8a04' : '#2563eb'
            }; padding: 12px; margin-bottom: 10px; border-radius: 4px;">
              <p style="font-weight: bold; margin: 0 0 5px 0; color: #1e293b;">${risk.title}</p>
              <p style="font-size: 14px; margin: 0 0 5px 0; color: #475569;">${risk.description}</p>
              <p style="font-size: 13px; margin: 0; color: #64748b;"><strong>Remediação:</strong> ${risk.remediation}</p>
            </div>
          `).join('')}
          ` : ''}

          ${analysis.aiSummary && reportType === 'executive' ? `
          <h3 style="color: #334155; font-size: 18px; margin: 20px 0 10px 0;">Resumo Executivo (IA)</h3>
          <div style="background: #eff6ff; padding: 15px; border-radius: 8px;">
            <p style="font-size: 14px; color: #1e3a8a; white-space: pre-wrap; margin: 0;">${analysis.aiSummary}</p>
          </div>
          ` : ''}
        </div>
      `
    })
    .join('')

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 20px; color: #1e293b; }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #2563eb; }
        .header h1 { color: #1e293b; font-size: 32px; margin: 0 0 10px 0; }
        .header p { color: #64748b; font-size: 14px; margin: 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Gerado em ${date} | Tipo: ${reportType === 'summary' ? 'Resumido' : reportType === 'detailed' ? 'Detalhado' : 'Executivo'}</p>
      </div>

      ${targetSections}

      <div class="footer">
        <p>Relatório gerado por BugHunter AI</p>
      </div>
    </body>
    </html>
  `
}
