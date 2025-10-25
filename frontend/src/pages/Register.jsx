import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    age: '',
    university: '',
    major: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      navigate('/challenges');
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        <div style={styles.brandSection}>
          <h1 style={styles.brandTitle}>🌱 WellBeing</h1>
          <p style={styles.brandTagline}>Transform your life, one challenge at a time</p>
        </div>
        
        <div style={styles.benefits}>
          <h3 style={styles.benefitsTitle}>Why join us?</h3>
          <div style={styles.benefit}>
            <span style={styles.checkmark}>✔️</span>
            <span>Personalized wellness challenges</span>
          </div>
          <div style={styles.benefit}>
            <span style={styles.checkmark}>✔️</span>
            <span>Track your progress with AI insights</span>
          </div>
          <div style={styles.benefit}>
            <span style={styles.checkmark}>✔️</span>
            <span>Connect with supportive community</span>
          </div>
          <div style={styles.benefit}>
            <span style={styles.checkmark}>✔️</span>
            <span>Earn badges and achievements</span>
          </div>
          <div style={styles.benefit}>
            <span style={styles.checkmark}>✔️</span>
            <span>Chat with Moji AI wellness coach</span>
          </div>
          <div style={styles.benefit}>
            <span style={styles.checkmark}>✔️</span>
            <span>100% free, forever</span>
          </div>
        </div>
        
        <div style={styles.testimonial}>
          <div style={styles.quote}>"💬</div>
          <p style={styles.testimonialText}>
            "This app changed my life! I've completed 15 challenges and feel more confident than ever."
          </p>
          <div style={styles.testimonialAuthor}>
            <strong>Sarah M.</strong> - Computer Science Student
          </div>
        </div>
      </div>
      
      <div style={styles.rightSide}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Start Your Journey 🚀</h2>
            <p style={styles.formSubtitle}>Create your free account in seconds</p>
          </div>
          
          {error && <div style={styles.errorMessage}>⚠️ {error}</div>}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>👤</span>
                  First Name
                </label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange}
                  placeholder="John"
                  style={styles.input}
                  required 
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>👤</span>
                  Last Name
                </label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange}
                  placeholder="Doe"
                  style={styles.input}
                  required 
                />
              </div>
            </div>
            
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
                placeholder="john@university.edu"
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
                placeholder="Min. 6 characters"
                style={styles.input}
                required 
                minLength="6" 
              />
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🎂</span>
                  Age
                </label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange}
                  placeholder="18"
                  style={styles.input}
                  min="13" 
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🏫</span>
                  University
                </label>
                <input 
                  type="text" 
                  name="university" 
                  value={formData.university} 
                  onChange={handleChange}
                  placeholder="Your University"
                  style={styles.input}
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>📚</span>
                Major
              </label>
              <input 
                type="text" 
                name="major" 
                value={formData.major} 
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                style={styles.input}
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
              {loading ? '🔄 Creating Account...' : '✨ Create Account'}
            </button>
          </form>
          
          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>
          
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account? {' '}
              <Link to="/login" style={styles.link}>Login here</Link>
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
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: 'white'
  },
  brandSection: {
    marginBottom: '40px'
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
  benefits: {
    marginBottom: '40px'
  },
  benefitsTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '24px',
    margin: 0
  },
  benefit: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    fontSize: '1.1rem'
  },
  checkmark: {
    fontSize: '1.3rem',
    flexShrink: 0
  },
  testimonial: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '24px',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)'
  },
  quote: {
    fontSize: '3rem',
    lineHeight: 1,
    marginBottom: '16px'
  },
  testimonialText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '16px',
    fontStyle: 'italic',
    margin: '0 0 16px 0'
  },
  testimonialAuthor: {
    fontSize: '0.95rem',
    opacity: 0.9
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    overflowY: 'auto'
  },
  formCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '48px',
    width: '100%',
    maxWidth: '600px',
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
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px'
  },
  labelIcon: {
    fontSize: '1.1rem'
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '1rem',
    border: '2px solid #E5E5E7',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 8px 24px rgba(255, 107, 53, 0.4)',
    marginTop: '8px'
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
    color: '#FF6B35',
    fontWeight: 'bold',
    textDecoration: 'none'
  }
};

export default Register;
