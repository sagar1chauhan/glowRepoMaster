import React from 'react';
import { useI18n } from '../../hooks/useI18n';

const MasterDashboard: React.FC = () => {
  const { t } = useI18n();

  return (
    <div>
      <h1 className="section-header">🏢 {t('nav.master')} — {t('dashboard.title')}</h1>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">🏙️</div>
          <div className="stat-label">Cities Active</div>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div className="stat-label">Total Gyms</div>
          <div className="stat-value">87</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">{t('dashboard.totalMembers')}</div>
          <div className="stat-value">14,520</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">{t('dashboard.monthlyRevenue')}</div>
          <div className="stat-value">₹42.5L</div>
        </div>
      </div>

      <h2 className="section-header">📊 City-wise Performance</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Nodal Manager</th>
            <th>Gyms</th>
            <th>{t('dashboard.activeMembers')}</th>
            <th>{t('dashboard.revenue')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mumbai</td>
            <td>Rahul Sharma</td>
            <td>18</td>
            <td>3,240</td>
            <td>₹12.1L</td>
          </tr>
          <tr>
            <td>Delhi NCR</td>
            <td>Priya Singh</td>
            <td>22</td>
            <td>4,100</td>
            <td>₹14.8L</td>
          </tr>
          <tr>
            <td>Bengaluru</td>
            <td>Vikram Patel</td>
            <td>15</td>
            <td>2,880</td>
            <td>₹9.2L</td>
          </tr>
          <tr>
            <td>Hyderabad</td>
            <td>Ananya Reddy</td>
            <td>12</td>
            <td>1,950</td>
            <td>₹6.4L</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MasterDashboard;
