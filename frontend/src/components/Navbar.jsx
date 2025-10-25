import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>▌▌▌</span>
          WellBeing
        </Link>
        
        <ul style={styles.menu}>
          {isAuthenticated ? (
            <>
              <li><Link to="/" style={styles.link}>Home</Link></li>
              <li><Link to="/challenges" style={styles.link}>Challenges</Link></li>
              <li><Link to="/my-challenges" style={styles.link}>🎯 My Progress</Link></li>
              <li><Link to="/wellness-feed" style={styles.link}>📰 Wellness Feed</Link></li>
              <li><Link to="/mini-games" style={styles.link}>Mini-Games</Link></li>
              <li><Link to="/moji" style={styles.link}>😊 Moji AI</Link></li>
              <li><Link to="/friends" style={styles.link}>👥 Friends</Link></li>
              <li><Link to="/chat" style={styles.link}>💬 Chat</Link></li>
              <li><Link to={`/profile/${user?._id}`} style={styles.link}>Profile</Link></li>
              <li><button onClick={handleLogout} style={styles.logoutBtn}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/" style={styles.link}>Home</Link></li>
              <li><Link to="/challenges" style={styles.link}>Challenges</Link></li>
              <li><Link to="/login" style={styles.loginBtn}>Login</Link></li>
              <li><Link to="/register" style={styles.registerBtn}>Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    padding: '16px 40px'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#000',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logoIcon: {
    color: '#5B72EE',
    fontSize: '1.2rem'
  },
  menu: {
    display: 'flex',
    listStyle: 'none',
    gap: '32px',
    alignItems: 'center',
    margin: 0,
    padding: 0
  },
  link: {
    color: '#666',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'color 0.2s'
  },
  loginBtn: {
    color: '#000',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '8px 20px',
    borderRadius: '8px',
    transition: 'background 0.2s'
  },
  registerBtn: {
    background: '#000',
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    padding: '10px 24px',
    borderRadius: '8px',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  logoutBtn: {
    background: '#f0f0f0',
    color: '#000',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};

export default Navbar;
