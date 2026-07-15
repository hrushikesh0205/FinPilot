import axiosInstance from './axiosInstance';

// GET /api/reports/summary — all-time: totalExpenses, totalTransactions, highestExpense, averageExpense
export const getReportSummary = () =>
  axiosInstance.get('/api/reports/summary');

// GET /api/reports/monthly — last 6 months: [{ month, year, monthNumber, expense }]
export const getMonthlyReport = () =>
  axiosInstance.get('/api/reports/monthly');

// GET /api/reports/category — by category: [{ name, value, percent, color }]
export const getCategoryReport = () =>
  axiosInstance.get('/api/reports/category');
