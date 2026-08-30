import React, { useState } from 'react';
import { Fingerprint, RefreshCw, Cpu, Radio } from 'lucide-react';

interface BiometricDevice {
  id: string;
  name: string;
  ip_address: string;
  port: number;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'SYNCING';
  last_sync: string;
  user_count: number;
}

const INITIAL_DEVICES: BiometricDevice[] = [
  { id: 'bio-1', name: 'Turnstile Gate #1 (Main Entrance)', ip_address: '192.168.1.120', port: 4370, location: 'Front Reception Turnstile', status: 'ONLINE', last_sync: '2026-08-29 06:00 PM', user_count: 420 },
  { id: 'bio-2', name: 'Turnstile Gate #2 (Exit Gate)', ip_address: '192.168.1.121', port: 4370, location: 'Front Reception Exit', status: 'ONLINE', last_sync: '2026-08-29 06:00 PM', user_count: 420 },
  { id: 'bio-3', name: 'Trainer Staff Punch Device', ip_address: '192.168.1.125', port: 4370, location: 'Staff Room Backdoor', status: 'ONLINE', last_sync: '2026-08-29 05:45 PM', user_count: 18 },
];

export const BiometricSettings: React.FC = () => {
  const [devices, setDevices] = useState<BiometricDevice[]>(INITIAL_DEVICES);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSyncDevice = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setDevices(devices.map((d) => (d.id === id ? { ...d, last_sync: 'Just now', status: 'ONLINE' } : d)));
      setSyncingId(null);
      alert('Biometric logs successfully synced with server!');
    }, 1500);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            <Fingerprint size={24} style={{ color: 'var(--color-accent)' }} />
            Biometric Hardware & Access Control Devices
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            ZKTeco / eSSL biometric machine connection, turnstile sync, IP ports, and real-time punch listener.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            alert('Broadcasting full member fingerprint sync to all devices...');
          }}
        >
          <RefreshCw size={14} /> Sync All Devices
        </button>
      </div>

      {/* Device Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {devices.map((dev) => (
          <div key={dev.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 210, 255, 0.1)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Cpu size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{dev.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>📍 {dev.location}</div>
                  </div>
                </div>

                <span className="badge badge-active" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Radio size={12} /> {dev.status}
                </span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>IP Address:</span>
                  <code style={{ color: 'var(--color-accent)' }}>{dev.ip_address}:{dev.port}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Registered Users:</span>
                  <strong>{dev.user_count} Fingerprints</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Last Log Sync:</span>
                  <span>{dev.last_sync}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
                onClick={() => handleSyncDevice(dev.id)}
                disabled={syncingId === dev.id}
              >
                <RefreshCw size={13} className={syncingId === dev.id ? 'spin' : ''} />
                {syncingId === dev.id ? 'Syncing...' : 'Fetch Check-in Logs'}
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '12px' }} onClick={() => alert(`Ping test to ${dev.ip_address} succeeded (Latency: 4ms)`)}>
                Ping Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiometricSettings;
