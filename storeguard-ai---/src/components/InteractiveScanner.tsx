import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileCode, 
  Globe, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Flame, 
  TrendingDown, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Share2, 
  Code2, 
  ArrowRight,
  Info,
  Sliders,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockAudits } from '../data/mockAudits';
import { codePresets, sampleStoreUrls, CodePreset } from '../data/presetFiles';
import { AuditReport, AuditCheckItem, Severity } from '../types';

interface InteractiveScannerProps {
  currentReportKey: string;
  onReportChange: (key: string) => void;
  onOpenExportModal: (report: AuditReport) => void;
}

export const InteractiveScanner: React.FC<InteractiveScannerProps> = ({
  currentReportKey,
  onReportChange,
  onOpenExportModal
}) => {
  // Scanner state
  const [scanType, setScanType] = useState<'code' | 'url'>('code');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(codePresets[0].id);
  const [customCode, setCustomCode] = useState<string>(codePresets[0].sampleCode);
  const [customUrl, setCustomUrl] = useState<string>(sampleStoreUrls[0].url);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);
  
  // Working report state (with local fixes simulated)
  const [report, setReport] = useState<AuditReport>(mockAudits[currentReportKey] || mockAudits['aura-fitness-ios']);
  const [fixedItemIds, setFixedItemIds] = useState<Set<string>>(new Set());
  const [activeSeverityFilter, setActiveSeverityFilter] = useState<'all' | Severity>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Sync with prop change
  useEffect(() => {
    if (mockAudits[currentReportKey]) {
      setReport(mockAudits[currentReportKey]);
      setFixedItemIds(new Set());
      const firstFailed = mockAudits[currentReportKey].items.find(i => i.status === 'failed');
      if (firstFailed) {
        setExpandedItemId(firstFailed.id);
      }
    }
  }, [currentReportKey]);

  // Handle Preset Code Switch
  const handlePresetSelect = (preset: CodePreset) => {
    setSelectedPresetId(preset.id);
    setCustomCode(preset.sampleCode);
  };

  // Run Scan Animation
  const runScan = (targetKey?: string) => {
    setIsScanning(true);
    setScanStep(1);

    const stepInterval = setInterval(() => {
      setScanStep(prev => {
        if (prev >= 4) {
          clearInterval(stepInterval);
          setIsScanning(false);
          // Apply target
          const keyToApply = targetKey || currentReportKey || 'aura-fitness-ios';
          const nextRep = mockAudits[keyToApply] || mockAudits['aura-fitness-ios'];
          setReport(nextRep);
          setFixedItemIds(new Set());
          const firstFailed = nextRep.items.find(i => i.status === 'failed');
          if (firstFailed) setExpandedItemId(firstFailed.id);
          return 4;
        }
        return prev + 1;
      });
    }, 450);
  };

  // Simulate Fix toggle
  const toggleFix = (itemId: string) => {
    const nextSet = new Set(fixedItemIds);
    if (nextSet.has(itemId)) {
      nextSet.delete(itemId);
    } else {
      nextSet.add(itemId);
      // Small celebratory confetti if last blocker is fixed
      const remainingBlockers = report.items.filter(
        i => i.severity === 'blocker' && !nextSet.has(i.id) && i.id !== itemId
      ).length;
      if (remainingBlockers === 0) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {}
      }
    }
    setFixedItemIds(nextSet);
  };

  // Calculate live dynamic score & risk based on fixed items
  const totalDeductions = report.items
    .filter(item => item.status === 'failed' && !fixedItemIds.has(item.id))
    .reduce((acc, item) => acc + item.riskScoreImpact, 0);

  const dynamicScore = Math.min(100, Math.max(20, 100 - totalDeductions));
  const activeBlockersCount = report.items.filter(
    item => item.severity === 'blocker' && !fixedItemIds.has(item.id)
  ).length;
  const activeHighRiskCount = report.items.filter(
    item => item.severity === 'high_risk' && !fixedItemIds.has(item.id)
  ).length;

  const dynamicRevenueRisk = report.items
    .filter(item => item.status === 'failed' && !fixedItemIds.has(item.id))
    .reduce((acc, item) => acc + (item.evidence?.metrics?.mrrLost || 0), 0);

  // Copy code to clipboard
  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Filtered items
  const filteredItems = report.items.filter(item => {
    if (activeSeverityFilter === 'all') return true;
    return item.severity === activeSeverityFilter;
  });

  return (
    <section id="scanner" className="py-12 lg:py-20 bg-slate-50/60 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" /> Interactive Compliance Sandbox
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Inspect Your App Before Apple & Google Do
          </h2>
          <p className="text-base text-slate-600 mt-2 font-normal">
            Upload configuration files or enter your live store link to run a 48-point pre-submission policy inspection with real developer evidence.
          </p>
        </div>

        {/* Scanner Controller Console */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden mb-10">
          
          {/* Console Header Tabs */}
          <div className="bg-slate-50/80 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 mr-1">Scan Mode:</span>
              <button
                onClick={() => setScanType('code')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  scanType === 'code'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>1. Pre-Publishing Code Check</span>
              </button>
              <button
                onClick={() => setScanType('url')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  scanType === 'url'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>2. Post-Publishing Link Check</span>
              </button>
            </div>

            {/* Quick preset selector dropdown / buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-700 font-semibold hidden sm:inline">Load Sample App:</span>
              <select
                value={currentReportKey}
                onChange={(e) => {
                  onReportChange(e.target.value);
                  runScan(e.target.value);
                }}
                className="bg-white border border-slate-300 text-xs font-bold text-slate-800 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
              >
                <option value="aura-fitness-ios">Aura Fitness iOS (2 Critical Blockers)</option>
                <option value="snipsnap-ai-android">SnipSnap AI Android (Google Play UGC)</option>
                <option value="focustask-compliant">FocusTask Pro (97/100 Safe)</option>
              </select>
            </div>
          </div>

          {/* Console Body */}
          <div className="p-4 sm:p-6">
            {scanType === 'code' ? (
              <div className="space-y-4">
                {/* Code Presets Selector */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Preset Files:</span>
                  {codePresets.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        selectedPresetId === preset.id
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{preset.fileName}</span>
                    </button>
                  ))}
                </div>

                {/* Code Editor Preview */}
                <div className="relative rounded-xl border border-slate-200 bg-slate-900 text-slate-100 font-mono text-xs overflow-hidden shadow-inner">
                  <div className="bg-slate-800/90 px-4 py-2 flex items-center justify-between border-b border-slate-700 text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                      </div>
                      <span className="text-slate-300 font-semibold">{codePresets.find(p => p.id === selectedPresetId)?.fileName || 'config.file'}</span>
                    </div>
                    <span className="text-[11px] text-amber-400 font-medium">
                      ⚠️ Contains policy triggers
                    </span>
                  </div>
                  <textarea
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    rows={7}
                    className="w-full p-4 bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-y selection:bg-blue-600 selection:text-white"
                    placeholder="Paste your Info.plist, PrivacyInfo.xcprivacy, AndroidManifest.xml or Podfile here..."
                  />
                </div>

                {/* Scan Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-slate-700">
                    🔒 Client-side AST analysis. Scans for Apple 5.1.1, ITMS-91053, Google Target SDK 34, and missing usage strings.
                  </p>
                  <button
                    onClick={() => runScan('aura-fitness-ios')}
                    disabled={isScanning}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Inspecting AST & Rules ({scanStep}/4)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-blue-200" />
                        <span>Run Full Code & AST Audit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* URL Scan View */
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Sample Store Apps:</span>
                  {sampleStoreUrls.map((sample) => (
                    <button
                      key={sample.name}
                      onClick={() => {
                        setCustomUrl(sample.url);
                        onReportChange(sample.auditKey);
                        runScan(sample.auditKey);
                      }}
                      className="text-xs px-2.5 py-1 rounded-md font-semibold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors cursor-pointer"
                    >
                      {sample.name} ({sample.tag})
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://apps.apple.com/app/your-app/id123456789 or Google Play link"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                  <button
                    onClick={() => runScan('aura-fitness-ios')}
                    disabled={isScanning}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Crawling Metadata...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        <span>Scan Live Store Listing</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Live Scan Pipeline Visualizer (When scanning) */}
            {isScanning && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in">
                <p className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 animate-spin text-blue-600" />
                  <span>StoreGuard Automated Pipeline Executing...</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className={`p-2 rounded-lg border ${scanStep >= 1 ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    1. AST & Manifest Parser
                  </div>
                  <div className={`p-2 rounded-lg border ${scanStep >= 2 ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    2. Apple & Google Policy Matcher
                  </div>
                  <div className={`p-2 rounded-lg border ${scanStep >= 3 ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    3. Developer Ban Rants Engine
                  </div>
                  <div className={`p-2 rounded-lg border ${scanStep >= 4 ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    4. Auto-Fix Diff Generator
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Audit Report Output Bento Dashboard */}
        <div id="sample-report" className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden scroll-mt-20">
          
          {/* macOS Style Window Bar for Audit Report */}
          <div className="h-12 border-b border-slate-200 bg-slate-50/80 px-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 ml-2">
                audit_report_{report.id.toLowerCase()}.json
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 hidden sm:inline">
                {report.scanTimestamp}
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                TARGET: {report.targetStore}
              </span>
            </div>
          </div>

          {/* Bento Metrics 4-Box Top Grid */}
          <div className="p-6 bg-slate-50/40 border-b border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Box 1: App Info (4 Cols) */}
            <div className="md:col-span-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Inspected Application
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {report.appName}
                </h3>
                <p className="text-xs font-mono text-slate-600 mt-1 truncate">
                  {report.bundleId}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <span>Rule Engine v4.2</span>
                <span className="text-emerald-700 font-bold">48 Tests Active</span>
              </div>
            </div>

            {/* Box 2: Health Score Gauge (3 Cols) */}
            <div className="md:col-span-3 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center">
              <div className="relative w-20 h-20 flex items-center justify-center mb-1.5">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    stroke="currentColor" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray="201" 
                    strokeDashoffset={201 - (201 * dynamicScore) / 100} 
                    className={`transition-all duration-700 ${
                      dynamicScore >= 90 ? 'text-emerald-500' : dynamicScore >= 70 ? 'text-blue-600' : 'text-rose-500'
                    }`} 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-xl font-black ${
                    dynamicScore >= 90 ? 'text-emerald-600' : dynamicScore >= 70 ? 'text-slate-900' : 'text-rose-600'
                  }`}>
                    {dynamicScore}%
                  </span>
                </div>
              </div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Health Score</h4>
              <p className="text-[10px] font-semibold text-slate-600 mt-0.5">
                {dynamicScore >= 90 ? 'Store Safe' : dynamicScore >= 70 ? 'Warning: Fixes Needed' : 'Critical Rejection Blocker'}
              </p>
            </div>

            {/* Box 3: Revenue Exposure Risk (5 Cols) */}
            <div className="md:col-span-5 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Financial Exposure
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-600">
                    {activeBlockersCount} Blockers Active
                  </span>
                </div>
                <div className="mt-2.5">
                  <div className="text-3xl font-black text-rose-600 tracking-tight">
                    ${dynamicRevenueRisk.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activeBlockersCount > 0 
                      ? 'Estimated direct revenue loss & subscriber churn from 14-day ban.' 
                      : 'All critical blockers resolved. Zero revenue at risk.'}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(8, (dynamicRevenueRisk / 18000) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Action & Filter Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            
            {/* Severity Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveSeverityFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSeverityFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Checks ({report.items.length})
              </button>

              <button
                onClick={() => setActiveSeverityFilter('blocker')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeSeverityFilter === 'blocker'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Critical Blockers ({activeBlockersCount})</span>
              </button>

              <button
                onClick={() => setActiveSeverityFilter('high_risk')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeSeverityFilter === 'high_risk'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>High Risk ({activeHighRiskCount})</span>
              </button>

              <button
                onClick={() => setActiveSeverityFilter('passed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeSeverityFilter === 'passed'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Compliant ({report.items.filter(i => i.status === 'passed' || fixedItemIds.has(i.id)).length})</span>
              </button>
            </div>

            {/* Actions: Export PDF, Share */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenExportModal(report)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export Official Certificate</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Shareable report link copied to clipboard!');
                }}
                className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                title="Share Report"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* List of Audit Check Items */}
          <div className="p-4 sm:p-6 space-y-4 bg-slate-50/40">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">No items found in this category.</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isFixed = fixedItemIds.has(item.id) || item.status === 'passed';
                const isExpanded = expandedItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition-all duration-200 ${
                      isFixed 
                        ? 'bg-emerald-50/30 border-emerald-200' 
                        : item.severity === 'blocker'
                          ? 'bg-white border-rose-300 shadow-sm shadow-rose-100'
                          : item.severity === 'high_risk'
                            ? 'bg-white border-amber-300'
                            : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* Item Summary Header */}
                    <div 
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-3">
                        {/* Status Icon */}
                        <div className="mt-0.5">
                          {isFixed ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          ) : item.severity === 'blocker' ? (
                            <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          ) : item.severity === 'high_risk' ? (
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                              <Info className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        {/* Text and badges */}
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                              isFixed 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : item.severity === 'blocker'
                                  ? 'bg-rose-100 text-rose-800'
                                  : item.severity === 'high_risk'
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'bg-slate-100 text-slate-700'
                            }`}>
                              {isFixed ? 'PASSED / FIXED' : item.severity.replace('_', ' ')}
                            </span>

                            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {item.ruleCode}
                            </span>

                            <span className="text-xs text-slate-700 font-medium">
                              Detected in: <strong className="text-slate-800">{item.detectionLocation}</strong>
                            </span>
                          </div>

                          <h4 className="text-base sm:text-lg font-bold text-slate-900">
                            {item.title}
                          </h4>

                          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Right controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === 'failed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFix(item.id);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              fixedItemIds.has(item.id)
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                            }`}
                          >
                            {fixedItemIds.has(item.id) ? '✓ Fixed in Code' : 'Mark as Fixed'}
                          </button>
                        )}
                        <div className="text-slate-400 hover:text-slate-600 p-1">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Panel: Evidence Engine & Fix Generator */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-white p-4 sm:p-6 space-y-6">
                        
                        {/* 1. The Evidence Engine Box (Crucial user request!) */}
                        {item.evidence && (
                          <div className="bg-gradient-to-br from-amber-50/70 via-rose-50/40 to-white rounded-xl border-2 border-amber-300/80 p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-3 border-b border-amber-200/80 pb-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-amber-500 text-white rounded-lg">
                                  <Flame className="w-4 h-4" />
                                </div>
                                <div>
                                  <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">
                                    The Evidence Engine: Real-World Ban Case Study
                                  </h5>
                                  <p className="text-[11px] text-amber-800 font-semibold">
                                    Matched from {item.evidence.platformName} • {item.evidence.author} ({item.evidence.appCategory})
                                  </p>
                                </div>
                              </div>

                              <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                                {item.evidence.delistDuration}
                              </span>
                            </div>

                            {/* Quote snippet */}
                            <blockquote className="text-xs sm:text-sm text-slate-800 italic bg-white/80 p-3.5 rounded-lg border border-amber-200 font-medium leading-relaxed mb-3">
                              {item.evidence.quote}
                            </blockquote>

                            {/* Quantified impact */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                <span className="text-slate-700 block font-medium">Estimated MRR Lost:</span>
                                <strong className="text-rose-600 font-bold text-sm">
                                  ${item.evidence.metrics.mrrLost.toLocaleString()}
                                </strong>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                <span className="text-slate-700 block font-medium">Involuntary Churn Surge:</span>
                                <strong className="text-amber-700 font-bold text-sm">
                                  {item.evidence.metrics.churnIncrease}
                                </strong>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                                <span className="text-slate-700 block font-medium">Average Review Delay:</span>
                                <strong className="text-slate-900 font-bold text-sm">
                                  {item.evidence.metrics.reviewDelayDays} Days
                                </strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. Fix-It-Fast Generator */}
                        {item.fix && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-blue-600" />
                                <h5 className="text-sm font-extrabold text-slate-900">
                                  Recommended Fix ({item.fix.fileName || 'Code Implementation'})
                                </h5>
                              </div>
                              {item.fix.codeSnippet && (
                                <button
                                  onClick={() => handleCopyCode(item.fix.codeSnippet!, item.id)}
                                  className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedCodeId === item.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-700">Copied to Clipboard!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy Fix Snippet</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Step list */}
                            <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                              {item.fix.stepByStep.map((step, sIdx) => (
                                <li key={sIdx} className="flex items-start gap-2">
                                  <span className="font-semibold text-blue-600 shrink-0">•</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Code Diff / Snippet Box */}
                            {item.fix.codeSnippet && (
                              <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs overflow-hidden">
                                <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-slate-400">
                                  <span className="text-slate-300 font-semibold">{item.fix.fileName}</span>
                                  <span className="text-[11px] text-blue-400 font-mono uppercase">{item.fix.language}</span>
                                </div>
                                <pre className="p-4 overflow-x-auto text-emerald-300 leading-relaxed">
                                  <code>{item.fix.codeSnippet}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
