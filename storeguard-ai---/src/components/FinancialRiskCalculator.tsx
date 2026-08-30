import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingDown, ShieldAlert, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface FinancialRiskCalculatorProps {
  onOpenScan: () => void;
}

export const FinancialRiskCalculator: React.FC<FinancialRiskCalculatorProps> = ({ onOpenScan }) => {
  const [mrr, setMrr] = useState<number>(6500);
  const [dau, setDau] = useState<number>(14000);
  const [delistDays, setDelistDays] = useState<number>(14);
  const [appCategory, setAppCategory] = useState<string>('saas');

  // Math Calculations
  const directRevenueLoss = Math.round((mrr / 30) * delistDays);
  const churnLoss = Math.round(mrr * 0.18); // 18% churn increase when users find app broken/missing
  const asoRankingPenalty = Math.round(dau * 0.12 * 3.2); // Organic rank loss equivalent in paid search ads
  const totalLoss = directRevenueLoss + churnLoss + asoRankingPenalty;

  const storeGuardAnnualCost = 29 * 12; // $348/year
  const roiMultiplier = Math.round(totalLoss / (29));

  return (
    <section id="calculator" className="py-16 lg:py-24 bg-white border-b border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-100">
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>Loss Forecaster</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Calculate Your Revenue at Risk from Sudden Delisting
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
            When Apple or Google unlists an indie app, the damage isn't just downtime—it destroys your organic ASO rank and spikes subscriber churn.
          </p>
        </div>

        {/* Bento Grid Calculator Layout */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Controls Bento Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                <span>Your App's Current Metrics</span>
              </h3>
              <span className="text-[10px] font-bold uppercase text-slate-600 font-mono">Live Inputs</span>
            </div>

            {/* MRR Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Monthly Recurring Revenue (MRR):
                </label>
                <span className="text-base font-extrabold text-blue-600 font-mono">
                  ${mrr.toLocaleString()}/mo
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={mrr}
                onChange={(e) => setMrr(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>$500/mo</span>
                <span>$25,000/mo</span>
                <span>$50,000+/mo</span>
              </div>
            </div>

            {/* DAU Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Daily Active Users (DAU):
                </label>
                <span className="text-base font-extrabold text-blue-600 font-mono">
                  {dau.toLocaleString()} users
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={dau}
                onChange={(e) => setDau(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>1,000 users</span>
                <span>50,000 users</span>
                <span>100,000+ users</span>
              </div>
            </div>

            {/* Delist Days Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Estimated Removal / Appeal Resolution Time:
                </label>
                <span className="text-base font-extrabold text-rose-600 font-mono">
                  {delistDays} Days
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={delistDays}
                onChange={(e) => setDelistDays(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>3 Days (Fast)</span>
                <span>14 Days (Avg)</span>
                <span>30 Days (Escalated)</span>
              </div>
            </div>

            {/* Presets Bento Strip */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">Stage Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => { setMrr(2500); setDau(4500); setDelistDays(10); }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold cursor-pointer"
                >
                  Early Indie ($2.5k MRR)
                </button>
                <button
                  type="button"
                  onClick={() => { setMrr(12000); setDau(35000); setDelistDays(14); }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold cursor-pointer"
                >
                  Scaling Solo ($12k MRR)
                </button>
                <button
                  type="button"
                  onClick={() => { setMrr(35000); setDau(80000); setDelistDays(18); }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold cursor-pointer"
                >
                  Bootstrapped Studio ($35k MRR)
                </button>
              </div>
            </div>
          </div>

          {/* Results Bento Summary Card (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 rounded-2xl text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" /> Financial Exposure
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/30 font-mono">
                  {delistDays}-Day Delist Model
                </span>
              </div>

              {/* Total Figure */}
              <div className="my-5">
                <p className="text-xs text-slate-400 font-medium">Estimated Total Financial Loss:</p>
                <p className="text-4xl sm:text-5xl font-black text-rose-400 tracking-tight mt-1">
                  ${totalLoss.toLocaleString()}
                </p>
                <p className="text-xs text-slate-300 mt-1 font-normal">
                  More than <strong className="text-white">{roiMultiplier}x</strong> the cost of a StoreGuard scan.
                </p>
              </div>

              {/* Itemized Bento Mini-Cards */}
              <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex justify-between items-center text-slate-300">
                  <span>1. Direct Revenue Loss:</span>
                  <strong className="text-white font-mono">${directRevenueLoss.toLocaleString()}</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex justify-between items-center text-slate-300">
                  <span>2. Subscriber Churn:</span>
                  <strong className="text-amber-300 font-mono">${churnLoss.toLocaleString()}</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 flex justify-between items-center text-slate-300">
                  <span>3. ASO Rank Recovery:</span>
                  <strong className="text-rose-300 font-mono">${asoRankingPenalty.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <div className="bg-blue-600/20 border border-blue-400/20 rounded-xl p-3 text-xs text-blue-200">
                <strong className="text-white">StoreGuard Protection:</strong> $29/mo prevents 100% of these configuration and guideline traps.
              </div>

              <button
                onClick={onOpenScan}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Protect My App Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
