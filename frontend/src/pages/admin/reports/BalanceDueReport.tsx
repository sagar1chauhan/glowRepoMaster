import React, { useState } from 'react';
import { Search, Send, Download } from 'lucide-react';

interface DueMember {
  id: string;
  name: string;
  phone: string;
  package_name: string;
  total_fee: number;
  paid_amount: number;
  balance_due: number;
  due_since: string;
}

const DUE_MEMBERS: DueMember[] = [
  { id: 'd-1', name: 'Rahul Gupta', phone: '+91 97654 88990', package_name: '1-Month Monthly Pass', total_fee: 2499, paid_amount: 2000, balance_due: 499, due_since: '2026-07-25' },
  { id: 'd-2', name: 'Siddharth Rao', phone: '+91 98221 44556', package_name: '6-Month Semi-Annual', total_fee: 9999, paid_amount: 5000, balance_due: 4999, due_since: '2026-08-10' },
  { id: 'd-3', name: 'Kavita Menon', phone: '+91 98110 22334', package_name: '3-Month Quarterly', total_fee: 5999, paid_amount: 3000, balance_due: 2999, due_since: '2026-08-01' },
  { id: 'd-4', name: 'Akash Dubey', phone: '+91 98980 11223', package_name: 'Annual Gold Elite', total_fee: 15999, paid_amount: 10000, balance_due: 5999, due_since: '2026-08-15' },
];

export const BalanceDueReport: React.FC = () => {
  const [members] = useState<DueMember[]>(DUE_MEMBERS);
  const [search, setSearch] = useState('');

  const totalOutstanding = members.reduce((sum, m) => sum + m.balance_due, 0);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            💰 Balance Due & Pending Collection Report
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            List of members with pending fee installments, due dates, and one-click payment reminders.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => alert('Exporting CSV...')}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* KPI Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-label">Total Outstanding Due</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Members with Dues</div>
          <div className="stat-value">{members.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-label">Average Due Amount</div>
          <div className="stat-value">
            ₹{Math.round(totalOutstanding / (members.length || 1)).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search member or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Member Details</th>
            <th>Package</th>
            <th>Total Fee</th>
            <th>Amount Paid</th>
            <th>Balance Due</th>
            <th>Due Since</th>
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
              <td>{m.package_name}</td>
              <td>₹{m.total_fee.toLocaleString('en-IN')}</td>
              <td>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                  ₹{m.paid_amount.toLocaleString('en-IN')}
                </span>
              </td>
              <td>
                <strong style={{ color: 'var(--color-danger)', fontSize: '15px' }}>
                  ₹{m.balance_due.toLocaleString('en-IN')}
                </strong>
              </td>
              <td>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{m.due_since}</span>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '11px' }}
                  onClick={() => alert(`Payment reminder link sent to ${m.name}!`)}
                >
                  <Send size={12} /> Send Pay Link
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BalanceDueReport;
