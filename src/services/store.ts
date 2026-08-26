import { 
  User, 
  Application, 
  AuditRun, 
  NormalizedAppInspection, 
  Finding, 
  FindingStatus, 
  FixNote, 
  SubmissionReport,
  AuditComparison,
  RuleCategory
} from '../types';
import { evaluateInspection, compareAudits, computeReadiness } from '../engine/evaluator';
import { apiClient } from './api';

const STORAGE_KEYS = {
  USER: 'fixit_user',
  APPS: 'fixit_apps',
  AUDITS: 'fixit_audits',
  INSPECTIONS: 'fixit_inspections',
  SELECTED_APP: 'fixit_selected_app_id'
};

class AppStore {
  private user: User | null = null;
  private apps: Application[] = [];
  private auditsMap: Record<string, AuditRun[]> = {}; // appId -> AuditRun[]
  private inspectionsMap: Record<string, NormalizedAppInspection> = {}; // appId -> NormalizedAppInspection
  private selectedAppId: string | null = null;
  private activeAuditId: string | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.id?.startsWith('user_') || parsed?.name === 'Indie Solo Creator' || parsed?.name === 'Lead iOS Engineer') {
          this.user = null;
          localStorage.removeItem(STORAGE_KEYS.USER);
        } else {
          this.user = parsed;
        }
      } else {
        this.user = null;
      }

      const savedApps = localStorage.getItem(STORAGE_KEYS.APPS);
      this.apps = savedApps ? JSON.parse(savedApps) : [];
      this.apps = this.apps.map(app => ({
        ...app,
        lastAuditStatus: this.migrateReadiness(app.lastAuditStatus)
      }));

      const savedAudits = localStorage.getItem(STORAGE_KEYS.AUDITS);
      this.auditsMap = savedAudits ? this.migrateAudits(JSON.parse(savedAudits)) : {};

      const savedInspections = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
      this.inspectionsMap = savedInspections ? JSON.parse(savedInspections) : {};

      const savedSelected = localStorage.getItem(STORAGE_KEYS.SELECTED_APP);
      this.selectedAppId = savedSelected || (this.apps.length > 0 ? this.apps[0].id : null);
    } catch (e) {
      console.error('Error loading store state:', e);
      this.user = null;
      this.apps = [];
      this.auditsMap = {};
      this.inspectionsMap = {};
      this.selectedAppId = null;
    }
  }

  private migrateAudits(raw: Record<string, AuditRun[]>): Record<string, AuditRun[]> {
    const statusMap: Record<string, AuditRun['readinessStatus']> = {
      HIGH_RISK: 'NOT_READY',
      READY: 'NO_HIGH_RISK_ISSUES_DETECTED',
      MANUAL_REVIEW_REQUIRED: 'NO_HIGH_RISK_ISSUES_DETECTED',
      READY_WITH_WARNINGS: 'READY_WITH_WARNINGS',
      NOT_READY: 'NOT_READY',
      NO_HIGH_RISK_ISSUES_DETECTED: 'NO_HIGH_RISK_ISSUES_DETECTED'
    };
    const migrated: Record<string, AuditRun[]> = {};
    Object.entries(raw || {}).forEach(([appId, audits]) => {
      migrated[appId] = (audits || []).map(audit => ({
        ...audit,
        readinessStatus: statusMap[String(audit.readinessStatus)] || computeReadiness(audit.findings || []),
        passedChecks: audit.passedChecks || [],
        manualCheckCount: audit.manualCheckCount ?? audit.infoCount ?? 0,
        findings: (audit.findings || []).map(finding => ({
          ...finding,
          severity: (finding.severity as string) === 'INFO' ? 'MANUAL_CHECK' : finding.severity
        }))
      }));
    });
    return migrated;
  }

  private migrateReadiness(status?: AuditRun['readinessStatus'] | string): AuditRun['readinessStatus'] | undefined {
    if (!status) return undefined;
    const statusMap: Record<string, AuditRun['readinessStatus']> = {
      HIGH_RISK: 'NOT_READY',
      READY: 'NO_HIGH_RISK_ISSUES_DETECTED',
      MANUAL_REVIEW_REQUIRED: 'NO_HIGH_RISK_ISSUES_DETECTED',
      READY_WITH_WARNINGS: 'READY_WITH_WARNINGS',
      NOT_READY: 'NOT_READY',
      NO_HIGH_RISK_ISSUES_DETECTED: 'NO_HIGH_RISK_ISSUES_DETECTED'
    };
    return statusMap[String(status)] || 'READY_WITH_WARNINGS';
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(this.apps));
      localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(this.auditsMap));
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(this.inspectionsMap));
      if (this.selectedAppId) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_APP, this.selectedAppId);
      }
    } catch (e) {
      console.warn('Storage persistence warning:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Getters
  public getUser(): User | null {
    return this.user;
  }

  public getApps(): Application[] {
    return this.apps;
  }

  public getSelectedApp(): Application | null {
    return this.apps.find(a => a.id === this.selectedAppId) || (this.apps[0] || null);
  }

  public getSelectedAppId(): string | null {
    return this.selectedAppId;
  }

  public getAudits(appId: string): AuditRun[] {
    return this.auditsMap[appId] || [];
  }

  public getLatestAudit(appId: string): AuditRun | null {
    const list = this.getAudits(appId);
    return list.length > 0 ? list[list.length - 1] : null;
  }

  public getAuditById(auditId: string): AuditRun | null {
    for (const list of Object.values(this.auditsMap)) {
      const found = list.find(a => a.id === auditId);
      if (found) return found;
    }
    return null;
  }

  public getActiveAudit(): AuditRun | null {
    if (this.activeAuditId) {
      const found = this.getAuditById(this.activeAuditId);
      if (found) return found;
    }
    const selected = this.getSelectedApp();
    return selected ? this.getLatestAudit(selected.id) : null;
  }

  public getInspection(appId: string): NormalizedAppInspection | null {
    return this.inspectionsMap[appId] || null;
  }

  // Actions
  public setUser(user: User | null) {
    this.user = user;
    this.persist();
  }

  public logout() {
    this.user = null;
    this.persist();
  }

  public updateUser(updates: Partial<User>) {
    if (!this.user) return;
    this.user = {
      ...this.user,
      ...updates,
      settings: {
        ...(this.user.settings || {}),
        ...(updates.settings || {})
      }
    };
    this.persist();
  }

  public updateUserTier(tier: 'free' | 'pro' | 'studio') {
    if (!this.user) return;
    this.user = {
      ...this.user,
      tier
    };
    this.persist();
  }

  public updateUserSettings(settings: Partial<NonNullable<User['settings']>>) {
    if (!this.user) return;
    this.user = {
      ...this.user,
      settings: {
        ...(this.user.settings || {}),
        ...settings
      }
    };
    this.persist();
  }

  public selectApp(appId: string) {
    this.selectedAppId = appId;
    const latest = this.getLatestAudit(appId);
    this.activeAuditId = latest ? latest.id : null;
    this.persist();
  }

  public setActiveAudit(auditId: string) {
    this.activeAuditId = auditId;
    this.notify();
  }

  public createApp(data: {
    name: string;
    bundleId: string;
    primaryCategory: string;
    currentVersion?: string;
    currentBuild?: string;
    inspection?: NormalizedAppInspection;
  }): Application {
    if (!data.inspection) {
      throw new Error('An extracted inspection is required to create an app.');
    }

    const existing = this.apps.find(app => app.bundleId === data.bundleId);
    if (existing) {
      this.runNewAudit(existing.id, data.currentBuild || existing.currentBuild, data.currentVersion || existing.currentVersion, data.inspection);
      return existing;
    }

    const id = `app_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newApp: Application = {
      id,
      userId: this.user?.id || '',
      name: data.name,
      bundleId: data.bundleId,
      primaryCategory: data.primaryCategory || 'Utilities',
      currentVersion: data.currentVersion || '',
      currentBuild: data.currentBuild || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      remainingIssuesCount: 0
    };

    this.apps.unshift(newApp);

    const inspection = data.inspection;

    this.inspectionsMap[id] = inspection;

    // Run initial deterministic audit
    const initialAudit = evaluateInspection(inspection, id, newApp.currentBuild, newApp.currentVersion);
    this.auditsMap[id] = [initialAudit];

    newApp.lastAuditDate = initialAudit.createdAt;
    newApp.lastAuditStatus = initialAudit.readinessStatus;
    newApp.remainingIssuesCount = initialAudit.openFindings;

    this.selectedAppId = id;
    this.activeAuditId = initialAudit.id;
    this.persist();
    return newApp;
  }

  public deleteApp(appId: string) {
    this.apps = this.apps.filter(a => a.id !== appId);
    delete this.auditsMap[appId];
    delete this.inspectionsMap[appId];

    if (this.selectedAppId === appId) {
      this.selectedAppId = this.apps.length > 0 ? this.apps[0].id : null;
      const latest = this.selectedAppId ? this.getLatestAudit(this.selectedAppId) : null;
      this.activeAuditId = latest ? latest.id : null;
    }
    this.persist();
  }

  public updateFindingStatus(
    appId: string,
    auditId: string,
    findingId: string,
    status: FindingStatus,
    noteText?: string,
    buildNumber?: string
  ) {
    const auditList = this.auditsMap[appId];
    if (!auditList) return;

    const audit = auditList.find(a => a.id === auditId);
    if (!audit) return;

    const finding = audit.findings.find(f => f.id === findingId);
    if (!finding) return;

    const prevStatus = finding.status;
    finding.status = status;
    finding.updatedAt = new Date().toISOString();
    if (status === 'FIXED') {
      finding.fixedInBuild = buildNumber || audit.buildNumber;
    }

    if (noteText && noteText.trim()) {
      const note: FixNote = {
        id: `note_${Date.now()}`,
        author: this.user?.name || 'Developer',
        createdAt: new Date().toISOString(),
        text: noteText,
        statusChange: status !== prevStatus ? status : undefined,
        buildNumber
      };
      finding.notes.unshift(note);
    }

    // Re-evaluate open / resolved counts and readiness
    let high = 0;
    let med = 0;
    let low = 0;
    let info = 0;
    let open = 0;
    let resolved = 0;

    audit.findings.forEach(f => {
      if (f.status === 'OPEN' || f.status === 'IN_PROGRESS') {
        open++;
        if (f.severity === 'HIGH') high++;
        if (f.severity === 'MEDIUM') med++;
        if (f.severity === 'LOW') low++;
        if (f.severity === 'MANUAL_CHECK') info++;
      } else if (f.status === 'FIXED') {
        resolved++;
      }
    });

    audit.openFindings = open;
    audit.resolvedFindings = resolved;
    audit.highRiskCount = high;
    audit.mediumRiskCount = med;
    audit.lowRiskCount = low;
    audit.infoCount = info;

    audit.readinessStatus = computeReadiness(audit.findings);

    // Update parent app card
    const app = this.apps.find(a => a.id === appId);
    if (app) {
      app.lastAuditStatus = audit.readinessStatus;
      app.remainingIssuesCount = open;
      app.updatedAt = new Date().toISOString();
    }

    this.persist();
  }

  public addFindingNote(
    appId: string,
    auditId: string,
    findingId: string,
    noteText: string
  ) {
    const audit = this.getAuditById(auditId);
    if (!audit) return;
    const finding = audit.findings.find(f => f.id === findingId);
    if (!finding) return;

    const note: FixNote = {
      id: `note_${Date.now()}`,
      author: this.user?.name || 'Developer',
      createdAt: new Date().toISOString(),
      text: noteText
    };
    finding.notes.unshift(note);
    this.persist();
  }

  public async runNewAudit(
    appId: string,
    newBuildNumber?: string,
    newVersion?: string,
    updatedInspection?: NormalizedAppInspection
  ): Promise<{ audit: AuditRun; comparison?: AuditComparison }> {
    const app = this.apps.find(a => a.id === appId);
    if (!app) throw new Error('App not found');

    const previousAudit = this.getLatestAudit(appId);

    const version = newVersion || app.currentVersion;
    const build = newBuildNumber || String(Number(app.currentBuild) + 1 || '2');

    let inspection = updatedInspection || this.inspectionsMap[appId];
    if (updatedInspection) {
      this.inspectionsMap[appId] = updatedInspection;
    }

    // Carry forward findings states if unchanged
    const existingFindings = previousAudit ? previousAudit.findings : [];

    const newAudit = evaluateInspection(inspection, appId, build, version, existingFindings);

    // AI enhancement layer (server-side Gemini)
    try {
      const aiResult = await apiClient.enhanceAuditWithAI(inspection, newAudit.findings);
      if (aiResult && aiResult.enhancedFindings) {
        newAudit.findings = aiResult.enhancedFindings;
        newAudit.summary = aiResult.executiveSummary || newAudit.summary;
        newAudit.reviewerNotesDraft = aiResult.reviewerNotes || newAudit.reviewerNotesDraft;
        newAudit.isAiEnhanced = true;
      }
    } catch (e) {
      console.warn('AI enhancement fallback used:', e);
    }

    if (!this.auditsMap[appId]) {
      this.auditsMap[appId] = [];
    }
    this.auditsMap[appId].push(newAudit);

    // Update app record
    app.currentBuild = build;
    app.currentVersion = version;
    app.lastAuditDate = newAudit.createdAt;
    app.lastAuditStatus = newAudit.readinessStatus;
    app.remainingIssuesCount = newAudit.openFindings;
    app.updatedAt = new Date().toISOString();

    this.activeAuditId = newAudit.id;
    this.persist();

    let comparison: AuditComparison | undefined;
    if (previousAudit) {
      comparison = compareAudits(previousAudit, newAudit);
    }

    return { audit: newAudit, comparison };
  }

  public generateSubmissionReport(appId: string, auditId?: string): SubmissionReport {
    const app = this.apps.find(a => a.id === appId);
    if (!app) throw new Error('App not found');

    const audit = auditId ? this.getAuditById(auditId) : this.getLatestAudit(appId);
    if (!audit) throw new Error('Audit not found');

    const inspection = this.inspectionsMap[appId];

    // Group categories
    const categoryMap = new Map<RuleCategory, { open: number; resolved: number }>();
    audit.findings.forEach(f => {
      const current = categoryMap.get(f.category) || { open: 0, resolved: 0 };
      if (f.status === 'FIXED') current.resolved++;
      else current.open++;
      categoryMap.set(f.category, current);
    });

    const categorySummaries = Array.from(categoryMap.entries()).map(([cat, stats]) => ({
      category: cat,
      status: stats.open === 0 ? ('PASS' as const) : stats.open > 0 && stats.open <= 2 ? ('WARNING' as const) : ('FAIL' as const),
      openCount: stats.open,
      resolvedCount: stats.resolved
    }));

    const resolvedIssues = audit.findings
      .filter(f => f.status === 'FIXED')
      .map(f => ({
        title: f.title,
        guidelineRef: f.guidelineRef,
        fixedInBuild: f.fixedInBuild || audit.buildNumber
      }));

    const remainingWarnings = audit.findings
      .filter(f => f.status !== 'FIXED')
      .map(f => ({
        title: f.title,
        severity: f.severity,
        guidelineRef: f.guidelineRef,
        recommendedAction: f.recommendedAction
      }));

    const manualChecklist = [
      { id: 'chk_demo_creds', item: 'Active demo account login & password entered into App Store Connect Review Notes', category: 'Review Access', checked: false },
      { id: 'chk_privacy_url', item: 'Privacy Policy URL in App Store Connect points to live HTTPS page matching in-app link', category: 'Privacy', checked: !!inspection?.metadata.privacyPolicyUrl },
      { id: 'chk_iap_configured', item: 'All In-App Purchase products submitted for review in App Store Connect with screenshots', category: 'In-App Purchase', checked: inspection?.features.hasInAppPurchases || false },
      { id: 'chk_restore_btn', item: 'Tested "Restore Purchases" button in TestFlight sandbox environment', category: 'In-App Purchase', checked: false },
      { id: 'chk_screenshots_69', item: 'Uploaded required 6.9" and 6.5" iPhone screenshots showing actual app in use', category: 'Screenshots', checked: (inspection?.screenshots.length || 0) > 0 },
      { id: 'chk_privacy_nutrition', item: 'Completed App Privacy Nutrition Label questions in App Store Connect matching Privacy Manifest', category: 'Privacy', checked: false },
      { id: 'chk_ipv6', item: 'Verified app connects smoothly on IPv6-only networks without hardcoded IPv4 addresses', category: 'Network', checked: false }
    ];

    return {
      id: `report_${Date.now()}`,
      appId,
      auditId: audit.id,
      generatedAt: new Date().toISOString(),
      appName: app.name,
      bundleId: app.bundleId,
      version: audit.appVersion,
      build: audit.buildNumber,
      readinessStatus: audit.readinessStatus,
      summary: audit.summary,
      guidelineVersion: '2026.2',
      categorySummaries,
      resolvedIssues,
      remainingWarnings,
      manualChecklist,
      reviewerNotesDraft: audit.reviewerNotesDraft || `Test credentials and submission notes for ${app.name}`,
      disclaimer: 'This readiness assessment is generated by Fix It static inspection and guideline correlation. While based on public Apple App Store Review Guidelines, it does not represent an official determination by Apple Inc. and cannot guarantee App Review approval.'
    };
  }

  public clearData() {
    this.apps = [];
    this.auditsMap = {};
    this.inspectionsMap = {};
    this.selectedAppId = null;
    this.activeAuditId = null;
    this.persist();
  }
}

export const store = new AppStore();
