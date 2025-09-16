// ====================================================================
// === Shubhzone - ऑटोमेटेड वर्कर (The Brain) - v7.0 (Multi-Server) ===
// === काम: कई सर्वरों पर वर्किंग लिंक खोजना जो भारत में चलते हों     ===
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

// ★★★ मुख्य बदलाव: जांच करने के लिए सर्वरों की लिस्ट ★★★
const SERVERS_TO_CHECK = [
    { name: 'Vidsrc.me', urlFormat: 'https://vidsrc.me/embed/{type}/{id}' },
    { name: 'Multiembed.mov', urlFormat: 'https://multiembed.mov/directstream.php?video_id={id}&tmdb=1' }, // इसका URL फॉर्मेट अलग है
    { name: '2embed.to', urlFormat: 'https://www.2embed.to/embed/tmdb/{type}?id={id}' }
];

const GENRES_TO_FETCH = [
    { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 35, name: 'Comedy' },
    { id: 27, name: 'Horror' }, { id: 10749, name: 'Romance' }, { id: 53, name: 'Thriller' },
    { id: 878, name: 'Science Fiction' }, { id: 10751, name: 'Family' }, { id: 80, name: 'Crime' }
];
const TOTAL_PAGES_PER_GENRE = 5;

// हेल्पर फंक्शन: पहले से सेव हुए IDs को लाने के लिए
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
    console.log('सुपर-स्मार्ट वर्कर (Multi-Server) शुरू हो रहा है...');
    console.log('----------------------------------------------------');

    let browser = null;
    try {
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

        for (const genre of GENRES_TO_FETCH) {
            console.log(`\n\n★★★ कैटेगरी "${genre.name}" की जांच शुरू... ★★★`);
            for (let i = 1; i <= TOTAL_PAGES_PER_GENRE; i++) {
                console.log(`\n--- "${genre.name}" कैटेगरी का पन्ना ${i}/${TOTAL_PAGES_PER_GENRE} जांचा जा रहा है ---`);

                const movieApiUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&primary_release_date.gte=2021-01-01&page=${i}&with_genres=${genre.id}&with_original_language=hi|kn|ml|ta|te&watch_region=IN`;
                const seriesApiUrl = `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&first_air_date.gte=2021-01-01&page=${i}&with_genres=${genre.id}&with_original_language=hi|kn|ml|ta|te&watch_region=IN`;
                
                const [movieResponse, seriesResponse] = await Promise.all([fetch(movieApiUrl), fetch(seriesApiUrl)]);
                const movieData = await movieResponse.json();
                const seriesData = await seriesResponse.json();
                const itemsToCheck = [...(movieData.results || []), ...(seriesData.results || [])];
                
                if (itemsToCheck.length === 0) continue;

                for (const item of itemsToCheck) {
                    const isMovie = !!item.title;
                    const collectionName = isMovie ? 'Available_Movies' : 'Available_WebSeries';
                    const existingIds = isMovie ? existingMovieIds : existingSeriesIds;
                    const itemName = isMovie ? item.title : item.name;

                    if (existingIds.has(item.id)) {
                        console.log(`[छोड़ा गया]: "${itemName}" पहले से डेटाबेस में है।`);
                        continue;
                    }
                    
                    console.log(`\n[खोज जारी है]: "${itemName}" के लिए वर्किंग लिंक ढूंढा जा रहा है...`);
                    
                    // ★★★ बदला हुआ लॉजिक: एक-एक करके हर सर्वर पर जांचें ★★★
                    let workingLinkFound = null;

                    for (const server of SERVERS_TO_CHECK) {
                        try {
                            const mediaTypeString = isMovie ? 'movie' : 'tv';
                            let searchUrl = server.urlFormat.replace('{type}', mediaTypeString).replace('{id}', item.id);
                            
                            // Multiembed के लिए URL फॉर्मेट अलग है, उसे ठीक करें
                            if (server.name === 'Multiembed.mov' && !isMovie) {
                                // Multiembed सिर्फ TMDB ID लेता है, movie/tv नहीं
                                searchUrl = `https://multiembed.mov/directstream.php?video_id=${item.id}&tmdb=1&s=1&e=1`; // Season 1, Ep 1 का लिंक
                            } else if (server.name === 'Multiembed.mov' && isMovie) {
                                searchUrl = `https://multiembed.mov/directstream.php?video_id=${item.id}&tmdb=1`;
                            }


                            console.log(`  -> सर्वर "${server.name}" पर जांचा जा रहा है...`);
                            await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
                            
                            const content = await page.content();
                            if (content.includes('404 Not Found') || content.includes('movie not found') || content.includes('Page not found')) {
                                throw new Error('Content not available on this server.');
                            }

                            workingLinkFound = searchUrl; // लिंक काम कर रहा है!
                            console.log(`  ✅ [सफलता]: "${server.name}" पर "${itemName}" का वर्किंग लिंक मिला!`);
                            break; // लिंक मिल गया, तो बाकी सर्वर जांचने की ज़रूरत नहीं

                        } catch (error) {
                            console.log(`  ❌ [विफल]: "${server.name}" पर लिंक नहीं मिला या एरर आया। अगले सर्वर पर जांचा जा रहा है...`);
                        }
                    }

                    // अगर किसी भी सर्वर पर लिंक मिला, तो उसे Firebase में सेव करें
                    if (workingLinkFound) {
                        const record = { tmdbId: item.id, title: itemName, overview: item.overview, posterPath: item.poster_path, releaseDate: isMovie ? item.release_date : item.first_air_date, genres: item.genre_ids, workingLink: workingLinkFound, lastChecked: new Date() };
                        await db.collection(collectionName).doc(String(item.id)).set(record);
                        console.log(`[सेव किया गया]: "${itemName}" को '${collectionName}' में सफलतापूर्वक सेव कर दिया गया!`);
                        existingIds.add(item.id);
                    } else {
                        console.log(`[परिणाम]: "${itemName}" किसी भी सर्वर पर नहीं मिली।`);
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
cron.schedule('0 */1 * * *', () => {
    console.log('शेड्यूल के अनुसार, वर्कर को चलाने का समय हो गया है!');
    findAndSaveContent();
});

findAndSaveContent();
