import React, { useState } from 'react';
import { CircleDollarSign, Download, Printer, Search } from 'lucide-react';

interface InvoiceItem {
  invoice_id: string;
  member_name: string;
  phone: string;
  description: string;
  amount: number;
  payment_method: 'RAZORPAY_UPI' | 'CASH' | 'CARD' | 'BANK_TRANSFER';
  date: string;
  status: 'PAID' | 'PENDING' | 'REFUNDED';
}

const INVOICE_DATA: InvoiceItem[] = [
  { invoice_id: 'INV-2026-101', member_name: 'Kunal Kapoor', phone: '+91 98211 44556', description: '12-Month Annual Gold Elite Package', amount: 15999, payment_method: 'RAZORPAY_UPI', date: '2026-08-29', status: 'PAID' },
  { invoice_id: 'INV-2026-102', member_name: 'Priya Sen', phone: '+91 98330 12345', description: '3-Month Quarterly Membership', amount: 5999, payment_method: 'CASH', date: '2026-08-28', status: 'PAID' },
  { invoice_id: 'INV-2026-103', member_name: 'Amitabh Roy', phone: '+91 98200 99887', description: 'Personal Training 30 Sessions Plan', amount: 18000, payment_method: 'RAZORPAY_UPI', date: '2026-08-28', status: 'PAID' },
  { invoice_id: 'INV-2026-104', member_name: 'Sameer Joshi', phone: '+91 98330 99887', description: 'Part Payment (Installment 1)', amount: 3500, payment_method: 'CARD', date: '2026-08-27', status: 'PAID' },
];

export const PaymentsLedger: React.FC = () => {
  const [invoices] = useState<InvoiceItem[]>(INVOICE_DATA);
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

  const filtered = invoices.filter((i) =>
    i.member_name.toLowerCase().includes(search.toLowerCase()) || i.invoice_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="section-header" style={{ margin: 0 }}>
            <CircleDollarSign size={24} style={{ color: 'var(--color-success)' }} />
            Payments & Invoicing Ledger
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
            Tax invoices, GST compliance records, payment links generated, and printable member receipts.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => alert('Exporting all invoices...')}>
          <Download size={14} /> Export Invoices
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '360px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by invoice number or member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Member Details</th>
            <th>Description</th>
            <th>Payment Mode</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((inv) => (
            <tr key={inv.invoice_id}>
              <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{inv.invoice_id}</td>
              <td>
                <div style={{ fontWeight: 600 }}>{inv.member_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{inv.phone}</div>
              </td>
              <td>{inv.description}</td>
              <td>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {inv.payment_method.replace('_', ' ')}
                </span>
              </td>
              <td>
                <strong style={{ fontSize: '14px', color: 'var(--color-success)' }}>
                  ₹{inv.amount.toLocaleString('en-IN')}
                </strong>
              </td>
              <td>{inv.date}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                  onClick={() => setSelectedInvoice(inv)}
                >
                  <Printer size={12} /> Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🧾 Payment Receipt</h2>
              <button className="modal-close" onClick={() => setSelectedInvoice(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>💪</div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>GLOWREP GYM & FITNESS</h3>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Andheri West Branch, Mumbai &bull; GSTIN: 27AABCU9603R1ZM</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Invoice No:</span>
                <strong>{selectedInvoice.invoice_id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Date:</span>
                <span>{selectedInvoice.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Billed To:</span>
                <strong>{selectedInvoice.member_name} ({selectedInvoice.phone})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '16px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Payment Mode:</span>
                <span className="badge badge-active">{selectedInvoice.payment_method}</span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                  <span>{selectedInvoice.description}</span>
                  <span>₹{selectedInvoice.amount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Inclusive of all applicable GST taxes (18%)</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                <span>Total Paid:</span>
                <span style={{ color: 'var(--color-success)' }}>₹{selectedInvoice.amount.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => window.print()}>
                  <Printer size={14} /> Print Receipt
                </button>
                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => alert('Receipt sent on WhatsApp!')}>
                  WhatsApp Member 📲
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsLedger;
