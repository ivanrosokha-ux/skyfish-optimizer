import { useAuthStore } from '../store/useAuthStore';

/**
 * Custom Hook for user authentication (Login, Register, Logout, Session persistence)
 * Powered by global Zustand store so all components and layouts share a single reactive state.
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
