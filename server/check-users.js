const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfect-pick-saas';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        console.log('Checking for users...');
        const emails = ['bosshanzla@example.com', 'bosshanzla1@example.com'];
        const users = await User.find({ email: { $in: emails } });

        console.log('Found users:', users);

        if (users.length === 0) {
            console.log('No users found with these emails.');
        } else {
            console.log(`Found ${users.length} users.`);
        }

        await mongoose.disconnect();
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
    });
