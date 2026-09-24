import axiosInstance from './axiosInstance';

// GET /budgets
export const getAllBudgets = () =>
  axiosInstance.get('/budgets');

// GET /budgets/{id}
export const getBudgetById = (id) =>
  axiosInstance.get(`/budgets/${id}`);

// POST /budgets — body: { category, monthlyLimit, month, year }
export const createBudget = (data) =>
  axiosInstance.post('/budgets', data);

// PUT /budgets/{id}
export const updateBudget = (id, data) =>
  axiosInstance.put(`/budgets/${id}`, data);

// DELETE /budgets/{id}
export const deleteBudget = (id) =>
  axiosInstance.delete(`/budgets/${id}`);

// GET /budgets/summary/{year}/{month}
export const getBudgetSummary = (year, month) =>
  axiosInstance.get(`/budgets/summary/${year}/${month}`);
