import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AIChatbot.css';

const AIChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: `Hi ${user?.firstName || 'there'}! 👋 I'm Moji, your wellbeing companion! How can I help you today?`,
      timestamp: new Date(),
      mood: 'happy'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [catMood, setCatMood] = useState('happy');
  const [catPosition, setCatPosition] = useState({ x: 85, y: 85 }); // Percentage from edges
  const [isBlinking, setIsBlinking] = useState(false);
  const messagesEndRef = useRef(null);
  const moveIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);

  // Move cat around the page when not chatting
  useEffect(() => {
    if (!isOpen) {
      moveIntervalRef.current = setInterval(() => {
        const newX = 70 + Math.random() * 25; // Keep between 70-95%
        const newY = 70 + Math.random() * 25; // Keep between 70-95%
        setCatPosition({ x: newX, y: newY });
        
        // Random mood changes when moving
        const moods = ['happy', 'excited', 'thinking'];
        setCatMood(moods[Math.floor(Math.random() * moods.length)]);
      }, 5000); // Move every 5 seconds
      
      return () => {
        if (moveIntervalRef.current) {
          clearInterval(moveIntervalRef.current);
        }
      };
    } else {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    }
  }, [isOpen]);

  // Determine mood from message
  const determineMood = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('amazing') || lowerText.includes('awesome')) return 'excited';
    if (lowerText.includes('think') || lowerText.includes('consider')) return 'thinking';
    if (lowerText.includes('sorry') || lowerText.includes('unfortunately')) return 'sad';
    if (lowerText.includes('wow') || lowerText.includes('!')) return 'surprised';
    return 'happy';
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      text: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const response = await aiAPI.chat(user._id, userMessage);
      const mood = determineMood(response.message);
      setCatMood(mood);
      
      // Add bot response
      setMessages(prev => [...prev, {
        type: 'bot',
        text: response.message,
        timestamp: new Date(response.timestamp),
        mood: mood
      }]);
    } catch (error) {
      setCatMood('sad');
      setMessages(prev => [...prev, {
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again!',
        timestamp: new Date(),
        mood: 'sad'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'Give me a challenge suggestion',
    'I\'m feeling stressed',
    'How can I improve my wellbeing?',
    'Motivate me!'
  ];

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  // Cat Face SVG Component
  const CatFace = ({ mood, size = 80 }) => {
    const getMouthPath = () => {
      switch(mood) {
        case 'happy': return 'M60,75 Q80,85 100,75';
        case 'excited': return 'M55,70 Q80,90 105,70';
        case 'thinking': return 'M70,75 L90,75';
        case 'surprised': return 'M80,75 Q80,90 80,75';
        case 'sad': return 'M60,85 Q80,75 100,85';
        default: return 'M60,75 Q80,85 100,75';
      }
    };
    
    const getEyes = () => {
      if (isBlinking) {
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
      <svg width={size} height={size} viewBox="0 0 160 160">
        <ellipse cx="80" cy="80" rx="60" ry="55" fill="#FF6B35" />
        <path d="M35,45 L20,10 L50,35 Z" fill="#FF6B35" />
        <path d="M125,45 L140,10 L110,35 Z" fill="#FF6B35" />
        <path d="M35,35 L25,15 L45,35 Z" fill="#FFB399" />
        <path d="M125,35 L135,15 L115,35 Z" fill="#FFB399" />
        <ellipse cx="50" cy="65" rx="15" ry="18" fill="white" opacity="0.9" />
        <ellipse cx="110" cy="65" rx="15" ry="18" fill="white" opacity="0.9" />
        {getEyes()}
        <path d="M80,60 L75,68 L85,68 Z" fill="#2d3748" />
        <path d={getMouthPath()} stroke="#2d3748" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="20" y1="65" x2="45" y2="62" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="20" y1="72" x2="45" y2="72" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="20" y1="79" x2="45" y2="82" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="140" y1="65" x2="115" y2="62" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="140" y1="72" x2="115" y2="72" stroke="#2d3748" strokeWidth="1.5" />
        <line x1="140" y1="79" x2="115" y2="82" stroke="#2d3748" strokeWidth="1.5" />
        {(mood === 'happy' || mood === 'excited') && (
          <>
            <ellipse cx="45" cy="75" rx="8" ry="5" fill="#FF8C69" opacity="0.6" />
            <ellipse cx="115" cy="75" rx="8" ry="5" fill="#FF8C69" opacity="0.6" />
          </>
        )}
      </svg>
    );
  };

  return (
    <>
      {/* Floating Animated Cat */}
      <div 
        className={`floating-cat ${isOpen ? 'chat-open' : ''}`}
        style={{
          right: `${catPosition.x}%`,
          bottom: `${catPosition.y}%`,
          transition: 'all 3s ease-in-out'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="cat-container">
          <CatFace mood={catMood} size={100} />
          {!isOpen && (
            <div className="cat-speech-bubble">
              Click me! 💭
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="header-content">
              <div className="bot-avatar-cat">
                <CatFace mood={catMood} size={50} />
              </div>
              <div>
                <h3>Moji the Cat 🐱</h3>
                <p className="status">Feeling {catMood} • Online</p>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'bot' && (
                  <div className="message-avatar">
                    <CatFace mood={msg.mood || 'happy'} size={35} />
                  </div>
                )}
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="timestamp">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-avatar">
                  <CatFace mood="thinking" size={35} />
                </div>
                <div className="message-content loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="quick-prompts">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="quick-prompt-btn"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="chatbot-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="1"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend} 
              disabled={!inputMessage.trim() || isLoading}
              className="send-btn"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
