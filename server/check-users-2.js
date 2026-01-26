const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfect-pick-saas';

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('CONNECTED');

        const companies = await Company.find();
        console.log('COMPANIES:', JSON.stringify(companies, null, 2));

        const users = await User.find();
        console.log('USERS:', JSON.stringify(users, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}
run();
