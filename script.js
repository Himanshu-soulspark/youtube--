/* ================================================= */
/* === Shubhzone App Script (Code 2) - FINAL v5.20 === */
/* === MODIFIED AS PER USER REQUEST - AUG 2025    === */
/* === SOLVED: Stricter Video Type Filtering      === */
/* ================================================= */

// Firebase कॉन्फ़िगरेशन
const firebaseConfig = {
  apiKey: "AIzaSyDuvWTMJL5edNG6cheez5pmwI2KlLCwtjw",
  authDomain: "shubhzone-4a6b0.firebaseapp.com",
  databaseURL: "https://shubhzone-4a6b0-default-rtdb.firebaseio.com",
  projectId: "shubhzone-4a6b0",
  storageBucket: "shubhzone-4a6b0.appspot.com",
  messagingSenderId: "439309269785",
  appId: "1:439309269785:web:08a1256812648daafea388",
  measurementId: "G-5S0VFF21SB"
};

// Firebase को केवल एक बार शुरू करें
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Firebase सेवाओं को इनिशियलाइज़ करें
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();


// =======================================================================
// ★★★ ADVERTISEMENT LOGIC (NEW STRATEGY - AUG 2025) - START ★★★
// =======================================================================

/**
 * Injects a banner ad into the specified container element.
 * It alternates between Monetag and Adsterra for variety.
 * ★ बदलाव: कंटेनर की दृश्यता को प्रबंधित करने के लिए म्यूटेशन ऑब्जर्वर जोड़ा गया।
 * @param {HTMLElement} container The container element to inject the ad into.
 */
function injectBannerAd(container) {
    if (!container) {
        console.warn("[AD] Ad container not found. Cannot inject banner ad.");
        return;
    }
    container.innerHTML = ''; // पिछली सामग्री साफ़ करें
    container.style.display = 'none'; // ★ नया: विज्ञापन लोड होने तक कंटेनर छिपाएँ

    // यह देखने के लिए कि विज्ञापन स्क्रिप्ट ने सामग्री जोड़ी है या नहीं, एक ऑब्जर्वर सेट करें
    const observer = new MutationObserver((mutationsList, obs) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && container.hasChildNodes()) {
                // विज्ञापन स्क्रिप्ट ने कुछ जोड़ा है, इसलिए कंटेनर दिखाएँ
                container.style.display = 'flex';
                obs.disconnect(); // एक बार जब यह काम हो जाए तो देखना बंद कर दें
                return;
            }
        }
    });

    observer.observe(container, { childList: true, subtree: true });

    // 10 सेकंड के बाद टाइमआउट, यदि विज्ञापन लोड नहीं होता है तो ऑब्जर्वर को हटाने के लिए
    setTimeout(() => {
        observer.disconnect();
        if (!container.hasChildNodes()) {
           container.remove(); // यदि कोई विज्ञापन नहीं है, तो DOM से खाली कंटेनर हटा दें
        }
    }, 10000);


    // Monetag और Adsterra नेटिव बैनर के बीच वैकल्पिक
    if (Math.random() > 0.5) {
        // Monetag नेटिव बैनर
        console.log("[AD] Injecting Monetag Native Banner...");
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.text = `(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gizokraijaw.net',9583482,document.createElement('script'))`;
        container.appendChild(adScript);
    } else {
        // Adsterra नेटिव बैनर
        console.log("[AD] Injecting Adsterra Native Banner...");
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.setAttribute('data-cfasync', 'false');
        adScript.src = `//decreaselackadmit.com/f218d914c870fc85f6dd64b9c8c31249/invoke.js`;
        const adContainerDiv = document.createElement('div');
        adContainerDiv.id = 'container-f218d914c870fc85f6dd64b9c8c31249';
        container.appendChild(adScript);
        container.appendChild(adContainerDiv);
    }
}


/**
 * Injects an Adsterra Social Bar ad script into the document body.
 * This should typically be called only once.
 */
function injectSocialBarAd() {
    if (document.querySelector('script[src*="9b9bd0548874dd7f16f6f50929864be9"]')) {
        console.log('[AD] Adsterra Social Bar script already injected.');
        return;
    }
    console.log("[AD] Injecting Adsterra Social Bar script...");
    const socialScript = document.createElement('script');
    socialScript.type = 'text/javascript';
    socialScript.src = '//decreaselackadmit.com/9b/9b/d0/9b9bd0548874dd7f16f6f50929864be9.js';
    document.body.appendChild(socialScript);
}

/**
 * Triggers a full-page ad based on a rotating sequence.
 * This sequence heavily prioritizes Monetag Interstitial and Direct Link ads.
 */
