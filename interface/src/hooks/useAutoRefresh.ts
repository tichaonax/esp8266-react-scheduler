import { useEffect, useRef, useCallback } from 'react';

export interface AutoRefreshOptions {
  interval?: number; // Refresh interval in milliseconds (default: 5000ms = 5 seconds)
  enabled?: boolean; // Enable/disable auto-refresh (default: true)
  onRefresh?: () => void; // Callback function to execute on refresh
}

/**
 * Custom hook for auto-refreshing data at specified intervals
 * Useful for ESP32 devices where WebSocket real-time updates are disabled
 * 
 * @param options AutoRefreshOptions object
 * @returns Object with refresh control functions
 */
export const useAutoRefresh = (options: AutoRefreshOptions = {}) => {
  const {
    interval = 5000, // Default 5 seconds
    enabled = true,
    onRefresh
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isEnabledRef = useRef(enabled);

  // Update enabled state
  useEffect(() => {
    isEnabledRef.current = enabled;
  }, [enabled]);

  // Start auto-refresh
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isEnabledRef.current && onRefresh && interval > 0) {
      intervalRef.current = setInterval(() => {
        if (isEnabledRef.current) {
          onRefresh();
        }
      }, interval);
    }
  }, [interval, onRefresh]);

  // Stop auto-refresh
  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Manual refresh trigger
  const manualRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  // Setup and cleanup
  useEffect(() => {
    startAutoRefresh();
    return stopAutoRefresh;
  }, [startAutoRefresh, stopAutoRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    startAutoRefresh,
    stopAutoRefresh,
    manualRefresh,
    isEnabled: enabled
  };
};