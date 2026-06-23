import axios from 'axios'
import { AnalysisResult, Endpoint, Technology, JSAsset, Risk } from '@/types'

const API_TIMEOUT = 30000

// Proxy CORS público gratuito - necessário porque o navegador bloqueia
// requisições diretas a domínios de terceiros (CORS). Tem limitações:
// pode ficar instável/lento sob carga, e não expõe headers HTTP originais
// completos (apenas status code e content-type).
const CORS_PROXY = 'https://api.allorigins.win/get?url='

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface ProxyResponse {
  content: string
  statusCode: number
  contentType: string
}

async function proxyFetch(targetUrl: string): Promise<ProxyResponse | null> {
  try {
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(targetUrl)}`, {
      timeout: API_TIMEOUT,
    })
    const data = response.data
    return {
      content: data?.contents || '',
      statusCode: data?.status?.http_code ?? 0,
      contentType: data?.status?.content_type ?? '',
    }
  } catch {
    return null
  }
}

export async function analyzeURL(url: string): Promise<AnalysisResult> {
  try {
    const result: AnalysisResult = {
      domains: [new URL(url).hostname],
      subdomains: [],
      technologies: [],
      headers: {},
      ssl: {
        issuer: '',
        validFrom: '',
        validTo: '',
        fingerprint: '',
        isValid: false,
        daysUntilExpiry: 0,
      },
      endpoints: [],
      jsAssets: [],
      risks: [],
      aiSummary: '',
      aiPriority: '',
    }

    // Busca a página principal uma única vez via proxy (reaproveitada
    // para detecção de tecnologias e descoberta de assets JS)
    const mainPage = await proxyFetch(url)

    if (mainPage) {
      result.headers = mainPage.contentType ? { 'Content-Type': mainPage.contentType } : {}
      result.technologies = detectTechnologies(mainPage.content)
      result.jsAssets = await findJSAssets(mainPage.content, url)
    }

    result.ssl = await getSSLInfo(url)
    result.endpoints = await enumerateEndpoints(url)
    result.risks = identifyRisks(result)

    return result
  } catch (error) {
    console.error('Analysis error:', error)
    throw error
  }
}

function detectTechnologies(html: string): Technology[] {
  const techs: Technology[] = []
  const lowerHtml = html.toLowerCase()

  const signatures: Record<string, { signature: string; category: string }> = {
    'WordPress': { signature: 'wp-content', category: 'CMS' },
    'React': { signature: 'react', category: 'Framework' },
    'Vue': { signature: 'vue', category: 'Framework' },
    'Angular': { signature: 'ng-version', category: 'Framework' },
    'Bootstrap': { signature: 'bootstrap', category: 'CSS Framework' },
    'Stripe': { signature: 'stripe', category: 'Payment' },
    'Google Analytics': { signature: 'google-analytics', category: 'Analytics' },
    'jQuery': { signature: 'jquery', category: 'Library' },
  }

  for (const [tech, info] of Object.entries(signatures)) {
    if (lowerHtml.includes(info.signature.toLowerCase())) {
      techs.push({ name: tech, category: info.category, riskLevel: 'low' })
    }
  }

  return techs
}

async function getSSLInfo(url: string): Promise<AnalysisResult['ssl']> {
  try {
    const hostname = new URL(url).hostname
    const analyzeUrl = `https://api.ssllabs.com/api/v3/analyze?host=${hostname}&publish=off&all=done&fromCache=on&maxAge=24`
    const proxied = await proxyFetch(analyzeUrl)

    if (proxied?.content) {
      const data = JSON.parse(proxied.content)
      const cert = data.certs?.[0]

      if (cert) {
        const validTo = new Date(cert.notAfter)
        const now = new Date()
        const daysUntil = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        return {
          issuer: cert.issuerLabel || 'Desconhecido',
          validFrom: new Date(cert.notBefore).toLocaleDateString('pt-BR'),
          validTo: validTo.toLocaleDateString('pt-BR'),
          fingerprint: cert.sha1Hash || 'N/A',
          isValid: daysUntil > 0,
          daysUntilExpiry: daysUntil,
        }
      }
    }
  } catch {
    // SSL Labs pode ainda estar processando a análise (assíncrona) ou indisponível
  }

  return {
    issuer: 'Não disponível',
    validFrom: 'N/A',
    validTo: 'N/A',
    fingerprint: 'N/A',
    isValid: false,
    daysUntilExpiry: 0,
  }
}

