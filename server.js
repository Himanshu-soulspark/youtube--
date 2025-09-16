// ====================================================================
// === Shubhzone - मुख्य सर्वर (The Proxy) - v8.2 (Final Debug)    ===
// === काम: वीडियो को खुद स्ट्रीम करके यूजर को दिखाना (ब्लॉकिंग को बायपास करना) ===
// === ★★★ समाधान: साइलेंट एरर को पकड़ने के लिए बेहतर लॉगिंग ★★★ ===
// ====================================================================

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const path = require('path');
const request = require('request');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(path.join(__dirname, '')));

let db;

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

// प्रॉक्सी Endpoint (कोई बदलाव नहीं)
app.get('/api/stream', (req, res) => {
    const externalUrl = req.query.url;
    if (!externalUrl) return res.status(400).send('Error: URL is required.');
    console.log(`प्रॉक्सी के माध्यम से स्ट्रीमिंग का अनुरोध: ${externalUrl}`);
    try {
        req.pipe(request(externalUrl)).on('error', (err) => {
            console.error(`प्रॉक्सी अनुरोध में त्रुटि: ${externalUrl}`, err);
            res.status(500).send('Error: Failed to stream content.');
        }).pipe(res);
    } catch (error) {
        console.error(`स्ट्रीमिंग प्रॉक्सी में गंभीर त्रुटि: ${externalUrl}`, error);
        res.status(500).send('Error: Stream failed unexpectedly.');
    }
});

// मीडिया लाने वाला API (★ सिर्फ Error Logging में बदलाव किया गया है ★)
app.get('/api/media-by-genre', async (req, res) => {
    if (!db) return res.status(503).json({ error: 'Database service is unavailable.' });
    
    try {
        const { genreId, mediaType } = req.query;
        if (!genreId || !mediaType) return res.status(400).json({ error: 'Genre ID और Media Type दोनों ज़रूरी हैं.' });
        
        const collectionName = mediaType === 'movie' ? 'Available_Movies' : 'Available_WebSeries';
        
        let query;
        const limit = 20;

        if (genreId === 'latest') {
            query = db.collection(collectionName).orderBy('releaseDate', 'desc').limit(limit);
        } else {
            const numericGenreId = parseInt(genreId);
            query = db.collection(collectionName).where('genres', 'array-contains', numericGenreId).orderBy('releaseDate', 'desc').limit(limit);
        }

        const snapshot = await query.get();
        
        let finalResults = [];
        snapshot.forEach(doc => finalResults.push(doc.data()));
        
        res.status(200).json({ results: finalResults });

    } catch (error) {
        // --- ★★★ मुख्य बदलाव यहाँ है ★★★ ---
        // अब एरर लॉग्स में 100% दिखाई देगा
        console.error("\n\n!!!!!!!!!!!!!!!!!!!!!!!!! FIREBASE QUERY FAILED !!!!!!!!!!!!!!!!!!!!!!!!!");
        console.error("यह एक गंभीर त्रुटि है! इसका मतलब है कि Firestore Index गलत है या मौजूद नहीं है।");
        console.error("ERROR CODE:", error.code);
        console.error("ERROR MESSAGE:", error.details || error.message);
        console.error("अगर नीचे दिए गए मैसेज में इंडेक्स बनाने का लिंक है, तो उस पर क्लिक करें।\n\n");
        // --- ★★★ बदलाव खत्म ★★★ ---
        
        res.status(500).json({ error: 'सर्वर से मीडिया लाने में विफल.', details: error.message });
    }
});

// TV Details API (कोई बदलाव नहीं)
app.get('/api/tv-details', async (req, res) => {
    const { seriesId } = req.query;
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) return res.status(500).json({ error: 'TMDB API कुंजी सर्वर पर सेट नहीं है.' });
    if (!seriesId) return res.status(400).json({ error: 'Series ID ज़रूरी है.' });
    try {
        const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${TMDB_API_KEY}&language=en-US`;
        const tmdbResponse = await fetch(url);
        const data = await tmdbResponse.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('TMDB से सीरीज़ की जानकारी लाने में त्रुटि:', error);
        res.status(500).json({ error: 'TMDB से कनेक्ट करने में सर्वर पर त्रुटि.' });
    }
});

// YouTube API (कोई बदलाव नहीं)
app.get('/api/youtube', async (req, res) => {
    // ... (इस फंक्शन में कोई बदलाव नहीं है)
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


// फाइनल सेटअप (कोई बदलाव नहीं)
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
