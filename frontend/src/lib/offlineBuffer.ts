// Offline Check-in Buffer using IndexedDB
// Stores check-ins locally when the network is unavailable,
// then syncs them to the backend when connectivity is restored.

const DB_NAME = 'glowrep_offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending_checkins';

interface OfflineCheckin {
  id: string;
  member_id: string;
  gym_id: string;
  member_name: string;
  check_in_time: string;
  synced: boolean;
}

class OfflineBuffer {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('synced', 'synced', { unique: false });
          store.createIndex('gym_id', 'gym_id', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a check-in locally when offline.
   */
  async saveCheckin(checkin: Omit<OfflineCheckin, 'synced'>): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ ...checkin, synced: false });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Get all unsynced check-ins.
   */
  async getUnsyncedCheckins(): Promise<OfflineCheckin[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Mark a check-in as synced after successful upload.
   */
  async markSynced(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const record = getRequest.result;
        if (record) {
          record.synced = true;
          store.put(record);
        }
        tx.oncomplete = () => resolve();
      };

      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Clear all synced check-ins older than 24 hours.
   */
  async cleanup(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('synced');
      const request = index.openCursor(true);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const record = cursor.value;
          const checkinTime = new Date(record.check_in_time).getTime();
          const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
          if (checkinTime < oneDayAgo) {
            cursor.delete();
          }
          cursor.continue();
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Get count of pending (unsynced) check-ins.
   */
  async getPendingCount(): Promise<number> {
    const unsynced = await this.getUnsyncedCheckins();
    return unsynced.length;
  }
}

export const offlineBuffer = new OfflineBuffer();
export type { OfflineCheckin };
