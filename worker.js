// ====================================================================
// === Shubhzone - ऑटोमेटेड वर्कर (The Brain) - v4.0 (Professional) ===
// === काम: मूवी और वेब-सीरीज़ को कैटेगरी के अनुसार ढूंढना और अपडेट करना ===
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

// ★★★ हम इन कैटेगरी में कंटेंट ढूंढेंगे ★★★
const GENRES_TO_FETCH = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
    { id: 53, name: 'Thriller' },
    { id: 878, name: 'Science Fiction' },
    { id: 10751, name: 'Family' },
];
const TOTAL_PAGES_PER_GENRE = 5; // हर कैटेगरी के 5 पन्ने (100 आइटम) चेक करेगा

// ★★★ हेल्पर फंक्शन: पहले से सेव हुए IDs को लाने के लिए ★★★
async function fetchExistingIds(collectionName) {
    const snapshot = await db.collection(collectionName).select('tmdbId').get();
    const ids = new Set();
    snapshot.forEach(doc => ids.add(doc.data().tmdbId));
    console.log(`डेटाबेस के '${collectionName}' कलेक्शन में ${ids.size} आइटम पहले से मौजूद हैं।`);
    return ids;
}

// ====================================================================
// === मुख्य फंक्शन: फिल्में और सीरीज़ ढूंढने का काम यहीं होता है ===
// ====================================================================
async function findAndSaveContent() {
    console.log('----------------------------------------------------');
    console.log('वर्कर (प्रोफेशनल वर्जन) शुरू हो रहा है... नया कंटेंट ढूंढ रहा है...');
    console.log('----------------------------------------------------');

    let browser = null;
    try {
        // पहले से सेव हुए IDs की लिस्ट बना लें ताकि डुप्लीकेट काम न हो
        const existingMovieIds = await fetchExistingIds('Available_Movies');
        const existingSeriesIds = await fetchExistingIds('Available_WebSeries');

        console.log('Puppeteer ब्राउज़र लॉन्च किया जा रहा है...');
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
        });
        console.log('ब्राउज़र सफलतापूर्वक लॉन्च हो गया।');
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');

        // हर कैटेगरी के लिए एक-एक करके काम करें
        for (const genre of GENRES_TO_FETCH) {
            console.log(`\n\n★★★ कैटेगरी "${genre.name}" की जांच शुरू... ★★★`);
            
            // हर कैटेगरी के कई पन्ने चेक करें
            for (let i = 1; i <= TOTAL_PAGES_PER_GENRE; i++) {
                console.log(`\n--- "${genre.name}" कैटेगरी का पन्ना ${i}/${TOTAL_PAGES_PER_GENRE} जांचा जा रहा है ---`);

                // मूवीज़ और वेब-सीरीज़ दोनों के लिए API कॉल करें
                const movieApiUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&primary_release_date.gte=2021-01-01&page=${i}&with_genres=${genre.id}&with_original_language=hi|kn|ml|ta|te&watch_region=IN`;
                const seriesApiUrl = `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&first_air_date.gte=2021-01-01&page=${i}&with_genres=${genre.id}&with_original_language=hi|kn|ml|ta|te&watch_region=IN`;

                const [movieResponse, seriesResponse] = await Promise.all([fetch(movieApiUrl), fetch(seriesApiUrl)]);
                const movieData = await movieResponse.json();
                const seriesData = await seriesResponse.json();

                const itemsToCheck = [...(movieData.results || []), ...(seriesData.results || [])];

                for (const item of itemsToCheck) {
                    const isMovie = !!item.title; // अगर 'title' है तो मूवी, वरना सीरीज़
                    const collectionName = isMovie ? 'Available_Movies' : 'Available_WebSeries';
                    const existingIds = isMovie ? existingMovieIds : existingSeriesIds;
                    const itemName = isMovie ? item.title : item.name;
                    const itemYear = isMovie ? (item.release_date || 'N/A').substring(0, 4) : (item.first_air_date || 'N/A').substring(0, 4);

                    // अगर यह पहले से सेव है, तो इसे छोड़ दें
                    if (existingIds.has(item.id)) {
                        console.log(`[छोड़ा गया]: "${itemName}" पहले से डेटाबेस में है।`);
                        continue;
                    }
                    
                    try {
                        console.log(`\n[जांच जारी है]: "${itemName} (${itemYear})"`);
                        const searchUrl = `https://vidsrc.to/embed/${isMovie ? 'movie' : 'tv'}/${item.id}`;

                        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 90000 });
                        const content = await page.content();

                        if (content.includes('404 Not Found') || content.includes('movie not found')) {
                            console.log(`[परिणाम]: "${itemName}" इस सर्वर पर नहीं मिली।`);
                            continue;
                        }

                        const record = {
                            tmdbId: item.id,
                            title: itemName,
                            overview: item.overview,
                            posterPath: item.poster_path,
                            releaseDate: isMovie ? item.release_date : item.first_air_date,
                            genres: item.genre_ids, // कैटेगरी की ID सेव करें
                            workingLink: searchUrl,
                            lastChecked: new Date()
                        };

                        await db.collection(collectionName).doc(String(item.id)).set(record);
                        console.log(`✅ [सफलता]: "${itemName}" का वर्किंग लिंक मिला और '${collectionName}' में सेव कर दिया गया!`);
                        existingIds.add(item.id); // इसे लिस्ट में जोड़ दें ताकि दोबारा चेक न हो

                    } catch (error) {
                        console.error(`त्रुटि: "${itemName}" की जांच के दौरान समस्या हुई, अगली आइटम पर जा रहे हैं...`, error.message);
                    }
                }
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
// === शेड्यूलर और पहला रन ===
// ====================================================================
cron.schedule('0 */6 * * *', () => {
    console.log('शेड्यूल के अनुसार, वर्कर को चलाने का समय हो गया है!');
    findAndSaveContent();
});

findAndSaveContent();
