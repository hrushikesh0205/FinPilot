import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export function LoginPage({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, loading } = useAuth();

  // Validation
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isValid = validateEmail(email) && password.length >= 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Password is required.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      setCurrentPage('/dashboard');
    } else {
      setErrorMsg(result.message || 'Login failed. Please try again.');
    }
  };

  return (
<div className="min-h-screen relative overflow-hidden bg-[#0F3D2E] dark:bg-[#0F172A]">      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
       <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]"></div>
       <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-emerald-500/20 blur-[100px]"></div>  </div>

      {/* Header */}
      <header className="relative z-10 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentPage('/')}
            className="flex items-center gap-2 text-[#16A34A] hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white dark:bg-card rounded-xl">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#0F3D2E] to-[#1e5c40] dark:from-emerald-500 dark:to-emerald-600 shadow-[0_2px_10px_rgba(15,61,46,0.28)] dark:shadow-[0_2px_10px_rgba(22,163,74,0.28)]"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-[#0F3D2E] dark:text-white">Welcome back</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Banner */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg('');
                    }}
                    className="pl-10 h-11 bg-white border-gray-200 text-gray-900 rounded-lg focus-visible:ring-1 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
                  <button type="button" className="text-sm font-medium text-[#16A34A] hover:text-[#15803d] transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    className="pl-10 pr-10 h-11 bg-white border-gray-200 text-gray-900 rounded-lg focus-visible:ring-1 focus-visible:ring-[#16A34A] focus-visible:border-[#16A34A] transition-colors"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-[1px] active:translate-y-[1px] bg-[#0F3D2E] dark:bg-[#16A34A] hover:bg-[#0F3D2E]/90 dark:hover:bg-[#14532D]"
                disabled={loading || !isValid}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-white/70" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-4">
            <p className="text-sm text-gray-500 text-center">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentPage('/register')}
                className="text-[#16A34A] hover:text-[#15803d] transition-colors font-semibold"
              >
                Create Account
              </button>
            </p>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-sm text-emerald-100/60 font-medium">
        &copy; 2024 FinPilot. All rights reserved.
      </footer>
    </div>
  );
}
