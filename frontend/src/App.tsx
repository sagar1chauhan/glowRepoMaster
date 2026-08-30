import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from './hooks/useI18n';
import { useOfflineSync } from './hooks/useOfflineSync';
import MasterDashboard from './pages/master/MasterDashboard';
import NodalDashboard from './pages/nodal/NodalDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import MembersManagement from './pages/admin/MembersManagement';
import MemberProfile from './pages/admin/MemberProfile';
import Login from './pages/auth/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

// Admin Portal Sub-modules
import { AdminLayout } from './pages/admin/layout/AdminLayout';
import Enquiries from './pages/admin/enquiries/Enquiries';
import FollowUps from './pages/admin/follow-ups/FollowUps';
import Packages from './pages/admin/packages/Packages';
import Subscriptions from './pages/admin/subscriptions/Subscriptions';
import WorkoutCards from './pages/admin/workout-cards/WorkoutCards';
import MemberAnalytics from './pages/admin/analytics/MemberAnalytics';
import FeedbackManagement from './pages/admin/feedback/FeedbackManagement';
import DietPlanManagement from './pages/admin/diet-plan/DietPlanManagement';
import WorkoutLibrary from './pages/admin/workout-library/WorkoutLibrary';
import SuccessStories from './pages/admin/success-stories/SuccessStories';
import BalanceDueReport from './pages/admin/reports/BalanceDueReport';
import SalesReport from './pages/admin/reports/SalesReport';
import ExpiredMembersReport from './pages/admin/reports/ExpiredMembersReport';
import AttendanceAuditReport from './pages/admin/reports/AttendanceAuditReport';
import PtReport from './pages/admin/reports/PtReport';
import Employees from './pages/admin/business/Employees';
import EmployeeAttendance from './pages/admin/business/EmployeeAttendance';
import PaymentsLedger from './pages/admin/business/PaymentsLedger';
import ExpenseManagement from './pages/admin/business/ExpenseManagement';
import GymSettings from './pages/admin/settings/GymSettings';
import BiometricSettings from './pages/admin/settings/BiometricSettings';

import './App.css';

