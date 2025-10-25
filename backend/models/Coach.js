const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  avatar: String,
  
  // Professional Details
  certifications: [{
    name: String,
    issuer: String,
    dateObtained: Date,
    expiryDate: Date,
    verificationUrl: String
  }],
  specializations: [{
    type: String,
    enum: [
      'mental-health',
      'physical-fitness',
      'nutrition',
      'career-guidance',
      'academic-success',
      'stress-management',
      'social-skills',
      'life-coaching'
    ]
  }],
  bio: {
    type: String,
    maxlength: 1000
  },
  yearsOfExperience: Number,
  
  // Availability
  availability: [{
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  timezone: String,
  
  // Ratings & Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Clients
  clients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxClients: {
    type: Number,
    default: 50
  },
  
  // Pricing
  hourlyRate: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coach', coachSchema);
