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
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Film,
  Car,
  UtensilsCrossed,
  Target,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiInsights, budgets, categoryExpenses, monthlyData } from '@/data/mockData';
import {
  LineChart,
  Line,
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

export function InsightsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedInsights, setGeneratedInsights] = useState(aiInsights);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateInsights = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedInsights(aiInsights);
      setIsGenerating(false);
      setHasGenerated(true);
    }, 2000);
  };

  const filteredInsights = generatedInsights.filter(
    (insight) => selectedCategory === 'all' || insight.type === selectedCategory
  );

  const getIconComponent = (iconName) => {
    const icons = {
      TrendingUp,
      PiggyBank,
      AlertCircle,
      Film,
      Car,
      UtensilsCrossed,
      CreditCard,
      Lightbulb,
    };
    return icons[iconName] || Lightbulb;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">AI Insights</h1>
          <p className="text-muted-foreground">
            Personalized financial recommendations powered by AI
          </p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
          onClick={handleGenerateInsights}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Insights
            </>
          )}
        </Button>
      </div>

      {/* AI Animation Card */}
      {!hasGenerated && (
        <Card className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/5 to-violet-500/10 border-emerald-500/20">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Unlock AI-Powered Insights</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Our AI analyzes your spending patterns, identifies trends, and provides
              personalized recommendations to help you save more money.
            </p>
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleGenerateInsights}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Your Data...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Insights
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
                <Sparkles className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="font-medium">Analyzing your finances...</p>
                <p className="text-sm text-muted-foreground">
                  Processing 156 transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Grid */}
      {hasGenerated && !isGenerating && (
        <>
          {/* Quick Stats */}
          <div className="grid sm:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <PiggyBank className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Savings Found</p>
                    <p className="text-xl font-bold">₹8,500</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reduced By</p>
                    <p className="text-xl font-bold">15%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-violet-500/10 to-violet-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Goals</p>
                    <p className="text-xl font-bold">3/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alerts</p>
                    <p className="text-xl font-bold">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spending Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>This Week's Spending Pattern</CardTitle>
              <CardDescription>AI detected unusual spending on Saturday</CardDescription>
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
                      formatter={(value) => [`₹${value.toLocaleString()}`, '']}
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
          <div className="grid md:grid-cols-2 gap-4">
            {filteredInsights.map((insight) => {
              const IconComponent = getIconComponent(insight.icon);

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
                            ? 'bg-amber-500/20'
                            : insight.severity === 'success'
                            ? 'bg-emerald-500/20'
                            : 'bg-cyan-500/20'
                        )}
                      >
                        <IconComponent
                          className={cn(
                            'w-6 h-6',
                            insight.severity === 'warning'
                              ? 'text-amber-500'
                              : insight.severity === 'success'
                              ? 'text-emerald-500'
                              : 'text-cyan-500'
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{insight.title}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
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
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Suggested Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: 'Set up automatic savings transfer',
                    impact: 'Save ₹5,000/month',
                    priority: 'high',
                  },
                  {
                    action: 'Reduce restaurant spending by 30%',
                    impact: 'Save ₹2,500/month',
                    priority: 'medium',
                  },
                  {
                    action: 'Review and cancel unused subscriptions',
                    impact: 'Save ₹1,200/month',
                    priority: 'low',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          item.priority === 'high'
                            ? 'bg-rose-500'
                            : item.priority === 'medium'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        )}
                      />
                      <span className="font-medium">{item.action}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400">
                        {item.impact}
                      </Badge>
                      <Button size="sm">Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
