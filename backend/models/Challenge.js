const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  
  // Challenge Type & Category
  category: {
    type: String,
    required: true,
    enum: [
      'social',
      'physical',
      'academic',
      'creative',
      'mindfulness',
      'adventure',
      'skill-building',
      'community-service',
      'cultural',
      'personal-growth'
    ]
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'one-time', 'recurring'],
    default: 'one-time'
  },
  
  // Difficulty & Scoring
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'extreme'],
    required: true
  },
  comfortZoneLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  pointsReward: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Time Management
  estimatedDuration: {
    value: Number,
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      default: 'minutes'
    }
  },
  deadline: {
    type: Date
  },
  
  // Requirements & Prerequisites
  requirements: [{
    type: String
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  minLevel: {
    type: Number,
    default: 1
  },
  
  // Location & Context
  location: {
    type: {
      type: String,
      enum: ['Point', 'Polygon'],
      default: 'Point'
    },
    coordinates: [Number],
    address: String,
    isOnline: {
      type: Boolean,
      default: false
    }
  },
  
  // AI Personalization Criteria
  targetAudience: {
    interests: [{
      type: String
    }],
    personalityTraits: {
      openness: { min: Number, max: Number },
      conscientiousness: { min: Number, max: Number },
      extraversion: { min: Number, max: Number }
    },
    wellbeingGoals: [{
      type: String
    }]
  },
  
  // Engagement Metrics
  popularity: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  
  // Content
  imageUrl: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['article', 'video', 'podcast', 'tool', 'other']
    }
  }],
  
  // Instructions & Tips
  steps: [{
    order: Number,
    instruction: String,
    tip: String
  }],
  tips: [{
    type: String
  }],
  
  // Rewards & Badges
  badgeEarned: {
    badgeId: String,
    name: String,
    description: String,
    imageUrl: String
  },
  
  // Status & Availability
  isActive: {
    type: Boolean,
    default: true
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    enum: ['system', 'ai', 'coach', 'admin'],
    default: 'system'
  },
  
  // Tags for discovery
  tags: [{
    type: String
  }],
  
  // User Feedback
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
challengeSchema.index({ 'location.coordinates': '2dsphere' });

// Index for efficient querying
challengeSchema.index({ category: 1, difficulty: 1 });
challengeSchema.index({ isActive: 1, popularity: -1 });
challengeSchema.index({ tags: 1 });

// Method to calculate completion rate
challengeSchema.methods.updateCompletionRate = function() {
  if (this.totalAttempts > 0) {
    this.completionRate = (this.totalCompletions / this.totalAttempts) * 100;
  }
  return this.completionRate;
};

// Method to update average rating
challengeSchema.methods.updateAverageRating = function() {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }
  return this.averageRating;
};

module.exports = mongoose.model('Challenge', challengeSchema);
