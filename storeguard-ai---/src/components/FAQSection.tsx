import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does my source code or project data ever leave my computer?',
      a: 'No. When you upload or paste your Info.plist, PrivacyInfo.xcprivacy, or AndroidManifest.xml, the AST analysis and rule checking runs entirely inside your browser sandbox. We never store or log your proprietary business logic.'
    },
    {
      q: 'How does StoreGuard catch third-party SDK traps in CocoaPods / Gradle?',
      a: 'We parse your Podfile, build.gradle, and SPM Package.swift to cross-reference every embedded framework against our database of 600+ known SDKs (like AppsFlyer, Firebase, Facebook, OneSignal). We flag when an SDK accesses Required Reason APIs or Advertising IDs without matching Privacy Manifest declarations.'
    },
    {
      q: 'Why does Apple reject apps for Account Deletion months after launch?',
      a: 'Apple often approves early versions without thorough manual checks. Later, during routine background compliance crawls or when you push a minor patch, Apple re-evaluates Guideline 5.1.1(v). If your delete button merely triggers a logout or asks the user to email support, they will immediately unlist the app.'
    },
    {
      q: 'How often is the StoreGuard guideline database updated?',
      a: 'Our crawler tracks changes to Apple App Store Review Guidelines and Google Play Developer Program Policies daily. Whenever Apple or Google introduces new policies (such as the 2026 Spring changes or Target SDK 34 deadlines), our rule engine updates automatically within hours.'
    },
    {
      q: 'Can I integrate StoreGuard into my GitHub Actions CI/CD pipeline?',
      a: 'Yes! Our Solo and Studio plans include the StoreGuard GitHub Action. You can add a 3-line YAML step to your repository to automatically block PRs that introduce missing privacy strings or unhandled permissions before merging to main.'
    },
    {
      q: 'What happens if Apple rejects my app after using StoreGuard?',
      a: 'We offer a 100% money-back guarantee. If you scan your app with StoreGuard, follow all recommendations, and Apple still issues a technical guideline rejection for a flagged component, our team will review the rejection resolution message with you and refund your subscription.'
    }
  ];

  return (
    <section id="faq" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-300">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Developer Questions Answered</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 mt-2 font-normal">
            Everything you need to know about automated App Store & Google Play compliance.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
