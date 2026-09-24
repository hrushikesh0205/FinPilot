import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  PiggyBank,
  FileText,
  Sparkles,
  Receipt,
  Check,
  Trash2,
  CheckCheck,
  Loader2,
  ShoppingBag,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useToast } from '@/hooks/use-toast';
import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '@/services/notificationApi';

// Maps backend notification types to icon + colour
const notificationTypes = {
  expense:      { icon: Receipt,       color: 'text-violet-500',  bg: 'bg-violet-500/20' },
  category:     { icon: Tag,           color: 'text-cyan-500',    bg: 'bg-cyan-500/20'   },
  budget:       { icon: PiggyBank,     color: 'text-amber-500',   bg: 'bg-amber-500/20'  },
  budget_alert: { icon: AlertTriangle, color: 'text-rose-500',    bg: 'bg-rose-500/20'   },
  scanner:      { icon: FileText,      color: 'text-emerald-500', bg: 'bg-emerald-500/20'},
  ai:           { icon: Sparkles,      color: 'text-emerald-500', bg: 'bg-emerald-500/20'},
};

const fallbackType = { icon: Bell, color: 'text-muted-foreground', bg: 'bg-muted' };

// Format ISO timestamp into a human-readable relative string
function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function NotificationsPage() {
  const { toast } = useToast();

  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null); // id or 'all'

  // ── Fetch from backend ─────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllNotifications();
      setNotificationList(res.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      toast({
        title: 'Error',
        description: 'Failed to load notifications.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Computed counts ────────────────────────────────────────────────────
  const totalCount  = notificationList.length;
  const unreadCount = notificationList.filter((n) => !n.read).length;
  const readCount   = totalCount - unreadCount;

  const filteredNotifications = notificationList.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  // ── Mark one as read ───────────────────────────────────────────────────
  const handleMarkAsRead = async (id) => {
    try {
      setActionLoading(id);
      await markAsRead(id);
      setNotificationList((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      toast({ title: 'Error', description: 'Could not mark as read.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Mark all as read ───────────────────────────────────────────────────
  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading('all');
      await markAllAsRead();
      setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
      toast({ title: 'Done', description: 'All notifications marked as read.' });
    } catch (err) {
      toast({ title: 'Error', description: 'Could not mark all as read.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  // ── Delete one ─────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      setActionLoading(id);
      await deleteNotification(id);
      setNotificationList((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      toast({ title: 'Error', description: 'Could not delete notification.', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your financial activity</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleMarkAllAsRead}
              disabled={actionLoading === 'all'}
            >
              {actionLoading === 'all'
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CheckCheck className="w-4 h-4" />}
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{totalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unread</p>
              <p className="text-xl font-bold">{unreadCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <CheckCheck className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Read</p>
              <p className="text-xl font-bold">{readCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread
          {unreadCount > 0 && (
            <Badge className="ml-2" variant="secondary">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="divide-y divide-border">
              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-3" />
                  <p className="text-sm text-muted-foreground">Loading notifications…</p>
                </div>
              )}

              {/* Empty */}
              {!loading && filteredNotifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-medium">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet.'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filter === 'unread'
                      ? "You're all caught up!"
                      : 'Notifications will appear here as you use FinPilot.'}
                  </p>
                </div>
              )}

              {/* List */}
              {!loading &&
                filteredNotifications.map((notification) => {
                  const typeConfig =
                    notificationTypes[notification.type] || fallbackType;
                  const IconComponent = typeConfig.icon;
                  const isLoading = actionLoading === notification.id;

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-muted/50 transition-colors group',
                        !notification.read && 'bg-emerald-500/5'
                      )}
                    >
                      <div className="flex gap-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                            typeConfig.bg
                          )}
                        >
                          <IconComponent className={cn('w-5 h-5', typeConfig.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p
                                className={cn(
                                  'font-medium',
                                  !notification.read &&
                                    'text-emerald-600 dark:text-emerald-400'
                                )}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  disabled={isLoading}
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  {isLoading
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Check className="w-4 h-4" />}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                disabled={isLoading}
                                onClick={() => handleDelete(notification.id)}
                              >
                                {isLoading
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : <Trash2 className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
