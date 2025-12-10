import axios from "axios";
import { apiCache, CACHE_KEYS } from "../utils/apiCache";

// Use env variable which changes based on environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Cache TTL values (in ms)
const CACHE_TTL = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 10 * 60 * 1000, // 10 minutes
};

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

// Films API with caching
export const filmsAPI = {
  getAll: async () => {
    const cached = apiCache.get(CACHE_KEYS.FILMS);
    if (cached) return { data: cached };
    const response = await api.get("/films");
    apiCache.set(CACHE_KEYS.FILMS, response.data, CACHE_TTL.MEDIUM);
    return response;
  },
  getOne: (id: string) => api.get(`/films/${id}`),
  create: async (data: any) => {
    const response = await api.post("/films", data);
    apiCache.invalidate(CACHE_KEYS.FILMS);
    return response;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/films/${id}`, data);
    apiCache.invalidate(CACHE_KEYS.FILMS);
    return response;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/films/${id}`);
    apiCache.invalidate(CACHE_KEYS.FILMS);
    return response;
  },
};

// Team API with caching
export const teamAPI = {
  getAll: async () => {
    const cached = apiCache.get(CACHE_KEYS.TEAM);
    if (cached) return { data: cached };
    const response = await api.get("/team");
    apiCache.set(CACHE_KEYS.TEAM, response.data, CACHE_TTL.MEDIUM);
    return response;
  },
  getOne: (id: string) => api.get(`/team/${id}`),
  create: async (data: any) => {
    const response = await api.post("/team", data);
    apiCache.invalidate(CACHE_KEYS.TEAM);
    return response;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/team/${id}`, data);
    apiCache.invalidate(CACHE_KEYS.TEAM);
    return response;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/team/${id}`);
    apiCache.invalidate(CACHE_KEYS.TEAM);
    return response;
  },
};

// Clients API with caching
export const clientsAPI = {
  getAll: async () => {
    const cached = apiCache.get(CACHE_KEYS.CLIENTS);
    if (cached) return { data: cached };
    const response = await api.get("/clients");
    apiCache.set(CACHE_KEYS.CLIENTS, response.data, CACHE_TTL.MEDIUM);
    return response;
  },
  getOne: (id: string) => api.get(`/clients/${id}`),
  create: async (data: any) => {
    const response = await api.post("/clients", data);
    apiCache.invalidate(CACHE_KEYS.CLIENTS);
    return response;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/clients/${id}`, data);
    apiCache.invalidate(CACHE_KEYS.CLIENTS);
    return response;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/clients/${id}`);
    apiCache.invalidate(CACHE_KEYS.CLIENTS);
    return response;
  },
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

// Settings API with caching
export const settingsAPI = {
  get: async () => {
    const cached = apiCache.get(CACHE_KEYS.SETTINGS);
    if (cached) return { data: cached };
    const response = await api.get("/settings");
    apiCache.set(CACHE_KEYS.SETTINGS, response.data, CACHE_TTL.LONG);
    return response;
  },
  update: async (data: any) => {
    const response = await api.put("/settings", data);
    apiCache.invalidate(CACHE_KEYS.SETTINGS);
    return response;
  },
};

// Showcase API with caching
export const showcaseAPI = {
  getAll: async (all?: boolean) => {
    const cacheKey = all ? `${CACHE_KEYS.SHOWCASE}_all` : CACHE_KEYS.SHOWCASE;
    const cached = apiCache.get(cacheKey);
    if (cached) return { data: cached };
    const response = await api.get(`/showcase${all ? "?all=true" : ""}`);
    apiCache.set(cacheKey, response.data, CACHE_TTL.MEDIUM);
    return response;
  },
  getOne: (id: string) => api.get(`/showcase/${id}`),
  create: async (data: any) => {
    const response = await api.post("/showcase", data);
    apiCache.invalidatePrefix(CACHE_KEYS.SHOWCASE);
    return response;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/showcase/${id}`, data);
    apiCache.invalidatePrefix(CACHE_KEYS.SHOWCASE);
    return response;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/showcase/${id}`);
    apiCache.invalidatePrefix(CACHE_KEYS.SHOWCASE);
    return response;
  },
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
