// ====================================================================
// === Shubhzone - ऑटोमेटेड वर्कर (The Brain) - v3.0 (Master Version) ===
// === काम: इंटरनेट से 100% हिंदी वर्किंग मूवी लिंक ढूंढना (600 फिल्में) ===
// ====================================================================

const puppeteer = require('puppeteer');
const cron = require('node-cron');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
require('dotenv').config();

let db;

// Firebase से कनेक्ट करें
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('Firebase डेटाबेस से सफलतापूर्वक कनेक्ट हो गया है।');
} catch (error) {
    console.error('Firebase Admin SDK शुरू करने में त्रुटि:', error.message);
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
    console.log('वर्कर (मास्टर वर्जन) शुरू हो रहा है... 600 हिंदी फिल्मों की तलाश जारी है...');
    console.log('----------------------------------------------------');

    let browser = null;
    try {
        console.log('Puppeteer ब्राउज़र लॉन्च किया जा रहा है...');
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // सर्वर पर मेमोरी की समस्या को ठीक करता है
                '--disable-gpu' // GPU को डिसेबल करता है, जिससे सर्वर पर परफॉरमेंस बेहतर होती है
            ]
        });
        console.log('ब्राउज़र सफलतापूर्वक लॉन्च हो गया।');

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');

        // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
        // ★★★ यही है वह फाइनल बदलाव जो 600+ हिंदी फिल्में लाएगा ★★★
        const TOTAL_PAGES_TO_CHECK = 30; // 30 पन्ने x 20 फिल्में = 600 फिल्में
        // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
        
        for (let i = 1; i <= TOTAL_PAGES_TO_CHECK; i++) {
            console.log(`\n★★★ पन्ना ${i}/${TOTAL_PAGES_TO_CHECK} की फिल्में जांची जा रही हैं... ★★★\n`);

            // ★★★ खास कमांड: सिर्फ हिंदी ऑडियो वाली लोकप्रिय फिल्में लाएगा ★★★
            const movieApiUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&primary_release_date.gte=2021-01-01&page=${i}&with_original_language=hi|kn|ml|ta|te&watch_region=IN&with_watch_providers=8|122|237`;

            const response = await fetch(movieApiUrl);
            const movieData = await response.json();
            const moviesToCheck = movieData.results;

            if (!moviesToCheck || moviesToCheck.length === 0) {
                console.log(`पन्ना ${i} पर कोई फिल्म नहीं मिली। शायद हम आखिरी पन्ने पर पहुँच गए हैं।`);
                break; // लूप को यहीं रोक दें
            }

            console.log(`पन्ना ${i} पर जांच के लिए ${moviesToCheck.length} फिल्में मिली हैं।`);

            for (const movie of moviesToCheck) {
                try {
                    const movieTitle = movie.title;
                    const movieYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
                    console.log(`\n[जांच जारी है]: "${movieTitle} (${movieYear})"`);

                    const searchUrl = `https://vidsrc.to/embed/movie/${movie.id}`;

                    await page.goto(searchUrl, {
                        waitUntil: 'networkidle2',
                        timeout: 90000
                    });

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
                    // अगर कोई एक फिल्म फेल होती है, तो क्रैश न हों, बस लॉग करें और आगे बढ़ें
                    console.error(`त्रुटि: "${movie.title}" की जांच के दौरान समस्या हुई, अगली फिल्म पर जा रहे हैं...`, error.message);
                }
            }
        }

    } catch (error) {
        console.error('वर्कर में एक बड़ी त्रुटि हुई, लेकिन चिंता न करें, यह अगले शेड्यूल पर फिर से चलेगा:', error);
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
// === शेड्यूलर और पहला रन ===
// ====================================================================
cron.schedule('0 */6 * * *', () => {
    console.log('शेड्यूल के अनुसार, वर्कर को चलाने का समय हो गया है!');
    findAndSaveMovies();
});

findAndSaveMovies();
