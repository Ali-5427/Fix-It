import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  UploadCloud, 
  ArrowRight, 
  Sparkles, 
  FileCode2, 
  Globe2, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Flame,
  Terminal,
  ExternalLink,
  Cpu,
  Layers
} from 'lucide-react';

interface HeroProps {
  onSelectPreset: (presetKey: string) => void;
  onStartCustomScan: (type: 'code' | 'url', payload: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectPreset, onStartCustomScan }) => {
  const [activeTab, setActiveTab] = useState<'url' | 'code'>('url');
  const [inputUrl, setInputUrl] = useState('');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onStartCustomScan('url', inputUrl.trim());
    } else {
      onSelectPreset('aura-fitness-ios');
    }
  };

  return (
    <section className="bg-slate-50 text-slate-900 pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Bento Tile 1: Top Hero Pitch (4 Cols on lg) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wider w-fit">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Platform Compliance</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Stop worrying about <span className="text-blue-600">App Store bans.</span>
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                AI-powered inspector that catches hidden policy violations in your code, manifests, and live metadata before Apple or Google reviewers strike.
              </p>
            </div>

            {/* Quick Feature Bento Highlights */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileCode2 className="w-3.5 h-3.5" />
                </div>
                <span>1. Pre-Publishing Code AST Check</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Globe2 className="w-3.5 h-3.5" />
                </div>
                <span>2. Live Store Link Anti-Steering Crawler</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span>3. The Evidence Engine (4,500+ Dev Cases)</span>
              </div>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
              <div>
                <p className="text-xl font-black text-blue-600">2,410+</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Apps Inspected</p>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">$4.2M+</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">MRR Protected</p>
              </div>
            </div>
          </div>

          {/* Bento Tile 2: Live Audit Report Bento Window (8 Cols on lg) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col overflow-hidden">
            
            {/* macOS Style Window Bar */}
            <div className="h-12 border-b border-slate-100 bg-slate-50/70 px-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-xs font-mono text-slate-500 ml-2 hidden sm:inline">
                  project_root/ios/compliance_report_v2.json
                </span>
                <span className="text-xs font-mono text-slate-500 ml-2 sm:hidden">
                  report_v2.json
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                  LIVE SCAN ACTIVE
                </span>
              </div>
            </div>

            {/* Bento Inner Grid: 2 Rows */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              
              {/* Sub-Bento 1: Circular Health Score Gauge */}
              <div className="md:col-span-1 border border-slate-100 rounded-xl p-5 flex flex-col items-center justify-center text-center bg-slate-50/40">
                <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="7" fill="transparent" className="text-slate-200" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      stroke="currentColor" 
                      strokeWidth="7" 
                      fill="transparent" 
                      strokeDasharray="251.2" 
                      strokeDashoffset="75.3" 
                      className="text-blue-600 transition-all duration-1000" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">70%</span>
                  </div>
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Health Score</h3>
                <p className="text-[11px] text-amber-700 font-semibold mt-0.5">2 Critical Traps Found</p>
              </div>

              {/* Sub-Bento 2: Detected Violations List */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Detected Violations
                    </h3>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      Apple Review Rejection Risk
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 shrink-0"></div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">Missing NSAppleMusicUsageDescription</p>
                        <p className="text-[11px] text-slate-500 font-mono">Info.plist: Line 42 — Mandatory for builds using AVFoundation.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1 shrink-0"></div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900">Account Deletion Link Not Found</p>
                        <p className="text-[11px] text-slate-500 font-mono">Metadata: App Store URL — Required by Guideline 5.1.1(v).</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Bento 3: Evidence Engine Case Study Bento Bar (Full width across 3 cols) */}
              <div className="md:col-span-3 border-2 border-blue-600/15 bg-blue-50/40 rounded-xl p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                      <Flame className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-blue-950">
                      Evidence Engine Case Study #412
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                    r/iOSProgramming
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-7">
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                      Real World Fallout
                    </p>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-white/70 p-3 rounded-lg border border-blue-100">
                      "App 'HabitX' (150k downloads) was removed for the exact same NSAppleMusicUsageDescription error in Oct 2023. It took 14 days to resolve, resulting in a total revenue loss of $12,400."
                    </p>
                  </div>

                  <div className="sm:col-span-5 sm:border-l border-blue-200 sm:pl-6 flex flex-col justify-center">
                    <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">
                      $12,400
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      ESTIMATED REVENUE RISK
                    </div>
                    <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-blue-600 rounded-full"></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">14 days delisting downtime penalty</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Quick Test Presets Selector Strip */}
            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Test realistic apps in sandbox:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => onSelectPreset('aura-fitness-ios')}
                  className="text-xs bg-white hover:bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-md border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>Aura Fitness (2 Blockers, $14k Risk)</span>
                </button>
                <button
                  onClick={() => onSelectPreset('snipsnap-ai-android')}
                  className="text-xs bg-white hover:bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-md border border-slate-200 hover:border-amber-200 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>SnipSnap AI (Google Play UGC)</span>
                </button>
                <button
                  onClick={() => onSelectPreset('focustask-compliant')}
                  className="text-xs bg-white hover:bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-md border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>FocusTask Pro (97/100 Safe)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bento Tile 3: Pre-Publishing Check Upload (6 Cols on lg) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-blue-600" />
                  <span>Pre-Publishing Code Check</span>
                </h4>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                  Local AST Scanner
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Upload Info.plist, PrivacyInfo.xcprivacy, AndroidManifest.xml, or Podfile.
              </p>
              
              <div 
                onClick={() => onSelectPreset('aura-fitness-ios')}
                className="border-2 border-dashed border-slate-200 rounded-xl h-28 flex flex-col items-center justify-center gap-2 hover:border-blue-400 cursor-pointer transition-colors bg-slate-50/50 p-4 text-center group"
              >
                <UploadCloud className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold text-slate-700">
                  Drop configuration files here or click to simulate upload
                </span>
                <span className="text-[10px] text-slate-400">Zero code transmitted to external servers</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Supports Apple ITMS-91053 & Target SDK 34</span>
              <button 
                onClick={() => onSelectPreset('aura-fitness-ios')}
                className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Try AST Scan</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bento Tile 4: Post-Publishing Check Link Crawler (6 Cols on lg) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-indigo-600" />
                  <span>Post-Publishing Store Link Crawler</span>
                </h4>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                  Live Anti-Steering & IAP
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Scan your live App Store or Google Play listing metadata, screenshots, and privacy policy.
              </p>

              <form onSubmit={handleUrlSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://apps.apple.com/app/your-app/id123456789 or Google Play URL..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:bg-white transition-all shadow-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Scan URL</span>
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Guideline 3.1.1, 5.1.1(v), & Data Safety Crawler</span>
              <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                100% Free Sandbox
              </span>
            </div>
          </div>

        </div>

        {/* Trusted By Bento Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              ENGINEERED FOR INDIE HACKERS & BOOTSTRAPPED STUDIOS
            </span>
            <div className="h-3.5 w-px bg-slate-200 hidden sm:block"></div>
          </div>
          <div className="flex items-center gap-6 text-xs font-black tracking-tight text-slate-500">
            <span>PRODUCT HUNT #1 DEV TOOL</span>
            <span>•</span>
            <span>HACKER NEWS POPULAR</span>
            <span>•</span>
            <span>r/iOSProgramming</span>
          </div>
        </div>

      </div>
    </section>
  );
};
