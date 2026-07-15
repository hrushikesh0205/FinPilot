export const transactions = [
  { id: 1, title: 'Grocery Shopping', amount: 2450, category: 'Food', date: '2024-01-15', notes: 'Weekly groceries at Big Bazaar', type: 'expense' },
  { id: 2, title: 'Uber Ride', amount: 350, category: 'Travel', date: '2024-01-14', notes: 'Office commute', type: 'expense' },
  { id: 3, title: 'Netflix Subscription', amount: 649, category: 'Entertainment', date: '2024-01-13', notes: 'Monthly subscription', type: 'expense' },
  { id: 4, title: 'Salary Credit', amount: 85000, category: 'Income', date: '2024-01-01', notes: 'Monthly salary', type: 'income' },
  { id: 5, title: 'Amazon Purchase', amount: 3200, category: 'Shopping', date: '2024-01-12', notes: 'Wireless headphones', type: 'expense' },
  { id: 6, title: 'Electricity Bill', amount: 1850, category: 'Bills', date: '2024-01-10', notes: 'Monthly electricity bill', type: 'expense' },
  { id: 7, title: 'Restaurant Dinner', amount: 1800, category: 'Food', date: '2024-01-09', notes: 'Family dinner at Olive Garden', type: 'expense' },
  { id: 8, title: 'Gym Membership', amount: 2500, category: 'Health', date: '2024-01-08', notes: 'Monthly gym fee', type: 'expense' },
  { id: 9, title: 'Flight Booking', amount: 8500, category: 'Travel', date: '2024-01-07', notes: 'Delhi to Mumbai round trip', type: 'expense' },
  { id: 10, title: 'Freelance Payment', amount: 25000, category: 'Income', date: '2024-01-05', notes: 'Web development project', type: 'income' },
  { id: 11, title: 'Medicines', amount: 850, category: 'Health', date: '2024-01-04', notes: 'Health supplements', type: 'expense' },
  { id: 12, title: 'Movie Tickets', amount: 600, category: 'Entertainment', date: '2024-01-03', notes: 'Weekend movie', type: 'expense' },
  { id: 13, title: 'Online Course', amount: 4999, category: 'Education', date: '2024-01-02', notes: 'Udemy React course', type: 'expense' },
  { id: 14, title: 'Mobile Recharge', amount: 449, category: 'Bills', date: '2024-01-01', notes: 'Jio prepaid recharge', type: 'expense' },
  { id: 15, title: 'Mutual Fund SIP', amount: 10000, category: 'Investments', date: '2024-01-05', notes: 'Monthly SIP investment', type: 'expense' },
];

export const categories = [
  { id: 1, name: 'Food', icon: 'UtensilsCrossed', color: '#f97316', budget: 15000 },
  { id: 2, name: 'Travel', icon: 'Car', color: '#06b6d4', budget: 8000 },
  { id: 3, name: 'Shopping', icon: 'ShoppingBag', color: '#ec4899', budget: 10000 },
  { id: 4, name: 'Entertainment', icon: 'Film', color: '#8b5cf6', budget: 5000 },
  { id: 5, name: 'Bills', icon: 'Receipt', color: '#ef4444', budget: 7000 },
  { id: 6, name: 'Health', icon: 'Heart', color: '#22c55e', budget: 5000 },
  { id: 7, name: 'Education', icon: 'GraduationCap', color: '#3b82f6', budget: 6000 },
  { id: 8, name: 'Investments', icon: 'TrendingUp', color: '#10b981', budget: 15000 },
];

export const accounts = [
  { id: 1, name: 'Cash Wallet', type: 'Cash', balance: 8500, isDefault: true },
  { id: 2, name: 'HDFC Bank', type: 'Bank Account', balance: 145000, isDefault: false },
  { id: 3, name: 'ICICI Credit Card', type: 'Credit Card', balance: -12500, isDefault: false },
  { id: 4, name: 'Paytm Wallet', type: 'Digital Wallet', balance: 3200, isDefault: false },
];

export const budgets = {
  total: 75000,
  spent: 52848,
  remaining: 22152,
  categories: [
    { category: 'Food', budget: 15000, spent: 4250, color: '#f97316' },
    { category: 'Travel', budget: 8000, spent: 8850, color: '#06b6d4' },
    { category: 'Shopping', budget: 10000, spent: 3200, color: '#ec4899' },
    { category: 'Entertainment', budget: 5000, spent: 1249, color: '#8b5cf6' },
    { category: 'Bills', budget: 7000, spent: 2299, color: '#ef4444' },
    { category: 'Health', budget: 5000, spent: 3350, color: '#22c55e' },
    { category: 'Education', budget: 6000, spent: 4999, color: '#3b82f6' },
    { category: 'Investments', budget: 15000, spent: 10000, color: '#10b981' },
  ],
};

