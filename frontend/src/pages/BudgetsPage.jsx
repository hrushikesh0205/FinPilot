import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Pencil,
  AlertTriangle,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { budgets, categories } from '@/data/mockData';

export function BudgetsPage() {
  const [budgetData, setBudgetData] = useState(budgets);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editType, setEditType] = useState('total'); // 'total' or 'category'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editValue, setEditValue] = useState(0);

  const budgetPercent = Math.round(
    (budgetData.spent / budgetData.total) * 100
  );

  const handleEditTotal = () => {
    setBudgetData({
      ...budgetData,
      total: editValue,
      remaining: editValue - budgetData.spent,
    });
    setIsEditOpen(false);
  };

  const handleEditCategory = () => {
    if (selectedCategory) {
      setBudgetData({
        ...budgetData,
        categories: budgetData.categories.map((c) =>
          c.category === selectedCategory.category
            ? { ...c, budget: editValue }
            : c
        ),
      });
    }
    setIsEditOpen(false);
    setSelectedCategory(null);
  };

  const openEditDialog = (type, category = null) => {
    setEditType(type);
    if (type === 'total') {
      setEditValue(budgetData.total);
    } else {
      setSelectedCategory(category);
      setEditValue(category.budget);
    }
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">
            Set and manage your monthly budgets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            January 2024
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {budgetPercent > 75 && (
        <Alert
          className={cn(
            'border-amber-500/50 bg-amber-500/10',
            budgetPercent > 90 && 'border-rose-500/50 bg-rose-500/10'
          )}
        >
          <AlertTriangle
            className={cn(
              'h-4 w-4',
              budgetPercent > 90 ? 'text-rose-500' : 'text-amber-500'
            )}
          />
          <AlertTitle className="font-semibold">
            {budgetPercent > 90 ? 'Budget Alert!' : 'Budget Warning'}
          </AlertTitle>
          <AlertDescription>
            You have used {budgetPercent}% of your monthly budget.
            {budgetPercent > 90
              ? ' Consider reducing your spending immediately.'
              : ' Try to be more mindful of your expenses.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Total Budget Card */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <PiggyBank className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <CardTitle>Monthly Budget</CardTitle>
                <p className="text-sm text-muted-foreground">
                  January 2024
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditDialog('total')}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-3xl font-bold">
                ₹{budgetData.total.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                {budgetPercent > 80 ? (
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                )}
                <Badge
                  className={cn(
                    budgetPercent > 80
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  )}
                >
                  {budgetPercent}% Used
                </Badge>
              </div>
            </div>
          </div>
          <Progress value={budgetPercent} className="h-3" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-lg font-semibold text-rose-500">
                ₹{budgetData.spent.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-lg font-semibold text-emerald-500">
                ₹{budgetData.remaining.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-sm text-muted-foreground">Days Left</p>
              <p className="text-lg font-semibold">10</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <Card>
        <CardHeader>
          <CardTitle>Category Budgets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {budgetData.categories.map((category) => {
            const categoryPercent = Math.round(
              (category.spent / category.budget) * 100
            );

            return (
              <div key={category.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      ₹{category.spent.toLocaleString()} / ₹
                      {category.budget.toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog('category', category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Progress
                  value={Math.min(categoryPercent, 100)}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {categoryPercent > 100
                      ? 'Over budget by ₹' +
                        (category.spent - category.budget).toLocaleString()
                      : categoryPercent + '% used'}
                  </span>
                  <span
                    className={cn(
                      categoryPercent > 90 && 'text-rose-500 font-medium'
                    )}
                  >
                    ₹{(category.budget - category.spent).toLocaleString()} left
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Budget Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={budgetData.categories}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  type="number"
                  className="text-xs"
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  className="text-xs"
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="budget" name="Budget" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="spent" name="Spent" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Edit Budget Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editType === 'total'
                ? 'Edit Total Budget'
                : `Edit ${selectedCategory?.category} Budget`}
            </DialogTitle>
            <DialogDescription>
              {editType === 'total'
                ? 'Set your total monthly budget limit'
                : 'Adjust the budget for this category'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="budget-value">Budget Amount (₹)</Label>
              <Input
                id="budget-value"
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(parseFloat(e.target.value))}
              />
            </div>
            {editType === 'total' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  This will not affect your individual category budgets.
                  Categories will still use their allocated amounts.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={editType === 'total' ? handleEditTotal : handleEditCategory}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
