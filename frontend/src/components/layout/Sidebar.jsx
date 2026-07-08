import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Receipt,
  FolderKanban,
  Wallet,
  PiggyBank,
  Sparkles,
  BarChart3,
  ScanLine,
  Bell,
  Settings,
  User,
  Menu,
  X,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Expenses', icon: Receipt, path: '/expenses' },
  { name: 'Categories', icon: FolderKanban, path: '/categories' },
  { name: 'Accounts', icon: Wallet, path: '/accounts' },
  { name: 'Budgets', icon: PiggyBank, path: '/budgets' },
  { name: 'AI Insights', icon: Sparkles, path: '/insights' },
  { name: 'Reports', icon: BarChart3, path: '/reports' },
  { name: 'Receipt Scanner', icon: ScanLine, path: '/scanner' },
  { name: 'Notifications', icon: Bell, path: '/notifications' },
  { name: 'Settings', icon: Settings, path: '/settings' },
  { name: 'Profile', icon: User, path: '/profile' },
];

export function Sidebar({ currentPage, setCurrentPage, collapsed, setCollapsed }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  // Generate initials from user name
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out',
          collapsed ? 'w-[70px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className={cn(
            'flex items-center h-16 px-4 border-b border-border',
            collapsed ? 'justify-center' : 'justify-between'
          )}>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  FinPilot
                </span>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
            </Button>
          </div>

          {/* Navigation Items */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              <TooltipProvider delayDuration={0}>
                {navItems.map((item) => (
                  <Tooltip key={item.name}>
                    <TooltipTrigger side="right">
                      <button
                        onClick={() => {
                          setCurrentPage(item.path);
                          setMobileOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                          currentPage === item.path
                            ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                          collapsed && 'justify-center'
                        )}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                      </button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="font-medium">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
          </ScrollArea>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            {!collapsed ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={logout}
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Sign Out</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
