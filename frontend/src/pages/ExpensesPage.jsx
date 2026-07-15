import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Utensils,
  Plane,
  ShoppingBag,
  Film,
  FileText,
  HeartPulse,
  GraduationCap,
  TrendingUp,
  CircleEllipsis,
  FilterX,
  Wallet,
  Banknote,
  CreditCard,
  WalletCards
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { format, isSameMonth, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  createExpense,
  updateExpense,
  deleteExpense,
  searchExpenses,
  getExpensesByCategory,
  getSortedExpenses,
} from '@/services/expenseApi';

const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Entertainment',
  'Bills', 'Health', 'Education', 'Investments', 'Other',
];

const categoryIcons = {
  Food: <Utensils className="w-4 h-4" />,
  Travel: <Plane className="w-4 h-4" />,
  Shopping: <ShoppingBag className="w-4 h-4" />,
  Entertainment: <Film className="w-4 h-4" />,
  Bills: <FileText className="w-4 h-4" />,
  Health: <HeartPulse className="w-4 h-4" />,
  Education: <GraduationCap className="w-4 h-4" />,
  Investments: <TrendingUp className="w-4 h-4" />,
  Other: <CircleEllipsis className="w-4 h-4" />,
};

const categoryColors = {
  Food: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
  Travel: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  Shopping: "bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400",
  Entertainment: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  Bills: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400",
  Health: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  Education: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400",
  Investments: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Other: "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400",
};

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
  const { toast } = useToast();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortKey, setSortKey] = useState('0'); // index into SORT_OPTIONS
  const [dateFilter, setDateFilter] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

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

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenAddDialog = () => {
    setNewExpense({ ...emptyForm, expenseDate: new Date() });
    setFormError('');
    setIsAddOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortKey('0');
    setDateFilter(null);
    setCurrentPage(1);
  };

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
      toast({
        title: "Success",
        description: "Expense added successfully.",
      });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add expense.');
      toast({
        title: "Error",
        description: "Failed to add expense.",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Expense updated successfully.",
      });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update expense.');
      toast({
        title: "Error",
        description: "Failed to update expense.",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Expense deleted successfully.",
      });
    } catch (err) {
      setError('Failed to delete expense.');
      toast({
        title: "Error",
        description: "Failed to delete expense.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // ── Derived State ─────────────────────────────────────────────────────────

  const displayedExpenses = useMemo(() => {
    let result = expenses;
    if (dateFilter) {
      const formattedDate = format(dateFilter, 'yyyy-MM-dd');
      result = result.filter((e) => e.expenseDate === formattedDate);
    }
    return result;
  }, [expenses, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(displayedExpenses.length / PAGE_SIZE));
  const paginatedExpenses = displayedExpenses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalExpenses = displayedExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const currentMonthSpend = expenses
    .filter((e) => e.expenseDate && isSameMonth(parseISO(e.expenseDate), new Date()))
    .reduce((s, e) => s + (e.amount || 0), 0);
  const avgExpense = displayedExpenses.length > 0 ? totalExpenses / displayedExpenses.length : 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in duration-500 bg-[#FAFAF8] dark:bg-background min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0F3D2E] dark:text-emerald-50">
            Expenses
          </h1>
          <p className="text-muted-foreground mt-1">Manage and track all your outgoing transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={fetchExpenses} title="Refresh" className="h-11 w-11 rounded-xl shadow-sm hover:shadow">
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button
            className="h-11 px-6 rounded-xl gap-2 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white shadow-md hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
            onClick={handleOpenAddDialog}
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Add Expense</span>
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-card overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#16A34A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#16A34A]/10 text-[#16A34A] rounded-2xl">
                <WalletCards className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-50 mt-1">
                  ₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-card overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#16A34A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#16A34A]/10 text-[#16A34A] rounded-2xl">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-50 mt-1">
                  {displayedExpenses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-card overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#16A34A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#16A34A]/10 text-[#16A34A] rounded-2xl">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Expense</p>
                <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-50 mt-1">
                  ₹{avgExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-card overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#16A34A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-50 mt-1">
                  ₹{currentMonthSpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-card p-4 rounded-2xl shadow-sm flex flex-col lg:flex-row gap-4 border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-muted/30 border-transparent focus-visible:bg-transparent focus-visible:ring-[#16A34A]/20 focus-visible:border-[#16A34A] transition-all text-base"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-xl bg-muted/30 border-transparent focus:ring-[#16A34A]/20">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full sm:w-[180px] h-12 rounded-xl justify-start bg-muted/30 border-transparent hover:bg-muted/50 transition-colors font-normal",
                  dateFilter && "text-[#16A34A] bg-[#16A34A]/5 border-[#16A34A]/20"
                )}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {dateFilter ? format(dateFilter, 'MMM dd, yyyy') : 'Filter by Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-xl" align="end">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
                className="rounded-xl"
              />
            </PopoverContent>
          </Popover>

          <Select value={sortKey} onValueChange={setSortKey}>
            <SelectTrigger className="w-full sm:w-[170px] h-12 rounded-xl bg-muted/30 border-transparent focus:ring-[#16A34A]/20">
              <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {SORT_OPTIONS.map((opt, i) => (
                <SelectItem key={i} value={String(i)}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {(searchQuery || selectedCategory !== 'all' || dateFilter || sortKey !== '0') && (
            <Button 
              variant="ghost" 
              onClick={handleClearFilters}
              className="h-12 w-12 sm:w-auto rounded-xl text-muted-foreground hover:text-foreground"
              title="Clear filters"
            >
              <FilterX className="w-5 h-5 sm:mr-2" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#16A34A]">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="text-muted-foreground font-medium">Loading expenses...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30 sticky top-0 backdrop-blur-sm z-10">
                  <TableRow className="hover:bg-transparent border-b-border/50">
                    <TableHead className="font-semibold h-12 text-[#0F3D2E] dark:text-emerald-50">Expense Details</TableHead>
                    <TableHead className="font-semibold h-12 text-[#0F3D2E] dark:text-emerald-50">Category</TableHead>
                    <TableHead className="font-semibold h-12 text-[#0F3D2E] dark:text-emerald-50">Date</TableHead>
                    <TableHead className="text-right font-semibold h-12 text-[#0F3D2E] dark:text-emerald-50">Amount</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExpenses.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={5} className="h-72">
                        <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                          <div className="w-20 h-20 bg-[#16A34A]/10 rounded-full flex items-center justify-center mb-6">
                            <Wallet className="w-10 h-10 text-[#16A34A]" />
                          </div>
                          <h3 className="text-xl font-semibold text-[#0F3D2E] dark:text-emerald-50 mb-2">No expenses found</h3>
                          <p className="text-muted-foreground max-w-sm mb-6">
                            {searchQuery || dateFilter || selectedCategory !== 'all' 
                              ? "Try adjusting your filters to find what you're looking for."
                              : "You haven't recorded any expenses yet. Start tracking your spending today!"}
                          </p>
                          <Button 
                            className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl shadow-md transition-all hover:shadow-lg px-6"
                            onClick={handleOpenAddDialog}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Expense
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedExpenses.map((expense) => {
                      const Icon = categoryIcons[expense.category] || categoryIcons.Other;
                      const colorClass = categoryColors[expense.category] || categoryColors.Other;
                      
                      return (
                        <TableRow 
                          key={expense.id} 
                          className="group hover:bg-muted/50 even:bg-muted/20 transition-colors border-b-border/50"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorClass)}>
                                {Icon}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground group-hover:text-[#16A34A] transition-colors">{expense.title}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("font-medium rounded-lg border px-3 py-1", colorClass)}>
                              {expense.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground font-medium">
                            {format(parseISO(expense.expenseDate), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold text-foreground">
                              -₹{(expense.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl hover:bg-muted"
                                >
                                  <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl w-40">
                                <DropdownMenuItem
                                  className="cursor-pointer py-2"
                                  onClick={() => {
                                    setSelectedExpense({ ...expense });
                                    setFormError('');
                                    setIsEditOpen(true);
                                  }}
                                >
                                  <Pencil className="w-4 h-4 mr-3 text-blue-500" />
                                  <span className="font-medium">Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer py-2"
                                  onClick={() => {
                                    setSelectedExpense(expense);
                                    setIsDeleteOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-3" />
                                  <span className="font-medium">Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {displayedExpenses.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-muted/20 border-t border-border/50">
                <p className="text-sm font-medium text-muted-foreground">
                  Showing <span className="text-foreground">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
                  <span className="text-foreground">{Math.min(currentPage * PAGE_SIZE, displayedExpenses.length)}</span> of{' '}
                  <span className="text-foreground">{displayedExpenses.length}</span> results
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="rounded-lg h-9 w-9 border-transparent hover:bg-muted"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages)
                    .map((page, idx, arr) => (
                      <div key={page} className="flex items-center">
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">…</span>
                        )}
                        <Button
                          variant={page === currentPage ? 'default' : 'ghost'}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "rounded-lg h-9 w-9 font-medium",
                            page === currentPage 
                              ? "bg-[#16A34A] text-white hover:bg-[#16A34A]/90" 
                              : "hover:bg-muted text-muted-foreground"
                          )}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="rounded-lg h-9 w-9 border-transparent hover:bg-muted"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Add Expense Dialog ────────────────────────────────────────────── */}
      <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) setFormError(''); }}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0F3D2E] dark:text-emerald-50">Add New Expense</DialogTitle>
            <DialogDescription>Add a new expense to track your spending</DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="add-title" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Title *</Label>
              <Input
                id="add-title"
                placeholder="e.g., Grocery Shopping"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-amount" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Amount (₹) *</Label>
              <Input
                id="add-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-[#0F3D2E] dark:text-gray-300">Category *</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-[#0F3D2E] dark:text-gray-300">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-11 rounded-xl font-normal">
                    <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                    {newExpense.expenseDate ? format(newExpense.expenseDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={newExpense.expenseDate}
                    onSelect={(date) => setNewExpense({ ...newExpense, expenseDate: date })}
                    initialFocus
                    className="rounded-xl"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl h-11" onClick={() => setIsAddOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl h-11 shadow-md"
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
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0F3D2E] dark:text-emerald-50">Edit Expense</DialogTitle>
            <DialogDescription>Update the expense details</DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          {selectedExpense && (
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Title *</Label>
                <Input
                  id="edit-title"
                  value={selectedExpense.title}
                  onChange={(e) => setSelectedExpense({ ...selectedExpense, title: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Amount (₹) *</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={selectedExpense.amount}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, amount: parseFloat(e.target.value) })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-[#0F3D2E] dark:text-gray-300">Category</Label>
                <Select
                  value={selectedExpense.category}
                  onValueChange={(value) =>
                    setSelectedExpense({ ...selectedExpense, category: value })
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={selectedExpense.expenseDate || ''}
                  onChange={(e) =>
                    setSelectedExpense({ ...selectedExpense, expenseDate: e.target.value })
                  }
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl h-11" onClick={() => setIsEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl h-11 shadow-md"
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
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">"{selectedExpense?.title}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={saving} className="rounded-xl h-11">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl h-11 shadow-sm"
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
