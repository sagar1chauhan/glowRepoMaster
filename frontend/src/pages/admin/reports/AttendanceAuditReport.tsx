import React, { useState } from 'react';
import { Download, Clock, Search } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  member_name: string;
  member_id: string;
  check_in_time: string;
  mode: 'QR_SCAN' | 'BIOMETRIC' | 'MANUAL';
  package: string;
}

const ATTENDANCE_LOGS: AttendanceRecord[] = [
  { id: 'att-1', member_name: 'Rahul Sharma', member_id: 'MEM-101', check_in_time: '2026-08-29 06:15 AM', mode: 'BIOMETRIC', package: 'Annual Gold' },
  { id: 'att-2', member_name: 'Sneha Joshi', member_id: 'MEM-102', check_in_time: '2026-08-29 06:45 AM', mode: 'QR_SCAN', package: '3-Month Quarterly' },
  { id: 'att-3', member_name: 'Vikram Singh', member_id: 'MEM-103', check_in_time: '2026-08-29 07:10 AM', mode: 'QR_SCAN', package: '12-Month Elite' },
  { id: 'att-4', member_name: 'Ananya Sharma', member_id: 'MEM-104', check_in_time: '2026-08-29 08:30 AM', mode: 'BIOMETRIC', package: 'PT 30 Sessions' },
  { id: 'att-5', member_name: 'Harish Nair', member_id: 'MEM-105', check_in_time: '2026-08-29 09:15 AM', mode: 'MANUAL', package: '6-Month Transformation' },
  { id: 'att-6', member_name: 'Kunal Kapoor', member_id: 'MEM-106', check_in_time: '2026-08-29 05:30 PM', mode: 'QR_SCAN', package: 'Annual Gold' },
];

export const AttendanceAuditReport: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');

  const filtered = ATTENDANCE_LOGS.filter((a) =>
    a.member_name.toLowerCase().includes(search.toLowerCase()) || a.member_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            ⏰ Attendance Audit & Check-in Logs
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Detailed timestamp logs of QR scans, biometric machine punch-ins, and manual attendance.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          />
          <button className="btn btn-secondary" onClick={() => alert('Exporting attendance logs...')}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-label">Total Check-ins Today</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>148</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌅</div>
          <div className="stat-label">Morning Slot (6 AM - 11 AM)</div>
          <div className="stat-value">84</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌇</div>
          <div className="stat-label">Evening Peak (5 PM - 10 PM)</div>
          <div className="stat-value">64</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-label">Peak Hour</div>
          <div className="stat-value">7:00 PM</div>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by member name or ID..."
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
            <th>Member ID</th>
            <th>Member Name</th>
            <th>Check-in Timestamp</th>
            <th>Verification Mode</th>
            <th>Active Package</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id}>
              <td style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{r.member_id}</td>
              <td style={{ fontWeight: 600 }}>{r.member_name}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <Clock size={13} style={{ color: 'var(--color-text-muted)' }} />
                  {r.check_in_time}
                </div>
              </td>
              <td>
                <span className="badge" style={{ background: r.mode === 'BIOMETRIC' ? 'rgba(108, 92, 231, 0.2)' : 'rgba(0, 230, 118, 0.15)', color: r.mode === 'BIOMETRIC' ? 'var(--color-primary)' : 'var(--color-success)' }}>
                  {r.mode}
                </span>
              </td>
              <td>{r.package}</td>
              <td>
                <span className="badge badge-active">Verified ✓</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceAuditReport;
