import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

const MyChallenges = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('active'); // active, completed, all
  const [challenges, setChallenges] = useState([]);
  const [toast, setToast] = useState(null);

  // Load challenges from localStorage
  useEffect(() => {
    const loadChallenges = () => {
      const stored = localStorage.getItem('myChallenges');
      if (stored) {
        setChallenges(JSON.parse(stored));
      } else {
        // Sample data for demo
        setChallenges(sampleChallenges);
      }
    };
    loadChallenges();
  }, []);

  const sampleChallenges = [
    {
      id: 1,
      title: 'Morning Meditation Practice',
      category: 'Mental Health',
      icon: '🧘‍♀️',
      progress: 65,
      daysCompleted: 13,
      totalDays: 21,
      status: 'active',
      difficulty: 'Medium',
      points: 150,
      description: 'Meditate for 10 minutes every morning',
      streak: 5
    },
    {
      id: 2,
      title: 'Daily Gratitude Journal',
      category: 'Mental Health',
      icon: '📝',
      progress: 90,
      daysCompleted: 27,
      totalDays: 30,
      status: 'active',
      difficulty: 'Easy',
      points: 100,
      description: 'Write 3 things you\'re grateful for',
      streak: 12
    },
    {
      id: 3,
      title: 'Social Connection Challenge',
      category: 'Social Skills',
      icon: '👥',
      progress: 40,
      daysCompleted: 4,
      totalDays: 10,
      status: 'active',
      difficulty: 'Hard',
      points: 200,
      description: 'Have a meaningful conversation with someone new',
      streak: 2
    },
    {
      id: 4,
      title: '10,000 Steps Daily',
      category: 'Physical Fitness',
      icon: '👟',
      progress: 100,
      daysCompleted: 14,
      totalDays: 14,
      status: 'completed',
      difficulty: 'Medium',
      points: 180,
      description: 'Walk at least 10,000 steps every day',
      streak: 14
    },
    {
      id: 5,
      title: 'Learn Something New',
      category: 'Learning',
      icon: '📚',
      progress: 55,
      daysCompleted: 11,
      totalDays: 20,
      status: 'active',
      difficulty: 'Medium',
      points: 160,
      description: 'Spend 30 minutes learning a new skill',
      streak: 7
    }
  ];

  const stats = {
    active: challenges.filter(c => c.status === 'active').length,
    completed: challenges.filter(c => c.status === 'completed').length,
    totalPoints: challenges.reduce((sum, c) => sum + (c.progress === 100 ? c.points : 0), 0),
    longestStreak: Math.max(...challenges.map(c => c.streak))
  };

  const handleCheckIn = (challengeId) => {
    const updatedChallenges = challenges.map(c => {
      if (c.id === challengeId && c.status === 'active') {
        const newDaysCompleted = c.daysCompleted + 1;
        const newProgress = Math.round((newDaysCompleted / c.totalDays) * 100);
        const newStreak = c.streak + 1;
        const newStatus = newDaysCompleted >= c.totalDays ? 'completed' : 'active';
        
        return {
          ...c,
          daysCompleted: newDaysCompleted,
          progress: newProgress,
          streak: newStreak,
          status: newStatus
        };
      }
      return c;
    });
    
    setChallenges(updatedChallenges);
    localStorage.setItem('myChallenges', JSON.stringify(updatedChallenges));
    
    // Track days active
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem('lastActiveDate');
    if (lastActive !== today) {
      const daysActive = parseInt(localStorage.getItem('daysActive') || '0') + 1;
      localStorage.setItem('daysActive', daysActive.toString());
      localStorage.setItem('lastActiveDate', today);
    }
    
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && challenge.daysCompleted + 1 >= challenge.totalDays) {
      setToast({ message: 'Congratulations! You completed the challenge!', type: 'celebration' });
    } else {
      setToast({ message: `Great job! Keep up the streak! 🔥 Day ${challenge.daysCompleted + 1}`, type: 'success' });
    }
  };

  const filteredChallenges = challenges.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <div style={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Challenges</h1>
            <p style={styles.subtitle}>Track your progress and stay motivated</p>
          </div>
          <Link to="/challenges" style={styles.addButton}>
            <span style={styles.addIcon}>+</span> Browse More
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎯</div>
            <div style={styles.statValue}>{stats.active}</div>
            <div style={styles.statLabel}>Active Challenges</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statValue}>{stats.completed}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div style={styles.statValue}>{stats.totalPoints}</div>
            <div style={styles.statLabel}>Points Earned</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔥</div>
            <div style={styles.statValue}>{stats.longestStreak}</div>
            <div style={styles.statLabel}>Longest Streak</div>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            style={{
              ...styles.filterBtn,
              ...(filter === 'all' ? styles.filterBtnActive : {})
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            style={{
              ...styles.filterBtn,
              ...(filter === 'active' ? styles.filterBtnActive : {})
            }}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter('completed')}
            style={{
              ...styles.filterBtn,
              ...(filter === 'completed' ? styles.filterBtnActive : {})
            }}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* Challenges List */}
        <div style={styles.challengesList}>
          {filteredChallenges.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📋</div>
              <h3>No challenges yet</h3>
              <p>Start your wellness journey by browsing available challenges</p>
              <Link to="/challenges" style={styles.browseButton}>
                Browse Challenges
              </Link>
            </div>
          ) : (
            filteredChallenges.map(challenge => (
              <div key={challenge.id} style={styles.challengeCard}>
                <div style={styles.challengeHeader}>
                  <div style={styles.challengeLeft}>
                    <div style={styles.challengeIcon}>{challenge.icon}</div>
                    <div>
                      <h3 style={styles.challengeTitle}>{challenge.title}</h3>
                      <div style={styles.challengeMeta}>
                        <span style={styles.category}>{challenge.category}</span>
                        <span style={{
                          ...styles.difficulty,
                          color: getDifficultyColor(challenge.difficulty)
                        }}>
                          {challenge.difficulty}
                        </span>
                        <span style={styles.points}>+{challenge.points} pts</span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.streakBadge}>
                    <span style={styles.streakIcon}>🔥</span>
                    <span style={styles.streakNumber}>{challenge.streak}</span>
                  </div>
                </div>

                <p style={styles.challengeDesc}>{challenge.description}</p>

                {/* Progress Bar */}
                <div style={styles.progressSection}>
                  <div style={styles.progressInfo}>
                    <span style={styles.progressLabel}>
                      {challenge.daysCompleted} / {challenge.totalDays} days
                    </span>
                    <span style={styles.progressPercent}>{challenge.progress}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${challenge.progress}%`
                    }} />
                  </div>
                </div>

                {/* Actions */}
                <div style={styles.challengeActions}>
                  {challenge.status === 'active' ? (
                    <>
                      <button 
                        onClick={() => handleCheckIn(challenge.id)}
                        style={styles.checkInButton}
                      >
                        ✓ Check In Today
                      </button>
                      <Link to={`/challenges/${challenge.id}`} style={styles.viewButton}>
                        View Details
                      </Link>
                    </>
                  ) : (
                    <div style={styles.completedBadge}>
                      <span style={styles.completedIcon}>🏆</span>
                      Completed!
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#F5F5F7',
    minHeight: '100vh',
    paddingTop: '80px',
    paddingBottom: '40px'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: 0,
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: 0
  },
  addButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '14px 28px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'transform 0.2s'
  },
  addIcon: {
    fontSize: '1.5rem',
    lineHeight: 1
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '12px'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#666'
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    background: 'white',
    border: '2px solid #E5E5E7',
    color: '#666',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filterBtnActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '2px solid transparent'
  },
  challengesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  challengeCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  challengeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  challengeLeft: {
    display: 'flex',
    gap: '16px',
    flex: 1
  },
  challengeIcon: {
    fontSize: '3rem',
    lineHeight: 1
  },
  challengeTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: '0 0 8px 0'
  },
  challengeMeta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  category: {
    fontSize: '0.85rem',
    color: '#667eea',
    fontWeight: '600'
  },
  difficulty: {
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  points: {
    fontSize: '0.85rem',
    color: '#FF6B35',
    fontWeight: '600'
  },
  streakBadge: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    padding: '8px 16px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
  },
  streakIcon: {
    fontSize: '1.2rem'
  },
  streakNumber: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'white'
  },
  challengeDesc: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  progressSection: {
    marginBottom: '20px'
  },
  progressInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  progressLabel: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '600'
  },
  progressPercent: {
    fontSize: '0.9rem',
    color: '#667eea',
    fontWeight: 'bold'
  },
  progressBar: {
    width: '100%',
    height: '10px',
    background: '#E5E5E7',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '5px',
    transition: 'width 0.3s ease'
  },
  challengeActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  checkInButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
  },
  viewButton: {
    background: 'transparent',
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.2s'
  },
  completedBadge: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  completedIcon: {
    fontSize: '1.2rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px'
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '20px'
  },
  browseButton: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    marginTop: '16px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  }
};

export default MyChallenges;
