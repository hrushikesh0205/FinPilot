import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { cn } from '@/utils/utils';

export function NotFoundPage({ setCurrentPage }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center space-y-8 max-w-md">
        {/* Animated 404 */}
        <div className="relative">
          <div className="text-[150px] sm:text-[200px] font-bold leading-none text-muted/20 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
              <Search className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground">
            Oops! It looks like the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
            onClick={() => setCurrentPage('/dashboard')}
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Suggestions */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">You might want to check:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Dashboard', 'Expenses', 'Budgets', 'Reports', 'Settings'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(`/${page.toLowerCase()}`)}
                className="px-4 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="pt-8">
          <button
            onClick={() => setCurrentPage('/')}
            className="flex items-center gap-2 mx-auto opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">ExpenseIQ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
