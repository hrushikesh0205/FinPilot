import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Pencil,
  Trash2,
  Wallet,
  CreditCard,
  Banknote,
  Smartphone,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useToast } from '@/hooks/use-toast';
import {
  getAllAccounts,
  createAccount,
  updateAccount,
  setDefaultAccount,
  deleteAccount,
} from '@/services/accountApi';

const accountTypes = [
  { value: 'Cash',           label: 'Cash',           icon: Banknote,    color: 'text-emerald-500' },
  { value: 'Bank Account',   label: 'Bank Account',   icon: Wallet,      color: 'text-blue-500'    },
  { value: 'Credit Card',    label: 'Credit Card',    icon: CreditCard,  color: 'text-violet-500'  },
  { value: 'Digital Wallet', label: 'Digital Wallet', icon: Smartphone,  color: 'text-cyan-500'    },
];

const emptyForm = { name: '', type: 'Bank Account', balance: 0, isDefault: false };

export function AccountsPage() {
  const { toast } = useToast();

  const [accountList, setAccountList]       = useState([]);
  const [loading, setLoading]               = useState(true);
  const [isAddOpen, setIsAddOpen]           = useState(false);
  const [isEditOpen, setIsEditOpen]         = useState(false);
  const [isDeleteOpen, setIsDeleteOpen]     = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newAccount, setNewAccount]         = useState(emptyForm);
  const [isSaving, setIsSaving]             = useState(false);
  const [isDeleting, setIsDeleting]         = useState(false);

  // ── Fetch accounts from backend ────────────────────────────────────────
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllAccounts();
      setAccountList(res.data || []);
    } catch (err) {
      console.error('Failed to load accounts:', err);
      toast({
        title: 'Error',
        description: 'Failed to load accounts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // ── Add Account ────────────────────────────────────────────────────────
  const handleAddAccount = async () => {
    if (!newAccount.name.trim()) {
      toast({ title: 'Validation Error', description: 'Account name is required.', variant: 'destructive' });
      return;
    }
    try {
      setIsSaving(true);
      await createAccount({
        name:      newAccount.name,
        type:      newAccount.type,
        balance:   parseFloat(newAccount.balance) || 0,
        isDefault: newAccount.isDefault,
      });
      toast({ title: 'Success', description: 'Account added successfully.' });
      setIsAddOpen(false);
      setNewAccount(emptyForm);
      await fetchAccounts();
    } catch (err) {
      console.error('Failed to add account:', err);
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to add account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Edit Account ───────────────────────────────────────────────────────
  const handleEditAccount = async () => {
    if (!selectedAccount?.name?.trim()) {
      toast({ title: 'Validation Error', description: 'Account name is required.', variant: 'destructive' });
      return;
    }
    try {
      setIsSaving(true);
      await updateAccount(selectedAccount.id, {
        name:      selectedAccount.name,
        type:      selectedAccount.type,
        balance:   parseFloat(selectedAccount.balance) || 0,
        isDefault: selectedAccount.isDefault,
      });
      toast({ title: 'Success', description: 'Account updated successfully.' });
      setIsEditOpen(false);
      setSelectedAccount(null);
      await fetchAccounts();
    } catch (err) {
      console.error('Failed to update account:', err);
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to update account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Set Default ────────────────────────────────────────────────────────
  const handleSetDefault = async (account) => {
    try {
      await setDefaultAccount(account.id);
      await fetchAccounts();
    } catch (err) {
      console.error('Failed to set default:', err);
      toast({
        title: 'Error',
        description: 'Failed to set default account. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // ── Delete Account (persistent — calls DELETE API) ─────────────────────
  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    try {
      setIsDeleting(true);
      await deleteAccount(selectedAccount.id);
      toast({
        title: 'Account deleted successfully.',
        description: `"${selectedAccount.name}" has been permanently removed.`,
      });
      setIsDeleteOpen(false);
      setSelectedAccount(null);
      await fetchAccounts();
    } catch (err) {
      console.error('Failed to delete account:', err);
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to delete account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  const getAccountIcon  = (type) => (accountTypes.find((t) => t.value === type) || accountTypes[1]).icon;
  const getAccountColor = (type) => (accountTypes.find((t) => t.value === type) || accountTypes[1]).color;

  const totalBalance = accountList.reduce((sum, a) => sum + (a.balance || 0), 0);
  const defaultAccount = accountList.find((a) => a.isDefault);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">Manage your bank accounts, wallets, and cards</p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Account
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className={cn('text-3xl font-bold', totalBalance < 0 && 'text-rose-500')}>
                ₹{totalBalance.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Accounts</p>
                <p className="font-semibold">{accountList.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Default</p>
                <p className="font-semibold">{defaultAccount?.name || 'None'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      )}

      {/* Empty State */}
      {!loading && accountList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Wallet className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No accounts yet</p>
          <p className="text-muted-foreground text-sm mb-4">
            Add your first account to start tracking your finances.
          </p>
          <Button
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Account
          </Button>
        </div>
      )}

      {/* Accounts Grid */}
      {!loading && accountList.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accountList.map((account) => {
            const IconComponent = getAccountIcon(account.type);
            const isNegative    = account.balance < 0;

            return (
              <Card
                key={account.id}
                className={cn(
                  'group hover:shadow-lg transition-all duration-300 relative overflow-hidden',
                  account.isDefault && 'border-emerald-500'
                )}
              >
                {account.isDefault && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                      <Star className="w-3 h-3 mr-1" />
                      Default
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between pr-16">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        isNegative ? 'bg-rose-500/10' : 'bg-muted'
                      )}
                    >
                      <IconComponent className={cn('w-6 h-6', getAccountColor(account.type))} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-lg">{account.name}</p>
                    <p className="text-sm text-muted-foreground">{account.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isNegative ? (
                      <ArrowDownRight className="w-4 h-4 text-rose-500" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    )}
                    <p className={cn('text-2xl font-bold', isNegative && 'text-rose-500')}>
                      {isNegative ? '-' : ''}₹{Math.abs(account.balance).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {!account.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleSetDefault(account)}
                      >
                        <Star className="w-3 h-3" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedAccount({ ...account });
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        setSelectedAccount(account);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Account Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>Add a new account to track your finances</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                placeholder="e.g., HDFC Savings"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select
                value={newAccount.type}
                onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className={cn('w-4 h-4', type.color)} />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Current Balance (₹)</Label>
              <Input
                id="balance"
                type="number"
                placeholder="0.00"
                value={newAccount.balance}
                onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Use negative values for credit cards</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="default"
                checked={newAccount.isDefault}
                onChange={(e) => setNewAccount({ ...newAccount, isDefault: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="default">Set as default account</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleAddAccount}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Update account details</DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Account Name</Label>
                <Input
                  id="edit-name"
                  value={selectedAccount.name}
                  onChange={(e) => setSelectedAccount({ ...selectedAccount, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select
                  value={selectedAccount.type}
                  onValueChange={(value) => setSelectedAccount({ ...selectedAccount, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className={cn('w-4 h-4', type.color)} />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-balance">Current Balance (₹)</Label>
                <Input
                  id="edit-balance"
                  type="number"
                  value={selectedAccount.balance}
                  onChange={(e) =>
                    setSelectedAccount({ ...selectedAccount, balance: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-default"
                  checked={selectedAccount.isDefault}
                  onChange={(e) => setSelectedAccount({ ...selectedAccount, isDefault: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="edit-default">Set as default account</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleEditAccount}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              Delete this account?{' '}
              {selectedAccount && (
                <span className="font-medium">"{selectedAccount.name}"</span>
              )}{' '}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
