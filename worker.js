// ====================================================================
// === Shubhzone - ऑटोमेटेड वर्कर (The Brain) ===
// === काम: इंटरनेट से वर्किंग मूवी लिंक ढूंढना और डेटाबेस में सेव करना ===
// ====================================================================

// 1. ज़रूरी टूल्स को इम्पोर्ट करें
const puppeteer = require('puppeteer');
const cron = require('node-cron');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
require('dotenv').config(); // API Key जैसी सीक्रेट जानकारी लोड करने के लिए

// 2. Firebase से कनेक्ट करें
// नोट: यह credentials आपको Firebase से मिलेंगे और .env फाइल में रखने होंगे
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
console.log('Firebase डेटाबेस से सफलतापूर्वक कनेक्ट हो गया है।');

// 3. TMDb API की जानकारी
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// ====================================================================
// === मुख्य फंक्शन: फिल्में ढूंढने और सेव करने का काम यहीं होता है ===
// ====================================================================
async function findAndSaveMovies() {
  console.log('----------------------------------------------------');
  console.log('वर्कर शुरू हो रहा है... नई फिल्मों की तलाश जारी है...');
  console.log('----------------------------------------------------');

  let browser;
  try {
    // 4. एक ऑटोमेटेड ब्राउज़र (Puppeteer) लॉन्च करें
    // Render पर चलाने के लिए ये arguments बहुत ज़रूरी हैं
    browser = await puppeteer.launch({
      headless: "new", // ब्राउज़र को बैकग्राउंड में चलाता है
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    // पेज को एक सामान्य ब्राउज़र की तरह दिखाते हैं ताकि वेबसाइट ब्लॉक न करे
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // 5. TMDb से 2021 के बाद की लोकप्रिय फिल्मों की लिस्ट निकालें
    console.log('TMDb से लोकप्रिय फिल्मों की लिस्ट मंगाई जा रही है...');
    const movieApiUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=hi-IN&region=IN&sort_by=popularity.desc&primary_release_date.gte=2021-01-01&page=1`;
    const response = await fetch(movieApiUrl);
    const movieData = await response.json();
    const moviesToCheck = movieData.results;

    console.log(`जांच के लिए ${moviesToCheck.length} फिल्में मिली हैं।`);

    // 6. एक-एक करके हर फिल्म का वर्किंग लिंक ढूंढें
    for (const movie of moviesToCheck) {
      try {
        const movieTitle = movie.title;
        const movieYear = movie.release_date.substring(0, 4);
        console.log(`\n[जांच जारी है]: "${movieTitle} (${movieYear})"`);

        // हम VidSrc.to को उदाहरण के तौर पर इस्तेमाल कर रहे हैं
        const searchUrl = `https://vidsrc.to/embed/movie/${movie.id}`;
        
        // पेज पर जाएं और देखें कि मूवी उपलब्ध है या नहीं
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // यह चेक करें कि पेज पर "404" या "Not Found" तो नहीं लिखा है
        const content = await page.content();
        if (content.includes('404 Not Found') || content.includes('movie not found')) {
          console.log(`[परिणाम]: "${movieTitle}" इस सर्वर पर नहीं मिली।`);
          continue; // अगली मूवी पर जाएं
        }

        // अगर मूवी मिल गई, तो उसका डेटा Firebase में सेव करें
        const movieRecord = {
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
          workingLink: searchUrl, // हमें वर्किंग लिंक मिल गया है!
          lastChecked: new Date()
        };

        // डेटाबेस में मूवी को उसकी TMDB ID से सेव करें ताकि डुप्लीकेट न बने
        await db.collection('available_movies').doc(String(movie.id)).set(movieRecord);
        console.log(`✅ [सफलता]: "${movieTitle}" का वर्किंग लिंक मिला और डेटाबेस में सेव कर दिया गया!`);

      } catch (error) {
        console.error(`त्रुटि: "${movie.title}" की जांच के दौरान समस्या हुई:`, error.message);
      }
    }

  } catch (error) {
    console.error('वर्कर में एक बड़ी त्रुटि हुई:', error);
  } finally {
    // 7. काम खत्म होने पर ब्राउज़र को हमेशा बंद करें
    if (browser) {
      await browser.close();
      console.log('\nऑटोमेटेड ब्राउज़र बंद कर दिया गया है।');
    }
    console.log('----------------------------------------------------');
    console.log('वर्कर ने अपना काम पूरा कर लिया है। अगले रन का इंतज़ार है...');
    console.log('----------------------------------------------------');
  }
}

// ====================================================================
// === शेड्यूलर: यह वर्कर को हर 6 घंटे में अपने आप चलाएगा ===
// ====================================================================
// '0 */6 * * *' का मतलब है "हर 6 घंटे में"।
cron.schedule('0 */6 * * *', () => {
  console.log('शेड्यूल के अनुसार, वर्कर को चलाने का समय हो गया है!');
  findAndSaveMovies();
});

// पहली बार सर्वर शुरू होते ही तुरंत वर्कर को एक बार चलाएं
findAndSaveMovies();
