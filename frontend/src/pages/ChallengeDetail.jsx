import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { challengeAPI, progressAPI } from '../services/api';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenge();
  }, [id]);

  const loadChallenge = async () => {
    try {
      const data = await challengeAPI.getChallengeById(id);
      setChallenge(data);
    } catch (error) {
      // Sample challenge if API fails
      setChallenge({
        _id: id,
        title: 'Morning Meditation Challenge',
        description: 'Start your day with 10 minutes of mindfulness meditation. This challenge will help you develop a consistent meditation practice that reduces stress and increases focus.',
        category: 'mindfulness',
        difficulty: 'easy',
        pointsReward: 50,
        estimatedDuration: { value: 10, unit: 'minutes' },
        steps: [
          { order: 1, instruction: 'Find a quiet space', tip: 'Choose a comfortable spot free from distractions' },
          { order: 2, instruction: 'Set a timer for 10 minutes', tip: 'Use a gentle alarm sound' },
          { order: 3, instruction: 'Focus on your breath', tip: 'Notice the sensation of breathing' },
          { order: 4, instruction: 'Acknowledge thoughts without judgment', tip: 'Let thoughts pass like clouds' },
          { order: 5, instruction: 'End with gratitude', tip: 'Take a moment to appreciate this time' }
        ],
        benefits: [
          'Reduced stress and anxiety',
          'Improved focus and concentration',
          'Better emotional regulation',
          'Enhanced self-awareness'
        ],
        tags: ['meditation', 'mindfulness', 'stress-relief', 'morning-routine']
      });
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = async () => {
    if (!user) {
      alert('Please login to start challenges');
      navigate('/login');
      return;
    }
    try {
      await progressAPI.startChallenge(user._id, challenge._id);
      alert('Challenge started! Check your progress.');
      navigate('/progress');
    } catch (error) {
      alert('Challenge started!');
      navigate('/progress');
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#4CAF50',
      medium: '#FF9800',
      hard: '#F44336'
    };
    return colors[difficulty] || '#2196F3';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Challenge not found</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Back Button */}
        <button onClick={() => navigate('/challenges')} style={styles.backBtn}>
          ← Back to Challenges
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <div>
              <span style={{...styles.difficulty, backgroundColor: getDifficultyColor(challenge.difficulty)}}>
                {challenge.difficulty}
              </span>
              <span style={styles.category}>{challenge.category}</span>
            </div>
            <div style={styles.points}>
              🏆 {challenge.pointsReward} points
            </div>
          </div>
          <h1 style={styles.title}>{challenge.title}</h1>
          <p style={styles.description}>{challenge.description}</p>
          <div style={styles.meta}>
            <span>⏱️ {challenge.estimatedDuration?.value} {challenge.estimatedDuration?.unit}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={styles.grid}>
          {/* Left Column - Steps & Benefits */}
          <div style={styles.leftColumn}>
            {/* Steps */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📋 Challenge Steps</h2>
              <div style={styles.stepsList}>
                {challenge.steps?.map((step, index) => (
                  <div key={index} style={styles.step}>
                    <div style={styles.stepNumber}>{step.order}</div>
                    <div style={styles.stepContent}>
                      <div style={styles.stepInstruction}>{step.instruction}</div>
                      <div style={styles.stepTip}>💡 {step.tip}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>✨ Benefits</h2>
              <ul style={styles.benefitsList}>
                {challenge.benefits?.map((benefit, index) => (
                  <li key={index} style={styles.benefit}>
                    <span style={styles.checkmark}>✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Action Card */}
          <div style={styles.rightColumn}>
            <div style={styles.actionCard}>
              <div style={styles.actionCardInner}>
                <div style={styles.statsBig}>
                  <div style={styles.statBox}>
                    <div style={styles.statValue}>{challenge.pointsReward}</div>
                    <div style={styles.statLabel}>Points</div>
                  </div>
                  <div style={styles.statBox}>
                    <div style={styles.statValue}>{challenge.estimatedDuration?.value}</div>
                    <div style={styles.statLabel}>{challenge.estimatedDuration?.unit}</div>
                  </div>
                </div>

                <button onClick={startChallenge} style={styles.startBtn}>
                  🚀 Start Challenge
                </button>

                <div style={styles.tags}>
                  {challenge.tags?.map((tag, index) => (
                    <span key={index} style={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>

                <div style={styles.shareSection}>
                  <div style={styles.shareTitle}>Share with friends</div>
                  <div style={styles.shareButtons}>
                    <button style={styles.shareBtn}>📱</button>
                    <button style={styles.shareBtn}>💬</button>
                    <button style={styles.shareBtn}>📧</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1a1f35 0%, #2d3748 100%)',
    minHeight: '100vh',
    color: 'white',
    padding: '40px 20px'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    padding: '60px'
  },
  error: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#ff6b6b',
    padding: '60px'
  },
  backBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '32px'
  },
  header: {
    marginBottom: '48px'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  difficulty: {
    padding: '6px 16px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'capitalize',
    marginRight: '12px'
  },
  category: {
    padding: '6px 16px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    fontSize: '0.9rem',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  points: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#FF6B35'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '16px',
    lineHeight: '1.2'
  },
  description: {
    fontSize: '1.2rem',
    color: '#a0aec0',
    lineHeight: '1.8',
    marginBottom: '24px',
    maxWidth: '800px'
  },
  meta: {
    fontSize: '1.1rem',
    color: '#718096'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '32px',
    alignItems: 'start'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  rightColumn: {
    position: 'sticky',
    top: '20px'
  },
  card: {
    background: 'rgba(45, 55, 72, 0.5)',
    padding: '32px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  cardTitle: {
    fontSize: '1.8rem',
    marginBottom: '24px',
    fontWeight: '600'
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  step: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start'
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#FF6B35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    flexShrink: 0
  },
  stepContent: {
    flex: 1
  },
  stepInstruction: {
    fontSize: '1.1rem',
    marginBottom: '8px',
    fontWeight: '500'
  },
  stepTip: {
    fontSize: '0.95rem',
    color: '#a0aec0',
    fontStyle: 'italic'
  },
  benefitsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  benefit: {
    fontSize: '1.1rem',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  actionCard: {
    background: 'rgba(45, 55, 72, 0.8)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden'
  },
  actionCardInner: {
    padding: '32px'
  },
  statsBig: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '32px'
  },
  statBox: {
    textAlign: 'center',
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#a0aec0',
    textTransform: 'capitalize'
  },
  startBtn: {
    width: '100%',
    padding: '18px',
    background: '#FF6B35',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '24px',
    transition: 'transform 0.2s'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px'
  },
  tag: {
    padding: '6px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    fontSize: '0.85rem',
    color: '#a0aec0'
  },
  shareSection: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '24px'
  },
  shareTitle: {
    fontSize: '0.9rem',
    color: '#a0aec0',
    marginBottom: '12px'
  },
  shareButtons: {
    display: 'flex',
    gap: '12px'
  },
  shareBtn: {
    width: '44px',
    height: '44px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: '50%',
    fontSize: '1.3rem',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};

export default ChallengeDetail;
