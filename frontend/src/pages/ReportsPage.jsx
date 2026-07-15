import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { getReportSummary, getMonthlyReport, getCategoryReport } from '@/services/reportApi';

// ── Tooltip style shared by all charts ──────────────────────────────────
const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
  },
  formatter: (value) => [`₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, ''],
};

// ── Empty chart placeholder ──────────────────────────────────────────────
function EmptyChart({ height = 350 }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed border-border"
      style={{ height }}
    >
      <BarChart3 className="w-10 h-10 mb-3 opacity-30" />
      <p className="font-medium text-foreground">No report data available.</p>
      <p className="text-sm mt-1">Add expenses to see your reports here.</p>
    </div>
  );
}

export function ReportsPage() {
  const [selectedTab, setSelectedTab] = useState('monthly');

  // ── Data state ──────────────────────────────────────────────────────────
  const [summary, setSummary]           = useState(null);
  const [monthlyData, setMonthlyData]   = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // ── Load all report data ────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sumRes, monthRes, catRes] = await Promise.all([
        getReportSummary(),
        getMonthlyReport(),
        getCategoryReport(),
      ]);
      setSummary(sumRes.data);
      setMonthlyData(monthRes.data || []);
      setCategoryData(catRes.data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Derived values ──────────────────────────────────────────────────────
  const totalExpenses     = summary?.totalExpenses     ?? 0;
  const totalTransactions = summary?.totalTransactions ?? 0;
  const highestExpense    = summary?.highestExpense    ?? 0;
  const hasMonthlyData    = monthlyData.some((m) => m.expense > 0);
  const hasCategoryData   = categoryData.length > 0;

  // ── Loading state ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and download financial reports</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchAll} className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and download financial reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchAll}
            className="rounded-lg"
            title="Refresh reports"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => alert('Excel export feature coming soon')}
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
            onClick={() => alert('PDF download feature coming soon')}
          >
            <FileText className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Total Expenses */}
        <Card className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">
                  {totalExpenses.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {totalTransactions} transaction{totalTransactions !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Highest Expense */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Expense</p>
                <p className="text-2xl font-bold">
                  {highestExpense.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">Single transaction</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-cyan-500">All time</span>
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
          <TabsTrigger value="expense" className="gap-2">
            <TrendingDown className="w-4 h-4" />
            Expense
          </TabsTrigger>
        </TabsList>

        {/* ── Monthly Tab ──────────────────────────────────────────────── */}
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expenses (Last 6 Months)</CardTitle>
              <CardDescription>Your spending trend over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              {!hasMonthlyData ? (
                <EmptyChart height={350} />
              ) : (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Trend</CardTitle>
              <CardDescription>Monthly spending over time</CardDescription>
            </CardHeader>
            <CardContent>
              {!hasMonthlyData ? (
                <EmptyChart height={250} />
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                      <Tooltip {...tooltipStyle} />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#f43f5e"
                        strokeWidth={2}
                        dot={{ fill: '#f43f5e' }}
                        name="Expenses"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Category Tab ─────────────────────────────────────────────── */}
        <TabsContent value="category" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </CardHeader>
              <CardContent>
                {!hasCategoryData ? (
                  <EmptyChart height={300} />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip {...tooltipStyle} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {!hasCategoryData ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
                    <PieChartIcon className="w-10 h-10 mb-3 opacity-30" />
                    <p className="font-medium text-foreground">No report data available.</p>
                    <p className="mt-1">Add expenses to see category breakdown.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categoryData.map((cat) => (
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
                            ₹{cat.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({cat.percent}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Expense Tab ───────────────────────────────────────────────── */}
        <TabsContent value="expense" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Analysis</CardTitle>
              <CardDescription>Detailed breakdown of your spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              {!hasCategoryData ? (
                <EmptyChart height={350} />
              ) : (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        type="number"
                        className="text-xs"
                        tickFormatter={(v) => `₹${v / 1000}k`}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        className="text-xs"
                        width={90}
                      />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