function triggerFullScreenAd() {
    const isAnyModalActive = document.querySelector('.modal-overlay.active, .comments-modal-overlay.active, #chat-screen-overlay.active');
    if (isAnyModalActive) {
        console.log("[AD] Modal is active, skipping full-screen ad.");
        return;
    }

    const { sequence, currentIndex } = appState.adState.fullscreenAd;
    const adType = sequence[currentIndex];

    console.log(`[AD] Triggering Full-Screen Ad. Type: ---> ${adType.toUpperCase()} <---`);

    switch (adType) {
        case 'monetag_interstitial':
            console.log("[AD] Injecting Monetag Interstitial script...");
            const monetagInterstitial = document.createElement('script');
            monetagInterstitial.text = `(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('groleegni.net',9572500,document.createElement('script'))`;
            document.body.appendChild(monetagInterstitial);
            break;

        case 'monetag_directlink':
            console.log("[AD] Attempting to open Monetag Direct Link...");
            const newWindow = window.open('https://otieu.com/4/9578561', '_blank');
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                console.warn("[AD] Direct Link was blocked by the browser's popup blocker.");
            } else {
                console.log("[AD] Direct Link opened successfully.");
            }
            break;

        case 'adsterra_popunder':
            console.log("[AD] Injecting Adsterra Popunder script...");
            const adsterraPopunder = document.createElement('script');
            adsterraPopunder.type = 'text/javascript';
            adsterraPopunder.src = '//decreaselackadmit.com/7d/0c/a8/7d0ca84cbcf7b35539ae2feb7dc2bd2e.js';
            document.body.appendChild(adsterraPopunder);
            break;
        
        case 'monetag_popunder':
            console.log("[AD] Injecting Monetag Popunder script...");
            const monetagPopunderScript = document.createElement('script');
            monetagPopunderScript.text = `(s=>{s.dataset.zone='9578563',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
            document.body.appendChild(monetagPopunderScript);
            break;
    }

    appState.adState.fullscreenAd.currentIndex = (currentIndex + 1) % sequence.length;
}


/**
 * Sets up the timers for triggering ads automatically.
 */
function setupAdTimers() {
    if (appState.adState.timers.fullscreenAdLoop) {
        clearInterval(appState.adState.timers.fullscreenAdLoop);
    }
    
    injectSocialBarAd();

    // Trigger a full-screen ad every 60 seconds for higher frequency
    appState.adState.timers.fullscreenAdLoop = setInterval(triggerFullScreenAd, 60000); // every 60 seconds
}


// =======================================================================
// ★★★ ADVERTISEMENT LOGIC (NEW STRATEGY - AUG 2025) - END ★★★
// =======================================================================


// =================================================
// ★★★ Helper Functions - START ★★★
// =================================================

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function copyToClipboard(text, event) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            const copyBtn = event.target.closest('button');
            if (copyBtn) {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 1500);
            }
        }).catch(err => {
            console.error('Failed to copy text with modern method: ', err);
            fallbackCopyToClipboard(text, event);
        });
    } else {
        fallbackCopyToClipboard(text, event);
    }
}

function fallbackCopyToClipboard(text, event) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        const copyBtn = event.target.closest('button');
        if (copyBtn) {
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 1500);
        }
    } catch (err) {
        console.error('Fallback copy to clipboard failed', err);
        alert('Failed to copy text.');
    }
    document.body.removeChild(textArea);
}

async function generateAndSaveReferralCode(uid, name) {
    const safeName = (name || 'user').replace(/[^a-zA-Z]/g, '').toLowerCase().substring(0, 4);
    const randomPart = Math.random().toString().substring(2, 6);
    let referralCode = `@${safeName}${randomPart}`;
    while (referralCode.length < 7) {
        referralCode += Math.floor(Math.random() * 10);
    }
    try {
        await db.collection('users').doc(uid).update({ referralCode: referralCode });
        console.log(`Generated Referral Code: ${referralCode}`);
        return referralCode;
    } catch (error) {
        console.error("Error saving referral code:", error);
        return "COULD_NOT_GENERATE";
    }
}

function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function formatNumber(num) {
    if (num === null || num === undefined) return 0;
    if (num >= 10000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num;
}

/**
 * Extracts the 11-character YouTube video ID from various URL formats.
 * @param {string} url The YouTube URL or just the ID.
 * @returns {string|null} The video ID or null if not found.
 */
function extractYouTubeId(url) {
    if (!url) return null;
    // First, check if the input is already a valid 11-character ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    // If not, try to extract it from a URL
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// =================================================
// ★★★ Helper Functions - END ★★★
// =================================================

// ऐप का ग्लोबल स्टेट
let appState = {
    currentUser: {
        uid: null, username: "new_user", avatar: "https://via.placeholder.com/120/222/FFFFFF?text=+",
        email: "", name: "", mobile: "", address: "", hobby: "", state: "", country: "",
        referralCode: null, likedVideos: [], 
        friends: [],
        creatorCoins: 0,
        unconvertedCreatorSeconds: 0,
        addedChannels: [], // ★ नया: जोड़े गए चैनलों को स्टोर करने के लिए
    },
    currentScreen: 'splash-screen',
    navigationStack: ['splash-screen'],
    currentScreenPayload: null,
    viewingHistory: [],
    youtubeNextPageTokens: {
        long: null,
        shorts: null,
        search: null,
        trending: null,
        channelVideos: null,
        channelShorts: null,
        channelPlaylists: null,
    },
    uploadDetails: { category: null, audience: 'all', lengthType: 'short' },
    activeComments: { videoId: null, videoOwnerUid: null, channelId: null },
    activeChat: { chatId: null, friendId: null, friendName: null, friendAvatar: null },
    creatorPagePlayers: { short: null, long: null },
    creatorPage: { 
        currentLongVideo: { id: null, uploaderUid: null, channelId: null },
        channelCache: new Map(),
        // ★ बदलाव: क्रिएटर पेज का व्यू ट्रैक करने के लिए (list, player, या channel)
        currentView: 'channel', 
        currentChannelId: null, 
    },
    adState: {
        timers: { fullscreenAdLoop: null },
        fullscreenAd: { 
            sequence: [
                'monetag_interstitial', 
                'monetag_directlink', 
                'monetag_interstitial', 
                'adsterra_popunder', 
                'monetag_directlink', 
                'monetag_popunder'
            ], 
            currentIndex: 0 
        },
    },
    appTimeTrackerInterval: null, watchTimeInterval: null,
    videoWatchTrackers: {},
    specialVideoPlayer: null,
};

let isYouTubeApiReady = false;
let players = {};
let videoObserver;
let activePlayerId = null;
let userHasInteracted = false;
let hasShownAudioPopup = false;
let hapticFeedbackEnabled = true;

// =============================================================================
// ★★★ YOUTUBE API INTEGRATION (REFACTORED & WITH FIREBASE CACHING) - START ★★★
// =============================================================================

let currentVideoCache = new Map();

/**
 * ★ बदलाव: YouTube API से डेटा लाने के लिए जेनेरिक फ़ंक्शन, अब Firebase में कैश करता है।
 * @param {string} type 'search', 'trending', 'channelVideos', 'videoDetails', 'channelDetails', 'playlists', 'playlistItems' में से एक।
 * @param {object} params API के लिए पैरामीटर।
 * @returns {Promise<object>} API से प्रतिक्रिया।
 */
async function fetchFromYouTubeAPI(type, params) {
    let url = `/api/youtube?type=${type}&cb=${new Date().getTime()}`;
    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
            url += `&${key}=${encodeURIComponent(params[key])}`;
        }
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            console.error(`YouTube API Error for type ${type}:`, errorData);
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // ★ नया: Firebase में API परिणामों को कैश करें
        if (data.items && data.items.length > 0) {
            const batch = db.batch();
            data.items.forEach(item => {
                const videoId = item.id?.videoId || item.id?.resourceId?.videoId || item.id;
                if(videoId && item.snippet) {
                    // स्थानीय कैश में जोड़ें
                    currentVideoCache.set(videoId, item); 
                    
                    // Firebase में कैश करने के लिए बैच में जोड़ें
                    const cacheRef = db.collection('youtube_cache').doc(videoId);
                    const cacheData = {
                        data: item,
                        retrievedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    batch.set(cacheRef, cacheData, { merge: true });
                }
            });
            // बैच को एसिंक्रोनस रूप से कमिट करें
            batch.commit().catch(err => console.error("Error caching YouTube data to Firebase:", err));
        }

        return data;
    } catch (error) {
        console.error(`Critical Error Fetching from YouTube API (${type}):`, error);
        return { error: error.message, items: [], nextPageToken: null };
    }
}


/**
 * खोजे गए यूट्यूब वीडियो को ग्रिड में दिखाता है।
 * @param {Array} videos - दिखाने के लिए वीडियो की सूची।
 * @param {boolean} append - क्या मौजूदा परिणामों में जोड़ना है।
 */
function renderYouTubeLongVideos(videos, append = false) {
    const grid = document.getElementById('long-video-grid');
    const loadMoreBtn = document.getElementById('long-video-load-more-btn');

    if (!grid) return;

    if (!append) {
        grid.innerHTML = '';
    }

    if (videos.length === 0 && !append) {
        grid.innerHTML = '<p class="static-message">No videos found. Try a different search or category.</p>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    videos.forEach((video) => {
        // ★★★ FIX ★★★ सुनिश्चित करें कि केवल वीडियो आइटम ही रेंडर हों
        if (video.id.kind !== 'youtube#video') return;
        const card = createLongVideoCard(video);
        if (card) fragment.appendChild(card);
    });
    grid.appendChild(fragment);

    if (!append && videos.length > 3) {
        const adContainer = document.createElement('div');
        adContainer.className = 'long-video-grid-ad';
        if (grid.children[3]) {
            grid.insertBefore(adContainer, grid.children[3]);
            setTimeout(() => injectBannerAd(adContainer), 100);
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.style.display = appState.youtubeNextPageTokens.long ? 'block' : 'none';
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Load More";
    }
}

async function loadMoreLongVideos() {
    const loadMoreBtn = document.getElementById('long-video-load-more-btn');
    if (!loadMoreBtn || loadMoreBtn.disabled) return;
    
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Loading...";

    const activeCategoryChip = document.querySelector('#long-video-category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.dataset.category : 'All';
    const searchInput = document.getElementById('long-video-search-input').value.trim();
    
    let data;
    const params = {
        pageToken: appState.youtubeNextPageTokens.long,
        videoDuration: 'long',
        type: 'video' // ★★★ FIX ★★★ यह सुनिश्चित करने के लिए कि केवल वीडियो ही लोड हों
    };

    if (searchInput) {
        params.q = searchInput;
    } else if (category.toLowerCase() === 'trending') {
        params.q = 'trending videos';
    } else {
        params.q = category.toLowerCase() === 'all' ? getRandomTopic() : category;
    }

    data = await fetchFromYouTubeAPI('search', params);
    
    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    if(data.items) {
        renderYouTubeLongVideos(data.items, true);
    }
    
    if (loadMoreBtn && !appState.youtubeNextPageTokens.long) {
        loadMoreBtn.style.display = 'none';
    }
}

async function playYouTubeVideoFromCard(videoId) {
    let video = currentVideoCache.get(videoId);
    if (!video) {
        console.warn("Video details not in cache for ID:", videoId, ". Fetching...");
        const data = await fetchFromYouTubeAPI('videoDetails', { id: videoId });
        if (data.items && data.items[0]) {
            video = data.items[0];
            currentVideoCache.set(videoId, video);
        } else {
            alert("Video details could not be loaded. Please try again.");
            return;
        }
    }
    
    const channelId = video.snippet.channelId;
    
    // ★ बदलाव: सीधे क्रिएटर पेज पर वीडियो चलाने के लिए नेविगेट करें
    navigateTo('creator-page-screen', { 
        creatorId: channelId, 
        startWith: 'play', // ★ नया: 'play' व्यू सीधे प्लेयर को ट्रिगर करेगा
        videoId: videoId
    });
}

// =============================================================================
// ★★★ YOUTUBE API INTEGRATION (REFACTORED & WITH FIREBASE CACHING) - END ★★★
// =============================================================================


// DOM Elements
const appContainer = document.getElementById('app-container');
const screens = document.querySelectorAll('.screen');
const profileImageInput = document.getElementById('profile-image-input');
const profileImagePreview = document.getElementById('profile-image-preview');
const commentsModal = document.getElementById('comments-modal');
const commentsList = document.getElementById('comments-list');
const commentInput = document.getElementById('comment-input');
const sendCommentBtn = document.getElementById('send-comment-btn');
const descriptionModal = document.getElementById('description-modal');
const descriptionContent = document.getElementById('description-content');
const closeDescriptionBtn = document.getElementById('close-description-btn');
const videoSwiper = document.getElementById('video-swiper');
const homeStaticMessageContainer = document.getElementById('home-static-message-container');
const saveContinueBtn = document.getElementById('save-continue-btn');

// ★ बदलाव: 30+ नई श्रेणियां जोड़ी गईं
const categories = [
    "Trending", "Music", "Gaming", "Movies", "News", "Live", "Sports", 
    "Learning", "Fashion & Beauty", "Comedy", "Entertainment", "Technology", 
    "Cooking", "Travel", "Vlogs", "Podcasts", "Dance", "Animation", 
    "Automotive", "Pets & Animals", "Science", "History", "Documentary",
    "DIY", "Health & Fitness", "Finance", "Real Estate", "Astrology", 
    "Spirituality", "Motivation", "Bhakti", "Bollywood News", "Tollywood", 
    "Kollywood", "Sandalwood", "Art & Craft", "Booktubers"
];
const diverseTopics = [
    "latest movie trailers", "viral internet moments", "new tech gadgets 2025", 
    "stand up comedy india", "amazing science experiments", "top music hits 2025", 
    "travel vlogs Europe", "indian street food tour", "DIY home decor low cost", 
    "cricket highlights today", "BGMI gameplay", "political debate india",
    "easy dinner recipes", "stock market analysis", "yoga for beginners",
    "hindi web series review", "celebrity interviews", "unboxing new phone",
    "ghost stories in hindi", "motivational speech sandeep maheshwari"
];

function getRandomTopic() {
    return diverseTopics[Math.floor(Math.random() * diverseTopics.length)];
}

// Earnsure and other similar features are deprecated as per user request.
// Keeping the objects empty or functions minimal to avoid breaking calls.
const earnsureContent = {};
function initializeEarnsureScreen() {
    // This feature is deprecated.
    const screen = document.getElementById('earnsure-screen');
    if (screen) screen.innerHTML = '<p class="static-message">This feature is no longer available.</p><button onclick="navigateBack()">Back</button>';
}
function initializePaymentScreen() {
    // This feature is deprecated.
    const screen = document.getElementById('payment-screen');
    if (screen) screen.innerHTML = '<p class="static-message">This feature is no longer available.</p><button onclick="navigateBack()">Back</button>';
}
function initializeTrackPaymentScreen() {
    // This feature is deprecated.
    const screen = document.getElementById('track-payment-screen');
     if (screen) screen.innerHTML = '<p class="static-message">This feature is no longer available.</p><button onclick="navigateBack()">Back</button>';
}
function initializeAdvertisementPage() {
    // This feature is deprecated.
    const screen = document.getElementById('advertisement-screen');
    if (screen) screen.innerHTML = '<p class="static-message">This feature is no longer available.</p><button onclick="navigateBack()">Back</button>';
}

function activateScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        activeScreen.style.display = 'flex';
        // A small delay to allow the browser to render the flex display change before applying the transition
        setTimeout(() => activeScreen.classList.add('active'), 10);
    }
    appState.currentScreen = screenId;
}


function navigateTo(nextScreenId, payload = null) {
    if (appState.currentScreen === nextScreenId && JSON.stringify(appState.currentScreenPayload) === JSON.stringify(payload) && nextScreenId !== 'creator-page-screen') return;

    if (nextScreenId !== 'splash-screen' && nextScreenId !== 'information-screen') {
        localStorage.setItem('shubhzone_lastScreen', nextScreenId);
    }
    
    if (appState.navigationStack[appState.navigationStack.length - 1] !== nextScreenId) {
        appState.navigationStack.push(nextScreenId);
    }
    
    if (appState.currentScreen === 'home-screen' && activePlayerId && players[activePlayerId]) {
        pauseActivePlayer();
    }
    if (appState.currentScreen === 'creator-page-screen') {
        if (appState.creatorPagePlayers.long) {
            appState.creatorPagePlayers.long.destroy();
            appState.creatorPagePlayers.long = null;
        }
        document.getElementById('creator-page-content').innerHTML = '';
        // ★ बदलाव: फुलस्क्रीन रोटेशन क्लास हटाएं
        document.getElementById('app-container').classList.remove('fullscreen-active');
    }
    activePlayerId = null;
    
    appState.currentScreenPayload = payload;
    activateScreen(nextScreenId);

    if (nextScreenId === 'profile-screen') loadUserVideosFromFirebase(); 
    if (nextScreenId === 'long-video-screen') setupLongVideoScreen();
    if (nextScreenId === 'history-screen') initializeHistoryScreen();
    if (nextScreenId === 'your-zone-screen') populateYourZoneScreen();
    if (nextScreenId === 'home-screen') setupShortsScreen();
    if (nextScreenId === 'creator-page-screen' && payload && payload.creatorId) {
        initializeCreatorPage(payload);
    }
    if (nextScreenId === 'friends-screen') {
        populateAddFriendsList();
        populateFriendRequestsList();
        populateMembersList(); 
        renderMyChannelsList();
    }
    
    const deprecatedScreens = ['earnsure-screen', 'payment-screen', 'track-payment-screen', 'advertisement-screen', 'report-screen', 'credit-screen'];
    if (deprecatedScreens.includes(nextScreenId)) {
        const screen = document.getElementById(nextScreenId);
        if (screen) screen.innerHTML = `<div class="screen-header"><div class="header-icon-left haptic-trigger" onclick="navigateBack()"><i class="fas fa-arrow-left"></i></div><span class="header-title">Feature Removed</span></div><p class="static-message" style="margin-top: 80px;">This feature is no longer available.</p>`;
    }
}


function navigateBack() {
    // ★ बदलाव: क्रिएटर पेज के प्लेयर व्यू से वापस जाने का लॉजिक
    if (appState.currentScreen === 'creator-page-screen' && appState.creatorPage.currentView === 'player') {
        // प्लेयर को नष्ट करें और चैनल व्यू पर वापस जाएं
        if (appState.creatorPagePlayers.long) {
            appState.creatorPagePlayers.long.destroy();
            appState.creatorPagePlayers.long = null;
        }
        document.getElementById('app-container').classList.remove('fullscreen-active'); // रोटेशन क्लास हटाएं
        
        // चैनल के मुख्य पृष्ठ को फिर से लोड करें
        initializeCreatorPage({ creatorId: appState.creatorPage.currentChannelId, startWith: 'home' });
        return;
    }
    
    if (appState.navigationStack.length <= 1) return;
    
    appState.navigationStack.pop();
    const previousScreenId = appState.navigationStack[appState.navigationStack.length - 1] || 'long-video-screen';
    
    navigateTo(previousScreenId, null);
}


async function checkUserProfileAndProceed(user) {
    if (!user) return;
    appState.currentUser.uid = user.uid;
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();

    if (doc.exists) {
        let userData = doc.data();
        
        if (!userData.referralCode || !userData.referralCode.startsWith('@')) {
            userData.referralCode = await generateAndSaveReferralCode(user.uid, userData.name);
        }
        userData.likedVideos = userData.likedVideos || [];
        userData.friends = userData.friends || [];
        userData.creatorCoins = 0;
        userData.unconvertedCreatorSeconds = 0;
        
        appState.currentUser = { ...appState.currentUser, ...userData };

        const savedChannels = localStorage.getItem('shubhzone_addedChannels');
        appState.currentUser.addedChannels = savedChannels ? JSON.parse(savedChannels) : [];

        const savedHistory = localStorage.getItem('shubhzoneViewingHistory');
        if (savedHistory) {
            appState.viewingHistory = JSON.parse(savedHistory);
        }
        updateProfileUI();
        
        if (userData.name && userData.state) {
            await startAppLogic();
        } else {
            navigateTo('information-screen');
        }

    } else {
        const initialData = {
            uid: user.uid, name: '', email: user.email || '',
            avatar: user.photoURL || 'https://via.placeholder.com/120/222/FFFFFF?text=+',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            likedVideos: [], friends: [],
            creatorCoins: 0, unconvertedCreatorSeconds: 0,
            referralCode: await generateAndSaveReferralCode(user.uid, user.displayName || 'user')
        };
        await userRef.set(initialData);
        appState.currentUser = { ...appState.currentUser, ...initialData };
        updateProfileUI();
        navigateTo('information-screen');
    }
}

let appInitializationComplete = false;
function initializeApp() {
    if (appInitializationComplete) return;
    appInitializationComplete = true;

    // ★ बदलाव: बॉटम नेविगेशन से प्रोफ़ाइल आइकन छिपाएं
    const profileNavItem = document.querySelector('.nav-item[data-nav="profile"]');
    if (profileNavItem) {
        profileNavItem.style.display = 'none';
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            checkUserProfileAndProceed(user);
        } else {
            auth.signInAnonymously().catch(error => console.error("Anonymous sign-in failed:", error));
        }
    });

    activateScreen('splash-screen');
}


function loadUserVideosFromFirebase() {
    renderUserProfileVideos(); 
}

function updateNavActiveState(activeNav) {
    document.querySelectorAll('.bottom-nav').forEach(navBar => {
        navBar.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const currentItem = navBar.querySelector(`.nav-item[data-nav="${activeNav}"]`);
        if (currentItem) currentItem.classList.add('active');
    });
}

profileImageInput.addEventListener('change', function() {
    if (this.files[0]) {
        const reader = new FileReader();
        reader.onload = e => profileImagePreview.src = e.target.result;
        reader.readAsDataURL(this.files[0]);
    }
});

function checkCustom(select, inputId) { document.getElementById(inputId).style.display = select.value === 'custom' ? 'block' : 'none'; }

async function saveAndContinue() {
    saveContinueBtn.disabled = true;
    saveContinueBtn.textContent = 'Saving...';
    
    const name = document.getElementById('info-name').value.trim();
    const stateValue = document.getElementById('info-state').value;
    const customState = document.getElementById('custom-state-input').value.trim();
    const state = stateValue === 'custom' ? customState : stateValue;

    if (!name || !state) {
        alert('Please enter your name and select your state.');
        saveContinueBtn.disabled = false;
        saveContinueBtn.textContent = 'Continue';
        return;
    }

    const userData = {
        name,
        mobile: document.getElementById('info-mobile').value.trim(),
        email: document.getElementById('info-email').value.trim(),
        address: document.getElementById('info-address').value.trim(),
        hobby: document.getElementById('info-hobby').value.trim(),
        state: state,
        country: document.getElementById('info-country').value === 'custom' ? document.getElementById('custom-country-input').value.trim() : document.getElementById('info-country').value
    };

    const file = profileImageInput.files[0];
    if (file) {
        const cloudName = 'dzq7qb6ew';
        const uploadPreset = 'bookswamp_unsigned';
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        try {
            const response = await fetch(url, { method: 'POST', body: formData });
            const data = await response.json();
            if (data.secure_url) userData.avatar = data.secure_url;
            else throw new Error('Image upload failed, no secure_url returned.');
        } catch (error) {
            console.error("Cloudinary avatar upload error:", error);
            alert("Failed to upload profile picture.");
            saveContinueBtn.disabled = false;
            saveContinueBtn.textContent = 'Continue';
            return;
        }
    }

    try {
        await db.collection('users').doc(appState.currentUser.uid).set(userData, { merge: true });

        const userDoc = await db.collection('users').doc(appState.currentUser.uid).get();
        if (!userDoc.data().referralCode) {
            await generateAndSaveReferralCode(appState.currentUser.uid, name);
        }

        const refreshedUserData = (await db.collection('users').doc(appState.currentUser.uid).get()).data();
        appState.currentUser = { ...appState.currentUser, ...refreshedUserData };

        updateProfileUI();
        await startAppLogic();
    } catch (error) {
        console.error("Profile save error:", error);
        alert("Failed to save profile.");
        saveContinueBtn.disabled = false;
        saveContinueBtn.textContent = 'Continue';
    }
}

function updateProfileUI() {
    const profileHeaderAvatar = document.getElementById('profile-header-avatar');
    if (profileHeaderAvatar) profileHeaderAvatar.src = appState.currentUser.avatar || "https://via.placeholder.com/50/222/FFFFFF?text=+";
    
    profileImagePreview.src = appState.currentUser.avatar || "https://via.placeholder.com/120/222/FFFFFF?text=+";
    document.getElementById('info-name').value = appState.currentUser.name || '';
    document.getElementById('info-mobile').value = appState.currentUser.mobile || '';
    document.getElementById('info-email').value = appState.currentUser.email || '';
    document.getElementById('info-address').value = appState.currentUser.address || '';
    document.getElementById('info-hobby').value = appState.currentUser.hobby || '';
    document.getElementById('info-state').value = appState.currentUser.state || '';
    document.getElementById('info-country').value = appState.currentUser.country || 'India';
}


let appStartLogicHasRun = false;
const startAppLogic = async () => {
    if (appStartLogicHasRun && appState.currentScreen !== 'splash-screen' && appState.currentScreen !== 'information-screen') {
        return;
    }
    appStartLogicHasRun = true;

    setupAdTimers();

    const getStartedBtn = document.getElementById('get-started-btn');
    const loadingContainer = document.getElementById('loading-container');
    if (getStartedBtn) getStartedBtn.style.display = 'none';
    if (loadingContainer) loadingContainer.style.display = 'flex';
    
    const screenToNavigate = 'long-video-screen';
    
    navigateTo(screenToNavigate);
    updateNavActiveState('long-video');
};

function renderVideoSwiper(videos, append = false) {
    if (!videoSwiper) return;

    if (!append) {
        videoSwiper.innerHTML = '';
        Object.values(players).forEach(player => {
            if (player && typeof player.destroy === 'function') player.destroy();
        });
        players = {};
        if (videoObserver) videoObserver.disconnect();
        setupVideoObserver();
    }
    
    if (!videos || videos.length === 0) {
        if (!append) {
             if (homeStaticMessageContainer) {
                homeStaticMessageContainer.querySelector('.static-message').textContent = 'No shorts found for this category.';
                videoSwiper.appendChild(homeStaticMessageContainer);
                homeStaticMessageContainer.style.display = 'flex';
            }
        }
        return;
    }

    if (homeStaticMessageContainer) {
        homeStaticMessageContainer.style.display = 'none';
    }

    const fragment = document.createDocumentFragment();
    videos.forEach((video) => {
        // ★★★ FIX ★★★ सुनिश्चित करें कि केवल वीडियो आइटम ही रेंडर हों
        if (video.id.kind !== 'youtube#video') return;
        const videoId = video.id?.videoId || video.id;
        if (!videoId) return;

        const slide = document.createElement('div');
        slide.className = 'video-slide';
        slide.dataset.videoId = videoId;
        slide.dataset.channelId = video.snippet.channelId;
        
        slide.addEventListener('click', (e) => {
            if (e.target.closest('.video-actions-overlay, .video-meta-overlay')) return;
            togglePlayPause(videoId);
        });
        
        const playerHtml = `<div class="player-container" id="player-${videoId}"></div>`;
        const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url;
        const uploaderName = video.snippet.channelTitle;
        const uploaderAvatar = 'https://via.placeholder.com/40'; 
        const title = video.snippet.title;

        const creatorProfileOnClick = `navigateTo('creator-page-screen', { creatorId: '${video.snippet.channelId}', startWith: 'home' })`;
        const addChannelOnClick = `addChannelToList(event, '${video.snippet.channelId}')`;

        slide.innerHTML = `
            <div class="video-preloader" style="background-image: url('${thumbnailUrl}');"><div class="loader"></div></div>
            ${playerHtml}
            <i class="fas fa-heart like-heart-popup"></i>
            <div class="video-meta-overlay">
                <div class="uploader-info" onclick="${creatorProfileOnClick}"><img src="${uploaderAvatar}" class="uploader-avatar"><span class="uploader-name">${escapeHTML(uploaderName)}</span></div>
                <p class="video-title">${escapeHTML(title)}</p>
                <button class="add-channel-btn haptic-trigger" onclick="${addChannelOnClick}"><i class="fas fa-plus"></i> Add</button>
            </div>
            <div class="video-actions-overlay">
                <div class="action-icon-container haptic-trigger" data-action="creator" onclick="${creatorProfileOnClick}">
                    <i class="fas fa-user-circle icon"></i>
                    <span class="count">Creator</span>
                </div>
                <div class="action-icon-container haptic-trigger" data-action="comment" onclick="openCommentsModal('${videoId}', null, '${video.snippet.channelId}')">
                    <i class="fas fa-comment-dots icon"></i>
                    <span class="count">...</span>
                </div>
            </div>`;
        fragment.appendChild(slide);
        videoObserver.observe(slide);
    });
    videoSwiper.appendChild(fragment);

    const adSlidesNeeded = Math.floor(videoSwiper.querySelectorAll('.video-slide').length / 5);
    const existingAdSlides = videoSwiper.querySelectorAll('.native-ad-slide').length;
    if (adSlidesNeeded > existingAdSlides) {
        const adSlide = document.createElement('div');
        adSlide.className = 'video-slide native-ad-slide';
        const adSlotContainer = document.createElement('div');
        adSlotContainer.className = 'ad-slot-container';
        adSlide.innerHTML = `<div class="ad-slide-wrapper"><p style="color: var(--text-secondary); font-size: 0.9em; text-align: center; margin-bottom: 10px;">Advertisement</p></div>`;
        adSlide.querySelector('.ad-slide-wrapper').appendChild(adSlotContainer);
        videoSwiper.appendChild(adSlide);
        setTimeout(() => injectBannerAd(adSlotContainer), 200);
    }
    
    const oldTrigger = document.getElementById('shorts-load-more-trigger');
    if (oldTrigger) oldTrigger.remove();

    if (appState.youtubeNextPageTokens.shorts) {
        const trigger = document.createElement('div');
        trigger.id = 'shorts-load-more-trigger';
        trigger.innerHTML = `<div class="loader-container" style="padding: 20px 0;"><div class="loader"></div></div>`;
        videoSwiper.appendChild(trigger);
        videoObserver.observe(trigger);
    }
}


function onYouTubeIframeAPIReady() {
    isYouTubeApiReady = true;
}

function onPlayerReady(event) {
    const iframe = event.target.getIframe();
    const slide = iframe.closest('.video-slide');
    if (slide) {
        const preloader = slide.querySelector('.video-preloader');
        if (preloader) preloader.style.display = 'none';
    }
    if (userHasInteracted) {
        event.target.unMute();
    }
}


function onPlayerStateChange(event) {
    const iframe = event.target.getIframe();
    if (!iframe) return;
    
    const isCreatorPlayer = iframe.id === 'creator-page-player-long';
    if (isCreatorPlayer) {
        handleCreatorPlayerStateChange(event);
    }
}

function addVideoToHistory(videoData) {
    if (!videoData || !videoData.id) return;
    const videoId = videoData.id.videoId || videoData.id;

    const historyItem = {
        id: videoId,
        watchedAt: new Date().toISOString(),
        title: videoData.snippet.title,
        channelTitle: videoData.snippet.channelTitle,
        channelId: videoData.snippet.channelId,
        thumbnailUrl: videoData.snippet.thumbnails.medium.url,
        videoLengthType: 'short' 
    };

    const existingIndex = appState.viewingHistory.findIndex(item => item.id === videoId);
    if (existingIndex > -1) appState.viewingHistory.splice(existingIndex, 1);
    appState.viewingHistory.unshift(historyItem);
    if (appState.viewingHistory.length > 100) appState.viewingHistory.pop();
    localStorage.setItem('shubhzoneViewingHistory', JSON.stringify(appState.viewingHistory));
}

function addLongVideoToHistory(videoData) {
     if (!videoData || !videoData.id) return;
    const videoId = videoData.id.videoId || videoData.id;
    
    const historyItem = {
        id: videoId,
        watchedAt: new Date().toISOString(),
        title: videoData.snippet.title,
        channelTitle: videoData.snippet.channelTitle,
        channelId: videoData.snippet.channelId,
        thumbnailUrl: videoData.snippet.thumbnails.medium.url,
        videoLengthType: 'long'
    };
    const existingIndex = appState.viewingHistory.findIndex(item => item.id === videoId);
    if (existingIndex > -1) appState.viewingHistory.splice(existingIndex, 1);
    appState.viewingHistory.unshift(historyItem);
    if (appState.viewingHistory.length > 100) appState.viewingHistory.pop();
    localStorage.setItem('shubhzoneViewingHistory', JSON.stringify(appState.viewingHistory));
}

function togglePlayPause(videoId) {
    const player = players[videoId];
    if (!player || typeof player.getPlayerState !== 'function') return;
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
}

function playActivePlayer(videoId) {
    if (!videoId) return;
    
    if (activePlayerId && activePlayerId !== videoId) {
        pauseActivePlayer();
    }
    activePlayerId = videoId;
    const videoData = currentVideoCache.get(videoId);
    if(videoData) addVideoToHistory(videoData);
    
    const player = players[videoId];
    if (!player || typeof player.playVideo !== 'function' || !player.getIframe() || !document.body.contains(player.getIframe())) {
        const slide = document.querySelector(`.video-slide[data-video-id="${videoId}"]`);
        if(slide) createPlayerForSlide(slide);
        return;
    }
    
    player.unMute();
    player.playVideo();
}

function pauseActivePlayer() {
    if (!activePlayerId) return;
    const player = players[activePlayerId];
    if (player && typeof player.pauseVideo === 'function') {
        if (player.getPlayerState() === YT.PlayerState.PLAYING || player.getPlayerState() === YT.PlayerState.BUFFERING) {
             player.pauseVideo();
        }
    }
}

function createPlayerForSlide(slide) {
    const videoId = slide.dataset.videoId;
    if (players[videoId] || !isYouTubeApiReady) { 
        if(players[videoId] && typeof players[videoId].playVideo === 'function'){
             playActivePlayer(videoId);
        }
        return;
    }

    const playerId = `player-${videoId}`;
    const playerElement = document.getElementById(playerId);
    if (!playerElement || playerElement.tagName === 'IFRAME') return;

    players[videoId] = new YT.Player(playerId, {
        height: '100%', width: '100%', videoId: videoId,
        playerVars: {
            'autoplay': 0, 
            'controls': 0, 
            'mute': userHasInteracted ? 0 : 1, 
            'rel': 0, 
            'showinfo': 0, 
            'modestbranding': 1, 
            'loop': 1,
            'playlist': videoId, 
            'fs': 0, 
            'iv_load_policy': 3, 
            'origin': window.location.origin
        },
        events: {
            'onReady': (event) => {
                onPlayerReady(event);
                if (slide.getBoundingClientRect().top >= 0 && slide.getBoundingClientRect().bottom <= window.innerHeight) {
                    playActivePlayer(videoId);
                }
            },
            'onStateChange': onPlayerStateChange
        }
    });
}

function setupVideoObserver() {
    if (videoObserver) videoObserver.disconnect();
    if (!videoSwiper) return;
    const options = { root: videoSwiper, threshold: 0.8 };
    videoObserver = new IntersectionObserver(async (entries) => {
        for (const entry of entries) {
            if (entry.target.id === 'shorts-load-more-trigger') {
                if(entry.isIntersecting) {
                    // ★ बदलाव: अब कोई 'load more' बटन नहीं है, यह ऑटोमेटिकली ट्रिगर होता है
                    videoObserver.unobserve(entry.target);
                    await loadMoreShorts();
                }
                continue;
            }

            if (entry.target.classList.contains('native-ad-slide')) continue;

            const videoId = entry.target.dataset.videoId;
            if (!videoId) continue;
            
            if (entry.isIntersecting) {
                playActivePlayer(videoId);
            } else {
                if (videoId === activePlayerId) {
                    pauseActivePlayer();
                    activePlayerId = null;
                }
            }
        }
    }, options);
}


async function openCommentsModal(videoId, videoOwnerUid = null, channelId = null) {
    appState.activeComments = { videoId, videoOwnerUid, channelId };
    commentsModal.classList.add('active');
    commentsList.innerHTML = '<li style="text-align:center; color: var(--text-secondary);">Loading comments...</li>';
    
    commentsList.innerHTML = '<li style="text-align:center; color: var(--text-secondary);">Comments can be viewed on YouTube.</li>';
    sendCommentBtn.disabled = true;
    commentInput.disabled = true;
    commentInput.placeholder = "Commenting disabled.";
}

function closeCommentsModal() {
    commentsModal.classList.remove('active');
    appState.activeComments = { videoId: null, videoOwnerUid: null };
    commentInput.value = '';
}

async function postComment() {
    alert("Commenting is not available here. Please comment directly on YouTube.");
}

function logoutUser() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.clear();
        auth.signOut().then(() => {
            window.location.reload();
        }).catch(error => {
            console.error("Logout failed:", error);
            alert("Logout failed.");
        });
    }
}

function renderCategoriesInBar() {
    const scroller = document.getElementById('category-scroller');
    const longScroller = document.getElementById('long-video-category-scroller');

    [scroller, longScroller].forEach(s => {
        if (!s) return;
        s.innerHTML = '';
        const allChip = document.createElement('div');
        allChip.className = 'category-chip active haptic-trigger';
        allChip.textContent = 'All';
        allChip.dataset.category = "All";
        allChip.onclick = () => filterVideosByCategory(s.id, 'All', allChip);
        s.appendChild(allChip);
        categories.forEach(category => {
            const chip = document.createElement('div');
            chip.className = 'category-chip haptic-trigger';
            chip.textContent = category;
            chip.dataset.category = category;
            chip.onclick = () => filterVideosByCategory(s.id, category, chip);
            s.appendChild(chip);
        });
    });
}

function filterVideosByCategory(scrollerId, category, element) {
    const scroller = document.getElementById(scrollerId);
    if (!scroller) return;

    scroller.querySelectorAll('.category-chip').forEach(chip => chip.classList.remove('active'));
    if (element) element.classList.add('active');
    
    const searchInput = document.getElementById('long-video-search-input');
    if (searchInput) searchInput.value = '';

    if (scrollerId === 'category-scroller') { 
        if (activePlayerId) pauseActivePlayer();
        activePlayerId = null;
        setupShortsScreen(category);
    } else { 
        populateLongVideoGrid(category);
    }
}


function renderUserProfileVideos() {
    const shortGrid = document.getElementById('user-short-video-grid');
    const longGrid = document.getElementById('user-long-video-grid');
    
    const message = '<p class="static-message" style="color: var(--text-secondary); grid-column: 1 / -1;">Video uploads are no longer supported. All content is from YouTube.</p>';

    if (shortGrid) shortGrid.innerHTML = message;
    if (longGrid) longGrid.innerHTML = message;
}

async function setupShortsScreen(category = 'All') {
    const query = category.toLowerCase() === 'trending' ? 'trending shorts india' : (category.toLowerCase() === 'all' ? getRandomTopic() + ' shorts' : `${category} shorts`);

    if (homeStaticMessageContainer) {
        videoSwiper.innerHTML = '';
        videoSwiper.appendChild(homeStaticMessageContainer);
        homeStaticMessageContainer.style.display = 'flex';
        homeStaticMessageContainer.querySelector('.static-message').innerHTML = '<div class="loader"></div> Loading shorts...';
    }

    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short', type: 'video' });
    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    if(data.items && data.items.length > 0) {
        renderVideoSwiper(data.items, false);
    } else {
        renderVideoSwiper([], false);
    }
}

async function loadMoreShorts() {
    const activeCategoryChip = document.querySelector('#category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.dataset.category : 'All';
    const query = category.toLowerCase() === 'trending' ? 'trending shorts india' : (category.toLowerCase() === 'all' ? getRandomTopic() + ' shorts' : `${category} shorts`);

    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short', pageToken: appState.youtubeNextPageTokens.shorts, type: 'video' });

    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    if(data.items) {
        renderVideoSwiper(data.items, true);
    }
}


async function setupLongVideoScreen() {
    renderCategoriesInBar();
    await populateLongVideoGrid('Trending');
    await renderTrendingCarousel();
    
    const gridContainer = document.querySelector('.long-video-screen-content');
    let loadMoreBtn = document.getElementById('long-video-load-more-btn');
    if (!loadMoreBtn && gridContainer) {
        loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'long-video-load-more-btn';
        loadMoreBtn.className = 'continue-btn haptic-trigger';
        loadMoreBtn.textContent = 'Load More';
        loadMoreBtn.style.margin = '20px';
        loadMoreBtn.style.display = 'none';
        loadMoreBtn.onclick = loadMoreLongVideos;
        gridContainer.appendChild(loadMoreBtn);
    }
}

async function populateLongVideoGrid(category = 'All') {
    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    let query;
    if (category.toLowerCase() === 'trending') {
        query = 'trending videos';
    } else {
        query = category.toLowerCase() === 'all' ? getRandomTopic() : category; 
    }
    
    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'long', type: 'video' });
    
    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    renderYouTubeLongVideos(data.items || [], false);
}

async function renderTrendingCarousel() {
    const carouselWrapper = document.getElementById('long-video-carousel-wrapper');
    if (!carouselWrapper) return;
    carouselWrapper.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
    
    const data = await fetchFromYouTubeAPI('search', { q: 'latest trending videos', videoDuration: 'long', type: 'video', limit: 10 });
    
    if (data.items && data.items.length > 0) {
        carouselWrapper.innerHTML = data.items.map(video => {
            const videoId = video.id?.videoId || video.id;
            const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url;
            return `
                <div class="carousel-card haptic-trigger" 
                     style="background-image: url('${escapeHTML(thumbnailUrl)}')"
                     onclick="playYouTubeVideoFromCard('${videoId}')">
                </div>
            `;
        }).join('');
    } else {
        carouselWrapper.innerHTML = `<p class="static-message">Could not load trending videos.</p>`;
    }
}


async function performLongVideoSearch() {
    const input = document.getElementById('long-video-search-input');
    const query = input.value.trim();
    
    if (!query) {
        const activeCategoryChip = document.querySelector('#long-video-category-scroller .category-chip.active');
        const category = activeCategoryChip ? activeCategoryChip.dataset.category : 'Trending';
        filterVideosByCategory('long-video-category-scroller', category, activeCategoryChip);
        return;
    }
    
    document.querySelectorAll('#long-video-category-scroller .category-chip').forEach(chip => chip.classList.remove('active'));

    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    // ★★★ FIX ★★★ सुनिश्चित किया गया कि 'videoDuration' हमेशा 'long' हो और type 'video' हो
    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'long', type: 'video' });
    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    renderYouTubeLongVideos(data.items || [], false);
}

function createLongVideoCard(video) {
    const videoId = video.id?.videoId || video.id;
    if (!videoId || !video.snippet) return null;

    const card = document.createElement('div');
    card.className = 'long-video-card';
    card.dataset.videoId = videoId;
    card.dataset.channelId = video.snippet.channelId;
    
    const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url;
    
    const addChannelOnClick = `addChannelToList(event, '${video.snippet.channelId}')`;

    card.innerHTML = `
        <div class="long-video-thumbnail" style="background-image: url('${escapeHTML(thumbnailUrl)}')" onclick="playYouTubeVideoFromCard('${videoId}')">
            <i class="fas fa-play play-icon-overlay"></i>
        </div>
        <div class="long-video-info-container">
            <div class="long-video-details" onclick="navigateTo('creator-page-screen', { creatorId: '${video.snippet.channelId}', startWith: 'home' })">
                <span class="long-video-name">${escapeHTML(video.snippet.title)}</span>
                <span class="long-video-uploader">${escapeHTML(video.snippet.channelTitle)}</span>
            </div>
        </div>
        <button class="add-channel-btn-long-grid haptic-trigger" onclick="${addChannelOnClick}"><i class="fas fa-plus"></i> Add Channel</button>
    `;
    return card;
}

function initializeHistoryScreen() {
    const clearButton = document.getElementById('history-date-button'); 
    if (clearButton) {
        clearButton.innerHTML = `<i class="fas fa-trash-alt"></i> Clear All`;
        clearButton.onclick = clearAllHistory;
    }
    appState.viewingHistory = JSON.parse(localStorage.getItem('shubhzoneViewingHistory') || '[]');
    renderHistoryShortsScroller();
    renderHistoryLongVideoList();
}


function renderHistoryShortsScroller() {
    const scroller = document.getElementById('history-shorts-scroller');
    if (!scroller) return;
    
    const historyVideos = appState.viewingHistory.filter(v => v.videoLengthType === 'short');
    if (historyVideos.length === 0) {
        scroller.innerHTML = `<p class="static-message" style="color: var(--text-secondary);">No short video history.</p>`;
        return;
    }

    scroller.innerHTML = historyVideos.map(video => `
        <div class="history-short-card haptic-trigger" 
             style="background-image: url(${escapeHTML(video.thumbnailUrl)})"
             onclick="navigateTo('creator-page-screen', { creatorId: '${video.channelId}', startWith: 'home' })">
            <div class="history-item-menu" onclick="event.stopPropagation(); deleteFromHistory('${video.id}')"><i class="fas fa-trash-alt"></i></div>
        </div>
    `).join('');
}


function renderHistoryLongVideoList() {
    const list = document.getElementById('history-long-video-list');
    if (!list) return;

    const historyVideos = appState.viewingHistory.filter(v => v.videoLengthType === 'long');
    if (historyVideos.length === 0) {
        list.innerHTML = `<p class="static-message" style="color: var(--text-secondary);">No long video history.</p>`;
        return;
    }

    list.innerHTML = historyVideos.map(video => `
        <div class="history-list-item haptic-trigger">
            <div class="history-item-thumbnail" style="background-image: url('${escapeHTML(video.thumbnailUrl)})'" onclick="playYouTubeVideoFromCard('${video.id}')"></div>
            <div class="history-item-info" onclick="playYouTubeVideoFromCard('${video.id}')">
                <span class="history-item-title">${escapeHTML(video.title)}</span>
                <span class="history-item-uploader">${escapeHTML(video.channelTitle)}</span>
            </div>
            <div class="history-item-menu haptic-trigger" onclick="deleteFromHistory('${video.id}')">
                <i class="fas fa-trash-alt"></i>
            </div>
        </div>
    `).join('');
}


function clearAllHistory() {
    if (confirm("Are you sure you want to clear your entire watch history? This cannot be undone.")) {
        appState.viewingHistory = [];
        localStorage.removeItem('shubhzoneViewingHistory');
        initializeHistoryScreen();
    }
}


function deleteFromHistory(videoId) {
    if (confirm(`Remove this video from your history?`)) {
        appState.viewingHistory = appState.viewingHistory.filter(item => item.id !== videoId);
        localStorage.setItem('shubhzoneViewingHistory', JSON.stringify(appState.viewingHistory));
        initializeHistoryScreen();
    }
}

async function populateAddFriendsList(featuredUser = null) {
    const addContent = document.querySelector('#friends-screen #add-content');
    if (!addContent) return;
    
    const userListContainer = addContent.querySelector('#add-friend-user-list');
    if (!userListContainer) return;
    userListContainer.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

    try {
        const usersSnapshot = await db.collection('users').orderBy('name').get();
        if (usersSnapshot.empty) {
            userListContainer.innerHTML = '<p class="static-message">No other users found.</p>';
            return;
        }
        
        const currentUserFriends = appState.currentUser.friends || [];
        const sentRequestsSnapshot = await db.collection('friendRequests').where('senderId', '==', appState.currentUser.uid).get();
        const requestedIds = sentRequestsSnapshot.docs.map(doc => doc.data().receiverId);

        const createUserCard = (user) => {
            const isRequested = requestedIds.includes(user.id);
            const buttonHtml = isRequested 
                ? `<button class="add-button requested" disabled>Requested</button>`
                : `<button class="add-button haptic-trigger" onclick="sendFriendRequest('${user.id}', this)">Add Friend</button>`;

            return `
            <div class="holographic-card">
                <div class="profile-pic" onclick="showEnlargedImage('${escapeHTML(user.avatar) || 'https://via.placeholder.com/60'}')"><img src="${escapeHTML(user.avatar) || 'https://via.placeholder.com/60'}" alt="avatar"></div>
                <div class="info">
                    <div class="name">${escapeHTML(user.name) || 'User'}</div>
                     <div class="subtext" style="font-size: 0.8em; color: var(--primary-neon);">${escapeHTML(user.referralCode) || ''}</div>
                </div>
                ${buttonHtml}
            </div>`;
        };

        let featuredHtml = '';
        if (featuredUser) {
            featuredHtml = createUserCard(featuredUser);
        }

        const otherUsersHtml = usersSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(user => 
                user.id !== appState.currentUser.uid && 
                user.name &&
                (!featuredUser || user.id !== featuredUser.id) &&
                !currentUserFriends.includes(user.id)
            )
            .map(createUserCard)
            .join('');

        userListContainer.innerHTML = featuredHtml + otherUsersHtml || '<p class="static-message">No other users to add.</p>';
    } catch (error) {
        console.error("Error fetching users for Add Friends:", error);
        userListContainer.innerHTML = '<p class="static-message" style="color: var(--error-red);">Could not load user list.</p>';
    }
}
async function searchUser() {
    const searchInput = document.getElementById('add-friend-search-input');
    const query = searchInput.value.trim();
    const userListContainer = document.querySelector('#add-friend-user-list');

    if (!query) {
        populateAddFriendsList();
        return;
    }
    
    userListContainer.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

    try {
        let userQuery;
        if (query.startsWith('@')) {
            userQuery = await db.collection('users').where('referralCode', '==', query).limit(1).get();
        } else {
             userQuery = await db.collection('users').where('name', '>=', query).where('name', '<=', query + '\uf8ff').get();
        }

        if (userQuery.empty) {
            userListContainer.innerHTML = `<p class="static-message">No user found for: ${escapeHTML(query)}</p>`;
        } else {
            const foundUser = { id: userQuery.docs[0].id, ...userQuery.docs[0].data() };
            populateAddFriendsList(foundUser);
        }
    } catch (error) {
        console.error("Error searching user:", error);
        userListContainer.innerHTML = `<p class="static-message" style="color: var(--error-red);">Error during search. Check Firestore indexes.</p>`;
    }
}
async function sendFriendRequest(receiverId, buttonElement) {
    if (!appState.currentUser.uid || !receiverId) return;

    buttonElement.disabled = true;
    buttonElement.textContent = '...';

    const requestData = {
        senderId: appState.currentUser.uid, senderName: appState.currentUser.name, senderAvatar: appState.currentUser.avatar,
        receiverId: receiverId, status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    try {
        const existingRequest = await db.collection('friendRequests').where('senderId', '==', appState.currentUser.uid).where('receiverId', '==', receiverId).get();
        if (!existingRequest.empty) {
            alert("You have already sent a friend request to this user.");
            buttonElement.textContent = 'Requested'; buttonElement.classList.add('requested'); return;
        }
        await db.collection('friendRequests').add(requestData);
        buttonElement.textContent = 'Requested'; buttonElement.classList.add('requested');
    } catch (error) {
        console.error("Error sending friend request:", error);
        alert("Failed to send friend request.");
        buttonElement.disabled = false; buttonElement.textContent = 'Add Friend';
    }
}
async function populateFriendRequestsList() {
    const requestsContent = document.getElementById('requests-content');
    if (!requestsContent) return;
    requestsContent.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    try {
        const requestsSnapshot = await db.collection('friendRequests').where('receiverId', '==', appState.currentUser.uid).where('status', '==', 'pending').orderBy('createdAt', 'desc').get();
        if (requestsSnapshot.empty) {
            requestsContent.innerHTML = '<p class="static-message">No new friend requests.</p>'; return;
        }
        requestsContent.innerHTML = requestsSnapshot.docs.map(doc => {
            const request = { id: doc.id, ...doc.data() };
            return `<div class="holographic-card" id="request-${request.id}"> <div class="profile-pic" onclick="showEnlargedImage('${escapeHTML(request.senderAvatar) || 'https://via.placeholder.com/60'}')"><img src="${escapeHTML(request.senderAvatar) || 'https://via.placeholder.com/60'}" alt="avatar"></div> <div class="info"> <div class="name">${escapeHTML(request.senderName) || 'User'}</div> <div class="subtext">Wants to be your friend</div> </div> <div class="request-actions"> <button class="accept-button haptic-trigger" onclick="acceptFriendRequest(event, '${request.id}', '${request.senderId}')">Accept</button> <button class="reject-button haptic-trigger" onclick="rejectFriendRequest(event, '${request.id}')">Reject</button> </div> </div>`;
        }).join('');
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        requestsContent.innerHTML = `<p class="static-message" style="color: var(--error-red);">Could not load requests.</p>`;
    }
}
async function acceptFriendRequest(event, requestId, senderId) {
    const actionDiv = event.target.closest('.request-actions');
    actionDiv.innerHTML = '<div class="loader" style="width: 20px; height: 20px;"></div>';
    const batch = db.batch();
    batch.update(db.collection('friendRequests').doc(requestId), { status: 'accepted' });
    batch.update(db.collection('users').doc(appState.currentUser.uid), { friends: firebase.firestore.FieldValue.arrayUnion(senderId) });
    batch.update(db.collection('users').doc(senderId), { friends: firebase.firestore.FieldValue.arrayUnion(appState.currentUser.uid) });
    try {
        await batch.commit();
        if (!appState.currentUser.friends.includes(senderId)) appState.currentUser.friends.push(senderId);
        const requestCard = document.getElementById(`request-${requestId}`);
        if (requestCard) requestCard.remove();
        populateMembersList();
    } catch (error) {
        console.error("Error accepting friend request:", error);
        alert("Failed to accept request.");
        actionDiv.innerHTML = `<button class="accept-button haptic-trigger" onclick="acceptFriendRequest(event, '${requestId}', '${senderId}')">Accept</button> <button class="reject-button haptic-trigger" onclick="rejectFriendRequest(event, '${requestId}')">Reject</button>`;
    }
}
async function rejectFriendRequest(event, requestId) {
    const actionDiv = event.target.closest('.request-actions');
    actionDiv.innerHTML = '<div class="loader" style="width: 20px; height: 20px;"></div>';
    try {
        await db.collection('friendRequests').doc(requestId).delete();
        const requestCard = document.getElementById(`request-${requestId}`);
        if (requestCard) requestCard.remove();
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        alert("Failed to reject request.");
    }
}
async function populateMembersList() {
    const membersContent = document.getElementById('members-content');
    if (!membersContent) return;
    membersContent.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    const friendIds = appState.currentUser.friends || [];
    if (friendIds.length === 0) {
        membersContent.innerHTML = '<p class="static-message">You have no friends yet.</p>'; return;
    }
    try {
        const friendDocs = await Promise.all(friendIds.map(id => db.collection('users').doc(id).get()));
        let finalHtml = friendDocs.map((doc, index) => {
            if (!doc.exists) return '';
            const friend = { id: doc.id, ...doc.data() };
            let cardHtml = `<div class="holographic-card" onclick="startChat('${friend.id}', '${escapeHTML(friend.name)}', '${escapeHTML(friend.avatar)}')"> <div class="profile-pic" onclick="event.stopPropagation(); showEnlargedImage('${escapeHTML(friend.avatar) || 'https://via.placeholder.com/60'}')"> <img src="${escapeHTML(friend.avatar) || 'https://via.placeholder.com/60'}" alt="avatar"> </div> <div class="info"> <div class="name">${escapeHTML(friend.name) || 'User'}</div> <div class="subtext">Tap to chat</div> </div> </div>`;
            if ((index + 1) % 5 === 0) {
                const adContainerId = `friend-ad-${index}`;
                cardHtml += `<div class="friend-list-ad" id="${adContainerId}"></div>`;
                setTimeout(() => {
                    const adElement = document.getElementById(adContainerId);
                    if (adElement) injectBannerAd(adElement);
                }, 100);
            }
            return cardHtml;
        }).join('');
        membersContent.innerHTML = finalHtml || '<p class="static-message">Could not load friends list.</p>';
    } catch (error) {
        console.error("Error fetching members:", error);
        membersContent.innerHTML = '<p class="static-message" style="color: var(--error-red);">Could not load your friends.</p>';
    }
}
async function startChat(friendId, friendName, friendAvatar) {
    const chatScreen = document.getElementById('chat-screen-overlay');
    if (!chatScreen) return;
    
    document.getElementById('chat-username').textContent = friendName;
    document.getElementById('chat-user-profile-pic').src = friendAvatar || 'https://via.placeholder.com/50';
    const chatId = [appState.currentUser.uid, friendId].sort().join('_');
    appState.activeChat = { chatId, friendId, friendName, friendAvatar };

    try {
        const chatRef = db.collection('chats').doc(chatId);
        await chatRef.set({
            members: [appState.currentUser.uid, friendId],
            memberDetails: {
                [appState.currentUser.uid]: { name: appState.currentUser.name, avatar: appState.currentUser.avatar },
                [friendId]: { name: friendName, avatar: friendAvatar }
            }
        }, { merge: true });
        chatScreen.classList.add('active');
        loadChatMessages(chatId);
    } catch (error) {
        console.error("Error starting chat:", error);
        alert("Could not start chat.");
    }
}
async function sendMessage() {
    const { chatId } = appState.activeChat;
    const inputField = document.querySelector('#chat-screen-overlay .input-field');
    const text = inputField.value.trim();
    if (!text || !chatId) return;
    inputField.value = '';
    try {
        await db.collection('chats').doc(chatId).collection('messages').add({
            text: text, senderId: appState.currentUser.uid, createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Error sending message:", error);
        inputField.value = text;
    }
}
function loadChatMessages(chatId) {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    db.collection('chats').doc(chatId).collection('messages').orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
          messagesContainer.innerHTML = snapshot.empty ? '<p class="static-message">No messages yet. Say hi!</p>' : snapshot.docs.map(doc => {
              const msg = doc.data();
              const bubbleClass = msg.senderId === appState.currentUser.uid ? 'sender' : 'receiver';
              return `<div class="message-bubble ${bubbleClass}">${escapeHTML(msg.text)}</div>`;
          }).join('');
          messagesContainer.scrollTop = messagesContainer.scrollHeight; 
      }, error => {
          console.error("Error loading chat messages:", error);
          messagesContainer.innerHTML = '<p class="static-message" style="color: var(--error-red);">Could not load chat.</p>';
      });
}

// =======================================================
// ★★★ CREATOR PAGE LOGIC (REWORKED & FIXED) - START ★★★
// =======================================================

async function initializeCreatorPage(payload) {
    const { creatorId, startWith = 'home', videoId } = payload;
    appState.creatorPage.currentChannelId = creatorId;

    // ★ बदलाव: यदि startWith 'play' है, तो सीधे प्लेयर दिखाएं
    if (startWith === 'play' && videoId) {
        showCreatorPlayerView(videoId);
        return;
    }

    // चैनल व्यू को रेंडर करें
    appState.creatorPage.currentView = 'channel';
    const creatorPageHeader = document.getElementById('creator-page-screen').querySelector('.screen-header');
    const creatorPageTabsContainer = document.getElementById('creator-page-tabs');
    const creatorPageContent = document.getElementById('creator-page-content');
    
    // हेडर को दृश्यमान बनाएं और कंटेंट एरिया को रीसेट करें
    creatorPageHeader.style.display = 'flex';
    creatorPageTabsContainer.style.display = 'flex'; // सुनिश्चित करें कि टैब दिखें
    creatorPageContent.innerHTML = '';
    creatorPageContent.classList.remove('player-active');


    // नए टैब बनाएं: Home, Videos, Shorts, Playlists
    creatorPageTabsContainer.innerHTML = `
        <button class="creator-page-tab-btn haptic-trigger" data-type="home">Home</button>
        <button class="creator-page-tab-btn haptic-trigger" data-type="videos">Videos</button>
        <button class="creator-page-tab-btn haptic-trigger" data-type="shorts">Shorts</button>
        <button class="creator-page-tab-btn haptic-trigger" data-type="playlists">Playlists</button>
    `;
    
    creatorPageTabsContainer.querySelectorAll('.creator-page-tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
             creatorPageTabsContainer.querySelectorAll('.creator-page-tab-btn').forEach(t => t.classList.remove('active'));
             tab.classList.add('active');
             loadCreatorPageContent({ ...payload, startWith: tab.dataset.type, videoId: null });
        });
    });

    // 'home' और 'videos' को एक ही मानें
    const effectiveStartWith = (startWith === 'videos') ? 'home' : startWith;
    const initialTab = creatorPageTabsContainer.querySelector(`.creator-page-tab-btn[data-type="${effectiveStartWith}"]`) || creatorPageTabsContainer.querySelector(`.creator-page-tab-btn[data-type="home"]`);
    if(initialTab) initialTab.classList.add('active');
    
    await loadCreatorPageContent({ ...payload, startWith: effectiveStartWith });
}

async function loadCreatorPageContent(payload) {
    const { creatorId, startWith, playlistId } = payload;
    const contentArea = document.getElementById('creator-page-content');
    contentArea.innerHTML = '<div class="loader-container" style="height: 100%;"><div class="loader"></div></div>';

    let data;
    switch(startWith) {
        case 'home':
        case 'videos':
            // ★★★ FIX ★★★: केवल 'video' टाइप के लिए सर्च करें ताकि केवल वीडियो मिलें
            data = await fetchFromYouTubeAPI('search', { channelId: creatorId, order: 'date', videoDuration: 'long', type: 'video' });
            renderCreatorVideoList(contentArea, data.items || [], 'long');
            break;
        case 'shorts':
             // ★★★ FIX ★★★: केवल 'video' टाइप के लिए सर्च करें
            data = await fetchFromYouTubeAPI('search', { channelId: creatorId, videoDuration: 'short', order: 'date', type: 'video' });
            renderCreatorVideoList(contentArea, data.items || [], 'short');
            break;
        case 'playlists':
             data = await fetchFromYouTubeAPI('playlists', { channelId: creatorId });
             renderCreatorPlaylistList(contentArea, data.items || [], payload);
             break;
        case 'playlistItems':
             data = await fetchFromYouTubeAPI('playlistItems', { playlistId: playlistId });
             renderCreatorVideoList(contentArea, data.items || [], 'long'); // Playlist items are typically long videos
            break;
    }
}

function renderCreatorVideoList(container, videos, type) {
    if (!videos || videos.length === 0) {
        container.innerHTML = `<p class="static-message">No ${type} videos found for this creator.</p>`;
        return;
    }
    
    const grid = document.createElement('div');
    grid.className = 'creator-video-grid';
    
    if (type === 'long') {
        grid.classList.add('long-video-list'); // Single column list
        grid.innerHTML = videos.map(video => {
            // ★★★ FIX ★★★ सुनिश्चित करें कि केवल वीडियो आइटम ही रेंडर हों
            if (video.id.kind !== 'youtube#video' && video.kind !== 'youtube#playlistItem') return '';
            const videoDetails = video.snippet;
            const videoId = video.id?.videoId || videoDetails.resourceId?.videoId;
            const thumbnailUrl = videoDetails.thumbnails.high?.url || videoDetails.thumbnails.medium?.url;
            if (!videoId || !thumbnailUrl) return '';

            // Using the existing long-video-card structure
            return `
                <div class="long-video-card" onclick="showCreatorPlayerView('${videoId}')">
                    <div class="long-video-thumbnail" style="background-image: url('${escapeHTML(thumbnailUrl)}')">
                         <i class="fas fa-play play-icon-overlay"></i>
                    </div>
                    <div class="long-video-info-container">
                        <div class="long-video-details">
                            <span class="long-video-name">${escapeHTML(videoDetails.title)}</span>
                            <span class="long-video-uploader">${escapeHTML(videoDetails.channelTitle)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } else { // 'short'
         grid.classList.add('short-video-list'); // 3-column grid
         grid.innerHTML = videos.map(video => {
             // ★★★ FIX ★★★ सुनिश्चित करें कि केवल वीडियो आइटम ही रेंडर हों
             if (video.id.kind !== 'youtube#video') return '';
             const videoDetails = video.snippet;
             const videoId = video.id?.videoId;
             const thumbnailUrl = videoDetails.thumbnails.high?.url || videoDetails.thumbnails.medium?.url;
             if (!videoId || !thumbnailUrl) return '';
             
             // Using history-short-card for 9:16 aspect ratio
             return `
                <div class="history-short-card" style="background-image: url('${escapeHTML(thumbnailUrl)}'); cursor: pointer;"
                     onclick="playYouTubeVideoFromCard('${videoId}')">
                </div>
             `;
         }).join('');
    }
    
    container.innerHTML = '';
    container.appendChild(grid);
}

