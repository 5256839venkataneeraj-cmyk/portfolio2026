import React, { useState, useEffect } from 'react';
import { content } from '../content';
import { scrollTo } from '../scroll';
import { Menu, X, ArrowUpRight, Phone, Mail } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HERO', target: '#hero' },
    { name: 'MILESTONES', target: '#milestones' },
    { name: 'ACHIEVEMENTS', target: '#achievements' },
    { name: 'JOURNEY', target: '#trajectory' },
    { name: 'SKILLS', target: '#missions' },
    { name: 'INTERESTS', target: '#interests' },
    { name: 'ROAD AHEAD', target: '#road-ahead' },
    { name: 'CONTACT', target: '#reserve' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    scrollTo(target, -20);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans text-xs ${
        scrolled
          ? 'bg-[#05070B]/85 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-lg border border-cyan-500/40 bg-cyan-950/30 group-hover:border-cyan-400 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-semibold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              {content.name}
            </span>
            <span className="text-[11px] font-sans text-slate-400 tracking-normal">
              {content.location}
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.target}
              onClick={(e) => handleNavClick(e, link.target)}
              className="px-3.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all text-xs font-medium tracking-normal"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Quick CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="#reserve"
            onClick={(e) => handleNavClick(e, '#reserve')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all font-sans font-semibold text-xs tracking-tight group"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070A10]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.target}
                onClick={(e) => handleNavClick(e, link.target)}
                className="px-3 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 text-sm font-medium tracking-normal"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="text-[11px] font-sans text-slate-400">
              {content.location}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <a
                href={`tel:${content.contact.mobile}`}
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 bg-white/5 hover:border-cyan-500/40 text-slate-200"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Call</span>
              </a>
              <a
                href={`mailto:${content.contact.email}`}
                className="flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 bg-white/5 hover:border-cyan-500/40 text-slate-200"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email</span>
              </a>
            </div>
            <a
              href="#reserve"
              onClick={(e) => handleNavClick(e, '#reserve')}
              className="block w-full text-center py-2.5 rounded-lg bg-cyan-500 text-black font-semibold tracking-tight text-xs hover:bg-cyan-400 transition-colors"
            >
              CONTACT
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
