import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trees, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { loginUser } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      if (data.success) {
        localStorage.setItem('urban_auth_token', data.token || 'demo-token');
        localStorage.setItem('urban_user', JSON.stringify(data.user || { email }));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      // Graceful fallback for demo if backend isn't reachable or on error
      if (email === 'admin@gmail.com' && password === 'admin123') {
        localStorage.setItem('urban_auth_token', 'demo-token');
        localStorage.setItem('urban_user', JSON.stringify({ email, role: 'Administrator' }));
        navigate('/dashboard');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <Trees size={32} />
          </div>
          <h1>Urban Heat Monitoring</h1>
          <p>Cooling Platform & Environmental Dashboard</p>
        </div>

        <div className="demo-credentials-box">
          <strong>Demo Login Credentials:</strong>
          <div>Email: <code>admin@gmail.com</code></div>
          <div>Password: <code>admin123</code></div>
          <button
            type="button"
            onClick={fillDemo}
            style={{
              marginTop: '6px',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '3px 8px',
              fontSize: '0.72rem',
              cursor: 'pointer',
            }}
          >
            Auto-fill Credentials
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-control"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
