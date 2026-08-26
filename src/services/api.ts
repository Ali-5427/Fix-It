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

  async login(email: string, password?: string, role?: string, tier?: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, tier })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async register(email: string, name: string, tier?: string, appleTeamId?: string, teamName?: string) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, tier, appleTeamId, teamName })
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  async updateProfile(user: any) {
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async resetPassword(email: string) {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  async startUploadJob(appId: string, fileName: string, fileSize: number, fileType: string, rawData?: any) {
    const res = await fetch('/api/uploads/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appId, fileName, fileSize, fileType, rawData })
    });
    return res.json();
  },

  async pollUploadJob(jobId: string) {
    const res = await fetch(`/api/uploads/${jobId}/status`);
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
