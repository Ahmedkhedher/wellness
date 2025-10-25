const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  // User & Challenge Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  
  // Progress Status
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'abandoned', 'failed'],
    default: 'not-started'
  },
  
  // Time Tracking
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  
  // Progress Metrics
  progressPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  stepsCompleted: {
    type: Number,
    default: 0
  },
  totalSteps: {
    type: Number,
    default: 1
  },
  
  // Points & Rewards
  pointsEarned: {
    type: Number,
    default: 0
  },
  bonusPointsEarned: {
    type: Number,
    default: 0
  },
  badgeEarned: {
    type: Boolean,
    default: false
  },
  
  // Completion Details
  completionEvidence: [{
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'link', 'file']
    },
    content: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // User Reflection & Feedback
  reflection: {
    beforeThoughts: {
      type: String,
      maxlength: 500
    },
    afterThoughts: {
      type: String,
      maxlength: 500
    },
    difficultiesEncountered: [{
      type: String
    }],
    lessonsLearned: [{
      type: String
    }]
  },
  
  // Rating & Review
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 500
  },
  
  // Challenge Experience Metrics
  enjoymentLevel: {
    type: Number,
    min: 1,
    max: 5
  },
  difficultyExperienced: {
    type: String,
    enum: ['too-easy', 'just-right', 'too-hard']
  },
  wouldRecommend: {
    type: Boolean
  },
  
  // Reminders & Notifications
  reminders: [{
    scheduledAt: Date,
    sent: {
      type: Boolean,
      default: false
    },
    message: String
  }],
  
  // Accountability & Support
  sharedWithFriends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  supportRequests: [{
    message: String,
    requestedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: Date,
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  
  // Milestones & Checkpoints
  checkpoints: [{
    name: String,
    description: String,
    completedAt: Date,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  
  // AI Insights
  aiSuggestions: [{
    suggestion: String,
    type: {
      type: String,
      enum: ['tip', 'motivation', 'resource', 'alternative-approach']
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    helpful: Boolean
  }],
  
  // Attempts & Retries
  attemptNumber: {
    type: Number,
    default: 1
  },
  previousAttempts: [{
    attemptNumber: Number,
    startedAt: Date,
    endedAt: Date,
    status: String,
    reason: String
  }],
  
  // Social Proof
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Visibility
  isPublic: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  metadata: {
    deviceUsed: String,
    locationCompleted: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [Number]
    },
    timeOfDay: String,
    weatherConditions: String
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
progressSchema.index({ userId: 1, challengeId: 1 });
progressSchema.index({ userId: 1, status: 1 });
progressSchema.index({ status: 1, lastActivityAt: -1 });

// Method to calculate progress percentage
progressSchema.methods.updateProgressPercentage = function() {
  if (this.totalSteps > 0) {
    this.progressPercentage = (this.stepsCompleted / this.totalSteps) * 100;
  }
  return this.progressPercentage;
};

// Method to mark as completed
progressSchema.methods.markAsCompleted = function(pointsEarned) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.progressPercentage = 100;
  this.pointsEarned = pointsEarned;
  this.lastActivityAt = new Date();
};

// Method to add checkpoint
progressSchema.methods.completeCheckpoint = function(checkpointIndex) {
  if (this.checkpoints[checkpointIndex]) {
    this.checkpoints[checkpointIndex].isCompleted = true;
    this.checkpoints[checkpointIndex].completedAt = new Date();
    this.stepsCompleted += 1;
    this.updateProgressPercentage();
  }
};

module.exports = mongoose.model('Progress', progressSchema);
