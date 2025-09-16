// ====================================================================
// === Shubhzone - मुख्य सर्वर (The Proxy) - v8.1 (Optimized)      ===
// === काम: वीडियो को खुद स्ट्रीम करके यूजर को दिखाना (ब्लॉकिंग को बायपास करना) ===
// === ★★★ समाधान: Firebase कोटा की समस्या को ठीक किया गया ★★★ ===
// ====================================================================

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const path = require('path');
// ★★★ नया ज़रूरी टूल: वीडियो को स्ट्रीम (प्रॉक्सी) करने के लिए ★★★
// सुनिश्चित करें कि यह 'package.json' में है या 'npm install request' चलाएं
const request = require('request');

// Express ऐप को शुरू करें
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(path.join(__dirname, '')));

let db;

// Firebase से कनेक्ट करें (कोई बदलाव नहीं)
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('Firebase डेटाबेस से सफलतापूर्वक कनेक्ट हो गया है।');
} catch (error) {
    console.error('Firebase Admin SDK शुरू करने में त्रुटि:', error.message);
    db = null;
}

// ====================================================================
// === API Endpoints (यहीं से ऐप को सारा डेटा मिलता है) ===
// ====================================================================

// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// ★★★ नया प्रॉक्सी Endpoint: यही है वह गुप्त सुरंग जो ISP ब्लॉकिंग को बायपास करेगी ★★★
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
app.get('/api/stream', (req, res) => {
    // index.html से भेजे गए वीडियो URL को प्राप्त करें
    const externalUrl = req.query.url;

    if (!externalUrl) {
        return res.status(400).send('Error: URL is required.');
    }
    
    console.log(`प्रॉक्सी के माध्यम से स्ट्रीमिंग का अनुरोध: ${externalUrl}`);

    try {
        // यह लाइन जादू करती है:
        // 1. req.pipe(...) -> यूजर से आने वाले अनुरोध को लेता है।
        // 2. request(externalUrl) -> सर्वर से बाहरी URL (जैसे vidsrc.me) पर एक नया अनुरोध भेजता है।
        // 3. .pipe(res) -> बाहरी URL से मिलने वाले जवाब (वीडियो डेटा) को सीधे यूजर के ब्राउज़र पर वापस भेज देता है।
        // आपका ब्राउज़र केवल onrender.com से बात करता है, vidsrc.me से नहीं।
        req.pipe(request(externalUrl)).on('error', (err) => {
            console.error(`प्रॉक्सी अनुरोध में त्रुटि: ${externalUrl}`, err);
            res.status(500).send('Error: Failed to stream content.');
        }).pipe(res);
    } catch (error) {
        console.error(`स्ट्रीमिंग प्रॉक्सी में गंभीर त्रुटि: ${externalUrl}`, error);
        res.status(500).send('Error: Stream failed unexpectedly.');
    }
});


// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// ★★★ यही है वह फाइनल बदलाव जो आपकी समस्या को 100% ठीक कर देगा ★★★
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// मीडिया लाने वाला API (बदला हुआ - अब यह कोटा खत्म नहीं करेगा)
app.get('/api/media-by-genre', async (req, res) => {
    if (!db) {
        return res.status(503).json({ error: 'Database service is unavailable.' });
    }
    try {
        const { genreId, mediaType } = req.query;
        if (!genreId || !mediaType) {
            return res.status(400).json({ error: 'Genre ID और Media Type दोनों ज़रूरी हैं.' });
        }
        const collectionName = mediaType === 'movie' ? 'Available_Movies' : 'Available_WebSeries';
        
        // --- ★★★ मुख्य बदलाव यहाँ है ★★★ ---
        // पुराना तरीका: पूरी की पूरी कलेक्शन (हज़ारों फिल्में) डाउनलोड करना। (बहुत खर्चीला)
        // const snapshot = await db.collection(collectionName).get();

        // नया और स्मार्ट तरीका: Firebase को बताना कि हमें सिर्फ 20 आइटम चाहिए।
        let query;
        const limit = 20; // हम एक बार में सिर्फ 20 आइटम भेजेंगे।

        if (genreId === 'latest') {
            // अगर 'latest' चाहिए, तो हाल ही में रिलीज़ हुई फिल्मों को ढूंढो और 20 दिखाओ
            query = db.collection(collectionName)
                      .orderBy('releaseDate', 'desc')
                      .limit(limit);
        } else {
            // अगर कोई खास कैटेगरी चाहिए, तो उस कैटेगरी की 20 फिल्में ढूंढो
            const numericGenreId = parseInt(genreId);
            query = db.collection(collectionName)
                      .where('genres', 'array-contains', numericGenreId)
                      .limit(limit);
        }

        const snapshot = await query.get();
        // --- ★★★ बदलाव खत्म ★★★ ---

        if (snapshot.empty) {
            return res.status(200).json({ results: [] });
        }

        // अब हमें सिर्फ 20 आइटम मिले हैं, तो उन्हें सीधे भेज देंगे
        let finalResults = [];
        snapshot.forEach(doc => {
            finalResults.push(doc.data());
        });

        res.status(200).json({ results: finalResults });

    } catch (error) {
        console.error(`कैटेगरी के हिसाब से मीडिया लाने में त्रुटि:`, error);
        res.status(500).json({ error: 'सर्वर से मीडिया लाने में विफल.' });
    }
});

// TV Details API (कोई बदलाव नहीं, यह वैसे ही काम करेगा)
app.get('/api/tv-details', async (req, res) => {
    const { seriesId } = req.query;
    const TMDB_API_KEY = process.env.TMDB_API_KEY; 

    if (!TMDB_API_KEY) {
        return res.status(500).json({ error: 'TMDB API कुंजी सर्वर पर सेट नहीं है.' });
    }
    if (!seriesId) {
        return res.status(400).json({ error: 'Series ID ज़रूरी है.' });
    }

    try {
        const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${TMDB_API_KEY}&language=en-US`;
        const tmdbResponse = await fetch(url);
        if (!tmdbResponse.ok) {
            throw new Error(`TMDB API returned status: ${tmdbResponse.status}`);
        }
        const data = await tmdbResponse.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('TMDB से सीरीज़ की जानकारी लाने में त्रुटि:', error);
        res.status(500).json({ error: 'TMDB से कनेक्ट करने में सर्वर पर त्रुटि.' });
    }
});

// YouTube API (कोई बदलाव नहीं, यह वैसे ही काम करेगा)
app.get('/api/youtube', async (req, res) => {
    if (!process.env.YOUTUBE_API_KEY) {
        return res.status(500).json({ error: 'YouTube API कुंजी सर्वर पर सेट नहीं है.' });
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
            return res.status(400).json({ error: 'अमान्य YouTube API प्रकार.' });
    }

    try {
        const youtubeResponse = await fetch(apiUrl);
        const data = await youtubeResponse.json();

        if (!youtubeResponse.ok || data.error) {
            console.error('YouTube API से त्रुटि:', data.error);
            return res.status(youtubeResponse.status).json({ error: data.error ? data.error.message : 'YouTube API से डेटा लाने में विफल.' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('YouTube API को कॉल करने में त्रुटि:', error);
        res.status(500).json({ error: 'YouTube API से कनेक्ट करने में सर्वर पर त्रुटि.' });
    }
});


// ====================================================================
// === फाइनल सेटअप (कोई बदलाव नहीं) ===
// ====================================================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('/////////////////////////////////////////////////////');
    if (db) {
        console.log(`===> 🚀 Shubhzone प्रॉक्सी सर्वर सफलतापूर्वक चल रहा है! 🚀`);
    } else {
        console.log(`===> ⚠️ Shubhzone सर्वर चल रहा है, लेकिन Firebase से कनेक्ट नहीं हो सका.`);
    }
    console.log(`===> पोर्ट ${PORT} पर सुना जा रहा है.`);
    console.log('/////////////////////////////////////////////////////');
});
