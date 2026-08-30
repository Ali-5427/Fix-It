export type Severity = 'blocker' | 'high_risk' | 'warning' | 'passed';
export type Platform = 'ios' | 'android' | 'cross';
export type Category = 
  | 'privacy_manifest' 
  | 'account_deletion' 
  | 'paywall_iap' 
  | 'data_safety' 
  | 'permissions' 
  | 'ugc_moderation' 
  | 'store_metadata'
  | 'sdk_conflicts';

export interface EvidenceSource {
  platformName: 'Reddit r/iOSProgramming' | 'Hacker News' | 'X / Twitter' | 'Indie Hackers' | 'Apple Dev Forums' | 'r/androiddev';
  author: string;
  avatarUrl?: string;
  appCategory: string;
  date: string;
  financialImpact: string;
  delistDuration: string;
  quote: string;
  threadUrl?: string;
  metrics: {
    mrrLost: number;
    churnIncrease: string;
    reviewDelayDays: number;
  };
}

export interface FixRecommendation {
  summary: string;
  codeSnippet?: string;
  fileName?: string;
  language?: 'xml' | 'swift' | 'json' | 'yaml' | 'kotlin' | 'text';
  stepByStep: string[];
  docUrl?: string;
}

export interface AuditCheckItem {
  id: string;
  title: string;
  severity: Severity;
  category: Category;
  platform: Platform;
  ruleCode: string;
  ruleName: string;
  description: string;
  detectionLocation: string; // e.g. "Info.plist line 24" or "Store Description paragraph 3"
  riskScoreImpact: number; // 0 to 30
  evidence: EvidenceSource;
  fix: FixRecommendation;
  status: 'failed' | 'passed';
}

export interface AuditReport {
  id: string;
  appName: string;
  bundleId: string;
  platform: Platform;
  appType: 'code_upload' | 'store_url';
  targetStore: string;
  scanTimestamp: string;
  overallScore: number; // 0 - 100
  riskLevel: 'Critical Action Required' | 'High Risk Warning' | 'Store Ready';
  estimatedRevenueRisk: number;
  criticalBlockersCount: number;
  highRiskCount: number;
  warningsCount: number;
  passedChecksCount: number;
  items: AuditCheckItem[];
  metadataScanned: {
    scannedFiles: string[];
    sdksDetected: string[];
    permissionsRequested: string[];
    storeUrl?: string;
  };
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  appNamePlaceholder: string;
  category: Category;
  platform: Platform;
  year: string;
  ruleBroken: string;
  revenueImpact: string;
  daysDowntime: number;
  fullStory: string;
  developerQuote: string;
  sourceType: 'Reddit' | 'HackerNews' | 'Twitter' | 'IndieHackers';
  keyTakeaway: string;
  preventionCode: string;
}
