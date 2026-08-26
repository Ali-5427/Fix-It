import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  ShieldCheck, 
  Key, 
  Building2, 
  Mail, 
  CreditCard, 
  Check, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Trash2, 
  Lock, 
  Sliders, 
  FileText, 
  Terminal,
  LogOut,
  Smartphone
} from 'lucide-react';
import { store } from '../services/store';
import { authService } from '../services/authService';
import { User } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onOpenAuth: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'api' | 'preferences'>('profile');
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [teamName, setTeamName] = useState(user?.teamName || 'Apex Mobile Labs');
  const [appleTeamId, setAppleTeamId] = useState(user?.appleTeamId || 'APEX892K9L');
  
  // Settings form state
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.settings?.notificationsEnabled ?? true);
  const [autoRecheck, setAutoRecheck] = useState(user?.settings?.autoRecheckOnUpload ?? true);
  const [exportFormat, setExportFormat] = useState<'markdown' | 'pdf'>(user?.settings?.defaultExportFormat || 'markdown');
  
  // Feedback states
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updates = {
      name,
      email,
      teamName,
      appleTeamId: appleTeamId.toUpperCase(),
      settings: {
        ...user.settings,
        notificationsEnabled,
        autoRecheckOnUpload: autoRecheck,
        defaultExportFormat: exportFormat
      }
    };
    store.updateUser(updates);
    try {
      await authService.updateUserProfile(updates);
    } catch (err) {
      console.warn('Could not sync user profile update to Firestore:', err);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSwitchTier = (newTier: 'free' | 'pro' | 'studio') => {
    store.updateUserTier(newTier);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRegenerateKey = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const newApiKey = 'ar_pk_live_' + Math.random().toString(36).substr(2, 12);
      store.updateUserSettings({ apiKey: newApiKey });
      setIsRegenerating(false);
    }, 400);
  };

  const copyToClipboard = (text: string, type: 'key' | 'token') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const currentTier = user.tier || 'pro';
  const apiKey = user.settings?.apiKey || 'ar_pk_live_83921049281';
  const sessionToken = user.token || 'ar_live_sec_9942a188fbc72a';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base leading-tight font-mono">{user.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider ${
                  currentTier === 'studio' 
                    ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                    : currentTier === 'pro' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {currentTier === 'free' ? 'STARTER' : currentTier.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user.email} • Apple Team: <span className="font-mono text-slate-700">{user.appleTeamId || 'APEX892K9L'}</span></p>
            </div>
          </div>

          <button
            id="account_modal_close_btn"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserIcon className="h-3.5 w-3.5" />
            Developer Profile
          </button>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'subscription'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            Plan & Billing
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            API & CI/CD Keys
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Preferences
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {savedSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Settings and credentials updated successfully.</span>
            </div>
          )}

          {/* TAB 1: Profile & Team */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Developer Full Name</label>
                  <div className="relative">
                    <UserIcon className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Email</label>
                  <div className="relative">
                    <Mail className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Studio / Organization</label>
                  <div className="relative">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Apex Mobile Labs"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Apple Developer Team ID
                  </label>
                  <div className="relative">
                    <Key className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={appleTeamId}
                      maxLength={10}
                      onChange={(e) => setAppleTeamId(e.target.value.toUpperCase())}
                      placeholder="APEX892K9L"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-8 pr-3 py-2 text-xs font-mono uppercase text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 flex items-start gap-3">
                <Smartphone className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Apple Developer Verification Context</span>
                  <span>Your Apple Team ID is used during preflight export to automatically populate App Store Connect Reviewer Notes and provisioning profile assertions.</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Subscription & Billing */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-mono">Current Subscription</div>
                  <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                    {currentTier === 'studio' ? 'Studio & Agency Plan' : currentTier === 'pro' ? 'Pro Developer Plan' : 'Starter Free Plan'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {currentTier === 'studio' 
                      ? 'Unlimited deep audits, multi-client workspace, priority guideline rules.'
                      : currentTier === 'pro'
                      ? 'Unlimited .ipa audits, build-to-build diffing, and Rejection Notice solver.'
                      : 'Basic Info.plist & Privacy String inspection.'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-extrabold text-slate-900 font-mono">
                    {currentTier === 'studio' ? '$49' : currentTier === 'pro' ? '$19' : '$0'}
                    <span className="text-xs text-slate-500 font-sans font-normal">/mo</span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Plan Switcher Cards */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-900 uppercase font-mono">Switch or Upgrade Plan</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Starter */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    currentTier === 'free' ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">Starter Indie</span>
                      <span className="font-mono text-xs font-bold text-slate-600">$0</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Basic plist checks & 1 active app profile.</p>
                    <button
                      type="button"
                      disabled={currentTier === 'free'}
                      onClick={() => handleSwitchTier('free')}
                      className={`w-full mt-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        currentTier === 'free'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {currentTier === 'free' ? 'Current Plan' : 'Downgrade to Free'}
                    </button>
                  </div>

                  {/* Pro */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    currentTier === 'pro' ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700 text-xs">Pro Developer</span>
                      <span className="font-mono text-xs font-bold text-slate-900">$19/mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Diff verification, rejection solver, unlimited apps.</p>
                    <button
                      type="button"
                      disabled={currentTier === 'pro'}
                      onClick={() => handleSwitchTier('pro')}
                      className={`w-full mt-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        currentTier === 'pro'
                          ? 'bg-blue-100 text-blue-800 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {currentTier === 'pro' ? 'Current Plan' : 'Switch to Pro'}
                    </button>
                  </div>

                  {/* Studio */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    currentTier === 'studio' ? 'border-purple-600 bg-purple-50/20 ring-1 ring-purple-600' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-700 text-xs">Studio & Agency</span>
                      <span className="font-mono text-xs font-bold text-slate-900">$49/mo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Multi-client isolation & custom rule registry.</p>
                    <button
                      type="button"
                      disabled={currentTier === 'studio'}
                      onClick={() => handleSwitchTier('studio')}
                      className={`w-full mt-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        currentTier === 'studio'
                          ? 'bg-purple-100 text-purple-800 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {currentTier === 'studio' ? 'Current Plan' : 'Switch to Studio'}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* TAB 3: API & CI/CD Keys */}
          {activeTab === 'api' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono mb-1">Xcode & CI/CD Pipeline API Key</h4>
                <p className="text-xs text-slate-500">
                  Authenticate automated preflight audits in GitHub Actions, Bitrise, Xcode Cloud, or Fastlane.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">Publishable API Key</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-800 select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(apiKey, 'key')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateKey}
                    disabled={isRegenerating}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>Regen</span>
                  </button>
                </div>
              </div>

              {/* Fastlane / Curl Example */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">CLI Preflight Inspection Command</label>
                <div className="rounded-xl bg-slate-900 p-3.5 text-[11px] font-mono text-slate-100 overflow-x-auto">
                  <div className="text-slate-400"># Run preflight in your terminal or fastlane lane:</div>
                  <div className="text-emerald-400 mt-1">
                    curl -X POST https://fixit.app/api/uploads/start \
                  </div>
                  <div className="pl-4 text-slate-300">
                    -H &quot;Authorization: Bearer {apiKey}&quot; \
                  </div>
                  <div className="pl-4 text-slate-300">
                    -F &quot;file=@Builds/Release.ipa&quot; \
                  </div>
                  <div className="pl-4 text-slate-300">
                    -F &quot;appId={user.appleTeamId || 'APEX892K9L'}&quot;
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Preferences & Security */}
          {activeTab === 'preferences' && (
            <div className="space-y-5">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">Audit Workflow Preferences</h4>
                
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5">
                  <div>
                    <strong className="text-xs text-slate-900 block">Automatic Recheck on Upload</strong>
                    <span className="text-[11px] text-slate-500">Automatically trigger diff comparison whenever a newer build is uploaded.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoRecheck}
                    onChange={(e) => {
                      setAutoRecheck(e.target.checked);
                      store.updateUserSettings({ autoRecheckOnUpload: e.target.checked });
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5">
                  <div>
                    <strong className="text-xs text-slate-900 block">Guideline Update Notifications</strong>
                    <span className="text-[11px] text-slate-500">Receive alerts when Apple publishes changes to App Store Review Guidelines.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => {
                      setNotificationsEnabled(e.target.checked);
                      store.updateUserSettings({ notificationsEnabled: e.target.checked });
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5">
                  <div>
                    <strong className="text-xs text-slate-900 block">Reviewer Notes Export Format</strong>
                    <span className="text-[11px] text-slate-500">Default format for generating App Store Connect Reviewer Notes.</span>
                  </div>
                  <select
                    value={exportFormat}
                    onChange={(e) => {
                      const fmt = e.target.value as 'markdown' | 'pdf';
                      setExportFormat(fmt);
                      store.updateUserSettings({ defaultExportFormat: fmt });
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="markdown">Markdown (.md)</option>
                    <option value="pdf">Formatted PDF</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-red-600 uppercase font-mono">Data Management</h4>
                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50/30 p-3.5">
                  <div>
                    <strong className="text-xs text-red-900 block">Clear Local Scan Cache</strong>
                    <span className="text-[11px] text-red-700">Clear cached local inspection scans, audit history, and reports.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      store.clearData();
                      setSavedSuccess(true);
                      setTimeout(() => setSavedSuccess(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-300 bg-white hover:bg-red-50 text-red-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono text-[11px]">Session ID: <span className="text-slate-700">{sessionToken.substring(0, 16)}...</span></span>
          <button
            type="button"
            onClick={async () => {
              await authService.signOut();
              onClose();
            }}
            className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
