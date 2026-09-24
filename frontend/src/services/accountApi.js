import axiosInstance from './axiosInstance';

// GET /api/accounts — all accounts for the logged-in user
export const getAllAccounts = () =>
  axiosInstance.get('/api/accounts');

// GET /api/accounts/{id}
export const getAccountById = (id) =>
  axiosInstance.get(`/api/accounts/${id}`);

// POST /api/accounts — body: { name, type, balance, isDefault }
export const createAccount = (data) =>
  axiosInstance.post('/api/accounts', data);

// PUT /api/accounts/{id}
export const updateAccount = (id, data) =>
  axiosInstance.put(`/api/accounts/${id}`, data);

// PATCH /api/accounts/{id}/default — set as default account
export const setDefaultAccount = (id) =>
  axiosInstance.patch(`/api/accounts/${id}/default`);

// DELETE /api/accounts/{id} — permanently deletes from DB
export const deleteAccount = (id) =>
  axiosInstance.delete(`/api/accounts/${id}`);
