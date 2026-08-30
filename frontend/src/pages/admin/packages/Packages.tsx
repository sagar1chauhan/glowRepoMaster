import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

interface GymPackage {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  category: 'GENERAL' | 'PERSONAL_TRAINING' | 'CROSSFIT' | 'CARDIO';
  features: string[];
  popular?: boolean;
}

const INITIAL_PACKAGES: GymPackage[] = [
  {
    id: 'pkg-1',
    name: '1-Month Monthly Pass',
    duration_months: 1,
    price: 2499,
    category: 'GENERAL',
    features: ['Access to all workout equipment', 'Locker access', 'General trainer guidance', '1 Fitness Assessment'],
  },
  {
    id: 'pkg-2',
    name: '3-Month Quarterly Fitness',
    duration_months: 3,
    price: 5999,
    category: 'GENERAL',
    popular: true,
    features: ['All gym machines + cardio', 'Free customized diet chart', 'Bi-weekly body stats check', 'Steam bath 2x/month'],
  },
  {
    id: 'pkg-3',
    name: '6-Month Semi-Annual Transformation',
    duration_months: 6,
    price: 9999,
    category: 'GENERAL',
    features: ['Unlimited gym & cardio access', 'Monthly nutritionist consult', 'Free gym kit bag', 'Locker & shower facilities'],
  },
  {
    id: 'pkg-4',
    name: '12-Month Annual Gold Elite',
    duration_months: 12,
    price: 15999,
    category: 'GENERAL',
    popular: true,
    features: ['365 Days all branch access', '2 Free PT trial sessions', 'Full body composition report', '1 Month freeze allowance'],
  },
  {
    id: 'pkg-5',
    name: '1-on-1 Personal Training (30 Sessions)',
    duration_months: 2,
    price: 18000,
    category: 'PERSONAL_TRAINING',
    features: ['Dedicated certified trainer', 'Custom workout programming', 'Macro diet tracking', 'Post-workout recovery support'],
  },
];

export const Packages: React.FC = () => {
  const [packages, setPackages] = useState<GymPackage[]>(INITIAL_PACKAGES);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [durationMonths, setDurationMonths] = useState(1);
  const [price, setPrice] = useState(2500);
  const [category, setCategory] = useState<'GENERAL' | 'PERSONAL_TRAINING' | 'CROSSFIT'>('GENERAL');
  const [featuresText, setFeaturesText] = useState('All machines access, Locker, Assessment');

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    const newPkg: GymPackage = {
      id: `pkg-${Date.now()}`,
      name,
      duration_months: Number(durationMonths),
      price: Number(price),
      category,
      features: featuresText.split(',').map((f) => f.trim()).filter(Boolean),
    };
    setPackages([...packages, newPkg]);
    setShowModal(false);
    setName('');
  };

  const deletePackage = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            📦 Membership Packages & Pricing
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Configure gym subscription plans, pricing tiers, personal training packages, and perks.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Package
        </button>
      </div>

      {/* Packages Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="stat-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: pkg.popular ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
              background: pkg.popular ? 'linear-gradient(180deg, rgba(108, 92, 231, 0.08), var(--color-surface))' : 'var(--color-surface)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge" style={{ background: 'rgba(0, 210, 255, 0.15)', color: 'var(--color-accent)' }}>
                  {pkg.duration_months} Month{pkg.duration_months > 1 ? 's' : ''}
                </span>
                {pkg.popular && (
                  <span className="badge badge-active" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} /> Popular
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{pkg.name}</h3>
              
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '16px' }}>
                ₹{pkg.price.toLocaleString('en-IN')}
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 400 }}> /plan</span>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                  What's Included:
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pkg.features.map((feat, fIdx) => (
                    <li key={fIdx} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
                      <span style={{ color: 'var(--color-success)' }}>✓</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}>
                <Edit2 size={13} /> Edit
              </button>
              <button
                className="btn btn-secondary"
                style={{ color: 'var(--color-danger)', borderColor: 'rgba(255, 82, 82, 0.3)', padding: '8px 12px' }}
                onClick={() => deletePackage(pkg.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Package Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Create New Package</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreatePackage} className="modal-body">
              <div className="form-group">
                <label className="form-label">Package Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Month Gold Plan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Duration (Months)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="form-input">
                  <option value="GENERAL">General Gym & Cardio</option>
                  <option value="PERSONAL_TRAINING">Personal Training (1-on-1)</option>
                  <option value="CROSSFIT">CrossFit & Functional</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Features / Benefits (comma separated)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="form-input"
                  placeholder="Full gym access, Diet plan, Locker, Fitness evaluation"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                💾 Save Package
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
