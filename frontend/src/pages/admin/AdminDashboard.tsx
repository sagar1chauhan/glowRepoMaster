import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { syncManager } from '../../lib/syncManager';
import api from '../../lib/api';

const AdminDashboard: React.FC = () => {
  const { t } = useI18n();
  const { isOnline } = useOfflineSync();
  const [memberId, setMemberId] = useState('');
  const [checkinMessage, setCheckinMessage] = useState('');

  // Dashboard Stats State
  const [stats, setStats] = useState({
    activeMembers: 0,
    todayCheckins: 0,
    expiredMembers: 0,
    cashTotal: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [membersRes, salesRes, attendanceRes] = await Promise.all([
          api.get('/members'),
          api.get('/sales/daily-report'),
          api.get('/attendance/today')
        ]);
        
        const members = membersRes.data;
        const activeCount = members.filter((m: any) => m.status === 'ACTIVE').length;
        const expiredCount = members.filter((m: any) => {
          if (!m.membership_expiry) return false;
          return new Date(m.membership_expiry) < new Date();
        }).length;

        setStats({
          activeMembers: activeCount,
          todayCheckins: attendanceRes.data.count || 0,
          expiredMembers: expiredCount,
          cashTotal: salesRes.data.cash || 0
        });
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  const handleManualCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId) return;

    setCheckinMessage(t('common.loading'));
    const token = localStorage.getItem('glowrep_token') || '';
    const result = await syncManager.performCheckin(
      memberId,
      'gym_123',
      'Test Member',
      token
    );

    if (result.mode === 'online') {
      setCheckinMessage(t('checkin.success'));
    } else {
      setCheckinMessage(t('checkin.offlineSuccess'));
    }
    setMemberId('');
    setTimeout(() => setCheckinMessage(''), 3000);
  };

  return (
    <div>
      <h1 className="section-header">🏋️ {t('nav.admin')} — {t('dashboard.title')} (Andheri)</h1>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">{t('dashboard.activeMembers')}</div>
          <div className="stat-value">{stats.activeMembers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">{t('dashboard.todayCheckins')}</div>
          <div className="stat-value">{stats.todayCheckins}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-label">{t('dashboard.expiredMembers')}</div>
          <div className="stat-value">{stats.expiredMembers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-label">{t('payments.cashTotal')} (Today)</div>
          <div className="stat-value">₹{stats.cashTotal.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Check-in Section */}
        <div className="stat-card">
          <h2 className="section-header">📲 {t('checkin.title')}</h2>
          
          <form onSubmit={handleManualCheckin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {t('checkin.manual')}
              </label>
              <input
                type="text"
                placeholder="Member ID or Phone"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px', 
                  border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', 
                  color: 'white', marginBottom: '10px'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              {t('checkin.title')}
            </button>
            {checkinMessage && (
              <div style={{ fontSize: '13px', color: checkinMessage.includes('offline') ? 'var(--color-warning)' : 'var(--color-success)', marginTop: '8px' }}>
                {checkinMessage}
              </div>
            )}
          </form>
        </div>

        {/* Payments Quick Actions */}
        <div className="stat-card">
          <h2 className="section-header">💳 {t('payments.title')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              🔗 {t('payments.createLink')} (UPI)
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              💵 {t('payments.logCash')}
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--color-warning)' }}>
              ⚖️ {t('payments.reconciliation')}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AdminDashboard;
