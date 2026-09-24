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
  WalletCards,
  FileUp,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Upload,
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
  checkDuplicateTransaction,
} from '@/services/expenseApi';
import {
  previewCsv,
  confirmCsvImport,
} from '@/services/csvImportApi';

const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Entertainment',
  'Bills', 'Health', 'Education', 'Investments', 'Salary', 'Freelance', 'Other',
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
  Salary: <Banknote className="w-4 h-4" />,
  Freelance: <WalletCards className="w-4 h-4" />,
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
  Salary: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  Freelance: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400",
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
  category: 'Food',
  expenseDate: new Date(),
  type: 'EXPENSE',
  account: 'Cash',
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

  // CSV Import States
  const [isCsvOpen, setIsCsvOpen] = useState(false);
  const [csvStep, setCsvStep] = useState(1); // 1 = select, 2 = map/preview, 3 = result
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreviewData, setCsvPreviewData] = useState(null);
  const [csvMappings, setCsvMappings] = useState({
    dateColumn: '',
    titleColumn: '',
    amountColumn: '',
    debitColumn: '',
    creditColumn: '',
    categoryColumn: '',
    accountColumn: '',
    typeColumn: '',
    defaultAccount: 'Bank Account',
    defaultCategory: 'Other',
  });
  const [csvImportResult, setCsvImportResult] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState('');

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

  // CSV Handlers
  const handleCsvFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setCsvLoading(true);
    setCsvError('');
    try {
      const res = await previewCsv(file);
      setCsvPreviewData(res.data);
      const sug = res.data.suggestedMappings || {};
      setCsvMappings({
        dateColumn: sug.dateColumn || res.data.headers?.[0] || '',
        titleColumn: sug.titleColumn || res.data.headers?.[1] || '',
        amountColumn: sug.amountColumn || '',
        debitColumn: sug.debitColumn || '',
        creditColumn: sug.creditColumn || '',
        categoryColumn: sug.categoryColumn || '',
        accountColumn: sug.accountColumn || '',
        typeColumn: sug.typeColumn || '',
        defaultAccount: 'Bank Account',
        defaultCategory: 'Other',
      });
      setCsvStep(2);
    } catch (err) {
      setCsvError(err.response?.data?.message || 'Failed to parse CSV file. Ensure it is a valid CSV statement.');
    } finally {
      setCsvLoading(false);
    }
  };

  const handleConfirmCsvImport = async () => {
    if (!csvPreviewData || !csvPreviewData.allRows) return;
    if (!csvMappings.titleColumn) {
      setCsvError('Please select a Description/Merchant column.');
      return;
    }
    if (!csvMappings.dateColumn) {
      setCsvError('Please select a Date column.');
      return;
    }
    if (!csvMappings.amountColumn && !csvMappings.debitColumn && !csvMappings.creditColumn) {
      setCsvError('Please select an Amount or Debit/Credit column.');
      return;
    }

    setCsvLoading(true);
    setCsvError('');
    try {
      const res = await confirmCsvImport({
        ...csvMappings,
        rows: csvPreviewData.allRows,
      });
      setCsvImportResult(res.data);
      setCsvStep(3);
      await fetchExpenses();
      toast({
        title: 'Statement Import Completed',
        description: `${res.data.importedCount} transactions imported, ${res.data.duplicateCount} duplicates skipped.`,
      });
    } catch (err) {
      setCsvError(err.response?.data?.message || 'Failed to import transactions.');
    } finally {
      setCsvLoading(false);
    }
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
        type: newExpense.type || 'EXPENSE',
        account: newExpense.account || 'Cash',
        notes: newExpense.notes || '',
      };
      await createExpense(payload);
      setIsAddOpen(false);
      setNewExpense(emptyForm);
      await fetchExpenses();
      toast({
        title: "Success",
        description: `${payload.type === 'INCOME' ? 'Income' : 'Expense'} added successfully.`,
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add expense.';
      setFormError(errMsg);
      toast({
        title: err.response?.status === 409 ? "Duplicate Transaction" : "Error",
        description: errMsg,
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
        type: selectedExpense.type || 'EXPENSE',
        account: selectedExpense.account || 'Cash',
        notes: selectedExpense.notes || '',
      };
      await updateExpense(selectedExpense.id, payload);
      setIsEditOpen(false);
      setSelectedExpense(null);
      await fetchExpenses();
      toast({
        title: "Success",
        description: "Transaction updated successfully.",
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update expense.';
      setFormError(errMsg);
      toast({
        title: err.response?.status === 409 ? "Duplicate Transaction" : "Error",
        description: errMsg,
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
            variant="outline"
            onClick={() => {
              setIsCsvOpen(true);
              setCsvStep(1);
              setCsvFile(null);
              setCsvPreviewData(null);
              setCsvImportResult(null);
              setCsvError('');
            }}
            className="h-11 px-4 rounded-xl gap-2 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 shadow-sm"
          >
            <FileUp className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold">Import CSV</span>
          </Button>
          <Button
            className="h-11 px-6 rounded-xl gap-2 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white shadow-md hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
            onClick={handleOpenAddDialog}
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Add Transaction</span>
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
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", colorClass)}>
                                {Icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-foreground group-hover:text-[#16A34A] transition-colors">{expense.title}</p>
                                  {expense.type === 'INCOME' && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                      Income
                                    </span>
                                  )}
                                </div>
                                {expense.account && (
                                  <span className="text-xs text-muted-foreground">{expense.account}</span>
                                )}
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
                            <span className={cn("font-bold text-base", expense.type === 'INCOME' ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                              {expense.type === 'INCOME' ? '+' : '-'}₹{(expense.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
              <button
                type="button"
                onClick={() => setNewExpense({ ...newExpense, type: 'EXPENSE' })}
                className={cn(
                  "py-2 text-sm font-semibold rounded-lg transition-all",
                  newExpense.type === 'EXPENSE'
                    ? "bg-white dark:bg-card text-destructive shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setNewExpense({ ...newExpense, type: 'INCOME' })}
                className={cn(
                  "py-2 text-sm font-semibold rounded-lg transition-all",
                  newExpense.type === 'INCOME'
                    ? "bg-white dark:bg-card text-emerald-600 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Income
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-title" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Title / Merchant *</Label>
              <Input
                id="add-title"
                placeholder="e.g., Grocery Shopping or Monthly Salary"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="add-account" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Account</Label>
                <Input
                  id="add-account"
                  placeholder="e.g. HDFC Bank, Cash"
                  value={newExpense.account}
                  onChange={(e) => setNewExpense({ ...newExpense, account: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-[#0F3D2E] dark:text-gray-300">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start h-11 rounded-xl font-normal text-left truncate">
                      <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                      {newExpense.expenseDate ? format(newExpense.expenseDate, 'dd/MM/yyyy') : 'Pick a date'}
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

            <div className="space-y-2">
              <Label htmlFor="add-notes" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Notes (Optional)</Label>
              <Input
                id="add-notes"
                placeholder="Additional details..."
                value={newExpense.notes}
                onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                className="h-11 rounded-xl"
              />
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
              {newExpense.type === 'INCOME' ? 'Add Income' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Expense Dialog ───────────────────────────────────────────── */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setFormError(''); }}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#0F3D2E] dark:text-emerald-50">Edit Transaction</DialogTitle>
            <DialogDescription>Update transaction details</DialogDescription>
          </DialogHeader>
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}
          {selectedExpense && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedExpense({ ...selectedExpense, type: 'EXPENSE' })}
                  className={cn(
                    "py-2 text-sm font-semibold rounded-lg transition-all",
                    selectedExpense.type !== 'INCOME'
                      ? "bg-white dark:bg-card text-destructive shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedExpense({ ...selectedExpense, type: 'INCOME' })}
                  className={cn(
                    "py-2 text-sm font-semibold rounded-lg transition-all",
                    selectedExpense.type === 'INCOME'
                      ? "bg-white dark:bg-card text-emerald-600 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Income
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-title" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Title / Merchant *</Label>
                <Input
                  id="edit-title"
                  value={selectedExpense.title}
                  onChange={(e) => setSelectedExpense({ ...selectedExpense, title: e.target.value })}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-account" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Account</Label>
                  <Input
                    id="edit-account"
                    value={selectedExpense.account || ''}
                    onChange={(e) => setSelectedExpense({ ...selectedExpense, account: e.target.value })}
                    className="h-11 rounded-xl"
                  />
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

              <div className="space-y-2">
                <Label htmlFor="edit-notes" className="font-semibold text-[#0F3D2E] dark:text-gray-300">Notes</Label>
                <Input
                  id="edit-notes"
                  value={selectedExpense.notes || ''}
                  onChange={(e) => setSelectedExpense({ ...selectedExpense, notes: e.target.value })}
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

      {/* ── CSV Import Modal ──────────────────────────────────────────────── */}
      <Dialog open={isCsvOpen} onOpenChange={(open) => { setIsCsvOpen(open); if (!open) setCsvError(''); }}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0F3D2E] dark:text-emerald-50 flex items-center gap-2">
              <FileUp className="w-6 h-6 text-emerald-600" />
              Import Bank Statement (CSV)
            </DialogTitle>
            <DialogDescription>
              {csvStep === 1 && "Upload your CSV bank or credit card statement to automatically import transactions."}
              {csvStep === 2 && "Match the columns from your CSV with FinPilot fields and preview the data."}
              {csvStep === 3 && "Statement import summary and duplicate detection results."}
            </DialogDescription>
          </DialogHeader>

          {csvError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {csvError}
            </div>
          )}

          {/* Step 1: File Selection */}
          {csvStep === 1 && (
            <div className="space-y-6 py-4">
              <div className="border-2 border-dashed border-border/80 hover:border-emerald-500/60 transition-colors rounded-2xl p-8 text-center flex flex-col items-center justify-center bg-muted/20">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-600">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-base font-semibold mb-1">Choose a CSV statement file</h4>
                <p className="text-sm text-muted-foreground mb-4">Supports statements from HDFC, SBI, ICICI, Axis, Chase, etc.</p>
                <label className="cursor-pointer">
                  <span className="inline-flex items-center justify-center px-5 py-2.5 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white font-medium text-sm rounded-xl shadow-md transition-all">
                    {csvLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Columns...
                      </>
                    ) : (
                      "Browse CSV File"
                    )}
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleCsvFileSelect}
                    disabled={csvLoading}
                  />
                </label>
              </div>

              <div className="rounded-xl p-4 bg-muted/30 border border-border/50 space-y-2 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Duplicate Protection Enabled
                </p>
                <p>Transactions matching the same date, merchant, amount, and account will be automatically recognized as duplicates and safely skipped.</p>
              </div>
            </div>
          )}

          {/* Step 2: Column Mapping & Preview */}
          {csvStep === 2 && csvPreviewData && (
            <div className="space-y-6 py-2">
              <div className="p-3 bg-muted/40 rounded-xl text-xs flex justify-between items-center">
                <span>File: <strong className="text-foreground">{csvFile?.name}</strong></span>
                <span>Detected Rows: <strong className="text-foreground">{csvPreviewData.totalRows}</strong></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Date Column *</Label>
                  <Select
                    value={csvMappings.dateColumn}
                    onValueChange={(val) => setCsvMappings({ ...csvMappings, dateColumn: val })}
                  >
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue placeholder="Select Date column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvPreviewData.headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Description / Merchant *</Label>
                  <Select
                    value={csvMappings.titleColumn}
                    onValueChange={(val) => setCsvMappings({ ...csvMappings, titleColumn: val })}
                  >
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue placeholder="Select Title column" />
                    </SelectTrigger>
                    <SelectContent>
                      {csvPreviewData.headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Amount Column</Label>
                  <Select
                    value={csvMappings.amountColumn}
                    onValueChange={(val) => setCsvMappings({ ...csvMappings, amountColumn: val })}
                  >
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue placeholder="Single Amount column (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- None --</SelectItem>
                      {csvPreviewData.headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Debit Column (Withdrawals)</Label>
                  <Select
                    value={csvMappings.debitColumn}
                    onValueChange={(val) => setCsvMappings({ ...csvMappings, debitColumn: val })}
                  >
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue placeholder="Debit column (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- None --</SelectItem>
                      {csvPreviewData.headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Credit Column (Deposits)</Label>
                  <Select
                    value={csvMappings.creditColumn}
                    onValueChange={(val) => setCsvMappings({ ...csvMappings, creditColumn: val })}
                  >
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue placeholder="Credit column (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- None --</SelectItem>
                      {csvPreviewData.headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Category Column</Label>
                  <Select
                    value={csvMappings.categoryColumn}
                    onValueChange={(val) => setCsvMappings({ ...csvMappings, categoryColumn: val })}
                  >
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue placeholder="Category column (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- None (Use Default) --</SelectItem>
                      {csvPreviewData.headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Default Category</Label>
                  <Select
                    value={csvMappings.defaultCategory}
                    onValueChange={(val) => setCsvMappings({ ...csvMappings, defaultCategory: val })}
                  >
                    <SelectTrigger className="h-10 rounded-xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Assign to Account</Label>
                  <Input
                    value={csvMappings.defaultAccount}
                    onChange={(e) => setCsvMappings({ ...csvMappings, defaultAccount: e.target.value })}
                    placeholder="e.g. HDFC Salary, SBI Savings"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Sample Data Preview Table */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CSV Data Sample (First 3 Rows)</Label>
                <div className="overflow-x-auto rounded-xl border border-border/60 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b border-border/50">
                      <tr>
                        {csvPreviewData.headers.slice(0, 5).map((h, i) => (
                          <th key={i} className="p-2 font-semibold text-muted-foreground">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {csvPreviewData.previewRows.slice(0, 3).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-muted/20">
                          {csvPreviewData.headers.slice(0, 5).map((h, cIdx) => (
                            <td key={cIdx} className="p-2 text-muted-foreground truncate max-w-[120px]">{row[h] || '—'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" className="rounded-xl h-10 text-xs" onClick={() => setCsvStep(1)}>
                  Back
                </Button>
                <Button
                  className="bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl h-10 text-xs shadow-md"
                  onClick={handleConfirmCsvImport}
                  disabled={csvLoading}
                >
                  {csvLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-1.5" />}
                  Confirm & Import Transactions
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* Step 3: Result Summary */}
          {csvStep === 3 && csvImportResult && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Imported</p>
                  <p className="text-3xl font-extrabold text-emerald-600 mt-1">{csvImportResult.importedCount}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Duplicates Skipped</p>
                  <p className="text-3xl font-extrabold text-amber-600 mt-1">{csvImportResult.duplicateCount}</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Total Parsed</p>
                  <p className="text-3xl font-extrabold text-blue-600 mt-1">{csvImportResult.totalParsed}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-xs text-muted-foreground space-y-1.5">
                <p className="font-semibold text-foreground">Import Completed Successfully</p>
                <p>All non-duplicate transactions have been credited or debited to your transaction history and factored into your dashboard analytics.</p>
                {csvImportResult.duplicateCount > 0 && (
                  <p className="text-amber-600 dark:text-amber-400">
                    * {csvImportResult.duplicateCount} duplicate transactions were safely skipped because identical records already exist in your account.
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button
                  className="w-full bg-[#16A34A] hover:bg-[#16A34A]/90 text-white rounded-xl h-11 font-semibold shadow-md"
                  onClick={() => setIsCsvOpen(false)}
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
