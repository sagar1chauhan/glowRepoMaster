import { offlineBuffer } from './offlineBuffer';
import type { OfflineCheckin } from './offlineBuffer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * SyncManager handles syncing offline check-ins to the backend
 * when network connectivity is restored.
 */
class SyncManager {
  private isSyncing = false;
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Start automatic sync polling (every 30 seconds when online).
   */
  startAutoSync() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('🌐 Network restored — syncing offline check-ins...');
      this.syncNow();
    });

    window.addEventListener('offline', () => {
      console.log('📴 Network lost — check-ins will be saved locally');
    });

    // Poll every 30 seconds when online
    this.syncInterval = setInterval(() => {
      if (navigator.onLine) {
        this.syncNow();
      }
    }, 30000);

    // Initial sync attempt
    if (navigator.onLine) {
      this.syncNow();
    }
  }

  /**
   * Stop automatic sync polling.
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Perform a check-in. If online, sends directly to the backend.
   * If offline, saves to IndexedDB for later sync.
   */
  async performCheckin(
    memberId: string,
    gymId: string,
    memberName: string,
    token: string,
  ): Promise<{ mode: 'online' | 'offline'; success: boolean }> {
    const checkinData = {
      id: `checkin_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      member_id: memberId,
      gym_id: gymId,
      member_name: memberName,
      check_in_time: new Date().toISOString(),
    };

    if (navigator.onLine) {
      try {
        const response = await fetch(`${API_URL}/attendance/checkin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(checkinData),
        });

        if (response.ok) {
          return { mode: 'online', success: true };
        }

        // Server error — save offline
        await offlineBuffer.saveCheckin(checkinData);
        return { mode: 'offline', success: true };
      } catch {
        // Network error — save offline
        await offlineBuffer.saveCheckin(checkinData);
        return { mode: 'offline', success: true };
      }
    } else {
      // Definitely offline — save locally
      await offlineBuffer.saveCheckin(checkinData);
      return { mode: 'offline', success: true };
    }
  }

  /**
   * Sync all pending offline check-ins to the backend.
   */
  async syncNow(): Promise<{ synced: number; failed: number }> {
    if (this.isSyncing) return { synced: 0, failed: 0 };
    this.isSyncing = true;

    let synced = 0;
    let failed = 0;

    try {
      const pending = await offlineBuffer.getUnsyncedCheckins();
      if (pending.length === 0) {
        this.isSyncing = false;
        return { synced: 0, failed: 0 };
      }

      console.log(`🔄 Syncing ${pending.length} offline check-ins...`);

      const token = localStorage.getItem('glowrep_token') || '';

      for (const checkin of pending) {
        try {
          const response = await fetch(`${API_URL}/attendance/checkin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              member_id: checkin.member_id,
              gym_id: checkin.gym_id,
              member_name: checkin.member_name,
              check_in_time: checkin.check_in_time,
              is_offline_sync: true,
            }),
          });

          if (response.ok) {
            await offlineBuffer.markSynced(checkin.id);
            synced++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      }

      // Cleanup old synced records
      await offlineBuffer.cleanup();

      console.log(`✅ Sync complete: ${synced} synced, ${failed} failed`);
    } finally {
      this.isSyncing = false;
    }

    return { synced, failed };
  }

  /**
   * Get the number of pending offline check-ins.
   */
  async getPendingCount(): Promise<number> {
    return offlineBuffer.getPendingCount();
  }
}

export const syncManager = new SyncManager();
