import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/api';

const Moji = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      type: 'moji',
      text: `Hey there! 👋 I'm Moji, your AI wellbeing buddy! Think of me as your personal cheerleader, therapist, and gaming coach all rolled into one adorable package! 🎮✨\n\nI'm here to help you crush your wellness goals, complete epic challenges, and have some fun along the way. What's on your mind today?`,
      timestamp: new Date(),
      mood: 'happy'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mojiMood, setMojiMood] = useState('happy'); // happy, excited, thinking, sleepy, surprised, sad
  const [isBlinking, setIsBlinking] = useState(false);
  const [catPosition, setCatPosition] = useState(60); // Percentage from top
  const [isTalking, setIsTalking] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speak = async (text) => {
    if (!voiceEnabled) return;
    
    setIsSpeaking(true);
    
    try {
      // First, try to use ResponsiveVoice if available (more natural)
      if (window.responsiveVoice && window.responsiveVoice.voiceSupport()) {
        window.responsiveVoice.speak(text, "UK English Female", {
          pitch: 1,
          rate: 0.9,
          volume: 1,
          onend: () => setIsSpeaking(false)
        });
        return;
      }
      
      // Fallback to Web Speech API with best settings
      if (!window.speechSynthesis) {
        setIsSpeaking(false);
        return;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Wait for voices to load
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        await new Promise(resolve => {
          window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve();
          };
          setTimeout(resolve, 100);
        });
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Optimize for most natural sound
      utterance.rate = 0.9;   // Natural conversational pace
      utterance.pitch = 1.05; // Slightly warm and friendly
      utterance.volume = 1;
      
      // Find the best available voice
      const bestVoice = voices.find(voice => 
        // Google voices (best quality)
        voice.name.includes('Google US English') ||
        voice.name.includes('Google UK English Female') ||
        // Microsoft neural voices (very natural)
        voice.name.includes('Microsoft Aria Online') ||
        voice.name.includes('Microsoft Jenny Online') ||
        // Apple premium voices
        voice.name.includes('Samantha (Enhanced)') ||
        voice.name.includes('Ava (Premium)') ||
        // Standard high-quality options
        voice.name.includes('Samantha') ||
        voice.name.includes('Microsoft Zira')
      ) || voices.find(voice => 
        voice.lang.startsWith('en-US') || voice.lang.startsWith('en-GB')
      ) || voices[0];
      
      if (bestVoice) {
        utterance.voice = bestVoice;
        console.log('🎤 Using voice:', bestVoice.name);
      }
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Blinking animation effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000 + Math.random() * 2000); // Random blink every 3-5 seconds
    
    return () => clearInterval(blinkInterval);
  }, []);

  // Cat face component based on mood
  const CatFace = ({ mood, isSmall = false }) => {
    const size = isSmall ? 50 : 200;
    const scale = isSmall ? 0.4 : 1;
    
    const getMouthPath = () => {
      switch(mood) {
        case 'happy': return 'M60,75 Q80,85 100,75';
        case 'excited': return 'M55,70 Q80,90 105,70';
        case 'thinking': return 'M70,75 L90,75';
        case 'sleepy': return 'M70,80 Q80,78 90,80';
        case 'surprised': return 'M80,75 Q80,90 80,75';
        case 'sad': return 'M60,85 Q80,75 100,85';
        default: return 'M60,75 Q80,85 100,75';
      }
    };
    
    const getEyes = () => {
      if (isBlinking && !isSmall) {
        return (
          <>
            <path d="M55,50 L70,50" stroke="#2d3748" strokeWidth="3" strokeLinecap="round" />
            <path d="M90,50 L105,50" stroke="#2d3748" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      }
      
      switch(mood) {
        case 'happy':
        case 'excited':
          return (
            <>
              <ellipse cx="62" cy="50" rx="8" ry="12" fill="#2d3748" />
              <ellipse cx="98" cy="50" rx="8" ry="12" fill="#2d3748" />
              <ellipse cx="64" cy="48" rx="3" ry="4" fill="white" />
              <ellipse cx="100" cy="48" rx="3" ry="4" fill="white" />
            </>
          );
        case 'thinking':
          return (
            <>
              <ellipse cx="62" cy="50" rx="6" ry="10" fill="#2d3748" />
              <ellipse cx="98" cy="45" rx="6" ry="10" fill="#2d3748" />
              <ellipse cx="64" cy="48" rx="2" ry="3" fill="white" />
            </>
          );
        case 'sleepy':
          return (
            <>
              <path d="M55,52 Q62,48 70,52" stroke="#2d3748" strokeWidth="2" fill="none" />
              <path d="M90,52 Q98,48 105,52" stroke="#2d3748" strokeWidth="2" fill="none" />
            </>
          );
        case 'surprised':
          return (
            <>
              <circle cx="62" cy="50" r="10" fill="#2d3748" />
              <circle cx="98" cy="50" r="10" fill="#2d3748" />
              <circle cx="64" cy="48" r="3" fill="white" />
              <circle cx="100" cy="48" r="3" fill="white" />
            </>
          );
        case 'sad':
          return (
            <>
              <ellipse cx="62" cy="52" rx="6" ry="8" fill="#2d3748" />
              <ellipse cx="98" cy="52" rx="6" ry="8" fill="#2d3748" />
              <ellipse cx="64" cy="50" rx="2" ry="2" fill="white" />
              <ellipse cx="100" cy="50" rx="2" ry="2" fill="white" />
            </>
          );
        default:
          return (
            <>
              <ellipse cx="62" cy="50" rx="8" ry="12" fill="#2d3748" />
              <ellipse cx="98" cy="50" rx="8" ry="12" fill="#2d3748" />
              <ellipse cx="64" cy="48" rx="3" ry="4" fill="white" />
              <ellipse cx="100" cy="48" rx="3" ry="4" fill="white" />
            </>
          );
      }
    };
    
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 160 160" 
        style={{ transform: `scale(${scale})`, transition: 'all 0.3s ease' }}
      >
        {/* Cat head */}
        <ellipse cx="80" cy="80" rx="60" ry="55" fill="#FF6B35" />
        
        {/* Ears */}
        <path d="M35,45 L20,10 L50,35 Z" fill="#FF6B35" />
        <path d="M125,45 L140,10 L110,35 Z" fill="#FF6B35" />
        <path d="M35,35 L25,15 L45,35 Z" fill="#FFB399" />
        <path d="M125,35 L135,15 L115,35 Z" fill="#FFB399" />
        
        {/* Face highlights */}
        <ellipse cx="50" cy="65" rx="15" ry="18" fill="white" opacity="0.9" />
        <ellipse cx="110" cy="65" rx="15" ry="18" fill="white" opacity="0.9" />
        
        {/* Eyes */}
        {getEyes()}
        
        {/* Nose */}
        <path d="M80,60 L75,68 L85,68 Z" fill="#2d3748" />
        
        {/* Mouth */}
        <path d={getMouthPath()} stroke="#2d3748" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Whiskers */}
        <line x1="20" y1="65" x2="45" y2="62" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="20" y1="72" x2="45" y2="72" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="20" y1="79" x2="45" y2="82" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="140" y1="65" x2="115" y2="62" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="140" y1="72" x2="115" y2="72" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="140" y1="79" x2="115" y2="82" stroke="#2d3748" strokeWidth="1.5" />
        
        {/* Blush when happy or excited */}
        {(mood === 'happy' || mood === 'excited') && (
          <>
            <ellipse cx="45" cy="75" rx="8" ry="5" fill="#FF8C69" opacity="0.6" />
            <ellipse cx="115" cy="75" rx="8" ry="5" fill="#FF8C69" opacity="0.6" />
          </>
        )}
      </svg>
    );
  };

  const quickActions = [
    { text: 'Give me a challenge!', icon: '🎯' },
    { text: 'I need motivation', icon: '💪' },
    { text: 'Tell me something inspiring', icon: '✨' },
    { text: 'How am I doing?', icon: '📊' },
    { text: 'Fun fact please!', icon: '🎲' },
    { text: 'Feeling stressed', icon: '😰' }
  ];

  const handleSend = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInputMessage('');

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);
    
    // Make Moji move to a random position and react
    const newPosition = 40 + Math.random() * 40; // Random between 40% and 80%
    setCatPosition(newPosition);
    setWiggle(true);
    setTimeout(() => setWiggle(false), 600);

    try {
      // Enhanced prompt with Moji's personality
      const mojiPrompt = `You are Moji, a fun, energetic, and caring AI wellbeing companion with a bubbly personality. 
      
Your traits:
- Enthusiastic and use lots of emojis (but not overwhelming)
- Supportive and understanding, never judgmental
- Encouraging but realistic
- Sometimes playful and humorous
- Knowledgeable about wellness, mental health, and personal growth
- Use casual, friendly language like talking to a friend

User context:
- Name: ${user?.firstName || 'Friend'}
- Level: ${user?.level || 1}
- Comfort Zone: ${user?.comfortZoneLevel || 5}/10
- Streak: ${user?.streak?.current || 0} days

User says: "${userMessage}"

Respond as Moji in 2-4 sentences. Be helpful, upbeat, and authentic. If they ask for a challenge, suggest a specific wellness activity.`;

      const response = await aiAPI.chat(user?._id || 'guest', mojiPrompt);
      
      // Determine Moji's mood based on response
      const newMood = determineMood(response.message);
      setMojiMood(newMood);
      
      // Animate talking
      setIsTalking(true);
      setTimeout(() => setIsTalking(false), 2000);

      // Add Moji's response
      const newMessage = {
        type: 'moji',
        text: response.message,
        timestamp: new Date(response.timestamp),
        mood: newMood
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Speak the response
      speak(response.message);
    } catch (error) {
      // Fallback responses with personality
      const fallbackResponses = [
        "Oops! My circuits got a bit tangled there! 🤖 But hey, I'm still here for you! What would you like to talk about?",
        "Hmm, looks like I need to recharge my AI brain! ⚡ But I'm not giving up on you! Let's try that again?",
        "Technical hiccup on my end! 😅 Even AI assistants have off moments. What can I help you with?"
      ];
      
      const fallbackMessage = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      setMessages(prev => [...prev, {
        type: 'moji',
        text: fallbackMessage,
        timestamp: new Date(),
        mood: 'thoughtful'
      }]);
      
      // Speak the fallback message
      speak(fallbackMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const determineMood = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('amazing') || lowerText.includes('awesome') || lowerText.includes('🎉')) return 'excited';
    if (lowerText.includes('think') || lowerText.includes('consider') || lowerText.includes('hmm')) return 'thinking';
    if (lowerText.includes('tired') || lowerText.includes('sleepy') || lowerText.includes('rest')) return 'sleepy';
    if (lowerText.includes('wow') || lowerText.includes('really') || lowerText.includes('!')) return 'surprised';
    if (lowerText.includes('sorry') || lowerText.includes('unfortunately')) return 'sad';
    return 'happy';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action) => {
    handleSend(action.text);
  };

  return (
    <div style={styles.container}>
      {/* Floating Side Cat with Personality */}
      <div style={{...styles.sideCat, top: `${catPosition}%`}}>
        <div style={{
          ...styles.sideCatWrapper,
          animation: wiggle ? 'wiggle 0.6s ease' : (isTalking || isSpeaking) ? 'talk 0.5s ease infinite' : 'none',
          transform: (isTalking || isSpeaking) ? 'scale(1.05)' : 'scale(1)'
        }} className="sideCatWrapper">
          <CatFace mood={mojiMood} />
          <div style={styles.sideCatMood}>{mojiMood}</div>
          <div style={styles.catThought}>
            {mojiMood === 'happy' && '😊'}
            {mojiMood === 'excited' && '🎉'}
            {mojiMood === 'thinking' && '💭'}
            {mojiMood === 'sleepy' && '💤'}
            {mojiMood === 'surprised' && '⚡'}
            {mojiMood === 'sad' && '💙'}
          </div>
          {/* Sparkles effect */}
          {(isTalking || isSpeaking) && (
            <>
              <div style={styles.sparkle1}>✨</div>
              <div style={styles.sparkle2}>✨</div>
              <div style={styles.sparkle3}>✨</div>
            </>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.mojiName}>Moji the Cat 🐱</h1>
              <p style={styles.mojiTagline}>Your AI Wellbeing Companion</p>
            </div>
            <div style={styles.voiceControls}>
              <button 
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                style={{
                  ...styles.voiceToggle,
                  background: voiceEnabled ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : '#ccc'
                }}
                title="Toggle Moji's voice on/off"
              >
                {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
              </button>
              <div style={styles.voiceInfo} title="For best quality: Use Chrome with 'Google US English' voice, or Edge with 'Microsoft Aria Online' voice">ℹ️</div>
            </div>
          </div>
            <div style={styles.moodIndicator}>
              <span style={styles.moodLabel}>Current mood:</span>
              <span style={styles.moodValue}>{mojiMood}</span>
            </div>
            <div style={styles.mojiStats}>
              <span style={styles.stat}>🎯 Challenge Expert</span>
              <span style={styles.stat}>💬 Always Listening</span>
              <span style={styles.stat}>✨ Powered by AI</span>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div style={styles.chatContainer}>
          <div style={styles.messagesArea}>
            {messages.map((msg, index) => (
              <div key={index} style={msg.type === 'user' ? styles.userMessageWrapper : styles.mojiMessageWrapper}>
                {msg.type === 'moji' && (
                  <div style={styles.mojiAvatarSmall}>
                    <CatFace mood={msg.mood || mojiMood} isSmall={true} />
                  </div>
                )}
                <div style={msg.type === 'user' ? styles.userMessage : styles.mojiMessage}>
                  <p style={styles.messageText}>{msg.text}</p>
                  <span style={styles.timestamp}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {msg.type === 'user' && (
                  <div style={styles.userAvatarSmall}>
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div style={styles.mojiMessageWrapper}>
                <div style={styles.mojiAvatarSmall}>
                  <CatFace mood="thinking" isSmall={true} />
                </div>
                <div style={styles.mojiMessage}>
                  <div style={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div style={styles.quickActions}>
              <p style={styles.quickActionsTitle}>Quick Actions:</p>
              <div style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    style={styles.quickActionBtn}
                  >
                    <span style={styles.quickActionIcon}>{action.icon}</span>
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div style={styles.inputArea}>
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message... (Press Enter to send)"
              style={styles.input}
              rows="1"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()} 
              disabled={!inputMessage.trim() || isLoading}
              style={styles.sendBtn}
            >
              <span style={styles.sendIcon}>➤</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#F5F5F7',
    minHeight: '100vh',
    color: '#2d3748',
    padding: '20px',
    paddingTop: '100px',
    position: 'relative'
  },
  sideCat: {
    position: 'fixed',
    left: '20px',
    top: '60%',
    transform: 'translateY(-50%)',
    zIndex: 1000,
    animation: 'floatSide 3s ease-in-out infinite',
    transition: 'top 0.8s ease-in-out'
  },
  sideCatWrapper: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD700 100%)',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 15px 50px rgba(255, 107, 53, 0.8), 0 0 0 10px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 215, 0, 0.4)',
    border: '5px solid white',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative'
  },
  sideCatMood: {
    marginTop: '8px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: 'white',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    background: 'rgba(0,0,0,0.2)',
    padding: '4px 12px',
    borderRadius: '12px'
  },
  catThought: {
    position: 'absolute',
    top: '-35px',
    right: '-25px',
    fontSize: '2.5rem',
    animation: 'pop 2s ease-in-out infinite',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
  },
  sparkle1: {
    position: 'absolute',
    top: '-20px',
    left: '10px',
    fontSize: '1.5rem',
    animation: 'sparkle 1s ease infinite',
    animationDelay: '0s'
  },
  sparkle2: {
    position: 'absolute',
    bottom: '-20px',
    right: '10px',
    fontSize: '1.5rem',
    animation: 'sparkle 1s ease infinite',
    animationDelay: '0.3s'
  },
  sparkle3: {
    position: 'absolute',
    top: '50%',
    left: '-25px',
    fontSize: '1.5rem',
    animation: 'sparkle 1s ease infinite',
    animationDelay: '0.6s'
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    marginLeft: '200px'
  },
  header: {
    marginBottom: '24px'
  },
  headerContent: {
    background: 'white',
    border: '1px solid #E5E5E7',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '16px'
  },
  voiceControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  voiceInfo: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#667eea',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    cursor: 'help',
    fontWeight: 'bold'
  },
  voiceToggle: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap'
  },
  mojiName: {
    fontSize: '2.5rem',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    margin: 0,
    textAlign: 'left'
  },
  moodIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 107, 53, 0.15)',
    padding: '8px 16px',
    borderRadius: '20px',
    marginBottom: '12px',
    marginTop: '12px',
    border: '1px solid rgba(255, 107, 53, 0.3)'
  },
  moodLabel: {
    fontSize: '0.9rem',
    color: '#666'
  },
  moodValue: {
    fontSize: '1rem',
    color: '#FF6B35',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  mojiTagline: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: 0,
    textAlign: 'left'
  },
  mojiStats: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  stat: {
    padding: '6px 12px',
    background: '#F0F0F0',
    borderRadius: '12px',
    fontSize: '0.9rem',
    color: '#2d3748'
  },
  chatContainer: {
    background: 'white',
    border: '1px solid #E5E5E7',
    borderRadius: '16px',
    minHeight: '500px',
    maxHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: '#FAFAFA'
  },
  userMessageWrapper: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  mojiMessageWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end'
  },
  mojiAvatarSmall: {
    flexShrink: 0,
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userAvatarSmall: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    flexShrink: 0,
    color: 'white'
  },
  userMessage: {
    background: 'white',
    border: '1px solid #E5E5E7',
    padding: '16px 20px',
    borderRadius: '16px',
    borderBottomRightRadius: '4px',
    maxWidth: '70%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    color: '#2d3748'
  },
  mojiMessage: {
    background: 'linear-gradient(135deg, #FFF5F0 0%, #FFFFFF 100%)',
    border: '2px solid rgba(255, 107, 53, 0.3)',
    padding: '16px 20px',
    borderRadius: '16px',
    borderBottomLeftRadius: '4px',
    maxWidth: '70%',
    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)',
    color: '#2d3748',
    animation: 'slideIn 0.3s ease'
  },
  messageText: {
    margin: 0,
    marginBottom: '8px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
  },
  timestamp: {
    fontSize: '0.75rem',
    opacity: 0.7
  },
  typingIndicator: {
    display: 'flex',
    gap: '6px',
    padding: '8px 0'
  },
  quickActions: {
    padding: '24px',
    borderTop: '1px solid #E5E5E7',
    background: 'white'
  },
  quickActionsTitle: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '12px'
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '8px'
  },
  quickActionBtn: {
    background: '#F5F5F7',
    border: '1px solid #E5E5E7',
    color: '#2d3748',
    padding: '10px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  quickActionIcon: {
    fontSize: '1.2rem'
  },
  inputArea: {
    padding: '24px',
    borderTop: '1px solid #E5E5E7',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    background: 'white'
  },
  input: {
    flex: 1,
    background: 'white',
    border: '2px solid #E5E5E7',
    color: '#2d3748',
    padding: '14px 18px',
    borderRadius: '12px',
    fontSize: '1rem',
    resize: 'none',
    fontFamily: 'inherit',
    maxHeight: '120px'
  },
  sendBtn: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s'
  },
  sendIcon: {
    display: 'block'
  }
};

