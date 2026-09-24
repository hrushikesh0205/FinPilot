import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  CreditCard,
  Target,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useToast } from '@/hooks/use-toast';
import { getFinancialInsights } from '@/services/aiApi';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const insightCategories = [
  { id: 'all', name: 'All Insights', icon: Lightbulb },
  { id: 'spending', name: 'Spending', icon: TrendingUp },
  { id: 'saving', name: 'Saving', icon: PiggyBank },
  { id: 'alert', name: 'Alerts', icon: AlertCircle },
];

const spendingTrend = [
  { day: 'Mon', amount: 1200 },
  { day: 'Tue', amount: 800 },
  { day: 'Wed', amount: 2500 },
  { day: 'Thu', amount: 400 },
  { day: 'Fri', amount: 3200 },
  { day: 'Sat', amount: 4500 },
  { day: 'Sun', amount: 1800 },
];

function classifyInsight(text, index) {
  const lower = text.toLowerCase();
  if (lower.includes('alert') || lower.includes('warning') || lower.includes('exceed') || lower.includes('over budget') || lower.includes('limit')) {
    return {
      id: `ai-ins-${index}`,
      title: 'Budget Alert',
      description: text,
      type: 'alert',
      severity: 'warning',
      icon: AlertCircle,
    };
  }
  if (lower.includes('sav') || lower.includes('reduc') || lower.includes('cut') || lower.includes('optimiz')) {
    return {
      id: `ai-ins-${index}`,
      title: 'Savings Opportunity',
      description: text,
      type: 'saving',
      severity: 'success',
      icon: PiggyBank,
    };
  }
  return {
    id: `ai-ins-${index}`,
    title: 'Spending Pattern',
    description: text,
    type: 'spending',
    severity: 'info',
    icon: TrendingUp,
  };
}

export function InsightsPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hasGenerated, setHasGenerated] = useState(false);

  // Automatically fetch real insights on first load
  useEffect(() => {
    handleGenerateInsights(true);
  }, []);

  const handleGenerateInsights = async (isInitial = false) => {
    setIsGenerating(true);
    try {
      const res = await getFinancialInsights();
      setAiData(res.data);
      setHasGenerated(true);
      if (!isInitial) {
        toast({
          title: 'Insights Updated',
          description: 'AI analyzed your latest transactions and budgets.',
        });
      }
    } catch (err) {
      console.error('Failed to generate AI insights:', err);
      const errMsg = err?.response?.data?.message || 'Could not fetch AI insights. Please verify OpenRouter configuration.';
      if (!isInitial) {
        toast({
          title: 'Analysis Failed',
          description: errMsg,
          variant: 'destructive',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const parsedInsights = (aiData?.keyInsights || []).map((text, idx) =>
    classifyInsight(text, idx)
  );

  const filteredInsights = parsedInsights.filter(
    (insight) => selectedCategory === 'all' || insight.type === selectedCategory
  );

  const totalSpent = aiData?.totalSpent || 0;
  const totalBudget = aiData?.totalBudget || 0;
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const recommendations = aiData?.recommendations || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">AI Financial Insights</h1>
          <p className="text-muted-foreground">
            Personalized intelligence and saving strategies powered by OpenRouter AI
          </p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md hover:shadow-emerald-500/20"
          onClick={() => handleGenerateInsights(false)}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh AI Insights
            </>
          )}
        </Button>
      </div>

      {/* Hero Welcome Card (Only shown if never generated and not loading) */}
      {!hasGenerated && !isGenerating && (
        <Card className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-violet-500/10 border-emerald-500/20">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Unlock AI-Powered Insights</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Our backend AI analyzes your real spending patterns, monitors your budgets, and delivers
              tailored recommendations to accelerate your savings.
            </p>
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={() => handleGenerateInsights(false)}
              disabled={isGenerating}
            >
              <Sparkles className="w-5 h-5" />
              Generate Real AI Insights
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
          <CardContent className="p-10">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                <Sparkles className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">FinPilot AI is analyzing your finances…</p>
                <p className="text-sm text-muted-foreground">
                  Evaluating category spending, budget limits, and savings opportunities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Content */}
      {hasGenerated && !isGenerating && (
        <>
          {/* AI Health Summary Card */}
          {aiData?.summary && (
            <Card className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-500/25 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">Financial Health Summary</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-0 text-xs">
                        Real-time AI
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {aiData.summary}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats Grid */}
          <div className="grid sm:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-xl font-bold">₹{totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-xl font-bold">₹{totalBudget.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5 border-violet-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <PiggyBank className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {totalBudget > 0 ? 'Budget Remaining' : 'Savings Tracked'}
                    </p>
                    <p className="text-xl font-bold">₹{remainingBudget.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Key Insights</p>
                    <p className="text-xl font-bold">{parsedInsights.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spending Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Pattern Analysis</CardTitle>
              <CardDescription>Visual distribution of expenditures over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#10b981"
                      fill="url(#colorGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {insightCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Insights Cards */}
          {filteredInsights.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              No insights under this filter category. Try selecting "All Insights".
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredInsights.map((insight) => {
                const IconComponent = insight.icon;
                return (
                  <Card
                    key={insight.id}
                    className={cn(
                      'group hover:shadow-lg transition-all duration-300',
                      insight.severity === 'warning'
                        ? 'bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20'
                        : insight.severity === 'success'
                        ? 'bg-gradient-to-br from-emerald-500/5 to-green-500/5 border-emerald-500/20'
                        : 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20'
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                            insight.severity === 'warning'
                              ? 'bg-amber-500/20 text-amber-500'
                              : insight.severity === 'success'
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : 'bg-cyan-500/20 text-cyan-500'
                          )}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{insight.title}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs capitalize',
                                insight.severity === 'warning'
                                  ? 'border-amber-500/30 text-amber-600 dark:text-amber-400'
                                  : insight.severity === 'success'
                                  ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                  : 'border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
                              )}
                            >
                              {insight.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Action Suggestions */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  AI Suggested Actions & Recommendations
                </CardTitle>
                <CardDescription>
                  Custom-tailored financial steps based on your recent activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors gap-3 border border-border/50"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <span className="text-sm font-medium leading-relaxed">{rec}</span>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                        <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                          Action Item
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
