import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useI18n } from './hooks/useI18n';
import { useOfflineSync } from './hooks/useOfflineSync';
import MasterDashboard from './pages/master/MasterDashboard';
import NodalDashboard from './pages/nodal/NodalDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import MembersManagement from './pages/admin/MembersManagement';
import Login from './pages/auth/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const { t, lang, toggleLanguage } = useI18n();
  const { isOnline, pendingCount, isSyncing, syncNow } = useOfflineSync();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('glowrep_token');
    localStorage.removeItem('glowrep_user');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('glowrep_token');

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
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <button className="lang-toggle" onClick={toggleLanguage}>
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
          {isLoggedIn && (
            <button className="lang-toggle" onClick={handleLogout} style={{ background: 'var(--color-danger)' }}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      {isLoggedIn && (
        <nav className="main-nav">
          <div className="nav-brand">
            <span className="brand-icon">💪</span>
            <span className="brand-text">GlowRep</span>
          </div>
          <div className="nav-links">
            <Link to="/master" className="nav-link">{t('nav.master')}</Link>
            <Link to="/nodal" className="nav-link">{t('nav.nodal')}</Link>
            <Link to="/admin" className="nav-link">Dashboard</Link>
            <Link to="/admin/members" className="nav-link">Members</Link>
          </div>
        </nav>
      )}

      {/* Role-based routing */}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/master/*" element={<ProtectedRoute><MasterDashboard /></ProtectedRoute>} />
          <Route path="/nodal/*" element={<ProtectedRoute><NodalDashboard /></ProtectedRoute>} />
          <Route path="/admin/members" element={<ProtectedRoute><MembersManagement /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
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
