import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useI18n } from '../../hooks/useI18n';

const Login: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, pass: password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('glowrep_token', access_token);
      localStorage.setItem('glowrep_user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'MASTER_ADMIN') navigate('/master');
      else if (user.role === 'NODAL_MANAGER') navigate('/nodal');
      else navigate('/admin');

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
      minHeight: '80vh'
    }}>
      <div className="stat-card" style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
        <h2 className="section-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
          💪 GlowRep Login
        </h2>
        
        {error && (
          <div style={{ color: 'var(--color-warning)', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@glowrep.com"
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', 
                border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', 
                color: 'white'
              }}
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
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', 
                border: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)', 
                color: 'white'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
