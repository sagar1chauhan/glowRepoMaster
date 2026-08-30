import React, { useState } from 'react';
import { ShieldCheck, Plus, Search, Edit2, Trash2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: 'TRAINER' | 'MANAGER' | 'RECEPTIONIST' | 'CLEANER' | 'NUTRITIONIST';
  phone: string;
  email: string;
  salary: number;
  join_date: string;
  shift: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
}

const INITIAL_STAFF: Employee[] = [
  { id: 'emp-1', name: 'Dev Malhotra', role: 'TRAINER', phone: '+91 98201 11223', email: 'dev.m@glowrep.com', salary: 35000, join_date: '2024-01-15', shift: 'Morning (06:00 AM - 02:00 PM)', status: 'ACTIVE' },
  { id: 'emp-2', name: 'Pooja Deshmukh', role: 'TRAINER', phone: '+91 98202 22334', email: 'pooja.d@glowrep.com', salary: 32000, join_date: '2024-03-01', shift: 'Evening (02:00 PM - 10:00 PM)', status: 'ACTIVE' },
  { id: 'emp-3', name: 'Sameer Qureshi', role: 'TRAINER', phone: '+91 98203 33445', email: 'sameer.q@glowrep.com', salary: 45000, join_date: '2023-06-10', shift: 'General (08:00 AM - 05:00 PM)', status: 'ACTIVE' },
  { id: 'emp-4', name: 'Kavita Singh', role: 'RECEPTIONIST', phone: '+91 98204 44556', email: 'kavita.s@glowrep.com', salary: 22000, join_date: '2024-05-15', shift: 'Morning (06:30 AM - 03:00 PM)', status: 'ACTIVE' },
  { id: 'emp-5', name: 'Ritu Varma', role: 'NUTRITIONIST', phone: '+91 98205 55667', email: 'ritu.v@glowrep.com', salary: 30000, join_date: '2024-02-20', shift: 'General (10:00 AM - 06:00 PM)', status: 'ACTIVE' },
];

export const Employees: React.FC = () => {
  const [staff, setStaff] = useState<Employee[]>(INITIAL_STAFF);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // New Employee Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<Employee['role']>('TRAINER');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState(30000);
  const [shift, setShift] = useState('Morning (06:00 AM - 02:00 PM)');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      name,
      role,
      phone,
      email,
      salary: Number(salary),
      shift,
      join_date: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };
    setStaff([...staff, newEmp]);
    setShowModal(false);
    setName('');
    setPhone('');
    setEmail('');
  };

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search) || s.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            <ShieldCheck size={24} style={{ color: 'var(--color-primary)' }} />
            Gym Team & Employee Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Staff directory, personal trainers, front desk executives, shift timings, and payroll information.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Staff Member
        </button>
      </div>

      {/* KPI Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">👔</div>
          <div className="stat-label">Total Staff</div>
          <div className="stat-value">{staff.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-label">Certified Trainers</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>
            {staff.filter((s) => s.role === 'TRAINER').length}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-label">Monthly Payroll</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>
            ₹{staff.reduce((acc, curr) => acc + curr.salary, 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search employee by name, role or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Staff Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Role</th>
            <th>Contact Info</th>
            <th>Shift Timings</th>
            <th>Monthly Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((emp) => (
            <tr key={emp.id}>
              <td>
                <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{emp.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Joined: {emp.join_date}</div>
              </td>
              <td>
                <span className="badge" style={{ background: 'rgba(108, 92, 231, 0.2)', color: 'var(--color-primary)' }}>
                  {emp.role}
                </span>
              </td>
              <td>
                <div style={{ fontSize: '13px' }}>{emp.phone}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{emp.email}</div>
              </td>
              <td>
                <span style={{ fontSize: '12px' }}>{emp.shift}</span>
              </td>
              <td>
                <strong style={{ fontSize: '14px' }}>₹{emp.salary.toLocaleString('en-IN')}</strong>
              </td>
              <td>
                <span className="badge badge-active">{emp.status}</span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '11px' }}>
                    <Edit2 size={12} />
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ color: 'var(--color-danger)', borderColor: 'rgba(255, 82, 82, 0.3)', padding: '6px 10px' }}
                    onClick={() => setStaff(staff.filter((s) => s.id !== emp.id))}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add Staff Member</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddEmployee} className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value as any)} className="form-input">
                    <option value="TRAINER">Fitness Trainer</option>
                    <option value="MANAGER">Branch Manager</option>
                    <option value="RECEPTIONIST">Front Desk / Reception</option>
                    <option value="NUTRITIONIST">Nutritionist</option>
                    <option value="CLEANER">Housekeeping Staff</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    required
                    min="5000"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="staff@glowrep.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Shift Timing</label>
                <input
                  type="text"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Morning (06:00 AM - 02:00 PM)"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                💾 Save Employee
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
