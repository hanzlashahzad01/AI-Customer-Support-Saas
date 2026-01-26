const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfect-pick-saas';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        const email = 'bosshanzla@example.com';
        const password = 'password123';
        const name = 'Boss Hanzla';
        const companyName = 'Hanzla Corp';

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists. Updating password...');
            user.password = await bcrypt.hash(password, 10);
            await user.save();
            console.log(`User ${email} updated with password: ${password}`);
        } else {
            console.log('Creating new user...');

            // Create company
            let company = await Company.findOne({ name: companyName });
            if (!company) {
                company = new Company({ name: companyName });
                await company.save();
                console.log('Company created:', companyName);
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                name,
                email,
                password: hashedPassword,
                role: 'company_admin',
                companyId: company._id
            });

            await user.save();
            console.log(`User created: ${email} with password: ${password}`);
        }

        await mongoose.disconnect();
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
    });
