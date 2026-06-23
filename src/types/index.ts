export interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string
  createdAt: Date
  subscription: 'free' | 'pro' | 'enterprise'
}

export interface Target {
  id: string
  userId: string
  url: string
  domain: string
  createdAt: Date
  updatedAt: Date
  status: 'pending' | 'analyzing' | 'completed' | 'failed'
  analysisResults: AnalysisResult
}

export interface AnalysisResult {
  domains: string[]
  subdomains: string[]
  technologies: Technology[]
  headers: Record<string, string>
  ssl: SSLInfo
  endpoints: Endpoint[]
  jsAssets: JSAsset[]
  risks: Risk[]
  aiSummary: string
  aiPriority: string
}

export interface Technology {
  name: string
  version?: string
  category: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface SSLInfo {
  issuer: string
  validFrom: string
  validTo: string
  fingerprint: string
  isValid: boolean
  daysUntilExpiry: number
}

export interface Endpoint {
  path: string
  method: string
  statusCode: number
  isPublic: boolean
  description?: string
}

export interface JSAsset {
  url: string
  size: number
  hash: string
  integrity?: string
  detectedSecrets: string[]
}

export interface Risk {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  remediation: string
  cveList: string[]
}

export interface Vulnerability {
  id: string
  userId: string
  targetId: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive'
  cveId?: string
  evidenceIds: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
}

export interface Evidence {
  id: string
  userId: string
  vulnerabilityId: string
  fileName: string
  fileSize: number
  fileType: string
  storageUrl: string
  description: string
  uploadedAt: Date
}

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  tags: string[]
  relatedTargets: string[]
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Report {
  id: string
  userId: string
  targetIds: string[]
  title: string
  description: string
  reportType: 'summary' | 'detailed' | 'executive'
  generatedAt: Date
  htmlContent: string
  pdfUrl?: string
  status: 'draft' | 'finalized'
}

export interface UserSettings {
  userId: string
  emailNotifications: boolean
  theme: 'light' | 'dark'
  defaultReportFormat: string
  apiKeyOpenAI?: string
  maxConcurrentScans: number
}
