import React, { useState } from 'react';
import { Skull, AlertTriangle, Search, ExternalLink, Calendar, ArrowRight, ShieldCheck, Filter } from 'lucide-react';

interface BanEvent {
  id: string;
  year: string;
  month: string;
  platform: 'Apple App Store' | 'Google Play Store';
  title: string;
  trapSummary: string;
  appsImpacted: string;
  triggerMechanism: string;
  severity: 'Catastrophic Purge' | 'High Impact Policy' | 'Review Blocker';
  solution: string;
}

export const BanGraveyard: React.FC<{ onOpenScan: () => void }> = ({ onOpenScan }) => {
  const [platformFilter, setPlatformFilter] = useState<'all' | 'apple' | 'google'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const purgeEvents: BanEvent[] = [
    {
      id: 'purge_1',
      year: '2024',
      month: 'May',
      platform: 'Apple App Store',
      title: 'The Mandatory Privacy Manifest & Required Reason API Purge',
      trapSummary: 'Apple blocked all binary uploads with error ITMS-91053 if third-party SDKs accessed system boot time, disk space, or user defaults without declared reasons.',
      appsImpacted: 'Estimated 45,000+ indie apps delayed or rejected',
      triggerMechanism: 'Automated Xcode binary upload validator',
      severity: 'Catastrophic Purge',
      solution: 'Generate compliant PrivacyInfo.xcprivacy with approved reason strings (e.g., C617.1).'
    },
    {
      id: 'purge_2',
      year: '2024',
      month: 'August',
      platform: 'Google Play Store',
      title: 'Target SDK 34 & Inactive Account Cleanout',
      trapSummary: 'Google issued 14-day ultimatums and removed hundreds of apps that failed to migrate from READ_EXTERNAL_STORAGE to Android 14 photo pickers.',
      appsImpacted: 'Over 120,000 Android apps removed from search',
      triggerMechanism: 'Play Console background compliance bot',
      severity: 'High Impact Policy',
      solution: 'Update build.gradle targetSdk to 34+ and use ActivityResultContracts.PickVisualMedia.'
    },
    {
      id: 'purge_3',
      year: '2023',
      month: 'June',
      platform: 'Apple App Store',
      title: 'Guideline 5.1.1(v) Mandatory In-App Account Deletion Enforcement',
      trapSummary: 'Apple began unlisting live apps that only supported deletion via support email tickets instead of a direct 1-tap in-app button with backend cascade wipe.',
      appsImpacted: 'Thousands of profitable SaaS & fitness apps delisted',
      triggerMechanism: 'Manual Resolution Center re-audits upon minor updates',
      severity: 'Catastrophic Purge',
      solution: 'Add in-app Delete Account trigger that invokes auth user.delete() and backend database purge.'
    },
    {
      id: 'purge_4',
      year: '2025',
      month: 'January',
      platform: 'Apple App Store',
      title: 'Generative AI Prompt & UGC Content Moderation Sweep',
      trapSummary: 'Apple rejected hundreds of trending AI avatar and text apps under Guideline 1.2 for lacking in-app content reporting flags and prompt blacklists.',
      appsImpacted: 'Widespread rejections during viral holiday launches',
      triggerMechanism: 'Reviewer manual prompt testing',
      severity: 'Review Blocker',
      solution: 'Embed mandatory report flag, block creator flow, and EULA agreement screen.'
    },
    {
      id: 'purge_5',
      year: '2024',
      month: 'November',
      platform: 'Google Play Store',
      title: 'Personal Developer 20-Tester 14-Day Mandatory Rule',
      trapSummary: 'Google enacted a policy requiring new individual developer accounts to recruit 20 opt-in closed testers continuously active for 14 straight days before production access.',
      appsImpacted: 'Over 60% of new solo developers blocked from launching',
      triggerMechanism: 'Play Console automated production gate',
      severity: 'High Impact Policy',
      solution: 'StoreGuard pre-checks and tracks closed testing compliance criteria.'
    }
  ];

  const filteredPurges = purgeEvents.filter(event => {
    if (platformFilter === 'apple' && event.platform !== 'Apple App Store') return false;
    if (platformFilter === 'google' && event.platform !== 'Google Play Store') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.trapSummary.toLowerCase().includes(q) ||
        event.triggerMechanism.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section id="graveyard" className="py-16 lg:py-24 bg-slate-50/60 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-3 border border-rose-200">
            <Skull className="w-3.5 h-3.5 text-rose-600" />
            <span>Historical Ban Archive</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The App Store Ban Graveyard
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-2 font-normal">
            Every year, Apple and Google quietly roll out guideline updates that unlist thousands of unsuspecting indie developers. Don't be next.
          </p>
        </div>

        {/* Filter and Search */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platformFilter === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Purges ({purgeEvents.length})
            </button>
            <button
              onClick={() => setPlatformFilter('apple')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platformFilter === 'apple' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Apple App Store
            </button>
            <button
              onClick={() => setPlatformFilter('google')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                platformFilter === 'google' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Google Play
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guideline purges..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
            />
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredPurges.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {event.month} {event.year}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    event.platform === 'Apple App Store'
                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {event.platform}
                  </span>
                </div>

                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {event.severity}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-3">
                {event.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {event.trapSummary}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl text-xs">
                <div>
                  <span className="text-slate-700 font-medium block">Total Community Fallout:</span>
                  <strong className="text-rose-600 font-bold">{event.appsImpacted}</strong>
                </div>
                <div>
                  <span className="text-slate-700 font-medium block">Detection Mechanism:</span>
                  <strong className="text-slate-800 font-bold">{event.triggerMechanism}</strong>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-700">
                  <strong className="text-slate-800">StoreGuard Solution:</strong> {event.solution}
                </span>
                <button
                  onClick={onOpenScan}
                  className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                >
                  <span>Scan for this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
