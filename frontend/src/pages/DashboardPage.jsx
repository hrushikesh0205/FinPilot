import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Target,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getDashboard, getMonthlySummary } from '@/api/dashboardApi';
import { getAllExpenses } from '@/api/expenseApi';
import { getBudgetSummary } from '@/api/budgetApi';

const CATEGORY_COLORS = [
  '#f97316', '#06b6d4', '#ec4899', '#8b5cf6',
  '#ef4444', '#22c55e', '#3b82f6', '#10b981',
  '#f59e0b', '#6366f1', '#14b8a6', '#e11d48',
];

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardPage({ setCurrentPage }) {
  const { user } = useAuth();
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, monthRes, expRes, budRes] = await Promise.all([
        getDashboard(),
        getMonthlySummary(selectedYear, selectedMonth),
        getAllExpenses(),
        getBudgetSummary(selectedYear, selectedMonth),
      ]);
      setDashboardData(dashRes.data);
      setMonthlyData(monthRes.data);
      setExpenses(expRes.data || []);
      setBudgetSummary(budRes.data || []);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [selectedYear, selectedMonth]);

  // Build category pie chart data from all expenses
  const categoryMap = {};
  expenses.forEach((exp) => {
    const cat = exp.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + (exp.amount || 0);
  });
  const categoryExpenses = Object.entries(categoryMap).map(([name, value], i) => ({
    name,
    value,
    color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  // Recent 5 expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))
    .slice(0, 5);

  // Budget progress totals
  const totalBudget = budgetSummary.reduce((s, b) => s + (b.monthlyLimit || 0), 0);
  const totalSpent = budgetSummary.reduce((s, b) => s + (b.totalSpent || 0), 0);
  const budgetPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const displayMonth = `${monthNames[selectedMonth - 1]} ${selectedYear}`;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-muted rounded w-32 animate-pulse mb-2" />
            <div className="h-4 bg-muted rounded w-48 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchAll} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'there'}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            {displayMonth}
          </Button>
          <Button variant="outline" size="icon" onClick={fetchAll}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Expenses */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₹{(dashboardData?.totalExpenses || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground">All time</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10">
                <Receipt className="w-5 h-5 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Highest Expense */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Highest Expense</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ₹{(dashboardData?.highestExpense || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground">Single transaction</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {dashboardData?.totalTransactions || 0}
                </p>
                <p className="text-sm text-muted-foreground">All time</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <Wallet className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary Cards */}
      {monthlyData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Monthly Expenses</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{(monthlyData.totalExpenses || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>
          <Card className="border-cyan-500/20 bg-cyan-500/5">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Monthly Transactions</p>
              <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                {monthlyData.totalTransactions || 0}
              </p>
            </CardContent>
          </Card>
          <Card className="border-violet-500/20 bg-violet-500/5">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Highest This Month</p>
              <p className="text-xl font-bold text-violet-600 dark:text-violet-400">
                ₹{(monthlyData.highestExpense || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Pie Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryExpenses.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                No expense data yet
              </div>
            ) : (
              <>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryExpenses}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryExpenses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [`₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                  {categoryExpenses.slice(0, 6).map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-muted-foreground truncate">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setCurrentPage && setCurrentPage('/expenses')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {recentExpenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                    <Receipt className="w-8 h-8 mb-2 opacity-40" />
                    No expenses yet. Add your first expense!
                  </div>
                ) : (
                  recentExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                          <ArrowUpRight className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{expense.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {expense.category} • {expense.expenseDate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-rose-500">
                          -₹{(expense.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Budget Progress */}
      {budgetSummary.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Budget Progress</CardTitle>
                <CardDescription>
                  You've spent {budgetPercent}% of your monthly budget for {displayMonth}
                </CardDescription>
              </div>
              <Badge
                variant={budgetPercent > 80 ? 'destructive' : 'default'}
                className={
                  budgetPercent <= 50
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : budgetPercent <= 80
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : ''
                }
              >
                {budgetPercent > 80 ? 'Over Budget' : budgetPercent > 50 ? 'On Track' : 'Great!'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={Math.min(budgetPercent, 100)} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Spent: ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className="font-medium">
                  Budget: ₹{totalBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Category Budget Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {budgetSummary.slice(0, 4).map((b, i) => {
                  const pct = b.monthlyLimit > 0 ? Math.round((b.totalSpent / b.monthlyLimit) * 100) : 0;
                  return (
                    <div key={i} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium truncate">{b.category}</span>
                        <span className={cn('text-xs', b.isOverBudget ? 'text-rose-500 font-semibold' : 'text-muted-foreground')}>
                          {pct}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(pct, 100)}
                        className={cn('h-1.5', b.isOverBudget && '[&>div]:bg-rose-500')}
                      />
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>₹{(b.totalSpent || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        <span>₹{(b.monthlyLimit || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      {b.isOverBudget && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">Over budget!</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
