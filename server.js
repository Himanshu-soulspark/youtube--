// ====================================================================
// === Shubhzone - मुख्य सर्वर (The Manager) v3.2 (Final Fix)      ===
// === काम: Firebase डेटा को सर्वर पर ही फ़िल्टर करना (Drop-in Replacement) ===
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
    // यह सुनिश्चित करें कि Render.com पर FIREBASE_CREDENTIALS एनवायरनमेंट वेरिएबल सही से सेट है
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
    // अगर Firebase कनेक्ट नहीं होता है, तो सर्वर को क्रैश होने से रोकें
    // और बाद की रिक्वेस्ट पर एरर भेजें।
    db = null; 
}

// ====================================================================
// === API Endpoints (यहीं से ऐप को सारा डेटा मिलता है) ===
// ====================================================================

// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// ★★★ बदला हुआ API: यह अब सर्वर पर ही डेटा फ़िल्टर करता है (यही मुख्य बदलाव है) ★★★
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
app.get('/api/media-by-genre', async (req, res) => {
    // अगर Firebase शुरू नहीं हो पाया, तो एरर भेजें
    if (!db) {
        return res.status(503).json({ error: 'Database service is unavailable.' });
    }

    try {
        const { genreId, mediaType } = req.query;

        if (!genreId || !mediaType) {
            return res.status(400).json({ error: 'Genre ID और Media Type दोनों ज़रूरी हैं।' });
        }

        const collectionName = mediaType === 'movie' ? 'Available_Movies' : 'Available_WebSeries';
        
        // स्टेप 1: Firebase से उस कलेक्शन का सारा डेटा ले आओ
        const snapshot = await db.collection(collectionName).get();

        if (snapshot.empty) {
            // अगर कलेक्शन खाली है, तो एक खाली results ऐरे भेजें
            return res.status(200).json({ results: [] }); 
        }

        let allMedia = [];
        snapshot.forEach(doc => {
            allMedia.push(doc.data());
        });

        let filteredMedia = [];

        // स्टेप 2: अब सर्वर पर डेटा को फ़िल्टर करो
        if (genreId === 'latest') {
            // 'latest' कैटेगरी के लिए, हम सभी आइटम को ही फ़िल्टर किया हुआ मान लेंगे
            // इन्हें बाद में 20 तक सीमित कर दिया जाएगा
            filteredMedia = allMedia;
        } else {
            // बाकी सभी कैटेगरी (जैसे Action, Comedy) के लिए, एक-एक आइटम को चेक करो
            const numericGenreId = parseInt(genreId);
            filteredMedia = allMedia.filter(media => 
                // यह सुरक्षा जाँच सुनिश्चित करती है कि अगर किसी मूवी में 'genres' फ़ील्ड नहीं है तो सर्वर क्रैश न हो
                media.genres && Array.isArray(media.genres) && media.genres.includes(numericGenreId)
            );
        }
        
        // स्टेप 3: हर कैटेगरी की सिर्फ 20 आइटम भेजें ताकि ऐप तेज चले
        const finalResults = filteredMedia.slice(0, 20);

        // स्टेप 4: डेटा को उसी फॉर्मेट में भेजें जिसकी index.html को उम्मीद है
        res.status(200).json({ results: finalResults });

    } catch (error) {
        console.error(`कैटेगरी के हिसाब से मीडिया लाने में त्रुटि [${mediaType}, ${genreId}]:`, error);
        res.status(500).json({ error: 'सर्वर से मीडिया लाने में विफल।' });
    }
});


// ★★★ वेब-सीरीज़ के सीज़न और एपिसोड की जानकारी के लिए TMDB API (कोई बदलाव नहीं) ★★★
app.get('/api/tv-details', async (req, res) => {
    const { seriesId } = req.query;
    // यह सुनिश्चित करें कि Render.com पर TMDB_API_KEY एनवायरनमेंट वेरिएबल सेट है
    const TMDB_API_KEY = process.env.TMDB_API_KEY; 

    if (!TMDB_API_KEY) {
        return res.status(500).json({ error: 'TMDB API कुंजी सर्वर पर सेट नहीं है।' });
    }
    if (!seriesId) {
        return res.status(400).json({ error: 'Series ID ज़रूरी है।' });
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
        res.status(500).json({ error: 'TMDB से कनेक्ट करने में सर्वर पर त्रुटि।' });
    }
});


// ★★★ YouTube API (इसमें कोई बदलाव नहीं किया गया है, यह वैसे ही काम करेगा) ★★★
app.get('/api/youtube', async (req, res) => {
    // यह सुनिश्चित करें कि Render.com पर YOUTUBE_API_KEY एनवायरनमेंट वेरिएबल सेट है
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
// === फाइनल सेटअप: ऐप को चलाना (कोई बदलाव नहीं) ===
// ====================================================================

// यह सुनिश्चित करता है कि ऐप को रीफ़्रेश करने पर हमेशा index.html फ़ाइल ही खुले
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log('/////////////////////////////////////////////////////');
    if (db) {
        console.log(`===> 🚀 Shubhzone सर्वर (Final Fix) सफलतापूर्वक चल रहा है! 🚀`);
    } else {
        console.log(`===> ⚠️ Shubhzone सर्वर चल रहा है, लेकिन Firebase से कनेक्ट नहीं हो सका। ⚠️`);
    }
    console.log(`===> पोर्ट ${PORT} पर सुना जा रहा है।`);
    console.log('/////////////////////////////////////////////////////');
});
