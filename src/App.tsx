import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AuditView } from './components/AuditView';
import { RejectionAnalyzer } from './components/RejectionAnalyzer';
import { MetadataChecker } from './components/MetadataChecker';
import { ScreenshotValidator } from './components/ScreenshotValidator';
import { AdminPanel } from './components/AdminPanel';
import { PrivacySecurityView } from './components/PrivacySecurityView';
import { UploadModal } from './components/UploadModal';
import { FindingDetailModal } from './components/FindingDetailModal';
import { AuditDiffModal } from './components/AuditDiffModal';
import { SubmissionReportModal } from './components/SubmissionReportModal';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { ReviewChecklistModal } from './components/ReviewChecklistModal';
import { PrivacyStringsModal } from './components/PrivacyStringsModal';
import { StatusPageModal } from './components/StatusPageModal';
import { SupportModal } from './components/SupportModal';
import { SiteFooter } from './components/SiteFooter';

import { store } from './services/store';
import { Application, AuditRun, Finding, SubmissionReport, AuditComparison } from './types';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [, setTick] = useState(0);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'audit' | 'rejection' | 'metadata' | 'screenshots' | 'admin' | 'privacy'>(() => {
    return store.getUser() ? 'dashboard' : 'landing';
  });

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick(t => t + 1);
      const currentUser = store.getUser();
      if (!currentUser && currentView === 'dashboard') {
        setCurrentView('landing');
      } else if (currentUser && currentView === 'landing') {
        setCurrentView('dashboard');
      }
    });
    return unsubscribe;
  }, [currentView]);

  const user = store.getUser();
  const isAdminUser = user?.role === 'admin';

  // Guard against non-admin accessing admin view
  useEffect(() => {
    if (currentView === 'admin' && !isAdminUser) {
      setCurrentView('dashboard');
    }
  }, [currentView, isAdminUser]);
  const apps = store.getApps();
  const selectedApp = store.getSelectedApp();
  const activeAudit = store.getActiveAudit();
  const auditsHistory = selectedApp ? store.getAudits(selectedApp.id) : [];

  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authModalTier, setAuthModalTier] = useState<'free' | 'pro' | 'studio'>('pro');
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [activeDiffComparison, setActiveDiffComparison] = useState<AuditComparison | null>(null);
  const [submissionReport, setSubmissionReport] = useState<SubmissionReport | null>(null);

  // Resource, Community, Support & Status Modals
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [privacyStringsModalOpen, setPrivacyStringsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  const handleStartAudit = () => {
    setUploadModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot' = 'login', tier: 'free' | 'pro' | 'studio' = 'pro') => {
    setAuthModalMode(mode);
    setAuthModalTier(tier);
    setAuthModalOpen(true);
  };

  const handleAuditCompleted = (appId: string, auditId: string) => {
    store.selectApp(appId);
    store.setActiveAudit(auditId);
    setCurrentView('audit');
  };

  const handleGenerateReport = (appId?: string) => {
    const targetAppId = appId || selectedApp?.id;
    if (!targetAppId) return;

    const report = store.generateSubmissionReport(targetAppId);
    setSubmissionReport(report);
  };

  // If user is authenticated, render real Dashboard layout with Left Sidebar
  const isAuthenticated = !!user;

  if (isAuthenticated && currentView !== 'landing') {
    return (
      <div className="h-screen overflow-hidden bg-slate-50 flex text-slate-900 selection:bg-blue-600 selection:text-white">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(v) => setCurrentView(v)}
          onOpenUpload={() => setUploadModalOpen(true)}
          onOpenAccount={() => setAccountModalOpen(true)}
          onOpenChecklist={() => setChecklistModalOpen(true)}
          user={user}
          apps={apps}
          selectedApp={selectedApp}
        />

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Top Demo Banner for instant exploration if active */}
          {false && currentView === 'audit' && (
            <div className="bg-blue-50/95 border-b border-blue-200 px-4 py-2 text-xs text-center flex items-center justify-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="text-slate-700">
                Exploring Demo App: <strong className="text-blue-900 font-mono">{selectedApp.name}</strong> ({selectedApp.primaryCategory})
              </span>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="text-blue-600 font-bold hover:underline ml-2 cursor-pointer"
              >
                Upload your own app →
              </button>
            </div>
          )}

          <main className="flex-1 overflow-hidden h-full">
            {currentView === 'dashboard' && (
              <Dashboard
                user={user}
                apps={apps}
                onOpenApp={(appId) => {
                  store.selectApp(appId);
                  setCurrentView('audit');
                }}
                onCheckNewApp={() => setUploadModalOpen(true)}
                onCheckNewVersion={(appId) => {
                  store.selectApp(appId);
                  setUploadModalOpen(true);
                }}
                onNavigate={(view) => setCurrentView(view)}
              />
            )}

            {currentView === 'audit' && (
              <AuditView
                app={selectedApp}
                audit={activeAudit}
                auditsHistory={auditsHistory}
                onSelectFinding={(f) => setSelectedFinding(f)}
                onOpenUpload={() => setUploadModalOpen(true)}
                onGenerateReport={() => handleGenerateReport()}
                onOpenDiff={(comp) => setActiveDiffComparison(comp)}
              />
            )}

            {currentView === 'rejection' && (
              <RejectionAnalyzer />
            )}

            {currentView === 'metadata' && (
              <MetadataChecker />
            )}

            {currentView === 'screenshots' && (
              <ScreenshotValidator />
            )}

            {currentView === 'admin' && isAdminUser && (
              <AdminPanel />
            )}

            {currentView === 'privacy' && (
              <PrivacySecurityView />
            )}
          </main>


        </div>

        {/* Modals */}
        <UploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onAuditCompleted={handleAuditCompleted}
        />

        <FindingDetailModal
          finding={selectedFinding}
          appId={selectedApp?.id || ''}
          auditId={activeAudit?.id || ''}
          currentBuild={selectedApp?.currentBuild || '1'}
          onClose={() => setSelectedFinding(null)}
        />

        <AuditDiffModal
          comparison={activeDiffComparison}
          appName={selectedApp?.name || 'Application'}
          onClose={() => setActiveDiffComparison(null)}
        />

        <SubmissionReportModal
          report={submissionReport}
          onClose={() => setSubmissionReport(null)}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
          initialTier={authModalTier}
          onSuccess={() => setCurrentView('dashboard')}
        />

        <AccountModal
          isOpen={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
          user={user}
          onOpenAuth={() => handleOpenAuth('login')}
        />

        <ReviewChecklistModal
          isOpen={checklistModalOpen}
          onClose={() => setChecklistModalOpen(false)}
        />

        <PrivacyStringsModal
          isOpen={privacyStringsModalOpen}
          onClose={() => setPrivacyStringsModalOpen(false)}
        />

        <StatusPageModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
        />

        <SupportModal
          isOpen={supportModalOpen}
          onClose={() => setSupportModalOpen(false)}
        />
      </div>
    );
  }

  // Public Landing Page view for non-authenticated or explicitly landing view
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Primary Technical Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        onOpenUpload={() => setUploadModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenAccount={() => setAccountModalOpen(true)}
        user={user}
        selectedApp={selectedApp}
        apps={apps}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <LandingPage
          onStartAudit={handleStartAudit}
          onExploreDemo={handleStartAudit}
          onOpenRejectionAnalyzer={() => setCurrentView('rejection')}
          onOpenAuth={handleOpenAuth}
          onOpenChecklist={() => setChecklistModalOpen(true)}
          onOpenPrivacyStrings={() => setPrivacyStringsModalOpen(true)}
          onOpenStatus={() => setStatusModalOpen(true)}
          onOpenSupport={() => setSupportModalOpen(true)}
        />
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onAuditCompleted={handleAuditCompleted}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        initialTier={authModalTier}
        onSuccess={() => setCurrentView('dashboard')}
      />

      <AccountModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        user={user}
        onOpenAuth={() => handleOpenAuth('login')}
      />

      <ReviewChecklistModal
        isOpen={checklistModalOpen}
        onClose={() => setChecklistModalOpen(false)}
      />

      <PrivacyStringsModal
        isOpen={privacyStringsModalOpen}
        onClose={() => setPrivacyStringsModalOpen(false)}
      />

      <StatusPageModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />

      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  );
}
