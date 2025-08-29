// ====================================================================
// === Shubhzone - YouTube API Server (Node.js) - FINAL VERSION ===
// === ★★★ Firebase कनेक्शन की समस्या को ठीक किया गया ★★★ ===
// ====================================================================

// 1. ज़रूरी पैकेज इम्पोर्ट करें
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// 2. Firebase एडमिन को शुरू करें
let db; // db को बाहर डिफाइन करें ताकि इसे कहीं भी इस्तेमाल किया जा सके

try {
    // <<< यही वह लाइन है जिसे बदलना है
    // Render की Secret File को उसके सही पते से पढ़ें
    const serviceAccount = require('/etc/secrets/firebase-credentials.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    
    db = admin.firestore(); // कनेक्शन सफल होने के बाद ही db को इनिशियलाइज़ करें
    console.log("Firebase Admin SDK सफलतापूर्वक शुरू हो गया है।");

} catch (error) {
    console.error("Firebase Admin SDK शुरू करने में विफल:", error.message);
    console.log("कृपया सुनिश्चित करें कि Render के Secret Files में 'firebase-credentials.json' सही ढंग से सेट है।");
}

// 3. सर्वर सेटअप करें
const app = express();
const port = process.env.PORT || 3000;

// CORS को सक्षम करें
app.use(cors());

// 4. Render के Environment Variable से YouTube API कुंजी पढ़ें
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// 5. मुख्य API रूट
app.get('/api/youtube', async (req, res) => {

    // जांचें कि Firebase ठीक से शुरू हुआ है या नहीं
    if (!db) {
        console.error("त्रुटि: Firestore डेटाबेस उपलब्ध नहीं है। Firebase कनेक्शन जांचें।");
        return res.status(500).json({ error: "सर्वर डेटाबेस से कनेक्ट नहीं हो पा रहा है।" });
    }

    if (!YOUTUBE_API_KEY) {
        console.error("त्रुटि: YOUTUBE_API_KEY एनवायरनमेंट वेरिएबल में सेट नहीं है।");
        return res.status(500).json({ error: "YouTube API कुंजी सर्वर पर कॉन्फ़िगर नहीं है।" });
    }

    // --- कस्टम कैशिंग लूप लॉजिक ---
    const counterRef = db.collection('serverState').doc('apiCounter');
    let forceApiCall = false;
    let currentCount = 0;

    try {
        const counterDoc = await counterRef.get();
        if (!counterDoc.exists) {
            await counterRef.set({ count: 0 });
            forceApiCall = true;
        } else {
            currentCount = counterDoc.data().count;
            if (currentCount < 2) {
                forceApiCall = true;
                console.log(`काउंटर है ${currentCount}. नई API कॉल की जाएगी।`);
            } else {
                console.log(`काउंटर है ${currentCount}. Firebase कैश से डेटा लाने का प्रयास किया जाएगा।`);
            }
        }
    } catch (e) {
        console.error("Firebase काउंटर पढ़ने में त्रुटि:", e);
        forceApiCall = true;
    }

    // --- YouTube API URL बनाना ---
    const { type, ...queryParams } = req.query;
    const sortedParams = Object.keys(queryParams).sort().map(key => `${key}=${queryParams[key]}`).join('&');
    
    const cacheKey = Buffer.from(`${type}_${sortedParams}`).toString('base64');
    const cacheRef = db.collection('youtube_cache').doc(cacheKey);

    if (!forceApiCall) {
        try {
            const cachedDoc = await cacheRef.get();
            if (cachedDoc.exists) {
                const cacheData = cachedDoc.data();
                const cacheAgeHours = (Date.now() - cacheData.timestamp) / (1000 * 60 * 60);
                if (cacheAgeHours < 6) {
                    console.log(`कैश हिट! '${cacheKey}' के लिए डेटा Firebase से भेजा गया।`);
                    await counterRef.set({ count: (currentCount + 1) % 5 });
                    return res.status(200).json(cacheData.data);
                }
            }
            console.log("कैश मिस या पुराना। एक नई API कॉल की जाएगी।");
        } catch (e) {
            console.error("Firebase कैश पढ़ने में त्रुटि:", e);
        }
    }
    
    // --- नई API कॉल करना ---
    let youtubeApiUrl;
    const baseUrl = 'https://www.googleapis.com/youtube/v3/';
    
    switch (type) {
        case 'search':
            youtubeApiUrl = `${baseUrl}search?part=snippet&key=${YOUTUBE_API_KEY}&${sortedParams}`;
            break;
        case 'videoDetails':
            youtubeApiUrl = `${baseUrl}videos?part=snippet,contentDetails&key=${YOUTUBE_API_KEY}&${sortedParams}`;
            break;
        case 'playlists':
            youtubeApiUrl = `${baseUrl}playlists?part=snippet&key=${YOUTUBE_API_KEY}&${sortedParams}`;
            break;
        case 'playlistItems':
            youtubeApiUrl = `${baseUrl}playlistItems?part=snippet&key=${YOUTUBE_API_KEY}&${sortedParams}`;
            break;
        default:
            youtubeApiUrl = `${baseUrl}videos?part=snippet,contentDetails&chart=mostPopular&regionCode=IN&maxResults=20&key=${YOUTUBE_API_KEY}`;
    }

    try {
        console.log(`YouTube API को कॉल किया जा रहा है: ${youtubeApiUrl}`);
        const youtubeResponse = await fetch(youtubeApiUrl);
        const data = await youtubeResponse.json();

        if (data.error) {
            console.error("YouTube API से त्रुटि:", data.error.message);
            return res.status(500).json({ error: data.error.message });
        }

        await cacheRef.set({
            data: data,
            timestamp: Date.now()
        });
        console.log(`'${cacheKey}' के लिए डेटा Firebase में कैश किया गया।`);

        await counterRef.set({ count: (currentCount + 1) % 5 });

        res.status(200).json(data);

    } catch (error) {
        console.error("YouTube API से डेटा लाने में विफल:", error);
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
