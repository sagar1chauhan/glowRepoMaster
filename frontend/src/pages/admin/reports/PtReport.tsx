import React from 'react';
import { Download } from 'lucide-react';

interface PtTrainerRecord {
  trainer_id: string;
  trainer_name: string;
  specialization: string;
  active_clients: number;
  completed_sessions: number;
  total_sessions: number;
  commission_earned: number;
  client_rating: number;
}

const PT_DATA: PtTrainerRecord[] = [
  { trainer_id: 'TR-1', trainer_name: 'Coach Dev Malhotra', specialization: 'Bodybuilding & Hypertrophy', active_clients: 8, completed_sessions: 96, total_sessions: 120, commission_earned: 38400, client_rating: 4.9 },
  { trainer_id: 'TR-2', trainer_name: 'Coach Pooja Deshmukh', specialization: 'Fat Loss & Functional HIIT', active_clients: 6, completed_sessions: 72, total_sessions: 90, commission_earned: 28800, client_rating: 4.8 },
  { trainer_id: 'TR-3', trainer_name: 'Head Coach Sameer Qureshi', specialization: 'Strength & Powerlifting', active_clients: 5, completed_sessions: 60, total_sessions: 75, commission_earned: 30000, client_rating: 5.0 },
];

export const PtReport: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            🏋️ Personal Training (PT) Performance & Commission Report
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Track trainer sessions conducted, client progress, attendance logs, and trainer commission payouts.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => alert('Exporting PT Report...')}>
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* KPI Top Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Active PT Clients</div>
          <div className="stat-value">{PT_DATA.reduce((acc, curr) => acc + curr.active_clients, 0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-label">Total PT Sessions Done</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>
            {PT_DATA.reduce((acc, curr) => acc + curr.completed_sessions, 0)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Commission Accrued</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>
            ₹{PT_DATA.reduce((acc, curr) => acc + curr.commission_earned, 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Trainer Name</th>
            <th>Specialization</th>
            <th>Active Clients</th>
            <th>Session Completion</th>
            <th>Rating</th>
            <th>Commission Payout</th>
          </tr>
        </thead>
        <tbody>
          {PT_DATA.map((t) => {
            const completionPercent = Math.round((t.completed_sessions / t.total_sessions) * 100);
            return (
              <tr key={t.trainer_id}>
                <td>
                  <strong style={{ color: 'var(--color-text)' }}>{t.trainer_name}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>ID: {t.trainer_id}</div>
                </td>
                <td>{t.specialization}</td>
                <td>
                  <span className="badge badge-active">{t.active_clients} Members</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                      {t.completed_sessions} / {t.total_sessions} ({completionPercent}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '4px' }}>
                    <div style={{ width: `${completionPercent}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '3px' }} />
                  </div>
                </td>
                <td>
                  <span style={{ color: 'var(--color-warning)', fontWeight: 700 }}>⭐ {t.client_rating}</span>
                </td>
                <td>
                  <strong style={{ color: 'var(--color-success)', fontSize: '15px' }}>
                    ₹{t.commission_earned.toLocaleString('en-IN')}
                  </strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PtReport;
