import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingUp, Shield, BarChart3, PiggyBank, Receipt, Sparkles,
  ChevronDown, Menu, X, ArrowRight, Play, Target,
  ArrowUpRight, ArrowDownRight, Zap, Check, Star,
  Twitter, Linkedin, Github, Send, Lock,
} from 'lucide-react';

/* ─── Design Tokens ─────────────────────────────────────────────────────────── */
const C = {
  primary: '#0F3D2E',
  accent:  '#16A34A',
  amber:   '#F59E0B',
  bg:      '#FAFAF8',
};

/* ─── FinPilot SVG Logo ──────────────────────────────────────────────────────── */
function FinPilotLogo({ size = 34, showText = true }) {
  const r = Math.round(size * 0.28);
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        style={{
          width: size, height: size, borderRadius: r, flexShrink: 0,
          background: `linear-gradient(145deg, ${C.primary} 0%, #1e5c40 100%)`,
          boxShadow: '0 2px 10px rgba(15,61,46,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width={Math.round(size * 0.58)} height={Math.round(size * 0.58)} viewBox="0 0 22 22" fill="none">
          <polyline points="2,17 8,10 13,13 20,4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="4" r="2.2" fill="#F59E0B" />
          <line x1="2" y1="20" x2="20" y2="20" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.3" />
        </svg>
      </div>
      {showText && (
        <span style={{ color: C.primary, fontSize: size * 0.52, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>
          FinPilot
        </span>
      )}
    </div>
  );
}

/* ─── Intersection Observer Hook ────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Static Data ────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: TrendingUp, title: 'Smart Tracking',   desc: 'AI learns your spending patterns and automatically categorizes every transaction in real time.',           color: '#F59E0B', bg: '#FEF3C7' },
  { icon: Sparkles,   title: 'AI Insights',       desc: 'Personalized recommendations tailored to your lifestyle that help you save more every single month.',      color: '#16A34A', bg: '#DCFCE7' },
  { icon: PiggyBank,  title: 'Budget Planning',   desc: 'Intelligent budgets that adapt to your habits, flag overspending, and keep your goals on track.',          color: '#8B5CF6', bg: '#EDE9FE' },
  { icon: Receipt,    title: 'Receipt Scanner',   desc: 'Snap a photo and watch AI extract every detail instantly — no manual entry ever again.',                   color: '#EC4899', bg: '#FCE7F3' },
  { icon: Shield,     title: 'Bank-Grade Security', desc: '256-bit AES encryption and zero-knowledge architecture keep your financial data completely safe.',       color: '#3B82F6', bg: '#DBEAFE' },
  { icon: BarChart3,  title: 'Smart Reports',     desc: 'Beautiful visualizations and monthly summaries that turn raw data into clear, actionable insights.',       color: '#06B6D4', bg: '#CFFAFE' },
];

const TESTIMONIALS = [
  { name: 'Priya Mehta',   role: 'Software Engineer', company: 'Google',    text: 'FinPilot completely changed how I think about money. The AI insights helped me save ₹15,000 in just two months.',       initials: 'PM', avatarBg: '#DCFCE7', avatarColor: '#16A34A' },
  { name: 'Arjun Patel',   role: 'Founder & CEO',     company: 'TechFlow',  text: 'The receipt scanner alone saves me hours every week. This is what modern finance management should look like.',          initials: 'AP', avatarBg: '#DBEAFE', avatarColor: '#2563EB' },
  { name: 'Sneha Sharma',  role: 'Product Manager',   company: 'Microsoft', text: 'Finally a finance app that understands me. The AI recommendations are incredibly accurate and actually actionable.',     initials: 'SS', avatarBg: '#FEF3C7', avatarColor: '#D97706' },
];

const FAQS = [
  { q: 'Is FinPilot free to use?',                    a: 'Yes! We offer a generous free tier with essential expense tracking and basic AI insights. Premium features are available for power users who need advanced analytics and unlimited receipt scanning.' },
  { q: 'How secure is my financial data?',             a: 'We use 256-bit AES encryption, SOC 2 certified infrastructure, and zero-knowledge architecture. Your credentials are never stored on our servers — we apply bank-level security protocols throughout.' },
  { q: 'Can I connect my bank accounts?',              a: 'Absolutely. We support secure connections with 100+ Indian banks and financial institutions through regulated APIs. Your login credentials are never stored on our servers.' },
  { q: 'Does FinPilot work on mobile?',                a: 'FinPilot is fully responsive and works beautifully on any device. Native iOS and Android apps are launching soon with even more powerful features.' },
  { q: 'How does the AI learn my spending patterns?',  a: 'Our AI analyzes your transaction history, spending categories, and financial goals over time to deliver increasingly accurate insights and smarter budget recommendations personalized just for you.' },
];

const NAV = [
  { label: 'Platform',     id: 'features' },
  { label: 'AI Advisor',  id: 'ai-insights' },
  { label: 'Review', id: 'testimonials' },
  { label: 'Help Center',          id: 'faq' },
];

const AI_INSIGHTS = [
  { icon: TrendingUp, text: 'You spent 18% more on food this month',         color: '#F59E0B' },
  { icon: PiggyBank,  text: 'Cutting restaurants could save you ₹3,500',     color: '#16A34A' },
  { icon: Target,     text: 'Travel expenses decreased by 12% — great job!', color: '#8B5CF6' },
  { icon: Sparkles,   text: 'Your savings goal is 85% complete 🎉',           color: '#EC4899' },
];

const AI_CHAT = [
  { role: 'user', text: 'How can I save more this month?' },
  { role: 'ai',   text: 'Based on your patterns, you spend ₹4,200/month dining out. Reducing this by 30% would save ₹1,260 monthly. Want me to set a budget alert?' },
  { role: 'user', text: 'Yes, set it to ₹2,500.' },
  { role: 'ai',   text: "Done! I've set your restaurant budget to ₹2,500. You'll get smart alerts at 50%, 75%, and 90% of your limit." },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════════════════════════════════════ */
export function LandingPage({ setCurrentPage }) {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [openFaq,       setOpenFaq]       = useState(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      for (const { id } of NAV) {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= 110 && bottom >= 110) { setActiveSection(id); return; }
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-lg border-b border-gray-100/80 shadow-sm'
            : 'bg-transparent',
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-[70px]">

            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="transition-opacity hover:opacity-80 focus:outline-none"
            >
              <FinPilotLogo size={34} />
            </button>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV.map(({ label, id }) => {
                const active = activeSection === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      active
                        ? 'text-[#0F3D2E] bg-green-50'
                        : 'text-gray-500 hover:text-[#0F3D2E] hover:bg-gray-50',
                    )}
                  >
                    {label}
                  </a>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('/login')}
                className="hidden md:block text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
                style={{ color: C.primary }}
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentPage('/register')}
                className="text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: C.primary, boxShadow: '0 2px 10px rgba(15,61,46,0.22)' }}
              >
                Get Started
              </button>
              <button
                className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-100"
                onClick={() => setMenuOpen(v => !v)}
                style={{ color: C.primary }}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
            <div className="max-w-[1280px] mx-auto px-5 py-3 space-y-0.5">
              {NAV.map(({ label, id }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#0F3D2E] transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
              <div className="pt-3 mt-1 border-t border-gray-100 flex flex-col gap-2">
                <button
                  onClick={() => { setCurrentPage('/login'); setMenuOpen(false); }}
                  className="w-full text-sm font-semibold py-3 rounded-full border transition-all hover:bg-gray-50"
                  style={{ borderColor: '#D1FAE5', color: C.primary }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setCurrentPage('/register'); setMenuOpen(false); }}
                  className="w-full text-sm font-semibold py-3 rounded-full text-white transition-all hover:opacity-90"
                  style={{ background: C.primary }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative pt-24 md:pt-28 pb-12 md:pb-20 overflow-hidden">
        {/* Ambient gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div style={{
            position: 'absolute', top: '-8%', left: '-4%',
            width: 640, height: 640, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(22,163,74,0.09) 0%, transparent 68%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-12%', right: '-6%',
            width: 520, height: 520, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 68%)',
          }} />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left: copy ── */}
            <div className="fp-anim-left">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{ background: '#DCFCE7', color: C.primary }}
              >
                <Zap className="w-3.5 h-3.5" style={{ color: C.amber }} />
                AI-Powered Personal Finance
              </div>

              {/* Headline */}
              <h1
                className="text-[2.65rem] sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight leading-[1.08] mb-4"
                style={{ color: '#111827' }}
              >
                Spend Smarter.<br />
                Save Better.<br />
                <span className="fp-gradient-text">Grow Faster.</span>
              </h1>

              {/* Sub-headline */}
              <p className="text-[1.05rem] sm:text-lg leading-[1.7] mb-7 max-w-lg" style={{ color: '#4B5563' }}>
                Take control of your finances with intelligent expense tracking, smart budgeting,
                and personalized AI insights — all in one secure platform.
              </p>

{/*                */}{/* Trust badges */}
{/*               <div className="flex flex-wrap gap-2 mb-8"> */}
{/*                 {[ */}
{/*                   { icon: Shield, label: 'Bank-grade security' }, */}
{/*                   { icon: Zap,    label: 'AI-powered insights' }, */}
{/*                   { icon: Check,  label: 'Free to get started' }, */}
{/*                 ].map(({ icon: Icon, label }) => ( */}
{/*                   <div */}
{/*                     key={label} */}
{/*                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" */}
{/*                     style={{ background: '#F0FDF4', color: '#166534' }} */}
{/*                   > */}
{/*                     <Icon className="w-3 h-3" style={{ color: C.accent }} /> */}
{/*                     {label} */}
{/*                   </div> */}
{/*                 ))} */}
{/*               </div> */}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={() => setCurrentPage('/register')}

                  className="inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: C.primary, boxShadow: '0 4px 18px rgba(15,61,46,0.28)' }}
                >
                  Start Saving Today  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                onClick={() => setCurrentPage('/login')}

                  className="inline-flex items-center justify-center gap-3 font-semibold px-7 py-3.5 rounded-full border transition-all duration-200 hover:bg-white hover:shadow-md"
                  style={{ borderColor: '#E5E7EB', color: '#374151', background: 'transparent' }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: '#F0FDF4' }}
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" style={{ color: C.accent }} />
                  </span>
                  Login to Account
                </button>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-8 pt-6 border-t border-gray-100">
                {[
                  { val: '50+',    lbl: 'Active users' },
                  { val: '₹100k+', lbl: 'Tracked' },
                  { val: '4.9★',    lbl: 'App rating' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-xl font-bold" style={{ color: C.primary }}>{s.val}</div>
                    <div className="text-xs mt-0.5 font-medium" style={{ color: '#9CA3AF' }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: floating dashboard mockup ── */}
            <div className="relative h-[570px] hidden lg:block fp-anim-right">

              {/* Card 1 — Total Balance */}
              <div
                className="fp-float-1 absolute w-64 p-6 rounded-2xl"
                style={{
                  top: 0, left: 16,
                  '--fp-r': '-3deg',
                  background: C.primary,
                  boxShadow: '0 28px 56px rgba(15,61,46,0.30), 0 8px 16px rgba(0,0,0,0.1)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.12)' }}>
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.52)' }}>Total Balance</span>
                </div>
                <p className="text-[2rem] font-bold text-white leading-none mb-4">₹1,45,000</p>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-bold">+12.5%</span>
                  <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.32)' }}>this month</span>
                </div>
              </div>

              {/* Card 2 — Monthly Budget */}
              <div
                className="fp-float-2 absolute w-[214px] p-5 rounded-2xl bg-white"
                style={{
                  top: 36, right: 4,
                  '--fp-r': '3.5deg',
                  boxShadow: '0 20px 44px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
                    <PiggyBank className="w-5 h-5" style={{ color: C.amber }} />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium">Monthly Budget</p>
                    <p className="font-bold text-base" style={{ color: C.primary }}>₹75,000</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden mb-2">
                  <div className="h-full rounded-full" style={{ width: '70%', background: C.amber }} />
                </div>
                <p className="text-[11px] text-gray-400">70% used · ₹22,500 remaining</p>
              </div>

              {/* Card 3 — AI Insight */}
              <div
                className="fp-float-3 absolute w-[232px] p-5 rounded-2xl"
                style={{
                  top: 232, left: 0,
                  '--fp-r': '-2.5deg',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                  boxShadow: '0 24px 52px rgba(245,158,11,0.38), 0 8px 16px rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.22)' }}>
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xs">AI Insight</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.62)' }}>Personalized for you</p>
                  </div>
                </div>
                <p className="text-white text-xs leading-relaxed font-medium">
                  Cut restaurant spending by 30% to save ₹3,500 this month 🎯
                </p>
              </div>

              {/* Card 4 — Expense Trend */}
              <div
                className="fp-float-4 absolute w-[232px] p-5 rounded-2xl bg-white"
                style={{
                  bottom: 152, right: 0,
                  '--fp-r': '2deg',
                  boxShadow: '0 20px 44px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold" style={{ color: C.primary }}>Expense Trend</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium">7 days</span>
                </div>
                <div className="flex items-end gap-1.5 h-[58px] mb-2">
                  {[32, 60, 44, 80, 52, 68, 48].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all duration-500"
                      style={{
                        height: `${h}%`,
                        background: i === 3 ? C.accent : C.primary,
                        opacity: i === 3 ? 1 : 0.1,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <span key={i} className="text-[9px] flex-1 text-center text-gray-300 font-medium">{d}</span>
                  ))}
                </div>
              </div>

              {/* Card 5 — Monthly Spend */}
              <div
                className="fp-float-5 absolute w-[178px] p-5 rounded-2xl"
                style={{
                  bottom: 16, left: 28,
                  '--fp-r': '-1.2deg',
                  background: '#111827',
                  boxShadow: '0 18px 36px rgba(0,0,0,0.22)',
                }}
              >
                <p className="text-[11px] font-medium mb-1" style={{ color: 'rgba(255,255,255,0.42)' }}>Monthly Spend</p>
                <p className="text-2xl font-bold text-white">₹52,848</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold">-3.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile horizontal scrollable mini-cards */}
          <div className="lg:hidden overflow-x-auto -mx-5 px-5 mt-8" style={{ scrollbarWidth: 'none' }}>
            <div className="flex gap-3 w-max pb-2">
              {[
                { lbl: 'Total Balance', val: '₹1,45,000', sub: '+12.5%',    dark: true },
                { lbl: 'Monthly Spend', val: '₹52,848',   sub: '-3.4%',     amber: true },
                { lbl: 'Budget Used',   val: '70%',        sub: '₹22,500 left', light: true },
                { lbl: 'Savings Goal',  val: '85%',        sub: '₹57,152 saved', light: true },
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-36 p-4 rounded-2xl"
                  style={{
                    background: c.dark ? C.primary : c.amber ? C.amber : 'white',
                    boxShadow: c.light ? '0 4px 16px rgba(0,0,0,0.07)' : 'none',
                  }}
                >
                  <p className="text-[10px] font-medium mb-1.5" style={{ color: c.light ? '#9CA3AF' : 'rgba(255,255,255,0.5)' }}>{c.lbl}</p>
                  <p className="text-base font-bold" style={{ color: c.light ? C.primary : 'white' }}>{c.val}</p>
                  <p className="text-[10px] mt-1" style={{ color: c.light ? '#D1D5DB' : 'rgba(255,255,255,0.45)' }}>{c.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ WHY FINPILOT ═════════ */}
      <div className="pt-12 pb-4 bg-gradient-to-b from-white to-emerald-50/40 border-y border-emerald-100/60">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">

          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
              WHY FINPILOT
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-slate-900">
              Built for
              <span className="text-emerald-600"> smarter financial decisions</span>
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-lg">
              Everything you need to track expenses, manage budgets, and grow your savings with AI-powered insights.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_15px_45px_rgba(22,163,74,0.15)]">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-slate-900">Smart Tracking</h3>
              <p className="mt-2 text-sm text-gray-500">
                Automatic expense categorization.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_15px_45px_rgba(22,163,74,0.15)]">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-slate-900">AI Advisor</h3>
              <p className="mt-2 text-sm text-gray-500">
                Personalized saving recommendations.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_15px_45px_rgba(22,163,74,0.15)]">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-slate-900">Budget Goals</h3>
              <p className="mt-2 text-sm text-gray-500">
                Stay on track with monthly budgets.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_15px_45px_rgba(22,163,74,0.15)]">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-slate-900">Secure Platform</h3>
              <p className="mt-2 text-sm text-gray-500">
                Bank-grade security for your data.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* ══ FEATURES ════════════════════════════════════════════════════════ */}
      <section id="features" className="pt-12 pb-24 md:pt-24 md:pb-24 bg-white">
        <FeaturesSection />
      </section>

      {/* ══ AI INSIGHTS ═════════════════════════════════════════════════════ */}
      <section id="ai-insights" className="py-20 md:py-24" style={{ background: C.primary }}>
        <AISection />
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-20 md:py-24" style={{ background: C.bg }}>
        <TestimonialsSection />
      </section>

      {/* ══ FAQ ═════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-20 md:py-24 bg-white">
        <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20" style={{ background: C.bg }}>
        <CTABanner setCurrentPage={setCurrentPage} />
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <SiteFooter setCurrentPage={setCurrentPage} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   FEATURES SECTION
══════════════════════════════════════════════════════════════════════════════ */
function FeaturesSection() {
  const [headerRef, headerVisible] = useReveal();
  const [gridRef, gridVisible]     = useReveal(0.08);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8">
      {/* Section header */}
      <div
        ref={headerRef}
        className={cn('text-center max-w-2xl mx-auto mb-12', headerVisible ? 'fp-anim-up' : 'opacity-0')}
      >
        <span className="text-[11px] font-bold tracking-[0.16em] uppercase inline-block mb-3" style={{ color: C.accent }}>
          FEATURES
        </span>
        <h2 className="text-[2rem] sm:text-[2.4rem] font-bold tracking-tight leading-[1.12] mb-3" style={{ color: '#111827' }}>
          Everything you need to{' '}
          <span style={{ color: C.primary }}>manage money smarter</span>
        </h2>
        <p className="text-[0.95rem] text-gray-500 leading-[1.7] max-w-lg mx-auto">
          Powerful tools designed to give you complete control over your financial life.
        </p>
      </div>

      {/* Features grid */}
      <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => {
          const { icon: Icon, title, desc, color, bg } = f;
          return (
            <div
              key={i}
              className={cn(
                'fp-feature-card group p-7 rounded-2xl bg-white cursor-pointer',
                gridVisible ? `fp-stagger-${i}` : 'opacity-0',
              )}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-280 group-hover:scale-110"
                style={{ background: bg }}
              >
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 className="font-semibold text-[15px] mb-2 leading-snug" style={{ color: '#111827' }}>{title}</h3>
              <p className="text-[13.5px] leading-[1.65] text-gray-500">{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   AI SECTION
══════════════════════════════════════════════════════════════════════════════ */
function AISection() {
  const [ref, visible] = useReveal(0.1);

  return (
    <div ref={ref} className="max-w-[1440px] mx-auto px-4 md:px-8">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left — copy & insight list */}
        <div className={visible ? 'fp-anim-left' : 'opacity-0'}>
          <span className="text-xs font-bold tracking-[0.16em] uppercase inline-block mb-4 text-green-400">
            AI POWERED
          </span>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold tracking-tight text-white leading-[1.15] mb-5">
            Your Personal AI{' '}
            <span style={{ color: C.amber }}>Financial Advisor</span>
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.58)' }}>
            FinPilot AI analyzes your spending patterns, identifies savings opportunities, and provides
            personalized recommendations that make a real difference to your finances.
          </p>

          <div className="space-y-3">
            {AI_INSIGHTS.map((ins, i) => {
              const InsIcon = ins.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/5"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${ins.color}20` }}
                  >
                    <InsIcon className="w-5 h-5" style={{ color: ins.color }} />
                  </div>
                  <p className="text-sm text-white font-medium">{ins.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — chat UI mockup */}
        <div className={visible ? 'fp-anim-right' : 'opacity-0'}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 36px 72px rgba(0,0,0,0.25)',
            }}
          >
            {/* Chat header */}
            <div
              className="flex items-center gap-3 px-6 py-4 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${C.amber}, #FBBF24)` }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">FinPilot AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 fp-pulse" />
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
                    Always learning, always helping
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4">
              {AI_CHAT.map((m, i) => (
                <div key={i} className={cn('flex gap-3', m.role === 'user' && 'flex-row-reverse')}>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                    style={{
                      background: m.role === 'ai' ? `${C.amber}28` : 'rgba(255,255,255,0.1)',
                      color: m.role === 'ai' ? C.amber : 'white',
                    }}
                  >
                    {m.role === 'ai' ? <Sparkles className="w-4 h-4" /> : 'YOU'}
                  </div>
                  <div
                    className="max-w-[82%] px-4 py-3 rounded-2xl text-sm text-white leading-relaxed"
                    style={{ background: m.role === 'ai' ? `${C.amber}15` : 'rgba(255,255,255,0.07)' }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <div className="px-5 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <input
                  readOnly
                  placeholder="Ask FinPilot AI anything..."
                  className="flex-1 bg-transparent text-sm text-white/60 outline-none placeholder-white/25"
                />
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: C.amber }}
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TESTIMONIALS SECTION
══════════════════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const [headerRef, headerVisible] = useReveal();
  const [gridRef, gridVisible]     = useReveal(0.08);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8">
      {/* Header */}
      <div
        ref={headerRef}
        className={cn('text-center max-w-xl mx-auto mb-12', headerVisible ? 'fp-anim-up' : 'opacity-0')}
      >
        <span className="text-[11px] font-bold tracking-[0.16em] uppercase inline-block mb-3" style={{ color: C.accent }}>
          REVIEW
        </span>
        <h2 className="text-[2rem] sm:text-[2.4rem] font-bold tracking-tight leading-[1.12] mb-3" style={{ color: '#111827' }}>
          Loved by <span style={{ color: C.primary }}>thousands</span>
        </h2>
        <p className="text-[0.95rem] text-gray-500 leading-[1.7]">
          Real people, real results. See how FinPilot has transformed the way they manage money.
        </p>
      </div>

      {/* Cards */}
      <div ref={gridRef} className="grid md:grid-cols-3 gap-5 mb-10">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className={cn(
              'fp-card p-7 rounded-2xl border border-gray-100 bg-white cursor-pointer',
              gridVisible ? `fp-stagger-${i}` : 'opacity-0',
            )}
          >
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="w-[14px] h-[14px] fill-current" style={{ color: C.amber }} />
              ))}
            </div>
            {/* Quote */}
            <p className="text-[13.5px] leading-[1.7] mb-6 text-gray-600">"{t.text}"</p>
            {/* Author */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: t.avatarBg, color: t.avatarColor }}
              >
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-[13.5px]" style={{ color: '#111827' }}>{t.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.role}, {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social proof row */}
      <div
        className={cn(
          'flex flex-col sm:flex-row items-center justify-center gap-4',
          gridVisible ? 'fp-anim-up-d4' : 'opacity-0',
        )}
      >
        <div className="flex -space-x-2.5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white"
              style={{ background: t.avatarBg, color: t.avatarColor }}
            >
              {t.initials}
            </div>
          ))}
          {['#E0F2FE', '#FCE7F3', '#FEF3C7', '#EDE9FE'].map((bg, i) => (
            <div key={i} className="w-9 h-9 rounded-full border-2 border-white" style={{ background: bg }} />
          ))}
        </div>
        <p className="text-sm" style={{ color: '#4B5563' }}>
          <span className="font-bold text-base" style={{ color: C.primary }}>50,000+</span>{' '}
          people trust FinPilot with their finances
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   FAQ SECTION
══════════════════════════════════════════════════════════════════════════════ */
function FAQSection({ openFaq, setOpenFaq }) {
  const [headerRef, headerVisible] = useReveal();
  const [bodyRef, bodyVisible]     = useReveal(0.05);

  return (
    <div className="max-w-[720px] mx-auto px-5 md:px-10">
      {/* Header */}
      <div
        ref={headerRef}
        className={cn('text-center mb-12', headerVisible ? 'fp-anim-up' : 'opacity-0')}
      >
        <span className="text-[11px] font-bold tracking-[0.16em] uppercase inline-block mb-3" style={{ color: C.accent }}>
          FAQ
        </span>
        <h2 className="text-[2rem] sm:text-[2.4rem] font-bold tracking-tight leading-[1.12]" style={{ color: '#111827' }}>
          Frequently asked questions
        </h2>
      </div>

      {/* Accordion */}
      <div ref={bodyRef} className={cn('space-y-3', bodyVisible ? 'fp-anim-up-d1' : 'opacity-0')}>
        {FAQS.map((faq, i) => {
          const isOpen = openFaq === i;
          return (
            <div
              key={i}
              className={cn(
                'rounded-xl border overflow-hidden transition-all duration-200',
                isOpen ? 'border-green-200 shadow-sm' : 'border-gray-100 hover:border-gray-200',
              )}
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-sm" style={{ color: '#111827' }}>{faq.q}</span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                  style={{ background: isOpen ? C.primary : '#F3F4F6' }}
                >
                  <ChevronDown
                    className={cn('w-4 h-4 transition-transform duration-300', isOpen && 'rotate-180')}
                    style={{ color: isOpen ? 'white' : '#6B7280' }}
                  />
                </div>
              </button>
              <div
                className={cn(
                  'grid transition-all duration-300 ease-in-out',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CTA BANNER
══════════════════════════════════════════════════════════════════════════════ */
function CTABanner({ setCurrentPage }) {
  const [ref, visible] = useReveal();

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8">
      <div
        ref={ref}
        className={cn(
          'rounded-3xl px-8 py-16 md:py-20 text-center',
          visible ? 'fp-anim-up' : 'opacity-0',
        )}
        style={{ background: C.primary, boxShadow: '0 36px 72px rgba(15,61,46,0.30)' }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6"
          style={{ background: C.amber }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          Start managing money{' '}
          <span style={{ color: C.amber }}>smarter today</span>
        </h2>
        <p className="text-base mb-8 mx-auto max-w-md" style={{ color: 'rgba(255,255,255,0.58)' }}>
          Join 50,000+ users who are taking complete control of their finances with AI-powered insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={() => setCurrentPage('/register')}
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            style={{ background: C.amber, color: '#111' }}
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage('/login')}
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-full border transition-all duration-200 hover:bg-white/10"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            Sign In
          </button>
        </div>

        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.32)' }}>
          No credit card required · Free forever plan available · Cancel anytime
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   FOOTER  (dark green, premium)
══════════════════════════════════════════════════════════════════════════════ */
function SiteFooter({ setCurrentPage }) {
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
