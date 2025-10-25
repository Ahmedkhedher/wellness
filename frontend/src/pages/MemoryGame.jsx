import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const MemoryGame = () => {
  const { user, updateUser } = useAuth();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);

  const emojis = ['🧘', '💪', '🎨', '📚', '🌿', '❤️', '⭐', '🎯'];

  useEffect(() => {
    if (gameStarted && !gameWon) {
      const interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameWon(true);
      handleWin();
    }
  }, [matchedCards, cards.length]);

  const startGame = () => {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimer(0);
    setGameStarted(true);
    setGameWon(false);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        setMatchedCards([...matchedCards, first, second]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleWin = async () => {
    const points = Math.max(50 - moves * 2, 20);
    try {
      if (user) {
        await userAPI.updateProgress(user._id, points);
        updateUser({ totalPoints: (user.totalPoints || 0) + points });
      }
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>🎮 Wellness Memory Match</h1>
        <p style={styles.subtitle}>Match all the wellness emoji pairs!</p>

        {!gameStarted ? (
          <div style={styles.startScreen}>
            <div style={styles.instructions}>
              <h2 style={styles.instructionTitle}>How to Play:</h2>
              <ul style={styles.instructionList}>
                <li>Click cards to flip them over</li>
                <li>Find matching pairs of wellness emojis</li>
                <li>Match all pairs to win!</li>
                <li>Try to win in as few moves as possible</li>
              </ul>
            </div>
            <button onClick={startGame} style={styles.startButton}>
              Start Game
            </button>
          </div>
        ) : gameWon ? (
          <div style={styles.winScreen}>
            <div style={styles.trophy}>🏆</div>
            <h2 style={styles.winTitle}>Congratulations!</h2>
            <div style={styles.stats}>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{moves}</div>
                <div style={styles.statLabel}>Moves</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{formatTime(timer)}</div>
                <div style={styles.statLabel}>Time</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statValue}>+{Math.max(50 - moves * 2, 20)}</div>
                <div style={styles.statLabel}>Points</div>
              </div>
            </div>
            <button onClick={startGame} style={styles.playAgainButton}>
              Play Again
            </button>
          </div>
        ) : (
          <>
            <div style={styles.gameInfo}>
              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>Moves</div>
                <div style={styles.infoValue}>{moves}</div>
              </div>
              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>Time</div>
                <div style={styles.infoValue}>{formatTime(timer)}</div>
              </div>
              <div style={styles.infoCard}>
                <div style={styles.infoLabel}>Matched</div>
                <div style={styles.infoValue}>{matchedCards.length / 2}/{emojis.length}</div>
              </div>
            </div>

            <div style={styles.gameBoard}>
              {cards.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  style={{
                    ...styles.card,
                    ...(flippedCards.includes(card.id) || matchedCards.includes(card.id)
                      ? styles.cardFlipped
                      : {}),
                    ...(matchedCards.includes(card.id) ? styles.cardMatched : {}),
                    cursor: matchedCards.includes(card.id) ? 'default' : 'pointer'
                  }}
                >
                  <div style={styles.cardInner}>
                    {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? (
                      <span style={styles.cardEmoji}>{card.emoji}</span>
                    ) : (
                      <span style={styles.cardBack}>?</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#F5F5F7',
    minHeight: '100vh',
    padding: '40px 20px'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '16px',
    color: '#000'
  },
  subtitle: {
    fontSize: '1.2rem',
    textAlign: 'center',
    color: '#666',
    marginBottom: '40px'
  },
  startScreen: {
    background: 'white',
    borderRadius: '24px',
    padding: '60px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
  },
  instructions: {
    marginBottom: '40px'
  },
  instructionTitle: {
    fontSize: '2rem',
    marginBottom: '24px',
    color: '#000'
  },
  instructionList: {
    textAlign: 'left',
    fontSize: '1.1rem',
    lineHeight: '2',
    color: '#666',
    maxWidth: '400px',
    margin: '0 auto'
  },
  startButton: {
    background: '#5B72EE',
    color: 'white',
    border: 'none',
    padding: '16px 48px',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(91, 114, 238, 0.3)',
    transition: 'transform 0.2s'
  },
  gameInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '40px'
  },
  infoCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  infoLabel: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '8px'
  },
  infoValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#5B72EE'
  },
  gameBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  card: {
    aspectRatio: '1',
    background: 'white',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    userSelect: 'none'
  },
  cardFlipped: {
    background: 'linear-gradient(135deg, #A8E6CF 0%, #CAFFBF 100%)',
    transform: 'scale(1.05)'
  },
  cardMatched: {
    background: 'linear-gradient(135deg, #FFD3E0 0%, #FFC0D9 100%)',
    opacity: 0.6
  },
  cardInner: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardEmoji: {
    fontSize: '3rem'
  },
  cardBack: {
    fontSize: '3rem',
    color: '#5B72EE',
    fontWeight: 'bold'
  },
  winScreen: {
    background: 'white',
    borderRadius: '24px',
    padding: '60px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
  },
  trophy: {
    fontSize: '6rem',
    marginBottom: '24px',
    animation: 'bounce 1s ease infinite'
  },
  winTitle: {
    fontSize: '2.5rem',
    marginBottom: '32px',
    color: '#000'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '40px'
  },
  statItem: {
    padding: '20px',
    background: '#F5F5F7',
    borderRadius: '16px'
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#5B72EE',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '1rem',
    color: '#666'
  },
  playAgainButton: {
    background: '#5B72EE',
    color: 'white',
    border: 'none',
    padding: '16px 48px',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(91, 114, 238, 0.3)',
    transition: 'transform 0.2s'
  }
};

// Add bounce animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`;
document.head.appendChild(styleSheet);

export default MemoryGame;
