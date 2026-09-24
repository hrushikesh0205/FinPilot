import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  RotateCw,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  toggleSubscriptionStatus,
  deleteSubscription,
  getSubscriptionSummary,
  getSubscriptionCandidates,
} from '@/services/subscriptionApi';

const CADENCES = ['MONTHLY', 'ANNUAL', 'QUARTERLY', 'WEEKLY'];
const SUB_CATEGORIES = ['Entertainment', 'Software', 'Utilities', 'Education', 'Health & Fitness', 'News', 'Other'];

const emptySubForm = {
  serviceName: '',
  category: 'Entertainment',
  amount: '',
  billingCadence: 'MONTHLY',
  nextRenewalDate: '',
  account: 'Credit Card',
  active: true,
  notes: '',
};

export function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Dialogs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [formData, setFormData] = useState(emptySubForm);
  const [formError, setFormError] = useState('');

  const fetchSubscriptionsData = async () => {
    setLoading(true);
    setError('');
    try {
      const [subsRes, sumRes, candRes] = await Promise.all([
        getAllSubscriptions(),
        getSubscriptionSummary(),
        getSubscriptionCandidates(),
      ]);
      setSubscriptions(subsRes.data || []);
      setSummary(sumRes.data || null);
      setCandidates(candRes.data || []);
    } catch (err) {
      setError('Failed to load subscriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionsData();
  }, []);

  const handleOpenAdd = () => {
    setFormData(emptySubForm);
    setFormError('');
    setIsAddOpen(true);
  };

  const handleAddCandidate = (cand) => {
    setFormData({
      serviceName: cand.serviceName,
      category: cand.category || 'Entertainment',
      amount: (cand.amount || '').toString(),
      billingCadence: cand.billingCadence || 'MONTHLY',
      nextRenewalDate: '',
      account: 'Credit Card',
      active: true,
      notes: `Auto-detected from expense: ${cand.detectedFromTitle || ''}`,
    });
    setFormError('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setSelectedSub(sub);
    setFormData({
      serviceName: sub.serviceName,
      category: sub.category || 'Entertainment',
      amount: sub.amount.toString(),
      billingCadence: sub.billingCadence || 'MONTHLY',
      nextRenewalDate: sub.nextRenewalDate || '',
      account: sub.account || '',
      active: sub.active,
      notes: sub.notes || '',
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const handleOpenDelete = (sub) => {
    setSelectedSub(sub);
    setIsDeleteOpen(true);
  };

  const handleToggle = async (sub) => {
    try {
      await toggleSubscriptionStatus(sub.id);
      await fetchSubscriptionsData();
      toast({
        title: sub.active ? 'Subscription Paused' : 'Subscription Activated',
        description: `Status updated for ${sub.serviceName}.`,
      });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  };

  const handleCreate = async () => {
    setFormError('');
    if (!formData.serviceName.trim()) { setFormError('Service name is required.'); return; }
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setFormError('Please enter a valid amount greater than 0.'); return;
    }

    setSaving(true);
    try {
      await createSubscription({
        serviceName: formData.serviceName.trim(),
        category: formData.category,
        amount: parseFloat(formData.amount),
        billingCadence: formData.billingCadence,
        nextRenewalDate: formData.nextRenewalDate || null,
        account: formData.account,
        active: formData.active,
        notes: formData.notes,
      });
      setIsAddOpen(false);
      await fetchSubscriptionsData();
      toast({ title: 'Success', description: 'Subscription added successfully.' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save subscription.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setFormError('');
    if (!formData.serviceName.trim()) { setFormError('Service name is required.'); return; }
    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setFormError('Please enter a valid amount.'); return;
    }

    setSaving(true);
    try {
      await updateSubscription(selectedSub.id, {
        serviceName: formData.serviceName.trim(),
        category: formData.category,
        amount: parseFloat(formData.amount),
        billingCadence: formData.billingCadence,
        nextRenewalDate: formData.nextRenewalDate || null,
        account: formData.account,
        active: formData.active,
        notes: formData.notes,
      });
      setIsEditOpen(false);
      await fetchSubscriptionsData();
      toast({ title: 'Success', description: 'Subscription updated.' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update subscription.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubscription(selectedSub.id);
      setIsDeleteOpen(false);
      await fetchSubscriptionsData();
      toast({ title: 'Deleted', description: 'Subscription removed.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete subscription.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-muted-foreground text-sm">Loading subscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchSubscriptionsData} className="gap-2">
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
            Subscription Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Keep track of recurring bills, software licenses, streaming services, and renewal dates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenAdd}
            className="gap-2 bg-[#0F3D2E] dark:bg-[#16A34A] hover:bg-[#0F3D2E]/90 dark:hover:bg-[#14532D] text-white rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Total</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-400 mt-1">
                    ₹{(summary.monthlyTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Estimated / month</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Annual Estimate</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-100 mt-1">
                    ₹{(summary.annualEstimate || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Projected / year</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-[#0F3D2E] dark:text-teal-400 mt-1">
                    {summary.activeSubscriptions || 0}
                    <span className="text-xs text-muted-foreground font-normal ml-1.5">
                      / {summary.totalSubscriptions || 0} total
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Currently active</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/50 bg-white/60 dark:bg-card/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next Renewal</p>
                  <p className="text-xl font-bold text-[#0F3D2E] dark:text-amber-400 mt-1 truncate max-w-[130px]">
                    {summary.nextRenewalService || 'None'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {summary.nextRenewalDate || 'No upcoming dates'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
                  <RotateCw className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Auto-detected candidate subscriptions banner */}
      {candidates.length > 0 && (
        <Card className="rounded-2xl border-emerald-500/30 bg-emerald-500/5 backdrop-blur-sm overflow-hidden shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-base font-semibold">
                Detected Subscriptions in Expense History
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              FinPilot detected these popular service charges in your past transactions. Click to add them as tracked subscriptions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2.5">
              {candidates.map((cand, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white dark:bg-card border border-emerald-500/20 shadow-sm text-xs"
                >
                  <div>
                    <span className="font-semibold text-foreground">{cand.serviceName}</span>
                    <span className="text-muted-foreground ml-1.5">
                      ₹{cand.amount} ({cand.occurrences}x logged)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddCandidate(cand)}
                    className="h-7 px-2 text-xs rounded-lg text-emerald-600 border-emerald-500/30 hover:bg-emerald-50"
                  >
                    + Track
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions Grid */}
      {subscriptions.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-2 border-border/70 p-12 text-center bg-card/30">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center">
              <CreditCard className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-[#0F3D2E] dark:text-emerald-100">No subscriptions added yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your streaming services, software subscriptions, gym memberships, and cloud storage plans to track monthly recurring costs.
            </p>
            <Button
              onClick={handleOpenAdd}
              className="gap-2 bg-[#0F3D2E] dark:bg-[#16A34A] text-white rounded-xl"
            >
              <Plus className="w-4 h-4" /> Add Subscription
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <Card
              key={sub.id}
              className={`rounded-2xl border-border/60 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col backdrop-blur-sm ${
                sub.active ? 'bg-white/70 dark:bg-card/60' : 'bg-muted/30 opacity-75'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-normal">
                        {sub.category || 'Entertainment'}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          sub.active
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {sub.active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight text-[#0F3D2E] dark:text-emerald-50 pt-1">
                      {sub.serviceName}
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(sub)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleOpenDelete(sub)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                {sub.notes && (
                  <CardDescription className="text-xs line-clamp-1 mt-1">
                    {sub.notes}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-[#0F3D2E] dark:text-emerald-100">
                      ₹{sub.amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <Badge variant="secondary" className="text-xs uppercase font-medium">
                      {sub.billingCadence}
                    </Badge>
                  </div>

                  {sub.account && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Billed on: <span className="font-medium text-foreground">{sub.account}</span>
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>
                      {sub.nextRenewalDate ? `Renews ${sub.nextRenewalDate}` : 'No renewal date'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      {sub.active ? 'Active' : 'Paused'}
                    </span>
                    <Switch
                      checked={sub.active}
                      onCheckedChange={() => handleToggle(sub)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
              {isEditOpen ? 'Edit Subscription' : 'Add Subscription'}
            </DialogTitle>
            <DialogDescription>
              {isEditOpen
                ? 'Update billing details and renewal date.'
                : 'Enter subscription service details to keep track of recurring renewals.'}
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
              <Label htmlFor="sub-name">Service Name *</Label>
              <Input
                id="sub-name"
                placeholder="e.g. Netflix, Spotify, GitHub, AWS"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="sub-amount">Amount (₹) *</Label>
                <Input
                  id="sub-amount"
                  type="number"
                  placeholder="e.g. 649"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sub-cadence">Billing Cadence</Label>
                <select
                  id="sub-cadence"
                  value={formData.billingCadence}
                  onChange={(e) => setFormData({ ...formData, billingCadence: e.target.value })}
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
                <Label htmlFor="sub-date">Next Renewal Date</Label>
                <Input
                  id="sub-date"
                  type="date"
                  value={formData.nextRenewalDate}
                  onChange={(e) => setFormData({ ...formData, nextRenewalDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sub-category">Category</Label>
                <select
                  id="sub-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  {SUB_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sub-account">Payment Method / Account</Label>
              <Input
                id="sub-account"
                placeholder="e.g. HDFC Credit Card, UPI, PayPal"
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sub-notes">Notes (Optional)</Label>
              <Input
                id="sub-notes"
                placeholder="e.g. Shared with family, Annual promo discount"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-medium">Active Subscription</p>
                <p className="text-xs text-muted-foreground">Uncheck if temporarily paused or cancelled</p>
              </div>
              <Switch
                checked={formData.active}
                onCheckedChange={(val) => setFormData({ ...formData, active: val })}
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
              {isEditOpen ? 'Save Changes' : 'Add Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop tracking <strong className="text-foreground">{selectedSub?.serviceName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default SubscriptionsPage;
