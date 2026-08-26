import { 
  NormalizedAppInspection, 
  Finding, 
  RejectionAnalysisResult, 
  AppMetadataDraft, 
  MetadataIssue,
  ScreenshotValidationResult,
  AdminStats 
} from '../types';

export const apiClient = {
  async healthCheck() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async enhanceAuditWithAI(inspection: NormalizedAppInspection, findings: Finding[]) {
    const res = await fetch('/api/ai/correlate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inspection, findings })
    });
    if (!res.ok) throw new Error('AI correlation failed');
    return res.json();
  },

  async analyzeRejection(rejectionText: string): Promise<RejectionAnalysisResult> {
    const res = await fetch('/api/rejection/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejectionText })
    });
    if (!res.ok) throw new Error('Failed to analyze rejection message');
    return res.json();
  },

  async validateMetadata(metadata: AppMetadataDraft): Promise<{ issues: MetadataIssue[]; suggestions: string[] }> {
    const res = await fetch('/api/metadata/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metadata })
    });
    if (!res.ok) throw new Error('Failed to validate metadata');
    return res.json();
  },

  async validateScreenshot(width: number, height: number, fileName: string): Promise<ScreenshotValidationResult> {
    const res = await fetch('/api/screenshots/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ width, height, fileName })
    });
    return res.json();
  },

  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats');
    return res.json();
  },

  async getAdminRules() {
    const res = await fetch('/api/admin/rules');
    return res.json();
  }
};
