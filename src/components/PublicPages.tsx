import React from 'react';
import { siteConfig } from '../config/site';

type LegalPage = 'privacy' | 'terms' | 'dpa' | 'cookies' | 'refunds';

const pageContent: Record<LegalPage, { title: string; sections: Array<[string, string]> }> = {
  privacy: { title: 'Privacy Policy', sections: [['Information we process', 'We process account details and the application data you submit to provide preflight checks. Do not upload information you are not authorized to share.'], ['How we use data', 'We use submitted data solely to operate, secure, support, and improve the service. Analytics are optional and require your consent.'], ['Retention and deletion', 'Retention periods and deletion procedures must be published here before production launch.'] ] },
  terms: { title: 'Terms of Service', sections: [['Service scope', 'Fix It provides automated App Store preflight guidance. It does not guarantee approval by Apple or replace professional legal advice.'], ['Account responsibilities', 'You are responsible for safeguarding your account and ensuring you have the right to submit each artifact and its contents.'], ['Acceptable use', 'Do not use the service to upload malicious files, violate law, or interfere with other users.']] },
  dpa: { title: 'Data Processing Addendum', sections: [['Roles', 'The parties’ controller and processor roles, instructions, and processing purposes must be completed for your business before launch.'], ['Security measures', 'Document encryption, access controls, incident response, subprocessors, and data-location commitments here.'], ['International transfers', 'Add the applicable transfer mechanism and regional addendum before serving customers in regulated jurisdictions.']] },
  cookies: { title: 'Cookie Policy', sections: [['Essential storage', 'We use essential browser storage to keep the application functional and remember your selected preferences.'], ['Optional analytics', 'Optional analytics are disabled until you accept them through the consent control.'], ['Managing choices', 'You can clear browser storage or change consent through the privacy controls once they are connected to your account settings.']] },
  refunds: { title: 'Refund and Cancellation Policy', sections: [['Cancellation', 'Subscription cancellation mechanics, effective date, and access end date must be published before payments are enabled.'], ['Refunds', 'State eligibility, request process, processing timeline, and regional consumer-law rights here.'], ['Contact', 'Use the support contact below for billing questions.']] }
};

export const LegalPageView: React.FC<{ page: LegalPage }> = ({ page }) => {
  const content = pageContent[page];
  return <PublicLayout title={content.title}><p className="text-sm text-amber-800">This document requires legal review and completion before production launch.</p>{content.sections.map(([heading, body]) => <section key={heading}><h2 className="text-lg font-bold text-slate-900">{heading}</h2><p className="mt-2 text-sm leading-7 text-slate-700">{body}</p></section>)}</PublicLayout>;
};

export const NotFoundPage: React.FC = () => <PublicLayout title="Page not found"><p className="text-sm text-slate-600">The page you requested does not exist.</p><a href="/" className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Go to homepage</a></PublicLayout>;

const PublicLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <main className="mx-auto min-h-screen max-w-5xl px-6 py-10 sm:py-16">
    <header className="flex flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <a href="/" className="font-mono text-sm font-bold text-blue-700">Fix It</a>
        <h1 className="mt-5 text-3xl font-bold text-slate-950">{title}</h1>
      </div>
      <nav aria-label="Legal pages" className="flex flex-col items-start gap-1 text-xs font-semibold text-slate-600 sm:items-end">
        <a className="hover:text-blue-700" href="/privacy">Privacy</a>
        <a className="hover:text-blue-700" href="/terms">Terms</a>
        <a className="hover:text-blue-700" href="/dpa">DPA</a>
        <a className="hover:text-blue-700" href="/cookies">Cookies</a>
        <a className="hover:text-blue-700" href="/refunds">Refunds</a>
      </nav>
    </header>
    <div className="mt-8 max-w-3xl space-y-7">{children}</div>
    <footer className="mt-16 border-t pt-6 text-xs text-slate-500">{siteConfig.supportEmail ? <>Questions: <a className="underline" href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a></> : 'Support contact is not configured.'}</footer>
  </main>
);
