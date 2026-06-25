import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  TrendingUp,
  Shield,
  BarChart3,
  PiggyBank,
  Receipt,
  ChevronRight,
  Star,
  Menu,
  X,
  ArrowRight,
  Play,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Lock,
  Send,
  Twitter,
  Linkedin,
  Github,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: TrendingUp,
    title: 'Smart Tracking',
    description: 'AI learns your spending patterns and automatically categorizes every transaction',
    accent: '#F5A623',
  },
  {
    icon: Sparkles,
    title: 'AI Insights',
    description: 'Personalized recommendations that actually help you save money every month',
    accent: '#10B981',
  },
  {
    icon: PiggyBank,
    title: 'Budget Planning',
    description: 'Intelligent budgets that adapt to your lifestyle and spending habits',
    accent: '#8B5CF6',
  },
  {
    icon: Receipt,
    title: 'Receipt Scanner',
    description: 'Snap a photo and watch AI extract every detail instantly',
    accent: '#EC4899',
  },
  {
    icon: Shield,
    title: 'Bank Security',
    description: '256-bit encryption and zero-knowledge architecture protect your data',
    accent: '#3B82F6',
  },
  {
    icon: BarChart3,
    title: 'Smart Reports',
    description: 'Beautiful visualizations that make financial planning effortless',
    accent: '#06B6D4',
  },
];

const testimonials = [
  {
    name: 'Priya Mehta',
    role: 'Software Engineer',
    company: 'Google',
    content: 'ExpenseIQ completely changed how I think about money. The AI insights helped me save ₹15,000 in just two months.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    rating: 5,
  },
  {
    name: 'Arjun Patel',
    role: 'Founder & CEO',
    company: 'TechFlow',
    content: 'The receipt scanner alone saves me hours every week. This is what modern finance should look like.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    rating: 5,
  },
  {
    name: 'Sneha Sharma',
    role: 'Product Manager',
    company: 'Microsoft',
    content: 'Finally a finance app that understands me. The AI recommendations are incredibly accurate.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    rating: 5,
  },
];

const faqs = [
  {
    question: 'Is ExpenseIQ free to use?',
    answer: 'Yes! We offer a generous free tier with essential expense tracking and basic AI insights. Premium features are available for power users who need advanced analytics and unlimited receipt scanning.',
  },
  {
    question: 'How secure is my financial data?',
    answer: 'We use 256-bit AES encryption, SOC 2 certified infrastructure, and zero-knowledge architecture. Your credentials are never stored on our servers—we use bank-level security protocols.',
  },
  {
    question: 'Can I connect my bank accounts?',
    answer: 'Absolutely. We support secure connections with 100+ Indian banks and financial institutions through regulated APIs. Your login credentials are never stored on our servers.',
  },
  {
    question: 'Does ExpenseIQ work on mobile?',
    answer: 'ExpenseIQ is fully responsive and works beautifully on any device. Native iOS and Android apps are launching soon with even more features.',
  },
];

const navItems = ['Features', 'AI Insights', 'Testimonials', 'FAQ'];

