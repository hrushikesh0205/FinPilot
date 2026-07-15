import axiosInstance from './axiosInstance';

// GET /api/notifications — all notifications for logged-in user (newest first)
export const getAllNotifications = () =>
  axiosInstance.get('/api/notifications');

// GET /api/notifications/unread-count — { count: number } for navbar badge
export const getUnreadCount = () =>
  axiosInstance.get('/api/notifications/unread-count');

// PATCH /api/notifications/{id}/read — mark one notification as read
export const markAsRead = (id) =>
  axiosInstance.patch(`/api/notifications/${id}/read`);

// PATCH /api/notifications/read-all — mark all notifications as read
export const markAllAsRead = () =>
  axiosInstance.patch('/api/notifications/read-all');

// DELETE /api/notifications/{id} — permanently delete a notification
export const deleteNotification = (id) =>
  axiosInstance.delete(`/api/notifications/${id}`);
