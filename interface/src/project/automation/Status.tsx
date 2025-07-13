import React, { FC } from 'react';
import { useLayoutTitle } from '../../components';

const Status: FC = () => {
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  useLayoutTitle("Status");

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Status Page - Debug Mode</h2>
      <p>If you can see this, React is working.</p>
      <p>Refresh trigger: {refreshTrigger}</p>
      <button onClick={handleRefresh}>Test Refresh</button>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
          <h3>Auto-Refresh Framework</h3>
          <p>The auto-refresh framework is implemented and ready to test.</p>
          <p>Once we fix the loading issues, you'll see:</p>
          <ul>
            <li>Manual refresh buttons</li>
            <li>Auto-refresh toggles</li>
            <li>Configurable intervals (2s, 5s, 10s, 30s, 1min)</li>
            <li>Last updated timestamps</li>
            <li>Settings panels</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Status;
