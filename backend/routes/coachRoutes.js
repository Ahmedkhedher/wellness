const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach');
const User = require('../models/User');

// @route   GET /api/coaches
// @desc    Get all active coaches
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialization } = req.query;
    let query = { isActive: true, isVerified: true };

    if (specialization) {
      query.specializations = specialization;
    }

    const coaches = await Coach.find(query)
      .select('-clients')
      .sort({ averageRating: -1 });

    res.json(coaches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/coaches/:id
// @desc    Get coach by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id)
      .populate('clients', 'firstName lastName avatar');

    if (coach) {
      res.json(coach);
    } else {
      res.status(404).json({ error: 'Coach not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/coaches
// @desc    Create a new coach profile
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const coach = await Coach.create(req.body);
    res.status(201).json(coach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/coaches/:id
// @desc    Update coach profile
// @access  Private (Coach/Admin)
router.put('/:id', async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (coach) {
      res.json(coach);
    } else {
      res.status(404).json({ error: 'Coach not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/coaches/:coachId/connect
// @desc    Connect user with a coach
// @access  Private
router.post('/:coachId/connect', async (req, res) => {
  try {
    const { userId } = req.body;
    const coach = await Coach.findById(req.params.coachId);
    const user = await User.findById(userId);

    if (!coach || !user) {
      return res.status(404).json({ error: 'Coach or User not found' });
    }

    if (coach.clients.length >= coach.maxClients) {
      return res.status(400).json({ error: 'Coach has reached maximum client capacity' });
    }

    // Add user to coach's clients
    if (!coach.clients.includes(userId)) {
      coach.clients.push(userId);
      await coach.save();
    }

    // Update user's coach info
    user.hasCoach = true;
    user.coachId = coach._id;
    await user.save();

    res.json({ message: 'Successfully connected with coach', coach });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/coaches/search/specialization
// @desc    Search coaches by specialization
// @access  Public
router.get('/search/specialization', async (req, res) => {
  try {
    const { specialization } = req.query;

    const coaches = await Coach.find({
      specializations: specialization,
      isActive: true,
      isVerified: true
    })
      .select('-clients')
      .sort({ averageRating: -1 });

    res.json(coaches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
