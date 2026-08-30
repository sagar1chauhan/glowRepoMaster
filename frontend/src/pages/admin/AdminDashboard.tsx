import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { syncManager } from '../../lib/syncManager';
import api from '../../lib/api';

const AdminDashboard: React.FC = () => {
  const { t } = useI18n();
  const [memberId, setMemberId] = useState('');
  const [checkinMessage, setCheckinMessage] = useState('');

  // Dashboard Stats State
  const [stats, setStats] = useState({
    activeMembers: 0,
    todayCheckins: 0,
    expiredMembers: 0,
    cashTotal: 0
  });

  // Modal States
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);
  const [showReconModal, setShowReconModal] = useState(false);

  // UPI Link Form
  const [upiAmount, setUpiAmount] = useState('');
  const [upiName, setUpiName] = useState('');
  const [upiPhone, setUpiPhone] = useState('');
  const [upiEmail, setUpiEmail] = useState('');
  const [upiDesc, setUpiDesc] = useState('Membership Renewal');
  const [upiLoading, setUpiLoading] = useState(false);
  const [upiResult, setUpiResult] = useState<{ short_url: string; status: string } | null>(null);

  // Cash Form
  const [cashAmount, setCashAmount] = useState('');
  const [cashMemberName, setCashMemberName] = useState('');
  const [cashNotes, setCashNotes] = useState('');
  const [cashLoading, setCashLoading] = useState(false);
  const [cashSuccess, setCashSuccess] = useState(false);

  // Reconciliation
  const [reconDate, setReconDate] = useState(new Date().toISOString().split('T')[0]);
  const [reconData, setReconData] = useState<any>(null);
  const [reconLoading, setReconLoading] = useState(false);

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

  // === UPI Payment Link ===
  const handleCreateUpiLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpiLoading(true);
      setUpiResult(null);
      const res = await api.post('/payments/create-link', {
        amount: parseFloat(upiAmount),
        member_name: upiName,
        member_phone: upiPhone,
        member_email: upiEmail || undefined,
        description: upiDesc,
      });
      setUpiResult(res.data);
    } catch (err) {
      console.error('Failed to create payment link', err);
      alert('Error creating payment link. Please try again.');
    } finally {
      setUpiLoading(false);
    }
  };

  const resetUpiModal = () => {
    setShowUpiModal(false);
    setUpiAmount('');
    setUpiName('');
    setUpiPhone('');
    setUpiEmail('');
    setUpiDesc('Membership Renewal');
    setUpiResult(null);
  };

  // === Cash Payment ===
  const handleLogCash = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCashLoading(true);
      setCashSuccess(false);
      await api.post('/payments/log-cash', {
        amount: parseFloat(cashAmount),
        member_name: cashMemberName,
        notes: cashNotes || undefined,
      });
      setCashSuccess(true);
      // Update dashboard cash total
      setStats(prev => ({ ...prev, cashTotal: prev.cashTotal + parseFloat(cashAmount) }));
      setTimeout(() => {
        setShowCashModal(false);
        setCashAmount('');
        setCashMemberName('');
        setCashNotes('');
        setCashSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to log cash', err);
      alert('Error logging cash payment.');
    } finally {
      setCashLoading(false);
    }
  };

  // === Reconciliation ===
  const fetchReconciliation = async () => {
    try {
      setReconLoading(true);
      const res = await api.get(`/payments/reconciliation?date=${reconDate}`);
      setReconData(res.data);
    } catch (err) {
      console.error('Failed to fetch reconciliation', err);
      alert('Error fetching reconciliation data.');
    } finally {
      setReconLoading(false);
    }
  };

  const handleOpenRecon = () => {
    setShowReconModal(true);
    fetchReconciliation();
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
                className="form-input"
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
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowUpiModal(true)}>
              🔗 {t('payments.createLink')} (UPI)
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowCashModal(true)}>
              💵 {t('payments.logCash')}
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--color-warning)' }} onClick={handleOpenRecon}>
              ⚖️ {t('payments.reconciliation')}
            </button>
          </div>
        </div>
        
      </div>

      {/* ========== UPI Payment Link Modal ========== */}
      {showUpiModal && (
        <div className="modal-overlay" onClick={resetUpiModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔗 Create UPI Payment Link</h2>
              <button className="modal-close" onClick={resetUpiModal}>✕</button>
            </div>

            {upiResult ? (
              <div className="modal-body">
                <div className="payment-success-card">
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                  <h3 style={{ color: 'var(--color-success)', marginBottom: '8px' }}>Payment Link Created!</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Send this link to the member via WhatsApp or SMS
                  </p>
                  <div className="payment-link-box">
                    <a href={upiResult.short_url} target="_blank" rel="noopener noreferrer">
                      {upiResult.short_url}
                    </a>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 16px', fontSize: '12px' }}
                      onClick={() => {
                        navigator.clipboard.writeText(upiResult.short_url);
                        alert('Link copied!');
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '12px' }}>
                    Status: <span className="badge badge-pending">{upiResult.status.toUpperCase()}</span>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateUpiLink} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input type="number" required min="1" value={upiAmount} onChange={e => setUpiAmount(e.target.value)} className="form-input" placeholder="e.g., 2999" />
                </div>
                <div className="form-group">
                  <label className="form-label">Member Name</label>
                  <input type="text" required value={upiName} onChange={e => setUpiName(e.target.value)} className="form-input" placeholder="Enter member name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" required value={upiPhone} onChange={e => setUpiPhone(e.target.value)} className="form-input" placeholder="10-digit mobile number" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email (optional)</label>
                  <input type="email" value={upiEmail} onChange={e => setUpiEmail(e.target.value)} className="form-input" placeholder="member@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input type="text" value={upiDesc} onChange={e => setUpiDesc(e.target.value)} className="form-input" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={upiLoading}>
                  {upiLoading ? '⏳ Creating...' : '🔗 Generate Payment Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========== Cash Payment Modal ========== */}
      {showCashModal && (
        <div className="modal-overlay" onClick={() => { setShowCashModal(false); setCashSuccess(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💵 Log Cash Payment</h2>
              <button className="modal-close" onClick={() => setShowCashModal(false)}>✕</button>
            </div>

            {cashSuccess ? (
              <div className="modal-body" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                <h3 style={{ color: 'var(--color-success)' }}>Cash Payment Logged!</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '8px' }}>
                  ₹{parseFloat(cashAmount).toLocaleString('en-IN')} from {cashMemberName}
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogCash} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input type="number" required min="1" value={cashAmount} onChange={e => setCashAmount(e.target.value)} className="form-input" placeholder="e.g., 3000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Member Name</label>
                  <input type="text" required value={cashMemberName} onChange={e => setCashMemberName(e.target.value)} className="form-input" placeholder="Enter member name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <input type="text" value={cashNotes} onChange={e => setCashNotes(e.target.value)} className="form-input" placeholder="e.g., 3-month plan renewal" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} disabled={cashLoading}>
                  {cashLoading ? '⏳ Saving...' : '💵 Log Cash Payment'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========== Reconciliation Modal ========== */}
      {showReconModal && (
        <div className="modal-overlay" onClick={() => setShowReconModal(false)}>
          <div className="modal-content modal-content-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚖️ Daily Reconciliation</h2>
              <button className="modal-close" onClick={() => setShowReconModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
                <input
                  type="date"
                  value={reconDate}
                  onChange={e => setReconDate(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={fetchReconciliation} disabled={reconLoading}>
                  {reconLoading ? '⏳' : '🔄'} Fetch
                </button>
              </div>

              {reconData && (
                <div className="recon-grid">
                  <div className="recon-card recon-cash">
                    <div className="recon-icon">💵</div>
                    <div className="recon-label">Cash</div>
                    <div className="recon-value">₹{reconData.cash.total.toLocaleString('en-IN')}</div>
                    <div className="recon-sub">{reconData.cash.transactions} transaction{reconData.cash.transactions !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="recon-card recon-upi">
                    <div className="recon-icon">📱</div>
                    <div className="recon-label">UPI / Digital</div>
                    <div className="recon-value">₹{reconData.upi.total.toLocaleString('en-IN')}</div>
                    <div className="recon-sub">{reconData.upi.transactions} transaction{reconData.upi.transactions !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="recon-card recon-total">
                    <div className="recon-icon">🏦</div>
                    <div className="recon-label">Grand Total</div>
                    <div className="recon-value">₹{reconData.grand_total.toLocaleString('en-IN')}</div>
                    <div className="recon-sub">for {reconData.date}</div>
                  </div>
                </div>
              )}

              {!reconData && !reconLoading && (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px' }}>
                  Select a date and click Fetch to view reconciliation data.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
