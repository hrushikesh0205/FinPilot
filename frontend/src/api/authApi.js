import axiosInstance from './axiosInstance';

// POST /auth/login — returns plain JWT string
export const loginUser = (email, password) =>
  axiosInstance.post('/auth/login', { email, password });

// POST /auth/register — sends { name, email, password, role }
export const registerUser = (name, email, password) =>
  axiosInstance.post('/auth/register', { name, email, password, role: 'USER' });
