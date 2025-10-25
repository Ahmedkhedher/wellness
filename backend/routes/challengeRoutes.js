const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @route   GET /api/challenges
// @desc    Get all active challenges
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, tags } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (tags) query.tags = { $in: tags.split(',') };

    const challenges = await Challenge.find(query)
      .sort({ popularity: -1, createdAt: -1 })
      .limit(50);

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/challenges/personalized
// @desc    Get personalized challenges for a user
// @access  Private
router.get('/personalized', async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build personalized query based on user profile
    const query = {
      isActive: true,
      minLevel: { $lte: user.level },
      comfortZoneLevel: { 
        $gte: user.comfortZoneLevel - 2, 
        $lte: user.comfortZoneLevel + 3 
      }
    };

    // Match interests
    if (user.interests && user.interests.length > 0) {
      query['targetAudience.interests'] = { $in: user.interests };
    }

    const challenges = await Challenge.find(query)
      .sort({ averageRating: -1, popularity: -1 })
      .limit(20);

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/challenges/:id
// @desc    Get single challenge by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('reviews.userId', 'firstName lastName avatar');

    if (challenge) {
      res.json(challenge);
    } else {
      res.status(404).json({ error: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/challenges
// @desc    Create a new challenge
// @access  Private (Admin/Coach)
router.post('/', async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/challenges/:id
// @desc    Update a challenge
// @access  Private (Admin/Coach)
router.put('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (challenge) {
      res.json(challenge);
    } else {
      res.status(404).json({ error: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/challenges/:id
// @desc    Delete a challenge (soft delete)
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (challenge) {
      challenge.isActive = false;
      await challenge.save();
      res.json({ message: 'Challenge deactivated' });
    } else {
      res.status(404).json({ error: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/challenges/:id/review
// @desc    Add a review to a challenge
// @access  Private
router.post('/:id/review', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const challenge = await Challenge.findById(req.params.id);

    if (challenge) {
      challenge.reviews.push({ userId, rating, comment });
      challenge.updateAverageRating();
      await challenge.save();

      res.status(201).json(challenge);
    } else {
      res.status(404).json({ error: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/challenges/category/:category
// @desc    Get challenges by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const challenges = await Challenge.find({
      category: req.params.category,
      isActive: true
    })
      .sort({ averageRating: -1 })
      .limit(30);

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/challenges/search
// @desc    Search challenges by title or description
// @access  Public
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;
    
    const challenges = await Challenge.find({
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .limit(20);

    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/challenges/:id/increment-attempts
// @desc    Increment challenge attempt counter
// @access  Private
router.put('/:id/increment-attempts', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (challenge) {
      challenge.totalAttempts += 1;
      await challenge.save();
      res.json({ totalAttempts: challenge.totalAttempts });
    } else {
      res.status(404).json({ error: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/challenges/:id/increment-completions
// @desc    Increment challenge completion counter
// @access  Private
router.put('/:id/increment-completions', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (challenge) {
      challenge.totalCompletions += 1;
      challenge.updateCompletionRate();
      await challenge.save();
      res.json({ 
        totalCompletions: challenge.totalCompletions,
        completionRate: challenge.completionRate 
      });
    } else {
      res.status(404).json({ error: 'Challenge not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
