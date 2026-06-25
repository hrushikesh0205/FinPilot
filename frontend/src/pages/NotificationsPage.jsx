import { useState } from 'react';
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
  MoreHorizontal,
  CheckCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { notifications } from '@/data/mockData';

const notificationTypes = {
  budget: { icon: PiggyBank, color: 'text-amber-500', bg: 'bg-amber-500/20' },
  report: { icon: FileText, color: 'text-cyan-500', bg: 'bg-cyan-500/20' },
  ai: { icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/20' },
  bill: { icon: Receipt, color: 'text-rose-500', bg: 'bg-rose-500/20' },
  transaction: { icon: Receipt, color: 'text-violet-500', bg: 'bg-violet-500/20' },
};

export function NotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const filteredNotifications = notificationList.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleMarkAsRead = (id) => {
    setNotificationList(
      notificationList.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotificationList(notificationList.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotificationList(notificationList.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your financial activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="w-4 h-4" />
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
              <p className="text-xl font-bold">{notificationList.length}</p>
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
              <p className="text-xl font-bold">{notificationList.length - unreadCount}</p>
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
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="font-medium">No notifications</p>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const typeConfig = notificationTypes[notification.type] || notificationTypes.transaction;
                  const IconComponent = typeConfig.icon;

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
                              <p className={cn(
                                'font-medium',
                                !notification.read && 'text-emerald-600 dark:text-emerald-400'
                              )}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {notification.time}
                              </p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDelete(notification.id)}
                              >
                                <Trash2 className="w-4 h-4" />
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
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
