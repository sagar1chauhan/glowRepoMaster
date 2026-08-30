import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'MASTER_ADMIN' | 'NODAL_MANAGER' | 'GYM_ADMIN' | ''>('');

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('glowrep_token');
    const userStr = localStorage.getItem('glowrep_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'MASTER_ADMIN') navigate('/master', { replace: true });
        else if (user.role === 'NODAL_MANAGER') navigate('/nodal', { replace: true });
        else navigate('/admin', { replace: true });
      } catch {
        // ignore json parse error
      }
    }
  }, [navigate]);

  const handleRolePreset = (role: 'MASTER_ADMIN' | 'NODAL_MANAGER' | 'GYM_ADMIN') => {
    setSelectedRole(role);
    setError('');
    if (role === 'MASTER_ADMIN') {
      setEmail('master@glowrep.com');
      setPassword('master123');
    } else if (role === 'NODAL_MANAGER') {
      setEmail('nodal@glowrep.com');
      setPassword('nodal123');
    } else if (role === 'GYM_ADMIN') {
      setEmail('admin@glowrep.com');
      setPassword('admin123');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, pass: password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('glowrep_token', access_token);
      localStorage.setItem('glowrep_user', JSON.stringify(user));

      // Redirect directly to their respective role dashboard
      if (user.role === 'MASTER_ADMIN') {
        navigate('/master');
      } else if (user.role === 'NODAL_MANAGER') {
        navigate('/nodal');
      } else {
        navigate('/admin');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: '20px'
    }}>
      <div className="stat-card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>💪</div>
          <h2 className="section-header" style={{ justifyContent: 'center', margin: 0 }}>
            GlowRep Master Panel
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '6px' }}>
            Unified Login for Master HQ, Nodal Managers & Branch Admins
          </p>
        </div>

        {/* Quick Role Selection Preset Badges */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
            Quick Demo Select:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleRolePreset('MASTER_ADMIN')}
              className="btn btn-secondary"
              style={{
                padding: '8px 4px',
                fontSize: '11px',
                justifyContent: 'center',
                borderColor: selectedRole === 'MASTER_ADMIN' ? 'var(--color-primary)' : 'var(--color-border)',
                background: selectedRole === 'MASTER_ADMIN' ? 'rgba(108, 92, 231, 0.2)' : undefined,
              }}
            >
              🏢 Master HQ
            </button>
            <button
              type="button"
              onClick={() => handleRolePreset('NODAL_MANAGER')}
              className="btn btn-secondary"
              style={{
                padding: '8px 4px',
                fontSize: '11px',
                justifyContent: 'center',
                borderColor: selectedRole === 'NODAL_MANAGER' ? 'var(--color-accent)' : 'var(--color-border)',
                background: selectedRole === 'NODAL_MANAGER' ? 'rgba(0, 210, 255, 0.2)' : undefined,
              }}
            >
              🌍 Nodal Mgr
            </button>
            <button
              type="button"
              onClick={() => handleRolePreset('GYM_ADMIN')}
              className="btn btn-secondary"
              style={{
                padding: '8px 4px',
                fontSize: '11px',
                justifyContent: 'center',
                borderColor: selectedRole === 'GYM_ADMIN' ? 'var(--color-success)' : 'var(--color-border)',
                background: selectedRole === 'GYM_ADMIN' ? 'rgba(0, 230, 118, 0.2)' : undefined,
              }}
            >
              🏋️ Gym Admin
            </button>
          </div>
        </div>
        
        {error && (
          <div style={{ 
            color: 'var(--color-danger)', 
            background: 'rgba(255, 82, 82, 0.1)', 
            border: '1px solid rgba(255, 82, 82, 0.3)',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '16px', 
            fontSize: '13px', 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSelectedRole('');
              }}
              placeholder="e.g. master@glowrep.com"
              className="form-input"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

