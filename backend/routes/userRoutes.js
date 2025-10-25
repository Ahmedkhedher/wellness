const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });
};

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, age, university, major } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      age,
      university,
      major
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      user.lastLogin = new Date();
      await user.save();

      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        totalPoints: user.totalPoints,
        level: user.level,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('friends', 'firstName lastName avatar');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/profile/:id
// @desc    Update user profile
// @access  Private
router.put('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.bio = req.body.bio || user.bio;
      user.avatar = req.body.avatar || user.avatar;
      user.interests = req.body.interests || user.interests;
      user.wellbeingGoals = req.body.wellbeingGoals || user.wellbeingGoals;
      user.comfortZoneLevel = req.body.comfortZoneLevel || user.comfortZoneLevel;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/progress
// @desc    Update user progress (points, level, streak)
// @access  Private
router.put('/progress', async (req, res) => {
  try {
    const { userId, pointsToAdd } = req.body;
    const user = await User.findById(userId);

    if (user) {
      user.totalPoints += pointsToAdd;
      user.calculateLevel();
      user.updateStreak();
      await user.save();

      res.json({
        totalPoints: user.totalPoints,
        level: user.level,
        streak: user.streak
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/users/friends/request
// @desc    Send friend request
// @access  Private
router.post('/friends/request', async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    const friend = await User.findById(friendId);

    if (friend) {
      friend.friendRequests.push({
        from: userId,
        status: 'pending'
      });
      await friend.save();
      res.json({ message: 'Friend request sent' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/users/friends/accept
// @desc    Accept friend request
// @access  Private
router.put('/friends/accept', async (req, res) => {
  try {
    const { userId, requesterId } = req.body;
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (user && requester) {
      // Add to friends list
      user.friends.push(requesterId);
      requester.friends.push(userId);

      // Update request status
      const request = user.friendRequests.find(
        req => req.from.toString() === requesterId && req.status === 'pending'
      );
      if (request) {
        request.status = 'accepted';
      }

      await user.save();
      await requester.save();

      res.json({ message: 'Friend request accepted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/:id/badges
// @desc    Get user badges
// @access  Public
router.get('/:id/badges', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('badges');
    if (user) {
      res.json(user.badges);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
