import React, { useState } from 'react';
import { Search, RefreshCw, Send } from 'lucide-react';

interface Subscription {
  id: string;
  member_name: string;
  phone: string;
  package_name: string;
  start_date: string;
  end_date: string;
  amount_paid: number;
  balance_due: number;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
}

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    member_name: 'Vikram Mehta',
    phone: '+91 98201 55667',
    package_name: '12-Month Annual Gold Elite',
    start_date: '2025-09-01',
    end_date: '2026-09-01',
    amount_paid: 15999,
    balance_due: 0,
    status: 'ACTIVE',
  },
  {
    id: 'sub-2',
    member_name: 'Anjali Sharma',
    phone: '+91 98112 33445',
    package_name: '3-Month Quarterly Fitness',
    start_date: '2026-06-05',
    end_date: '2026-09-05',
    amount_paid: 5999,
    balance_due: 0,
    status: 'EXPIRING_SOON',
  },
  {
    id: 'sub-3',
    member_name: 'Rahul Gupta',
    phone: '+91 97654 88990',
    package_name: '1-Month Monthly Pass',
    start_date: '2026-07-25',
    end_date: '2026-08-25',
    amount_paid: 2000,
    balance_due: 499,
    status: 'EXPIRED',
  },
  {
    id: 'sub-4',
    member_name: 'Pooja Bhatt',
    phone: '+91 98920 44332',
    package_name: '6-Month Semi-Annual Transformation',
    start_date: '2026-02-28',
    end_date: '2026-08-28',
    amount_paid: 9999,
    balance_due: 0,
    status: 'EXPIRED',
  },
];

export const Subscriptions: React.FC = () => {
  const [subs] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const filtered = subs.filter((s) => {
    const matchesSearch = s.member_name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search);
    const matchesFilter = filter === 'ALL' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  const sendReminder = (sub: Subscription) => {
    alert(`WhatsApp & SMS renewal reminder sent to ${sub.member_name} (${sub.phone})!`);
  };

  const getStatusBadge = (status: Subscription['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge badge-active">Active</span>;
      case 'EXPIRING_SOON':
        return <span className="badge badge-pending">⚠️ Expiring Soon</span>;
      case 'EXPIRED':
        return <span className="badge badge-expired">Expired</span>;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-header" style={{ margin: 0 }}>
          🔄 Member Subscriptions & Renewals
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Track ongoing gym packages, active memberships, expiry countdowns, and renewal triggers.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Active Subscriptions</div>
          <div className="stat-value">{subs.filter((s) => s.status === 'ACTIVE').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-label">Expiring in 7 Days</div>
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {subs.filter((s) => s.status === 'EXPIRING_SOON').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-label">Expired Plans</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
            {subs.filter((s) => s.status === 'EXPIRED').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Outstanding Dues</div>
          <div className="stat-value">
            ₹{subs.reduce((acc, curr) => acc + curr.balance_due, 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search member by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'ACTIVE', 'EXPIRING_SOON', 'EXPIRED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-secondary ${filter === f ? 'active' : ''}`}
              style={{
                fontSize: '12px',
                padding: '8px 14px',
                borderColor: filter === f ? 'var(--color-primary)' : 'var(--color-border)',
                background: filter === f ? 'rgba(108, 92, 231, 0.2)' : undefined,
              }}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Member Details</th>
            <th>Package</th>
            <th>Validity Period</th>
            <th>Payment Status</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((sub) => (
            <tr key={sub.id}>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{sub.member_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{sub.phone}</div>
              </td>
              <td>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{sub.package_name}</div>
              </td>
              <td>
                <div style={{ fontSize: '12px' }}>
                  <span>{sub.start_date}</span> ➔ <strong style={{ color: 'var(--color-accent)' }}>{sub.end_date}</strong>
                </div>
              </td>
              <td>
                <div style={{ fontSize: '13px' }}>Paid: ₹{sub.amount_paid.toLocaleString('en-IN')}</div>
                {sub.balance_due > 0 ? (
                  <div style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 600 }}>Due: ₹{sub.balance_due}</div>
                ) : (
                  <div style={{ fontSize: '11px', color: 'var(--color-success)' }}>Fully Paid ✓</div>
                )}
              </td>
              <td>{getStatusBadge(sub.status)}</td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                    onClick={() => sendReminder(sub)}
                    title="Send WhatsApp & SMS Reminder"
                  >
                    <Send size={12} /> Remind
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                    onClick={() => alert(`Opening renewal modal for ${sub.member_name}`)}
                  >
                    <RefreshCw size={12} /> Renew
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Subscriptions;
