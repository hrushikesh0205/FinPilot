import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories, budgets } from '@/data/mockData';

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
  const [categoryList, setCategoryList] = useState(categories);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'Receipt',
    color: '#10b981',
    budget: 0,
  });

  const handleAddCategory = () => {
    const category = {
      id: Date.now(),
      name: newCategory.name,
      icon: newCategory.icon,
      color: newCategory.color,
      budget: newCategory.budget,
    };
    setCategoryList([...categoryList, category]);
    setIsAddOpen(false);
    setNewCategory({ name: '', icon: 'Receipt', color: '#10b981', budget: 0 });
  };

  const handleEditCategory = () => {
    setCategoryList(
      categoryList.map((c) =>
        c.id === selectedCategory.id ? selectedCategory : c
      )
    );
    setIsEditOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = () => {
    setCategoryList(categoryList.filter((c) => c.id !== selectedCategory.id));
    setIsDeleteOpen(false);
    setSelectedCategory(null);
  };

  const getTotalSpent = (categoryName) => {
    const budget = budgets.categories.find((c) => c.category === categoryName);
    return budget ? budget.spent : 0;
  };

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
                ₹{categories.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
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

      {/* Categories Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoryList.map((category) => {
          const IconComponent = iconMap[category.icon] || Receipt;
          const spent = getTotalSpent(category.name);
          const budgetPercent = Math.round((spent / category.budget) * 100);

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
                        setSelectedCategory(category);
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
                    ₹{category.budget.toLocaleString()}
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
                <Progress
                  value={Math.min(budgetPercent, 100)}
                  className="h-2"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{budgetPercent}% used</span>
                  <span className="text-muted-foreground">
                    ₹{(category.budget - spent).toLocaleString()} left
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
                    budget: parseFloat(e.target.value),
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
            >
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
            <DialogDescription>
              Update category details
            </DialogDescription>
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
                      budget: parseFloat(e.target.value),
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
            >
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
              Are you sure you want to delete this category? All expenses in this
              category will become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={handleDeleteCategory}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
