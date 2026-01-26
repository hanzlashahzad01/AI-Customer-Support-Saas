const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: { type: String, unique: true }, // Short ID like T-1001
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Or just email/name if guest
    customerName: { type: String },
    customerEmail: { type: String },
    subject: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages: [{
        sender: { type: String, enum: ['agent', 'customer', 'bot'] },
        message: String,
        isInternal: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

ticketSchema.pre('save', async function () {
    if (!this.ticketId) {
        // Generate a more robust ID: T-YYMM-RAND
        const date = new Date();
        const yearMonth = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const random = Math.floor(1000 + Math.random() * 9000);
        this.ticketId = `T-${yearMonth}-${random}`;
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);
