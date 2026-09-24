import axiosInstance from './axiosInstance';

export const getAllSubscriptions = () =>
  axiosInstance.get('/api/subscriptions');

export const getSubscriptionById = (id) =>
  axiosInstance.get(`/api/subscriptions/${id}`);

export const createSubscription = (data) =>
  axiosInstance.post('/api/subscriptions', data);

export const updateSubscription = (id, data) =>
  axiosInstance.put(`/api/subscriptions/${id}`, data);

export const toggleSubscriptionStatus = (id) =>
  axiosInstance.patch(`/api/subscriptions/${id}/status`);

export const deleteSubscription = (id) =>
  axiosInstance.delete(`/api/subscriptions/${id}`);

export const getSubscriptionSummary = () =>
  axiosInstance.get('/api/subscriptions/summary');

export const getSubscriptionCandidates = () =>
  axiosInstance.get('/api/subscriptions/candidates');
