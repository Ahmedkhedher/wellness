import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    comfortZoneLevel: 5,
    goals: [],
    interests: [],
    challenges: [],
    motivation: ''
  });

  const totalSteps = 4;

  const goals = [
    { id: 'fitness', icon: '💪', label: 'Physical Fitness' },
    { id: 'mental', icon: '🧠', label: 'Mental Health' },
    { id: 'social', icon: '👥', label: 'Social Skills' },
    { id: 'career', icon: '💼', label: 'Career Growth' },
    { id: 'creativity', icon: '🎨', label: 'Creativity' },
    { id: 'learning', icon: '📚', label: 'Learning' }
  ];

  const interests = [
    { id: 'sports', icon: '⚽', label: 'Sports' },
    { id: 'music', icon: '🎵', label: 'Music' },
    { id: 'reading', icon: '📖', label: 'Reading' },
    { id: 'cooking', icon: '🍳', label: 'Cooking' },
    { id: 'travel', icon: '✈️', label: 'Travel' },
    { id: 'gaming', icon: '🎮', label: 'Gaming' },
    { id: 'art', icon: '🎨', label: 'Art' },
    { id: 'tech', icon: '💻', label: 'Technology' }
  ];

  const challenges = [
    { id: 'anxiety', icon: '😰', label: 'Anxiety' },
    { id: 'motivation', icon: '🔥', label: 'Lack of Motivation' },
    { id: 'time', icon: '⏰', label: 'Time Management' },
    { id: 'social', icon: '😶', label: 'Social Confidence' },
    { id: 'focus', icon: '🎯', label: 'Focus & Concentration' },
    { id: 'stress', icon: '😫', label: 'Stress Management' }
  ];

  const handleToggleSelection = (field, id) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter(item => item !== id)
        : [...prev[field], id]
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // TODO: Save onboarding data to backend
    console.log('Onboarding data:', formData);
    navigate('/');
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div style={styles.stepContent}>
            <div style={styles.stepIcon}>👋</div>
            <h2 style={styles.stepTitle}>Welcome, {user?.firstName || 'Friend'}!</h2>
            <p style={styles.stepDescription}>
              Let's personalize your wellness journey. First, tell us about your comfort zone.
            </p>
            
            <div style={styles.sliderContainer}>
              <label style={styles.sliderLabel}>
                How comfortable are you with stepping outside your comfort zone?
              </label>
              <div style={styles.sliderWrapper}>
                <span style={styles.sliderValue}>Very Cautious</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.comfortZoneLevel}
                  onChange={(e) => setFormData({...formData, comfortZoneLevel: parseInt(e.target.value)})}
                  style={styles.slider}
                />
                <span style={styles.sliderValue}>Very Adventurous</span>
              </div>
              <div style={styles.comfortLevel}>
                <span style={styles.levelNumber}>{formData.comfortZoneLevel}</span>
                <span style={styles.levelLabel}>/10</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={styles.stepContent}>
            <div style={styles.stepIcon}>🎯</div>
            <h2 style={styles.stepTitle}>What are your goals?</h2>
            <p style={styles.stepDescription}>
              Select all the areas you'd like to improve (choose at least one)
            </p>
            
            <div style={styles.optionsGrid}>
              {goals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => handleToggleSelection('goals', goal.id)}
                  style={{
                    ...styles.optionCard,
                    ...(formData.goals.includes(goal.id) ? styles.optionCardSelected : {})
                  }}
                >
                  <div style={styles.optionIcon}>{goal.icon}</div>
                  <div style={styles.optionLabel}>{goal.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div style={styles.stepContent}>
            <div style={styles.stepIcon}>❤️</div>
            <h2 style={styles.stepTitle}>What are your interests?</h2>
            <p style={styles.stepDescription}>
              Help us recommend challenges that match your passions
            </p>
            
            <div style={styles.optionsGrid}>
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => handleToggleSelection('interests', interest.id)}
                  style={{
                    ...styles.optionCard,
                    ...(formData.interests.includes(interest.id) ? styles.optionCardSelected : {})
                  }}
                >
                  <div style={styles.optionIcon}>{interest.icon}</div>
                  <div style={styles.optionLabel}>{interest.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div style={styles.stepContent}>
            <div style={styles.stepIcon}>💪</div>
            <h2 style={styles.stepTitle}>What challenges do you face?</h2>
            <p style={styles.stepDescription}>
              We'll help you tackle these areas with personalized challenges
            </p>
            
            <div style={styles.optionsGrid}>
              {challenges.map(challenge => (
                <button
                  key={challenge.id}
                  onClick={() => handleToggleSelection('challenges', challenge.id)}
                  style={{
                    ...styles.optionCard,
                    ...(formData.challenges.includes(challenge.id) ? styles.optionCardSelected : {})
                  }}
                >
                  <div style={styles.optionIcon}>{challenge.icon}</div>
                  <div style={styles.optionLabel}>{challenge.label}</div>
                </button>
              ))}
            </div>

            <div style={styles.motivationBox}>
              <label style={styles.motivationLabel}>
                What motivates you most? (Optional)
              </label>
              <textarea
                value={formData.motivation}
                onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                placeholder="Tell us what drives you to grow and improve..."
                style={styles.motivationInput}
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Progress Bar */}
        <div style={styles.progressBar}>
          {[...Array(totalSteps)].map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.progressStep,
                ...(index < step ? styles.progressStepComplete : {}),
                ...(index === step - 1 ? styles.progressStepActive : {})
              }}
            />
          ))}
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Navigation Buttons */}
        <div style={styles.navigation}>
          {step > 1 && (
            <button onClick={handleBack} style={styles.backButton}>
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              ...styles.nextButton,
              marginLeft: step === 1 ? 'auto' : '0'
            }}
            disabled={
              (step === 2 && formData.goals.length === 0) ||
              (step === 3 && formData.interests.length === 0) ||
              (step === 4 && formData.challenges.length === 0)
            }
          >
            {step === totalSteps ? 'Complete ✨' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    paddingTop: '100px'
  },
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '48px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  progressBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '48px'
  },
  progressStep: {
    flex: 1,
    height: '6px',
    background: '#E5E5E7',
    borderRadius: '3px',
    transition: 'all 0.3s ease'
  },
  progressStepComplete: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  progressStepActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    height: '8px'
  },
  stepContent: {
    marginBottom: '40px',
    minHeight: '400px'
  },
  stepIcon: {
    fontSize: '4rem',
    textAlign: 'center',
    marginBottom: '24px'
  },
  stepTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '16px',
    color: '#2d3748'
  },
  stepDescription: {
    fontSize: '1.1rem',
    textAlign: 'center',
    color: '#666',
    marginBottom: '40px',
    lineHeight: '1.6'
  },
  sliderContainer: {
    maxWidth: '500px',
    margin: '0 auto'
  },
  sliderLabel: {
    display: 'block',
    fontSize: '1.1rem',
    color: '#2d3748',
    marginBottom: '24px',
    textAlign: 'center',
    fontWeight: '600'
  },
  sliderWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  sliderValue: {
    fontSize: '0.85rem',
    color: '#666',
    minWidth: '100px'
  },
  slider: {
    flex: 1,
    height: '8px',
    borderRadius: '4px',
    outline: 'none',
    background: '#E5E5E7',
    WebkitAppearance: 'none',
    cursor: 'pointer'
  },
  comfortLevel: {
    textAlign: 'center',
    marginTop: '24px'
  },
  levelNumber: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#667eea'
  },
  levelLabel: {
    fontSize: '1.5rem',
    color: '#666'
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '16px',
    marginTop: '32px'
  },
  optionCard: {
    background: '#F5F5F7',
    border: '3px solid transparent',
    borderRadius: '16px',
    padding: '24px 16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    outline: 'none'
  },
  optionCardSelected: {
    background: 'linear-gradient(135deg, #E0E7FF 0%, #E9D5FF 100%)',
    border: '3px solid #667eea',
    transform: 'scale(1.05)'
  },
  optionIcon: {
    fontSize: '2.5rem',
    marginBottom: '12px'
  },
  optionLabel: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#2d3748'
  },
  motivationBox: {
    marginTop: '40px'
  },
  motivationLabel: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '12px'
  },
  motivationInput: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #E5E5E7',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px'
  },
  backButton: {
    background: 'transparent',
    border: '2px solid #E5E5E7',
    color: '#2d3748',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  nextButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    color: 'white',
    padding: '16px 40px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
  }
};

export default Onboarding;
