import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, progressAPI } from '../services/api';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    interests: [],
    wellbeingGoals: []
  });
  const [stats, setStats] = useState({
    challengesCompleted: 0,
    totalPoints: 0,
    currentStreak: 0,
    level: 1
  });
  const [earnedBadges, setEarnedBadges] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        interests: user.interests || [],
        wellbeingGoals: user.wellbeingGoals || []
      });
      
      // Load challenges from localStorage
      const myChallenges = JSON.parse(localStorage.getItem('myChallenges') || '[]');
      const completed = myChallenges.filter(c => c.status === 'completed').length;
      const maxStreak = Math.max(...myChallenges.map(c => c.streak || 0), 0);
      const totalPts = myChallenges.reduce((sum, c) => sum + (c.status === 'completed' ? c.points : 0), 0);
      const lvl = Math.floor(totalPts / 100) + 1;
      
      // Track total days active
      const daysActive = parseInt(localStorage.getItem('daysActive') || '1');
      
      setStats({
        challengesCompleted: completed,
        totalPoints: totalPts,
        currentStreak: maxStreak,
        level: lvl,
        daysActive: daysActive
      });
      
      // Check and award badges
      checkBadges(completed, maxStreak, myChallenges, daysActive, totalPts, lvl);
    }
  }, [user]);

  const checkBadges = (completed, streak, challenges, daysActive, points, level) => {
    const earned = [];
    
    // Badge 1: First Steps - Complete first challenge
    if (completed >= 1) earned.push('first_steps');
    
    // Badge 2: Week Warrior - 7 day streak
    if (streak >= 7) earned.push('week_warrior');
    
    // Badge 3: Challenge Champion - 5 challenges completed
    if (completed >= 5) earned.push('challenge_champion');
    
    // Badge 4: Fitness Pro - 3 fitness challenges
    const fitnessCount = challenges.filter(c => 
      c.category.toLowerCase().includes('fitness') && c.status === 'completed'
    ).length;
    if (fitnessCount >= 3) earned.push('fitness_pro');
    
    // Badge 5: Mindful Master - 5 mindfulness challenges
    const mindfulCount = challenges.filter(c => 
      c.category.toLowerCase().includes('mindfulness') && c.status === 'completed'
    ).length;
    if (mindfulCount >= 5) earned.push('mindful_master');
    
    // Badge 6: Social Butterfly - 3 social challenges
    const socialCount = challenges.filter(c => 
      c.category.toLowerCase().includes('social') && c.status === 'completed'
    ).length;
    if (socialCount >= 3) earned.push('social_butterfly');
    
    // Badge 7: Early Bird - Used app for 3 days
    if (daysActive >= 3) earned.push('early_bird');
    
    // Badge 8: Dedicated - Used app for 30 days
    if (daysActive >= 30) earned.push('dedicated');
    
    // Badge 9: Point Master - 500 points
    if (points >= 500) earned.push('point_master');
    
    // Badge 10: Level 10 - Reach level 10
    if (level >= 10) earned.push('level_10');
    
    // Badge 11: Streak Master - 30 day streak
    if (streak >= 30) earned.push('streak_master');
    
    // Badge 12: Completionist - 10 challenges completed
    if (completed >= 10) earned.push('completionist');
    
    setEarnedBadges(earned);
    localStorage.setItem('earnedBadges', JSON.stringify(earned));
  };

  const handleSave = async () => {
    try {
      await userAPI.updateProfile(user._id, formData);
      updateUser(formData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profile updated locally!');
      setIsEditing(false);
    }
  };

  const allBadges = [
    { id: 'first_steps', name: 'First Steps', icon: '🌱', desc: 'Complete your first challenge' },
    { id: 'week_warrior', name: 'Week Warrior', icon: '🔥', desc: 'Maintain a 7-day streak' },
    { id: 'challenge_champion', name: 'Challenge Champion', icon: '🏆', desc: 'Complete 5 challenges' },
    { id: 'fitness_pro', name: 'Fitness Pro', icon: '💪', desc: 'Complete 3 fitness challenges' },
    { id: 'mindful_master', name: 'Mindful Master', icon: '🧘', desc: 'Complete 5 mindfulness challenges' },
    { id: 'social_butterfly', name: 'Social Butterfly', icon: '🦋', desc: 'Complete 3 social challenges' },
    { id: 'early_bird', name: 'Early Bird', icon: '🐣', desc: 'Use app for 3 days' },
    { id: 'dedicated', name: 'Dedicated', icon: '💯', desc: 'Use app for 30 days' },
    { id: 'point_master', name: 'Point Master', icon: '💎', desc: 'Earn 500 points' },
    { id: 'level_10', name: 'Level 10', icon: '⭐', desc: 'Reach level 10' },
    { id: 'streak_master', name: 'Streak Master', icon: '🔥👑', desc: 'Maintain 30-day streak' },
    { id: 'completionist', name: 'Completionist', icon: '🎖️', desc: 'Complete 10 challenges' }
  ];
  
  const isBadgeEarned = (badgeId) => earnedBadges.includes(badgeId);

  if (!user) {
    return (
      <div style={styles.container}>
        <h2>Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div style={styles.headerInfo}>
            <h1 style={styles.name}>
              {user.firstName} {user.lastName}
            </h1>
            <p style={styles.email}>{user.email}</p>
            <div style={styles.levelBadge}>
              Level {stats.level} • {stats.totalPoints} points
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={styles.editButton}
          >
            {isEditing ? '✕ Cancel' : '✏️ Edit'}
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🏆</div>
            <div style={styles.statValue}>{stats.challengesCompleted}</div>
            <div style={styles.statLabel}>Challenges</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔥</div>
            <div style={styles.statValue}>{stats.currentStreak}</div>
            <div style={styles.statLabel}>Day Streak</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⭐</div>
            <div style={styles.statValue}>{stats.level}</div>
            <div style={styles.statLabel}>Level</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>💎</div>
            <div style={styles.statValue}>{stats.totalPoints}</div>
            <div style={styles.statLabel}>Points</div>
          </div>
        </div>

        {isEditing ? (
          <div style={styles.editForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{ ...styles.input, minHeight: '100px' }}
                placeholder="Tell us about yourself..."
              />
            </div>
            <button onClick={handleSave} style={styles.saveButton}>
              💾 Save Changes
            </button>
          </div>
        ) : (
          <div style={styles.infoSection}>
            <h3 style={styles.sectionTitle}>About</h3>
            <p style={styles.bio}>
              {formData.bio || 'No bio added yet. Click Edit to add one!'}
            </p>

            <h3 style={styles.sectionTitle}>Interests</h3>
            <div style={styles.tags}>
              {formData.interests.length > 0 ? (
                formData.interests.map((interest, i) => (
                  <span key={i} style={styles.tag}>{interest}</span>
                ))
              ) : (
                <p style={styles.emptyText}>No interests added yet</p>
              )}
            </div>

            <h3 style={styles.sectionTitle}>Wellbeing Goals</h3>
            <div style={styles.goals}>
              {formData.wellbeingGoals.length > 0 ? (
                formData.wellbeingGoals.map((goal, i) => (
                  <div key={i} style={styles.goalItem}>
                    <span style={styles.checkmark}>✓</span>
                    {goal}
                  </div>
                ))
              ) : (
                <p style={styles.emptyText}>No goals set yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={styles.badgesSection}>
        <h2 style={styles.badgesTitle}>🏅 Badges & Achievements</h2>
        <p style={styles.badgesSubtitle}>
          {earnedBadges.length} of {allBadges.length} badges earned
        </p>
        <div style={styles.badgesGrid}>
          {allBadges.map(badge => {
            const earned = isBadgeEarned(badge.id);
            return (
              <div 
                key={badge.id} 
                style={{
                  ...styles.badgeCard,
                  ...(earned ? styles.badgeEarned : styles.badgeLocked)
                }}
              >
                <div style={{
                  ...styles.badgeIcon,
                  filter: earned ? 'none' : 'grayscale(100%)',
                  opacity: earned ? 1 : 0.4
                }}>
                  {badge.icon}
                </div>
                <div style={{
                  ...styles.badgeName,
                  color: earned ? '#333' : '#999'
                }}>
                  {badge.name}
                </div>
                <div style={{
                  ...styles.badgeDesc,
                  color: earned ? '#666' : '#aaa'
                }}>
                  {badge.desc}
                </div>
                {earned && (
                  <div style={styles.earnedBadge}>✓ Earned!</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px'
  },
  profileCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '24px'
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
    marginBottom: '32px',
    position: 'relative'
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    color: 'white',
    fontWeight: 'bold'
  },
  headerInfo: {
    flex: 1
  },
  name: {
    fontSize: '2rem',
    marginBottom: '8px',
    color: '#333'
  },
  email: {
    color: '#666',
    marginBottom: '12px'
  },
  levelBadge: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '10px 20px',
    background: '#f5f5f5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  statCard: {
    textAlign: 'center',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '12px'
  },
  statIcon: {
    fontSize: '2rem',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#666'
  },
  editForm: {
    borderTop: '1px solid #eee',
    paddingTop: '24px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  saveButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: '600'
  },
  infoSection: {
    borderTop: '1px solid #eee',
    paddingTop: '24px'
  },
  sectionTitle: {
    fontSize: '1.3rem',
    marginBottom: '16px',
    color: '#333'
  },
  bio: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '24px'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px'
  },
  tag: {
    background: '#e3f2fd',
    color: '#1976d2',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.9rem'
  },
  goals: {
    marginBottom: '24px'
  },
  goalItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  checkmark: {
    fontSize: '1.2rem',
    color: '#4CAF50'
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic'
  },
  badgesSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  badgesTitle: {
    fontSize: '1.8rem',
    marginBottom: '8px',
    color: '#333'
  },
  badgesSubtitle: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '24px'
  },
  badgesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px'
  },
  badgeCard: {
    textAlign: 'center',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '12px',
    transition: 'transform 0.2s',
    position: 'relative'
  },
  badgeEarned: {
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
    transform: 'scale(1.02)'
  },
  badgeLocked: {
    background: '#f0f0f0'
  },
  earnedBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: '#4CAF50',
    color: 'white',
    fontSize: '0.7rem',
    padding: '4px 8px',
    borderRadius: '8px',
    fontWeight: 'bold'
  },
  badgeIcon: {
    fontSize: '3rem',
    marginBottom: '12px'
  },
  badgeName: {
    fontWeight: '600',
    marginBottom: '8px',
    color: '#333'
  },
  badgeDesc: {
    fontSize: '0.85rem',
    color: '#666'
  }
};

export default UserProfile;
