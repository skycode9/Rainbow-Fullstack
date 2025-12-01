import axios from "axios";

// Use env variable which changes based on environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for CORS with credentials
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post("/auth/login", { username, password }),
  verify: () => api.get("/auth/verify"),
  register: (data: any) => api.post("/auth/register", data),
};

// Films API
export const filmsAPI = {
  getAll: () => api.get("/films"),
  getOne: (id: string) => api.get(`/films/${id}`),
  create: (data: any) => api.post("/films", data),
  update: (id: string, data: any) => api.put(`/films/${id}`, data),
  delete: (id: string) => api.delete(`/films/${id}`),
};

// Team API
export const teamAPI = {
  getAll: () => api.get("/team"),
  getOne: (id: string) => api.get(`/team/${id}`),
  create: (data: any) => api.post("/team", data),
  update: (id: string, data: any) => api.put(`/team/${id}`, data),
  delete: (id: string) => api.delete(`/team/${id}`),
};

// Clients API
export const clientsAPI = {
  getAll: () => api.get("/clients"),
  getOne: (id: string) => api.get(`/clients/${id}`),
  create: (data: any) => api.post("/clients", data),
  update: (id: string, data: any) => api.put(`/clients/${id}`, data),
  delete: (id: string) => api.delete(`/clients/${id}`),
};

// Contact API
export const contactAPI = {
  getAll: () => api.get("/contacts"),
  getOne: (id: string) => api.get(`/contacts/${id}`),
  submit: (data: any) => api.post("/contacts", data),
  markAsRead: (id: string) => api.patch(`/contacts/${id}/read`),
  delete: (id: string) => api.delete(`/contacts/${id}`),
};

// Subscribers API
export const subscribersAPI = {
  getAll: () => api.get("/subscribers"),
  delete: (id: string) => api.delete(`/subscribers/${id}`),
};

// Settings API
export const settingsAPI = {
  get: () => api.get("/settings"),
  update: (data: any) => api.put("/settings", data),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData: FormData) => {
    return api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
