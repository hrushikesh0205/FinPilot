import axiosInstance from './axiosInstance';

// GET /api/categories — fetch all categories for the logged-in user
export const getAllCategories = () =>
  axiosInstance.get('/api/categories');

// GET /api/categories/{id}
export const getCategoryById = (id) =>
  axiosInstance.get(`/api/categories/${id}`);

// POST /api/categories — body: { name, icon, color, budget }
export const createCategory = (data) =>
  axiosInstance.post('/api/categories', data);

// PUT /api/categories/{id}
export const updateCategory = (id, data) =>
  axiosInstance.put(`/api/categories/${id}`, data);

// DELETE /api/categories/{id} — permanently deletes from DB
export const deleteCategory = (id) =>
  axiosInstance.delete(`/api/categories/${id}`);
