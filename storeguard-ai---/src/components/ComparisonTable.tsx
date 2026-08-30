import React from 'react';
import { Check, X, ShieldCheck, Sparkles } from 'lucide-react';

export const ComparisonTable: React.FC<{ onOpenScan: () => void }> = ({ onOpenScan }) => {
  const comparisonRows = [
    {
      feature: 'Pre-Submission AST Code & Manifest Check',
      manual: false,
      lawyer: false,
      storeguard: true,
      note: 'Analyzes Info.plist, PrivacyInfo.xcprivacy, and Podfile in seconds'
    },
    {
      feature: 'Matches Traps to Real $10k+ Ban Case Studies',
      manual: false,
      lawyer: false,
      storeguard: true,
      note: 'The Evidence Engine cross-references 4,500+ dev rants'
    },
    {
      feature: 'Ready-to-Copy XML / Swift / Kotlin Diff Generator',
      manual: false,
      lawyer: false,
      storeguard: true,
      note: 'Instant code fixes with 1-click copy'
    },
    {
      feature: 'Continuous Post-Publishing Store Link Crawler',
      manual: false,
      lawyer: false,
      storeguard: true,
      note: 'Alerts before Apple or Google background bots flag you'
    },
    {
      feature: 'Analysis Speed',
      manualText: '14+ hours of manual reading',
      lawyerText: '3-5 business days',
      storeguardText: 'Under 15 seconds',
      isText: true
    },
    {
      feature: 'Cost',
      manualText: 'Free (Costly missed bugs)',
      lawyerText: '$3,500 - $10,000 retainer',
      storeguardText: '$29 / month',
      isText: true
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Manual Guideline Guesswork vs StoreGuard AI
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-2 font-normal">
            Why solo developers choose automated inspection over risky manual reading or expensive enterprise lawyers.
          </p>
        </div>

        {/* Table container */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90 text-xs uppercase tracking-wider text-slate-700">
                  <th className="p-4 sm:p-5 font-bold">Capabilities</th>
                  <th className="p-4 sm:p-5 font-bold text-center text-slate-600">Manual Reading</th>
                  <th className="p-4 sm:p-5 font-bold text-center text-slate-600">Legal Retainer</th>
                  <th className="p-4 sm:p-5 font-extrabold text-center bg-blue-600 text-white">
                    StoreGuard AI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-slate-900">
                      <div>{row.feature}</div>
                      {row.note && (
                        <div className="text-[11px] font-normal text-slate-700 mt-0.5">{row.note}</div>
                      )}
                    </td>

                    {/* Manual */}
                    <td className="p-4 sm:p-5 text-center text-slate-600">
                      {row.isText ? (
                        <span className="font-semibold text-slate-700">{row.manualText}</span>
                      ) : row.manual ? (
                        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-rose-400 mx-auto" />
                      )}
                    </td>

                    {/* Lawyer */}
                    <td className="p-4 sm:p-5 text-center text-slate-600">
                      {row.isText ? (
                        <span className="font-semibold text-slate-700">{row.lawyerText}</span>
                      ) : row.lawyer ? (
                        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-rose-400 mx-auto" />
                      )}
                    </td>

                    {/* StoreGuard */}
                    <td className="p-4 sm:p-5 text-center bg-blue-50/50 font-bold text-blue-950">
                      {row.isText ? (
                        <span className="font-extrabold text-blue-700">{row.storeguardText}</span>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-xs">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
