import React from 'react';
import { siteConfig } from '../config/site';

export const SiteFooter: React.FC = () => <footer className="border-t border-slate-200 bg-white px-6 py-8 text-xs text-slate-600"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"><span>© {new Date().getFullYear()} Fix It</span><nav aria-label="Legal"><div className="flex flex-wrap gap-x-4 gap-y-2"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/dpa">DPA</a><a href="/cookies">Cookies</a><a href="/refunds">Refunds</a>{siteConfig.supportEmail && <a href={`mailto:${siteConfig.supportEmail}`}>Support</a>}</div></nav></div></footer>;
