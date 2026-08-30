import React, { useState } from 'react';
import { X, Download, Copy, Check, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Printer, Sparkles } from 'lucide-react';
import { AuditReport } from '../types';

interface AuditExportModalProps {
  report: AuditReport;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditExportModal: React.FC<AuditExportModalProps> = ({ report, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'certificate' | 'json'>('certificate');

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Official Compliance Audit Export #{report.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'certificate'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Audit Certificate Preview
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'json'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Raw JSON Report (CI/CD)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {activeTab === 'certificate' ? (
            <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-slate-300 shadow-sm space-y-6 text-slate-900 print:border-none">
              
              {/* Certificate Top Seal */}
              <div className="flex items-start justify-between border-b pb-5 border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 font-black text-lg">
                    <ShieldCheck className="w-6 h-6" />
                    <span>StoreGuard AI Verification</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">
                    Automated Mobile Guideline Compliance Authority
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold bg-slate-100 px-2 py-1 rounded text-slate-700">
                    ID: {report.id}
                  </span>
                  <p className="text-[11px] text-slate-700 mt-1">Generated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Target App */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg text-xs">
                <div>
                  <span className="text-slate-700 block font-medium">Application Name:</span>
                  <strong className="text-sm font-bold text-slate-900">{report.appName}</strong>
                </div>
                <div>
                  <span className="text-slate-700 block font-medium">Target Store & OS:</span>
                  <strong className="text-sm font-bold text-slate-900">{report.targetStore}</strong>
                </div>
              </div>

              {/* Score & Risk Summary */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-900">Compliance Health Score</span>
                  <p className="text-3xl font-extrabold text-blue-700">{report.overallScore}/100</p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-slate-700 block">Total Checks: {report.items.length}</span>
                  <span className="text-emerald-700 font-semibold block">✓ {report.passedChecksCount} Passed</span>
                  {report.criticalBlockersCount > 0 && (
                    <span className="text-rose-600 font-semibold block">⚠ {report.criticalBlockersCount} Blockers</span>
                  )}
                </div>
              </div>

              {/* Itemized checks */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Key Verification Findings:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {report.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2">
                        {item.status === 'passed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        )}
                        <span className="font-medium text-slate-800">{item.title}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-700">{item.ruleCode}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto">
              <pre>{JSON.stringify(report, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            {activeTab === 'json' ? (
              <button
                onClick={handleCopyJson}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            ) : (
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
