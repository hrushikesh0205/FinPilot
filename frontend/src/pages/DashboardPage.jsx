import { useState } from 'react';
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
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Calendar,
  CreditCard,
  Target,
  AlertCircle,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  transactions,
  budgets,
  monthlyData,
  categoryExpenses,
  upcomingBills,
  aiInsights,
} from '@/data/mockData';

const statCards = [
  {
    title: 'Total Balance',
    value: '₹1,45,000',
    change: '+12.5%',
    changeType: 'increase',
    icon: Wallet,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'Monthly Income',
    value: '₹1,10,000',
    change: '+8.2%',
    changeType: 'increase',
    icon: TrendingUp,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    title: 'Monthly Expense',
    value: '₹52,848',
    change: '-3.4%',
    changeType: 'decrease',
    icon: Receipt,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
  },
  {
    title: 'Savings Goal',
    value: '85%',
    change: '₹57,152',
    changeType: 'neutral',
    icon: Target,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
];

export function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState('Jan');

  const recentTransactions = transactions.slice(0, 5);
  const budgetPercent = Math.round((budgets.spent / budgets.total) * 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Rahul!</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            January 2024
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.changeType === 'increase' ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : stat.changeType === 'decrease' ? (
                      <ArrowDownRight className="w-4 h-4 text-rose-500" />
                    ) : null}
                    <span
                      className={cn(
                        'text-sm font-medium',
                        stat.changeType === 'increase' && 'text-emerald-500',
                        stat.changeType === 'decrease' && 'text-rose-500',
                        stat.changeType === 'neutral' && 'text-muted-foreground'
                      )}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                  <stat.icon className={cn('w-5 h-5', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Income vs Expense Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expense</CardTitle>
            <CardDescription>Monthly comparison for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category-wise Expense Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
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
                    formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {categoryExpenses.slice(0, 6).map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px]">
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          transaction.type === 'income'
                            ? 'bg-emerald-500/10'
                            : 'bg-muted'
                        )}
                      >
                        {transaction.type === 'income' ? (
                          <ArrowDownRight className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'font-semibold',
                          transaction.type === 'income'
                            ? 'text-emerald-500'
                            : 'text-foreground'
                        )}
                      >
                        {transaction.type === 'income' ? '+' : '-'}₹
                        {transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Insights */}
          <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <CardTitle className="text-lg">AI Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiInsights.slice(0, 3).map((insight) => (
                  <div
                    key={insight.id}
                    className="p-3 rounded-lg bg-card/50 border border-border"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                          insight.severity === 'warning'
                            ? 'bg-amber-500/20'
                            : insight.severity === 'success'
                            ? 'bg-emerald-500/20'
                            : 'bg-cyan-500/20'
                        )}
                      >
                        {insight.severity === 'warning' ? (
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                        ) : insight.severity === 'success' ? (
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-cyan-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{insight.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {insight.description.slice(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Bills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBills.slice(0, 3).map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{bill.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {bill.dueDate}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-rose-500">
                      ₹{bill.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Budget Progress</CardTitle>
              <CardDescription>
                You've spent {budgetPercent}% of your monthly budget
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
              {budgetPercent > 80
                ? 'Over Budget'
                : budgetPercent > 50
                ? 'On Track'
                : 'Great!'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={budgetPercent} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Spent: ₹{budgets.spent.toLocaleString()}
              </span>
              <span className="font-medium">
                Remaining: ₹{budgets.remaining.toLocaleString()}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {budgets.categories.slice(0, 4).map((cat, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((cat.spent / cat.budget) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(cat.spent / cat.budget) * 100}
                    className="h-1.5"
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>₹{cat.spent.toLocaleString()}</span>
                    <span>₹{cat.budget.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
