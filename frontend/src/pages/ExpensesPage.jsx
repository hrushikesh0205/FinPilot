import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  CalendarIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Receipt,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  searchExpenses,
  getExpensesByCategory,
  getSortedExpenses,
  getPaginatedExpenses,
} from '@/api/expenseApi';

const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Entertainment',
  'Bills', 'Health', 'Education', 'Investments', 'Other',
];

const SORT_OPTIONS = [
  { label: 'Newest First', field: 'expenseDate', direction: 'desc' },
  { label: 'Oldest First', field: 'expenseDate', direction: 'asc' },
  { label: 'Highest Amount', field: 'amount', direction: 'desc' },
  { label: 'Lowest Amount', field: 'amount', direction: 'asc' },
];

const PAGE_SIZE = 10;

const emptyForm = {
  title: '',
  amount: '',
  category: '',
  expenseDate: new Date(),
  notes: '',
};

export function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortKey, setSortKey] = useState('0'); // index into SORT_OPTIONS

  // Pagination (client-side on full list, backend paginated only when no filter active)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Dialogs
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [newExpense, setNewExpense] = useState(emptyForm);

  // ── Fetch Helpers ──────────────────────────────────────────────────────────

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (searchQuery.trim()) {
        const res = await searchExpenses(searchQuery.trim());
        data = res.data;
      } else if (selectedCategory !== 'all') {
        const res = await getExpensesByCategory(selectedCategory);
        data = res.data;
      } else {
        const opt = SORT_OPTIONS[parseInt(sortKey)];
        const res = await getSortedExpenses(opt.field, opt.direction);
        data = res.data;
      }
      setExpenses(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortKey]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // ── CRUD ──────────────────────────────────────────────────────────────────

  const handleAddExpense = async () => {
    setFormError('');
    if (!newExpense.title.trim()) { setFormError('Title is required.'); return; }
    if (!newExpense.amount || isNaN(newExpense.amount) || parseFloat(newExpense.amount) <= 0) {
      setFormError('Enter a valid amount greater than 0.'); return;
    }
    if (!newExpense.category) { setFormError('Please select a category.'); return; }

    setSaving(true);
    try {
      const payload = {
        title: newExpense.title.trim(),
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        expenseDate: format(newExpense.expenseDate || new Date(), 'yyyy-MM-dd'),
      };
      await createExpense(payload);
      setIsAddOpen(false);
      setNewExpense(emptyForm);
      await fetchExpenses();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditExpense = async () => {
    setFormError('');
    if (!selectedExpense.title?.trim()) { setFormError('Title is required.'); return; }
    if (!selectedExpense.amount || parseFloat(selectedExpense.amount) <= 0) {
      setFormError('Enter a valid amount greater than 0.'); return;
    }

    setSaving(true);
    try {
      const payload = {
        title: selectedExpense.title.trim(),
        amount: parseFloat(selectedExpense.amount),
        category: selectedExpense.category,
        expenseDate: selectedExpense.expenseDate,
      };
      await updateExpense(selectedExpense.id, payload);
      setIsEditOpen(false);
      setSelectedExpense(null);
      await fetchExpenses();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async () => {
    setSaving(true);
    try {
      await deleteExpense(selectedExpense.id);
      setIsDeleteOpen(false);
      setSelectedExpense(null);
      await fetchExpenses();
    } catch (err) {
      setError('Failed to delete expense.');
    } finally {
      setSaving(false);
    }
  };

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(expenses.length / PAGE_SIZE));
  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Manage and track all your expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={fetchExpenses} title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
            onClick={() => { setNewExpense(emptyForm); setFormError(''); setIsAddOpen(true); }}
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold">
              ₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Filtered Results</p>
            <p className="text-2xl font-bold">{expenses.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg per Transaction</p>
            <p className="text-2xl font-bold">
              ₹{expenses.length > 0
                ? (totalExpenses / expenses.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })
                : '0'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortKey} onValueChange={setSortKey}>
              <SelectTrigger className="w-full sm:w-[170px]">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt, i) => (
                  <SelectItem key={i} value={String(i)}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        <Receipt className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        No expenses found. Add your first expense!
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedExpenses.map((expense) => (
                      <TableRow key={expense.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-rose-500/10 flex items-center justify-center">
                              <Receipt className="w-4 h-4 text-rose-500" />
                            </div>
                            <div>
                              <p className="font-medium">{expense.title}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {expense.expenseDate}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          -₹{(expense.amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedExpense({ ...expense });
                                  setFormError('');
                                  setIsEditOpen(true);
                                }}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setSelectedExpense(expense);
                                  setIsDeleteOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && expenses.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                {Math.min(currentPage * PAGE_SIZE, expenses.length)} of{' '}
                {expenses.length} results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages)
                  .map((page, idx, arr) => (
                    <>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span key={`ellipsis-${page}`} className="px-1 text-muted-foreground">…</span>
                      )}
                      <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </>
                  ))}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Add Expense Dialog ────────────────────────────────────────────── */}
      <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) setFormError(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Add a new expense to track your spending</DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="add-title">Title *</Label>
              <Input
                id="add-title"
                placeholder="e.g., Grocery Shopping"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-amount">Amount (₹) *</Label>
              <Input
                id="add-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
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
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {newExpense.expenseDate ? format(newExpense.expenseDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newExpense.expenseDate}
                    onSelect={(date) => setNewExpense({ ...newExpense, expenseDate: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleAddExpense}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Expense Dialog ───────────────────────────────────────────── */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setFormError(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>Update the expense details</DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          {selectedExpense && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={selectedExpense.title}
                  onChange={(e) => setSelectedExpense({ ...selectedExpense, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount (₹) *</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={selectedExpense.amount}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, amount: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={selectedExpense.category}
                  onValueChange={(value) =>
                    setSelectedExpense({ ...selectedExpense, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={selectedExpense.expenseDate || ''}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, expenseDate: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleEditExpense}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ───────────────────────────────────────────── */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedExpense?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteExpense}
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
