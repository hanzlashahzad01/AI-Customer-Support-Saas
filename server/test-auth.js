const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
    console.log('🧪 Testing Authentication System...\n');

    // Test 1: Register
    console.log('1️⃣ Testing Registration...');
    try {
        const registerData = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            companyName: `Test Company ${Date.now()}`,
            role: 'company_admin'
        };

        const registerRes = await axios.post(`${BASE_URL}/auth/register`, registerData);
        console.log('✅ Registration successful!');
        console.log('Token:', registerRes.data.token ? '✓ Received' : '✗ Missing');
        console.log('User:', registerRes.data.user ? '✓ Received' : '✗ Missing');
        console.log('User ID:', registerRes.data.user?.id || registerRes.data.user?._id);
        console.log('Company ID:', registerRes.data.user?.companyId);

        // Test 2: Login with same credentials
        console.log('\n2️⃣ Testing Login...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: registerData.email,
            password: registerData.password
        });
        console.log('✅ Login successful!');
        console.log('Token:', loginRes.data.token ? '✓ Received' : '✗ Missing');

        // Test 3: Get Me (Protected Route)
        console.log('\n3️⃣ Testing Protected Route (/auth/me)...');
        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${loginRes.data.token}`
            }
        });
        console.log('✅ Protected route accessible!');
        console.log('User Data:', meRes.data);

        console.log('\n🎉 All tests passed successfully!');
    } catch (error) {
        console.error('\n❌ Test failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Message:', error.response.data.message || error.response.data);
        } else if (error.request) {
            console.error('No response received. Is the server running?');
            console.error('Make sure MongoDB is running and server is started on port 5000');
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Check if server is running
async function checkServer() {
    try {
        await axios.get('http://localhost:5000');
        return true;
    } catch (error) {
        return false;
    }
}

(async () => {
    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.log('⚠️  Server is not running on port 5000!');
        console.log('Please start the server first:');
        console.log('  cd server');
        console.log('  npm start\n');
        process.exit(1);
    }
    await testAuth();
})();
