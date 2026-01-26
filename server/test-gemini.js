const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function testGemini() {
    console.log("--- Gemini API Test ---");
    const key = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (!key) {
        console.error("❌ No API Key found in .env (checked GEMINI_API_KEY and OPENAI_API_KEY)");
        return;
    }

    console.log(`🔑 Key found: ${key.substring(0, 8)}...`);

    try {
        const genAI = new GoogleGenerativeAI(key);
        // List models
        // Note: The Node SDK for listing models is slightly different, but let's try a direct approach or just try 'gemini-pro' again but with correct handling? 
        // Actually, let's just try to log the error better.

        console.log("🤖 Attempting to connect to model: gemini-1.5-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Hello";
        const result = await model.generateContent(prompt);
        // ... switch to gemini-pro if flash fails?

        const response = await result.response;
        const text = response.text();

        console.log("✅ Success! Response received:");
        console.log(text);
    } catch (error) {
        console.error("\n❌ API Error Details:");
        console.error("Message:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("StatusText:", error.response.statusText);
            // console.error("Data:", JSON.stringify(error.response.data, null, 2)); 
        }
        if (error.message.includes("404")) {
            console.log("⚠️ 404 Error: This usually means the model name is deprecated or the API key is not enabled for this service.");
        }
    }
}

testGemini();
