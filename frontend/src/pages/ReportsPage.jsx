import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Printer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { monthlyData, categoryExpenses, transactions, budgets } from '@/data/mockData';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const expenseByDay = [
  { date: 'Week 1', amount: 12500 },
  { date: 'Week 2', amount: 8900 },
  { date: 'Week 3', amount: 15300 },
  { date: 'Week 4', amount: 16148 },
];

const incomeBreakdown = [
  { source: 'Salary', amount: 85000, color: '#10b981' },
  { source: 'Freelance', amount: 25000, color: '#06b6d4' },
];

const totalIncome = incomeBreakdown.reduce((sum, i) => sum + i.amount, 0);
const totalExpense = categoryExpenses.reduce((sum, e) => sum + e.value, 0);
const netSavings = totalIncome - totalExpense;

export function ReportsPage() {
  const [selectedTab, setSelectedTab] = useState('monthly');

  const handleDownloadPDF = () => {
    alert('PDF download feature would be implemented here');
  };

  const handleExportExcel = () => {
    alert('Excel export feature would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download financial reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            January 2024
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportExcel}>
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button size="sm" className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600" onClick={handleDownloadPDF}>
            <FileText className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold">{totalIncome.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-emerald-500">+8.5% vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">{totalExpense.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="w-4 h-4 text-rose-500" />
                  <span className="text-sm text-rose-500">-3.2% vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Savings</p>
                <p className="text-2xl font-bold">{netSavings.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-cyan-500">52% of income</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <PieChartIcon className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="monthly" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Monthly
          </TabsTrigger>
          <TabsTrigger value="category" className="gap-2">
            <PieChartIcon className="w-4 h-4" />
            Category
          </TabsTrigger>
          <TabsTrigger value="income" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Income
          </TabsTrigger>
          <TabsTrigger value="expense" className="gap-2">
            <TrendingDown className="w-4 h-4" />
            Expense
          </TabsTrigger>
        </TabsList>

        {/* Monthly Report */}
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income vs Expense</CardTitle>
              <CardDescription>6-month comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
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

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Savings Trend</CardTitle>
                <CardDescription>Monthly savings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
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
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        dot={{ fill: '#f43f5e' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Spending</CardTitle>
                <CardDescription>Current month breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseByDay}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                      />
                      <Bar dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Category Report */}
        <TabsContent value="category" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryExpenses}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
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
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryExpenses.map((cat) => {
                    const percent = Math.round((cat.value / totalExpense) * 100);
                    return (
                      <div key={cat.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="font-medium">{cat.name}</span>
                          </div>
                          <span className="text-sm">
                            ₹{cat.value.toLocaleString()} ({percent}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${percent}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Income Report */}
        <TabsContent value="income" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <CardDescription>Where your income comes from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="amount"
                        nameKey="source"
                      >
                        {incomeBreakdown.map((entry, index) => (
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
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {incomeBreakdown.map((source) => (
                    <div key={source.source} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{source.source}</span>
                        <span className="text-lg font-bold">₹{source.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          style={{ borderColor: source.color, color: source.color }}
                        >
                          {Math.round((source.amount / totalIncome) * 100)}%
                        </Badge>
                        <span className="text-sm text-muted-foreground">of total income</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expense Report */}
        <TabsContent value="expense" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
              <CardDescription>Detailed breakdown of your spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryExpenses} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                    <YAxis dataKey="name" type="category" className="text-xs" width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {categoryExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
