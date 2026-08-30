import React, { useState } from 'react';
import { RotateCcw, PhoneCall, CheckCircle2, Search } from 'lucide-react';

interface FollowUpItem {
  id: string;
  name: string;
  phone: string;
  type: 'ENQUIRY' | 'PAYMENT_DUE' | 'RENEWAL' | 'FEEDBACK';
  due_date: string;
  notes: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
}

const INITIAL_FOLLOWUPS: FollowUpItem[] = [
  {
    id: 'f-1',
    name: 'Aarav Mehta',
    phone: '+91 98201 12345',
    type: 'ENQUIRY',
    due_date: '2026-08-30',
    notes: 'Call regarding discount on 1-year annual plan.',
    status: 'PENDING',
  },
  {
    id: 'f-2',
    name: 'Sameer Joshi',
    phone: '+91 98330 99887',
    type: 'PAYMENT_DUE',
    due_date: '2026-08-29',
    notes: 'Pending due payment of ₹2,500 for monthly renewal.',
    status: 'PENDING',
  },
  {
    id: 'f-3',
    name: 'Pooja Bhatt',
    phone: '+91 98920 44332',
    type: 'RENEWAL',
    due_date: '2026-08-28',
    notes: 'Membership expired on 27th Aug. Check if renewing with personal trainer.',
    status: 'OVERDUE',
  },
  {
    id: 'f-4',
    name: 'Vikram Choudhary',
    phone: '+91 97711 22334',
    type: 'FEEDBACK',
    due_date: '2026-08-29',
    notes: 'Reported AC issue in dumbbell section, inform fixed.',
    status: 'COMPLETED',
  },
];

export const FollowUps: React.FC = () => {
  const [items, setItems] = useState<FollowUpItem[]>(INITIAL_FOLLOWUPS);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.phone.includes(search);
    const matchesType = filterType === 'ALL' || item.status === filterType || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const markCompleted = (id: string) => {
    setItems(items.map((it) => (it.id === id ? { ...it, status: 'COMPLETED' } : it)));
  };

  const getTypeBadge = (type: FollowUpItem['type']) => {
    switch (type) {
      case 'ENQUIRY':
        return <span className="badge" style={{ background: 'rgba(0, 210, 255, 0.15)', color: 'var(--color-accent)' }}>📋 Enquiry Lead</span>;
      case 'PAYMENT_DUE':
        return <span className="badge badge-expired">💰 Payment Due</span>;
      case 'RENEWAL':
        return <span className="badge badge-pending">🔄 Expiring / Renewal</span>;
      case 'FEEDBACK':
        return <span className="badge" style={{ background: 'rgba(108, 92, 231, 0.2)', color: 'var(--color-primary)' }}>💬 Feedback</span>;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-header" style={{ margin: 0 }}>
          <RotateCcw size={24} style={{ color: 'var(--color-warning)' }} />
          Follow-ups & Outreach Center
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Track daily calls, renewal reminders, pending balance follow-ups, and customer touchpoints.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">📞</div>
          <div className="stat-label">Total Follow-ups</div>
          <div className="stat-value">{items.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-label">Pending Calls</div>
          <div className="stat-value">{items.filter((i) => i.status === 'PENDING').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-label">Overdue</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{items.filter((i) => i.status === 'OVERDUE').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Completed Today</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>{items.filter((i) => i.status === 'COMPLETED').length}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search member or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'OVERDUE', 'COMPLETED', 'PAYMENT_DUE', 'RENEWAL'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterType(st)}
              className={`btn btn-secondary ${filterType === st ? 'active' : ''}`}
              style={{
                fontSize: '12px',
                padding: '8px 12px',
                borderColor: filterType === st ? 'var(--color-primary)' : 'var(--color-border)',
                background: filterType === st ? 'rgba(108, 92, 231, 0.2)' : undefined,
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Followup List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="stat-card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              flexWrap: 'wrap',
              gap: '16px',
              borderLeft: `4px solid ${
                item.status === 'OVERDUE'
                  ? 'var(--color-danger)'
                  : item.status === 'COMPLETED'
                  ? 'var(--color-success)'
                  : 'var(--color-warning)'
              }`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}
              >
                📞
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{item.name}</h3>
                  {getTypeBadge(item.type)}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  <span>📱 {item.phone}</span> &bull; <span>📅 Due: {item.due_date}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text)', marginTop: '6px' }}>
                  "{item.notes}"
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href={`tel:${item.phone.replace(/\s+/g, '')}`}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                <PhoneCall size={14} /> Call Now
              </a>
              {item.status !== 'COMPLETED' ? (
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                  onClick={() => markCompleted(item.id)}
                >
                  <CheckCircle2 size={14} /> Mark Done
                </button>
              ) : (
                <span className="badge badge-active">Done ✅</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowUps;
