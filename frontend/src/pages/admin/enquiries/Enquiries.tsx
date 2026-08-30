import React, { useState } from 'react';
import { Users, Plus, Search, Phone, Mail, Calendar, CheckCircle2 } from 'lucide-react';

interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: 'HOT' | 'WARM' | 'COLD' | 'CONVERTED' | 'LOST';
  interested_in: string;
  follow_up_date: string;
  notes: string;
  created_at: string;
}

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    name: 'Aarav Mehta',
    phone: '+91 98201 12345',
    email: 'aarav.mehta@gmail.com',
    source: 'Instagram Ad',
    status: 'HOT',
    interested_in: 'Annual Membership + PT',
    follow_up_date: '2026-08-30',
    notes: 'Visited gym today, very interested in evening slot.',
    created_at: '2026-08-28',
  },
  {
    id: 'enq-2',
    name: 'Rohan Deshmukh',
    phone: '+91 98192 67890',
    email: 'rohan.d@yahoo.com',
    source: 'Walk-in',
    status: 'WARM',
    interested_in: '3-Month Quarterly',
    follow_up_date: '2026-09-01',
    notes: 'Requested trial session on Saturday.',
    created_at: '2026-08-27',
  },
  {
    id: 'enq-3',
    name: 'Neha Verma',
    phone: '+91 97654 32109',
    email: 'neha.verma@outlook.com',
    source: 'Referral',
    status: 'HOT',
    interested_in: 'Weight Loss & Diet Consultation',
    follow_up_date: '2026-08-29',
    notes: 'Looking for personal trainer consultation.',
    created_at: '2026-08-26',
  },
  {
    id: 'enq-4',
    name: 'Kunal Kapoor',
    phone: '+91 98211 44556',
    email: 'kunal.k@gmail.com',
    source: 'Google Maps',
    status: 'CONVERTED',
    interested_in: '1-Year Premium',
    follow_up_date: '2026-08-25',
    notes: 'Enrolled today via UPI payment.',
    created_at: '2026-08-24',
  },
];

export const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('Walk-in');
  const [status, setStatus] = useState<'HOT' | 'WARM' | 'COLD'>('HOT');
  const [interestedIn, setInterestedIn] = useState('1-Year Membership');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEnq: Enquiry = {
      id: `enq-${Date.now()}`,
      name,
      phone,
      email,
      source,
      status,
      interested_in: interestedIn,
      follow_up_date: followUpDate || new Date().toISOString().split('T')[0],
      notes,
      created_at: new Date().toISOString().split('T')[0],
    };
    setEnquiries([newEnq, ...enquiries]);
    setShowModal(false);
    // Reset
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  const handleStatusChange = (id: string, newStatus: Enquiry['status']) => {
    setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            <Users size={24} style={{ color: 'var(--color-primary)' }} />
            Enquiries CRM & Leads
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Manage walk-ins, digital leads, trial requests, and follow-ups.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Enquiry
        </button>
      </div>

      {/* Stats Summary */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-label">Total Leads</div>
          <div className="stat-value">{enquiries.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-label">Hot Leads</div>
          <div className="stat-value">{enquiries.filter((e) => e.status === 'HOT').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-label">Follow-ups Today</div>
          <div className="stat-value">{enquiries.filter((e) => e.status !== 'CONVERTED' && e.status !== 'LOST').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎉</div>
          <div className="stat-label">Converted</div>
          <div className="stat-value">{enquiries.filter((e) => e.status === 'CONVERTED').length}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by lead name, mobile or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'HOT', 'WARM', 'COLD', 'CONVERTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-secondary ${statusFilter === st ? 'active' : ''}`}
              style={{
                fontSize: '12px',
                padding: '8px 14px',
                borderColor: statusFilter === st ? 'var(--color-primary)' : 'var(--color-border)',
                background: statusFilter === st ? 'rgba(108, 92, 231, 0.2)' : undefined,
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Lead Info</th>
            <th>Source</th>
            <th>Interest</th>
            <th>Follow Up</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEnquiries.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                No enquiries found matching your search.
              </td>
            </tr>
          ) : (
            filteredEnquiries.map((enq) => (
              <tr key={enq.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{enq.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', gap: '10px', marginTop: '2px' }}>
                    <span><Phone size={11} style={{ display: 'inline', marginRight: '3px' }} />{enq.phone}</span>
                    {enq.email && <span><Mail size={11} style={{ display: 'inline', marginRight: '3px' }} />{enq.email}</span>}
                  </div>
                </td>
                <td>
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--color-text-muted)' }}>
                    {enq.source}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '13px' }}>{enq.interested_in}</div>
                  {enq.notes && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic', marginTop: '2px' }}>"{enq.notes}"</div>}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <Calendar size={13} style={{ color: 'var(--color-accent)' }} />
                    <span>{enq.follow_up_date}</span>
                  </div>
                </td>
                <td>
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value as any)}
                    className="form-input"
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      width: 'auto',
                      fontWeight: 600,
                      color:
                        enq.status === 'HOT'
                          ? '#ff5252'
                          : enq.status === 'WARM'
                          ? '#ffab40'
                          : enq.status === 'CONVERTED'
                          ? '#00e676'
                          : 'var(--color-text-muted)',
                    }}
                  >
                    <option value="HOT">🔥 HOT</option>
                    <option value="WARM">☀️ WARM</option>
                    <option value="COLD">❄️ COLD</option>
                    <option value="CONVERTED">🎉 CONVERTED</option>
                    <option value="LOST">❌ LOST</option>
                  </select>
                </td>
                <td>
                  {enq.status !== 'CONVERTED' ? (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      onClick={() => handleStatusChange(enq.id, 'CONVERTED')}
                    >
                      <CheckCircle2 size={12} /> Convert
                    </button>
                  ) : (
                    <span className="badge badge-active">Active Member</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add Enquiry Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Add New Lead / Enquiry</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddEnquiry} className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Shah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
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
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Source</label>
                  <select value={source} onChange={(e) => setSource(e.target.value)} className="form-input">
                    <option value="Walk-in">Walk-in</option>
                    <option value="Instagram Ad">Instagram Ad</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google Maps">Google Maps</option>
                    <option value="Referral">Friend Referral</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Lead Priority</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="form-input">
                    <option value="HOT">🔥 Hot (High Interest)</option>
                    <option value="WARM">☀️ Warm (Considering)</option>
                    <option value="COLD">❄️ Cold (Casual Inquiry)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Interested In</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Year Gym + Personal Trainer"
                  value={interestedIn}
                  onChange={(e) => setInterestedIn(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Next Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes & Remarks</label>
                <textarea
                  placeholder="Additional conversation notes or requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-input"
                  rows={3}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                💾 Save Enquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
