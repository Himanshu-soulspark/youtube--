// ====================================================================
// === Shubhzone - YouTube API Server (Node.js) - ★★★ कोटा-फर्स्ट लॉजिक संस्करण ★★★ ===
// === ★★★ यह संस्करण पहले API कोटा का उपयोग करेगा और खत्म होने पर कैश का इस्तेमाल करेगा ★★★ ===
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

    // --- ★★★ नया लॉजिक: हमेशा पहले नई API कॉल करने का प्रयास करें ★★★ ---
    let youtubeApiUrl;
    const baseUrl = 'https://www.googleapis.com/youtube/v3/';
    
    switch (type) {
        case 'search':
            youtubeApiUrl = `${baseUrl}search?part=snippet&key=${YOUTUBE_API_KEY}&${safeParams}`;
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
        console.log(`YouTube API को कॉल किया जा रहा है (Type: ${type})।`);
        const youtubeResponse = await fetch(youtubeApiUrl);
        const data = await youtubeResponse.json();

        // जांचें कि क्या API से कोई त्रुटि मिली है
        if (data.error) {
            console.warn("YouTube API से त्रुटि मिली:", data.error.message);
            
            // ★★★ मुख्य बदलाव: जांचें कि क्या यह 'कोटा खत्म' वाली त्रुटि है ★★★
            const isQuotaError = data.error.errors.some(e => e.reason === 'quotaExceeded');

            if (isQuotaError) {
                console.log("API कोटा खत्म हो गया है! Firebase कैश से डेटा लाने का प्रयास किया जा रहा है।");
                const cachedDoc = await cacheRef.get();
                if (cachedDoc.exists) {
                    console.log(`कैश हिट! कोटा खत्म होने के कारण डेटा Firebase से भेजा गया।`);
                    return res.status(200).json(cachedDoc.data().data);
                } else {
                    console.error("कोटा खत्म हो गया है और इस रिक्वेस्ट के लिए कोई कैश भी उपलब्ध नहीं है।");
                    return res.status(503).json({ error: "API quota exceeded and no cache is available." });
                }
            } else {
                // अगर कोई और तरह की त्रुटि है, तो उसे दिखाएं
                return res.status(500).json({ error: data.error.message });
            }
        }

        // अगर API कॉल सफल होती है, तो डेटा को कैश में सेव करें
        await cacheRef.set({
            data: data,
            timestamp: Date.now()
        });
        console.log(`API कॉल सफल! डेटा Firebase में कैश किया गया और भेजा गया।`);

        res.status(200).json(data);

    } catch (error) {
        console.error("YouTube API से डेटा लाने में गंभीर विफलता:", error);
        res.status(500).json({ error: "सर्वर YouTube से डेटा लाने में विफल रहा।" });
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
  console.log(`सर्वर पोर्ट ${port} पर सफलतापूर्वक चल रहा है।`);
});
