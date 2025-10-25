import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/challenges');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        <div style={styles.brandSection}>
          <h1 style={styles.brandTitle}>🌱 WellBeing</h1>
          <p style={styles.brandTagline}>Your journey to wellness starts here</p>
        </div>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🎯</div>
            <div>
              <h3 style={styles.featureTitle}>AI-Powered Challenges</h3>
              <p style={styles.featureDesc}>Personalized wellness goals that adapt to you</p>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📊</div>
            <div>
              <h3 style={styles.featureTitle}>Track Progress</h3>
              <p style={styles.featureDesc}>See your growth with detailed analytics</p>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>🤝</div>
            <div>
              <h3 style={styles.featureTitle}>Community Support</h3>
              <p style={styles.featureDesc}>Connect with others on the same journey</p>
            </div>
          </div>
        </div>
        
        <div style={styles.stats}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>10K+</div>
            <div style={styles.statLabel}>Active Users</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>50K+</div>
            <div style={styles.statLabel}>Challenges Completed</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>4.8⭐</div>
            <div style={styles.statLabel}>User Rating</div>
          </div>
        </div>
      </div>
      
      <div style={styles.rightSide}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome Back! 👋</h2>
            <p style={styles.formSubtitle}>Login to continue your wellness journey</p>
          </div>
          
          {error && <div style={styles.errorMessage}>⚠️ {error}</div>}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📧</span>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>🔒</span>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={styles.input}
                required
              />
            </div>
            
            <button 
              type="submit" 
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? '🔄 Logging in...' : '✨ Login'}
            </button>
          </form>
          
          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account? {' '}
              <Link to="/register" style={styles.link}>Create one now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh',
    background: '#F5F5F7'
  },
  leftSide: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: 'white'
  },
  brandSection: {
    marginBottom: '60px'
  },
  brandTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '16px',
    margin: 0
  },
  brandTagline: {
    fontSize: '1.3rem',
    opacity: 0.9,
    margin: 0
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    marginBottom: '60px'
  },
  feature: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start'
  },
  featureIcon: {
    fontSize: '2.5rem',
    flexShrink: 0
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    margin: 0
  },
  featureDesc: {
    fontSize: '1rem',
    opacity: 0.9,
    lineHeight: '1.5',
    margin: 0
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    paddingTop: '40px',
    borderTop: '1px solid rgba(255,255,255,0.2)'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.9
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  },
  formCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '48px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
  },
  formHeader: {
    marginBottom: '32px',
    textAlign: 'center'
  },
  formTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '8px',
    margin: 0
  },
  formSubtitle: {
    fontSize: '1rem',
    color: '#666',
    margin: 0
  },
  errorMessage: {
    background: '#FEE',
    color: '#C00',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.95rem',
    border: '1px solid #FCC'
  },
  form: {
    marginBottom: '24px'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px'
  },
  labelIcon: {
    fontSize: '1.2rem'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '1rem',
    border: '2px solid #E5E5E7',
    borderRadius: '12px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    textAlign: 'center'
  },
  dividerText: {
    padding: '0 16px',
    color: '#999',
    fontSize: '0.9rem',
    background: 'white',
    position: 'relative',
    zIndex: 1,
    margin: '0 auto'
  },
  footer: {
    textAlign: 'center'
  },
  footerText: {
    color: '#666',
    fontSize: '0.95rem',
    margin: 0
  },
  link: {
    color: '#667eea',
    fontWeight: 'bold',
    textDecoration: 'none'
  }
};

export default Login;
