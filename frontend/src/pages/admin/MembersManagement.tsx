import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useI18n } from '../../hooks/useI18n';

const MembersManagement: React.FC = () => {
  const { t } = useI18n();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Member Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [expiry, setExpiry] = useState('');

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/members');
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/members', {
        name,
        phone,
        email,
        membership_expiry: expiry,
        status: 'ACTIVE'
      });
      setShowAddForm(false);
      setName('');
      setPhone('');
      setEmail('');
      setExpiry('');
      fetchMembers(); // Refresh the list
    } catch (err) {
      console.error('Failed to add member', err);
      alert('Error adding member. Please check details.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="section-header">👥 Members Management</h1>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '➕ Add New Member'}
        </button>
      </div>

      {showAddForm && (
        <div className="stat-card" style={{ marginBottom: '20px' }}>
          <h2 className="section-header">Register New Member</h2>
          <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)' }}>Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)' }}>Phone</label>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)' }}>Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--color-text-muted)' }}>Membership Expiry Date</label>
              <input type="date" required value={expiry} onChange={e => setExpiry(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Save Member</button>
            </div>
          </form>
        </div>
      )}

      <div className="stat-card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <p>Loading members...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Phone</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>{m.name}</td>
                  <td style={{ padding: '12px' }}>{m.phone}</td>
                  <td style={{ padding: '12px' }}>{m.email}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      background: m.status === 'ACTIVE' ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
                      color: m.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-warning)'
                    }}>
                      {m.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{new Date(m.membership_expiry).toLocaleDateString()}</td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No members found. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '10px', borderRadius: '8px', 
  border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', 
  color: 'white', marginTop: '4px'
};

export default MembersManagement;
