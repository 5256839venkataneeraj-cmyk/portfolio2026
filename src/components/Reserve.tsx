import React, { useState, useRef } from 'react';
import { content } from '../content';
import { PetalField } from './petals/PetalField';
import {
  Phone,
  Mail,
  Linkedin,
  Instagram,
  MapPin,
  Send,
  CheckCircle,
  Copy,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const Reserve: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section
      id="reserve"
      ref={sectionRef}
      className="relative w-full h-[300vh] bg-[#05070a] border-t border-white/10"
    >
      {/* ── Sticky 100vh Viewport Stage ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-10">
        
        {/* Scroll-driven red & white petal animation as absolute background layer */}
        <PetalField sectionRef={sectionRef} />

        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 my-auto overflow-y-auto max-h-[calc(100vh-3rem)] py-2">
          
          {/* Section Header */}
          <div className="gsap-reveal text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 backdrop-blur-md text-cyan-300 font-mono text-xs tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span>CONTACT INFORMATION</span>
            </div>
            <h2 className="font-display text-[clamp(2.2rem,6vw,4.2rem)] font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(180,20,40,0.3)] leading-tight">
              GET IN TOUCH
            </h2>
            <p className="mt-2.5 font-sans text-sm sm:text-base text-slate-300 font-normal leading-relaxed drop-shadow-md">
              Contact information directly from the PDF resume.
            </p>
          </div>

        {/* Location & Contact Bar */}
        <div className="gsap-reveal mb-12 rounded-2xl border border-cyan-500/30 bg-[#090F1C]/90 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  LOCATION
                </span>
                <span className="font-sans text-sm font-semibold text-white">
                  {content.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`tel:${content.contact.mobile}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call {content.contact.mobileDisplay}</span>
              </a>
              <a
                href={`mailto:${content.contact.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 text-white font-mono text-xs hover:bg-white/10 transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Grid: Details & Form */}
        <div className="gsap-reveal grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Resume Contact Channels */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone */}
            <div className="p-5 rounded-xl border border-white/10 bg-[#080D1A]/80 hover:border-cyan-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      MOBILE NUMBER (HOME)
                    </span>
                    <a
                      href={`tel:${content.contact.mobile}`}
                      className="font-mono text-sm sm:text-base font-semibold text-white hover:text-cyan-300 transition-colors"
                    >
                      {content.contact.mobileDisplay}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(content.contact.mobile, 'phone')}
                  className="p-2 rounded border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-colors"
                  title="Copy Phone Number"
                  aria-label="Copy Phone Number"
                >
                  {copiedField === 'phone' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="p-5 rounded-xl border border-white/10 bg-[#080D1A]/80 hover:border-cyan-500/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      EMAIL
                    </span>
                    <a
                      href={`mailto:${content.contact.email}`}
                      className="font-mono text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 transition-colors block truncate"
                    >
                      {content.contact.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(content.contact.email, 'email')}
                  className="p-2 rounded border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-colors"
                  title="Copy Email"
                  aria-label="Copy Email"
                >
                  {copiedField === 'email' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="p-5 rounded-xl border border-white/10 bg-[#080D1A]/80 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-blue-500/30 bg-blue-950/30 text-blue-300 flex items-center justify-center">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      LINKEDIN
                    </span>
                    <span className="font-mono text-xs text-slate-200 block truncate max-w-[200px]">
                      {content.contact.linkedin}
                    </span>
                  </div>
                </div>

                <a
                  href={content.contact.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded border border-white/10 hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-300 transition-colors"
                  aria-label="Open LinkedIn Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="p-5 rounded-xl border border-white/10 bg-[#080D1A]/80 hover:border-pink-500/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-pink-500/30 bg-pink-950/30 text-pink-300 flex items-center justify-center">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      INSTAGRAM
                    </span>
                    <a
                      href={content.contact.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs sm:text-sm font-semibold text-white hover:text-pink-300 transition-colors block truncate max-w-[200px]"
                    >
                      @{content.contact.instagram}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(content.contact.instagram, 'instagram')}
                    className="p-2 rounded border border-white/10 hover:border-pink-500/40 text-slate-400 hover:text-white transition-colors"
                    title="Copy Instagram ID"
                    aria-label="Copy Instagram ID"
                  >
                    {copiedField === 'instagram' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={content.contact.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded border border-white/10 hover:border-pink-500/40 text-pink-400 hover:text-pink-300 transition-colors"
                    aria-label="Open Instagram Profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#080D18]/90 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 font-mono text-xs text-slate-400">
              <span className="text-cyan-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>SEND A MESSAGE</span>
              </span>
            </div>

            {formSubmitted ? (
              <div className="py-12 px-4 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl text-white font-bold tracking-tight">
                  MESSAGE SENT
                </h3>
                <p className="font-sans text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, {formData.name || 'there'}. Your message has been sent to Neeraj Babu ({content.contact.email}).
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', message: '' });
                    }}
                    className="px-5 py-2 rounded-lg border border-white/20 bg-white/5 font-sans font-medium text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">
                    NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-sans text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-sans text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">
                    MESSAGE *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message..."
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/50 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors resize-none font-sans text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-sans font-semibold tracking-wide text-xs sm:text-sm uppercase transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE TO NEERAJ BABU</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

        </div>

      </div>
    </section>
  );
};
