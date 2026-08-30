import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InteractiveScanner } from './components/InteractiveScanner';
import { EvidenceEngineShowcase } from './components/EvidenceEngineShowcase';
import { FinancialRiskCalculator } from './components/FinancialRiskCalculator';
import { HowItWorks } from './components/HowItWorks';
import { BanGraveyard } from './components/BanGraveyard';
import { ComparisonTable } from './components/ComparisonTable';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AuditExportModal } from './components/AuditExportModal';
import { mockAudits } from './data/mockAudits';
import { AuditReport } from './types';

export default function App() {
  const [selectedReportKey, setSelectedReportKey] = useState<string>('aura-fitness-ios');
  const [exportModalReport, setExportModalReport] = useState<AuditReport | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenScan = () => {
    scrollToSection('scanner');
  };

  const handleSelectPreset = (presetKey: string) => {
    setSelectedReportKey(presetKey);
    scrollToSection('scanner');
  };

  const handleStartCustomScan = (type: 'code' | 'url', payload: string) => {
    if (type === 'url') {
      if (payload.includes('google') || payload.includes('play.google')) {
        setSelectedReportKey('snipsnap-ai-android');
      } else {
        setSelectedReportKey('aura-fitness-ios');
      }
    } else {
      setSelectedReportKey('aura-fitness-ios');
    }
    scrollToSection('scanner');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Clean Light Header */}
      <Header 
        onNavigate={scrollToSection} 
        onOpenScan={handleOpenScan} 
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero with Instant Value & Action Bar */}
        <Hero 
          onSelectPreset={handleSelectPreset}
          onStartCustomScan={handleStartCustomScan}
        />

        {/* 2. Interactive Compliance Scanner & Audit Report Sandbox */}
        <InteractiveScanner 
          currentReportKey={selectedReportKey}
          onReportChange={setSelectedReportKey}
          onOpenExportModal={(rep) => setExportModalReport(rep)}
        />

        {/* 3. The Evidence Engine Showcase (Real Ban Rants & Proof) */}
        <EvidenceEngineShowcase />

        {/* 4. Interactive Financial Loss Forecaster */}
        <FinancialRiskCalculator 
          onOpenScan={handleOpenScan}
        />

        {/* 5. 3-Step How It Works Pipeline */}
        <HowItWorks 
          onOpenScan={handleOpenScan}
        />

        {/* 6. Historical Ban Graveyard & Store Purge Archive */}
        <BanGraveyard 
          onOpenScan={handleOpenScan}
        />

        {/* 7. Comparison Table: Manual vs Lawyers vs StoreGuard */}
        <ComparisonTable 
          onOpenScan={handleOpenScan}
        />

        {/* 8. Indie Hacker Pricing Plans & Guarantees */}
        <PricingSection 
          onOpenScan={handleOpenScan}
        />

        {/* 9. Developer FAQ */}
        <FAQSection />
      </main>

      {/* Clean Footer */}
      <Footer 
        onNavigate={scrollToSection}
        onOpenScan={handleOpenScan}
      />

      {/* Export / Certificate Modal */}
      {exportModalReport && (
        <AuditExportModal 
          report={exportModalReport}
          isOpen={true}
          onClose={() => setExportModalReport(null)}
        />
      )}
    </div>
  );
}
