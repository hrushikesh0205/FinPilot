import { Twitter, Linkedin, Github, Send } from 'lucide-react';
import { C } from '@/constants/landingData';

export function SiteFooter({ setCurrentPage }) {
  const FOOTER_LINKS = {
    Product:   ['Features', 'Pricing', 'Integrations', 'Changelog'],
    Company:   ['About', 'Blog', 'Careers', 'Contact'],
    Resources: ['Documentation', 'Help Center', 'Community', 'Status'],
  };

  const FG    = 'rgba(255,255,255,0.72)';   // body text
  const FG_DIM = 'rgba(255,255,255,0.38)';  // muted text
  const FG_HEAD = 'rgba(255,255,255,0.38)'; // column headers

  return (
    <footer style={{ background: C.primary }}>

      {/* ── Main content ── */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-14 pb-0">

        {/* Top grid: brand + links */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-8 mb-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            {/* Logo — white text override */}
            <div className="flex items-center gap-2.5 select-none mb-4">
              <div
                style={{
                  width: 34, height: 34,
                  borderRadius: Math.round(34 * 0.28),
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 100%)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <svg width={20} height={20} viewBox="0 0 22 22" fill="none">
                  <polyline points="2,17 8,10 13,13 20,4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="4" r="2.2" fill={C.amber} />
                  <line x1="2" y1="20" x2="20" y2="20" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.28" />
                </svg>
              </div>
              <span style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
                FinPilot
              </span>
            </div>

            <p className="text-[13.5px] leading-[1.68] mb-6 max-w-[200px]" style={{ color: FG }}>
              AI-powered personal finance that helps you track, budget, and grow your wealth.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {[
                { Icon: Twitter,  label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Github,   label: 'GitHub' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="fp-social-icon w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: FG,
                  }}
                >
                  <Icon className="w-[15px] h-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, items]) => (
            <div key={title}>
              <p
                className="text-[10.5px] font-bold tracking-[0.16em] uppercase mb-4"
                style={{ color: FG_HEAD }}
              >{title}</p>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[13.5px] transition-colors duration-150"
                      style={{ color: FG }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = FG}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div
          className="rounded-2xl px-6 py-6 mb-10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Send className="w-3.5 h-3.5" style={{ color: C.amber }} />
                <p className="font-semibold text-sm text-white">Stay in the loop</p>
              </div>
              <p className="text-[12.5px]" style={{ color: FG_DIM }}>
                Weekly financial tips, product updates, and AI insights — delivered free.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2 flex-shrink-0">
              <input
                type="email"
                placeholder="your@email.com"
                className="fp-nl-input flex-1 md:w-52 px-4 py-2.5 rounded-xl text-sm outline-none"
              />
              <button
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.97] whitespace-nowrap"
                style={{ background: C.amber, color: '#111' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 py-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs" style={{ color: FG_DIM }}>
            © {new Date().getFullYear()} FinPilot, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a
                key={l}
                href="#"
                className="text-xs transition-colors duration-150"
                style={{ color: FG_DIM }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                onMouseLeave={e => e.currentTarget.style.color = FG_DIM}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
