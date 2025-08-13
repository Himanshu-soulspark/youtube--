const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // हमें यह पैकेज चाहिए होगा
const app = express();
const port = process.env.PORT || 3000;

// Render के Environment Variable से API कुंजी पढ़ें
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// API रूट बनाएँ
// आपका फ्रंटएंड अब सीधे YouTube से नहीं, बल्कि इस URL से बात करेगा
app.get('/api/youtube', async (req, res) => {
    // फ्रंटएंड से भेजे गए पैरामीटर (query, pageToken) प्राप्त करें
    const query = req.query.q || '';
    const pageToken = req.query.pageToken || '';

    // जाँचें कि API कुंजी मौजूद है या नहीं
    if (!YOUTUBE_API_KEY) {
        return res.status(500).json({ error: "YouTube API key is not configured on the server." });
    }

    // YouTube API का URL बनाएँ
    let url;
    if (query) {
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&key=${YOUTUBE_API_KEY}&q=${encodeURIComponent(query)}`;
    } else {
        url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&regionCode=IN&maxResults=20&key=${YOUTUBE_API_KEY}`;
    }
    
    if (pageToken) {
        url += `&pageToken=${pageToken}`;
    }

    try {
        const youtubeResponse = await fetch(url);
        const data = await youtubeResponse.json();
        res.json(data); // परिणाम को फ्रंटएंड पर वापस भेजें
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from YouTube API." });
    }
});


// स्टैटिक फाइलें (HTML, CSS, JS) सर्व करें
app.use(express.static(path.join(__dirname, '')));

// किसी भी अन्य रिक्वेस्ट के लिए index.html भेजें
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
