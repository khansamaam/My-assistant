// Import necessary libraries
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Use CORS middleware to allow requests from the frontend (for local development)
app.use(cors());

// Use Express's built-in JSON parser to handle JSON request bodies
app.use(express.json());

// Initialize the Google Gemini AI client with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the POST endpoint for asking questions
app.post('/api/ask', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required.' });
        }

        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = response.text();

        res.json({ answer: text });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ error: 'Failed to get a response from the AI.' });
    }
});

// This block is for local testing. It starts the server on port 3000.
// Vercel will ignore this when deploying as a serverless function.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// This line is essential for Vercel to handle the Express app as a serverless function.
module.exports = app;