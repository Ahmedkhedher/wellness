const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const geminiService = require('../services/geminiService');

// @route   GET /api/ai/suggestions/:userId
// @desc    Get AI-generated daily/weekly suggestions
// @access  Private
router.get('/suggestions/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's recent progress
    const recentProgress = await Progress.find({
      userId: user._id,
      status: { $in: ['completed', 'in-progress'] }
    })
      .populate('challengeId')
      .sort({ lastActivityAt: -1 })
      .limit(10);

    // Analyze user patterns
    const completedChallenges = recentProgress.filter(p => p.status === 'completed');
    const preferredCategories = completedChallenges
      .map(p => p.challengeId?.category)
      .filter(Boolean);

    // Generate personalized suggestions
    const suggestions = await geminiService.analyzeSuggestions(user, recentProgress);

    res.json({
      suggestions,
      userData: {
        level: user.level,
        totalPoints: user.totalPoints,
        comfortZoneLevel: user.comfortZoneLevel,
        streak: user.streak
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/ai/generate-challenge
// @desc    Generate a personalized challenge using AI
// @access  Private
router.post('/generate-challenge', async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Call AI service to generate challenge
    const aiChallenge = await geminiService.generatePersonalizedChallenge(user, preferences);

    // Save the AI-generated challenge
    const challenge = await Challenge.create({
      ...aiChallenge,
      isAIGenerated: true,
      createdBy: 'ai'
    });

    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/ai/motivational-message
// @desc    Get AI-generated motivational message
// @access  Private
router.post('/motivational-message', async (req, res) => {
  try {
    const { userId, context } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const message = await geminiService.generateMotivationalMessage(user, context);

    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/ai/analyze-progress
// @desc    Analyze user progress with AI insights
// @access  Private
router.post('/analyze-progress', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const progress = await Progress.find({ userId })
      .populate('challengeId')
      .sort({ createdAt: -1 })
      .limit(50);

    const insights = await geminiService.analyzeProgress(user, progress);

    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/ai/chat
// @desc    Chat with AI assistant
// @access  Private
router.post('/chat', async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userContext = {
      firstName: user.firstName,
      level: user.level,
      comfortZoneLevel: user.comfortZoneLevel,
      streak: user.streak,
      interests: user.interests
    };

    const response = await geminiService.generateChatResponse(message, userContext);

    res.json({ 
      message: response,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
