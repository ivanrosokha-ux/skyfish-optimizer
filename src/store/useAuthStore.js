import { create } from 'zustand';
import { loginUserApi, registerUserApi } from '../services/api';

const AUTH_STORAGE_KEY = 'skyfish_auth_session';

function getInitialUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginUserApi(email, password);
      const user = data.user || {
        id: 'usr_' + Date.now(),
        email: email.toLowerCase(),
        name: email.split('@')[0],
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      set({ user, isLoading: false, error: null });
      return { success: true, user };
    } catch (err) {
      const msg = err.message || 'Помилка авторизації';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerUserApi(email, password);
      const user = data.user || {
        id: 'usr_' + Date.now(),
        email: email.toLowerCase(),
        name: email.split('@')[0],
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      set({ user, isLoading: false, error: null });
      return { success: true, user };
    } catch (err) {
      const msg = err.message || 'Помилка реєстрації';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  demoLogin: async () => {
    return get().login('player@hypixel.net', 'demo1234');
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
