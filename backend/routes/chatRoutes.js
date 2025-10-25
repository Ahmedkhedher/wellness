const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
router.post('/send', async (req, res) => {
  try {
    const { senderId, recipientId, content, messageType = 'text' } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const message = new Message({
      senderId,
      recipientId,
      content: content.trim(),
      messageType,
      isDelivered: true,
      deliveredAt: new Date()
    });

    await message.save();

    // Populate sender info
    await message.populate('senderId', 'firstName lastName avatar');
    await message.populate('recipientId', 'firstName lastName avatar');

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all messages where user is sender or recipient
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { recipientId: userId }
      ],
      isDeleted: false
    })
    .sort({ createdAt: -1 })
    .populate('senderId', 'firstName lastName avatar lastLogin')
    .populate('recipientId', 'firstName lastName avatar lastLogin');

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach(msg => {
      const partnerId = msg.senderId._id.toString() === userId 
        ? msg.recipientId._id.toString() 
        : msg.senderId._id.toString();

      if (!conversationsMap.has(partnerId)) {
        const partner = msg.senderId._id.toString() === userId 
          ? msg.recipientId 
          : msg.senderId;

        conversationsMap.set(partnerId, {
          partner,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // Count unread messages
      if (msg.recipientId._id.toString() === userId && !msg.isRead) {
        conversationsMap.get(partnerId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages between two users
router.get('/messages/:userId/:partnerId', async (req, res) => {
  try {
    const { userId, partnerId } = req.params;
    const { limit = 50, before } = req.query;

    const query = {
      $or: [
        { senderId: userId, recipientId: partnerId },
        { senderId: partnerId, recipientId: userId }
      ],
      isDeleted: false
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('senderId', 'firstName lastName avatar')
      .populate('recipientId', 'firstName lastName avatar');

    // Mark messages as read
    await Message.updateMany(
      {
        senderId: partnerId,
        recipientId: userId,
        isRead: false
      },
      {
        $set: { isRead: true, readAt: new Date() }
      }
    );

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
router.patch('/read/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        $set: { isRead: true, readAt: new Date() }
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

// Delete a message
router.delete('/delete/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Only sender can delete
    if (message.senderId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Add reaction to message
router.post('/react', async (req, res) => {
  try {
    const { messageId, userId, emoji } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user already reacted
    const existingReaction = message.reactions.find(
      r => r.userId.toString() === userId
    );

    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      message.reactions.push({
        userId,
        emoji,
        createdAt: new Date()
      });
    }

    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// Get unread message count
router.get('/unread/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await Message.countDocuments({
      recipientId: userId,
      isRead: false,
      isDeleted: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

module.exports = router;
