import React from 'react';
import { ShieldCheck, Heart, Sparkles, Github, Twitter } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (sectionId: string) => void; onOpenScan: () => void }> = ({
  onNavigate,
  onOpenScan
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span>StoreGuard<span className="text-blue-500">.ai</span></span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs font-normal">
              AI-powered pre-submission and post-publishing mobile compliance inspector for indie hackers.
            </p>
            <div className="pt-1 flex items-center gap-2 text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px]">2026 Apple & Google Policy Engine Live</span>
            </div>
          </div>

          {/* Col 2: Products & Tools */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Inspection Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenScan} className="hover:text-white transition-colors cursor-pointer">
                  Pre-Publishing Code AST Check
                </button>
              </li>
              <li>
                <button onClick={onOpenScan} className="hover:text-white transition-colors cursor-pointer">
                  Post-Publishing Store Link Crawler
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('evidence')} className="hover:text-white transition-colors cursor-pointer">
                  The Evidence Engine (Ban Rants)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('calculator')} className="hover:text-white transition-colors cursor-pointer">
                  Revenue at Risk Forecaster
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines Tracked */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              Policy Standards
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-400">Apple Guideline 5.1.1(v) Account Deletion</span>
              </li>
              <li>
                <span className="text-slate-400">Required Reason API (Privacy Manifest)</span>
              </li>
              <li>
                <span className="text-slate-400">Google Play Target SDK 34 Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Generative AI & UGC Moderation 1.2</span>
              </li>
              <li>
                <span className="text-slate-400">Anti-Steering & IAP Guideline 3.1.1</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Indie Hackers */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
              For Indie Developers
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('graveyard')} className="hover:text-white transition-colors cursor-pointer">
                  The Store Ban Graveyard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors cursor-pointer">
                  Indie Pricing & ROI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors cursor-pointer">
                  Security & Zero-Storage FAQ
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © 2026 StoreGuard AI. Crafted for solo founders and mobile developers. Not affiliated with Apple Inc. or Google LLC.
          </p>
          <div className="flex items-center gap-4">
            <span>Built with clean light mode precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
