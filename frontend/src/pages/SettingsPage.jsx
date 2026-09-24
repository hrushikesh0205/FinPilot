import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sun,
  Moon,
  Palette,
  User,
  Lock,
  Loader2,
  Check,
  Info,
  Code2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getProfile, updateProfileDetails, changePassword } from '@/services/authApi';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, login }     = useAuth();
  const { toast }           = useToast();

  // ── Profile state ────────────────────────────────────────────────────────
  const [name, setName]             = useState(user?.name || '');
  const [email, setEmail]           = useState(user?.email || '');
  const [isSavingName, setIsSavingName] = useState(false);

  // ── Password state ───────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent]         = useState(false);
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Load real profile from backend on mount
  useEffect(() => {
    getProfile()
      .then((res) => {
        setName(res.data.name || '');
        setEmail(res.data.email || '');
      })
      .catch(() => {
        // Fallback to JWT-decoded data already in AuthContext
        setName(user?.name || '');
        setEmail(user?.email || '');
      });
  }, []);

  // ── Save name ─────────────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!name.trim()) {
      toast({ title: 'Validation error', description: 'Name cannot be empty.', variant: 'destructive' });
      return;
    }
    try {
      setIsSavingName(true);
      await updateProfileDetails(name.trim(), null);
      // Update localStorage so Navbar reflects the new name immediately
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...stored, name: name.trim() }));
      toast({ title: 'Profile updated', description: 'Your name has been saved.' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Could not update profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingName(false);
    }
  };

  // ── Change password ───────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast({ title: 'Validation error', description: 'Please enter your current password.', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Validation error', description: 'New password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Validation error', description: 'New passwords do not match.', variant: 'destructive' });
      return;
    }
    try {
      setIsSavingPassword(true);
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({ title: 'Password changed', description: 'Your password has been updated successfully.' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Could not change password.',
        variant: 'destructive',
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* ── 1. APPEARANCE ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-500" />
            Appearance
          </CardTitle>
          <CardDescription>Choose how FinPilot looks to you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">Switch between Light and Dark mode</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                className={cn('gap-2', theme === 'light' && 'bg-gradient-to-r from-emerald-500 to-teal-600')}
                onClick={() => setTheme('light')}
              >
                <Sun className="w-4 h-4" />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                className={cn('gap-2', theme === 'dark' && 'bg-gradient-to-r from-emerald-500 to-teal-600')}
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-4 h-4" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. USER PROFILE ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            User Profile
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Name + Email */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Full Name</Label>
              <Input
                id="settings-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email Address</Label>
              <Input
                id="settings-email"
                value={email}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleSaveName}
              disabled={isSavingName}
            >
              {isSavingName ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save Name
            </Button>
          </div>

          <Separator />

          {/* Change Password */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <p className="font-medium">Change Password</p>
            </div>

            <div className="space-y-3">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCurrent((v) => !v)}
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNew ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowNew((v) => !v)}
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn(
                      'pr-10',
                      confirmPassword && confirmPassword !== newPassword
                        ? 'border-rose-400 focus-visible:ring-rose-400'
                        : ''
                    )}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-rose-500">Passwords do not match</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600"
                onClick={handleChangePassword}
                disabled={isSavingPassword}
              >
                {isSavingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Update Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. ABOUT FINPILOT ─────────────────────────────────────────────── */}
      <Card className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-500" />
            About FinPilot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-background/60 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Version</p>
              <p className="font-semibold">1.0.0</p>
            </div>
            <div className="p-4 rounded-xl bg-background/60 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Currency</p>
              <p className="font-semibold">₹ INR (India)</p>
            </div>
            <div className="p-4 rounded-xl bg-background/60 border border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Stack</p>
              <p className="font-semibold">React + Spring Boot</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-medium">FinPilot</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A full-stack personal finance management application built as a student placement
                project. Track expenses, manage budgets, scan receipts, and view financial
                reports — all in one place.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Built with React 18, Spring Boot 3, MySQL · Designed with Radix UI &amp; Tailwind CSS
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
