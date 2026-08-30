import React, { useState } from 'react';
import { ShieldCheck, Sparkles, ArrowRight, Menu, X, Layers, Cpu, Flame, Calculator, Skull } from 'lucide-react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  onOpenScan: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenScan }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="inline-flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-blue-200" /> Bento Audit Engine
        </span>
        <span className="hidden sm:inline text-slate-300 text-xs">Updated for 2026 Apple Privacy Manifests & Google Play Target API 34 Policy</span>
        <span className="sm:hidden text-slate-300 text-xs">2026 App Store & Play Policies Live</span>
        <button 
          onClick={onOpenScan}
          className="ml-2 text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-0.5 cursor-pointer text-xs"
        >
          <span>Try Sandbox</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Bento style badge */}
          <div 
            onClick={() => handleNavClick('hero')} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-sans">
                  StoreGuard<span className="text-blue-600">.ai</span>
                </span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                  Bento v4.2
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation in Bento style */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600">
            <button 
              onClick={() => handleNavClick('scanner')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-bold"
            >
              Live Scanner
            </button>
            <button 
              onClick={() => handleNavClick('evidence')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <span>Evidence Engine</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
            <button 
              onClick={() => handleNavClick('calculator')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-bold"
            >
              Risk Forecaster
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-bold"
            >
              Pipeline
            </button>
            <button 
              onClick={() => handleNavClick('graveyard')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-bold"
            >
              Ban Graveyard
            </button>
            <button 
              onClick={() => handleNavClick('pricing')}
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-bold"
            >
              Pricing
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button 
              onClick={() => handleNavClick('sample-report')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Sample Audit
            </button>
            <button 
              onClick={onOpenScan}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-4 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>New Audit</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={onOpenScan}
              className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg shadow-xs"
            >
              Scan
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1.5 shadow-xl animate-in slide-in-from-top-2">
          <button 
            onClick={() => handleNavClick('scanner')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>Interactive Scanner</span>
          </button>
          <button 
            onClick={() => handleNavClick('evidence')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Evidence Engine</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Real Rants</span>
          </button>
          <button 
            onClick={() => handleNavClick('calculator')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-slate-500" />
            <span>Financial Risk Forecaster</span>
          </button>
          <button 
            onClick={() => handleNavClick('graveyard')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
          >
            <Skull className="w-4 h-4 text-rose-500" />
            <span>Store Ban Graveyard</span>
          </button>
          <button 
            onClick={() => handleNavClick('pricing')}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Indie Pricing</span>
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button 
              onClick={onOpenScan}
              className="w-full text-center py-2.5 bg-blue-600 text-white font-bold rounded-lg text-xs shadow-sm"
            >
              Run Free Pre-Submission Scan
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
