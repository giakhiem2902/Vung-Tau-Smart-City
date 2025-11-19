// services/api.js
import axios from 'axios';

// Base URL của API
export const API_BASE = 'http://localhost:5000/api';

// Tạo instance axios với baseURL
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== USERS ====================
export const getUsers = () => api.get('/auth/users'); // danh sách người dùng
export const getUserById = (id) => api.get(`/auth/users/${id}`);

// ==================== EVENT BANNERS ====================
export const getEventBanners = () => api.get('/EventBanners');
export const getEventBannerById = (id) => api.get(`/EventBanners/${id}`);
export const createEventBanner = (data) => api.post('/EventBanners', data);
export const updateEventBanner = (id, data) => api.put(`/EventBanners/${id}`, data);
export const deleteEventBanner = (id) => api.delete(`/EventBanners/${id}`);

// ==================== FEEDBACKS ====================
export const getFeedbacks = (status = '') => 
    api.get(`/feedback/admin/all?status=${status}`);
export const reviewFeedback = (id, data) => 
    api.put(`/feedback/admin/all/${id}`, data);

// ==================== FLOOD REPORTS ====================
export const getFloodReports = (status = '') => 
    api.get(`/floodReports/admin/all?status=${status}&page=1&pageSize=50`);
export const reviewFloodReport = (id, status, note='') => 
    api.put(`/floodReports/admin/${id}/review`, { status, adminNote: note });

// ==================== SETTINGS ====================
// Nếu cần update API base hoặc các cấu hình khác, có thể thêm ở đây

export default api;
