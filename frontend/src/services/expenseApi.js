import axiosInstance from './axiosInstance';

// GET /expenses
export const getAllExpenses = () =>
  axiosInstance.get('/expenses');

// GET /expenses/{id}
export const getExpenseById = (id) =>
  axiosInstance.get(`/expenses/${id}`);

// POST /expenses — body: { title, amount, category, expenseDate }
export const createExpense = (expense) =>
  axiosInstance.post('/expenses', expense);

// PUT /expenses/{id}
export const updateExpense = (id, expense) =>
  axiosInstance.put(`/expenses/${id}`, expense);

// DELETE /expenses/{id}
export const deleteExpense = (id) =>
  axiosInstance.delete(`/expenses/${id}`);

// GET /expenses/category/{category}
export const getExpensesByCategory = (category) =>
  axiosInstance.get(`/expenses/category/${category}`);

// GET /expenses/date/{expenseDate}  (format: yyyy-MM-dd)
export const getExpensesByDate = (expenseDate) =>
  axiosInstance.get(`/expenses/date/${expenseDate}`);

// GET /expenses/search?keyword=
export const searchExpenses = (keyword) =>
  axiosInstance.get('/expenses/search', { params: { keyword } });

// GET /expenses/paginated?page=&size=
export const getPaginatedExpenses = (page, size) =>
  axiosInstance.get('/expenses/paginated', { params: { page, size } });

// GET /expenses/sort?field=&direction=
export const getSortedExpenses = (field, direction = 'asc') =>
  axiosInstance.get('/expenses/sort', { params: { field, direction } });
