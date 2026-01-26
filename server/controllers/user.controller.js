const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAgents = async (req, res) => {
    try {
        const users = await User.find({
            companyId: req.user.companyId,
            role: { $in: ['support_agent', 'company_admin'] }
        }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createAgent = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!['support_agent', 'company_admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            companyId: req.user.companyId
        });

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateAgent = async (req, res) => {
    try {
        console.log(`📝 Updating agent: ${req.params.id} | Admin Company: ${req.user.companyId}`);
        const { name, email, role } = req.body;

        const agent = await User.findOne({ _id: req.params.id, companyId: req.user.companyId });

        if (!agent) {
            console.log("❌ Agent not found in this company.");
            return res.status(404).json({ message: 'Agent not found' });
        }

        if (name) agent.name = name;
        if (role) agent.role = role;

        if (email && email !== agent.email) {
            const normalizedEmail = email.trim().toLowerCase();
            // Check if taken by SOMEONE ELSE
            const exists = await User.findOne({ email: normalizedEmail, _id: { $ne: agent._id } });
            if (exists) {
                return res.status(400).json({ message: 'Email already in use by another user' });
            }
            agent.email = normalizedEmail;
        }

        await agent.save();
        console.log("✅ Agent updated updated:", agent.email);
        res.json(agent);
    } catch (err) {
        console.error("Update Agent Error:", err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

exports.deleteAgent = async (req, res) => {
    try {
        const agent = await User.findOneAndDelete({ _id: req.params.id, companyId: req.user.companyId });
        if (!agent) return res.status(404).json({ message: 'Agent not found' });
        res.json({ message: 'Agent removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateMe = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;

        if (email) {
            const normalizedEmail = email.trim().toLowerCase();
            // Check if email is already taken by another user
            const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already taken by another account' });
            }
            user.email = normalizedEmail;
        }

        await user.save();

        res.json({
            id: user._id,
            _id: user._id, // Include both for compatibility
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        });
    } catch (err) {
        console.error("Update User Error:", err);
        res.status(500).json({ message: 'Server error while updating profile', error: err.message });
    }
};
