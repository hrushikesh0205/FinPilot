import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  Target,
  AlertCircle,
  RefreshCw,
  Loader2,
  PiggyBank,
  Repeat,
  ShieldAlert,
  Coins,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuth } from '@/context/AuthContext';
import { getDashboardAnalytics } from '@/services/dashboardApi';

const PERIOD_OPTIONS = [
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_MONTH', label: 'Last Month' },
  { value: 'LAST_3_MONTHS', label: 'Last 3 Months' },
  { value: 'LAST_6_MONTHS', label: 'Last 6 Months' },
  { value: 'THIS_YEAR', label: 'This Year' },
  { value: 'ALL_TIME', label: 'All Time' },
];

export function DashboardPage({ setCurrentPage }) {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('THIS_MONTH');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async (period = selectedPeriod) => {
    setLoading(true);
    setError('');
    try {
      const res = await getDashboardAnalytics(period);
      setData(res.data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(selectedPeriod);
  }, [selectedPeriod]);

  const handlePeriodChange = (val) => {
    setSelectedPeriod(val);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <p className="text-muted-foreground text-sm font-medium">Loading financial intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-destructive font-medium">{error || 'Data unavailable'}</p>
        <Button onClick={() => fetchDashboard(selectedPeriod)} className="gap-2 bg-[#0F3D2E] text-white rounded-xl">
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    );
  }

  const categoryBreakdown = data.categoryBreakdown || [];
  const monthlyTrend = data.monthlyTrend || [];
  const budgetAlerts = data.budgetAlerts || [];
  const recurring = data.recurringSummary;
  const goals = data.goalsSummary;
  const recentTransactions = data.recentTransactions || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3D2E] dark:text-emerald-50">
            Financial Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name || 'FinPilot user'}! Overview for{' '}
            <strong className="text-foreground">{data.periodLabel}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Filter Dropdown */}
          <div className="flex items-center gap-2 bg-card border border-border/60 rounded-xl px-2.5 py-1 shadow-sm">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[140px] border-0 focus:ring-0 shadow-none h-8 text-xs font-semibold">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchDashboard(selectedPeriod)}
            className="rounded-xl shadow-sm hover:shadow"
            title="Refresh analytics"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
          </Button>
        </div>
      </div>

      {/* Budget Alerts Banner (if any category approaching or over budget) */}
      {budgetAlerts.length > 0 && (
        <Card className="rounded-2xl border-amber-500/30 bg-amber-500/10 dark:bg-amber-950/20 shadow-sm overflow-hidden">
          <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Smart Budget Attention ({budgetAlerts.length} Active Alert{budgetAlerts.length > 1 ? 's' : ''})
                </h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {budgetAlerts.map((b, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={`text-xs ${
                        b.statusCode === 'OVER_BUDGET'
                          ? 'border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/5'
                          : 'border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/5'
                      }`}
                    >
                      {b.category}: {b.percentageUsed}% ({b.status})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            {setCurrentPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage('/budgets')}
                className="text-xs rounded-xl border-amber-500/30 text-amber-800 dark:text-amber-200 hover:bg-amber-500/10 flex-shrink-0"
              >
                Review Budgets <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top 4 Core Metrics: Income, Spending, Savings Rate, Budget Usage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Income */}
        <Card className="rounded-2xl border-border/50 bg-white/70 dark:bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Income</p>
                <p className="text-2xl font-extrabold text-[#0F3D2E] dark:text-emerald-400 mt-1">
                  ₹{data.totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{data.periodLabel}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Total Spending */}
        <Card className="rounded-2xl border-border/50 bg-white/70 dark:bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Spending</p>
                <p className="text-2xl font-extrabold text-[#0F3D2E] dark:text-rose-400 mt-1">
                  ₹{data.totalSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{data.totalTransactionsCount} transactions</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600">
                <ArrowDownRight className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Savings Rate */}
        <Card className="rounded-2xl border-border/50 bg-white/70 dark:bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Savings Rate</p>
                <p className="text-2xl font-extrabold text-[#0F3D2E] dark:text-teal-400 mt-1">
                  {data.savingsRate}%
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Net: ₹{data.netSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600">
                <PiggyBank className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Budget Usage / Top Category */}
        <Card className="rounded-2xl border-border/50 bg-white/70 dark:bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Category</p>
                <p className="text-xl font-extrabold text-[#0F3D2E] dark:text-purple-300 mt-1 truncate">
                  {data.topSpendingCategory || 'None'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ₹{(data.topCategoryAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({data.topCategoryPercentage || 0}%)
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 flex-shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Grid: Spending by Category & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending by Category Pie Chart */}
        <Card className="rounded-2xl border-border/50 bg-white/70 dark:bg-card/60 backdrop-blur-sm shadow-sm lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Spending by Category</CardTitle>
            <CardDescription className="text-xs">Category allocation for {data.periodLabel}</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length === 0 ? (
              <div className="h-[240px] flex flex-col items-center justify-center text-muted-foreground text-xs space-y-2 border border-dashed rounded-xl">
                <Target className="w-8 h-8 opacity-40 text-emerald-500" />
                <p>No expense data in this period.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                        nameKey="name"
                      >
                        {categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spent']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {categoryBreakdown.slice(0, 5).map((cat, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-medium text-foreground">{cat.name}</span>
                      </div>
                      <span className="text-muted-foreground font-semibold">
                        ₹{(cat.value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({cat.percent || 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Spending & Income Trend Chart */}
        <Card className="rounded-2xl border-border/50 bg-white/70 dark:bg-card/60 backdrop-blur-sm shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Income vs Spending Trend</CardTitle>
                <CardDescription className="text-xs">Past 6-month historical cash flow</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                Monthly Breakdown
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {monthlyTrend.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground text-xs border border-dashed rounded-xl">
                No cash flow records found.
              </div>
            ) : (
              <div className="h-[260px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="monthLabel" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    />
                    <Tooltip
                      formatter={(val, name) => [`₹${Number(val).toLocaleString('en-IN')}`, name]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Intelligence Row: Recurring Summary, Savings Goal Progress, AI Insight snippet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recurring Payments Summary */}
        <Card className="rounded-2xl border-border/50 bg-white/70 dark:bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-emerald-600" />
                <CardTitle className="text-base font-bold">Recurring Payments</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                {recurring?.activeCount || 0} Active
              </Badge>
            </div>
            <CardDescription className="text-xs">Committed recurring expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-medium">Monthly Obligation</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                ₹{(recurring?.monthlyTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                <span className="text-xs text-muted-foreground font-normal ml-1">/ month</span>
              </p>
            </div>

            <div className="text-xs text-muted-foreground space-y-1.5">
              <div className="flex justify-between">
                <span>Next Upcoming:</span>
                <span className="font-semibold text-foreground">
                  {recurring?.nextUpcomingTitle || 'None scheduled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Due Date:</span>
                <span className="text-foreground">{recurring?.nextUpcomingDate || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Detected Patterns:</span>
                <span className="text-emerald-600 font-semibold">{recurring?.suggestionsCount || 0} suggestions</span>
              </div>
            </div>

            {setCurrentPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage('/recurring')}
                className="w-full text-xs rounded-xl gap-1 mt-2"
              >
                Manage Recurring <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Savings Goal Progress */}
        <Card className="rounded-2xl border-border/50 bg-white/70 dark:bg-card/60 backdrop-blur-sm shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <CardTitle className="text-base font-bold">Savings Goals</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">
                {goals?.totalGoals || 0} Goals
              </Badge>
            </div>
            <CardDescription className="text-xs">Long-term target achievement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-lg text-foreground">
                  ₹{(goals?.totalSaved || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
                <span className="text-xs text-muted-foreground">
                  Target: ₹{(goals?.totalTarget || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <Progress value={goals?.progressPercentage || 0} className="h-2.5 bg-muted rounded-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{goals?.progressPercentage || 0}% completed</span>
                <span>{goals?.completedGoals || 0} goals achieved</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300">
              💡 Consistent contributions to your savings goals build robust financial resilience.
            </div>

            {setCurrentPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage('/goals')}
                className="w-full text-xs rounded-xl gap-1 mt-2"
              >
                View Goals <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* AI Financial Insights Teaser */}
        <Card className="rounded-2xl border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card backdrop-blur-sm shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <CardTitle className="text-base font-bold">FinPilot AI Advisor</CardTitle>
              </div>
              <Badge className="bg-emerald-600 text-white text-[11px]">Gemini 2.5</Badge>
            </div>
            <CardDescription className="text-xs">Intelligent financial assessment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-foreground/90 leading-relaxed italic bg-white/60 dark:bg-card/60 p-3 rounded-xl border border-emerald-500/20">
              {data.totalSpending === 0 && data.totalIncome === 0
                ? '"Start logging transactions or import your bank statement to receive real-time AI spending diagnostics and custom saving strategies."'
                : data.savingsRate >= 20
                ? `You maintain a healthy savings rate of ${data.savingsRate}%. Focus on optimizing top category (${data.topSpendingCategory}) to boost surplus funds.`
                : `Your current savings rate is ${data.savingsRate}%. Review category budgets to keep discretionary spending below 80% limit.`}
            </p>

            <div className="text-xs space-y-1 text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Multimodal receipt extraction ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Zero database exposure via secure Spring Boot proxy</span>
              </div>
            </div>

            {setCurrentPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage('/insights')}
                className="w-full text-xs rounded-xl gap-1 mt-2 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-600/20"
              >
                Deep AI Insights <Sparkles className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions List */}
      <Card className="rounded-2xl border-border/50 bg-white/70 dark:bg-card/60 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Transactions</CardTitle>
              <CardDescription className="text-xs">Latest recorded activity in {data.periodLabel}</CardDescription>
            </div>
            {setCurrentPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('/expenses')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs border border-dashed rounded-xl">
              No transactions recorded for this period. Add an expense or import a statement.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {recentTransactions.map((tx) => {
                const isIncome = tx.type?.toLowerCase() === 'income';
                return (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isIncome
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-rose-500/10 text-rose-600'
                        }`}
                      >
                        {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{tx.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{tx.expenseDate}</span>
                          <span>•</span>
                          <span>{tx.category || 'General'}</span>
                          {tx.account && (
                            <>
                              <span>•</span>
                              <span>{tx.account}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                      }`}
                    >
                      {isIncome ? '+' : '-'}₹{(tx.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
export default DashboardPage;
