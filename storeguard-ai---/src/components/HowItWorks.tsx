import React from 'react';
import { FileCode, Globe, Flame, CheckCircle, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface HowItWorksProps {
  onOpenScan: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenScan }) => {
  const steps = [
    {
      step: '01',
      title: 'Pre-Publishing Code & Manifest Check',
      badge: 'Before You Submit',
      icon: FileCode,
      description: 'Upload your configuration files (Info.plist, PrivacyInfo.xcprivacy, Podfile, build.gradle, or AndroidManifest.xml). Our AST parser flags unhandled permission strings, missing Required Reason APIs, and hidden third-party SDK tracking traps.',
      points: [
        'Automatic Mach-O & dependency symbol audit',
        'PrivacyInfo.xcprivacy completeness verification',
        'In-App Account Deletion 5.1.1(v) code check'
      ]
    },
    {
      step: '02',
      title: 'Post-Publishing Store Link Crawler',
      badge: 'Live Store Monitoring',
      icon: Globe,
      description: 'Connect your live App Store or Google Play URL. StoreGuard continuously crawls your metadata, screenshots, pricing disclosures, and privacy policy URLs for stealth guideline changes.',
      points: [
        'Anti-steering & 3.1.1 external URL scanner',
        'Paywall terms & subscription auto-renewal check',
        'UGC moderation & generative AI disclaimer test'
      ]
    },
    {
      step: '03',
      title: 'The Evidence Engine & Auto-Fix Diff',
      badge: 'Proof & Resolution',
      icon: Flame,
      description: 'We match every detected violation to real-world indie hacker case studies and verified revenue losses, then generate clean copy-pasteable XML, Swift, or Kotlin diffs to fix it in 60 seconds.',
      points: [
        'Real Reddit & Hacker News post-mortem citations',
        'Estimated financial loss & delisting downtime model',
        'Ready-to-copy code fixes with zero guesswork'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-300">
            <Zap className="w-3.5 h-3.5" />
            <span>3-Step Protection Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How StoreGuard Protects Your Mobile Business
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-2 font-normal">
            A comprehensive, automated compliance pipeline engineered specifically for solo founders and small bootstrapped teams.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:border-blue-300 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-blue-600 font-mono tracking-tight">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                      {item.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 space-y-2">
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-600/20">
          <div>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white">
              Ready to verify your app before submission?
            </h4>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 font-normal">
              Run your first compliance scan in under 15 seconds. No account or credit card required.
            </p>
          </div>
          <button
            onClick={onOpenScan}
            className="px-6 py-3 bg-white hover:bg-slate-100 active:bg-blue-50 text-blue-700 font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Run Free Pre-Submission Scan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
