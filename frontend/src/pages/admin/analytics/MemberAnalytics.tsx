import React from 'react';
import { BarChartBig, ArrowUpRight } from 'lucide-react';

export const MemberAnalytics: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 className="section-header" style={{ margin: 0 }}>
          <BarChartBig size={24} style={{ color: 'var(--color-primary)' }} />
          Membership Analytics & Retention Insights
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '4px' }}>
          Deep-dive into gym retention rate, member acquisition trends, churn metrics, and revenue contribution.
        </p>
      </div>

      {/* KPI Top Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-label">Retention Rate</div>
          <div className="stat-value" style={{ color: 'var(--color-success)' }}>78.4%</div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <ArrowUpRight size={14} /> +4.2% from last month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Avg Lifetime (Months)</div>
          <div className="stat-value">7.8 Mo</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Based on active members
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-label">Average Revenue Per User (ARPU)</div>
          <div className="stat-value">₹1,850</div>
          <div style={{ fontSize: '12px', color: 'var(--color-accent)', marginTop: '4px' }}>
            Per active member/month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-label">Lead Conversion Rate</div>
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>34.2%</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Walk-in & digital leads
          </div>
        </div>
      </div>

      {/* Analytics Charts & Breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* Package Distribution */}
        <div className="stat-card">
          <h2 className="section-header" style={{ fontSize: '16px', marginBottom: '16px' }}>
            📦 Plan Popularity & Distribution
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>12-Month Annual Gold</span>
                <strong style={{ color: 'var(--color-primary)' }}>42% (180 Members)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: 'var(--color-primary)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>3-Month Quarterly Plan</span>
                <strong style={{ color: 'var(--color-accent)' }}>28% (120 Members)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '28%', height: '100%', background: 'var(--color-accent)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>6-Month Semi-Annual</span>
                <strong style={{ color: 'var(--color-success)' }}>18% (78 Members)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '18%', height: '100%', background: 'var(--color-success)', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span>1-Month Monthly Pass</span>
                <strong style={{ color: 'var(--color-warning)' }}>12% (52 Members)</strong>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '12%', height: '100%', background: 'var(--color-warning)', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Member Churn Reasons */}
        <div className="stat-card">
          <h2 className="section-header" style={{ fontSize: '16px', marginBottom: '16px' }}>
            ⚠️ Churn Reasons & Feedback
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(255, 82, 82, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-danger)' }}>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Relocation / Shifting</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>45% of non-renewals</div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(255, 171, 64, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-warning)' }}>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Busy Schedule / Time Constraints</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>28% of non-renewals</div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(0, 210, 255, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-accent)' }}>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Switched to Home Workouts</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>15% of non-renewals</div>
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(108, 92, 231, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-primary)' }}>
              <div style={{ fontWeight: 600, fontSize: '13px' }}>Pricing / Budget Constraints</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>12% of non-renewals</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MemberAnalytics;
