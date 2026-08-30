import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, ArrowRight, Zap, Flame } from 'lucide-react';

export const PricingSection: React.FC<{ onOpenScan: () => void }> = ({ onOpenScan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Solo Indie',
      badge: 'Best for 1-2 Apps',
      priceMonthly: 29,
      priceYearly: 24,
      description: 'Everything a solo hacker needs to protect their app from sudden store rejections and bans.',
      features: [
        'Up to 3 Monitored Mobile Apps',
        'Unlimited Pre-Submission Code Scans',
        'Full Evidence Engine (4,500+ Ban Cases)',
        'PrivacyInfo.xcprivacy Manifest Generator',
        'In-App Account Deletion 5.1.1 Verifier',
        'Google Play Data Safety Form Matcher',
        'GitHub Action / CI/CD AST Linter'
      ],
      isPopular: false,
      ctaText: 'Start 7-Day Free Trial'
    },
    {
      name: 'Indie Studio',
      badge: 'Most Popular',
      priceMonthly: 69,
      priceYearly: 58,
      description: 'Continuous 24/7 store crawler and early-warning alerts for scaling app portfolios.',
      features: [
        'Up to 10 Monitored Mobile Apps',
        'Continuous 24/7 Store Link Crawler',
        'Real-time Slack & Email Removal Alerts',
        'Automated App Store Review Radar',
        'Screenshot & Paywall OCR Text Scanner',
        'Priority Guideline Policy Support',
        'Export Official Verification PDF Certificates'
      ],
      isPopular: true,
      ctaText: 'Get Studio Protection'
    },
    {
      name: 'Lifetime Founder Pass',
      badge: 'Limited to First 250 Devs',
      priceOneTime: 199,
      isOneTime: true,
      description: 'Pay once, protect your indie mobile apps forever. Zero recurring subscription stress.',
      features: [
        'Lifetime Access to StoreGuard AI Engine',
        '5 Apps Monitored for Life',
        'All Future Apple & Google Rule Updates',
        'Private Indie Hacker Discord Channel',
        'Personal Store Rejection Review Help'
      ],
      isPopular: false,
      ctaText: 'Claim Lifetime Pass'
    }
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-slate-50/70 border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-300">
            <Zap className="w-3.5 h-3.5" />
            <span>Indie-Friendly Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Prevent 1 Rejection and It Pays for 5 Years
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-2 font-normal">
            Affordable insurance for solo founders. Transparent pricing with a 30-day money-back guarantee.
          </p>

          {/* Billing Switch */}
          <div className="mt-6 inline-flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => {
            const price = plan.isOneTime
              ? plan.priceOneTime
              : billingCycle === 'yearly'
                ? plan.priceYearly
                : plan.priceMonthly;

            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border-2 transition-all p-6 sm:p-8 flex flex-col justify-between relative ${
                  plan.isPopular
                    ? 'border-blue-600 shadow-xl shadow-blue-600/10 ring-2 ring-blue-600/10'
                    : 'border-slate-200 hover:border-slate-300 shadow-md'
                }`}
              >
                {/* Popular Pill */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-xs ${
                      plan.isPopular
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-900 text-white'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-6 font-normal min-h-[32px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-100">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                      ${price}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {plan.isOneTime ? 'one-time payment' : billingCycle === 'yearly' ? '/mo (billed annually)' : '/month'}
                    </span>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                      Included Protection:
                    </span>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={onOpenScan}
                  className={`w-full py-3 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    plan.isPopular
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-600/20'
                      : 'bg-slate-900 hover:bg-slate-800 active:bg-black text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantee Seal */}
        <div className="mt-12 max-w-xl mx-auto text-center bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-center gap-3 text-xs text-slate-700">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <p className="font-medium text-left">
            <strong className="text-slate-900">Pass-or-Refund Guarantee:</strong> If your app gets rejected for a technical trap StoreGuard missed, we refund your subscription immediately—no questions asked.
          </p>
        </div>

      </div>
    </section>
  );
};
