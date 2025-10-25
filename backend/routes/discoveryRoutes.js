const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// @route   GET /api/discovery/users
// @desc    Discover users with similar interests
// @access  Private
router.get('/users', async (req, res) => {
  try {
    const { userId, interests, university } = req.query;

    let query = { _id: { $ne: userId }, isActive: true };

    if (interests) {
      const interestArray = interests.split(',');
      query.interests = { $in: interestArray };
    }

    if (university) {
      query.university = university;
    }

    const users = await User.find(query)
      .select('firstName lastName avatar bio interests university totalPoints level')
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/discovery/places
// @desc    Discover nearby places for challenges
// @access  Public
router.get('/places', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Coordinates required' });
    }

    const challenges = await Challenge.find({
      isActive: true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance ? parseInt(maxDistance) : 10000 // Default 10km
        }
      }
    }).limit(20);

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/discovery/trending
// @desc    Get trending challenges and users
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const trendingChallenges = await Challenge.find({ isActive: true })
      .sort({ popularity: -1, averageRating: -1 })
      .limit(10);

    const activeUsers = await User.find({ isActive: true })
      .sort({ totalPoints: -1, 'streak.current': -1 })
      .select('firstName lastName avatar totalPoints level streak badges')
      .limit(10);

    res.json({
      challenges: trendingChallenges,
      users: activeUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/discovery/recommendations/:userId
// @desc    Get personalized recommendations
// @access  Private
router.get('/recommendations/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('friends');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find users with similar interests
    const similarUsers = await User.find({
      _id: { $ne: user._id, $nin: user.friends },
      interests: { $in: user.interests },
      isActive: true
    })
      .select('firstName lastName avatar interests university')
      .limit(10);

    // Find challenges based on friends' activity
    const friendIds = user.friends.map(friend => friend._id);
    const Progress = require('../models/Progress');
    const friendProgress = await Progress.find({
      userId: { $in: friendIds },
      status: 'completed'
    })
      .populate('challengeId')
      .sort({ completedAt: -1 })
      .limit(10);

    const recommendedChallenges = friendProgress
      .map(p => p.challengeId)
      .filter(c => c && c.isActive);

    res.json({
      users: similarUsers,
      challenges: recommendedChallenges
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/discovery/search
// @desc    Universal search for users, challenges, and places
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    let results = {};

    if (!type || type === 'users') {
      results.users = await User.find({
        $or: [
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } },
          { university: { $regex: q, $options: 'i' } }
        ],
        isActive: true
      })
        .select('firstName lastName avatar university totalPoints')
        .limit(10);
    }

    if (!type || type === 'challenges') {
      results.challenges = await Challenge.find({
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } }
        ],
        isActive: true
      }).limit(10);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
