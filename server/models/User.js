const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['super_admin', 'company_admin', 'support_agent', 'end_user'],
        default: 'end_user'
    },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // Null for super_admin or unassigned users
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
