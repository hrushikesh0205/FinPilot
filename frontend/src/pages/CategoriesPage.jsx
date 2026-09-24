import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Plus,
  Pencil,
  Trash2,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  Heart,
  GraduationCap,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useToast } from '@/hooks/use-toast';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categoryApi';

const iconMap = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  Heart,
  GraduationCap,
  TrendingUp,
};

const colorOptions = [
  '#f97316',
  '#06b6d4',
  '#ec4899',
  '#8b5cf6',
  '#ef4444',
  '#22c55e',
  '#3b82f6',
  '#10b981',
];

export function CategoriesPage() {
  const { toast } = useToast();

  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'Receipt',
    color: '#10b981',
    budget: 0,
  });

  // ── Load categories from backend ──────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllCategories();
      setCategoryList(res.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      toast({
        title: 'Error',
        description: 'Failed to load categories. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ── Add Category ──────────────────────────────────────────────────────
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required.',
        variant: 'destructive',
      });
      return;
    }
    try {
      setIsSaving(true);
      await createCategory({
        name: newCategory.name,
        icon: newCategory.icon,
        color: newCategory.color,
        budget: newCategory.budget,
      });
      toast({ title: 'Success', description: 'Category added successfully.' });
      setIsAddOpen(false);
      setNewCategory({ name: '', icon: 'Receipt', color: '#10b981', budget: 0 });
      await fetchCategories();
    } catch (err) {
      console.error('Failed to add category:', err);
      toast({
        title: 'Error',
        description: 'Failed to add category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Edit Category ─────────────────────────────────────────────────────
  const handleEditCategory = async () => {
    if (!selectedCategory?.name?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required.',
        variant: 'destructive',
      });
      return;
    }
    try {
      setIsSaving(true);
      await updateCategory(selectedCategory.id, {
        name: selectedCategory.name,
        icon: selectedCategory.icon,
        color: selectedCategory.color,
        budget: selectedCategory.budget,
      });
      toast({ title: 'Success', description: 'Category updated successfully.' });
      setIsEditOpen(false);
      setSelectedCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to update category:', err);
      toast({
        title: 'Error',
        description: 'Failed to update category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Delete Category ───────────────────────────────────────────────────
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      setIsDeleting(true);
      await deleteCategory(selectedCategory.id);
      toast({
        title: 'Category deleted successfully.',
        description: `"${selectedCategory.name}" has been permanently removed.`,
      });
      setIsDeleteOpen(false);
      setSelectedCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message ||
          'Failed to delete category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const totalBudget = categoryList.reduce((sum, c) => sum + (c.budget || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage expense categories and budgets
          </p>
        </div>
        <Button
          className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Total Budget Card */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Monthly Budget</p>
              <p className="text-3xl font-bold">
                ₹{totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Categories</p>
                <p className="font-semibold">{categoryList.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Active</p>
                <p className="font-semibold">{categoryList.length}</p>
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
      {!loading && categoryList.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Receipt className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No categories yet</p>
          <p className="text-muted-foreground text-sm mb-4">
            Create your first category to start organizing expenses.
          </p>
          <Button
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && categoryList.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoryList.map((category) => {
            const IconComponent = iconMap[category.icon] || Receipt;
            const budget = category.budget || 0;
            const spent = 0; // Spending data comes from expenses, left as 0 here
            const budgetPercent = budget > 0 ? Math.round((spent / budget) * 100) : 0;

            return (
              <Card
                key={category.id}
                className="group hover:shadow-lg transition-all duration-300 hover:border-opacity-50"
                style={{ borderColor: category.color }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <IconComponent
                        className="w-6 h-6"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedCategory({ ...category });
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">
                      ₹{budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span
                      className="font-medium"
                      style={{ color: budgetPercent > 80 ? '#ef4444' : 'inherit' }}
                    >
                      ₹{spent.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={Math.min(budgetPercent, 100)} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{budgetPercent}% used</span>
                    <span className="text-muted-foreground">
                      ₹{(budget - spent).toLocaleString()} left
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Category Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new expense category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Subscriptions"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(iconMap).map((iconName) => {
                  const IconComponent = iconMap[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      className={cn(
                        'p-3 rounded-lg border transition-all',
                        newCategory.icon === iconName
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'hover:bg-muted'
                      )}
                      onClick={() =>
                        setNewCategory({ ...newCategory, icon: iconName })
                      }
                    >
                      <IconComponent className="w-5 h-5 mx-auto" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      'w-8 h-8 rounded-full transition-all',
                      newCategory.color === color && 'ring-2 ring-offset-2'
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      setNewCategory({ ...newCategory, color: color })
                    }
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="0"
                value={newCategory.budget}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    budget: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleAddCategory}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        selectedCategory.color === color && 'ring-2 ring-offset-2'
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setSelectedCategory({
                          ...selectedCategory,
                          color: color,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-budget">Monthly Budget (₹)</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={selectedCategory.budget}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      budget: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleEditCategory}
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
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Delete this category?{' '}
              {selectedCategory && (
                <span className="font-medium">"{selectedCategory.name}"</span>
              )}{' '}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteCategory}
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
