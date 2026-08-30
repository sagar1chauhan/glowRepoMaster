import React, { useState } from 'react';
import { Search, RefreshCw, Send } from 'lucide-react';

interface ExpiredMember {
  id: string;
  name: string;
  phone: string;
  last_package: string;
  expired_on: string;
  days_expired: number;
  last_trainer: string;
}

const EXPIRED_DATA: ExpiredMember[] = [
  { id: 'exp-1', name: 'Pooja Bhatt', phone: '+91 98920 44332', last_package: '6-Month Semi-Annual', expired_on: '2026-08-28', days_expired: 1, last_trainer: 'Dev' },
  { id: 'exp-2', name: 'Rahul Gupta', phone: '+91 97654 88990', last_package: '1-Month Monthly Pass', expired_on: '2026-08-25', days_expired: 4, last_trainer: 'Pooja' },
  { id: 'exp-3', name: 'Manish Tyagi', phone: '+91 98200 77665', last_package: '3-Month Quarterly', expired_on: '2026-08-15', days_expired: 14, last_trainer: 'Sameer' },
  { id: 'exp-4', name: 'Divya Chawla', phone: '+91 98334 11223', last_package: 'Annual Gold Elite', expired_on: '2026-08-01', days_expired: 28, last_trainer: 'Dev' },
];

export const ExpiredMembersReport: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = EXPIRED_DATA.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search)
  );

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-header" style={{ margin: 0 }}>
          ⚠️ Expired Members & Re-engagement Hub
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Identify members who recently lapsed and trigger win-back promotional offers or renewal links.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">⌛</div>
          <div className="stat-label">Expired this Month</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>{EXPIRED_DATA.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-label">Re-engagement Opportunity</div>
          <div className="stat-value">₹58,000</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Potential pipeline value</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-label">Win-Back Rate</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>42%</div>
        </div>
      </div>

      {/* Search & Bulk Outreach */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search expired members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <button className="btn btn-primary" onClick={() => alert('Broadcasting win-back WhatsApp discount to all expired members!')}>
          📢 Broadcast Renewal Discount (10% Off)
        </button>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Member Details</th>
            <th>Expired Package</th>
            <th>Expired Date</th>
            <th>Lapsed Duration</th>
            <th>Last Trainer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((m) => (
            <tr key={m.id}>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{m.phone}</div>
              </td>
              <td>{m.last_package}</td>
              <td style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{m.expired_on}</td>
              <td>
                <span className="badge badge-expired">{m.days_expired} Days Ago</span>
              </td>
              <td>{m.last_trainer}</td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                    onClick={() => alert(`Sent renewal offer to ${m.name}`)}
                  >
                    <Send size={12} /> WhatsApp Offer
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                    onClick={() => alert(`Renewing ${m.name}`)}
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

export default ExpiredMembersReport;
