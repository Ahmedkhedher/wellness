import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ChallengesDashboard from './pages/ChallengesDashboard';
import UserProfile from './pages/UserProfile';
import Messaging from './pages/Messaging';
import CoachAccess from './pages/CoachAccess';
import DiscoveryFeed from './pages/DiscoveryFeed';
import ChallengeDetail from './pages/ChallengeDetail';
import ProgressTracker from './pages/ProgressTracker';
import MiniGames from './pages/MiniGames';
import Moji from './pages/Moji';
import Friends from './pages/Friends';
import Chat from './pages/Chat';
import MemoryGame from './pages/MemoryGame';
import Onboarding from './pages/Onboarding';
import MyChallenges from './pages/MyChallenges';
import WellnessFeed from './pages/WellnessFeed';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Navbar />
      <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/challenges" element={<ChallengesDashboard />} />
              <Route path="/challenges/:id" element={<ChallengeDetail />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/coaches" element={<CoachAccess />} />
              <Route path="/discovery" element={<DiscoveryFeed />} />
              <Route path="/mini-games" element={<MiniGames />} />
              <Route path="/moji" element={<Moji />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/memory-game" element={<MemoryGame />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/my-challenges" element={<MyChallenges />} />
              <Route path="/wellness-feed" element={<WellnessFeed />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
