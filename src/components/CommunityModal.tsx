import React, { useState } from 'react';
import { 
  Globe, 
  Twitter, 
  Github, 
  MessageSquare, 
  Users, 
  ExternalLink, 
  X, 
  Copy, 
  Check, 
  Sparkles,
  ShieldCheck,
  Code2,
  BookOpen
} from 'lucide-react';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'twitter' | 'github' | 'discord' | 'forum';
}

export const CommunityModal: React.FC<CommunityModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'twitter'
}) => {
  const [activeTab, setActiveTab] = useState<'twitter' | 'github' | 'discord' | 'forum'>(initialTab);
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                Developer Community & Ecosystem
              </h2>
              <p className="text-xs text-slate-600">
                Join 4,800+ iOS developers sharing real App Store Review solutions.
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

        {/* Tab Navigation */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'twitter', label: 'Twitter / X', icon: Twitter, badge: 'Daily Tips' },
            { id: 'github', label: 'GitHub Open Source', icon: Github, badge: 'CLI & Rules' },
            { id: 'discord', label: 'Discord Community', icon: MessageSquare, badge: '4.8k Online' },
            { id: 'forum', label: 'iOS Dev Forum', icon: BookOpen, badge: 'Weekly AMAs' }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'twitter' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-sky-400" />
                    <span className="font-bold text-sm">@FixItPreflight</span>
                    <span className="text-xs text-slate-400 font-mono">Official Feed</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Daily breakdowns of surprise App Store rejections, guideline revisions, and sample resolution letters.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('twitter', 'https://twitter.com/FixItPreflight')}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copied === 'twitter' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied === 'twitter' ? 'Copied Link!' : 'Follow on X'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Recent Community Posts</h4>
                
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Apple Resolution Center Insight: Guideline 5.1.2</span>
                    <span className="text-slate-400 font-mono text-[11px]">2h ago</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "PSA: If you upgraded to Firebase Analytics 10.x, remember to declare NSPrivacyAccessedAPITypeUserDefaults in your root target or review will flag missing reason declarations."
                  </p>
                  <div className="text-[11px] text-blue-600 font-mono">#iOSDev #AppStore #Swift</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Sign in with Apple Guideline 4.8 Checklist</span>
                    <span className="text-slate-400 font-mono text-[11px]">1d ago</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "When offering Google/Apple Sign-in side-by-side, button heights and touch surfaces must be equal. Reviewers will measure subview frames on iPad."
                  </p>
                  <div className="text-[11px] text-blue-600 font-mono">#SwiftUI #AppReview</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-white" />
                    <span className="font-bold text-sm">fixit-preflight / cli & rules</span>
                    <span className="text-xs text-emerald-400 font-mono">MIT Licensed</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Community-maintained Apple guideline AST parser and local pre-commit hooks for Xcode projects.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('github', 'https://github.com/fixit-preflight/cli')}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copied === 'github' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied === 'github' ? 'Copied Repo' : 'Star on GitHub'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">CLI & CI/CD Integration</h4>
                
                <div className="bg-slate-950 text-slate-200 p-3.5 rounded-xl font-mono text-xs space-y-2">
                  <p className="text-slate-400">// Run local preflight scan in Fastlane or GitHub Actions:</p>
                  <div className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800">
                    <code className="text-emerald-400">npx fixit-preflight scan ./build/App.ipa</code>
                    <button 
                      onClick={() => handleCopy('npm', 'npx fixit-preflight scan ./build/App.ipa')}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copied === 'npm' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-blue-600" />
                    Open Source Rule Contributions
                  </div>
                  <p>
                    Found a new rejection pattern? Submit a PR with test fixtures to our open rule definitions in <code>/rules</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discord' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-900 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-indigo-300" />
                    <span className="font-bold text-sm">iOS Reviewers Discord</span>
                    <span className="text-xs text-indigo-300 font-mono">4,820 Members</span>
                  </div>
                  <p className="text-xs text-indigo-200 mt-1">
                    Live peer review, urgent rejection triage, and Apple Resolution Center advice hotline.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('discord', 'https://discord.gg/fixit-preflight')}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copied === 'discord' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied === 'discord' ? 'Copied Invite!' : 'Join Discord Server'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { channel: '#rejection-hotline', desc: 'Get fast feedback on Apple Resolution Center messages.' },
                  { channel: '#privacy-manifests', desc: 'Required Reason API codes and third-party SDK signatures.' },
                  { channel: '#storekit-paywalls', desc: 'Subscription pricing disclosures and EULA compliance.' },
                  { channel: '#indie-ship-room', desc: 'Share your App Store approved launches with the community.' }
                ].map(c => (
                  <div key={c.channel} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                    <div className="font-mono text-xs font-bold text-blue-600">{c.channel}</div>
                    <div className="text-xs text-slate-600">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'forum' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-amber-400" />
                    <span className="font-bold text-sm">iOS Developer Knowledge Forum</span>
                    <span className="text-xs text-amber-300 font-mono">Curated Guidelines</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Deep dive discussions, appeal strategies that won on review board appeals, and Xcode build settings.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy('forum', 'https://developer.apple.com/forums')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copied === 'forum' ? <Check className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                  <span>{copied === 'forum' ? 'Copied URL!' : 'Open Forums'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    title: 'How we appealed Guideline 3.1.1 (Reader App vs Digital Unlock) and got approved in 48h',
                    author: 'Marcus K.',
                    replies: '34 replies',
                    tag: 'In-App Purchases'
                  },
                  {
                    title: 'Common pitfalls when submitting WatchOS companion extensions with background HealthKit',
                    author: 'Elena S.',
                    replies: '19 replies',
                    tag: 'WatchOS / Health'
                  },
                  {
                    title: 'Xcode 16 PrivacyInfo.xcprivacy bundling best practices for multi-module SPM projects',
                    author: 'Devon T.',
                    replies: '48 replies',
                    tag: 'Privacy Manifests'
                  }
                ].map((thread, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{thread.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>By {thread.author}</span>
                        <span>•</span>
                        <span className="font-mono">{thread.replies}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold shrink-0">
                      {thread.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <span>Community guidelines adhere to the Apple Developer Code of Conduct.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
