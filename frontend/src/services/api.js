import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  }
};

// User API
export const userAPI = {
  getProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  },
  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/profile/${userId}`, data);
    return response.data;
  },
  updateProgress: async (userId, pointsToAdd) => {
    const response = await api.put('/users/progress', { userId, pointsToAdd });
    return response.data;
  },
  sendFriendRequest: async (userId, friendId) => {
    const response = await api.post('/users/friends/request', { userId, friendId });
    return response.data;
  },
  acceptFriendRequest: async (userId, requesterId) => {
    const response = await api.put('/users/friends/accept', { userId, requesterId });
    return response.data;
  },
  getBadges: async (userId) => {
    const response = await api.get(`/users/${userId}/badges`);
    return response.data;
  }
};

// Challenge API
export const challengeAPI = {
  getAllChallenges: async (filters = {}) => {
    const response = await api.get('/challenges', { params: filters });
    return response.data;
  },
  getPersonalizedChallenges: async (userId) => {
    const response = await api.get('/challenges/personalized', { params: { userId } });
    return response.data;
  },
  getChallengeById: async (id) => {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  },
  createChallenge: async (data) => {
    const response = await api.post('/challenges', data);
    return response.data;
  },
  updateChallenge: async (id, data) => {
    const response = await api.put(`/challenges/${id}`, data);
    return response.data;
  },
  addReview: async (id, reviewData) => {
    const response = await api.post(`/challenges/${id}/review`, reviewData);
    return response.data;
  },
  searchChallenges: async (query) => {
    const response = await api.get('/challenges/search/query', { params: { q: query } });
    return response.data;
  }
};

// Progress API
export const progressAPI = {
  startChallenge: async (userId, challengeId) => {
    const response = await api.post('/progress', { userId, challengeId });
    return response.data;
  },
  getUserProgress: async (userId, status) => {
    const response = await api.get(`/progress/user/${userId}`, { params: { status } });
    return response.data;
  },
  getProgressById: async (id) => {
    const response = await api.get(`/progress/${id}`);
    return response.data;
  },
  updateProgress: async (id, data) => {
    const response = await api.put(`/progress/${id}`, data);
    return response.data;
  },
  completeChallenge: async (id) => {
    const response = await api.put(`/progress/${id}/complete`);
    return response.data;
  },
  addReview: async (id, reviewData) => {
    const response = await api.post(`/progress/${id}/review`, reviewData);
    return response.data;
  }
};

// Messaging API
export const messagingAPI = {
  sendMessage: async (messageData) => {
    const response = await api.post('/messaging/send', messageData);
    return response.data;
  },
  getConversations: async (userId) => {
    const response = await api.get(`/messaging/conversations/${userId}`);
    return response.data;
  },
  getChat: async (userId, recipientId) => {
    const response = await api.get(`/messaging/chat/${userId}/${recipientId}`);
    return response.data;
  },
  markAsRead: async (messageId) => {
    const response = await api.put(`/messaging/${messageId}/read`);
    return response.data;
  },
  getUnreadCount: async (userId) => {
    const response = await api.get(`/messaging/unread/${userId}`);
    return response.data;
  }
};

// Discovery API
export const discoveryAPI = {
  discoverUsers: async (params) => {
    const response = await api.get('/discovery/users', { params });
    return response.data;
  },
  getTrending: async () => {
    const response = await api.get('/discovery/trending');
    return response.data;
  },
  getRecommendations: async (userId) => {
    const response = await api.get(`/discovery/recommendations/${userId}`);
    return response.data;
  },
  search: async (query, type) => {
    const response = await api.get('/discovery/search', { params: { q: query, type } });
    return response.data;
  }
};

// Coach API
export const coachAPI = {
  getAllCoaches: async (specialization) => {
    const response = await api.get('/coaches', { params: { specialization } });
    return response.data;
  },
  getCoachById: async (id) => {
    const response = await api.get(`/coaches/${id}`);
    return response.data;
  },
  connectWithCoach: async (coachId, userId) => {
    const response = await api.post(`/coaches/${coachId}/connect`, { userId });
    return response.data;
  }
};

// AI API
export const aiAPI = {
  getSuggestions: async (userId) => {
    const response = await api.get(`/ai/suggestions/${userId}`);
    return response.data;
  },
  generateChallenge: async (userId, preferences) => {
    const response = await api.post('/ai/generate-challenge', { userId, preferences });
    return response.data;
  },
  getMotivationalMessage: async (userId, context) => {
    const response = await api.post('/ai/motivational-message', { userId, context });
    return response.data;
  },
  analyzeProgress: async (userId) => {
    const response = await api.post('/ai/analyze-progress', { userId });
    return response.data;
  },
  chat: async (userId, message) => {
    const response = await api.post('/ai/chat', { userId, message });
    return response.data;
  }
};

export default api;