function renderCreatorPlaylistList(container, playlists, payload) {
    if (!playlists || playlists.length === 0) {
        container.innerHTML = `<p class="static-message">No playlists found for this creator.</p>`;
        return;
    }

    const list = document.createElement('div');
    list.className = 'creator-playlist-list';

    list.innerHTML = playlists.map(playlist => {
        const p = playlist.snippet;
        const plId = playlist.id;
        const itemCount = playlist.contentDetails?.itemCount;
        if (!plId || !p.thumbnails?.medium?.url) return '';
        
        return `
            <div class="history-list-item haptic-trigger" 
                 onclick="loadCreatorPageContent({ creatorId: '${payload.creatorId}', startWith: 'playlistItems', playlistId: '${plId}' })">
                <div class="history-item-thumbnail" style="background-image: url('${escapeHTML(p.thumbnails.medium.url)}')"></div>
                <div class="history-item-info">
                    <span class="history-item-title">${escapeHTML(p.title)}</span>
                    <span class="history-item-uploader">${itemCount !== undefined ? itemCount + ' videos' : 'Playlist'}</span>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = '';
    container.appendChild(list);
}


function showCreatorPlayerView(videoId) {
    appState.creatorPage.currentView = 'player';
    const creatorPageScreen = document.getElementById('creator-page-screen');
    const contentArea = document.getElementById('creator-page-content');
    
    // Hide header and tabs
    creatorPageScreen.querySelector('.screen-header').style.display = 'none';
    creatorPageScreen.querySelector('#creator-page-tabs').style.display = 'none';
    contentArea.classList.add('player-active');


    contentArea.innerHTML = `
        <div id="creator-page-player-container">
            <div class="player-wrapper">
                <div id="creator-page-player-long"></div>
            </div>
            <button id="player-rotate-btn" class="haptic-trigger"><i class="fas fa-sync-alt"></i> Rotate</button>
        </div>
    `;
    
    initializeCreatorPagePlayer(videoId, 'creator-page-player-long', 'long');

    // Event listener for the rotate button
    document.getElementById('player-rotate-btn').addEventListener('click', () => {
        const appContainer = document.getElementById('app-container');
        appContainer.classList.toggle('fullscreen-active');
    });
}

function initializeCreatorPagePlayer(videoId, containerId, type) {
    if (appState.creatorPagePlayers[type]) {
        appState.creatorPagePlayers[type].destroy();
    }
    
    const playerContainer = document.getElementById(containerId);
    if (!playerContainer || !isYouTubeApiReady) return;

    // ★ बदलाव: YouTube UI को कम करने के लिए प्लेयर वेरिएबल्स
    appState.creatorPagePlayers[type] = new YT.Player(containerId, {
        height: '100%', width: '100%', videoId: videoId,
        playerVars: {
            'autoplay': 1, 
            'controls': 0, // नियंत्रण छिपाएं
            'rel': 0, 
            'showinfo': 0, // जानकारी छिपाएं
            'mute': 0, 
            'modestbranding': 1, // YouTube लोगो कम करें
            'fs': 0, // फुलस्क्रीन बटन अक्षम करें क्योंकि हमारा अपना बटन है
            'origin': window.location.origin,
            'iv_load_policy': 3 // एनोटेशन अक्षम करें
        },
        events: {
            'onReady': (event) => {
                event.target.playVideo();
                event.target.unMute();
                const videoData = currentVideoCache.get(videoId);
                if (videoData) {
                    addLongVideoToHistory(videoData);
                }
            },
            'onStateChange': handleCreatorPlayerStateChange
        }
    });
}

function handleCreatorPlayerStateChange(event) {
    // भविष्य के उपयोग के लिए रखा गया है
}

// =======================================================
// ★★★ CREATOR PAGE LOGIC (REWORKED & FIXED) - END ★★★
// =======================================================

// =======================================================
// ★★★ ADDED CHANNELS LOGIC - START ★★★
// =======================================================
async function addChannelToList(event, channelId) {
    event.stopPropagation();
    if (!channelId) return;

    let channels = appState.currentUser.addedChannels || [];
    if (channels.some(c => c.id === channelId)) {
        alert("This channel is already in your list.");
        return;
    }

    try {
        const data = await fetchFromYouTubeAPI('channelDetails', { id: channelId });
        if (!data.items || data.items.length === 0) {
            alert("Could not retrieve channel details.");
            return;
        }
        
        const channelDetails = {
            id: channelId,
            name: data.items[0].snippet.title,
            avatar: data.items[0].snippet.thumbnails.default.url
        };
        
        channels.push(channelDetails);
        appState.currentUser.addedChannels = channels;
        localStorage.setItem('shubhzone_addedChannels', JSON.stringify(channels));
        alert(`Channel "${channelDetails.name}" has been added to your list.`);

        if (appState.currentScreen === 'friends-screen') {
            renderMyChannelsList();
        }

    } catch (error) {
        console.error("Error adding channel to list:", error);
        alert("Failed to add channel.");
    }
}

function renderMyChannelsList() {
    const container = document.getElementById('my-channels-content');
    if (!container) return;

    const channels = appState.currentUser.addedChannels || [];
    if (channels.length === 0) {
        container.innerHTML = `<p class="static-message">You haven't added any channels yet. Click the 'Add' button on any video to save a channel here.</p>`;
        return;
    }

    container.innerHTML = channels.map(channel => `
        <div class="holographic-card">
            <div class="profile-pic"><img src="${escapeHTML(channel.avatar)}" alt="avatar"></div>
            <div class="info">
                <div class="name">${escapeHTML(channel.name)}</div>
                <div class="subtext">Added Channel</div>
            </div>
            <div class="channel-actions">
                <button class="open-button haptic-trigger" onclick="navigateTo('creator-page-screen', { creatorId: '${channel.id}', startWith: 'home' })">Open</button>
                <button class="reject-button haptic-trigger" onclick="removeChannelFromList(event, '${channel.id}')"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `).join('');
}

function removeChannelFromList(event, channelId) {
    event.stopPropagation();
    if (!confirm("Are you sure you want to remove this channel from your list?")) return;

    let channels = appState.currentUser.addedChannels || [];
    channels = channels.filter(c => c.id !== channelId);
    appState.currentUser.addedChannels = channels;
    localStorage.setItem('shubhzone_addedChannels', JSON.stringify(channels));
    
    renderMyChannelsList();
}
// =======================================================
// ★★★ ADDED CHANNELS LOGIC - END ★★★
// =======================================================

function provideHapticFeedback() { if (hapticFeedbackEnabled && navigator.vibrate) navigator.vibrate(50); }
function loadHapticPreference() {
    hapticFeedbackEnabled = (localStorage.getItem('hapticFeedbackEnabled') !== 'false');
}

// ★★★ IMAGE ENLARGE LOGIC - START ★★★
function showEnlargedImage(imageUrl) {
    let modal = document.getElementById('image-enlarge-modal');
    if (!modal) return;
    
    const imgElement = document.getElementById('enlarged-image-src');
    if(imgElement) {
        imgElement.src = imageUrl;
        modal.classList.add('active');
    }
}
// ★★★ IMAGE ENLARGE LOGIC - END ★★★

document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.add('haptic-trigger');
        item.addEventListener('click', () => {
            const targetNav = item.getAttribute('data-nav');
            if(item.style.display === 'none') return;
            
            let targetScreen = `${targetNav}-screen`;
            if (targetNav === 'shorts') targetScreen = 'home-screen';
            
            navigateTo(targetScreen);
            updateNavActiveState(targetNav);
        });
    });

    document.querySelector('#creator-page-screen .header-icon-left')?.addEventListener('click', () => navigateBack());

    initializeApp();

    document.getElementById('get-started-btn')?.addEventListener('click', () => {
        userHasInteracted = true;
        startAppLogic();
    });

    appContainer.addEventListener('click', (event) => { 
        if (!userHasInteracted) {
             userHasInteracted = true;
             Object.values(players).forEach(p => p && typeof p.unMute === 'function' && p.unMute());
             if(appState.creatorPagePlayers.long && typeof appState.creatorPagePlayers.long.unMute === 'function') {
                appState.creatorPagePlayers.long.unMute();
             }
        }
        if (event.target.closest('.haptic-trigger')) provideHapticFeedback(); 
    });

    initializeMessagingInterface();
    document.getElementById('add-friend-search-btn')?.addEventListener('click', searchUser);
    document.getElementById('add-friend-search-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchUser(); });

    // ★ बदलाव: साइडबार खोलने के लिए मेनू आइकन इवेंट लिस्नर
    const openSidebar = () => {
        document.getElementById('main-sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.add('open');
    };
    document.getElementById('home-menu-icon')?.addEventListener('click', openSidebar);
    document.getElementById('long-video-menu-icon')?.addEventListener('click', openSidebar);
    
    // ★ बदलाव: साइडबार में प्रोफाइल बटन के लिए इवेंट लिस्नर
    const profileSidebarBtn = document.getElementById('sidebar-profile-btn');
    if (profileSidebarBtn) {
        profileSidebarBtn.addEventListener('click', () => {
            navigateTo('profile-screen');
            // साइडबार बंद करें
            document.getElementById('main-sidebar').classList.remove('open');
            document.getElementById('sidebar-overlay').classList.remove('open');
        });
    }

    document.getElementById('close-sidebar-btn')?.addEventListener('click', () => {
        document.getElementById('main-sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('open');
    });
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
        document.getElementById('main-sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('open');
    });
    
    document.getElementById('send-comment-btn')?.addEventListener('click', postComment);
    
    document.getElementById('long-video-search-btn')?.addEventListener('click', performLongVideoSearch);
    document.getElementById('long-video-search-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') performLongVideoSearch(); });
    document.getElementById('long-video-history-btn')?.addEventListener('click', () => navigateTo('history-screen'));
    document.getElementById('back-from-history-btn')?.addEventListener('click', () => navigateBack());
    
    document.getElementById('profile-your-zone-btn')?.addEventListener('click', () => navigateTo('information-screen'));
    document.getElementById('profile-show-shorts-btn')?.addEventListener('click', () => toggleProfileVideoView('short'));
    document.getElementById('profile-show-longs-btn')?.addEventListener('click', () => toggleProfileVideoView('long'));
    
    const enlargeModal = document.getElementById('image-enlarge-modal');
    if (enlargeModal) enlargeModal.addEventListener('click', () => enlargeModal.classList.remove('active'));

    loadHapticPreference();

    document.querySelectorAll('#friends-screen .tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            document.querySelectorAll('#friends-screen .tab-content').forEach(content => content.classList.add('hidden'));
            document.querySelectorAll('#friends-screen .tab-button').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`${tabId}-content`).classList.remove('hidden');
            button.classList.add('active');
        });
    });
});

