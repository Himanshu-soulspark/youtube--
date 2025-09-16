// ====================================================================
// === Shubhzone - मुख्य सर्वर (The Smart Cache) - v9.0 (Optimized) ===
// === काम: Firebase डेटा को मेमोरी में रखकर कोटा बचाना ===
// ====================================================================

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const path = require('path');
const request = require('request');

const app = express();
const PORT = process.env.PORT || 10000;
app.use(cors());
app.use(express.static(path.join(__dirname, '')));

let db;
// ★★★ नया स्मार्ट तरीका: डेटा को सर्वर की मेमोरी में रखें ★★★
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

// ★★★ नया फंक्शन: Firebase से सारा डेटा एक बार में लोड करके मेमोरी में रखने के लिए ★★★
async function loadDataIntoCache() {
    if (!db) return;
    try {
        console.log('कैश को रिफ्रेश किया जा रहा है...');
        const movieSnapshot = await db.collection('Available_Movies').get();
        movieCache = movieSnapshot.docs.map(doc => doc.data());
        
        const seriesSnapshot = await db.collection('Available_WebSeries').get();
        seriesCache = seriesSnapshot.docs.map(doc => doc.data());

        cacheTimestamp = new Date();
        console.log(`कैश सफलतापूर्वक अपडेट हुआ: ${movieCache.length} फिल्में, ${seriesCache.length} वेब-सीरीज़।`);
    } catch (error) {
        console.error("कैश में डेटा लोड करने में विफल:", error);
    }
}

// हर 15 मिनट में कैश को अपने आप रिफ्रेश करें
setInterval(loadDataIntoCache, 15 * 60 * 1000); 

// ====================================================================
// === API Endpoints (अब मेमोरी से डेटा देंगे) ===
// ====================================================================

app.get('/api/stream', (req, res) => { /* Unchanged */ });

app.get('/api/media-by-genre', async (req, res) => {
    try {
        const { genreId, mediaType } = req.query;
        if (!genreId || !mediaType) return res.status(400).json({ error: 'Genre ID और Media Type दोनों ज़रूरी हैं.' });

        // ★★★ बदला हुआ लॉजिक: Firebase की जगह मेमोरी से डेटा लें ★★★
        const sourceCache = mediaType === 'movie' ? movieCache : seriesCache;
        
        if (sourceCache.length === 0) {
            console.warn("कैश खाली है, दोबारा लोड करने की कोशिश की जा रही है...");
            await loadDataIntoCache(); // अगर कैश खाली है तो एक बार और कोशिश करें
        }

        let filteredMedia = [];
        if (genreId === 'latest') {
            filteredMedia = [...sourceCache].sort((a, b) => new Date(b.lastChecked) - new Date(a.lastChecked));
        } else {
            const numericGenreId = parseInt(genreId);
            filteredMedia = sourceCache.filter(media => 
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
    console.log(`===> 🚀 Shubhzone स्मार्ट-कैश सर्वर सफलतापूर्वक चल रहा है! 🚀`);
    console.log(`===> पोर्ट ${PORT} पर सुना जा रहा है.`);
    console.log('/////////////////////////////////////////////////////');
});
