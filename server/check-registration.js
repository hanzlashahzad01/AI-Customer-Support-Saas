const mongoose = require('mongoose');
const Company = require('./models/Company');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfect-pick-saas';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        const companyName = "HS";
        const email = "hanzla221@gmail.com";

        const company = await Company.findOne({ name: companyName });
        if (company) {
            console.log(`❌ Company '${companyName}' ALREADY EXISTS.`);
        } else {
            console.log(`✅ Company '${companyName}' is available.`);
        }

        const user = await User.findOne({ email: email });
        if (user) {
            console.log(`❌ User '${email}' ALREADY EXISTS.`);
        } else {
            console.log(`✅ User '${email}' is available.`);
        }

        await mongoose.disconnect();
    })
    .catch(err => console.error(err));
