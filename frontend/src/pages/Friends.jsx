import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Friends = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadFriends();
      loadFriendRequests();
    }
  }, [user]);

  const loadFriends = async () => {
    try {
      const response = await fetch(`${API_URL}/friends/list/${user._id}`);
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/friends/requests/${user._id}`);
      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/friends/search?query=${encodeURIComponent(query)}&userId=${user._id}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (toUserId) => {
    try {
      const response = await fetch(`${API_URL}/friends/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId: user._id, toUserId })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Friend request sent!');
        setSearchResults(searchResults.filter(u => u._id !== toUserId));
      } else {
        alert(data.error || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/friends/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, requestId })
      });

      if (response.ok) {
        loadFriends();
        loadFriendRequests();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/friends/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, requestId })
      });

      if (response.ok) {
        loadFriendRequests();
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const removeFriend = async (friendId) => {
    if (!confirm('Are you sure you want to remove this friend?')) return;

    try {
      const response = await fetch(`${API_URL}/friends/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, friendId })
      });

      if (response.ok) {
        loadFriends();
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const startChat = (friendId) => {
    navigate(`/chat?with=${friendId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>👥 Friends</h1>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('friends')}
            style={{
              ...styles.tab,
              ...(activeTab === 'friends' ? styles.activeTab : {})
            }}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            style={{
              ...styles.tab,
              ...(activeTab === 'requests' ? styles.activeTab : {})
            }}
          >
            Requests ({friendRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            style={{
              ...styles.tab,
              ...(activeTab === 'search' ? styles.activeTab : {})
            }}
          >
            Find Friends
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div style={styles.section}>
            {friends.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>😔</div>
                <p>No friends yet. Start searching!</p>
              </div>
            ) : (
              <div style={styles.friendsList}>
                {friends.map(friend => (
                  <div key={friend._id} style={styles.friendCard}>
                    <div style={styles.friendInfo}>
                      <div style={styles.avatar}>
                        {friend.avatar || friend.firstName[0]}
                      </div>
                      <div>
                        <div style={styles.friendName}>
                          {friend.firstName} {friend.lastName}
                        </div>
                        <div style={styles.friendDetail}>{friend.university}</div>
                        <div style={styles.friendDetail}>
                          {friend.lastLogin ? 
                            `Last active: ${new Date(friend.lastLogin).toLocaleDateString()}` : 
                            'Never active'
                          }
                        </div>
                      </div>
                    </div>
                    <div style={styles.friendActions}>
                      <button 
                        onClick={() => startChat(friend._id)}
                        style={styles.chatButton}
                      >
                        💬 Chat
                      </button>
                      <button 
                        onClick={() => removeFriend(friend._id)}
                        style={styles.removeButton}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div style={styles.section}>
            {friendRequests.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📭</div>
                <p>No pending friend requests</p>
              </div>
            ) : (
              <div style={styles.requestsList}>
                {friendRequests.map(request => (
                  <div key={request._id} style={styles.requestCard}>
                    <div style={styles.friendInfo}>
                      <div style={styles.avatar}>
                        {request.from.avatar || request.from.firstName[0]}
                      </div>
                      <div>
                        <div style={styles.friendName}>
                          {request.from.firstName} {request.from.lastName}
                        </div>
                        <div style={styles.friendDetail}>{request.from.email}</div>
                        <div style={styles.friendDetail}>{request.from.bio}</div>
                      </div>
                    </div>
                    <div style={styles.requestActions}>
                      <button 
                        onClick={() => acceptFriendRequest(request._id)}
                        style={styles.acceptButton}
                      >
                        ✓ Accept
                      </button>
                      <button 
                        onClick={() => rejectFriendRequest(request._id)}
                        style={styles.rejectButton}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div style={styles.section}>
            <div style={styles.searchBox}>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={styles.searchInput}
              />
            </div>

            {loading && <p style={styles.loadingText}>Searching...</p>}

            {searchQuery.length > 0 && searchResults.length === 0 && !loading && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🔍</div>
                <p>No users found</p>
              </div>
            )}

            <div style={styles.searchResults}>
              {searchResults.map(searchUser => (
                <div key={searchUser._id} style={styles.searchCard}>
                  <div style={styles.friendInfo}>
                    <div style={styles.avatar}>
                      {searchUser.avatar || searchUser.firstName[0]}
                    </div>
                    <div>
                      <div style={styles.friendName}>
                        {searchUser.firstName} {searchUser.lastName}
                      </div>
                      <div style={styles.friendDetail}>{searchUser.email}</div>
                      <div style={styles.friendDetail}>{searchUser.university}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => sendFriendRequest(searchUser._id)}
                    style={styles.addButton}
                  >
                    + Add Friend
                  </button>
                </div>
              ))}
            </div>
          </div>
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
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '32px',
    color: '#000'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    background: 'white',
    borderRadius: '12px',
    padding: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  tab: {
    flex: 1,
    padding: '12px 24px',
    border: 'none',
    background: 'transparent',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#666'
  },
  activeTab: {
    background: '#5B72EE',
    color: 'white'
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  },
  searchBox: {
    marginBottom: '24px'
  },
  searchInput: {
    width: '100%',
    padding: '16px',
    border: '2px solid #E5E5E7',
    borderRadius: '12px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  friendsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  friendCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#F9F9FB',
    borderRadius: '12px',
    transition: 'transform 0.2s'
  },
  friendInfo: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: 'white',
    fontWeight: 'bold'
  },
  friendName: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '4px'
  },
  friendDetail: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '2px'
  },
  friendActions: {
    display: 'flex',
    gap: '8px'
  },
  chatButton: {
    padding: '10px 20px',
    background: '#5B72EE',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s'
  },
  removeButton: {
    padding: '10px 20px',
    background: '#FF5252',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s'
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  requestCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#FFF9E6',
    borderRadius: '12px',
    border: '2px solid #FFD700'
  },
  requestActions: {
    display: 'flex',
    gap: '8px'
  },
  acceptButton: {
    padding: '10px 20px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s'
  },
  rejectButton: {
    padding: '10px 20px',
    background: '#FF5252',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s'
  },
  searchResults: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  searchCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: '#F9F9FB',
    borderRadius: '12px'
  },
  addButton: {
    padding: '10px 24px',
    background: '#5B72EE',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px'
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.1rem'
  }
};

export default Friends;
