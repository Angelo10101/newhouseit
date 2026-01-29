require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Business recommendation endpoint
app.post('/api/recommend-business', async (req, res) => {
  try {
    const { userProblem, businesses } = req.body;

    // Validate input
    if (!userProblem || !businesses || !Array.isArray(businesses) || businesses.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request. Provide userProblem (string) and businesses (array).' 
      });
    }

    // Verify API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Server configuration error: GEMINI_API_KEY not set' 
      });
    }

    // Create the prompt for Gemini
    const prompt = `You are a recommendation engine for a home services platform.

IMPORTANT RULES:
1. You may ONLY select from the businesses provided below
2. Do NOT invent or suggest businesses that are not in the list
3. If nothing matches the user's problem, return "NO_MATCH"
4. Return ONLY valid JSON in the exact format specified
5. Base your recommendation on the business category and description

User's Problem: ${userProblem}

Available Businesses:
${businesses.map(b => `- ID: ${b.id}, Name: ${b.name}, Category: ${b.category}, Description: ${b.description}`).join('\n')}

Required JSON Response Format:
{
  "recommendedBusinessId": "string_id_from_list_or_NO_MATCH",
  "confidence": 0.0_to_1.0,
  "reason": "short explanation"
}

Respond with ONLY the JSON object, no additional text.`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let recommendation;
    try {
      // Try to extract JSON from the response (in case there's markdown formatting)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[0]);
      } else {
        recommendation = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return res.status(500).json({ 
        error: 'Failed to parse AI response',
        details: text 
      });
    }

    // Validate the recommendation
    if (!recommendation.recommendedBusinessId || 
        recommendation.confidence === undefined || 
        !recommendation.reason) {
      return res.status(500).json({ 
        error: 'Invalid AI response format',
        details: recommendation 
      });
    }

    // Verify the recommended business exists in the provided list (unless NO_MATCH)
    if (recommendation.recommendedBusinessId !== 'NO_MATCH') {
      const businessExists = businesses.some(b => b.id === recommendation.recommendedBusinessId);
      if (!businessExists) {
        console.warn('AI recommended a business not in the list:', recommendation.recommendedBusinessId);
        recommendation.recommendedBusinessId = 'NO_MATCH';
        recommendation.reason = 'No suitable business found in the available list';
        recommendation.confidence = 0;
      }
    }

    // Return the recommendation
    res.json(recommendation);

  } catch (error) {
    console.error('Error in recommend-business endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
  console.log(`API Key configured: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
});
