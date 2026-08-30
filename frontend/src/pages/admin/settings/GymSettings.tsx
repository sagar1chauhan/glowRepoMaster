import React, { useState } from 'react';
import { Info, Save } from 'lucide-react';

export const GymSettings: React.FC = () => {
  const [gymName, setGymName] = useState('GlowRep Fitness Club');
  const [branchName, setBranchName] = useState('Andheri West Branch (Flagship)');
  const [phone, setPhone] = useState('+91 98200 12345');
  const [email, setEmail] = useState('andheri@glowrep.com');
  const [address, setAddress] = useState('Plot 42, Link Road, Near Infiniti Mall, Andheri West, Mumbai - 400053');
  const [gstin, setGstin] = useState('27AABCU9603R1ZM');
  const [timings, setTimings] = useState('Monday - Saturday: 06:00 AM - 11:00 PM | Sunday: 07:00 AM - 08:00 PM');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-header" style={{ margin: 0 }}>
          <Info size={24} style={{ color: 'var(--color-primary)' }} />
          Gym Profile & Branch Configuration
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Update gym branch name, GST tax details, member receipt headers, contact info, and operating hours.
        </p>
      </div>

      {saved && (
        <div style={{ background: 'rgba(0, 230, 118, 0.1)', border: '1px solid rgba(0, 230, 118, 0.3)', color: 'var(--color-success)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
          ✅ Gym branch configuration updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="stat-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Brand Name</label>
            <input type="text" value={gymName} onChange={(e) => setGymName(e.target.value)} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Branch Location / Title</label>
            <input type="text" value={branchName} onChange={(e) => setBranchName(e.target.value)} className="form-input" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Official Contact Phone</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Official Support Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">GSTIN / Tax Identification</label>
          <input type="text" value={gstin} onChange={(e) => setGstin(e.target.value)} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Physical Gym Address</label>
          <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="form-input" />
        </div>

        <div className="form-group">
          <label className="form-label">Operating Working Hours</label>
          <input type="text" value={timings} onChange={(e) => setTimings(e.target.value)} className="form-input" />
        </div>

        <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px', marginTop: '8px' }}>
          <Save size={16} /> Save Branch Profile
        </button>
      </form>
    </div>
  );
};

export default GymSettings;
