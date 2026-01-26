const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: If specific to an agent/admin
    type: { type: String, enum: ['new_ticket', 'agent_assigned', 'new_message', 'system'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String }, // Link to ticket or chat
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
