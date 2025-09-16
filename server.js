// ====================================================================
// === Shubhzone - मुख्य सर्वर (The Manager) v2.0 ===
// === काम: यूजर को ऐप दिखाना, डेटाबेस और API से बात करना ===
// ====================================================================

// 1. ज़रूरी टूल्स को इम्पोर्ट करें
const express = require('express');
const cors = require('cors');
const admin = 'firebase-admin';
const fetch = 'node-fetch';
const path = 'path';

// 2. Express ऐप को शुरू करें
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(path.join(__dirname, ''))); // index.html जैसी फाइलों के लिए

// 3. Firebase से कनेक्ट करें
// यह Render के Environment Variable से आपकी Firebase Credentials उठाएगा
try {
  if (!process.env.FIREBASE_CREDENTIALS) {
    throw new Error('FIREBASE_CREDENTIALS एनवायरनमेंट वेरिएबल सेट नहीं है!');
  }
  const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  const db = admin.firestore();
  console.log('Firebase डेटाबेस से सफलतापूर्वक कनेक्ट हो गया है।');
} catch (error) {
  console.error('Firebase Admin SDK को शुरू करने में गंभीर त्रुटि:', error.message);
}

// ====================================================================
// === API Endpoints (यहीं से ऐप को सारा डेटा मिलता है) ===
// ====================================================================

// ★★★ नया और ज़रूरी API: वर्किंग लिंक वाली फिल्में डेटाबेस से लाएगा ★★★
app.get('/api/get-available-movies', async (req, res) => {
  try {
    const moviesRef = db.collection('available_movies');
    // हाल ही में चेक की गई फिल्मों को सबसे ऊपर दिखाएगा
    const snapshot = await moviesRef.orderBy('lastChecked', 'desc').get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const movies = [];
    snapshot.forEach(doc => {
      movies.push(doc.data());
    });

    res.status(200).json(movies);
  } catch (error) {
    console.error('Firebase से फिल्में लाने में त्रुटि:', error);
    res.status(500).json({ error: 'सर्वर से फिल्में लाने में विफल।' });
  }
});

// ★★★ नया API: लोकप्रिय वेब-सीरीज़ TMDb से लाएगा ★★★
app.get('/api/get-web-series', async (req, res) => {
  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({ error: 'TMDB API कुंजी सर्वर पर सेट नहीं है।' });
    }
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    // 2021 के बाद की, भारत में लोकप्रिय वेब-सीरीज़
    const seriesApiUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&language=hi-IN&region=IN&sort_by=popularity.desc&primary_release_date.gte=2021-01-01&page=1`;
    
    const response = await fetch(seriesApiUrl);
    if (!response.ok) {
      throw new Error(`TMDb API से त्रुटि: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('TMDb से वेब-सीरीज़ लाने में त्रुटि:', error);
    res.status(500).json({ error: 'सर्वर से वेब-सीरीज़ लाने में विफल।' });
  }
});


// ★★★ फिक्स किया हुआ YouTube API: अब यह सही से काम करेगा ★★★
app.get('/api/youtube', async (req, res) => {
  if (!process.env.YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API कुंजी सर्वर पर सेट नहीं है।' });
  }
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  
  const { type, ...queryParams } = req.query;
  const baseUrl = 'https://www.googleapis.com/youtube/v3/';
  let apiUrl = '';

  // URLSearchParams का इस्तेमाल करना ज़्यादा सुरक्षित और भरोसेमंद है
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
      return res.status(youtubeResponse.status).json({ error: data.error.message || 'YouTube API से डेटा लाने में विफल।' });
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

// किसी भी और रिक्वेस्ट के लिए index.html भेजें ताकि ऐप सही से लोड हो
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// सर्वर को सुनना शुरू करें
app.listen(PORT, () => {
  console.log('/////////////////////////////////////////////////////');
  console.log(`===> 🚀 Shubhzone सर्वर v2.0 सफलतापूर्वक चल रहा है! 🚀`);
  console.log(`===> पोर्ट ${PORT} पर सुना जा रहा है।`);
  console.log('/////////////////////////////////////////////////////');
});
