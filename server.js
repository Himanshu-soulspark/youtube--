// ====================================================================
// === Shubhzone - API Server (Node.js) - ★★★ FINAL SECURE VERSION ★★★ ===
// === ★★★ TMDb API को सुरक्षित करने और उपलब्धता जांचने के लिए इसमें ज़रूरी बदलाव किए गए हैं ★★★ ===
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
console.log("चेतावनी: सर्वर बिना Firebase कैशिंग के चलेगा।");
}

// 3. सर्वर सेटअप करें
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// 4. Render के Environment Variable से दोनों API कुंजियाँ पढ़ें
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// ====================================================================
// === YouTube API रूट (इसमें कोई बदलाव नहीं किया गया है) ===
// ====================================================================
app.get('/api/youtube', async (req, res) => {
if (!YOUTUBE_API_KEY) {
console.error("त्रुटि: YOUTUBE_API_KEY एनवायरनमेंट वेरिएबल सेट नहीं है।");
return res.status(500).json({ error: "सर्वर ठीक से कॉन्फ़िगर नहीं है। YouTube API कुंजी गायब है।" });
}
const { type, ...queryParams } = req.query;
const safeParams = Object.keys(queryParams).sort().map(key => `${key}=${queryParams[key]}`).join('&');
const cacheKey = Buffer.from(`youtube_${type}_${safeParams}`).toString('base64');
let cacheRef;
if (db) {
cacheRef = db.collection('api_cache').doc(cacheKey);
}
let youtubeApiUrl;
const baseUrl = 'https://www.googleapis.com/youtube/v3/';
switch (type) {
case 'search':
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
console.log(`YouTube API को कॉल किया जा रहा है (Type: ${type})।`);
const youtubeResponse = await fetch(youtubeApiUrl, { timeout: 8000 });
if (!youtubeResponse.ok) { const errorBody = await youtubeResponse.text(); throw new Error(`YouTube API ने एरर दिया: ${youtubeResponse.statusText}`); }
const data = await youtubeResponse.json();
if (data.error) { throw new Error(`YouTube API से त्रुटि: ${data.error.message}`); }
if (db && cacheRef) { await cacheRef.set({ data: data, timestamp: Date.now() }); console.log(`YouTube API कॉल सफल! डेटा कैश किया गया।`); }
return res.status(200).json(data);
} catch (error) {
console.warn(`YouTube API कॉल विफल हुई: ${error.message}। कैश से प्रयास किया जा रहा है।`);
if (db && cacheRef) {
try {
const cachedDoc = await cacheRef.get();
if (cachedDoc.exists) { console.log(`बैकअप कैश का उपयोग किया गया।`); return res.status(200).json(cachedDoc.data().data); }
else { return res.status(503).json({ error: "Service unavailable and no cache found." }); }
} catch (cacheError) { return res.status(500).json({ error: "API and cache both failed." }); }
} else { return res.status(503).json({ error: "Service unavailable and caching is not configured." }); }
}
});

// ====================================================================
// ★★★ ज़रूरी बदलाव: TMDb API के लिए उपलब्धता की जांच के साथ सुरक्षित रूट ★★★
// ====================================================================

