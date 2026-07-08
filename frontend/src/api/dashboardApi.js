import axiosInstance from './axiosInstance';

// GET /dashboard — overall summary for logged-in user
export const getDashboard = () =>
  axiosInstance.get('/dashboard');

// GET /dashboard/{year}/{month} — monthly summary
export const getMonthlySummary = (year, month) =>
  axiosInstance.get(`/dashboard/${year}/${month}`);
