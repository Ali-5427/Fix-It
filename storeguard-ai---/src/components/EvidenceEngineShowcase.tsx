import React, { useState } from 'react';
import { 
  Flame, 
  TrendingDown, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  AlertOctagon, 
  FileCode, 
  MessageSquareQuote, 
  DollarSign, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { evidenceCaseStudies } from '../data/evidenceDatabase';
import { CaseStudy, Category } from '../types';

interface EvidenceEngineShowcaseProps {
  onSelectCaseForScan?: (caseId: string) => void;
}

export const EvidenceEngineShowcase: React.FC<EvidenceEngineShowcaseProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCaseId, setActiveCaseId] = useState<string>(evidenceCaseStudies[0].id);

  const activeCase = evidenceCaseStudies.find(c => c.id === activeCaseId) || evidenceCaseStudies[0];

  const categories = [
    { id: 'all', name: 'All Case Studies' },
    { id: 'account_deletion', name: 'Account Deletion (5.1.1)' },
    { id: 'privacy_manifest', name: 'Privacy Manifests (2024+)' },
    { id: 'data_safety', name: 'Google Data Safety' },
    { id: 'ugc_moderation', name: 'AI / UGC Moderation' },
    { id: 'paywall_iap', name: 'Anti-Steering (3.1.1)' },
    { id: 'permissions', name: 'Permission Strings' },
  ];

  const filteredCases = evidenceCaseStudies.filter(c => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  return (
    <section id="evidence" className="py-16 lg:py-24 bg-slate-50/70 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-extrabold uppercase tracking-wider mb-3 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>The Evidence Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            We Don't Just Flag Code.<br />
            We Prove Why Reviewers Will Ban Your App.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 font-normal">
            Most linters output vague strings. StoreGuard matches each violation to real-world indie developer post-mortems, Reddit rants, and verified revenue losses.
          </p>
        </div>

        {/* Category Filter Pills in Bento style */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const first = evidenceCaseStudies.find(c => cat.id === 'all' || c.category === cat.id);
                if (first) setActiveCaseId(first.id);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Bento Grid Case Study Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Bento Cards of Ban Incidents (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Verified Ban Cases:
              </h3>
              <span className="text-[10px] text-slate-600 font-mono">
                {filteredCases.length} records found
              </span>
            </div>

            {filteredCases.map(item => {
              const isSelected = item.id === activeCaseId;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveCaseId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {item.sourceType} • {item.platform.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                      {item.revenueImpact.split('•')[0]}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {item.subtitle}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-blue-600 font-semibold pt-2 border-t border-slate-100">
                    <span className="font-mono text-xs">{item.ruleBroken}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Bento Dossier (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/30">
            
            {/* Dossier Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  Verified Removal Incident
                </span>
                <span className="text-xs text-slate-700 font-semibold font-mono bg-slate-100 px-2 py-0.5 rounded">
                  {activeCase.ruleBroken}
                </span>
              </div>
              <span className="text-xs text-slate-600 font-medium">
                Source: <strong className="text-slate-800">{activeCase.sourceType} Archive</strong>
              </span>
            </div>

            {/* Title & Stats */}
            <div className="mt-4 space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {activeCase.title}
              </h3>
              <p className="text-xs text-slate-600">
                App: <strong className="text-slate-800">{activeCase.appNamePlaceholder}</strong>
              </p>
            </div>

            {/* Financial Impact Bento Grid */}
            <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-600 font-medium block">Total Business Impact</span>
                <strong className="text-lg sm:text-xl font-black text-rose-600">
                  {activeCase.revenueImpact}
                </strong>
              </div>
              <div>
                <span className="text-xs text-slate-600 font-medium block">Store Delist Period</span>
                <strong className="text-lg sm:text-xl font-black text-slate-900">
                  {activeCase.daysDowntime} Days of Downtime
                </strong>
              </div>
            </div>

            {/* Developer Quote Bento Card */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <MessageSquareQuote className="w-3.5 h-3.5 text-amber-500" />
                <span>Developer's Actual Post-Mortem:</span>
              </span>
              <blockquote className="p-4 rounded-xl bg-amber-50/50 border-l-4 border-amber-500 text-slate-800 italic text-xs sm:text-sm leading-relaxed font-medium">
                {activeCase.developerQuote}
              </blockquote>
            </div>

            {/* Full Story Breakdown */}
            <div className="mt-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p className="whitespace-pre-line">
                {activeCase.fullStory}
              </p>
            </div>

            {/* Key Takeaway & How StoreGuard Prevents It */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span className="text-xs sm:text-sm font-extrabold text-blue-950">
                    How StoreGuard AI Stops This Mistake
                  </span>
                </div>
                <p className="text-xs text-blue-900 font-medium">
                  {activeCase.keyTakeaway}
                </p>
                <div className="mt-2.5 bg-slate-900 text-emerald-300 font-mono text-[11px] p-3 rounded-lg overflow-x-auto">
                  <code>{activeCase.preventionCode}</code>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