function initializeMessagingInterface() {
    const chatScreen = document.getElementById('chat-screen-overlay');
    if (!chatScreen) return;
    chatScreen.querySelector('.back-arrow')?.addEventListener('click', () => chatScreen.classList.remove('active'));
    
    const sendButton = chatScreen.querySelector('#send-button');
    const inputField = chatScreen.querySelector('.input-field');

    sendButton?.addEventListener('click', sendMessage);
    inputField?.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMessage(); });
    inputField?.addEventListener('input', () => {
        if(inputField.value.trim().length > 0) {
            sendButton.classList.add('active');
        } else {
            sendButton.classList.remove('active');
        }
    });
}

function toggleProfileVideoView(view) {
    const showShortsBtn = document.getElementById('profile-show-shorts-btn');
    const showLongsBtn = document.getElementById('profile-show-longs-btn');
    const shortGrid = document.getElementById('user-short-video-grid');
    const longGrid = document.getElementById('user-long-video-grid');

    if (!showShortsBtn || !showLongsBtn || !shortGrid || !longGrid) return;
    
    if (view === 'short') {
        showShortsBtn.classList.add('active');
        showLongsBtn.classList.remove('active');
        shortGrid.style.display = 'grid';
        longGrid.style.display = 'none';
    } else {
        showShortsBtn.classList.remove('active');
        showLongsBtn.classList.add('active');
        shortGrid.style.display = 'none';
        longGrid.style.display = 'grid';
    }
}
