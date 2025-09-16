// ====================================================================
// === Shubhzone - सर्वर (The Ultimate) - v10.0 (Cache + Proxy)    ===
// === काम: कोटा बचाना और वीडियो ब्लॉकिंग को बायपास करना (अंतिम समाधान) ===
// ====================================================================

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const path = require('path');
const request = require('request'); // प्रॉक्सी के लिए ज़रूरी

const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.static(path.join(__dirname, '')));

let db;
// कोटा बचाने के लिए सर्वर की मेमोरी (कैश)
let movieCache = [];
let seriesCache = [];
let cacheTimestamp = null;

try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    db = admin.firestore();
    console.log('Firebase डेटाबेस से सफलतापूर्वक कनेक्ट हो गया है।');
    // सर्वर शुरू होते ही पहली बार डेटा लोड करें
    loadDataIntoCache();
} catch (error) {
    console.error('Firebase Admin SDK शुरू करने में त्रुटि:', error.message);
}

// ★★★ फंक्शन 1: कोटा बचाने वाला (स्मार्ट-कैश) ★★★
// Firebase से सारा डेटा एक बार में लोड करके मेमोरी में रखने के लिए
async function loadDataIntoCache() {
    if (!db) return;
    try {
        console.log('Firebase से डेटा लेकर कैश को रिफ्रेश किया जा रहा है...');
        const movieSnapshot = await db.collection('Available_Movies').get();
        movieCache = movieSnapshot.docs.map(doc => doc.data());
        
        const seriesSnapshot = await db.collection('Available_WebSeries').get();
        seriesCache = seriesSnapshot.docs.map(doc => doc.data());

        cacheTimestamp = new Date();
        console.log(`कैश सफलतापूर्वक अपडेट हुआ: ${movieCache.length} फिल्में, ${seriesCache.length} वेब-सीरीज़।`);
    } catch (error) {
        console.error("कैश में डेटा लोड करने में विफल:", error.message);
        // अगर कोटा खत्म है, तो यह एरर आएगा, लेकिन सर्वर चलता रहेगा
        if (error.code === 8) {
            console.error("FIREBASE QUOTA EXCEEDED! अगले 24 घंटे तक नया डेटा नहीं आएगा।");
        }
    }
}

// हर 30 मिनट में कैश को अपने आप रिफ्रेश करें
setInterval(loadDataIntoCache, 30 * 60 * 1000); 

// ====================================================================
// === API Endpoints (अब दोनों ताकतों के साथ) ===
// ====================================================================

// ★★★ फंक्शन 2: ब्लॉकिंग हटाने वाला (प्रॉक्सी) ★★★
// यह आपकी गुप्त सुरंग है
app.get('/api/stream', (req, res) => {
    const externalUrl = req.query.url;
    if (!externalUrl) {
        return res.status(400).send('Error: URL is required.');
    }
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

// ★★★ फंक्शन 3: ऐप को डेटा देने वाला (अब मेमोरी से) ★★★
app.get('/api/media-by-genre', async (req, res) => {
    try {
        const { genreId, mediaType } = req.query;
        if (!genreId || !mediaType) return res.status(400).json({ error: 'Genre ID और Media Type दोनों ज़रूरी हैं.' });

        const sourceCache = mediaType === 'movie' ? movieCache : seriesCache;
        
        // अगर सर्वर अभी-अभी चालू हुआ है और कैश खाली है, तो एक बार लोड होने का इंतज़ार करें
        if (sourceCache.length === 0 && !cacheTimestamp) {
            console.warn("कैश खाली है, पहली बार लोड होने का इंतज़ार...");
            await loadDataIntoCache();
        }

        const finalCache = mediaType === 'movie' ? movieCache : seriesCache;

        let filteredMedia = [];
        if (genreId === 'latest') {
            filteredMedia = [...finalCache].sort((a, b) => new Date(b.lastChecked) - new Date(a.lastChecked));
        } else {
            const numericGenreId = parseInt(genreId);
            filteredMedia = finalCache.filter(media => 
                media.genres && Array.isArray(media.genres) && media.genres.includes(numericGenreId)
            );
        }
        
        const finalResults = filteredMedia.slice(0, 20);
        res.status(200).json({ results: finalResults });

    } catch (error) {
        console.error(`कैटेगरी के हिसाब से मीडिया लाने में त्रुटि:`, error);
        res.status(500).json({ error: 'सर्वर से मीडिया लाने में विफल.' });
    }
});

// बाकी APIs में कोई बदलाव नहीं
app.get('/api/tv-details', async (req, res) => { /* Unchanged */ });
app.get('/api/youtube', async (req, res) => { /* Unchanged */ });

// ====================================================================
// === फाइनल सेटअप ===
// ====================================================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('/////////////////////////////////////////////////////');
    console.log(`===> 🚀 Shubhzone अल्टीमेट सर्वर (Cache+Proxy) चल रहा है! 🚀`);
    console.log(`===> पोर्ट ${PORT} पर सुना जा रहा है.`);
    console.log('/////////////////////////////////////////////////////');
});
