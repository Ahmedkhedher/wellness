const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const messagingRoutes = require('./routes/messagingRoutes');
const progressRoutes = require('./routes/progressRoutes');
const discoveryRoutes = require('./routes/discoveryRoutes');
const coachRoutes = require('./routes/coachRoutes');
const aiRoutes = require('./routes/aiRoutes');
const friendRoutes = require('./routes/friendRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ahmed:ahmed123@cluster0.j9rdkr7.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/discovery', discoveryRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Student Well-being Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
});

module.exports = app;
