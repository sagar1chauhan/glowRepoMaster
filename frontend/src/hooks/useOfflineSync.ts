import { useState, useEffect } from 'react';
import { syncManager } from '../lib/syncManager';

/**
 * React hook that provides network status and offline sync info.
 */
export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Start auto-sync
    syncManager.startAutoSync();

    // Check pending count periodically
    const interval = setInterval(async () => {
      const count = await syncManager.getPendingCount();
      setPendingCount(count);
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      syncManager.stopAutoSync();
      clearInterval(interval);
    };
  }, []);

  const syncNow = async () => {
    setIsSyncing(true);
    try {
      const result = await syncManager.syncNow();
      const count = await syncManager.getPendingCount();
      setPendingCount(count);
      return result;
    } finally {
      setIsSyncing(false);
    }
  };

  return { isOnline, pendingCount, isSyncing, syncNow };
}
