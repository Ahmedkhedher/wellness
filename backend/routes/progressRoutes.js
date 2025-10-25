const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// @route   POST /api/progress
// @desc    Create new progress entry (start a challenge)
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { userId, challengeId } = req.body;

    // Check if progress already exists
    const existingProgress = await Progress.findOne({ userId, challengeId, status: { $in: ['in-progress', 'not-started'] } });
    if (existingProgress) {
      return res.status(400).json({ error: 'Challenge already in progress' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const progress = await Progress.create({
      userId,
      challengeId,
      status: 'in-progress',
      totalSteps: challenge.steps ? challenge.steps.length : 1
    });

    // Increment attempt counter
    challenge.totalAttempts += 1;
    await challenge.save();

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/progress/user/:userId
// @desc    Get all progress entries for a user
// @access  Private
router.get('/user/:userId', async (req, res) => {
  try {
    const { status } = req.query;
    let query = { userId: req.params.userId };
    
    if (status) {
      query.status = status;
    }

    const progress = await Progress.find(query)
      .populate('challengeId')
      .sort({ lastActivityAt: -1 });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/progress/:id
// @desc    Get specific progress entry
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id)
      .populate('userId', 'firstName lastName avatar')
      .populate('challengeId');

    if (progress) {
      res.json(progress);
    } else {
      res.status(404).json({ error: 'Progress not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/progress/:id
// @desc    Update progress
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (progress) {
      Object.assign(progress, req.body);
      progress.lastActivityAt = new Date();
      progress.updateProgressPercentage();
      await progress.save();

      res.json(progress);
    } else {
      res.status(404).json({ error: 'Progress not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/progress/:id/complete
// @desc    Mark challenge as completed
// @access  Private
router.put('/:id/complete', async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id).populate('challengeId userId');

    if (progress) {
      const pointsEarned = progress.challengeId.pointsReward;
      progress.markAsCompleted(pointsEarned);
      await progress.save();

      // Update user points and level
      const user = await User.findById(progress.userId);
      user.totalPoints += pointsEarned;
      user.calculateLevel();
      user.updateStreak();
      
      // Add badge if applicable
      if (progress.challengeId.badgeEarned) {
        user.badges.push(progress.challengeId.badgeEarned);
      }
      
      await user.save();

      // Update challenge completion stats
      const challenge = await Challenge.findById(progress.challengeId);
      challenge.totalCompletions += 1;
      challenge.updateCompletionRate();
      await challenge.save();

      res.json({
        progress,
        pointsEarned,
        newLevel: user.level,
        totalPoints: user.totalPoints
      });
    } else {
      res.status(404).json({ error: 'Progress not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/progress/:id/checkpoint
// @desc    Complete a checkpoint
// @access  Private
router.post('/:id/checkpoint', async (req, res) => {
  try {
    const { checkpointIndex } = req.body;
    const progress = await Progress.findById(req.params.id);

    if (progress) {
      progress.completeCheckpoint(checkpointIndex);
      await progress.save();
      res.json(progress);
    } else {
      res.status(404).json({ error: 'Progress not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/progress/:id/review
// @desc    Add review and rating
// @access  Private
router.post('/:id/review', async (req, res) => {
  try {
    const { rating, review, enjoymentLevel, difficultyExperienced, wouldRecommend } = req.body;
    const progress = await Progress.findById(req.params.id);

    if (progress) {
      progress.rating = rating;
      progress.review = review;
      progress.enjoymentLevel = enjoymentLevel;
      progress.difficultyExperienced = difficultyExperienced;
      progress.wouldRecommend = wouldRecommend;
      await progress.save();

      // Add review to challenge
      if (rating && review) {
        const challenge = await Challenge.findById(progress.challengeId);
        challenge.reviews.push({
          userId: progress.userId,
          rating,
          comment: review
        });
        challenge.updateAverageRating();
        await challenge.save();
      }

      res.json(progress);
    } else {
      res.status(404).json({ error: 'Progress not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
