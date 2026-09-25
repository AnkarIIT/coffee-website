import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useAuthStore } from '../store';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const { onSuccess, onError, immediate = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [immediate]);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      if (!mountedRef.current) return null;

      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        if (mountedRef.current) {
          setData(result);
          onSuccess?.(result);
        }
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        if (mountedRef.current) {
          setError(error);
          onError?.(error);
        }
        return null;
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, execute, reset };
}

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, register, logout, checkAuth, updateProfile } = useAuthStore.getState();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
  };
}

export function useCafes(params?: { page?: number; limit?: number; search?: string }) {
  return useApi(() => api.getCafes(params), {
    immediate: true,
  });
}

export function useCafe(id: string | undefined) {
  return useApi(() => api.getCafeById(id!), {
    immediate: !!id,
  });
}

export function useCafeMenu(cafeId: string | undefined) {
  return useApi(() => api.getCafeMenu(cafeId!), {
    immediate: !!cafeId,
  });
}

export function useBookings() {
  return useApi(() => api.getUserBookings(), {
    immediate: true,
  });
}

export function useOrders() {
  return useApi(() => api.getUserOrders(), {
    immediate: true,
  });
}

export function usePayments() {
  return useApi(() => api.getPaymentHistory(), {
    immediate: true,
  });
}