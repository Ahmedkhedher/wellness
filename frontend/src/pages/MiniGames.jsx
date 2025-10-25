import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import './MiniGames.css';

const MiniGames = () => {
  const { user, updateUser } = useAuth();
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'mood', title: '😊 Mood Tracker', description: 'Track your daily mood', icon: '😊', points: 10 },
    { id: 'breathing', title: '🫁 Breathing Exercise', description: '4-7-8 breathing technique', icon: '🫁', points: 15 },
    { id: 'gratitude', title: '🙏 Gratitude Journal', description: 'Write what you\'re grateful for', icon: '🙏', points: 20 },
    { id: 'quick', title: '⚡ Quick Challenge', description: 'Random 5-minute activity', icon: '⚡', points: 25 }
  ];

  return (
    <div className="mini-games-container">
      <div className="mini-games-header">
        <h1>✨ Wellbeing Mini-Games</h1>
        <p>Quick activities to boost your mood and earn points!</p>
      </div>

      {!activeGame ? (
        <div className="games-grid">
          {games.map(game => (
            <div key={game.id} className="game-card" onClick={() => setActiveGame(game.id)}>
              <div className="game-icon">{game.icon}</div>
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <div className="game-points">+{game.points} points</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="game-active">
          <button className="back-btn" onClick={() => setActiveGame(null)}>
            ← Back to Games
          </button>
          {activeGame === 'mood' && <MoodTracker user={user} updateUser={updateUser} />}
          {activeGame === 'breathing' && <BreathingExercise user={user} updateUser={updateUser} />}
          {activeGame === 'gratitude' && <GratitudeJournal user={user} updateUser={updateUser} />}
          {activeGame === 'quick' && <QuickChallenge user={user} updateUser={updateUser} />}
        </div>
      )}
    </div>
  );
};

// Mood Tracker Game
const MoodTracker = ({ user, updateUser }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const moods = [
    { emoji: '😄', label: 'Amazing', color: '#4CAF50' },
    { emoji: '😊', label: 'Good', color: '#8BC34A' },
    { emoji: '😐', label: 'Okay', color: '#FFC107' },
    { emoji: '😔', label: 'Down', color: '#FF9800' },
    { emoji: '😢', label: 'Struggling', color: '#F44336' }
  ];

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    try {
      await userAPI.updateProgress(user._id, 10);
      updateUser({ totalPoints: (user.totalPoints || 0) + 10 });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting mood:', error);
    }
  };

  if (submitted) {
    return (
      <div className="game-complete">
        <div className="success-icon">✅</div>
        <h2>Great job tracking your mood!</h2>
        <p>+10 points earned</p>
        <p className="tip">Remember: All feelings are valid. Take care of yourself! 💙</p>
      </div>
    );
  }

  return (
    <div className="mood-tracker">
      <h2>How are you feeling today?</h2>
      <div className="mood-options">
        {moods.map((mood, index) => (
          <div
            key={index}
            className={`mood-option ${selectedMood === mood.label ? 'selected' : ''}`}
            style={{ borderColor: mood.color }}
            onClick={() => setSelectedMood(mood.label)}
          >
            <div className="mood-emoji">{mood.emoji}</div>
            <div className="mood-label">{mood.label}</div>
          </div>
        ))}
      </div>
      <textarea
        className="mood-note"
        placeholder="Want to add a note about how you're feeling? (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows="4"
      />
      <button 
        className="submit-btn" 
        onClick={handleSubmit}
        disabled={!selectedMood}
      >
        Submit Mood
      </button>
    </div>
  );
};

// Breathing Exercise Game
const BreathingExercise = ({ user, updateUser }) => {
  const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale, complete
  const [cycle, setCycle] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    runCycle();
  };

  const runCycle = async () => {
    // Inhale (4 seconds)
    setPhase('inhale');
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Hold (7 seconds)
    setPhase('hold');
    await new Promise(resolve => setTimeout(resolve, 7000));
    
    // Exhale (8 seconds)
    setPhase('exhale');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    setCycle(prev => {
      const newCycle = prev + 1;
      if (newCycle < 3) {
        runCycle();
      } else {
        setPhase('complete');
        handleComplete();
      }
      return newCycle;
    });
  };

  const handleComplete = async () => {
    try {
      await userAPI.updateProgress(user._id, 15);
      updateUser({ totalPoints: (user.totalPoints || 0) + 15 });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'ready': return 'Get Ready';
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      case 'complete': return 'Complete!';
      default: return '';
    }
  };

  if (phase === 'complete') {
    return (
      <div className="game-complete">
        <div className="success-icon">✅</div>
        <h2>Excellent breathing exercise!</h2>
        <p>+15 points earned</p>
        <p className="tip">You completed 3 cycles of 4-7-8 breathing. Feel more relaxed? 🧘</p>
      </div>
    );
  }

  return (
    <div className="breathing-exercise">
      <h2>4-7-8 Breathing Technique</h2>
      <p className="instructions">
        Breathe in for 4 seconds, hold for 7 seconds, breathe out for 8 seconds
      </p>
      
      {!isActive ? (
        <button className="start-btn" onClick={startExercise}>
          Start Exercise
        </button>
      ) : (
        <div className="breathing-animation">
          <div className={`breath-circle ${phase}`}>
            <div className="breath-text">{getPhaseText()}</div>
            <div className="cycle-count">Cycle {cycle + 1}/3</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Gratitude Journal Game
const GratitudeJournal = ({ user, updateUser }) => {
  const [gratitudes, setGratitudes] = useState(['', '', '']);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (index, value) => {
    const newGratitudes = [...gratitudes];
    newGratitudes[index] = value;
    setGratitudes(newGratitudes);
  };

  const handleSubmit = async () => {
    const filled = gratitudes.filter(g => g.trim()).length;
    if (filled === 0) return;

    try {
      await userAPI.updateProgress(user._id, 20);
      updateUser({ totalPoints: (user.totalPoints || 0) + 20 });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting gratitude:', error);
    }
  };

  if (submitted) {
    return (
      <div className="game-complete">
        <div className="success-icon">✅</div>
        <h2>Beautiful! Gratitude noted!</h2>
        <p>+20 points earned</p>
        <p className="tip">Practicing gratitude can significantly improve your wellbeing. Keep it up! 🌟</p>
      </div>
    );
  }

  return (
    <div className="gratitude-journal">
      <h2>What are you grateful for today?</h2>
      <p className="subtitle">List 3 things (even small ones count!)</p>
      
      <div className="gratitude-inputs">
        {gratitudes.map((gratitude, index) => (
          <div key={index} className="gratitude-item">
            <span className="gratitude-number">{index + 1}.</span>
            <input
              type="text"
              placeholder="I'm grateful for..."
              value={gratitude}
              onChange={(e) => handleChange(index, e.target.value)}
              className="gratitude-input"
            />
          </div>
        ))}
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={gratitudes.filter(g => g.trim()).length === 0}
      >
        Save Gratitude
      </button>
    </div>
  );
};

// Quick Challenge Game
const QuickChallenge = ({ user, updateUser }) => {
  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);

  const quickChallenges = [
    { text: 'Do 10 jumping jacks right now!', icon: '🤸', category: 'physical' },
    { text: 'Send a kind message to a friend', icon: '💌', category: 'social' },
    { text: 'Take 5 deep breaths and smile', icon: '😊', category: 'mental' },
    { text: 'Stretch your arms and legs for 1 minute', icon: '🧘', category: 'physical' },
    { text: 'Write down one thing you learned today', icon: '📝', category: 'mental' },
    { text: 'Drink a full glass of water', icon: '💧', category: 'physical' },
    { text: 'Look out the window for 30 seconds', icon: '🪟', category: 'mental' },
    { text: 'Stand up and do a little dance!', icon: '💃', category: 'physical' }
  ];

  useState(() => {
    const randomChallenge = quickChallenges[Math.floor(Math.random() * quickChallenges.length)];
    setChallenge(randomChallenge);
  }, []);

  const handleComplete = async () => {
    try {
      await userAPI.updateProgress(user._id, 25);
      updateUser({ totalPoints: (user.totalPoints || 0) + 25 });
      setCompleted(true);
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  const getNewChallenge = () => {
    const randomChallenge = quickChallenges[Math.floor(Math.random() * quickChallenges.length)];
    setChallenge(randomChallenge);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="game-complete">
        <div className="success-icon">✅</div>
        <h2>Challenge completed!</h2>
        <p>+25 points earned</p>
        <button className="secondary-btn" onClick={getNewChallenge}>
          Try Another Challenge
        </button>
      </div>
    );
  }

  return (
    <div className="quick-challenge">
      <h2>Your Quick Challenge</h2>
      {challenge && (
        <div className="challenge-card">
          <div className="challenge-icon-big">{challenge.icon}</div>
          <p className="challenge-text">{challenge.text}</p>
          <span className="challenge-category">{challenge.category}</span>
        </div>
      )}
      <div className="challenge-actions">
        <button className="submit-btn" onClick={handleComplete}>
          ✓ I Did It!
        </button>
        <button className="secondary-btn" onClick={getNewChallenge}>
          Skip
        </button>
      </div>
    </div>
  );
};

export default MiniGames;