// Animations
const style = document.createElement('style');
style.textContent = `
  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
    30% { transform: translateY(-10px); opacity: 1; }
  }
  @keyframes floatSide {
    0%, 100% { transform: translateY(-50%) translateX(0px) rotate(0deg); }
    25% { transform: translateY(-50%) translateX(-8px) rotate(-2deg); }
    50% { transform: translateY(-50%) translateX(0px) rotate(0deg); }
    75% { transform: translateY(-50%) translateX(8px) rotate(2deg); }
  }
  @keyframes pop {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.3) rotate(10deg); }
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-15deg); }
    75% { transform: rotate(15deg); }
  }
  @keyframes talk {
    0%, 100% { transform: scale(1.05) translateY(0); }
    50% { transform: scale(1.08) translateY(-5px); }
  }
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
  }
  @keyframes slideIn {
    0% { opacity: 0; transform: translateX(-20px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  .typing-indicator span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #FF6B35;
    display: inline-block;
    animation: typing 1.4s infinite;
  }
  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
  
  @media (max-width: 768px) {
    .sideCat { display: none; }
    .content { margin-left: 0 !important; }
  }
  
  /* Hover effect for side cat */
  .sideCatWrapper:hover {
    transform: scale(1.15) rotate(5deg) !important;
    box-shadow: 0 20px 60px rgba(255, 107, 53, 1), 0 0 0 15px rgba(255, 255, 255, 0.5), 0 0 50px rgba(255, 215, 0, 0.6) !important;
  }
`;
document.head.appendChild(style);

export default Moji;
