import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Target,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  Coins,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
  PiggyBank,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getAllGoals,
  createGoal,
  updateGoal,
  depositFunds,
  deleteGoal,
  getGoalsSummary,
} from '@/services/goalApi';

const GOAL_CATEGORIES = [
  'General', 'Emergency Fund', 'Technology', 'Travel', 'Home', 'Vehicle', 'Education', 'Investment'
];

const PRESET_COLORS = [
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#f97316'
];

const emptyGoalForm = {
  name: '',
  targetAmount: '',
  currentAmount: '0',
  targetDate: '',
  notes: '',
  category: 'General',
  color: '#10b981',
};

export function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Dialogs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState(emptyGoalForm);
  const [depositAmount, setDepositAmount] = useState('');
  const [formError, setFormError] = useState('');

  const fetchGoalsData = async () => {
    setLoading(true);
    setError('');
    try {
      const [goalsRes, sumRes] = await Promise.all([
        getAllGoals(),
        getGoalsSummary(),
      ]);
      setGoals(goalsRes.data || []);
      setSummary(sumRes.data || null);
    } catch (err) {
      setError('Failed to load savings goals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoalsData();
  }, []);

  const handleOpenAdd = () => {
    setFormData(emptyGoalForm);
    setFormError('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (goal) => {
    setSelectedGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: (goal.currentAmount || 0).toString(),
      targetDate: goal.targetDate || '',
      notes: goal.notes || '',
      category: goal.category || 'General',
      color: goal.color || '#10b981',
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const handleOpenDeposit = (goal) => {
    setSelectedGoal(goal);
    setDepositAmount('');
    setFormError('');
    setIsDepositOpen(true);
  };

  const handleOpenDelete = (goal) => {
    setSelectedGoal(goal);
    setIsDeleteOpen(true);
  };

  const handleCreate = async () => {
    setFormError('');
    if (!formData.name.trim()) { setFormError('Goal name is required.'); return; }
    if (!formData.targetAmount || isNaN(formData.targetAmount) || parseFloat(formData.targetAmount) <= 0) {
      setFormError('Please enter a valid target amount greater than 0.'); return;
    }

    setSaving(true);
    try {
      await createGoal({
        name: formData.name.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        targetDate: formData.targetDate || null,
        notes: formData.notes,
        category: formData.category,
        color: formData.color,
      });
      setIsAddOpen(false);
      await fetchGoalsData();
      toast({ title: 'Success', description: 'Savings goal created successfully.' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create goal.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setFormError('');
    if (!formData.name.trim()) { setFormError('Goal name is required.'); return; }
    if (!formData.targetAmount || isNaN(formData.targetAmount) || parseFloat(formData.targetAmount) <= 0) {
      setFormError('Please enter a valid target amount.'); return;
    }

    setSaving(true);
    try {
      await updateGoal(selectedGoal.id, {
        name: formData.name.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        targetDate: formData.targetDate || null,
        notes: formData.notes,
        category: formData.category,
        color: formData.color,
      });
      setIsEditOpen(false);
      await fetchGoalsData();
      toast({ title: 'Success', description: 'Goal updated successfully.' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update goal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeposit = async () => {
    setFormError('');
    const amt = parseFloat(depositAmount);
    if (!amt || isNaN(amt) || amt <= 0) {
      setFormError('Enter a valid deposit amount greater than 0.');
      return;
    }

    setSaving(true);
    try {
      await depositFunds(selectedGoal.id, amt);
      setIsDepositOpen(false);
      await fetchGoalsData();
      toast({
        title: 'Funds Added! 🎉',
        description: `Successfully added ₹${amt.toLocaleString('en-IN')} to "${selectedGoal.name}".`,
      });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to deposit funds.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGoal(selectedGoal.id);
      setIsDeleteOpen(false);
      await fetchGoalsData();
      toast({ title: 'Deleted', description: 'Savings goal removed.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete goal.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-muted-foreground text-sm">Loading savings goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchGoalsData} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F3D2E] dark:text-emerald-50">
            Savings Goals
          </h1>
          <p className="text-muted-foreground mt-1">
            Track targets, visualize milestones, and build disciplined financial habits.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenAdd}
            className="gap-2 bg-[#0F3D2E] dark:bg-[#16A34A] hover:bg-[#0F3D2E]/90 dark:hover:bg-[#14532D] text-white rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Saved</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-400 mt-1">
                    ₹{(summary.totalSavedAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Across all goals</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <PiggyBank className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Target</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-100 mt-1">
                    ₹{(summary.totalTargetAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Combined targets</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                  <Target className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overall Progress</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-teal-400 mt-1">
                    {summary.overallProgressPercentage || 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Target reached</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-amber-400 mt-1">
                    {summary.completedGoals || 0} / {summary.totalGoals || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Goals accomplished</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-2 border-border/70 p-12 text-center bg-card/30">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F3D2E] dark:text-emerald-100">No savings goals yet</h3>
            <p className="text-sm text-muted-foreground">
              Define a financial target like "Emergency Fund", "New Laptop", or "Vacation" to visualize your savings journey.
            </p>
            <Button
              onClick={handleOpenAdd}
              className="gap-2 bg-[#0F3D2E] dark:bg-[#16A34A] text-white rounded-xl"
            >
              <Plus className="w-4 h-4" /> Create Your First Goal
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const isDone = goal.completed;
            const progress = Math.min(100, goal.progressPercentage || 0);

            return (
              <Card
                key={goal.id}
                className="rounded-2xl border-border/60 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col bg-white/70 dark:bg-card/60 backdrop-blur-sm group"
              >
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: goal.color || '#10b981' }}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                          {goal.category || 'General'}
                        </Badge>
                        {isDone && (
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold tracking-tight text-[#0F3D2E] dark:text-emerald-50 pt-1">
                        {goal.name}
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEdit(goal)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleOpenDelete(goal)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  {goal.notes && (
                    <CardDescription className="text-xs line-clamp-2 mt-1">
                      {goal.notes}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  {/* Progress & Amounts */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-semibold text-lg text-[#0F3D2E] dark:text-emerald-100">
                        ₹{(goal.currentAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-muted-foreground text-xs font-medium">
                        Target: ₹{(goal.targetAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>

                    <div className="relative pt-1">
                      <Progress
                        value={progress}
                        className="h-2.5 bg-muted rounded-full"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>{progress.toFixed(1)}% achieved</span>
                      <span>
                        {isDone ? (
                          <span className="text-emerald-600 font-medium">Fully funded!</span>
                        ) : (
                          `₹${(goal.remainingAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })} remaining`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                    {goal.targetDate ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>
                          {goal.targetDate}
                          {goal.daysRemaining !== null && (
                            <span className="ml-1 text-[11px] font-medium text-emerald-600">
                              ({goal.daysRemaining > 0 ? `${goal.daysRemaining}d left` : 'Due'})
                            </span>
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No target date</span>
                    )}

                    <Button
                      size="sm"
                      onClick={() => handleOpenDeposit(goal)}
                      className="gap-1.5 text-xs rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600/20 border border-emerald-500/20"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      Add Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={isAddOpen || isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setIsEditOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0F3D2E] dark:text-emerald-50">
              {isEditOpen ? 'Edit Savings Goal' : 'Create Savings Goal'}
            </DialogTitle>
            <DialogDescription>
              {isEditOpen
                ? 'Update target amount or target date for your goal.'
                : 'Set a new savings target to monitor your progress.'}
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="goal-name">Goal Name *</Label>
              <Input
                id="goal-name"
                placeholder="e.g. Emergency Fund, New Laptop"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="target-amount">Target Amount (₹) *</Label>
                <Input
                  id="target-amount"
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="current-amount">Current Saved (₹)</Label>
                <Input
                  id="current-amount"
                  type="number"
                  placeholder="0"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="target-date">Target Date (Optional)</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  {GOAL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Color Accent</Label>
              <div className="flex items-center gap-2 pt-1">
                {PRESET_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: col })}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      formData.color === col ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Reason or plan for this savings goal..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={isEditOpen ? handleUpdate : handleCreate}
              disabled={saving}
              className="rounded-xl bg-[#0F3D2E] dark:bg-[#16A34A] text-white"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditOpen ? 'Save Changes' : 'Create Goal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Funds Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0F3D2E] dark:text-emerald-50">
              Add Funds to Goal
            </DialogTitle>
            <DialogDescription>
              Deposit savings towards <strong className="text-foreground">{selectedGoal?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-medium">Currently Saved</p>
              <p className="text-2xl font-bold text-emerald-600">
                ₹{(selectedGoal?.currentAmount || 0).toLocaleString('en-IN')}
                <span className="text-xs font-normal text-muted-foreground ml-1.5">
                  / ₹{(selectedGoal?.targetAmount || 0).toLocaleString('en-IN')}
                </span>
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deposit-amount">Amount to Deposit (₹) *</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="e.g. 5000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                autoFocus
                className="rounded-xl text-lg font-semibold"
              />
            </div>

            <div className="flex gap-2">
              {[500, 1000, 2000, 5000].map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDepositAmount(preset.toString())}
                  className="flex-1 text-xs rounded-lg"
                >
                  +₹{preset}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDepositOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={saving}
              className="rounded-xl bg-[#0F3D2E] dark:bg-[#16A34A] text-white"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Savings Goal?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong className="text-foreground">{selectedGoal?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete Goal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default GoalsPage;
