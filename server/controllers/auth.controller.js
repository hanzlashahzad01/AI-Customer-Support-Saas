const User = require('../models/User');
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    let { name, email, password, role, companyName } = req.body;

    console.log('📝 Registration attempt:', { name, email, role, companyName });

    // Validation
    if (!email || !password || !name) {
        console.log('❌ Missing required fields');
        return res.status(400).json({ message: 'Please provide all required fields: name, email, and password' });
    }

    if (password.length < 6) {
        console.log('❌ Password too short');
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        let user = await User.findOne({ email: normalizedEmail });
        if (user) {
            console.log('❌ User already exists:', normalizedEmail);
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        let companyId = null;

        // Create company if Company Admin
        if (role === 'company_admin' && companyName) {
            console.log('🏢 Creating company:', companyName);
            let company = await Company.findOne({ name: companyName });
            if (company) {
                console.log('❌ Company name already taken:', companyName);
                return res.status(400).json({ message: 'Company name already taken. Please choose a different name.' });
            }
            company = new Company({ name: companyName });
            await company.save();
            companyId = company._id;
            console.log('✅ Company created:', companyId);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        user = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: role || 'company_admin',
            companyId
        });

        await user.save();
        console.log('✅ User created:', user._id);

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                companyId: user.companyId
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('✅ Registration successful for:', normalizedEmail);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId
            }
        });
    } catch (err) {
        console.error("❌ Register Error:", err);
        res.status(500).json({
            message: 'Server error during registration',
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', email);

    if (!email || !password) {
        console.log('❌ Missing credentials');
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.log('❌ User not found:', normalizedEmail);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('❌ Invalid password for:', normalizedEmail);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
                companyId: user.companyId
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('✅ Login successful for:', normalizedEmail);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            }
        });
    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({
            message: 'Server error during login',
            error: err.message
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log('❌ User not found in getMe:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('✅ User data retrieved:', user.email);

        res.json({
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId
        });
    } catch (err) {
        console.error("❌ GetMe Error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
};
