const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Chatbot API endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received request for message:', message);
        console.log('API Key available:', !!process.env.DRAGON_API_KEY);

        const fetchResponse = await fetch('https://www.dragonai.systems/api/v1/chat', {
            method: 'POST',
            headers: {
                'Dragon-API-Key': process.env.DRAGON_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                stream: true
            })
        });

        if (!fetchResponse.ok) {
            console.error('Dragon API Error:', fetchResponse.status, fetchResponse.statusText);
            const errText = await fetchResponse.text();
            console.error('Dragon API Error Body:', errText);
            return res.status(fetchResponse.status).json({ error: 'API Error' });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for await (const chunk of fetchResponse.body) {
            res.write(chunk);
        }
        res.end();
    } catch (error) {
        console.error('Chat API Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process request' });
        } else {
            res.end();
        }
    }
});

// Fallback to index.html for any other routes
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
