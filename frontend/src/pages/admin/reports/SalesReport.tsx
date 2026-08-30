import React, { useState } from 'react';
import { Download } from 'lucide-react';

export const SalesReport: React.FC = () => {
  const [dateRange, setDateRange] = useState('THIS_MONTH');

  const salesData = [
    { date: '2026-08-29', invoice_no: 'INV-2026-089', member: 'Kunal Kapoor', package: '12-Month Annual Gold', amount: 15999, method: 'UPI / Razorpay', status: 'PAID' },
    { date: '2026-08-28', invoice_no: 'INV-2026-088', member: 'Priya Sen', package: '3-Month Quarterly', amount: 5999, method: 'CASH', status: 'PAID' },
    { date: '2026-08-28', invoice_no: 'INV-2026-087', member: 'Amitabh Roy', package: '1-on-1 PT (30 Sessions)', amount: 18000, method: 'UPI / Razorpay', status: 'PAID' },
    { date: '2026-08-27', invoice_no: 'INV-2026-086', member: 'Rohan Deshmukh', package: '1-Month Pass', amount: 2499, method: 'CASH', status: 'PAID' },
    { date: '2026-08-26', invoice_no: 'INV-2026-085', member: 'Anjali Sharma', package: '6-Month Transformation', amount: 9999, method: 'UPI / Razorpay', status: 'PAID' },
  ];

  const totalSales = salesData.reduce((acc, curr) => acc + curr.amount, 0);
  const upiTotal = salesData.filter(s => s.method.includes('UPI')).reduce((acc, curr) => acc + curr.amount, 0);
  const cashTotal = salesData.filter(s => s.method === 'CASH').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            📊 Sales & Revenue Analytics Report
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Comprehensive sales ledger, Cash vs UPI collection split, and GST tax invoicing overview.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="form-input" style={{ width: 'auto' }}>
            <option value="TODAY">Today</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month (August 2026)</option>
            <option value="LAST_MONTH">Last Month</option>
          </select>
          <button className="btn btn-secondary" onClick={() => alert('Exporting sales report...')}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Revenue Collected</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-label">UPI / Online Collections</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>
            ₹{upiTotal.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {Math.round((upiTotal / (totalSales || 1)) * 100)}% of total volume
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-label">Cash In Hand</div>
          <div className="stat-value">
            ₹{cashTotal.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {Math.round((cashTotal / (totalSales || 1)) * 100)}% of total volume
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🧾</div>
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">{salesData.length}</div>
        </div>
      </div>

      {/* Sales Transactions Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Invoice #</th>
            <th>Member Name</th>
            <th>Package Purchased</th>
            <th>Payment Method</th>
            <th>Amount (₹)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((s, idx) => (
            <tr key={idx}>
              <td>{s.date}</td>
              <td style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{s.invoice_no}</td>
              <td>{s.member}</td>
              <td>{s.package}</td>
              <td>
                <span className="badge" style={{ background: s.method === 'CASH' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0, 210, 255, 0.15)', color: s.method === 'CASH' ? 'var(--color-success)' : 'var(--color-accent)' }}>
                  {s.method}
                </span>
              </td>
              <td>
                <strong style={{ fontSize: '14px' }}>₹{s.amount.toLocaleString('en-IN')}</strong>
              </td>
              <td>
                <span className="badge badge-active">{s.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReport;
