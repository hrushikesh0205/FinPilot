import {
  TrendingUp, Shield, BarChart3, PiggyBank, Receipt, Sparkles, Target
} from 'lucide-react';

export const C = {
  primary: '#0F3D2E',
  accent:  '#16A34A',
  amber:   '#F59E0B',
  bg:      '#FAFAF8',
};

export const FEATURES = [
  { icon: BarChart3, title: 'Smart Expense Tracking',   desc: 'Track every income and expense with intelligent categorization, account management, and real-time financial updates.', color: '#F59E0B', bg: '#FEF3C7' },
  { icon: Sparkles,  title: 'AI Financial Advisor ⭐',  desc: 'Receive personalized spending insights, saving recommendations, budget alerts, and AI-powered financial guidance based on your transaction history.', color: '#16A34A', bg: '#DCFCE7' },
  { icon: Receipt,   title: 'AI Receipt Scanner',       desc: 'Upload a receipt and let AI automatically extract merchant details, total amount, date, GST, and category for one-click expense entry.', color: '#8B5CF6', bg: '#EDE9FE' },
  { icon: PiggyBank, title: 'Intelligent Budget Planner', desc: 'Create monthly budgets, monitor spending progress, receive overspending alerts, and stay on track with your financial goals.', color: '#EC4899', bg: '#FCE7F3' },
  { icon: TrendingUp,title: 'Interactive Reports & Analytics', desc: 'Visualize income, expenses, savings, and spending trends with beautiful charts and export reports in PDF or Excel format.', color: '#3B82F6', bg: '#DBEAFE' },
  { icon: Shield,    title: 'Secure Multi-Account Management', desc: 'Manage bank accounts, wallets, and cards securely with JWT authentication, encrypted data, and a unified financial dashboard.', color: '#06B6D4', bg: '#CFFAFE' },
];

export const TESTIMONIALS = [
  { name: 'Priya Mehta',   role: 'Software Engineer', company: 'Google',    text: 'FinPilot completely changed how I think about money. The AI insights helped me save ₹15,000 in just two months.',       initials: 'PM', avatarBg: '#DCFCE7', avatarColor: '#16A34A' },
  { name: 'Arjun Patel',   role: 'Founder & CEO',     company: 'TechFlow',  text: 'The receipt scanner alone saves me hours every week. This is what modern finance management should look like.',          initials: 'AP', avatarBg: '#DBEAFE', avatarColor: '#2563EB' },
  { name: 'Sneha Sharma',  role: 'Product Manager',   company: 'Microsoft', text: 'Finally a finance app that understands me. The AI recommendations are incredibly accurate and actually actionable.',     initials: 'SS', avatarBg: '#FEF3C7', avatarColor: '#D97706' },
];

export const FAQS = [
  { q: 'Is FinPilot free to use?',                    a: 'Yes! We offer a generous free tier with essential expense tracking and basic AI insights. Premium features are available for power users who need advanced analytics and unlimited receipt scanning.' },
  { q: 'How secure is my financial data?',             a: 'We use 256-bit AES encryption, SOC 2 certified infrastructure, and zero-knowledge architecture. Your credentials are never stored on our servers — we apply bank-level security protocols throughout.' },
  { q: 'Can I connect my bank accounts?',              a: 'Absolutely. We support secure connections with 100+ Indian banks and financial institutions through regulated APIs. Your login credentials are never stored on our servers.' },
  { q: 'Does FinPilot work on mobile?',                a: 'FinPilot is fully responsive and works beautifully on any device. Native iOS and Android apps are launching soon with even more powerful features.' },
  { q: 'How does the AI learn my spending patterns?',  a: 'Our AI analyzes your transaction history, spending categories, and financial goals over time to deliver increasingly accurate insights and smarter budget recommendations personalized just for you.' },
];

export const NAV = [
  { label: 'Platform',     id: 'features' },
  { label: 'AI Advisor',  id: 'ai-insights' },
  { label: 'Review', id: 'testimonials' },
  { label: 'Help Center',          id: 'faq' },
];

export const AI_INSIGHTS = [
  { icon: TrendingUp, text: 'You spent 18% more on food this month',         color: '#F59E0B' },
  { icon: PiggyBank,  text: 'Cutting restaurants could save you ₹3,500',     color: '#16A34A' },
  { icon: Target,     text: 'Travel expenses decreased by 12% — great job!', color: '#8B5CF6' },
  { icon: Sparkles,   text: 'Your savings goal is 85% complete 🎉',           color: '#EC4899' },
];