export function LandingPage({ setCurrentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Track active section
      const sections = navItems.map(item => item.toLowerCase().replace(' ', '-'));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F8F6F2' }}>
      {/* Navigation */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/40 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-shadow duration-300 group-hover:shadow-lg"
                style={{ background: '#1F3B2D', boxShadow: scrolled ? '0 4px 12px rgba(31, 59, 45, 0.2)' : 'none' }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span
                className="font-semibold text-xl tracking-tight"
                style={{ color: '#1F3B2D' }}
              >
                ExpenseIQ
              </span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-12">
              {navItems.map((item) => {
                const sectionId = item.toLowerCase().replace(' ', '-');
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item}
                    href={`#${sectionId}`}
                    className="relative text-sm font-medium transition-all duration-300 group"
                    style={{ color: isActive ? '#1F3B2D' : '#1F3B2D8C' }}
                  >
                    <span className="relative z-10">{item}</span>
                    {/* Active indicator */}
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 right-0 h-0.5 rounded-full transition-all duration-300',
                        isActive ? 'opacity-100' : 'opacity-0'
                      )}
                      style={{ background: '#F5A623' }}
                    />
                    {/* Hover underline */}
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                      style={{ background: '#1F3B2D' }}
                    />
                  </a>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-5">
              <Button
                variant="ghost"
                className="hidden md:inline-flex font-medium text-sm transition-all duration-300 hover:bg-transparent"
                style={{ color: '#1F3B2D' }}
                onClick={() => setCurrentPage('/login')}
              >
                Sign In
              </Button>
              <Button
                className="text-white font-medium rounded-full px-7 h-12 text-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                style={{ background: '#1F3B2D', boxShadow: '0 2px 8px rgba(31, 59, 45, 0.2)' }}
                onClick={() => setCurrentPage('/register')}
              >
                Get Started
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-6 py-6 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-sm font-medium py-2 transition-colors"
                  style={{ color: '#1F3B2D' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-5 border-t border-gray-100 space-y-3">
                <Button
                  variant="outline"
                  className="w-full rounded-full h-11"
                  style={{ borderColor: '#1F3B2D', color: '#1F3B2D' }}
                  onClick={() => setCurrentPage('/login')}
                >
                  Sign In
                </Button>
                <Button
                  className="w-full text-white rounded-full h-11"
                  style={{ background: '#1F3B2D' }}
                  onClick={() => setCurrentPage('/register')}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10 transition-all duration-300 hover:shadow-md"
                style={{ background: 'rgba(31, 59, 45, 0.06)' }}
              >
                <Zap className="w-4 h-4" style={{ color: '#F5A623' }} />
                <span className="text-sm font-medium" style={{ color: '#1F3B2D' }}>
                  AI Powered Finance Platform
                </span>
              </div>

              {/* Headline */}
              <h1
                className="text-5xl sm:text-6xl lg:text-[4rem] font-bold tracking-tight leading-[1.08] mb-8"
                style={{ color: '#121212' }}
              >
                Take Control of{' '}
                <br />
                <span>Your Money</span>
                <br />
                <span style={{ color: '#1F3B2D' }}>with AI</span>
              </h1>

              {/* Subheadline */}
              <p
                className="text-lg sm:text-xl mb-12 max-w-md leading-relaxed"
                style={{ color: '#1F3B2D', opacity: 0.65, lineHeight: '1.7' }}
              >
                Track expenses, manage budgets, and receive intelligent insights that help you save more every month.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <Button
                  size="lg"
                  className="text-white font-medium h-[52px] px-9 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                  style={{ background: '#1F3B2D', boxShadow: '0 4px 20px rgba(31, 59, 45, 0.25)' }}
                  onClick={() => setCurrentPage('/register')}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-medium h-[52px] px-9 rounded-full text-base transition-all duration-300 hover:bg-gray-50"
                  style={{ borderColor: 'rgba(31, 59, 45, 0.3)', color: '#1F3B2D' }}
                >
                  <Play className="mr-3 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-12">
                {[
                  { value: '50K+', label: 'Users' },
                  { value: '₹500Cr', label: 'Tracked' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-baseline gap-3">
                    <span
                      className="text-3xl font-bold"
                      style={{ color: '#1F3B2D' }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#1F3B2D', opacity: 0.5 }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Floating Finance Cards */}
            <div className="relative h-[650px] hidden lg:block">
              {/* Main Balance Card */}
              <div
                className="absolute top-4 left-4 w-[280px] p-7 rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: '#1F3B2D',
                  transform: 'rotate(-6deg)',
                  boxShadow: '0 25px 50px rgba(31, 59, 45, 0.25), 0 10px 20px rgba(0,0,0,0.1)',
                }}
              >
                <p className="text-white/50 text-sm mb-2 font-medium">Total Balance</p>
                <p className="text-white text-4xl font-bold mb-5">₹1,45,000</p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-400 text-sm font-semibold">+12.5%</p>
                    <p className="text-white/40 text-xs">this month</p>
                  </div>
                </div>
              </div>

              {/* Budget Card */}
              <div
                className="absolute top-12 right-0 w-[260px] p-6 rounded-3xl bg-white transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                style={{
                  transform: 'rotate(4deg)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(245, 166, 35, 0.12)' }}
                  >
                    <PiggyBank className="w-6 h-6" style={{ color: '#F5A623' }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#1F3B2D', opacity: 0.5 }}>Monthly Budget</p>
                    <p className="text-xl font-bold" style={{ color: '#1F3B2D' }}>₹75,000</p>
                  </div>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#F8F6F2' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: '70%', background: '#F5A623' }}
                  />
                </div>
                <p className="text-xs mt-2.5 font-medium" style={{ color: '#1F3B2D', opacity: 0.4 }}>70% used</p>
              </div>

              {/* AI Insight Card - Premium Highlighted */}
              <div
                className="absolute top-[240px] left-8 w-[260px] p-6 rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #F5A623 0%, #f7b84d 100%)',
                  transform: 'rotate(-3deg)',
                  boxShadow: '0 25px 50px rgba(245, 166, 35, 0.3), 0 10px 20px rgba(0,0,0,0.08)',
                }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">AI Insight</p>
                    <p className="text-white/70 text-xs">Personalized for you</p>
                  </div>
                </div>
                <p className="text-white text-sm leading-relaxed font-medium">
                  You can save ₹3,500 this month by reducing restaurant spending
                </p>
              </div>

              {/* Expense Trend Card */}
              <div
                className="absolute bottom-36 right-0 w-[290px] p-6 rounded-3xl bg-white transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                style={{
                  transform: 'rotate(6deg)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="font-semibold" style={{ color: '#1F3B2D' }}>Expense Trend</p>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(31, 59, 45, 0.06)', color: '#1F3B2D', opacity: 0.7 }}>This Week</span>
                </div>
                <div className="flex items-end gap-2.5 h-24 mb-3">
                  {[40, 65, 45, 80, 60, 75, 55].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t transition-all duration-500" style={{ height: `${h}%`, background: i === 3 ? '#F5A623' : '#1F3B2D', opacity: i === 3 ? 1 : 0.12 }} />
                  ))}
                </div>
                <div className="flex justify-between text-xs font-medium" style={{ color: '#1F3B2D', opacity: 0.35 }}>
                  <span>Mon</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Savings Goal Card */}
              <div
                className="absolute bottom-8 left-0 w-[240px] p-6 rounded-3xl bg-white transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                style={{
                  transform: 'rotate(-4deg)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Target className="w-5 h-5" style={{ color: '#10B981' }} />
                    <span className="text-sm font-medium" style={{ color: '#1F3B2D' }}>Savings Goal</span>
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1" style={{ color: '#1F3B2D' }}>₹57,152</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}>85%</span>
                  <span className="text-xs" style={{ color: '#1F3B2D', opacity: 0.45 }}>of ₹68,000 goal</span>
                </div>
              </div>

              {/* Monthly Expense Card */}
              <div
                className="absolute bottom-[180px] left-1/3 w-[200px] p-5 rounded-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                style={{
                  background: '#1F3B2D',
                  transform: 'rotate(2deg)',
                  boxShadow: '0 15px 30px rgba(31, 59, 45, 0.2)',
                }}
              >
                <p className="text-white/50 text-xs font-medium mb-1">Monthly Expense</p>
                <p className="text-white text-2xl font-bold">₹52,848</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-medium">-3.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Floating Cards */}
        <section className="lg:hidden py-8 overflow-x-auto">
          <div className="flex gap-4 px-6 pb-4 snap-x snap-mandatory">
            {[
              { title: 'Total Balance', value: '₹1,45,000', change: '+12.5%', bg: '#1F3B2D' },
              { title: 'Monthly Expense', value: '₹52,848', change: '-3.4%', bg: '#F5A623' },
              { title: 'Savings Goal', value: '85%', change: '₹57,152', bg: 'white' },
              { title: 'Budget Used', value: '70%', change: '₹52,500', bg: 'white' },
            ].map((card, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-44 p-5 rounded-2xl snap-start transition-all duration-300 hover:scale-[1.02]"
                style={{ background: card.bg, boxShadow: card.bg === 'white' ? '0 8px 24px rgba(0,0,0,0.06)' : '0 12px 28px rgba(31, 59, 45, 0.2)' }}
              >
                <p className={cn('text-xs font-medium mb-2', card.bg === 'white' ? '' : 'text-white/50')} style={{ color: card.bg === 'white' ? '#1F3B2D' : undefined, opacity: card.bg === 'white' ? 0.5 : 1 }}>
                  {card.title}
                </p>
                <p className={cn('text-xl font-bold mb-1', card.bg === 'white' && '')} style={{ color: card.bg === 'white' ? '#1F3B2D' : 'white' }}>
                  {card.value}
                </p>
                <p className={cn('text-xs', card.bg === 'white' ? 'opacity-50' : 'opacity-60')} style={{ color: card.bg === 'white' ? '#1F3B2D' : 'white' }}>
                  {card.change}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* Features Section */}
      <section id="features" className="py-28 lg:py-40" style={{ background: 'white' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="max-w-xl mb-20 lg:mb-24">
            <p className="text-sm font-semibold mb-5 tracking-wide" style={{ color: '#F5A623' }}>
              FEATURES
            </p>
            <h2
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-6"
              style={{ color: '#121212' }}
            >
              Everything you need{' '}
              <br />
              <span style={{ color: '#1F3B2D' }}>to manage smarter</span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#1F3B2D', opacity: 0.6 }}>
              Powerful tools designed to give you complete control over your financial life.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 lg:p-10 rounded-3xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-transparent hover:border-gray-100"
                style={{ background: '#F8F6F2' }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${feature.accent}12` }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: feature.accent }} />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#121212' }}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed" style={{ color: '#1F3B2D', opacity: 0.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section id="ai-insights" className="py-28 lg:py-40" style={{ background: '#1F3B2D' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
            {/* Left Content */}
            <div>
              <p className="text-sm font-semibold mb-5 tracking-wide text-emerald-400">
                AI POWERED
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-7">
                Your Personal AI{' '}
                <span style={{ color: '#F5A623' }}>Financial Advisor</span>
              </h2>
              <p className="text-lg mb-12 leading-relaxed" style={{ color: 'white', opacity: 0.65, lineHeight: '1.75' }}>
                Our AI analyzes your spending patterns, identifies savings opportunities, and provides personalized recommendations that make a real difference.
              </p>

              {/* Insight Cards */}
              <div className="space-y-4">
                {[
                  { text: 'You spent 18% more on food this month', icon: TrendingUp, color: '#F5A623' },
                  { text: 'Reducing restaurant spending could save ₹3,500', icon: PiggyBank, color: '#10B981' },
                  { text: 'Travel expenses decreased by 12%. Great job!', icon: Target, color: '#8B5CF6' },
                  { text: 'Your savings goal is 85% achieved', icon: Sparkles, color: '#EC4899' },
                ].map((insight, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 hover:bg-white/10 cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${insight.color}18` }}
                    >
                      <insight.icon className="w-5 h-5" style={{ color: insight.color }} />
                    </div>
                    <p className="text-white font-medium">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - AI Visual */}
            <div className="relative">
              <div
                className="rounded-3xl p-9 lg:p-10 transition-all duration-500 hover:shadow-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}
              >
                <div className="flex items-center gap-4 mb-9 pb-7 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #F5A623, #f7b84d)' }}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">ExpenseIQ AI</p>
                    <p className="text-sm" style={{ color: 'white', opacity: 0.45 }}>Always learning, always helping</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { role: 'user', text: 'How can I save more this month?' },
                    { role: 'ai', text: 'Based on your patterns, I noticed you spend ₹4,200/month dining out. Reducing this by 30% could save you ₹1,260 monthly. Want me to set a budget alert?' },
                    { role: 'user', text: 'Yes, set it to ₹2,500' },
                    { role: 'ai', text: "Done! I've set your restaurant budget. You'll get alerts at 50%, 75%, and 90% of your limit." },
                  ].map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex gap-3',
                        msg.role === 'user' && 'flex-row-reverse'
                      )}
                    >
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                          msg.role === 'user' ? 'bg-white/10' : ''
                        )}
                        style={msg.role === 'ai' ? { background: '#F5A62325' } : {}}
                      >
                        {msg.role === 'user' ? (
                          <span className="text-xs font-bold text-white">RS</span>
                        ) : (
                          <Sparkles className="w-4 h-4" style={{ color: '#F5A623' }} />
                        )}
                      </div>
                      <div
                        className="p-4 rounded-2xl max-w-[85%]"
                        style={{
                          background: msg.role === 'user' ? 'rgba(255,255,255,0.08)' : 'rgba(245,166,35,0.12)',
                        }}
                      >
                        <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-28 lg:py-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-xl mx-auto mb-20 lg:mb-24">
            <p className="text-sm font-semibold mb-5 tracking-wide" style={{ color: '#F5A623' }}>
              TESTIMONIALS
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: '#121212' }}>
              Loved by{' '}
              <span style={{ color: '#1F3B2D' }}>thousands</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-7">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-9 rounded-3xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
              >
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: '#F5A623' }} />
                  ))}
                </div>
                <p className="leading-relaxed mb-8" style={{ color: '#1F3B2D', opacity: 0.75, lineHeight: '1.7' }}>
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <p className="font-semibold" style={{ color: '#121212' }}>{t.name}</p>
                    <p className="text-sm font-medium" style={{ color: '#1F3B2D', opacity: 0.6 }}>{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Avatars */}
          <div className="flex items-center justify-center gap-6 mt-20">
            <div className="flex -space-x-4">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&h=60&fit=crop&crop=face',
              ].map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt=""
                  className="w-12 h-12 rounded-full border-4 object-cover"
                  style={{ borderColor: '#F8F6F2' }}
                />
              ))}
            </div>
            <p className="text-sm font-medium" style={{ color: '#1F3B2D' }}>
              <span className="font-bold text-lg">50,000+</span> users trust ExpenseIQ
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-28 lg:py-40" style={{ background: 'white' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-20 lg:mb-24">
            <p className="text-sm font-semibold mb-5 tracking-wide" style={{ color: '#F5A623' }}>
              FAQ
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: '#121212' }}>
              Frequently asked
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                style={{ background: '#F8F6F2' }}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-7 text-left"
                >
                  <span className="font-medium pr-8 text-lg" style={{ color: '#121212' }}>
                    {faq.question}
                  </span>
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300'
                    )}
                    style={{ background: activeFaq === i ? '#1F3B2D' : 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  >
                    <ChevronRight
                      className={cn(
                        'w-5 h-5 transition-transform duration-300',
                        activeFaq === i && 'rotate-90'
                      )}
                      style={{ color: activeFaq === i ? 'white' : '#1F3B2D' }}
                    />
                  </div>
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-in-out',
                    activeFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-7 pb-7 leading-relaxed" style={{ color: '#1F3B2D', opacity: 0.65, lineHeight: '1.75' }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 lg:py-40">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div
            className="rounded-[2.5rem] p-14 lg:p-20 text-center transition-all duration-500 hover:shadow-2xl"
            style={{ background: '#1F3B2D', boxShadow: '0 30px 60px rgba(31, 59, 45, 0.25)' }}
          >
            <div
              className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-10"
              style={{ background: '#F5A623' }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-7 leading-tight">
              Start managing money{' '}
              <span style={{ color: '#F5A623' }}>smarter today</span>
            </h2>
            <p className="text-lg mb-12 mx-auto leading-relaxed" style={{ color: 'white', opacity: 0.65, maxWidth: '540px' }}>
              Join thousands of users who are taking control of their finances with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button
                size="lg"
                className="text-black font-semibold h-[54px] px-11 rounded-full text-base transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{ background: '#F5A623' }}
                onClick={() => setCurrentPage('/register')}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-medium h-[54px] px-11 rounded-full text-base text-white transition-all duration-300 hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                onClick={() => setCurrentPage('/dashboard')}
              >
                View Demo
              </Button>
            </div>
            <p className="text-sm mt-10 font-medium" style={{ color: 'white', opacity: 0.4 }}>
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 lg:py-24" style={{ background: 'white' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-20 mb-16">
            {/* Logo & Socials */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: '#1F3B2D' }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-semibold text-xl" style={{ color: '#1F3B2D' }}>
                  ExpenseIQ
                </span>
              </div>
              <p className="text-sm mb-8 max-w-xs leading-relaxed" style={{ color: '#1F3B2D', opacity: 0.55 }}>
                AI-powered personal finance platform that helps you track, budget, and grow your money.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Github, href: '#', label: 'GitHub' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-md"
                    style={{ background: '#F8F6F2' }}
                  >
                    <social.icon className="w-5 h-5" style={{ color: '#1F3B2D' }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Integrations'] },
              { title: 'Resources', links: ['Blog', 'Help Center', 'Community'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact'] },
            ].map((section, i) => (
              <div key={i}>
                <p className="font-semibold mb-5" style={{ color: '#121212' }}>{section.title}</p>
                <ul className="space-y-3.5">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-sm transition-all duration-200 hover:opacity-80"
                        style={{ color: '#1F3B2D', opacity: 0.6 }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div
            className="rounded-2xl p-7 mb-14"
            style={{ background: '#F8F6F2' }}
          >
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="flex-1 text-center md:text-left">
                <p className="font-semibold mb-1.5" style={{ color: '#121212' }}>Stay in the loop</p>
                <p className="text-sm" style={{ color: '#1F3B2D', opacity: 0.55 }}>
                  Get the latest updates and financial tips delivered to your inbox.
                </p>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 md:w-60 px-5 py-3 rounded-full text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ background: 'white', color: '#1F3B2D', ringColor: '#1F3B2D' }}
                />
                <Button
                  className="rounded-full h-12 w-12 p-0"
                  style={{ background: '#1F3B2D' }}
                >
                  <Send className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-10 border-t" style={{ borderColor: '#F8F6F2' }}>
            <p className="text-sm font-medium" style={{ color: '#1F3B2D', opacity: 0.4 }}>
              © 2024 ExpenseIQ. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              {['Privacy Policy', 'Terms', 'Cookies'].map((link, i) => (
                <a key={i} href="#" className="text-sm font-medium transition-opacity hover:opacity-60" style={{ color: '#1F3B2D', opacity: 0.4 }}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
