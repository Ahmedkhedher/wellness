const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Profile Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // Demographics
  age: {
    type: Number,
    min: 13
  },
  university: {
    type: String,
    default: ''
  },
  major: {
    type: String,
    default: ''
  },
  
  // Well-being Profile
  comfortZoneLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  interests: [{
    type: String
  }],
  wellbeingGoals: [{
    type: String
  }],
  
  // Progress & Gamification
  totalPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    badgeId: String,
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  streak: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivityDate: Date
  },
  
  // Preferences
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    challenges: {
      type: Boolean,
      default: true
    },
    messages: {
      type: Boolean,
      default: true
    }
  },
  
  // Social
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Coach Connection
  hasCoach: {
    type: Boolean,
    default: false
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach'
  },
  
  // AI Personalization Data
  personalityTraits: {
    openness: Number,
    conscientiousness: Number,
    extraversion: Number,
    agreeableness: Number,
    neuroticism: Number
  },
  challengeHistory: [{
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    completedAt: Date,
    rating: Number
  }],
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level based on points
userSchema.methods.calculateLevel = function() {
  this.level = Math.floor(this.totalPoints / 100) + 1;
  return this.level;
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastActivity = this.streak.lastActivityDate 
    ? new Date(this.streak.lastActivityDate).setHours(0, 0, 0, 0)
    : null;
  
  if (!lastActivity || today - lastActivity > 86400000) {
    // More than one day has passed
    if (today - lastActivity === 86400000) {
      // Exactly one day - continue streak
      this.streak.current += 1;
    } else {
      // Reset streak
      this.streak.current = 1;
    }
  }
  
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
  
  this.streak.lastActivityDate = new Date();
};

module.exports = mongoose.model('User', userSchema);
