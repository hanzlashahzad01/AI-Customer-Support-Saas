const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth.middleware');

// Get all notifications for a company/user
router.get('/', auth(), async (req, res) => {
    try {
        const notifications = await Notification.find({
            companyId: req.user.companyId,
            $or: [{ userId: req.user.id }, { userId: { $exists: false } }]
        }).sort({ createdAt: -1 }).limit(50);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching notifications' });
    }
});

// Mark all as read
router.put('/mark-all-read', auth(), async (req, res) => {
    try {
        await Notification.updateMany(
            { companyId: req.user.companyId, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All marked as read' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
