import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  Trash2, 
  ArrowRight, 
  Upload, 
  Search,
  Sparkles,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { Application, ReadinessStatus } from '../types';
import { store } from '../services/store';

interface DashboardProps {
  apps: Application[];
  onSelectApp: (appId: string) => void;
  onOpenUpload: () => void;
  onGenerateReport: (appId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  apps,
  onSelectApp,
  onOpenUpload,
  onGenerateReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.bundleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.primaryCategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || app.lastAuditStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status?: ReadinessStatus) => {
    switch (status) {
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 font-mono">
            <CheckCircle2 className="h-3 w-3" />
            <span>READY</span>
          </span>
        );
      case 'READY_WITH_WARNINGS':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 font-mono">
            <AlertTriangle className="h-3 w-3" />
            <span>WARNINGS</span>
          </span>
        );
      case 'HIGH_RISK':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 font-mono">
            <AlertTriangle className="h-3 w-3" />
            <span>HIGH RISK</span>
          </span>
        );
      case 'MANUAL_REVIEW_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 font-mono">
            <span>MANUAL REVIEW</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 font-mono">
            <span>NOT AUDITED</span>
          </span>
        );
    }
  };

  const handleDeleteApp = (e: React.MouseEvent, appId: string, name: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${name}? All audit records will be removed.`)) {
      store.deleteApp(appId);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-white min-h-[calc(100vh-140px)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Applications Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your iOS applications, monitor preflight audit readiness, and track remediation history across builds.
          </p>
        </div>

        <button
          id="btn_dashboard_new_app"
          onClick={onOpenUpload}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all font-mono cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Audit New Application</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by app name, bundle ID, or category..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {['ALL', 'HIGH_RISK', 'READY_WITH_WARNINGS', 'READY'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* App Grid */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApps.map(app => (
            <div
              key={app.id}
              onClick={() => onSelectApp(app.id)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors truncate max-w-[200px]">
                        {app.name}
                      </h3>
                      {app.isDemo && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-600 border border-slate-200">
                          DEMO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{app.bundleId}</p>
                  </div>
                  {getStatusBadge(app.lastAuditStatus)}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500">Version: </span>
                    <span className="text-slate-800 font-semibold">v{app.currentVersion} ({app.currentBuild})</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Open Issues: </span>
                    <span className={`font-semibold ${app.remainingIssuesCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {app.remainingIssuesCount}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <Calendar className="h-3 w-3" />
                  <span>Last Audit: {app.lastAuditDate ? new Date(app.lastAuditDate).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateReport(app.id);
                  }}
                  className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  <span>Report</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteApp(e, app.id, app.name)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Application"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <span className="flex items-center gap-1 font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Audit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center space-y-4">
          <Layers className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No applications match your filter</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Try adjusting your search query or upload a new iOS build archive to start preflight inspection.
          </p>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Upload Application</span>
          </button>
        </div>
      )}

    </div>
  );
};