async function enumerateEndpoints(url: string): Promise<Endpoint[]> {
  const endpoints: Endpoint[] = []
  const commonPaths = [
    '/api', '/admin', '/login', '/.git', '/.env',
    '/robots.txt', '/sitemap.xml', '/wp-admin',
  ]

  const baseURL = new URL(url).origin

  for (const path of commonPaths) {
    const proxied = await proxyFetch(`${baseURL}${path}`)
    if (proxied) {
      endpoints.push({
        path,
        method: 'GET',
        statusCode: proxied.statusCode,
        isPublic: proxied.statusCode > 0 && proxied.statusCode < 400,
      })
    }
    await sleep(400) // evita sobrecarregar o proxy gratuito
  }

  return endpoints
}

async function findJSAssets(html: string, baseUrl: string): Promise<JSAsset[]> {
  const assets: JSAsset[] = []
  const jsRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi
  const scriptUrls: string[] = []

  let match
  while ((match = jsRegex.exec(html)) !== null) {
    try {
      scriptUrls.push(new URL(match[1], baseUrl).href)
    } catch {
      // ignora URLs inválidas
    }
  }

  // Limita a 8 scripts para não sobrecarregar o proxy gratuito
  for (const scriptUrl of scriptUrls.slice(0, 8)) {
    const proxied = await proxyFetch(scriptUrl)
    if (proxied?.content) {
      assets.push({
        url: scriptUrl,
        size: proxied.content.length,
        hash: proxied.content.length.toString(16),
        detectedSecrets: detectSecrets(proxied.content),
      })
    }
    await sleep(400)
  }

  return assets
}

function detectSecrets(content: string): string[] {
  const secrets: string[] = []
  const patterns = {
    'API Key': /api[_-]?key[=:]\s*["']?[a-zA-Z0-9]{20,}/gi,
    'AWS Key': /AKIA[0-9A-Z]{16}/gi,
    'GitHub Token': /gh[pousr]_[A-Za-z0-9_]{36,255}/gi,
    'Private Key': /-----BEGIN (RSA |DSA )?PRIVATE KEY-----/gi,
  }

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(content)) {
      secrets.push(type)
    }
  }

  return secrets
}

function identifyRisks(result: AnalysisResult): Risk[] {
  const risks: Risk[] = []

  const sslChecked = result.ssl.issuer !== 'Não disponível' && result.ssl.issuer !== ''

  if (sslChecked && !result.ssl.isValid) {
    risks.push({
      id: `risk_${Date.now()}_1`,
      type: 'SSL_EXPIRED',
      severity: 'critical',
      title: 'Certificado SSL expirado ou inválido',
      description: 'O certificado SSL deste domínio expirou ou é inválido',
      remediation: 'Renove o certificado SSL imediatamente',
      cveList: [],
    })
  } else if (sslChecked && result.ssl.isValid && result.ssl.daysUntilExpiry < 30) {
    risks.push({
      id: `risk_${Date.now()}_2`,
      type: 'SSL_EXPIRING',
      severity: 'high',
      title: 'Certificado SSL expirando em breve',
      description: `O certificado expira em ${result.ssl.daysUntilExpiry} dias`,
      remediation: 'Renove o certificado SSL antes da expiração',
      cveList: [],
    })
  }

  const sensitivePaths = ['/.git', '/.env', '/wp-admin', '/admin']
  for (const endpoint of result.endpoints) {
    if (endpoint.isPublic && sensitivePaths.includes(endpoint.path)) {
      risks.push({
        id: `risk_${Date.now()}_${Math.random()}`,
        type: 'SENSITIVE_ENDPOINT_EXPOSED',
        severity: 'critical',
        title: `Endpoint sensível exposto: ${endpoint.path}`,
        description: `O caminho ${endpoint.path} está publicamente acessível (status ${endpoint.statusCode})`,
        remediation: 'Restrinja o acesso a este endpoint via autenticação ou firewall',
        cveList: [],
      })
    }
  }

  for (const asset of result.jsAssets) {
    if (asset.detectedSecrets.length > 0) {
      risks.push({
        id: `risk_${Date.now()}_${Math.random()}`,
        type: 'EXPOSED_SECRETS',
        severity: 'critical',
        title: 'Possíveis segredos expostos em JavaScript',
        description: `Padrões detectados em ${asset.url}: ${asset.detectedSecrets.join(', ')}`,
        remediation: 'Remova segredos do código client-side; use variáveis de ambiente apenas no backend',
        cveList: [],
      })
    }
  }

  return risks
}
