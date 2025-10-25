import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <p style={styles.badge}>Introducing WellBeing AI v2.0</p>
            <h1 style={styles.title}>
              <span style={styles.titleAccent}>Transform</span>
              <br />your wellness
              <br />journey
            </h1>
            <p style={styles.subtitle}>
              AI-powered challenges, gamification, and personalized coaching to help you grow beyond your comfort zone
            </p>
            <div style={styles.ctaButtons}>
              {!isAuthenticated ? (
                <>
                  <Link to="/register" style={styles.primaryBtn}>
                    Try it free
                  </Link>
                  <Link to="/challenges" style={styles.secondaryBtn}>
                    <span style={styles.playIcon}>▶</span> Explore challenges
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/challenges" style={styles.primaryBtn}>
                    Browse Challenges
                  </Link>
                  <Link to="/mini-games" style={styles.secondaryBtn}>
                    <span style={styles.playIcon}>🎮</span> Play Mini-Games
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div style={styles.heroRight}>
            <div style={styles.floatingCard1}>
              <div style={styles.cardHeader}>Active Streak</div>
              <div style={styles.statLarge}>🔥 7 Days</div>
              <div style={styles.cardSubtext}>Keep it going!</div>
            </div>
            <div style={styles.floatingCard2}>
              <div style={styles.levelBadge}>
                <div style={styles.levelIcon}>🏆</div>
                <div style={styles.levelNumber}>Level 5</div>
              </div>
              <div style={styles.cardLabel}>Wellness Level</div>
            </div>
            <div style={styles.floatingCard3}>
              <div style={styles.barChart}>
                <div style={{...styles.bar, height: '60%'}}></div>
                <div style={{...styles.bar, height: '85%'}}></div>
                <div style={{...styles.bar, height: '70%'}}></div>
              </div>
              <div style={styles.cardValue}>
                <span style={styles.cardValueNumber}>12</span>
                <span style={styles.cardValueLabel}> challenges completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Powerful Features for Your Growth</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>AI-Powered Challenges</h3>
            <p style={styles.featureDesc}>Personalized challenges that adapt to your comfort zone level and push you to grow</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Real-time Analytics</h3>
            <p style={styles.featureDesc}>Track your progress with detailed insights, streaks, and achievement metrics</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🤖</div>
            <h3 style={styles.featureTitle}>AI Chatbot Coach</h3>
            <p style={styles.featureDesc}>24/7 AI assistant powered by Gemini for motivation and guidance</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎮</div>
            <h3 style={styles.featureTitle}>Interactive Games</h3>
            <p style={styles.featureDesc}>Engage with wellness through fun mini-games and earn points</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🏆</div>
            <h3 style={styles.featureTitle}>Gamification</h3>
            <p style={styles.featureDesc}>Earn points, unlock badges, and level up as you complete challenges</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👥</div>
            <h3 style={styles.featureTitle}>Social Support</h3>
            <p style={styles.featureDesc}>Connect with peers and certified coaches for community support</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    background: '#F5F5F7',
    minHeight: '100vh',
    color: '#000'
  },
  hero: {
    padding: '80px 40px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center'
  },
  heroLeft: {
    zIndex: 1
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #E0C3FC 0%, #D4A5FF 100%)',
    color: '#7C4DFF',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    marginBottom: '24px',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  title: {
    fontSize: '4.5rem',
    fontWeight: 'bold',
    lineHeight: '1.1',
    marginBottom: '24px',
    letterSpacing: '-0.02em'
  },
  titleAccent: {
    color: '#000'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    lineHeight: '1.8',
    marginBottom: '40px',
    maxWidth: '500px'
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  primaryBtn: {
    background: '#5B72EE',
    color: 'white',
    padding: '16px 40px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'transform 0.2s',
    display: 'inline-block',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(91, 114, 238, 0.3)'
  },
  secondaryBtn: {
    background: 'transparent',
    color: '#000',
    padding: '16px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    border: '2px solid #e0e0e0',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  playIcon: {
    fontSize: '0.8rem'
  },
  heroRight: {
    position: 'relative',
    height: '500px'
  },
  floatingCard1: {
    position: 'absolute',
    top: '20px',
    right: '80px',
    background: 'linear-gradient(135deg, #FFD3E0 0%, #FFC0D9 100%)',
    padding: '24px',
    borderRadius: '24px',
    width: '200px',
    boxShadow: '0 20px 60px rgba(255, 192, 217, 0.4)'
  },
  floatingCard2: {
    position: 'absolute',
    top: '200px',
    right: '20px',
    background: 'linear-gradient(135deg, #A8E6CF 0%, #CAFFBF 100%)',
    padding: '20px',
    borderRadius: '24px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(168, 230, 207, 0.4)'
  },
  floatingCard3: {
    position: 'absolute',
    bottom: '80px',
    right: '120px',
    background: 'linear-gradient(135deg, #A2D2FF 0%, #BDB2FF 100%)',
    padding: '20px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(162, 210, 255, 0.4)'
  },
  cardHeader: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '12px'
  },
  statLarge: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#FF6B35'
  },
  cardSubtext: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '600'
  },
  levelBadge: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
    boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)',
    border: '4px solid white'
  },
  levelIcon: {
    fontSize: '2rem',
    marginBottom: '4px'
  },
  levelNumber: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },
  cardLabel: {
    fontSize: '0.85rem',
    color: '#666'
  },
  barChart: {
    display: 'flex',
    gap: '8px',
    height: '60px',
    alignItems: 'flex-end',
    marginBottom: '12px'
  },
  bar: {
    width: '20px',
    background: '#5B72EE',
    borderRadius: '4px 4px 0 0'
  },
  cardValue: {
    fontSize: '0.9rem',
    color: '#666',
    textAlign: 'center'
  },
  cardValueNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#5B72EE',
    display: 'block',
    marginBottom: '4px'
  },
  cardValueLabel: {
    fontSize: '0.85rem'
  },
  features: {
    padding: '80px 40px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  featuresTitle: {
    fontSize: '3rem',
    textAlign: 'center',
    marginBottom: '60px',
    fontWeight: 'bold'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '32px'
  },
  featureCard: {
    background: 'white',
    padding: '32px',
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '20px'
  },
  featureTitle: {
    fontSize: '1.5rem',
    marginBottom: '12px',
    fontWeight: '700',
    color: '#000'
  },
  featureDesc: {
    color: '#666',
    lineHeight: '1.6',
    fontSize: '1rem'
  }
};

// Add hover effects
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
  `;
  if (!document.querySelector('style[data-feature-cards]')) {
    style.setAttribute('data-feature-cards', 'true');
    document.head.appendChild(style);
  }
}

export default Home;
