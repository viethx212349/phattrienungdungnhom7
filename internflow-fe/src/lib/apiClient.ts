import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — tự gắn token nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — xử lý lỗi chung
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc chưa login
      localStorage.removeItem('token');
      window.location.hash = '#/login';
    }
    return Promise.reject(error);
  }
);

// Upload file (FormData) bằng fetch thuần — tránh việc apiClient ép Content-Type: application/json
// đè lên multipart/form-data boundary mà axios cần tự sinh.
export const uploadFiles = async (endpoint: string, formData: FormData) => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
  const token = localStorage.getItem('token');

  const response = await fetch(`${baseURL}${endpoint}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || `Upload thất bại (${response.status})`;
    throw new Error(message);
  }

  return data;
};

export default apiClient;
