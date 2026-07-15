import { useState, useEffect, useCallback } from 'react';
import { Search, Bell, Moon, Sun, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/utils';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getAllNotifications, getUnreadCount } from '@/services/notificationApi';

export function Navbar({ collapsed }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userName  = user?.name  || 'User';
  const userEmail = user?.email || '';
  const initials  = getInitials(userName);
  const profileImage = user?.profileImage || null;

  // ── Load notification count + preview ────────────────────────────────
  const fetchNotificationData = useCallback(async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        getUnreadCount(),
        getAllNotifications(),
      ]);
      setUnreadCount(countRes.data?.count ?? 0);
      // Show up to 4 most recent notifications in the dropdown preview
      setRecentNotifications((listRes.data || []).slice(0, 4));
    } catch (err) {
      // Silently fail — badge just won't show a count
      setUnreadCount(0);
      setRecentNotifications([]);
    }
  }, []);

  useEffect(() => {
    fetchNotificationData();
  }, [fetchNotificationData]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8080${path}`;
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300',
        collapsed ? 'left-[70px]' : 'left-[220px]',
        'left-0 lg:left-[220px]'
      )}
    >
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 dark:bg-slate-900/80 border border-border/40 shadow-sm hover:shadow-md rounded-full focus-visible:ring-[#0F3D2E] dark:focus-visible:ring-[#16A34A] focus-visible:ring-1 transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative hover:bg-[#0F3D2E]/5 dark:hover:bg-[#14532D] hover:text-[#0F3D2E] dark:hover:text-emerald-50 rounded-lg transition-colors"
          >
            <Sun className={cn('h-5 w-5 transition-transform', theme === 'dark' && 'rotate-90 scale-0')} />
            <Moon className={cn('absolute h-5 w-5 transition-transform', theme === 'light' && '-rotate-90 scale-0')} />
          </Button>

          {/* Notifications */}
          <DropdownMenu onOpenChange={(open) => { if (open) fetchNotificationData(); }}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-[#0F3D2E]/5 dark:hover:bg-[#14532D] hover:text-[#0F3D2E] dark:hover:text-emerald-50 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {recentNotifications.length === 0 ? (
                <DropdownMenuItem disabled className="justify-center text-muted-foreground py-4 text-sm">
                  No notifications yet.
                </DropdownMenuItem>
              ) : (
                recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          notification.read ? 'bg-muted-foreground' : 'bg-emerald-500'
                        )}
                      />
                      <span className="font-medium text-sm">{notification.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground pl-4">
                      {notification.message}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center text-emerald-600 dark:text-emerald-400 font-medium">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 p-0 rounded-full hover:bg-[#0F3D2E]/5 dark:hover:bg-[#14532D] transition-colors focus-visible:ring-2 focus-visible:ring-[#0F3D2E] dark:focus-visible:ring-[#16A34A] focus-visible:ring-offset-2"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-1 ring-border/50 overflow-hidden">
                  {profileImage ? (
                    <img src={getImageUrl(profileImage)} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border/50 p-1.5">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{userName}</p>
                  <p className="text-xs text-muted-foreground leading-none mt-1 truncate">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-lg cursor-pointer transition-colors focus:bg-[#0F3D2E]/5 dark:focus:bg-[#14532D] focus:text-[#0F3D2E] dark:focus:text-emerald-50 py-2 px-2.5">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer transition-colors focus:bg-[#0F3D2E]/5 dark:focus:bg-[#14532D] focus:text-[#0F3D2E] dark:focus:text-emerald-50 py-2 px-2.5">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive rounded-lg cursor-pointer transition-colors focus:bg-destructive/10 focus:text-destructive py-2 px-2.5"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
