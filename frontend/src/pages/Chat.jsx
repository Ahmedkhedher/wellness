import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Chat = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadConversations();
      
      // Check if opening chat with specific user
      const withUserId = searchParams.get('with');
      if (withUserId) {
        // Load that user's info and start chat
        loadUserAndStartChat(withUserId);
      }
    }
  }, [user, searchParams]);

  useEffect(() => {
    if (selectedPartner) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [selectedPartner]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/chat/conversations/${user._id}`);
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadUserAndStartChat = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/friends/list/${user._id}`);
      const friends = await response.json();
      const friend = friends.find(f => f._id === userId);
      if (friend) {
        setSelectedPartner(friend);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadMessages = async () => {
    if (!selectedPartner) return;
    
    try {
      const response = await fetch(
        `${API_URL}/chat/messages/${user._id}/${selectedPartner._id}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedPartner) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user._id,
          recipientId: selectedPartner._id,
          content: messageText.trim()
        })
      });

      if (response.ok) {
        setMessageText('');
        loadMessages();
        loadConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = (conv) => {
    setSelectedPartner(conv.partner);
  };

  const formatTime = (date) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return msgDate.toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatContainer}>
        {/* Conversations Sidebar */}
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>💬 Messages</h2>
          <div style={styles.conversationsList}>
            {conversations.length === 0 ? (
              <div style={styles.emptyConversations}>
                <p>No conversations yet</p>
                <p style={styles.emptyHint}>Start chatting with friends!</p>
              </div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.partner._id}
                  onClick={() => selectConversation(conv)}
                  style={{
                    ...styles.conversationItem,
                    ...(selectedPartner?._id === conv.partner._id 
                      ? styles.selectedConversation 
                      : {})
                  }}
                >
                  <div style={styles.avatar}>
                    {conv.partner.avatar || conv.partner.firstName[0]}
                  </div>
                  <div style={styles.conversationInfo}>
                    <div style={styles.conversationHeader}>
                      <span style={styles.conversationName}>
                        {conv.partner.firstName} {conv.partner.lastName}
                      </span>
                      <span style={styles.conversationTime}>
                        {formatTime(conv.lastMessage.createdAt)}
                      </span>
                    </div>
                    <div style={styles.lastMessage}>
                      {conv.lastMessage.content.substring(0, 50)}
                      {conv.lastMessage.content.length > 50 ? '...' : ''}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div style={styles.unreadBadge}>{conv.unreadCount}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={styles.chatArea}>
          {selectedPartner ? (
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <div style={styles.chatHeaderInfo}>
                  <div style={styles.avatarSmall}>
                    {selectedPartner.avatar || selectedPartner.firstName[0]}
                  </div>
                  <div>
                    <div style={styles.chatHeaderName}>
                      {selectedPartner.firstName} {selectedPartner.lastName}
                    </div>
                    <div style={styles.chatHeaderStatus}>
                      {selectedPartner.lastLogin 
                        ? `Last active ${formatTime(selectedPartner.lastLogin)}`
                        : 'Offline'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div style={styles.messagesContainer}>
                {messages.length === 0 ? (
                  <div style={styles.emptyMessages}>
                    <div style={styles.emptyIcon}>👋</div>
                    <p>Start the conversation!</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg._id}
                      style={{
                        ...styles.messageWrapper,
                        justifyContent: msg.senderId._id === user._id 
                          ? 'flex-end' 
                          : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          ...styles.message,
                          ...(msg.senderId._id === user._id 
                            ? styles.sentMessage 
                            : styles.receivedMessage)
                        }}
                      >
                        <div style={styles.messageContent}>{msg.content}</div>
                        <div style={styles.messageTime}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} style={styles.messageInputContainer}>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  style={styles.messageInput}
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  style={styles.sendButton}
                  disabled={loading || !messageText.trim()}
                >
                  {loading ? '...' : '📤'}
                </button>
              </form>
            </>
          ) : (
            <div style={styles.noSelection}>
              <div style={styles.noSelectionIcon}>💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a friend to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(135deg, #1a1f35 0%, #2d3748 100%)',
    minHeight: '100vh',
    padding: '20px'
  },
  chatContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '20px',
    height: 'calc(100vh - 40px)',
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  sidebar: {
    borderRight: '1px solid #E5E5E7',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  sidebarTitle: {
    padding: '24px 20px',
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    borderBottom: '1px solid #E5E5E7'
  },
  conversationsList: {
    flex: 1,
    overflowY: 'auto'
  },
  conversationItem: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid #F0F0F0',
    transition: 'background 0.2s',
    position: 'relative'
  },
  selectedConversation: {
    background: '#EEF2FF'
  },
  conversationInfo: {
    flex: 1,
    minWidth: 0
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px'
  },
  conversationName: {
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  conversationTime: {
    fontSize: '0.8rem',
    color: '#999'
  },
  lastMessage: {
    fontSize: '0.9rem',
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  unreadBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#5B72EE',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    color: 'white',
    fontWeight: 'bold',
    flexShrink: 0
  },
  avatarSmall: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    color: 'white',
    fontWeight: 'bold'
  },
  chatArea: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  chatHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #E5E5E7',
    background: 'white'
  },
  chatHeaderInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  chatHeaderName: {
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  chatHeaderStatus: {
    fontSize: '0.85rem',
    color: '#999'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    background: 'linear-gradient(135deg, #1a1f35 0%, #2d3748 100%)'
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '16px'
  },
  message: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px',
    wordWrap: 'break-word'
  },
  sentMessage: {
    background: '#5B72EE',
    color: 'white',
    borderBottomRightRadius: '4px'
  },
  receivedMessage: {
    background: 'white',
    color: '#000',
    borderBottomLeftRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  messageContent: {
    marginBottom: '4px',
    lineHeight: '1.4'
  },
  messageTime: {
    fontSize: '0.7rem',
    opacity: 0.7
  },
  messageInputContainer: {
    display: 'flex',
    gap: '12px',
    padding: '20px 24px',
    borderTop: '1px solid #E5E5E7',
    background: 'white'
  },
  messageInput: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #E5E5E7',
    borderRadius: '24px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  sendButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    border: 'none',
    background: '#5B72EE',
    color: 'white',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s'
  },
  noSelection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999'
  },
  noSelectionIcon: {
    fontSize: '5rem',
    marginBottom: '16px'
  },
  emptyConversations: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#999'
  },
  emptyHint: {
    fontSize: '0.9rem',
    marginTop: '8px'
  },
  emptyMessages: {
    textAlign: 'center',
    color: '#999',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px'
  }
};

export default Chat;
