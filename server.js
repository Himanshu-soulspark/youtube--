// ====================================================================
// === Shubhzone - YouTube API Server (Node.js) - ★★★ FINAL CORRECTED VERSION ★★★ ===
// ====================================================================

// 1. ज़रूरी पैकेज इम्पोर्ट करें
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// 2. Firebase एडमिन को शुरू करें
let db; 

try {
    const serviceAccount = require('/etc/secrets/firebase-credentials.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("Firebase Admin SDK सफलतापूर्वक शुरू हो गया है।");
} catch (error) {
    console.error("Firebase Admin SDK शुरू करने में विफल:", error.message);
}

// 3. सर्वर सेटअप करें
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// 4. Render के Environment Variable से YouTube API कुंजी पढ़ें
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// 5. मुख्य API रूट
app.get('/api/youtube', async (req, res) => {
    if (!db || !YOUTUBE_API_KEY) {
        console.error("त्रुटि: Firebase या YouTube API कुंजी कॉन्फ़िगर नहीं है।");
        return res.status(500).json({ error: "सर्वर ठीक से कॉन्फ़िगर नहीं है।" });
    }

    const { type, ...queryParams } = req.query;
    const safeParams = Object.keys(queryParams).sort().map(key => `${key}=${queryParams[key]}`).join('&');
    const cacheKey = Buffer.from(`${type}_${safeParams}`).toString('base64');
    const cacheRef = db.collection('youtube_cache').doc(cacheKey);

    let youtubeApiUrl;
    const baseUrl = 'https://www.googleapis.com/youtube/v3/';
    
    switch (type) {
        case 'search':
            // ★★★★★★★★★★ यही है असली समाधान ★★★★★★★★★★
            // हमने यहाँ &type=video जोड़ दिया है ताकि YouTube को हमेशा पता हो कि हम वीडियो ही ढूँढ़ रहे हैं।
            youtubeApiUrl = `${baseUrl}search?part=snippet&type=video&key=${YOUTUBE_API_KEY}&${safeParams}`;
            break;
        case 'videoDetails':
            youtubeApiUrl = `${baseUrl}videos?part=snippet,contentDetails&key=${YOUTUBE_API_KEY}&${safeParams}`;
            break;
        case 'playlists':
            youtubeApiUrl = `${baseUrl}playlists?part=snippet&key=${YOUTUBE_API_KEY}&${safeParams}`;
            break;
        case 'playlistItems':
            youtubeApiUrl = `${baseUrl}playlistItems?part=snippet&key=${YOUTUBE_API_KEY}&${safeParams}`;
            break;
        default:
            youtubeApiUrl = `${baseUrl}videos?part=snippet,contentDetails&chart=mostPopular&regionCode=IN&maxResults=20&key=${YOUTUBE_API_KEY}`;
    }

    try {
        console.log(`YouTube API को कॉल किया जा रहा है (Type: ${type})। URL: ${youtubeApiUrl}`);
        const youtubeResponse = await fetch(youtubeApiUrl, { timeout: 8000 }); 
        
        if (!youtubeResponse.ok) {
            const errorBody = await youtubeResponse.text();
            console.error(`YouTube API Error Body: ${errorBody}`);
            throw new Error(`YouTube API ने एरर दिया: ${youtubeResponse.statusText}`);
        }

        const data = await youtubeResponse.json();

        if (data.error) {
            throw new Error(`YouTube API से त्रुटि: ${data.error.message}`);
        }

        await cacheRef.set({
            data: data,
            timestamp: Date.now()
        });
        console.log(`API कॉल सफल! डेटा Firebase में कैश किया गया और भेजा गया।`);
        return res.status(200).json(data);

    } catch (error) {
        console.warn(`API कॉल विफल हुई: ${error.message}। अब Firebase कैश से डेटा लाने का प्रयास किया जा रहा है।`);
        
        try {
            const cachedDoc = await cacheRef.get();
            if (cachedDoc.exists) {
                console.log(`API विफलता के कारण बैकअप कैश का उपयोग किया गया। डेटा Firebase से भेजा गया।`);
                return res.status(200).json(cachedDoc.data().data);
            } else {
                console.error("API विफल हो गई और इस रिक्वेस्ट के लिए कोई कैश भी उपलब्ध नहीं है।");
                return res.status(503).json({ error: "Service unavailable and no cache found." });
            }
        } catch (cacheError) {
            console.error("API विफलता के बाद कैश पढ़ने में भी त्रुटि:", cacheError);
            return res.status(500).json({ error: "API and cache both failed." });
        }
    }
});

// 6. स्टैटिक फाइलें सर्व करें
const publicPath = path.join(__dirname, '');
app.use(express.static(publicPath));

// 7. किसी भी अन्य रिक्वेस्ट के लिए index.html भेजें
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 8. सर्वर शुरू करें
app.listen(port, () => {
    console.log("/////////////////////////////////////////////////////");
    console.log("===> 🚀 Shubhzone सर्वर सफलतापूर्वक चल रहा है! 🚀");
    console.log(`===> पोर्ट ${port} पर सुना जा रहा है।`);
    console.log("/////////////////////////////////////////////////////");
});
