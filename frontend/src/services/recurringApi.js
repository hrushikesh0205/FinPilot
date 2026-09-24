import axiosInstance from './axiosInstance';

export const getSuggestions = () =>
  axiosInstance.get('/api/recurring/suggestions');

export const getConfirmedRecurring = () =>
  axiosInstance.get('/api/recurring');

export const keepSuggestion = (data) =>
  axiosInstance.post('/api/recurring/keep', data);

export const ignoreSuggestion = (title) =>
  axiosInstance.post('/api/recurring/ignore', { title });

export const createRecurring = (data) =>
  axiosInstance.post('/api/recurring', data);

export const updateRecurring = (id, data) =>
  axiosInstance.put(`/api/recurring/${id}`, data);

export const deleteRecurring = (id) =>
  axiosInstance.delete(`/api/recurring/${id}`);

export const getRecurringSummary = () =>
  axiosInstance.get('/api/recurring/summary');
