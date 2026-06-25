import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sun,
  Moon,
  Bell,
  Shield,
  Globe,
  Palette,
  Trash2,
  Download,
  AlertCircle,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [currency, setCurrency] = useState('INR');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    budget: true,
    billReminders: true,
    aiInsights: true,
    weeklyReports: false,
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application preferences
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Choose between light and dark mode
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setTheme('light')}
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Localisation
          </CardTitle>
          <CardDescription>
            Set your preferred currency and locale settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Currency</p>
              <p className="text-sm text-muted-foreground">
                Display amounts in your preferred currency
              </p>
            </div>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
              { key: 'push', label: 'Push Notifications', desc: 'Get instant updates on your device' },
              { key: 'budget', label: 'Budget Alerts', desc: 'Get notified when approaching budget limits' },
              { key: 'billReminders', label: 'Bill Reminders', desc: 'Receive reminders for upcoming bills' },
              { key: 'aiInsights', label: 'AI Insights', desc: 'Get notified about new insights' },
              { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly financial summaries' },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">{setting.desc}</p>
                </div>
                <Switch
                  checked={notifications[setting.key]}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, [setting.key]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Session Management</p>
              <p className="text-sm text-muted-foreground">
                View and manage your active sessions
              </p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Login History</p>
              <p className="text-sm text-muted-foreground">
                View recent login activity
              </p>
            </div>
            <Button variant="outline">View</Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export or delete your account data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-muted-foreground">
                Download all your financial data
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <div>
              <p className="font-medium text-rose-600 dark:text-rose-400">
                Delete Account
              </p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">ExpenseIQ</p>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            </div>
            <Button variant="outline" size="sm">
              Check for Updates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
