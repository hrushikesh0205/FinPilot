import { useState, useEffect, useCallback } from 'react';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
} from 'recharts';
import {
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import {
  getAllBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
} from '@/services/budgetApi';

const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Entertainment',
  'Bills', 'Health', 'Education', 'Investments', 'Other',
];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const emptyForm = { category: '', monthlyLimit: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() };

export function BudgetsPage() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  const [budgets, setBudgets] = useState([]);       // raw budget list
  const [summary, setSummary] = useState([]);       // BudgetSummaryResponse list
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  // Dialogs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [budgetsRes, summaryRes] = await Promise.all([
        getAllBudgets(),
        getBudgetSummary(selectedYear, selectedMonth),
      ]);
      setBudgets(budgetsRes.data || []);
      setSummary(summaryRes.data || []);
    } catch (err) {
      setError('Failed to load budget data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Computed totals ────────────────────────────────────────────────────────

  const totalBudget = summary.reduce((s, b) => s + (b.monthlyLimit || 0), 0);
  const totalSpent = summary.reduce((s, b) => s + (b.totalSpent || 0), 0);
  const totalRemaining = summary.reduce((s, b) => s + (b.remaining || 0), 0);
  const budgetPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleCreate = async () => {
    setFormError('');
    if (!form.category) { setFormError('Please select a category.'); return; }
    if (!form.monthlyLimit || parseFloat(form.monthlyLimit) <= 0) {
      setFormError('Enter a valid budget amount greater than 0.'); return;
    }

    setSaving(true);
    try {
      await createBudget({
        category: form.category,
        monthlyLimit: parseFloat(form.monthlyLimit),
        month: parseInt(form.month),
        year: parseInt(form.year),
      });
      setIsAddOpen(false);
      setForm(emptyForm);
      await fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create budget.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setFormError('');
    if (!form.monthlyLimit || parseFloat(form.monthlyLimit) <= 0) {
      setFormError('Enter a valid budget amount greater than 0.'); return;
    }

    setSaving(true);
    try {
      await updateBudget(selectedBudget.id, {
        category: form.category || selectedBudget.category,
        monthlyLimit: parseFloat(form.monthlyLimit),
        month: parseInt(form.month),
        year: parseInt(form.year),
      });
      setIsEditOpen(false);
      setSelectedBudget(null);
      await fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update budget.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteBudget(selectedBudget.id);
      setIsDeleteOpen(false);
      setSelectedBudget(null);
      await fetchAll();
    } catch (err) {
      setError('Failed to delete budget.');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (budget) => {
    setSelectedBudget(budget);
    setForm({
      category: budget.category,
      monthlyLimit: budget.monthlyLimit,
      month: budget.month,
      year: budget.year,
    });
    setFormError('');
    setIsEditOpen(true);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const displayMonth = `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">Set and manage your monthly budgets</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Month Selector */}
          <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((m, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025, 2026].map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchAll} title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
            onClick={() => { setForm({ ...emptyForm, month: selectedMonth, year: selectedYear }); setFormError(''); setIsAddOpen(true); }}
          >
            <Plus className="w-4 h-4" />
            Add Budget
          </Button>
        </div>
      </div>

      {/* Global Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Over-budget Alert */}
      {!loading && budgetPercent > 75 && (
        <Alert
          className={cn(
            'border-amber-500/50 bg-amber-500/10',
            budgetPercent > 90 && 'border-rose-500/50 bg-rose-500/10'
          )}
        >
          <AlertTriangle
            className={cn('h-4 w-4', budgetPercent > 90 ? 'text-rose-500' : 'text-amber-500')}
          />
          <AlertTitle className="font-semibold">
            {budgetPercent > 90 ? 'Budget Alert!' : 'Budget Warning'}
          </AlertTitle>
          <AlertDescription>
            You have used {budgetPercent}% of your monthly budget for {displayMonth}.
            {budgetPercent > 90
              ? ' Consider reducing your spending immediately.'
              : ' Try to be more mindful of your expenses.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {/* Total Budget Card */}
          {summary.length > 0 && (
            <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <PiggyBank className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle>Monthly Budget Summary</CardTitle>
                    <p className="text-sm text-muted-foreground">{displayMonth}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-3xl font-bold">
                      ₹{totalBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
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
                <Progress value={Math.min(budgetPercent, 100)} className="h-3" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground">Spent</p>
                    <p className="text-lg font-semibold text-rose-500">
                      ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className={cn('text-lg font-semibold', totalRemaining < 0 ? 'text-rose-500' : 'text-emerald-500')}>
                      ₹{totalRemaining.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Budget Summary by Category */}
          {summary.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Category Budgets — {displayMonth}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {summary.map((b, i) => {
                  const pct = b.monthlyLimit > 0 ? Math.round((b.totalSpent / b.monthlyLimit) * 100) : 0;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{b.category}</span>
                          {b.isOverBudget && (
                            <Badge variant="destructive" className="text-xs">Over Budget</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ₹{(b.totalSpent || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} / ₹{(b.monthlyLimit || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(pct, 100)}
                        className={cn('h-2', b.isOverBudget && '[&>div]:bg-rose-500')}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {b.isOverBudget
                            ? `Over by ₹${Math.abs(b.remaining || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                            : `${pct}% used`}
                        </span>
                        <span className={cn(b.isOverBudget && 'text-rose-500 font-medium')}>
                          ₹{(b.remaining || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} left
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <PiggyBank className="w-12 h-12 mb-3 opacity-40" />
                <p className="font-medium">No budgets for {displayMonth}</p>
                <p className="text-sm mt-1">Add your first budget to start tracking.</p>
              </CardContent>
            </Card>
          )}

          {/* All Budgets List (with edit/delete) */}
          {budgets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>All Budgets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {budgets.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium">{b.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {MONTH_NAMES[b.month - 1]} {b.year} — ₹{(b.monthlyLimit || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(b)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => { setSelectedBudget(b); setIsDeleteOpen(true); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Budget vs Spending Chart */}
          {summary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Spending — {displayMonth}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={summary.map((b) => ({
                        category: b.category,
                        Budget: b.monthlyLimit || 0,
                        Spent: b.totalSpent || 0,
                      }))}
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
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [
                          `₹${Number(value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
                          '',
                        ]}
                      />
                      <Bar dataKey="Budget" fill="#10b981" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="Spent" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ── Add Budget Dialog ─────────────────────────────────────────────── */}
      <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) setFormError(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
            <DialogDescription>Set a monthly spending limit for a category</DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-limit">Monthly Limit (₹) *</Label>
              <Input
                id="add-limit"
                type="number"
                min="1"
                placeholder="e.g. 5000"
                value={form.monthlyLimit}
                onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={String(form.month)} onValueChange={(v) => setForm({ ...form, month: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MONTH_NAMES.map((m, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={String(form.year)} onValueChange={(v) => setForm({ ...form, year: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[2023, 2024, 2025, 2026].map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={saving}>Cancel</Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Add Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Budget Dialog ────────────────────────────────────────────── */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setFormError(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Budget — {selectedBudget?.category}</DialogTitle>
            <DialogDescription>Adjust the budget limit</DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-limit">Monthly Limit (₹) *</Label>
              <Input
                id="edit-limit"
                type="number"
                min="1"
                value={form.monthlyLimit}
                onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={String(form.month)} onValueChange={(v) => setForm({ ...form, month: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {MONTH_NAMES.map((m, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={String(form.year)} onValueChange={(v) => setForm({ ...form, year: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[2023, 2024, 2025, 2026].map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>Cancel</Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ─────────────────────────────────────────────────── */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Budget</AlertDialogTitle>
            <AlertDialogDescription>
              Delete the "{selectedBudget?.category}" budget for {selectedBudget ? `${MONTH_NAMES[selectedBudget.month - 1]} ${selectedBudget.year}` : ''}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
