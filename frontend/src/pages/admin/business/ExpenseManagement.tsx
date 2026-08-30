import React, { useState } from 'react';
import { WalletCards, Plus, Trash2 } from 'lucide-react';

interface ExpenseItem {
  id: string;
  category: 'RENT' | 'ELECTRICITY' | 'EQUIPMENT_MAINTENANCE' | 'STAFF_SALARY' | 'SUPPLEMENTS' | 'MARKETING' | 'MISC';
  title: string;
  amount: number;
  paid_to: string;
  payment_mode: 'CASH' | 'BANK_TRANSFER' | 'UPI';
  date: string;
  notes?: string;
}

const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: 'exp-1', category: 'RENT', title: 'Gym Floor Monthly Lease', amount: 85000, paid_to: 'Apex Commercial Landlord', payment_mode: 'BANK_TRANSFER', date: '2026-08-01', notes: 'August rent for 4,500 sq ft facility' },
  { id: 'exp-2', category: 'ELECTRICITY', title: 'Commercial Electricity & AC Bill', amount: 32400, paid_to: 'Adani Electricity Mumbai', payment_mode: 'BANK_TRANSFER', date: '2026-08-10' },
  { id: 'exp-3', category: 'EQUIPMENT_MAINTENANCE', title: 'Treadmill Belt & Cable Machine Service', amount: 8500, paid_to: 'ProFit Technicians', payment_mode: 'UPI', date: '2026-08-18' },
  { id: 'exp-4', category: 'MARKETING', title: 'Meta & Instagram Sponsored Campaign', amount: 12000, paid_to: 'Meta Ads', payment_mode: 'BANK_TRANSFER', date: '2026-08-20' },
  { id: 'exp-5', category: 'MISC', title: 'Housekeeping, Towels & Sanitizer Supplies', amount: 4500, paid_to: 'CleanCo Wholesale', payment_mode: 'CASH', date: '2026-08-25' },
];

export const ExpenseManagement: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseItem['category']>('EQUIPMENT_MAINTENANCE');
  const [amount, setAmount] = useState(5000);
  const [paidTo, setPaidTo] = useState('');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'CASH' | 'BANK_TRANSFER'>('UPI');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title,
      category,
      amount: Number(amount),
      paid_to: paidTo,
      payment_mode: paymentMode,
      date,
    };
    setExpenses([newExp, ...expenses]);
    setShowModal(false);
    setTitle('');
    setPaidTo('');
  };

  const getCategoryBadge = (cat: ExpenseItem['category']) => {
    return <span className="badge" style={{ background: 'rgba(255, 171, 64, 0.15)', color: 'var(--color-warning)' }}>{cat.replace('_', ' ')}</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            <WalletCards size={24} style={{ color: 'var(--color-warning)' }} />
            Gym Expense & Operating Cost Tracker
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Record operational expenses, electricity bills, rent, trainer payouts, equipment repairs, and vendors.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Record Expense
        </button>
      </div>

      {/* KPI Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-label">Total Monthly Expenses</div>
          <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
            ₹{totalExpense.toLocaleString('en-IN')}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-label">Rent & Utilities</div>
          <div className="stat-value">
            ₹{expenses.filter(e => e.category === 'RENT' || e.category === 'ELECTRICITY').reduce((a, c) => a + c.amount, 0).toLocaleString('en-IN')}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-label">Equipment Repairs</div>
          <div className="stat-value">
            ₹{expenses.filter(e => e.category === 'EQUIPMENT_MAINTENANCE').reduce((a, c) => a + c.amount, 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Expense Details</th>
            <th>Category</th>
            <th>Paid To / Vendor</th>
            <th>Mode</th>
            <th>Amount (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.date}</td>
              <td>
                <strong style={{ color: 'var(--color-text)' }}>{exp.title}</strong>
                {exp.notes && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{exp.notes}</div>}
              </td>
              <td>{getCategoryBadge(exp.category)}</td>
              <td>{exp.paid_to}</td>
              <td>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {exp.payment_mode}
                </span>
              </td>
              <td>
                <strong style={{ fontSize: '14px', color: 'var(--color-danger)' }}>
                  ₹{exp.amount.toLocaleString('en-IN')}
                </strong>
              </td>
              <td>
                <button
                  className="btn btn-secondary"
                  style={{ color: 'var(--color-danger)', borderColor: 'rgba(255, 82, 82, 0.3)', padding: '6px 10px' }}
                  onClick={() => setExpenses(expenses.filter((e) => e.id !== exp.id))}
                >
                  <Trash2 size={12} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Record New Expense</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddExpense} className="modal-body">
              <div className="form-group">
                <label className="form-label">Expense Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cable pulley replacement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="form-input">
                    <option value="RENT">Facility Rent</option>
                    <option value="ELECTRICITY">Electricity & Utilities</option>
                    <option value="EQUIPMENT_MAINTENANCE">Equipment Repairs</option>
                    <option value="STAFF_SALARY">Trainer / Staff Salary</option>
                    <option value="MARKETING">Marketing & Ads</option>
                    <option value="MISC">Miscellaneous</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Paid To / Vendor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vendor name"
                    value={paidTo}
                    onChange={(e) => setPaidTo(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Mode</label>
                  <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as any)} className="form-input">
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="BANK_TRANSFER">Bank NEFT/RTGS</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                💾 Save Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;
