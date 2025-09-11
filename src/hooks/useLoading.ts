import { useState, useCallback, useEffect } from 'react';

interface UseLoadingOptions {
  initialLoading?: boolean;
  delay?: number; // Minimum loading time in ms
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const { initialLoading = false, delay = 0 } = options;
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [startTime, setStartTime] = useState<number | null>(null);

  const startLoading = useCallback(() => {
    setStartTime(Date.now());
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    if (startTime && delay > 0) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, delay - elapsed);
      
      setTimeout(() => {
        setIsLoading(false);
        setStartTime(null);
      }, remaining);
    } else {
      setIsLoading(false);
      setStartTime(null);
    }
  }, [startTime, delay]);

  const setLoading = useCallback((loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // Auto-stop loading after a maximum time
  useEffect(() => {
    if (isLoading && startTime) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setStartTime(null);
      }, 10000); // Maximum 10 seconds

      return () => clearTimeout(timeout);
    }
  }, [isLoading, startTime]);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading,
  };
};

// Hook for async operations with loading state
export const useAsyncLoading = <T>(
  asyncFn: () => Promise<T>,
  options: UseLoadingOptions = {}
) => {
  const { isLoading, startLoading, stopLoading } = useLoading(options);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async () => {
    try {
      startLoading();
      setError(null);
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      stopLoading();
    }
  }, [asyncFn, startLoading, stopLoading]);

  return {
    isLoading,
    error,
    data,
    execute,
  };
};

// Hook for component mounting loading
export const useMountLoading = (delay: number = 300) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isMounted;
};

