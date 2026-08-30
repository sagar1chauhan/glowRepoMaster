import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';

interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  membership_expiry: string;
  created_at: string;
  attendance: { id: string; check_in_time: string }[];
}

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editExpiry, setEditExpiry] = useState('');

  const fetchMember = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/members/${id}`);
      setMember(res.data);
      setEditName(res.data.name);
      setEditPhone(res.data.phone);
      setEditEmail(res.data.email || '');
      setEditStatus(res.data.status);
      setEditExpiry(res.data.membership_expiry ? res.data.membership_expiry.split('T')[0] : '');
    } catch (err) {
      console.error('Failed to fetch member', err);
      setError('Failed to load member details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg('');
      setError('');
      const res = await api.put(`/members/${id}`, {
        name: editName,
        phone: editPhone,
        email: editEmail,
        status: editStatus,
        membership_expiry: editExpiry,
      });
      setMember({ ...member!, ...res.data, attendance: member!.attendance });
      setSuccessMsg('Member updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update member', err);
      setError('Failed to update member. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div className="profile-loader">
          <div className="loader-spinner" />
          <p style={{ color: 'var(--color-text-muted)', marginTop: '16px' }}>Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (error && !member) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: 'var(--color-danger)', fontSize: '18px', marginBottom: '20px' }}>⚠️ {error}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/members')}>← Back to Members</button>
      </div>
    );
  }

  // Payment link state
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');

  const handleSendPaymentLink = async () => {
    const amount = prompt('Enter amount in ₹ (e.g., 2999):');
    if (!amount || isNaN(parseFloat(amount))) return;

    try {
      setPaymentLoading(true);
      setPaymentLink('');
      const res = await api.post('/payments/create-link', {
        amount: parseFloat(amount),
        member_name: member!.name,
        member_phone: member!.phone,
        member_email: member!.email || undefined,
        description: `Membership Renewal - ${member!.name}`,
      });
      setPaymentLink(res.data.short_url);
      setSuccessMsg(`Payment link created for ₹${parseFloat(amount).toLocaleString('en-IN')}!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Failed to create payment link', err);
      setError('Failed to create payment link.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!member) return null;

  return (
    <div className="member-profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="btn btn-secondary" onClick={() => navigate('/admin/members')} style={{ marginBottom: '20px' }}>
          ← Back to Members
        </button>
        <div className="profile-hero">
          <div className="profile-avatar">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-name">{member.name}</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Member since {new Date(member.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span className={`badge ${member.status === 'ACTIVE' ? 'badge-active' : 'badge-expired'}`}>
                {member.status}
              </span>
              <button
                className="btn btn-primary"
                style={{ padding: '6px 16px', fontSize: '12px' }}
                onClick={handleSendPaymentLink}
                disabled={paymentLoading}
              >
                {paymentLoading ? '⏳ Creating...' : '🔗 Send Payment Link (UPI)'}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Link Result */}
        {paymentLink && (
          <div className="payment-link-box" style={{ marginTop: '16px' }}>
            <a href={paymentLink} target="_blank" rel="noopener noreferrer">
              {paymentLink}
            </a>
            <button
              className="btn btn-primary"
              style={{ padding: '6px 16px', fontSize: '12px' }}
              onClick={() => {
                navigator.clipboard.writeText(paymentLink);
                alert('Link copied to clipboard!');
              }}
            >
              📋 Copy
            </button>
          </div>
        )}
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="profile-alert profile-alert-success">
          ✅ {successMsg}
        </div>
      )}
      {error && member && (
        <div className="profile-alert profile-alert-error">
          ⚠️ {error}
        </div>
      )}

      {/* Main Grid: Edit Form + Attendance */}
      <div className="profile-grid">
        {/* Edit Form */}
        <div className="stat-card profile-edit-card">
          <h2 className="section-header">✏️ Edit Member Details</h2>
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                required
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={e => setEditEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
                className="form-input"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Membership Expiry</label>
              <input
                type="date"
                required
                value={editExpiry}
                onChange={e => setEditExpiry(e.target.value)}
                className="form-input"
              />
            </div>
            <button type="submit" className="btn btn-primary profile-save-btn" disabled={saving}>
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>

        {/* Attendance History */}
        <div className="stat-card profile-attendance-card">
          <h2 className="section-header">📋 Attendance History</h2>
          {member.attendance && member.attendance.length > 0 ? (
            <div className="attendance-list">
              {member.attendance.map((a, index) => {
                const date = new Date(a.check_in_time);
                return (
                  <div key={a.id} className="attendance-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div className="attendance-icon">🏋️</div>
                    <div className="attendance-info">
                      <span className="attendance-date">
                        {date.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="attendance-time">
                        {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="attendance-empty">
              <span style={{ fontSize: '48px' }}>📭</span>
              <p>No check-ins recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
