import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Repeat,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  ShieldCheck,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getSuggestions,
  getConfirmedRecurring,
  keepSuggestion,
  ignoreSuggestion,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  getRecurringSummary,
} from '@/services/recurringApi';

const CADENCES = ['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL'];
const CATEGORIES = ['Bills', 'Utilities', 'Rent', 'Insurance', 'Subscriptions', 'Education', 'Loans', 'Other'];

const emptyRecurringForm = {
  title: '',
  amount: '',
  category: 'Bills',
  cadence: 'MONTHLY',
  startDate: '',
  nextDueDate: '',
};

export function RecurringPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [confirmed, setConfirmed] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Dialogs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(emptyRecurringForm);
  const [formError, setFormError] = useState('');

  const fetchRecurringData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sugRes, confRes, sumRes] = await Promise.all([
        getSuggestions(),
        getConfirmedRecurring(),
        getRecurringSummary(),
      ]);
      setSuggestions(sugRes.data || []);
      setConfirmed(confRes.data || []);
      setSummary(sumRes.data || null);
    } catch (err) {
      setError('Failed to load recurring expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringData();
  }, []);

  const handleKeepSuggestion = async (sug) => {
    setProcessing(true);
    try {
      await keepSuggestion({
        title: sug.title,
        amount: sug.amount,
        category: sug.category || 'Bills',
        cadence: sug.cadence ? sug.cadence.toUpperCase() : 'MONTHLY',
        nextDueDate: sug.nextExpectedDate,
        confidence: sug.confidence,
        occurrences: sug.occurrences,
        autoDetected: true,
      });
      await fetchRecurringData();
      toast({
        title: 'Recurring Expense Confirmed',
        description: `"${sug.title}" is now tracked as a recurring expense.`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to keep suggestion.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleIgnoreSuggestion = async (sug) => {
    setProcessing(true);
    try {
      await ignoreSuggestion(sug.title);
      await fetchRecurringData();
      toast({
        title: 'Pattern Dismissed',
        description: `"${sug.title}" will no longer be suggested as recurring.`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to dismiss suggestion.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData(emptyRecurringForm);
    setFormError('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      amount: item.amount.toString(),
      category: item.category || 'Bills',
      cadence: item.cadence || 'MONTHLY',
      startDate: item.startDate || '',
      nextDueDate: item.nextDueDate || '',
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleCreate = async () => {
    setFormError('');
    if (!formData.title.trim()) { setFormError('Title is required.'); return; }
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setFormError('Please enter a valid amount.'); return;
    }

    setProcessing(true);
    try {
      await createRecurring({
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        cadence: formData.cadence,
        startDate: formData.startDate || null,
        nextDueDate: formData.nextDueDate || null,
      });
      setIsAddOpen(false);
      await fetchRecurringData();
      toast({ title: 'Success', description: 'Recurring expense added.' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add recurring expense.');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdate = async () => {
    setFormError('');
    if (!formData.title.trim()) { setFormError('Title is required.'); return; }
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setFormError('Please enter a valid amount.'); return;
    }

    setProcessing(true);
    try {
      await updateRecurring(selectedItem.id, {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        cadence: formData.cadence,
        startDate: formData.startDate || null,
        nextDueDate: formData.nextDueDate || null,
      });
      setIsEditOpen(false);
      await fetchRecurringData();
      toast({ title: 'Success', description: 'Recurring expense updated.' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update recurring expense.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecurring(selectedItem.id);
      setIsDeleteOpen(false);
      await fetchRecurringData();
      toast({ title: 'Deleted', description: 'Recurring expense removed.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-muted-foreground text-sm">Analyzing transaction cadence & intervals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchRecurringData} className="gap-2">
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
            Recurring Expenses
          </h1>
          <p className="text-muted-foreground mt-1">
            Intelligent pattern recognition identifies repeated bills, cadence intervals, and upcoming dues.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchRecurringData}
            variant="outline"
            size="icon"
            className="rounded-xl"
            title="Re-scan patterns"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
          </Button>
          <Button
            onClick={handleOpenAdd}
            className="gap-2 bg-[#0F3D2E] dark:bg-[#16A34A] hover:bg-[#0F3D2E]/90 dark:hover:bg-[#14532D] text-white rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Recurring
          </Button>
        </div>
      </div>

      {/* Metrics Banner */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Recurring</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-400 mt-1">
                    ₹{(summary.monthlyTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Committed expenses</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Repeat className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Annualized Cost</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-100 mt-1">
                    ₹{(summary.annualTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Yearly projection</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Tracked</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-teal-400 mt-1">
                    {summary.activeCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Confirmed patterns</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next Due Date</p>
                  <p className="text-xl font-bold text-[#0F3D2E] dark:text-amber-400 mt-1 truncate max-w-[130px]">
                    {summary.nextUpcomingTitle || 'None'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {summary.nextUpcomingDate || 'No upcoming due dates'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detected Suggestions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0F3D2E] dark:text-emerald-100">
              Detected Recurring Suggestions ({suggestions.length})
            </h2>
          </div>
          <Badge variant="outline" className="text-xs font-medium">
            Pattern Engine Active
          </Badge>
        </div>

        {suggestions.length === 0 ? (
          <Card className="rounded-xl border-dashed border p-6 text-center bg-card/20">
            <p className="text-sm text-muted-foreground">
              No new recurring patterns detected yet. Log 2 or more repeated expenses (e.g. Rent, Wi-Fi bill, Gym) and FinPilot will automatically identify their cadence.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((sug, i) => (
              <Card
                key={i}
                className="rounded-2xl border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 backdrop-blur-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] gap-1">
                          <Zap className="w-3 h-3" />
                          {sug.confidence}
                        </Badge>
                        <Badge variant="secondary" className="text-[11px]">
                          {sug.cadence}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-[#0F3D2E] dark:text-emerald-50 mt-2">
                        {sug.title}
                      </CardTitle>
                    </div>
                    <span className="text-xl font-extrabold text-[#0F3D2E] dark:text-emerald-300">
                      ₹{sug.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="p-3 rounded-xl bg-white/70 dark:bg-card/70 border border-emerald-500/20 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pattern History:</span>
                      <span className="font-semibold text-foreground">{sug.occurrences} occurrences (~{sug.averageIntervalDays}d interval)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Variation:</span>
                      <span className="font-medium text-foreground">{sug.amountVariation}% variance</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Next Expected:</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {sug.nextExpectedDate || 'Calculating...'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      onClick={() => handleKeepSuggestion(sug)}
                      disabled={processing}
                      className="flex-1 gap-1.5 rounded-xl bg-[#0F3D2E] dark:bg-[#16A34A] text-white hover:bg-[#0F3D2E]/90 text-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Keep Pattern
                    </Button>
                    <Button
                      onClick={() => handleIgnoreSuggestion(sug)}
                      disabled={processing}
                      variant="outline"
                      className="flex-1 gap-1.5 rounded-xl text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                    >
                      <X className="w-3.5 h-3.5" /> Ignore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Confirmed Recurring Expenses Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0F3D2E] dark:text-emerald-100">
            Confirmed Recurring Expenses ({confirmed.length})
          </h2>
        </div>

        {confirmed.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-2 p-10 text-center bg-card/30">
            <div className="max-w-md mx-auto space-y-3">
              <Repeat className="w-12 h-12 text-muted-foreground/40 mx-auto" />
              <h3 className="font-semibold text-[#0F3D2E] dark:text-emerald-100">No confirmed recurring expenses</h3>
              <p className="text-xs text-muted-foreground">
                Keep any detected suggestions above or click "Add Recurring" to manually define recurring bills like Rent, Electricity, Internet, or Loan EMIs.
              </p>
              <Button onClick={handleOpenAdd} size="sm" className="gap-2 bg-[#0F3D2E] dark:bg-[#16A34A] text-white rounded-xl">
                <Plus className="w-3.5 h-3.5" /> Add Manually
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {confirmed.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border-border/60 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between bg-white/70 dark:bg-card/60 backdrop-blur-sm"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category || 'Bills'}
                        </Badge>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs">
                          {item.cadence}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold tracking-tight text-[#0F3D2E] dark:text-emerald-50 pt-1">
                        {item.title}
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleOpenDelete(item)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-[#0F3D2E] dark:text-emerald-100">
                      ₹{item.amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      per {item.cadence?.toLowerCase()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Next Due: <strong className="text-foreground">{item.nextDueDate || 'Not set'}</strong></span>
                    </div>

                    {item.confidence && (
                      <span className="text-[11px] font-medium text-emerald-600">
                        {item.confidence}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

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
              {isEditOpen ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
            </DialogTitle>
            <DialogDescription>
              Specify repeat interval and upcoming due date.
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
              <Label htmlFor="rec-title">Expense Title / Merchant *</Label>
              <Input
                id="rec-title"
                placeholder="e.g. House Rent, Electricity Bill, Home Loan EMI"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rec-amount">Amount (₹) *</Label>
                <Input
                  id="rec-amount"
                  type="number"
                  placeholder="e.g. 15000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rec-cadence">Cadence Interval *</Label>
                <select
                  id="rec-cadence"
                  value={formData.cadence}
                  onChange={(e) => setFormData({ ...formData, cadence: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  {CADENCES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rec-due">Next Due Date</Label>
                <Input
                  id="rec-due"
                  type="date"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rec-category">Category</Label>
                <select
                  id="rec-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
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
              disabled={processing}
              className="rounded-xl bg-[#0F3D2E] dark:bg-[#16A34A] text-white"
            >
              {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditOpen ? 'Save Changes' : 'Confirm Recurring'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recurring Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop tracking <strong className="text-foreground">{selectedItem?.title}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default RecurringPage;
