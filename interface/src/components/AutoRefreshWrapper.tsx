import React, { useState, useEffect } from 'react';
// Minimal imports to reduce bundle size - using native HTML elements
import { Box } from '@mui/material';
import { useAutoRefresh } from '../hooks/useAutoRefresh';

interface AutoRefreshWrapperProps {
  children: React.ReactNode;
  onRefresh: () => void;
  defaultInterval?: number;
  defaultEnabled?: boolean;
  showControls?: boolean;
  title?: string;
}

/**
 * Wrapper component that adds auto-refresh functionality to any child component
 * Includes manual refresh button and optional settings panel
 */
export const AutoRefreshWrapper: React.FC<AutoRefreshWrapperProps> = ({
  children,
  onRefresh,
  defaultInterval = 30000,
  defaultEnabled = true,
  showControls = true,
  title = "Auto-refresh for ESP32"
}) => {
  const [interval, setInterval] = useState(defaultInterval);
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [showSettings, setShowSettings] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Wrap onRefresh to track last refresh time
  const handleRefresh = () => {
    onRefresh();
    setLastRefresh(new Date());
  };

  const { manualRefresh } = useAutoRefresh({
    interval,
    enabled,
    onRefresh: handleRefresh
  });

  // Set initial refresh time
  useEffect(() => {
    if (!lastRefresh) {
      setLastRefresh(new Date());
    }
  }, [lastRefresh]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  // ESP-optimized intervals - very conservative for resource-constrained devices
  const intervalOptions = [
    { label: '1 minute', value: 60000 },
    { label: '2 minutes', value: 120000 },
    { label: '5 minutes', value: 300000 },
    { label: '10 minutes', value: 600000 },
    { label: 'Manual only', value: 0 }
  ];

  if (!showControls) {
    // Simple wrapper without controls
    return <>{children}</>;
  }

  return (
    <Box>
      {/* Minimal auto-refresh controls - optimized for ESP flash memory */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '8px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px' }}>
            {enabled ? `↻ ${interval / 1000}s` : '⏸ Disabled'}
          </span>
          
          {lastRefresh && (
            <span style={{ fontSize: '11px', color: '#666' }}>
              {formatTime(lastRefresh)}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button 
            onClick={manualRefresh}
            style={{ 
              padding: '4px 8px', 
              fontSize: '12px', 
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '3px',
              backgroundColor: '#fff'
            }}
          >
            ↻
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)}
            style={{ 
              padding: '4px 8px', 
              fontSize: '12px', 
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '3px',
              backgroundColor: showSettings ? '#e3f2fd' : '#fff'
            }}
          >
            ⚙
          </button>
        </div>
      </div>

      {/* Minimal settings panel */}
      {showSettings && (
        <div style={{ 
          padding: '12px', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          marginBottom: '8px',
          backgroundColor: '#fafafa'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input 
                type="checkbox"
                checked={enabled} 
                onChange={(e) => setEnabled(e.target.checked)}
              />
              Auto-refresh
            </label>
          </div>

          {enabled && (
            <div>
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>Interval:</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {intervalOptions.map((option) => (
                  <button 
                    key={option.value}
                    onClick={() => setInterval(option.value)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      backgroundColor: interval === option.value ? '#1976d2' : '#fff',
                      color: interval === option.value ? '#fff' : '#000',
                      cursor: 'pointer'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main content */}
      {children}
    </Box>
  );
};