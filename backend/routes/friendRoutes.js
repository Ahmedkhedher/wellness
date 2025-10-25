const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Search users by name or email
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.query.userId;

    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
    .select('firstName lastName email avatar bio university')
    .limit(20);

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Send friend request
router.post('/request', async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already friends
    if (toUser.friends.includes(fromUserId)) {
      return res.status(400).json({ error: 'Already friends' });
    }

    // Check if request already exists
    const existingRequest = toUser.friendRequests.find(
      req => req.from.toString() === fromUserId && req.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent' });
    }

    // Add friend request
    toUser.friendRequests.push({
      from: fromUserId,
      status: 'pending',
      createdAt: new Date()
    });

    await toUser.save();

    res.json({ 
      message: 'Friend request sent successfully',
      request: toUser.friendRequests[toUser.friendRequests.length - 1]
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Get friend requests for a user
router.get('/requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate('friendRequests.from', 'firstName lastName email avatar bio')
      .select('friendRequests');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const pendingRequests = user.friendRequests.filter(req => req.status === 'pending');

    res.json(pendingRequests);
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ error: 'Failed to fetch friend requests' });
  }
});

// Accept friend request
router.post('/accept', async (req, res) => {
  try {
    const { userId, requestId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const request = user.friendRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    const friendId = request.from;

    // Update request status
    request.status = 'accepted';

    // Add to both users' friend lists
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
    }

    await user.save();

    // Add current user to friend's list
    const friend = await User.findById(friendId);
    if (friend && !friend.friends.includes(userId)) {
      friend.friends.push(userId);
      await friend.save();
    }

    res.json({ 
      message: 'Friend request accepted',
      friend: friend
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// Reject friend request
router.post('/reject', async (req, res) => {
  try {
    const { userId, requestId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const request = user.friendRequests.id(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    request.status = 'rejected';
    await user.save();

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ error: 'Failed to reject friend request' });
  }
});

// Get user's friends
router.get('/list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate('friends', 'firstName lastName email avatar bio university lastLogin')
      .select('friends');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// Remove friend
router.delete('/remove', async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove from both users' friend lists
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

module.exports = router;
