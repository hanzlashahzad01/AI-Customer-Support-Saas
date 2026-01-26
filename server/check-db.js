const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/perfect-pick-saas';

console.log('🔍 Checking MongoDB Connection...\n');
console.log('MongoDB URI:', MONGO_URI);
console.log('');

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB Connected Successfully!\n');

        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📊 Available Collections:');
        collections.forEach(col => {
            console.log(`  - ${col.name}`);
        });

        // Check users count
        const User = require('./models/User');
        const userCount = await User.countDocuments();
        console.log(`\n👥 Total Users: ${userCount}`);

        if (userCount > 0) {
            const users = await User.find().select('name email role').limit(5);
            console.log('\n📋 Sample Users:');
            users.forEach(user => {
                console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
            });
        }

        // Check companies count
        const Company = require('./models/Company');
        const companyCount = await Company.countDocuments();
        console.log(`\n🏢 Total Companies: ${companyCount}`);

        if (companyCount > 0) {
            const companies = await Company.find().limit(5);
            console.log('\n📋 Sample Companies:');
            companies.forEach(company => {
                console.log(`  - ${company.name}`);
            });
        }

        console.log('\n✅ Database is healthy and ready!\n');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Failed!\n');
        console.error('Error:', err.message);
        console.error('\n💡 Troubleshooting:');
        console.error('1. Make sure MongoDB is running');
        console.error('2. Check if MongoDB is on port 27017');
        console.error('3. Try: mongosh (to test connection)');
        console.error('4. Check .env file for correct MONGO_URI\n');
        process.exit(1);
    });
