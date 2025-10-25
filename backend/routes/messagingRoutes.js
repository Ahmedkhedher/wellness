const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @route   POST /api/messaging/send
// @desc    Send a message
// @access  Private
router.post('/send', async (req, res) => {
  try {
    const { senderId, recipientId, content, messageType, attachments, isGroupMessage, groupId } = req.body;

    const message = await Message.create({
      senderId,
      recipientId,
      content,
      messageType: messageType || 'text',
      attachments,
      isGroupMessage: isGroupMessage || false,
      groupId,
      isDelivered: true,
      deliveredAt: new Date()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'firstName lastName avatar')
      .populate('recipientId', 'firstName lastName avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/messaging/conversations/:userId
// @desc    Get all conversations for a user
// @access  Private
router.get('/conversations/:userId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId },
        { recipientId: req.params.userId }
      ]
    })
      .populate('senderId', 'firstName lastName avatar')
      .populate('recipientId', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/messaging/chat/:userId/:recipientId
// @desc    Get messages between two users
// @access  Private
router.get('/chat/:userId/:recipientId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.userId, recipientId: req.params.recipientId },
        { senderId: req.params.recipientId, recipientId: req.params.userId }
      ]
    })
      .populate('senderId', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/messaging/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
      res.json(message);
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/messaging/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      message.isDeleted = true;
      message.deletedAt = new Date();
      await message.save();
      res.json({ message: 'Message deleted' });
    } else {
      res.status(404).json({ error: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/messaging/unread/:userId
// @desc    Get unread message count
// @access  Private
router.get('/unread/:userId', async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipientId: req.params.userId,
      isRead: false,
      isDeleted: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
