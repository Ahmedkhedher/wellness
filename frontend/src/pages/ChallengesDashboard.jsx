import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { challengeAPI, progressAPI, aiAPI } from '../services/api';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

const ChallengesDashboard = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const categories = ['all', 'social', 'fitness', 'mindfulness', 'creativity', 'learning', 'adventure'];

  useEffect(() => {
    loadChallenges();
  }, [filter]);

  const loadChallenges = async () => {
    setLoading(true);
    // Always show sample challenges for demo
    setSampleChallenges();
    setLoading(false);
    
    // Optionally try to load from API
    /*try {
      const data = await challengeAPI.getAllChallenges(
        filter !== 'all' ? { category: filter } : {}
      );
      if (data && data.length > 0) {
        setChallenges(data);
      }
    } catch (error) {
      console.error('Error loading challenges:', error);
    }*/
  };

  const setSampleChallenges = () => {
    setChallenges([
      {
        _id: '1',
        title: 'Morning Meditation Master',
        description: 'Start your day with 10 minutes of mindfulness meditation',
        category: 'mindfulness',
        difficulty: 'easy',
        pointsReward: 20,
        estimatedDuration: { value: 10, unit: 'minutes' },
        color: '#FF6B6B',
        icon: '🧘'
      },
      {
        _id: '2',
        title: 'Social Butterfly',
        description: 'Reach out to 3 friends you haven\'t talked to recently',
        category: 'social',
        difficulty: 'easy',
        pointsReward: 30,
        estimatedDuration: { value: 30, unit: 'minutes' },
        color: '#4ECDC4',
        icon: '💬'
      },
      {
        _id: '3',
        title: 'Fitness Challenge',
        description: 'Complete a 30-minute workout routine',
        category: 'fitness',
        difficulty: 'medium',
        pointsReward: 50,
        estimatedDuration: { value: 30, unit: 'minutes' },
        color: '#95E1D3',
        icon: '💪'
      },
      {
        _id: '4',
        title: 'Brain Boost',
        description: 'Learn a new skill for 20 minutes',
        category: 'learning',
        difficulty: 'medium',
        pointsReward: 40,
        estimatedDuration: { value: 20, unit: 'minutes' },
        color: '#A8E6CF',
        icon: '📚'
      },
      {
        _id: '5',
        title: 'Creative Flow',
        description: 'Express yourself through art, writing, or music',
        category: 'creativity',
        difficulty: 'easy',
        pointsReward: 35,
        estimatedDuration: { value: 15, unit: 'minutes' },
        color: '#FFD3B6',
        icon: '🎨'
      },
      {
        _id: '6',
        title: 'Nature Explorer',
        description: 'Take a mindful walk in nature',
        category: 'adventure',
        difficulty: 'medium',
        pointsReward: 45,
        estimatedDuration: { value: 45, unit: 'minutes' },
        color: '#FFAAA5',
        icon: '🌿'
      },
      {
        _id: '7',
        title: 'Gratitude Journal',
        description: 'Write down 5 things you\'re grateful for',
        category: 'mindfulness',
        difficulty: 'easy',
        pointsReward: 25,
        estimatedDuration: { value: 10, unit: 'minutes' },
        color: '#FF8B94',
        icon: '📝'
      },
      {
        _id: '8',
        title: 'Digital Detox Hour',
        description: 'Spend 1 hour away from all screens',
        category: 'mindfulness',
        difficulty: 'hard',
        pointsReward: 60,
        estimatedDuration: { value: 60, unit: 'minutes' },
        color: '#A2D2FF',
        icon: '📵'
      },
      {
        _id: '9',
        title: 'Healthy Chef',
        description: 'Cook a nutritious meal from scratch',
        category: 'fitness',
        difficulty: 'medium',
        pointsReward: 45,
        estimatedDuration: { value: 40, unit: 'minutes' },
        color: '#BDB2FF',
        icon: '🍳'
      },
      {
        _id: '10',
        title: 'Random Act of Kindness',
        description: 'Do something nice for a stranger',
        category: 'social',
        difficulty: 'easy',
        pointsReward: 35,
        estimatedDuration: { value: 15, unit: 'minutes' },
        color: '#FFC6FF',
        icon: '💝'
      },
      {
        _id: '11',
        title: 'Power Nap',
        description: 'Take a 20-minute power nap to recharge',
        category: 'mindfulness',
        difficulty: 'easy',
        pointsReward: 15,
        estimatedDuration: { value: 20, unit: 'minutes' },
        color: '#CAFFBF',
        icon: '😴'
      },
      {
        _id: '12',
        title: 'Sunrise/Sunset Watch',
        description: 'Watch the sunrise or sunset mindfully',
        category: 'adventure',
        difficulty: 'easy',
        pointsReward: 30,
        estimatedDuration: { value: 30, unit: 'minutes' },
        color: '#FDFFB6',
        icon: '🌅'
      }
    ]);
  };

  const startChallenge = async (challengeId) => {
    if (!user) {
      setToast({ message: 'Please login to start challenges', type: 'warning' });
      return;
    }
    
    const challenge = challenges.find(c => c._id === challengeId);
    if (!challenge) return;
    
    // Get existing challenges from localStorage
    const existingChallenges = JSON.parse(localStorage.getItem('myChallenges') || '[]');
    
    // Check if already added
    if (existingChallenges.find(c => c.id === challengeId)) {
      setToast({ message: 'You\'ve already added this challenge!', type: 'info' });
      return;
    }
    
    // Create new challenge entry
    const newChallenge = {
      id: challengeId,
      title: challenge.title,
      category: challenge.category.charAt(0).toUpperCase() + challenge.category.slice(1),
      icon: challenge.icon,
      progress: 0,
      daysCompleted: 0,
      totalDays: 21, // Default 21-day challenge
      status: 'active',
      difficulty: challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1),
      points: challenge.pointsReward,
      description: challenge.description,
      streak: 0,
      startDate: new Date().toISOString()
    };
    
    // Save to localStorage
    const updatedChallenges = [...existingChallenges, newChallenge];
    localStorage.setItem('myChallenges', JSON.stringify(updatedChallenges));
    
    setToast({ message: 'Challenge added! Check "My Progress" to track it.', type: 'celebration' });
    
    // Also try to save to API
    try {
      await progressAPI.startChallenge(user._id, challengeId);
    } catch (error) {
      console.error('API Error (challenge still saved locally):', error);
    }
  };

  const generateAIChallenge = async () => {
    if (!user) {
      setToast({ message: 'Please login to generate AI challenges', type: 'warning' });
      return;
    }
    try {
      setLoading(true);
      const challenge = await aiAPI.generateChallenge(user._id, { category: filter !== 'all' ? filter : null });
      setChallenges(prev => [challenge, ...prev]);
      setToast({ message: 'AI-generated challenge created!', type: 'success' });
    } catch (error) {
      console.error('Error generating challenge:', error);
      setToast({ message: 'Feature coming soon! Try the existing challenges.', type: 'info' });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      social: '🤝',
      fitness: '💪',
      mindfulness: '🧘',
      creativity: '🎨',
      learning: '📚',
      adventure: '🗺️'
    };
    return emojis[category] || '🎯';
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
      <div style={styles.header}>
        <span style={styles.badge}>SO BRAINY</span>
        <h1 style={styles.title}>Hassle free<br/>wellness<br/>tracking.</h1>
        <p style={styles.subtitle}>Complete challenges and export your progress into any format you need.</p>

        <div style={styles.actions}>
          <button onClick={generateAIChallenge} style={styles.downloadBtn}>
            Start Now
          </button>
        </div>
      </div>

      <div style={styles.filters}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              ...styles.filterButton,
              ...(filter === cat ? styles.filterButtonActive : {})
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.loading}>Loading challenges...</div>
      ) : (
        <div style={styles.grid}>
          {challenges.map(challenge => (
            <div 
              key={challenge._id} 
              style={{
                ...styles.card,
                background: `linear-gradient(135deg, ${challenge.color}22 0%, ${challenge.color}11 100%)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
              }}
            >
              <div style={styles.cardHeader}>
                <span style={styles.emoji}>{challenge.icon || getCategoryEmoji(challenge.category)}</span>
              </div>
              <h3 style={styles.cardTitle}>{challenge.title}</h3>
              <p style={styles.cardDescription}>{challenge.description}</p>
              <div style={styles.cardMeta}>
                <span style={{...styles.metaItem, color: challenge.color}}>
                  ⏱️ {challenge.estimatedDuration?.value} {challenge.estimatedDuration?.unit}
                </span>
                <span style={{...styles.metaItem, color: challenge.color}}>
                  🏆 {challenge.pointsReward} pts
                </span>
              </div>
              <button
                onClick={() => startChallenge(challenge._id)}
                style={{
                  ...styles.startButton,
                  background: challenge.color
                }}
              >
                Start Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: '#F5F5F7',
    minHeight: '100vh',
    padding: '40px 20px'
  },
  header: {
    maxWidth: '500px',
    marginBottom: '60px',
    paddingLeft: '40px'
  },
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #E0C3FC 0%, #D4A5FF 100%)',
    color: '#7C4DFF',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '1px',
    marginBottom: '24px'
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
    lineHeight: '1.1',
    marginBottom: '20px',
    color: '#000'
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '32px'
  },
  actions: {
    marginBottom: '60px'
  },
  downloadBtn: {
    background: '#5B72EE',
    color: 'white',
    border: 'none',
    padding: '16px 40px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 8px 24px rgba(91, 114, 238, 0.3)',
    transition: 'transform 0.2s'
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  filterButton: {
    padding: '8px 16px',
    border: '2px solid #ddd',
    borderRadius: '20px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  },
  filterButtonActive: {
    borderColor: '#667eea',
    background: '#667eea',
    color: 'white'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
    padding: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 40px'
  },
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  cardHeader: {
    marginBottom: '20px'
  },
  emoji: {
    fontSize: '4rem',
    marginBottom: '16px',
    display: 'block'
  },
  difficulty: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '12px',
    color: '#000',
    fontWeight: '700'
  },
  cardDescription: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '20px',
    fontSize: '1rem'
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    fontSize: '0.95rem'
  },
  metaItem: {
    fontWeight: '600'
  },
  startButton: {
    width: '100%',
    padding: '14px',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s'
  },
};

export default ChallengesDashboard;
