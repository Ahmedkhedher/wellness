const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Sender & Recipient(s)
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Group Chat
  isGroupMessage: {
    type: Boolean,
    default: false
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  
  // Message Content
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file', 'challenge-share', 'progress-share'],
    default: 'text'
  },
  
  // Media Attachments
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document']
    },
    url: String,
    filename: String,
    size: Number
  }],
  
  // Special Content
  sharedChallengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  sharedProgressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Progress'
  },
  
  // Status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  
  // Reply/Thread
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Reactions
  reactions: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Moderation
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ senderId: 1, recipientId: 1, createdAt: -1 });
messageSchema.index({ groupId: 1, createdAt: -1 });
messageSchema.index({ isRead: 1, recipientId: 1 });

module.exports = mongoose.model('Message', messageSchema);
