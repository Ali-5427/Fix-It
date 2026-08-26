import React, { useState } from 'react';
import { 
  CheckSquare, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  X, 
  ExternalLink, 
  Filter, 
  AlertCircle, 
  Sparkles,
  Info
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'AUTH' | 'PRIVACY' | 'IAP' | 'UGC' | 'METADATA' | 'COMPLETENESS';
  title: string;
  guideline: string;
  description: string;
  recommendation: string;
  critical: boolean;
}

const CHECKLIST_DATA: ChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'PRIVACY',
    title: 'PrivacyInfo.xcprivacy Included for Required Reason APIs',
    guideline: 'Guideline 5.1.2',
    description: 'If you or any bundled SDK use File Timestamps, Disk Space, System Boot Time, or User Defaults, they must be declared with valid Apple reason codes.',
    recommendation: 'Ensure PrivacyInfo.xcprivacy is bundled in the app target and third-party frameworks.',
    critical: true
  },
  {
    id: 'chk-2',
    category: 'AUTH',
    title: 'Sign in with Apple Paired with Social Logins',
    guideline: 'Guideline 4.8',
    description: 'If you offer Google, Facebook, Twitter, or other social login providers, Sign in with Apple must be offered as an equivalent option.',
    recommendation: 'Place Sign in with Apple alongside or above third-party sign-in buttons with identical prominence.',
    critical: true
  },
  {
    id: 'chk-3',
    category: 'AUTH',
    title: 'In-App Account Deletion with Immediate Data Purge',
    guideline: 'Guideline 5.1.1(v)',
    description: 'Apps allowing account creation must allow users to initiate permanent account deletion directly within the app settings.',
    recommendation: 'Add a clear "Delete Account" button in account settings that does not just redirect to a general email or website.',
    critical: true
  },
  {
    id: 'chk-4',
    category: 'PRIVACY',
    title: 'Explicit Purpose Strings in Info.plist (No Generic Text)',
    guideline: 'Guideline 5.1.1',
    description: 'All NSCameraUsageDescription, NSPhotoLibraryUsageDescription, etc. must explain specifically WHY your app needs access and HOW it is used.',
    recommendation: 'Reject strings like "App needs camera access". Use "Scan food barcodes to log meals in your daily diary".',
    critical: true
  },
  {
    id: 'chk-5',
    category: 'PRIVACY',
    title: 'App Transport Security (ATS) Arbitrary Loads Disabled',
    guideline: 'Guideline 5.1.1 / Security',
    description: 'NSAllowsArbitraryLoads must not be set to YES without documented technical justification to App Review.',
    recommendation: 'Serve all network endpoints over modern HTTPS / TLS 1.3 or use domain-specific exceptions.',
    critical: true
  },
  {
    id: 'chk-6',
    category: 'IAP',
    title: 'Working "Restore Purchases" Button on Paywall',
    guideline: 'Guideline 3.1.2',
    description: 'All apps offering auto-renewable subscriptions or non-consumable IAP must provide a functioning Restore Purchases control.',
    recommendation: 'Ensure the Restore button is easily visible on paywalls and in the app settings screen.',
    critical: true
  },
  {
    id: 'chk-7',
    category: 'IAP',
    title: 'Terms of Use (EULA) and Privacy Policy Links on Paywall',
    guideline: 'Guideline 3.1.2 / 5.1.1',
    description: 'Subscription purchase screens must clearly link to active, working Terms of Use (Apple Standard EULA or custom) and Privacy Policy.',
    recommendation: 'Include direct tappable links in the paywall footer before the purchase confirmation CTA.',
    critical: true
  },
  {
    id: 'chk-8',
    category: 'UGC',
    title: 'User-Generated Content (UGC) Moderation & Block Mechanism',
    guideline: 'Guideline 1.2',
    description: 'Apps with public user posts, chats, or forums must provide post reporting, user blocking, and swift moderation action within 24h.',
    recommendation: 'Implement a 3-dot menu with "Report Content" and "Block User" options on all user-submitted items.',
    critical: true
  },
  {
    id: 'chk-9',
    category: 'COMPLETENESS',
    title: 'Demo / Reviewer Credentials Provided in App Store Connect',
    guideline: 'Guideline 2.1',
    description: 'If any part of the app requires logging in or subscription access, provide working test login credentials in the App Review Notes.',
    recommendation: 'Set up a dedicated test account with pre-seeded data for the App Reviewer team.',
    critical: true
  },
  {
    id: 'chk-10',
    category: 'METADATA',
    title: 'App Store Metadata Free of Competitor Trademarks & Placeholder Text',
    guideline: 'Guideline 2.3',
    description: 'App title (<= 30 chars), subtitle (<= 30 chars), and description must not mention Android, Google Play, or contain "Test / Beta / WIP".',
    recommendation: 'Scan all copy for banned terms and verify support URLs resolve to active HTTPS webpages.',
    critical: false
  },
  {
    id: 'chk-11',
    category: 'METADATA',
    title: 'Accurate Device Resolution Screenshots (No Alpha / Broken Borders)',
    guideline: 'Guideline 2.3.3',
    description: 'Screenshots must match Apple resolution specs (e.g. 1290x2796 for 6.7" iPhone) without alpha transparency channels.',
    recommendation: 'Ensure PNG/JPEG files are 24-bit RGB without an alpha channel to prevent App Store Connect upload rejection.',
    critical: false
  },
  {
    id: 'chk-12',
    category: 'COMPLETENESS',
    title: 'IPv6 Network Compatibility & Zero Crashes on First Launch',
    guideline: 'Guideline 2.1',
    description: 'App must function properly in standard IPv6-only network environments used by Apple review test devices.',
    recommendation: 'Test on iOS IPv6 NAT64 Wi-Fi hotspot before uploading binary.',
    critical: true
  }
];