export const monthlyData = [
  { month: 'Jan', income: 110000, expense: 52848 },
  { month: 'Feb', income: 105000, expense: 48720 },
  { month: 'Mar', income: 112000, expense: 62150 },
  { month: 'Apr', income: 98000, expense: 45320 },
  { month: 'May', income: 115000, expense: 58750 },
  { month: 'Jun', income: 120000, expense: 51200 },
];

export const categoryExpenses = [
  { name: 'Food', value: 4250, color: '#f97316' },
  { name: 'Travel', value: 8850, color: '#06b6d4' },
  { name: 'Shopping', value: 3200, color: '#ec4899' },
  { name: 'Entertainment', value: 1249, color: '#8b5cf6' },
  { name: 'Bills', value: 2299, color: '#ef4444' },
  { name: 'Health', value: 3350, color: '#22c55e' },
  { name: 'Education', value: 4999, color: '#3b82f6' },
  { name: 'Investments', value: 10000, color: '#10b981' },
];

export const upcomingBills = [
  { id: 1, name: 'Rent', amount: 25000, dueDate: '2024-02-01', status: 'pending' },
  { id: 2, name: 'Internet Bill', amount: 1299, dueDate: '2024-02-05', status: 'pending' },
  { id: 3, name: 'Credit Card Due', amount: 12500, dueDate: '2024-02-15', status: 'pending' },
  { id: 4, name: 'Insurance Premium', amount: 3500, dueDate: '2024-02-20', status: 'pending' },
];

export const aiInsights = [
  {
    id: 1,
    type: 'spending',
    title: 'Food spending increased by 18%',
    description: 'Your food expenses have increased from ₹3,600 to ₹4,250 compared to last month. Consider meal planning to reduce costs.',
    severity: 'warning',
    icon: 'TrendingUp',
  },
  {
    id: 2,
    type: 'saving',
    title: 'You can save ₹3,500 this month',
    description: 'Based on your spending patterns, reducing restaurant dining by 50% could save you ₹3,500 monthly.',
    severity: 'success',
    icon: 'PiggyBank',
  },
  {
    id: 3,
    type: 'alert',
    title: 'Entertainment expenses are above average',
    description: 'You spent ₹1,249 on entertainment, which is 15% above your 3-month average of ₹1,086.',
    severity: 'info',
    icon: 'Film',
  },
  {
    id: 4,
    type: 'insight',
    title: 'Travel budget exceeded by 10%',
    description: 'Your travel expenses (₹8,850) exceeded your budget of ₹8,000. Consider using public transport for short commutes.',
    severity: 'warning',
    icon: 'Car',
  },
  {
    id: 5,
    type: 'saving',
    title: 'Great job on investments!',
    description: 'You invested ₹10,000 this month, staying consistent with your investment goals.',
    severity: 'success',
    icon: 'TrendingUp',
  },
  {
    id: 6,
    type: 'insight',
    title: 'Subscription costs analysis',
    description: 'You have 4 active subscriptions totaling ₹2,100/month. Consider reviewing unused subscriptions.',
    severity: 'info',
    icon: 'CreditCard',
  },
];

export const notifications = [
  { id: 1, type: 'budget', title: 'Budget limit approaching', message: 'You have used 78% of your monthly budget', time: '2 hours ago', read: false },
  { id: 2, type: 'report', title: 'New monthly report available', message: 'Your December financial summary is ready to view', time: '1 day ago', read: false },
  { id: 3, type: 'ai', title: 'New AI insights generated', message: 'We found 3 new savings opportunities for you', time: '2 days ago', read: true },
  { id: 4, type: 'bill', title: 'Bill due soon', message: 'Your electricity bill of ₹1,850 is due in 3 days', time: '3 days ago', read: true },
  { id: 5, type: 'transaction', title: 'Large transaction detected', message: 'Flight booking of ₹8,500 detected on your HDFC account', time: '5 days ago', read: true },
];

export const faqs = [
  {
    question: 'How does ExpenseIQ track my expenses?',
    answer: 'ExpenseIQ allows you to manually add expenses or use our AI-powered receipt scanner to automatically extract transaction details. All your data is securely stored and accessible across devices.',
  },
  {
    question: 'Are my financial details secure?',
    answer: 'Yes! We use bank-level 256-bit encryption to protect your data. We never store your bank credentials, and all transactions are encrypted end-to-end.',
  },
  {
    question: 'How does the AI insights feature work?',
    answer: 'Our AI analyzes your spending patterns, identifies trends, and provides personalized recommendations to help you save money and manage your budget more effectively.',
  },
  {
    question: 'Can I export my financial data?',
    answer: 'Yes! You can export your data in PDF or Excel formats. Go to Reports and click on the Download button to get your financial summaries.',
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Currently, ExpenseIQ is available as a web application. Our mobile apps for iOS and Android are coming soon!',
  },
];
