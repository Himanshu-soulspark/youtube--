// =======================================================
// === Shubhzone - YouTube API Server (Node.js) ===
// =======================================================

// 1. ज़रूरी पैकेज इम्पोर्ट करें
const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // YouTube API को कॉल करने के लिए

// 2. सर्वर सेटअप करें
const app = express();
const port = process.env.PORT || 3000; // Render यह पोर्ट अपने आप सेट करेगा

// 3. Render के Environment Variable से सुरक्षित रूप से API कुंजी पढ़ें
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// 4. API रूट: यह वह रास्ता है जिससे आपका फ्रंटएंड (script.js) बात करेगा
app.get('/api/youtube', async (req, res) => {
    
    // फ्रंटएंड से भेजे गए पैरामीटर (query, pageToken) को पकड़ें
    const query = req.query.q || '';
    const pageToken = req.query.pageToken || '';

    // सबसे पहले जांचें कि API कुंजी Render में सेट है या नहीं
    if (!YOUTUBE_API_KEY) {
        console.error("ERROR: YOUTUBE_API_KEY is not set in environment variables.");
        return res.status(500).json({ error: "YouTube API key is not configured on the server." });
    }

    // YouTube API का URL बनाएं
    let youtubeApiUrl;

    if (query) {
        // अगर कोई सर्च शब्द है, तो सर्च वाला URL इस्तेमाल करें
        youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(query)}`;
    } else {
        // अगर कोई सर्च शब्द नहीं है, तो भारत के ट्रेंडिंग वीडियो वाला URL इस्तेमाल करें
        youtubeApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&regionCode=IN&maxResults=20&key=${YOUTUBE_API_KEY}`;
    }
    
    // अगर "Load More" बटन दबाया गया है, तो pageToken जोड़ें
    if (pageToken) {
        youtubeApiUrl += `&pageToken=${pageToken}`;
    }

    try {
        // हमारे सर्वर से YouTube API को कॉल करें
        const youtubeResponse = await fetch(youtubeApiUrl);
        const data = await youtubeResponse.json();

        // अगर YouTube से कोई एरर आता है, तो उसे भी फ्रंटएंड पर भेजें
        if (data.error) {
            console.error("YouTube API Error:", data.error.message);
            return res.status(500).json({ error: data.error.message });
        }

        // सब कुछ सही होने पर, YouTube से मिले डेटा को फ्रंटएंड पर वापस भेज दें
        res.status(200).json(data);

    } catch (error) {
        console.error("Failed to fetch from YouTube API:", error);
        res.status(500).json({ error: "Server failed to fetch data from YouTube." });
    }
});

// 5. स्टैटिक फाइलें सर्व करें (आपकी HTML, CSS, JS फाइलें)
// यह सुनिश्चित करता है कि आपकी वेबसाइट लोड हो
const publicPath = path.join(__dirname, '');
app.use(express.static(publicPath));

// 6. किसी भी अन्य रिक्वेस्ट के लिए आपकी index.html फाइल भेजें
// यह सुनिश्चित करता है कि पेज रीलोड करने पर ऐप सही से काम करे
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 7. सर्वर शुरू करें
app.listen(port, () => {
  console.log(`Server is running successfully on port ${port}`);
});
