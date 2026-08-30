import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface StaffAttendanceRecord {
  id: string;
  name: string;
  role: string;
  shift: string;
  in_time: string;
  out_time: string;
  working_hours: string;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'HALF_DAY';
}

const STAFF_ATTENDANCE: StaffAttendanceRecord[] = [
  { id: 'sa-1', name: 'Dev Malhotra', role: 'Trainer', shift: 'Morning', in_time: '05:55 AM', out_time: '02:05 PM', working_hours: '8h 10m', status: 'PRESENT' },
  { id: 'sa-2', name: 'Pooja Deshmukh', role: 'Trainer', shift: 'Evening', in_time: '02:15 PM', out_time: '10:00 PM', working_hours: '7h 45m', status: 'LATE' },
  { id: 'sa-3', name: 'Sameer Qureshi', role: 'Head Coach', shift: 'General', in_time: '08:00 AM', out_time: '05:00 PM', working_hours: '9h 00m', status: 'PRESENT' },
  { id: 'sa-4', name: 'Kavita Singh', role: 'Receptionist', shift: 'Morning', in_time: '06:28 AM', out_time: '03:00 PM', working_hours: '8h 32m', status: 'PRESENT' },
  { id: 'sa-5', name: 'Ritu Varma', role: 'Nutritionist', shift: 'General', in_time: '-', out_time: '-', working_hours: '-', status: 'ABSENT' },
];

export const EmployeeAttendance: React.FC = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            📋 Staff & Trainer Attendance Punch Logs
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Daily check-in / check-out times, late arrivals, working hours summary, and leave tracking.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            style={{ width: 'auto' }}
          />
          <button className="btn btn-secondary" onClick={() => alert('Exporting staff attendance...')}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Staff</div>
          <div className="stat-value">{STAFF_ATTENDANCE.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Present Today</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>
            {STAFF_ATTENDANCE.filter((s) => s.status === 'PRESENT' || s.status === 'LATE').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-label">Late Punch-ins</div>
          <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
            {STAFF_ATTENDANCE.filter((s) => s.status === 'LATE').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-label">Absent / On Leave</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
            {STAFF_ATTENDANCE.filter((s) => s.status === 'ABSENT').length}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Role & Shift</th>
            <th>In Time</th>
            <th>Out Time</th>
            <th>Total Hours</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {STAFF_ATTENDANCE.map((s) => (
            <tr key={s.id}>
              <td>
                <strong style={{ color: 'var(--color-text)' }}>{s.name}</strong>
              </td>
              <td>
                <div>{s.role}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.shift} Shift</div>
              </td>
              <td>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{s.in_time}</span>
              </td>
              <td>{s.out_time}</td>
              <td>{s.working_hours}</td>
              <td>
                <span
                  className="badge"
                  style={{
                    background:
                      s.status === 'PRESENT'
                        ? 'rgba(0, 230, 118, 0.15)'
                        : s.status === 'LATE'
                        ? 'rgba(255, 171, 64, 0.15)'
                        : 'rgba(255, 82, 82, 0.15)',
                    color:
                      s.status === 'PRESENT'
                        ? 'var(--color-success)'
                        : s.status === 'LATE'
                        ? 'var(--color-warning)'
                        : 'var(--color-danger)',
                  }}
                >
                  {s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeAttendance;
