import React from 'react';
import { content } from '../content';
import { scrollTo } from '../scroll';
import { ArrowUp, Linkedin, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#030508] border-t border-white/10 font-sans text-xs text-slate-500 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="gsap-reveal max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Resume details */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="font-display font-semibold text-white tracking-tight text-sm">
              {content.name}
            </span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="text-xs text-slate-400 font-sans">
            {content.fullName}
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="text-[11px] text-slate-500 font-sans">
            {content.location}
          </span>
        </div>

        {/* Socials & Back to top button */}
        <div className="flex items-center gap-2.5">
          <a
            href={content.contact.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg border border-white/10 hover:border-blue-500/40 text-slate-400 hover:text-blue-300 transition-colors bg-white/5"
            aria-label="LinkedIn"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href={content.contact.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg border border-white/10 hover:border-pink-500/40 text-slate-400 hover:text-pink-300 transition-colors bg-white/5"
            aria-label="Instagram"
            title={`Instagram @${content.contact.instagram}`}
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition-colors bg-white/5 cursor-pointer ml-1"
            aria-label="Return to top of page"
          >
            <span className="text-[10px] font-mono tracking-wider uppercase">BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-slate-500">
        <div>
          © {new Date().getFullYear()} {content.fullName} • {content.location}
        </div>
        <div className="flex items-center gap-3">
          <span>{content.experience.institution}</span>
          <span>•</span>
          <span>{content.contact.email}</span>
        </div>
      </div>
    </footer>
  );
};
