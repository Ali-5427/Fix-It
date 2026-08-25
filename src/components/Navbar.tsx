import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Menu,
  X,
  ArrowRight
} from 'lucide-react';
import { store } from '../services/store';
import { Application, User } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'audit' | 'rejection' | 'metadata' | 'screenshots' | 'admin' | 'privacy';
  onNavigate: (view: 'landing' | 'dashboard' | 'audit' | 'rejection' | 'metadata' | 'screenshots' | 'admin' | 'privacy') => void;
  onOpenUpload: () => void;
  onOpenAuth: (mode?: 'login' | 'register', tier?: 'free' | 'pro' | 'studio') => void;
  onOpenAccount?: () => void;
  user: User | null;
  selectedApp: Application | null;
  apps: Application[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  onOpenAuth,
  onOpenAccount,
  user,
  selectedApp,
  apps
}) => {
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectApp = (appId: string) => {
    store.selectApp(appId);
    setAppDropdownOpen(false);
    onNavigate('audit');
  };

  const scrollToLandingSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleMobileNav = (view: 'landing' | 'dashboard' | 'audit' | 'rejection' | 'metadata' | 'screenshots' | 'admin' | 'privacy') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-4 pb-2">
        <div className="flex h-14 items-center justify-between rounded-full border border-slate-200/70 bg-white/60 px-5 sm:px-7 backdrop-blur-xl shadow-xs">
          
          {/* Left: Fix It Logo & Name */}
          <div className="flex items-center gap-3">
            <button 
              id="nav_brand_logo"
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900 font-mono">Fix It</span>
            </button>
          </div>

          {/* Navigation Links: Product, How it works, Pricing, FAQ */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav_link_product"
              onClick={() => scrollToLandingSection('product-showcase')}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
            >
              Product
            </button>

            <button
              id="nav_link_how_it_works"
              onClick={() => scrollToLandingSection('how-it-works')}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
            >
              How it works
            </button>

            <button
              id="nav_link_pricing"
              onClick={() => scrollToLandingSection('pricing')}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
            >
              Pricing
            </button>

            <button
              id="nav_link_faq"
              onClick={() => scrollToLandingSection('faq')}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Right Action: Sign In Button */}
          <div className="flex items-center gap-3">
            <button
              id="nav_check_app_btn"
              onClick={() => user ? onNavigate('dashboard') : onOpenAuth('login')}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold transition-all shadow-md shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Sign in</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="nav_mobile_toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-full border border-slate-200 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mx-4 mt-2 rounded-3xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-150 text-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 font-mono">
            Menu
          </div>

          <button
            onClick={() => scrollToLandingSection('product-showcase')}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-left text-slate-700 hover:bg-slate-100"
          >
            Product
          </button>

          <button
            onClick={() => scrollToLandingSection('how-it-works')}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-left text-slate-700 hover:bg-slate-100"
          >
            How it works
          </button>

          <button
            onClick={() => scrollToLandingSection('pricing')}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-left text-slate-700 hover:bg-slate-100"
          >
            Pricing
          </button>

          <button
            onClick={() => scrollToLandingSection('faq')}
            className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-left text-slate-700 hover:bg-slate-100"
          >
            FAQ
          </button>

          <div className="my-2 border-t border-slate-100"></div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              user ? onNavigate('dashboard') : onOpenAuth('login');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <span>Sign in</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