// ★★★ नया हेल्पर फंक्शन: VidSrc पर मीडिया की उपलब्धता की जांच करने के लिए ★★★
async function checkVidSrcAvailability(item, type) {
    // हर जांच के लिए 5-सेकंड का टाइमआउट सेट करने के लिए AbortController
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 5000);

    try {
        let checkUrl;
        if (type === 'tv') {
            // वेब सीरीज़ सीधे TMDB ID का उपयोग करती हैं
            checkUrl = `https://vidsrc.xyz/embed/tv?tmdb=${item.id}`;
        } else {
            // मूवीज़ के लिए IMDB ID की आवश्यकता होती है, जिसके लिए एक अतिरिक्त फ़ेच कॉल की आवश्यकता होती है
            const externalIdsResponse = await fetch(`https://api.themoviedb.org/3/movie/${item.id}/external_ids?api_key=${TMDB_API_KEY}`, { signal: controller.signal });
            if (!externalIdsResponse.ok) {
                console.warn(`Movie ${item.id} के लिए IMDB ID नहीं मिली।`);
                return false; // IMDB ID के बिना जांच नहीं कर सकते
            }
            const externalIds = await externalIdsResponse.json();
            if (!externalIds.imdb_id) {
                return false; // कोई IMDB ID उपलब्ध नहीं है
            }
            checkUrl = `https://vidsrc.xyz/embed/movie?imdb=${externalIds.imdb_id}`;
        }

        // कुशलता के लिए HEAD रिक्वेस्ट का उपयोग करें - हमें केवल यह जानना है कि पेज मौजूद है या नहीं
        const response = await fetch(checkUrl, { method: 'HEAD', signal: controller.signal });

        // 200 OK स्टेटस का मतलब है कि एम्बेड पेज मौजूद है और उपलब्ध है।
        return response.ok;

    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn(`VidSrc जांच ${type} ID ${item.id} के लिए टाइम आउट हो गई।`);
        } else {
            console.error(`${type} ID ${item.id} के लिए VidSrc की जांच करते समय त्रुटि:`, error.message);
        }
        return false;
    } finally {
        clearTimeout(timeout);
    }
}


app.get('/api/tmdb', async (req, res) => {
    // जांचें कि TMDb API कुंजी मौजूद है या नहीं
    if (!TMDB_API_KEY) {
        console.error("त्रुटि: TMDB_API_KEY एनवायरनमेंट वेरिएबल सेट नहीं है।");
        return res.status(500).json({ error: "सर्वर ठीक से कॉन्फ़िगर नहीं है। TMDb API कुंजी गायब है।" });
    }

    const { endpoint, ...queryParams } = req.query;

    if (!endpoint) {
        return res.status(400).json({ error: "TMDb endpoint is required." });
    }

    const paramsString = new URLSearchParams(queryParams).toString();
    const tmdbApiUrl = `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&${paramsString}`;

    try {
        console.log(`TMDb API को कॉल किया जा रहा है (Endpoint: ${endpoint})।`);
        const tmdbResponse = await fetch(tmdbApiUrl);

        if (!tmdbResponse.ok) {
            const errorData = await tmdbResponse.json();
            console.error("TMDb API से त्रुटि:", errorData);
            return res.status(tmdbResponse.status).json(errorData);
        }

        const data = await tmdbResponse.json();
        
        // ★★★ नया बदलाव: अगर रिजल्ट्स एक सूची है, तो हर आइटम की उपलब्धता की जांच करें ★★★
        // ★★★ यह अब एक बार में केवल एक कैटेगरी के लिए चलेगा, जिससे सर्वर पर लोड कम होगा ★★★
        if (data.results && Array.isArray(data.results)) {
            console.log(`VidSrc पर ${data.results.length} आइटम्स के लिए उपलब्धता की जांच की जा रही है...`);

            // मीडिया का प्रकार (movie या tv) endpoint से पता करें
            const mediaType = endpoint.includes('movie') ? 'movie' : 'tv';

            const availabilityChecks = data.results.map(item => checkVidSrcAvailability(item, mediaType));
            
            const checkResults = await Promise.all(availabilityChecks);

            const availableItems = data.results.filter((_, index) => checkResults[index]);
            
            console.log(`${availableItems.length} / ${data.results.length} आइटम्स VidSrc पर उपलब्ध पाए गए।`);

            data.results = availableItems;
        }
        
        // TMDb से मिले फ़िल्टर किए गए डेटा को सीधे index.html पर वापस भेज दें
        return res.status(200).json(data);

    } catch (error) {
        console.error("TMDb API को कॉल करने में सर्वर पर त्रुटि:", error);
        return res.status(500).json({ error: "Failed to fetch data from TMDb." });
    }
});
// ★★★ नया बदलाव यहाँ समाप्त होता है ★★★
// ====================================================================

// 6. स्टैटिक फाइलें (जैसे index.html) सर्व करें
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
