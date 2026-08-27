import React from 'react';
import { useI18n } from '../../hooks/useI18n';

const NodalDashboard: React.FC = () => {
  const { t } = useI18n();

  return (
    <div>
      <h1 className="section-header">🌍 {t('nav.nodal')} — {t('dashboard.title')} (Mumbai)</h1>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-label">Gyms in Region</div>
          <div className="stat-value">18</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">{t('dashboard.activeMembers')}</div>
          <div className="stat-value">3,240</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">{t('dashboard.todayCheckins')}</div>
          <div className="stat-value">1,850</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Region Revenue (MTD)</div>
          <div className="stat-value">₹12.1L</div>
        </div>
      </div>

      <h2 className="section-header">🏢 Gym Performance</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Gym Name</th>
            <th>Location</th>
            <th>{t('dashboard.activeMembers')}</th>
            <th>{t('dashboard.todayCheckins')}</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>GlowRep Andheri</td>
            <td>Andheri West</td>
            <td>450</td>
            <td>280</td>
            <td><span className="badge badge-active">Good</span></td>
          </tr>
          <tr>
            <td>GlowRep Bandra</td>
            <td>Bandra West</td>
            <td>380</td>
            <td>210</td>
            <td><span className="badge badge-active">Good</span></td>
          </tr>
          <tr>
            <td>GlowRep Juhu</td>
            <td>Juhu</td>
            <td>210</td>
            <td>90</td>
            <td><span className="badge badge-warning">Needs Attention</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NodalDashboard;
