const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, unique: true },
    name: { type: String, default: 'Support Bot' },
    welcomeMessage: { type: String, default: 'Hello! How can I help you today?' },
    tone: { type: String, enum: ['professional', 'friendly', 'humorous', 'empathetic'], default: 'professional' },
    language: { type: String, default: 'English' },
    faqs: [{
        question: String,
        answer: String
    }],
    trainingData: { type: String, default: '' }, // Custom text/Knowledge base
    productDescriptions: { type: String, default: '' },
    confidenceThreshold: { type: Number, default: 0.7 }, // Below this, create ticket
    primaryColor: { type: String, default: '#4f46e5' },
    widgetPosition: { type: String, enum: ['bottom-right', 'bottom-left'], default: 'bottom-right' },
    widgetCss: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Bot', botSchema);
