// ====================================================================
// === Shubhzone - ऑटोमेटेड वर्कर (The Brain) - v1.1 (Render Friendly) ===
// === काम: इंटरनेट से वर्किंग मूवी लिंक ढूंढना और डेटाबेस में सेव करना ===
// ====================================================================

// ★★★ बदलाव 1: puppeteer को puppeteer-core और chromium से बदलें ★★★
const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
// ★★★ बदलाव खत्म ★★★

const cron = require('node-cron');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
require('dotenv').config(); 

// Firebase से कनेक्ट करें
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    const db = admin.firestore();
    console.log('Firebase डेटाबेस से सफलतापूर्वक कनेक्ट हो गया है।');
} catch (error) {
    console.error('Firebase Admin SDK शुरू करने में त्रुटि:', error.message);
    // अगर क्रेडेंशियल नहीं हैं तो वर्कर को रोक दें
    process.exit(1); 
}

// TMDb API की जानकारी
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// ====================================================================
// === मुख्य फंक्शन: फिल्में ढूंढने और सेव करने का काम यहीं होता है ===
// ====================================================================
async function findAndSaveMovies() {
  console.log('----------------------------------------------------');
  console.log('वर्कर शुरू हो रहा है... नई फिल्मों की तलाश जारी है...');
  console.log('----------------------------------------------------');

  let browser = null; // इसे null से शुरू करें
  try {
    // ★★★ बदलाव 2: ब्राउज़र को लॉन्च करने का तरीका बदलें (हल्का वाला) ★★★
    console.log('हल्का Chromium ब्राउज़र लॉन्च किया जा रहा है...');
    browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });
    console.log('ब्राउज़र सफलतापूर्वक लॉन्च हो गया।');
    // ★★★ बदलाव खत्म ★★★

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // TMDb से 2021 के बाद की लोकप्रिय फिल्मों की लिस्ट निकालें
    console.log('TMDb से लोकप्रिय फिल्मों की लिस्ट मंगाई जा रही है...');
    const movieApiUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=hi-IN&region=IN&sort_by=popularity.desc&primary_release_date.gte=2021-01-01&page=1`;
    const response = await fetch(movieApiUrl);
    const movieData = await response.json();
    const moviesToCheck = movieData.results;

    console.log(`जांच के लिए ${moviesToCheck.length} फिल्में मिली हैं।`);

    // एक-एक करके हर फिल्म का वर्किंग लिंक ढूंढें
    for (const movie of moviesToCheck) {
      try {
        const movieTitle = movie.title;
        const movieYear = movie.release_date.substring(0, 4);
        console.log(`\n[जांच जारी है]: "${movieTitle} (${movieYear})"`);

        const searchUrl = `https://vidsrc.to/embed/movie/${movie.id}`;
        
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        const content = await page.content();
        if (content.includes('404 Not Found') || content.includes('movie not found')) {
          console.log(`[परिणाम]: "${movieTitle}" इस सर्वर पर नहीं मिली।`);
          continue;
        }

        const movieRecord = {
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path,
          releaseDate: movie.release_date,
          workingLink: searchUrl,
          lastChecked: new Date()
        };

        await db.collection('available_movies').doc(String(movie.id)).set(movieRecord);
        console.log(`✅ [सफलता]: "${movieTitle}" का वर्किंग लिंक मिला और डेटाबेस में सेव कर दिया गया!`);

      } catch (error) {
        console.error(`त्रुटि: "${movie.title}" की जांच के दौरान समस्या हुई:`, error.message);
      }
    }

  } catch (error) {
    console.error('वर्कर में एक बड़ी त्रुटि हुई:', error);
  } finally {
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
cron.schedule('0 */6 * * *', () => {
  console.log('शेड्यूल के अनुसार, वर्कर को चलाने का समय हो गया है!');
  findAndSaveMovies();
});

// पहली बार सर्वर शुरू होते ही तुरंत वर्कर को एक बार चलाएं
findAndSaveMovies();
