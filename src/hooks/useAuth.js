import { useState, useEffect, useCallback } from 'react';
import { loginUserApi, registerUserApi } from '../services/api';

const AUTH_STORAGE_KEY = 'skyfish_auth_session';

/**
 * Custom Hook for user authentication (Login, Register, Logout, Session persistence)
 */
export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : { email: 'angler@example.com', name: 'angler' };
    } catch {
      return { email: 'angler@example.com', name: 'angler' };
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync session with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: loggedInUser } = await loginUserApi(email, password);
      setUser(loggedInUser);
      return { success: true, user: loggedInUser };
    } catch (err) {
      setError(err.message || 'Помилка авторизації');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: registeredUser } = await registerUserApi(email, password);
      setUser(registeredUser);
      return { success: true, user: registeredUser };
    } catch (err) {
      setError(err.message || 'Помилка реєстрації');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
