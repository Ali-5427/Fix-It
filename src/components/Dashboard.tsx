import React from 'react';
import { 
  Plus, 
  Smartphone, 
  Clock, 
  RotateCw, 
  ShieldCheck,
  ChevronRight,
  MessageSquareWarning,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Application, User, AuditRun } from '../types';
import { calculateReadinessScore } from '../engine/evaluator';
import { store } from '../services/store';

interface DashboardProps {
  user: User | null;
  apps: Application[];
  onOpenApp: (appId: string) => void;
  onCheckNewApp: () => void;
  onCheckNewVersion: (appId: string) => void;
  onOpenRejectionSolver: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  apps,
  onOpenApp,
  onCheckNewApp,
  onCheckNewVersion,
  onOpenRejectionSolver
}) => {
  // Format relative or standard date
  const formatCheckDate = (isoString?: string) => {
    if (!isoString) return 'Not checked yet';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  // Collect recent checks across all apps
  const allAudits: { app: Application; audit: AuditRun }[] = [];
  apps.forEach(app => {
    const audits = store.getAudits(app.id);
    audits.forEach(audit => {
      allAudits.push({ app, audit });
    });
  });

  // Sort by date descending
  allAudits.sort((a, b) => new Date(b.audit.createdAt).getTime() - new Date(a.audit.createdAt).getTime());
  const recentAudits = allAudits.slice(0, 5);

  return (
    <div className="w-full min-h-full bg-slate-50/50 py-8 px-4 sm:px-8 lg:px-10">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* Welcome & Primary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
                My Apps
              </h1>
              {user && (
                <span className="text-xs text-slate-500 font-normal">
                  — Welcome back, <strong className="font-semibold text-slate-700">{user.name || user.email.split('@')[0]}</strong>
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Inspect your iOS builds, identify potential App Store submission issues early, and verify fixes before submitting to Apple.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="dashboard_check_new_app_btn"
              onClick={onCheckNewApp}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm shadow-blue-600/20 active:scale-[0.98] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Check a new app</span>
            </button>
          </div>
        </div>

        {/* Apple Independent Tool Disclaimer */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 flex items-start gap-3 text-xs text-slate-600 shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-slate-800 font-medium">Independent Preflight Tool:</span> Checks are based on Apple's published App Store Review Guidelines. We help you spot common technical and metadata blockers, but cannot guarantee Apple's final review decision.
          </div>
        </div>

        {/* Main Content: Empty State vs Apps Grid */}
        {apps.length === 0 ? (
          /* EMPTY STATE */
          <div id="dashboard_empty_state" className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4 shadow-inner">
              <Smartphone className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-mono">
              Check your first iOS app
            </h2>
            <p className="text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
              Upload your app (<span className="font-mono text-xs font-semibold text-slate-700">.ipa</span>, <span className="font-mono text-xs font-semibold text-slate-700">.zip</span>, or <span className="font-mono text-xs font-semibold text-slate-700">Info.plist</span>) and we'll look for common App Store problems before you submit.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="empty_state_upload_btn"
                onClick={onCheckNewApp}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Upload app</span>
              </button>
              <button
                id="empty_state_rejection_btn"
                onClick={onOpenRejectionSolver}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer"
              >
                <MessageSquareWarning className="h-3.5 w-3.5 text-slate-500" />
                <span>Apple rejected an existing app?</span>
              </button>
            </div>
          </div>
        ) : (
          /* APPS LIST */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {apps.map((app) => {
                const latestAudit = store.getLatestAudit(app.id);
                const score = calculateReadinessScore(latestAudit);
                const openFindings = latestAudit ? latestAudit.findings.filter(f => f.status !== 'FIXED') : [];
                const highCount = openFindings.filter(f => f.severity === 'HIGH').length;
                const mediumCount = openFindings.filter(f => f.severity === 'MEDIUM').length;
                const lowCount = openFindings.filter(f => f.severity === 'LOW').length;
                const totalIssues = openFindings.length;

                // Status configuration
                let statusLabel = 'Ready to submit';
                let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                if (highCount > 0) {
                  statusLabel = 'Action required';
                  statusColor = 'text-red-700 bg-red-50 border-red-200';
                } else if (mediumCount > 0 || lowCount > 0) {
                  statusLabel = 'Needs attention';
                  statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
                }

                return (
                  <div
                    key={app.id}
                    id={`app_card_${app.id}`}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header: App Name, Bundle ID, Overall Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200 font-mono text-sm">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base leading-tight">
                              {app.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-500 font-mono">
                                Version {app.currentVersion || '1.0.0'} (Build {app.currentBuild || '1'})
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-500">
                                {app.primaryCategory || 'iOS App'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>

                      {/* Score & Issue Breakdown Card */}
                      <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-500 block">Readiness score</span>
                            <div className="flex items-baseline gap-1.5">
                              <span className={`text-xl font-bold font-mono ${
                                score >= 90 ? 'text-emerald-600' : score >= 70 ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {score}%
                              </span>
                              <span className="text-xs font-medium text-slate-600">ready</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-slate-500 block">Problems detected</span>
                            <span className="text-sm font-bold text-slate-800 font-mono">
                              {totalIssues === 0 ? '0 issues' : `${totalIssues} issue${totalIssues > 1 ? 's' : ''}`}
                            </span>
                          </div>
                        </div>

                        {/* Severity Pills */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 text-[11px] font-medium">
                          <span className={`px-2 py-0.5 rounded border ${
                            highCount > 0 ? 'bg-red-50 text-red-700 border-red-200 font-bold' : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            {highCount} High
                          </span>
                          <span className={`px-2 py-0.5 rounded border ${
                            mediumCount > 0 ? 'bg-amber-50 text-amber-700 border-amber-200 font-bold' : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            {mediumCount} Medium
                          </span>
                          <span className={`px-2 py-0.5 rounded border ${
                            lowCount > 0 ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold' : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            {lowCount} Low
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Primary Card Actions */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>Last checked: <strong className="text-slate-700 font-medium">{formatCheckDate(latestAudit?.createdAt || app.lastAuditDate)}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          id={`check_new_version_btn_${app.id}`}
                          onClick={() => onCheckNewVersion(app.id)}
                          title="Check a new build version of this app"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <RotateCw className="h-3 w-3 text-slate-500" />
                          <span className="hidden sm:inline">Check new build</span>
                        </button>

                        <button
                          id={`open_app_btn_${app.id}`}
                          onClick={() => onOpenApp(app.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <span>Open app</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Checks Section */}
            {recentAudits.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <h3 className="text-sm font-bold text-slate-900 font-mono">
                      Recent Checks
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Showing latest {recentAudits.length} check{recentAudits.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {recentAudits.map(({ app, audit }) => {
                    const auditScore = calculateReadinessScore(audit);
                    const openCount = audit.findings.filter(f => f.status !== 'FIXED').length;

                    return (
                      <div 
                        key={audit.id} 
                        className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          store.selectApp(app.id);
                          store.setActiveAudit(audit.id);
                          onOpenApp(app.id);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-mono text-xs font-bold">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{app.name}</span>
                              <span className="text-[11px] font-mono text-slate-500">v{audit.appVersion} (b{audit.buildNumber})</span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              Checked {formatCheckDate(audit.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className={`text-xs font-bold font-mono ${
                              auditScore >= 90 ? 'text-emerald-600' : auditScore >= 70 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {auditScore}% ready
                            </span>
                            <span className="text-[11px] text-slate-500 block">
                              {openCount === 0 ? '0 issues' : `${openCount} issue${openCount > 1 ? 's' : ''}`}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Apple Rejection Helper Shortcut */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <MessageSquareWarning className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Received an App Store rejection message?
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Paste Apple's message into the Rejection Solver to understand what was flagged, get recommended fixes, and draft a response for App Review.
                  </p>
                </div>
              </div>
              <button
                id="dashboard_open_rejection_solver_btn"
                onClick={onOpenRejectionSolver}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                <span>Solve a Rejection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
