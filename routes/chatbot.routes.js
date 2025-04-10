
const express = require('express');
const axios = require('axios');
require('dotenv').config();  
const router = express.Router();

// chatbot requests
router.post('/plantbot', async (req, res) => {
  const userMessage = req.body.message; // Message sent from frontend

  if (!userMessage) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo', 
      messages: [{ role: 'user', content: userMessage }],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

   
    const chatbotReply = response.data.choices[0].message.content;

    
    res.json({ reply: chatbotReply });
  } catch (error) {
    console.error('Error in chatbot route:', error)
    res.status(500).json({ error: 'Error processing the request' })
  }
});

module.exports = router;
