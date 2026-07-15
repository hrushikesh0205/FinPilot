import axiosInstance from './axiosInstance';

// POST /auth/login — returns plain JWT string
export const loginUser = (email, password) =>
  axiosInstance.post('/auth/login', { email, password });

// POST /auth/register — sends { name, email, password, role }
export const registerUser = (name, email, password) =>
  axiosInstance.post('/auth/register', { name, email, password, role: 'USER' });

// GET /auth/profile — returns { name, email } for logged-in user
export const getProfile = () =>
  axiosInstance.get('/auth/profile');

// PUT /auth/profile — body: { name, phone }
export const updateProfileDetails = (name, phone) =>
  axiosInstance.put('/auth/profile', { name, phone });

// POST /auth/profile/image — form-data: file
export const uploadProfileImage = (formData) =>
  axiosInstance.post('/auth/profile/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// PUT /auth/profile/password — body: { currentPassword, newPassword }
export const changePassword = (currentPassword, newPassword) =>
  axiosInstance.put('/auth/profile/password', { currentPassword, newPassword });
