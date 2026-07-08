import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '@/api/authApi';

const AuthContext = createContext(null);

// Decode JWT payload without a library
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children, onLogout }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Listen for 401 events fired by axiosInstance
  const handleAuthLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (onLogout) onLogout();
  }, [onLogout]);

  useEffect(() => {
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, [handleAuthLogout]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(email, password);
      // Backend returns plain JWT string
      const jwt = response.data;
      const decoded = decodeToken(jwt);
      const userData = {
        email: decoded?.sub || email,
        name: decoded?.name || email.split('@')[0],
      };
      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        'Invalid credentials. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Create the account
      await registerUser(name, email, password);
    } catch (err) {
      // Extract backend message from various response shapes:
      // { message: "..." }  OR  ErrorResponse { status, message, timestamp }  OR plain string
      const data = err.response?.data;
      const backendMessage =
        (data && typeof data === 'object' && data.message) ||
        (typeof data === 'string' && data) ||
        null;

      // Build a context-aware fallback based on HTTP status
      const status = err.response?.status;
      let fallback = 'Registration failed. Please try again.';
      if (status === 409) fallback = 'This email is already registered. Please sign in instead.';
      else if (status === 400) fallback = 'Invalid registration details. Please check your input.';
      else if (status === 500) fallback = 'Server error. Please try again later.';
      else if (!err.response) fallback = 'Network error. Please check your connection.';

      const message = backendMessage || fallback;
      setError(message);
      setLoading(false);
      return { success: false, message };
    }

    // Step 2: Auto-login after successful registration
    // login() manages its own loading/error state, so reset ours first
    setLoading(false);
    const result = await login(email, password);
    return result;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    if (onLogout) onLogout();
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
