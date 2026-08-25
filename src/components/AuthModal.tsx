import React, { useState, useEffect } from 'react';
import { 
  X, 
  User as UserIcon, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Github, 
  Key, 
  Smartphone,
  Copy,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { apiClient } from '../services/api';
import { store } from '../services/store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
  initialTier?: 'free' | 'pro' | 'studio';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  initialTier = 'pro',
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [tier, setTier] = useState<'free' | 'pro' | 'studio'>(initialTier);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [appleTeamId, setAppleTeamId] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setTier(initialTier);
      setErrorMsg(null);
      setMsg(null);
    }
  }, [isOpen, initialMode, initialTier]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const loginEmail = email || 'jmohammadali5427@gmail.com';
        const res = await apiClient.login(loginEmail, password || 'password123');
        store.setUser(res.user);
        if (onSuccess) onSuccess();
        onClose();
      } else if (mode === 'register') {
        const regEmail = email || 'developer@example.com';
        const regName = name || (email ? email.split('@')[0] : 'iOS Developer');
        const res = await apiClient.register(regEmail, regName, tier, appleTeamId || 'DEV' + Math.random().toString(36).substring(2, 8).toUpperCase(), teamName || 'Indie Studio');
        store.setUser(res.user);
        if (onSuccess) onSuccess();
        onClose();
      } else if (mode === 'forgot') {
        const res = await apiClient.resetPassword(email || 'developer@example.com');
        setMsg(res.message || 'Password reset link sent to your email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (persona: 'lead' | 'indie' | 'agency' | 'admin') => {
    let personaUser;
    switch (persona) {
      case 'lead':
        personaUser = {
          id: 'user_dev_01',
          email: 'jmohammadali5427@gmail.com',
          name: 'Lead iOS Engineer',
          role: 'developer' as const,
          tier: 'pro' as const,
          teamName: 'Apex Mobile Labs',
          appleTeamId: 'APEX892K9L',
          token: 'ar_live_sec_9942a188fbc72a',
          createdAt: new Date().toISOString(),
          settings: {
            notificationsEnabled: true,
            autoRecheckOnUpload: true,
            defaultExportFormat: 'markdown' as const,
            apiKey: 'ar_pk_live_83921049281'
          }
        };
        break;
      case 'indie':
        personaUser = {
          id: 'user_indie_02',
          email: 'indie.swift@builds.dev',
          name: 'Indie Solo Creator',
          role: 'developer' as const,
          tier: 'free' as const,
          teamName: 'Indie Swift Apps',
          appleTeamId: 'IND8472910',
          token: 'ar_live_sec_11029384756',
          createdAt: new Date().toISOString(),
          settings: {
            notificationsEnabled: true,
            autoRecheckOnUpload: true,
            defaultExportFormat: 'markdown' as const
          }
        };
        break;
      case 'agency':
        personaUser = {
          id: 'user_agency_03',
          email: 'agency.lead@hypermobile.io',
          name: 'Mobile Studio Director',
          role: 'developer' as const,
          tier: 'studio' as const,
          teamName: 'HyperMobile Agency Group',
          appleTeamId: 'HYPER839201',
          token: 'ar_live_sec_88371920394',
          createdAt: new Date().toISOString(),
          settings: {
            notificationsEnabled: true,
            autoRecheckOnUpload: true,
            defaultExportFormat: 'pdf' as const,
            apiKey: 'ar_pk_agency_5548291029'
          }
        };
        break;
      case 'admin':
        personaUser = {
          id: 'user_admin_01',
          email: 'admin@fixit.internal',
          name: 'Compliance Administrator',
          role: 'admin' as const,
          tier: 'studio' as const,
          teamName: 'Fix It Internal Core',
          appleTeamId: 'ARCORP001X',
          token: 'ar_live_adm_449102847a9e',
          createdAt: new Date().toISOString(),
          settings: {
            notificationsEnabled: true,
            autoRecheckOnUpload: true,
            defaultExportFormat: 'pdf' as const,
            apiKey: 'ar_pk_adm_99182736451'
          }
        };
        break;
    }

    store.setUser(personaUser);
    if (onSuccess) onSuccess();
    onClose();
  };

  const handleSocialAuth = (provider: 'apple' | 'github' | 'google') => {
    setIsLoading(true);
    setTimeout(() => {
      const providerUser = {
        id: `user_${provider}_${Date.now()}`,
        email: `developer@${provider === 'apple' ? 'icloud.com' : provider === 'github' ? 'github.com' : 'gmail.com'}`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Developer`,
        role: 'developer' as const,
        tier: tier || 'pro',
        teamName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Studio`,
        appleTeamId: provider === 'apple' ? 'APL992810' : 'EXT392019',
        token: `ar_${provider}_sec_${Math.random().toString(36).substr(2, 10)}`,
        createdAt: new Date().toISOString(),
        settings: {
          notificationsEnabled: true,
          autoRecheckOnUpload: true,
          defaultExportFormat: 'markdown' as const,
          apiKey: `ar_pk_${provider}_${Math.random().toString(36).substr(2, 8)}`
        }
      };
      store.setUser(providerUser);
      setIsLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 400);
  };

  const copySimulatedResetLink = () => {
    navigator.clipboard.writeText('https://fixit.app/auth/reset?token=rst_demo9942a188fbc7');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden p-6 space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight font-mono">
                {mode === 'login' ? 'Sign In to Fix It' : mode === 'register' ? 'Create Developer Account' : 'Reset Password'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {mode === 'login' ? 'Access your App Store preflight audits' : mode === 'register' ? 'Inspect iOS binaries and resolve App Review risks' : 'We will send one-time recovery instructions'}
              </p>
            </div>
          </div>
          <button
            id="auth_modal_close_btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Sandbox Persona Switcher */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-600">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" />
              1-Click Demo Sandbox Profiles:
            </span>
            <span className="text-[10px] text-blue-600 font-semibold uppercase">No password required</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              id="auth_quick_lead"
              onClick={() => handleQuickLogin('lead')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-blue-50 text-blue-700 font-mono text-[11px] font-bold border border-slate-200 shadow-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Lead iOS Dev</span>
              <span className="rounded bg-blue-100 px-1 py-0.2 text-[9px] text-blue-800">PRO</span>
            </button>

            <button
              type="button"
              id="auth_quick_indie"
              onClick={() => handleQuickLogin('indie')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200 shadow-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Solo Indie</span>
              <span className="rounded bg-slate-100 px-1 py-0.2 text-[9px] text-slate-700">FREE</span>
            </button>

            <button
              type="button"
              id="auth_quick_agency"
              onClick={() => handleQuickLogin('agency')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-purple-50 text-purple-700 font-mono text-[11px] font-bold border border-slate-200 shadow-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Agency Studio</span>
              <span className="rounded bg-purple-100 px-1 py-0.2 text-[9px] text-purple-800">STUDIO</span>
            </button>

            <button
              type="button"
              id="auth_quick_admin"
              onClick={() => handleQuickLogin('admin')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold border border-slate-200 shadow-xs flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Review Admin</span>
              <span className="rounded bg-indigo-100 px-1 py-0.2 text-[9px] text-indigo-800">ADMIN</span>
            </button>
          </div>
        </div>

        {/* Social Fast Logins */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSocialAuth('apple')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2 px-2 text-xs font-semibold text-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Smartphone className="h-3.5 w-3.5 text-slate-900" />
              <span>Apple ID</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('github')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2 px-2 text-xs font-semibold text-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Github className="h-3.5 w-3.5 text-slate-900" />
              <span>GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialAuth('google')}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-2 px-2 text-xs font-semibold text-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5 text-red-500" />
              <span>Google</span>
            </button>
          </div>

          <div className="flex items-center gap-2 py-1">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">or with developer email</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Plan Selector when in Register mode */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Tier Plan</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTier('free')}
                  className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    tier === 'free'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold">Starter</div>
                  <div className="text-[10px] text-slate-500 font-mono">$0/mo</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('pro')}
                  className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer relative ${
                    tier === 'pro'
                      ? 'border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-blue-700">Pro Indie</div>
                  <div className="text-[10px] text-slate-500 font-mono">$19/mo</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('studio')}
                  className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    tier === 'studio'
                      ? 'border-purple-600 bg-purple-50/50 text-purple-900 ring-1 ring-purple-600'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-purple-700">Studio</div>
                  <div className="text-[10px] text-slate-500 font-mono">$49/mo</div>
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Steve Wozniak"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Team / Org (Optional)</label>
                <div className="relative">
                  <Building2 className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Apex Mobile LLC"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Developer Email</label>
            <div className="relative">
              <Mail className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-blue-600 hover:underline text-[11px] font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Apple Developer Team ID <span className="text-slate-400 font-normal">(Optional, e.g. 10-char alphanumeric)</span>
              </label>
              <div className="relative">
                <Key className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={appleTeamId}
                  onChange={(e) => setAppleTeamId(e.target.value.toUpperCase())}
                  maxLength={10}
                  placeholder="APEX892K9L"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 uppercase font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                />
                <span>Remember this developer session</span>
              </label>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {msg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2 animate-in fade-in">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{msg}</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Use the simulated reset link below for instant sandbox testing:</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white/80 border border-emerald-300 rounded-lg p-2 text-[11px] font-mono text-emerald-900">
                <span className="truncate">https://fixit.app/auth/reset?token=rst_demo9942a188fbc7</span>
                <button
                  type="button"
                  onClick={copySimulatedResetLink}
                  className="px-2 py-1 rounded bg-emerald-600 text-white font-sans text-[10px] font-bold shrink-0 hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all font-mono cursor-pointer"
          >
            <span>{isLoading ? 'Authenticating...' : mode === 'login' ? 'Sign In & Enter Console' : mode === 'register' ? 'Create Account & Start Audit' : 'Send Instructions'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="pt-3 border-t border-slate-200 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => setMode('register')} 
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Sign up free
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => setMode('login')} 
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

