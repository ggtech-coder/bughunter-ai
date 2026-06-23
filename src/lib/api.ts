import axios from 'axios'
import { AnalysisResult, Endpoint, Technology, JSAsset, Risk } from '@/types'

const API_TIMEOUT = 30000

export async function analyzeURL(url: string): Promise<AnalysisResult> {
  try {
    const result: AnalysisResult = {
      domains: [],
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

    // Fetch headers
    result.headers = await fetchHeaders(url)
    
    // Detect technologies
    result.technologies = await detectTechnologies(url)
    
    // Get SSL info
    result.ssl = await getSSLInfo(url)
    
    // Enumerate endpoints
    result.endpoints = await enumerateEndpoints(url)
    
    // Find JS assets
    result.jsAssets = await findJSAssets(url)
    
    // Identify risks
    result.risks = await identifyRisks(result)
    
    return result
  } catch (error) {
    console.error('Analysis error:', error)
    throw error
  }
}

async function fetchHeaders(url: string): Promise<Record<string, string>> {
  try {
    const response = await axios.head(url, { timeout: API_TIMEOUT })
    return response.headers as Record<string, string>
  } catch {
    return {}
  }
}

async function detectTechnologies(url: string): Promise<Technology[]> {
  const techs: Technology[] = []
  
  try {
    const response = await axios.get(url, { timeout: API_TIMEOUT })
    const html = response.data
    
    const signatures: Record<string, { version?: string; category: string }> = {
      'WordPress': { version: 'wp-content', category: 'CMS' },
      'React': { version: 'react', category: 'Framework' },
      'Vue': { version: 'vue', category: 'Framework' },
      'Angular': { version: 'angular', category: 'Framework' },
      'Bootstrap': { version: 'bootstrap', category: 'CSS Framework' },
      'Stripe': { version: 'stripe', category: 'Payment' },
      'Google Analytics': { version: 'google-analytics', category: 'Analytics' },
      'jQuery': { version: 'jquery', category: 'Library' },
      'Nginx': { version: 'nginx', category: 'Server' },
      'Apache': { version: 'apache', category: 'Server' },
    }
    
    for (const [tech, info] of Object.entries(signatures)) {
      if (html.toLowerCase().includes(info.version.toLowerCase())) {
        techs.push({
          name: tech,
          category: info.category,
          riskLevel: 'low',
        })
      }
    }
  } catch {
    // Silent fail
  }
  
  return techs
}

async function getSSLInfo(url: string): Promise<any> {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname
    
    const response = await axios.get(`https://api.ssllabs.com/api/v3/analyze?host=${hostname}&publish=off&all=done`)
    const cert = response.data.certs?.[0]
    
    if (cert) {
      const validTo = new Date(cert.notAfter)
      const now = new Date()
      const daysUntil = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        issuer: cert.issuerLabel,
        validFrom: new Date(cert.notBefore).toLocaleDateString('pt-BR'),
        validTo: validTo.toLocaleDateString('pt-BR'),
        fingerprint: cert.sha1Hash,
        isValid: daysUntil > 0,
        daysUntilExpiry: daysUntil,
      }
    }
  } catch {
    // Fallback
  }
  
  return {
    issuer: 'Unknown',
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
    '/api', '/api/v1', '/api/v2', '/admin', '/login', '/register',
    '/wp-admin', '/wp-login.php', '/.git', '/.env', '/config.php',
    '/robots.txt', '/sitemap.xml', '/.well-known',
  ]
  
  const baseURL = new URL(url).origin
  
  for (const path of commonPaths) {
    try {
      const response = await axios.head(`${baseURL}${path}`, { timeout: 5000 })
      endpoints.push({
        path,
        method: 'HEAD',
        statusCode: response.status,
        isPublic: response.status < 400,
      })
    } catch (error: any) {
      if (error.response) {
        endpoints.push({
          path,
          method: 'HEAD',
          statusCode: error.response.status,
          isPublic: error.response.status < 400,
        })
      }
    }
  }
  
  return endpoints
}

async function findJSAssets(url: string): Promise<JSAsset[]> {
  const assets: JSAsset[] = []
  
  try {
    const response = await axios.get(url, { timeout: API_TIMEOUT })
    const html = response.data
    const jsRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi
    
    let match
    while ((match = jsRegex.exec(html)) !== null) {
      const src = match[1]
      const absoluteURL = new URL(src, url).href
      
      try {
        const jsResponse = await axios.get(absoluteURL, { timeout: 5000 })
        const hash = Buffer.from(jsResponse.data).toString('hex').slice(0, 16)
        
        assets.push({
          url: absoluteURL,
          size: jsResponse.data.length,
          hash,
          detectedSecrets: detectSecrets(jsResponse.data),
        })
      } catch {
        // Continue
      }
    }
  } catch {
    // Silent fail
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

async function identifyRisks(result: AnalysisResult): Promise<Risk[]> {
  const risks: Risk[] = []
  
  // SSL Risk
  if (!result.ssl.isValid) {
    risks.push({
      id: `risk_${Date.now()}_1`,
      type: 'SSL_EXPIRED',
      severity: 'critical',
      title: 'SSL Certificate Expired',
      description: 'The SSL certificate for this domain has expired or is invalid',
      remediation: 'Renew the SSL certificate immediately',
      cveList: [],
    })
  } else if (result.ssl.daysUntilExpiry < 30) {
    risks.push({
      id: `risk_${Date.now()}_2`,
      type: 'SSL_EXPIRING',
      severity: 'high',
      title: 'SSL Certificate Expiring Soon',
      description: `The SSL certificate expires in ${result.ssl.daysUntilExpiry} days`,
      remediation: 'Renew the SSL certificate before expiration',
      cveList: [],
    })
  }
  
  // Missing Security Headers
  const requiredHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'Strict-Transport-Security']
  const missingHeaders = requiredHeaders.filter(h => !result.headers[h])
  
  if (missingHeaders.length > 0) {
    risks.push({
      id: `risk_${Date.now()}_3`,
      type: 'MISSING_SECURITY_HEADERS',
      severity: 'high',
      title: 'Missing Security Headers',
      description: `Missing headers: ${missingHeaders.join(', ')}`,
      remediation: 'Configure security headers in your web server',
      cveList: [],
    })
  }
  
  // Exposed Secrets in JS
  for (const asset of result.jsAssets) {
    if (asset.detectedSecrets.length > 0) {
      risks.push({
        id: `risk_${Date.now()}_${Math.random()}`,
        type: 'EXPOSED_SECRETS',
        severity: 'critical',
        title: 'Exposed Secrets in JavaScript',
        description: `Detected potential secrets in ${asset.url}: ${asset.detectedSecrets.join(', ')}`,
        remediation: 'Remove all secrets from client-side code, use environment variables',
        cveList: [],
      })
    }
  }
  
  return risks
}
