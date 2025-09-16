// ====================================================================
// === Shubhzone - मुख्य सर्वर (The Manager) v3.0 (Netflix Version) ===
// === काम: यूजर को ऐप दिखाना और कैटेगरी के हिसाब से कंटेंट देना ===
// ====================================================================

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const path = require('path');

// Express ऐप को शुरू करें
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(path.join(__dirname, '')));

let db;

// Firebase से कनेक्ट करें
try {
    if (!process.env.FIREBASE_CREDENTIALS) {
        throw new Error('FIREBASE_CREDENTIALS एनवायरनमेंट वेरिएबल सेट नहीं है!');
    }
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('Firebase डेटाबेस से सफलतापूर्वक कनेक्ट हो गया है।');
} catch (error) {
    console.error('Firebase Admin SDK को शुरू करने में गंभीर त्रुटि:', error.message);
}

// ====================================================================
// === API Endpoints (यहीं से ऐप को सारा डेटा मिलता है) ===
// ====================================================================

// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// ★★★ यही है वह नया और शक्तिशाली API जो नेटफ्लिक्स जैसा लेआउट बनाएगा ★★★
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
app.get('/api/media-by-genre', async (req, res) => {
    try {
        const { genreId, mediaType } = req.query; // हम index.html से ये दो चीजें मांगेंगे

        // अगर कोई ज़रूरी जानकारी नहीं भेजता है, तो एरर दें
        if (!genreId || !mediaType) {
            return res.status(400).json({ error: 'Genre ID और Media Type दोनों ज़रूरी हैं।' });
        }

        // तय करें कि 'Movies' कलेक्शन में ढूंढना है या 'WebSeries' में
        const collectionName = mediaType === 'movies' ? 'Available_Movies' : 'Available_WebSeries';
        
        const mediaRef = db.collection(collectionName);
        
        // Firebase से कहें: "मुझे इस कलेक्शन में वो सभी आइटम दो जिनके 'genres' array में यह genreId मौजूद है"
        const snapshot = await mediaRef
            .where('genres', 'array-contains', parseInt(genreId)) // parseInt ज़रूरी है क्योंकि genreId टेक्स्ट में आता है
            .limit(20) // हर कैटेगरी की सिर्फ 20 आइटम भेजें ताकि ऐप तेज चले
            .get();

        if (snapshot.empty) {
            return res.status(200).json([]);
        }

        const mediaList = [];
        snapshot.forEach(doc => {
            mediaList.push(doc.data());
        });

        res.status(200).json(mediaList);

    } catch (error) {
        console.error(`कैटेगरी के हिसाब से मीडिया लाने में त्रुटि:`, error);
        res.status(500).json({ error: 'सर्वर से मीडिया लाने में विफल।' });
    }
});


// ★★★ YouTube API (इसमें कोई बदलाव नहीं किया गया है, यह वैसे ही काम करेगा) ★★★
app.get('/api/youtube', async (req, res) => {
    if (!process.env.YOUTUBE_API_KEY) {
        return res.status(500).json({ error: 'YouTube API कुंजी सर्वर पर सेट नहीं है।' });
    }
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    const { type, ...queryParams } = req.query;
    const baseUrl = 'https://www.googleapis.com/youtube/v3/';
    let apiUrl = '';

    const params = new URLSearchParams(queryParams);

    switch (type) {
        case 'search':
            apiUrl = `${baseUrl}search?part=snippet&key=${YOUTUBE_API_KEY}&${params.toString()}`;
            break;
        case 'playlists':
            apiUrl = `${baseUrl}playlists?part=snippet&key=${YOUTUBE_API_KEY}&${params.toString()}`;
            break;
        case 'videoDetails':
            apiUrl = `${baseUrl}videos?part=snippet,contentDetails&key=${YOUTUBE_API_KEY}&${params.toString()}`;
            break;
        default:
            return res.status(400).json({ error: 'अमान्य YouTube API प्रकार।' });
    }

    try {
        const youtubeResponse = await fetch(apiUrl);
        const data = await youtubeResponse.json();

        if (!youtubeResponse.ok || data.error) {
            console.error('YouTube API से त्रुटि:', data.error);
            return res.status(youtubeResponse.status).json({ error: data.error ? data.error.message : 'YouTube API से डेटा लाने में विफल।' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('YouTube API को कॉल करने में त्रुटि:', error);
        res.status(500).json({ error: 'YouTube API से कनेक्ट करने में सर्वर पर त्रुटि।' });
    }
});

// ====================================================================
// === फाइनल सेटअप: ऐप को चलाना ===
// ====================================================================

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('/////////////////////////////////////////////////////');
    console.log(`===> 🚀 Shubhzone सर्वर (Netflix Version) सफलतापूर्वक चल रहा है! 🚀`);
    console.log(`===> पोर्ट ${PORT} पर सुना जा रहा है।`);
    console.log('/////////////////////////////////////////////////////');
});
