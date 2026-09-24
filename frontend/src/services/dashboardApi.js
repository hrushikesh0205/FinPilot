import axiosInstance from './axiosInstance';

// GET /dashboard/analytics?period= — rich analytics with period filters
export const getDashboardAnalytics = (period = 'THIS_MONTH') =>
  axiosInstance.get('/dashboard/analytics', { params: { period } });

// GET /dashboard — overall summary for logged-in user
export const getDashboard = () =>
  axiosInstance.get('/dashboard');

// GET /dashboard/{year}/{month} — monthly summary
export const getMonthlySummary = (year, month) =>
  axiosInstance.get(`/dashboard/${year}/${month}`);
