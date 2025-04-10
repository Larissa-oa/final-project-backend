const express = require('express');
const axios = require('axios');
require('dotenv').config();  
const router = express.Router();

let totalRequests = 0;
const REQUEST_LIMIT = 1500;
const MAX_INPUT_LENGTH = 500;
const MAX_OUTPUT_TOKENS = 500;

router.post('/plantbot', async (req, res) => {
  const userMessage = req.body.message;

  if (totalRequests >= REQUEST_LIMIT) {
    return res.status(429).json({ error: 'Request limit reached. Please try again later.' });
  }

  if (!userMessage || userMessage.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({
      error: `Message is required and must be under ${MAX_INPUT_LENGTH} characters.`,
    });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: MAX_OUTPUT_TOKENS,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    totalRequests++;

    const chatbotReply = response.data.choices[0].message.content;
    res.json({ reply: chatbotReply });
  } catch (error) {
    console.error('Error in chatbot route:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error processing the request' });
  }
});

module.exports = router;