function AppContent() {
  const { t, lang, toggleLanguage } = useI18n();
  const { isOnline, pendingCount, isSyncing, syncNow } = useOfflineSync();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('glowrep_token');
  const userStr = localStorage.getItem('glowrep_user');
  let user: { id?: string; email?: string; role?: string; name?: string } | null = null;
  try {
    if (userStr) user = JSON.parse(userStr);
  } catch {
    user = null;
  }

  const isLoggedIn = !!token;
  const role = user?.role || 'GYM_ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('glowrep_token');
    localStorage.removeItem('glowrep_user');
    navigate('/login');
  };

  const getRoleDashboard = (userRole?: string) => {
    if (userRole === 'MASTER_ADMIN') return '/master';
    if (userRole === 'NODAL_MANAGER') return '/nodal';
    return '/admin';
  };

  const getRoleBadge = (userRole?: string) => {
    if (userRole === 'MASTER_ADMIN') {
      return <span className="badge badge-active" style={{ background: 'rgba(108, 92, 231, 0.25)', color: '#a29bfe' }}>🏢 Master HQ</span>;
    }
    if (userRole === 'NODAL_MANAGER') {
      return <span className="badge badge-pending" style={{ background: 'rgba(0, 210, 255, 0.2)', color: 'var(--color-accent)' }}>🌍 Nodal Mgr</span>;
    }
    return <span className="badge badge-active" style={{ background: 'rgba(0, 230, 118, 0.2)', color: 'var(--color-success)' }}>🏋️ Gym Admin</span>;
  };

  return (
    <div className="app-container">
      {/* Top Status Bar — Network & Sync */}
      <div className={`status-bar ${isOnline ? 'online' : 'offline'}`}>
        <span className="status-dot" />
        <span>{isOnline ? t('common.online') : t('common.offline')}</span>
        {pendingCount > 0 && (
          <span className="pending-badge">
            {t('checkin.pendingSync')}: {pendingCount}
            {isOnline && (
              <button
                className="sync-btn"
                onClick={syncNow}
                disabled={isSyncing}
              >
                {isSyncing ? '⏳' : '🔄'} {t('common.syncNow')}
              </button>
            )}
          </span>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isLoggedIn && user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {getRoleBadge(role)}
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {user.email}
              </span>
            </div>
          )}
          <button className="lang-toggle" onClick={toggleLanguage}>
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
          {isLoggedIn && (
            <button className="lang-toggle" onClick={handleLogout} style={{ background: 'rgba(255, 82, 82, 0.2)', color: 'var(--color-danger)', borderColor: 'rgba(255, 82, 82, 0.4)' }}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Top Master/Nodal Navigation */}
      {isLoggedIn && (role === 'MASTER_ADMIN' || role === 'NODAL_MANAGER') && (
        <nav className="main-nav">
          <div className="nav-brand">
            <span className="brand-icon">💪</span>
            <span className="brand-text">GlowRep Enterprise</span>
          </div>
          <div className="nav-links">
            {role === 'MASTER_ADMIN' && (
              <Link to="/master" className={`nav-link ${location.pathname.startsWith('/master') ? 'active' : ''}`}>
                🏢 {t('nav.master')}
              </Link>
            )}
            <Link to="/nodal" className={`nav-link ${location.pathname.startsWith('/nodal') ? 'active' : ''}`}>
              🌍 {t('nav.nodal')}
            </Link>
            <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
              🏋️ Branch Admin Suite
            </Link>
          </div>
        </nav>
      )}

      {/* Role-based routing */}
      <main className="main-content" style={location.pathname.startsWith('/admin') ? { padding: 0 } : undefined}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to={isLoggedIn ? getRoleDashboard(role) : "/login"} replace />} />
          
          {/* Master HQ */}
          <Route 
            path="/master/*" 
            element={
              <ProtectedRoute allowedRoles={['MASTER_ADMIN']}>
                <MasterDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Nodal Manager */}
          <Route 
            path="/nodal/*" 
            element={
              <ProtectedRoute allowedRoles={['MASTER_ADMIN', 'NODAL_MANAGER']}>
                <NodalDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Portal Suite (Nested inside AdminLayout with sidebar) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['MASTER_ADMIN', 'NODAL_MANAGER', 'GYM_ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="follow-ups" element={<FollowUps />} />
            <Route path="members" element={<MembersManagement />} />
            <Route path="members/:id" element={<MemberProfile />} />
            <Route path="packages" element={<Packages />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="workout-cards" element={<WorkoutCards />} />
            <Route path="analytics" element={<MemberAnalytics />} />
            <Route path="feedback" element={<FeedbackManagement />} />
            <Route path="diet-plan" element={<DietPlanManagement />} />
            <Route path="workout-library" element={<WorkoutLibrary />} />
            <Route path="success-stories" element={<SuccessStories />} />
            
            {/* Reports */}
            <Route path="reports/balance-due" element={<BalanceDueReport />} />
            <Route path="reports/sales" element={<SalesReport />} />
            <Route path="reports/expired" element={<ExpiredMembersReport />} />
            <Route path="reports/attendance" element={<AttendanceAuditReport />} />
            <Route path="reports/pt" element={<PtReport />} />

            {/* Business */}
            <Route path="business/employees" element={<Employees />} />
            <Route path="business/attendance" element={<EmployeeAttendance />} />
            <Route path="business/payments" element={<PaymentsLedger />} />
            <Route path="business/expenses" element={<ExpenseManagement />} />

            {/* Settings */}
            <Route path="settings/gym" element={<GymSettings />} />
            <Route path="settings/biometric" element={<BiometricSettings />} />
          </Route>

          <Route path="*" element={<Navigate to={isLoggedIn ? getRoleDashboard(role) : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