interface ReviewChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewChecklistModal: React.FC<ReviewChecklistModalProps> = ({ isOpen, onClose }) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setCheckedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredItems = selectedCategory === 'ALL' 
    ? CHECKLIST_DATA 
    : CHECKLIST_DATA.filter(item => item.category === selectedCategory);

  const completedCount = Object.values(checkedIds).filter(Boolean).length;
  const totalCount = CHECKLIST_DATA.length;
  const percent = Math.round((completedCount / totalCount) * 100);

  const handleCopyMarkdown = () => {
    const lines = [
      '# App Store Submission Preflight Checklist (Fixit)',
      `Progress: ${completedCount}/${totalCount} (${percent}%)\n`
    ];

    CHECKLIST_DATA.forEach(item => {
      const isChecked = checkedIds[item.id] ? '[x]' : '[ ]';
      lines.push(`- ${isChecked} **${item.title}** (${item.guideline})`);
      lines.push(`  * Recommendation: ${item.recommendation}`);
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                App Store Review Checklist
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  2026 Edition
                </span>
              </h2>
              <p className="text-xs text-slate-600">
                Interactive pre-submission verification based on published Apple App Store Guidelines.
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress & Category Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="text-xs font-semibold text-slate-700 whitespace-nowrap">
              Ready Score: <span className="font-mono text-blue-600 font-bold">{completedCount}/{totalCount}</span> ({percent}%)
            </div>
            <div className="w-36 sm:w-44 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
              {['ALL', 'PRIVACY', 'AUTH', 'IAP', 'UGC', 'METADATA'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span>{copied ? 'Copied Markdown!' : 'Copy Checklist'}</span>
            </button>
          </div>
        </div>

        {/* Checklist Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredItems.map(item => {
            const isChecked = !!checkedIds[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                  isChecked 
                    ? 'bg-emerald-50/50 border-emerald-200/90 shadow-2xs' 
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                  isChecked 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                    : 'border-slate-300 bg-slate-50'
                }`}>
                  {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-600 font-semibold">
                      {item.guideline}
                    </span>
                    {item.critical && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
                        BLOCKER
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-700 bg-slate-100/70 px-2.5 py-1 rounded-md border border-slate-200/60 w-fit">
                    <span className="text-blue-600 font-bold">Fix:</span>
                    <span>{item.recommendation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Updated weekly against Apple Resolution Center rejection patterns.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
