const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    logo: { type: String, default: '' },
    industry: { type: String, default: '' },
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
    apiKeys: [{ type: String }], // For widget integration
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
