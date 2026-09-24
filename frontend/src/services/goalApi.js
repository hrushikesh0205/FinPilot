import axiosInstance from './axiosInstance';

export const getAllGoals = () =>
  axiosInstance.get('/api/goals');

export const getGoalById = (id) =>
  axiosInstance.get(`/api/goals/${id}`);

export const createGoal = (data) =>
  axiosInstance.post('/api/goals', data);

export const updateGoal = (id, data) =>
  axiosInstance.put(`/api/goals/${id}`, data);

export const depositFunds = (id, amount) =>
  axiosInstance.post(`/api/goals/${id}/deposit`, { amount });

export const deleteGoal = (id) =>
  axiosInstance.delete(`/api/goals/${id}`);

export const getGoalsSummary = () =>
  axiosInstance.get('/api/goals/summary');
