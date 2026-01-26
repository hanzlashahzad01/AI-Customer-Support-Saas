// Add this to your browser console to debug authentication issues

console.log('%c🔍 Authentication Debugger Started', 'background: #667eea; color: white; padding: 10px; font-size: 16px; font-weight: bold;');

// 1. Check if API is accessible
async function checkAPI() {
    console.log('\n%c1️⃣ Checking API Connection...', 'color: #667eea; font-weight: bold;');

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'OPTIONS'
        });
        console.log('✅ API is accessible');
        console.log('Response headers:', response.headers);
    } catch (error) {
        console.error('❌ Cannot reach API:', error.message);
        console.log('Make sure server is running on port 5000');
    }
}

// 2. Test Registration
async function testRegister(email = 'debug@test.com', password = 'password123') {
    console.log('\n%c2️⃣ Testing Registration...', 'color: #667eea; font-weight: bold;');

    const data = {
        name: 'Debug User',
        email: email,
        password: password,
        companyName: 'Debug Company ' + Date.now(),
        role: 'company_admin'
    };

    console.log('Sending data:', data);

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('%c✅ Registration Successful!', 'color: green; font-weight: bold;');
            console.log('Token:', result.token);
            console.log('User:', result.user);
            localStorage.setItem('token', result.token);
            return result;
        } else {
            console.error('%c❌ Registration Failed!', 'color: red; font-weight: bold;');
            console.error('Status:', response.status);
            console.error('Error:', result);
            return null;
        }
    } catch (error) {
        console.error('%c❌ Request Failed!', 'color: red; font-weight: bold;');
        console.error('Error:', error);
        return null;
    }
}

// 3. Test Login
async function testLogin(email = 'debug@test.com', password = 'password123') {
    console.log('\n%c3️⃣ Testing Login...', 'color: #667eea; font-weight: bold;');

    const data = { email, password };
    console.log('Sending data:', data);

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('%c✅ Login Successful!', 'color: green; font-weight: bold;');
            console.log('Token:', result.token);
            console.log('User:', result.user);
            localStorage.setItem('token', result.token);
            return result;
        } else {
            console.error('%c❌ Login Failed!', 'color: red; font-weight: bold;');
            console.error('Status:', response.status);
            console.error('Error:', result);
            return null;
        }
    } catch (error) {
        console.error('%c❌ Request Failed!', 'color: red; font-weight: bold;');
        console.error('Error:', error);
        return null;
    }
}

// 4. Check Current Auth State
function checkAuthState() {
    console.log('\n%c4️⃣ Checking Auth State...', 'color: #667eea; font-weight: bold;');

    const token = localStorage.getItem('token');
    if (token) {
        console.log('✅ Token found in localStorage');
        console.log('Token:', token.substring(0, 50) + '...');
    } else {
        console.log('❌ No token in localStorage');
    }
}

// 5. Clear Auth State
function clearAuth() {
    console.log('\n%c5️⃣ Clearing Auth State...', 'color: #667eea; font-weight: bold;');
    localStorage.removeItem('token');
    console.log('✅ Token cleared from localStorage');
}

// Run initial checks
(async () => {
    await checkAPI();
    checkAuthState();

    console.log('\n%c📋 Available Commands:', 'color: #667eea; font-weight: bold; font-size: 14px;');
    console.log('• checkAPI() - Check if API is accessible');
    console.log('• testRegister(email, password) - Test registration');
    console.log('• testLogin(email, password) - Test login');
    console.log('• checkAuthState() - Check current auth state');
    console.log('• clearAuth() - Clear authentication token');
    console.log('\n%cExample:', 'color: #764ba2; font-weight: bold;');
    console.log('testRegister("myemail@test.com", "mypassword123")');
    console.log('testLogin("myemail@test.com", "mypassword123")');
})();
