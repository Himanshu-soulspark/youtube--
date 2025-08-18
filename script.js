/* ================================================= /
/ === Shubhzone App Script (Code 2) - FINAL v6.0 === /
/ === MODIFIED AS PER USER REQUEST - AUG 2025    === /
/ === SOLVED: Reward System, UI Changes, Caching === /
/ ================================================= */

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
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && container.hasChildNodes()) {
                // विज्ञापन स्क्रिप्ट ने कुछ जोड़ा है, इसलिए कंटेनर दिखाएँ
                container.style.display = 'flex';
                obs.disconnect(); // एक बार जब यह काम हो जाए तो देखना बंद कर दें
                return;
            }
        }
    });

    observer.observe(container, {
        childList: true,
        subtree: true
    });

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
        adScript.text = (function(d, z, s) {
            s.src = 'https://' + d + '/401/' + z;
            try {
                (document.body || document.documentElement).appendChild(s)
            } catch (e) {}
        })('gizokraijaw.net', 9583482, document.createElement('script'));
        container.appendChild(adScript);
    } else {
        // Adsterra नेटिव बैनर
        console.log("[AD] Injecting Adsterra Native Banner...");
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.setAttribute('data-cfasync', 'false');
        adScript.src = "//decreaselackadmit.com/f218d914c870fc85f6dd64b9c8c31249/invoke.js";
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

    const {
        sequence,
        currentIndex
    } = appState.adState.fullscreenAd;
    const adType = sequence[currentIndex];

    console.log(`[AD] Triggering Full-Screen Ad. Type: ---> ${adType.toUpperCase()} <---`);

    switch (adType) {
        case 'monetag_interstitial':
            console.log("[AD] Injecting Monetag Interstitial script...");
            const monetagInterstitial = document.createElement('script');
            monetagInterstitial.text = (function(d, z, s) {
                s.src = 'https://' + d + '/401/' + z;
                try {
                    (document.body || document.documentElement).appendChild(s)
                } catch (e) {}
            })('groleegni.net', 9572500, document.createElement('script'));
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
                const originalContent = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalContent;
                }, 2000);
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
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 2000);
        }
    } catch (err) {
        console.error('Fallback copy to clipboard failed', err);
        alert('Failed to copy text.');
    }
    document.body.removeChild(textArea);
}

async function generateAndSaveReferralCode(uid, name) {
    // ★ बदलाव: आईडी को 5 कैरेक्टर का बनाया गया (2 अक्षर, 3 अंक)
    const safeName = (name || 'user').replace(/[^a-zA-Z]/g, '').toLowerCase().substring(0, 2);
    const randomPart = Math.random().toString().substring(2, 5);
    let referralCode = `@${safeName}${randomPart}`;

    // यह सुनिश्चित करने के लिए कि लंबाई सही है
    while (referralCode.length < 6) {
        referralCode += Math.floor(Math.random() * 10);
    }

    try {
        await db.collection('users').doc(uid).update({
            referralCode: referralCode
        });
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
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// =================================================
// ★★★ Helper Functions - END ★★★
// =================================================

// ऐप का ग्लोबल स्टेट
let appState = {
    currentUser: {
        uid: null,
        username: "new_user",
        avatar: "https://via.placeholder.com/120/222/FFFFFF?text=+",
        email: "",
        name: "",
        mobile: "",
        address: "",
        hobby: "",
        state: "",
        country: "",
        referralCode: null,
        likedVideos: [],
        friends: [],
        addedChannels: [],
        walletBalance: 0,
        lastRewardTimestamp: null,
        initialRewardClaimed: false,
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
    longVideoSearchContext: { // ★ नया: चैनल सर्च को याद रखने के लिए
        type: 'query', // 'query' or 'channel'
        value: null
    },
    uploadDetails: {
        category: null,
        audience: 'all',
        lengthType: 'short'
    },
    activeComments: {
        videoId: null,
        videoOwnerUid: null,
        channelId: null
    },
    activeChat: {
        chatId: null,
        friendId: null,
        friendName: null,
        friendAvatar: null
    },
    creatorPagePlayers: {
        short: null,
        long: null
    },
    creatorPage: {
        currentLongVideo: {
            id: null,
            uploaderUid: null,
            channelId: null
        },
        channelCache: new Map(),
        currentView: 'channel',
        currentChannelId: null,
    },
    adState: {
        timers: {
            fullscreenAdLoop: null
        },
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
    rewardState: {
        timerInterval: null,
        claimTimerInterval: null,
        secondsRemaining: 0,
        claimSecondsRemaining: 0,
        isEligible: false,
    },
    appTimeTrackerInterval: null,
    watchTimeInterval: null,
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
// ★ नया: प्लेयर बनाने के अनुरोधों को पंक्ति में लगाने के लिए
let youtubePlayerQueue = [];

// =============================================================================
// ★★★ YOUTUBE API INTEGRATION (REFACTORED & WITH FIREBASE CACHING) - START ★★★
// =============================================================================

let currentVideoCache = new Map();

async function fetchFromYouTubeAPI(type, params) {
    const paramString = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    const cacheKey = `${type}_${paramString}`;
    const cacheRef = db.collection('youtube_api_cache').doc(btoa(cacheKey)); // Base64 encode to avoid invalid characters

    try {
        const cachedDoc = await cacheRef.get();
        if (cachedDoc.exists) {
            const cacheData = cachedDoc.data();
            const cacheAgeHours = (new Date() - cacheData.retrievedAt.toDate()) / (1000 * 60 * 60);
            if (cacheAgeHours < 6) { // 6 घंटे का कैश
                console.log(`[CACHE] Serving from Firestore cache: ${type}`);
                return cacheData.data;
            }
        }
    } catch (e) {
        console.error("Error reading from Firestore cache", e);
    }

    console.log(`[API] Fetching from YouTube API: ${type}`);
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

        if (data.items && data.items.length > 0) {
            data.items.forEach(item => {
                const videoId = item.id?.videoId || item.id;
                if (videoId && item.snippet) {
                    currentVideoCache.set(videoId, item);
                }
            });
        }

        cacheRef.set({
            data: data,
            retrievedAt: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(err => console.error("Error writing to Firestore cache:", err));

        return data;
    } catch (error) {
        console.error(`Critical Error Fetching from YouTube API (${type}):`, error);
        return {
            error: error.message,
            items: [],
            nextPageToken: null
        };
    }
}

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
        if (!video.id || video.id.kind !== 'youtube#video') return;
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

    const {
        type,
        value
    } = appState.longVideoSearchContext;
    let data;
    const params = {
        pageToken: appState.youtubeNextPageTokens.long,
        videoDuration: 'long',
        type: 'video'
    };

    if (type === 'channel') {
        params.channelId = value;
    } else { // 'query' or default
        params.q = value;
    }

    data = await fetchFromYouTubeAPI('search', params);

    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    if (data.items) {
        renderYouTubeLongVideos(data.items, true);
    }

    if (loadMoreBtn) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Load More";
        if (!appState.youtubeNextPageTokens.long) {
            loadMoreBtn.style.display = 'none';
        }
    }
}

async function playYouTubeVideoFromCard(videoId) {
    let video = currentVideoCache.get(videoId);
    if (!video) {
        console.warn("Video details not in cache for ID:", videoId, ". Fetching...");
        const data = await fetchFromYouTubeAPI('videoDetails', {
            id: videoId
        });
        if (data.items && data.items[0]) {
            video = data.items[0];
            currentVideoCache.set(videoId, video);
        } else {
            alert("Video details could not be loaded. Please try again.");
            return;
        }
    }

    const channelId = video.snippet.channelId;

    navigateTo('creator-page-screen', {
        creatorId: channelId,
        startWith: 'play',
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

function activateScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        activeScreen.style.display = 'flex';
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
        const creatorContent = document.getElementById('creator-page-content');
        if (creatorContent) creatorContent.innerHTML = '';
        document.getElementById('app-container').classList.remove('fullscreen-active');
    }
    activePlayerId = null;

    appState.currentScreenPayload = payload;
    activateScreen(nextScreenId);

    // Initialize screen-specific logic
    if (nextScreenId === 'profile-screen') loadUserVideosFromFirebase();
    if (nextScreenId === 'long-video-screen') setupLongVideoScreen();
    if (nextScreenId === 'history-screen') initializeHistoryScreen();
    if (nextScreenId === 'home-screen') setupShortsScreen();
    if (nextScreenId === 'creator-page-screen' && payload && payload.creatorId) {
        initializeCreatorPage(payload);
    }
    if (nextScreenId === 'friends-screen') {
        populateAddFriendsList();
        populateFriendRequestsList();
        populateMembersList();
    }
    if (nextScreenId === 'reward-screen') {
        initializeRewardScreen();
    }
    if (nextScreenId === 'wallet-screen') {
        initializeWalletScreen();
    }

}

function navigateBack() {
    if (appState.currentScreen === 'creator-page-screen') {
        if (appState.creatorPagePlayers.long) {
            appState.creatorPagePlayers.long.destroy();
            appState.creatorPagePlayers.long = null;
        }
        document.getElementById('app-container').classList.remove('fullscreen-active');
    }

    if (appState.navigationStack.length <= 1) {
        navigateTo('long-video-screen');
        return;
    }

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
        userData.friends = userData.friends || [];
        userData.walletBalance = userData.walletBalance || 0;
        userData.lastRewardTimestamp = userData.lastRewardTimestamp || null;
        userData.initialRewardClaimed = userData.initialRewardClaimed || false;

        appState.currentUser = { ...appState.currentUser,
            ...userData
        };

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
            uid: user.uid,
            name: '',
            email: user.email || '',
            avatar: user.photoURL || 'https://via.placeholder.com/120/222/FFFFFF?text=+',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            friends: [],
            referralCode: await generateAndSaveReferralCode(user.uid, user.displayName || 'user'),
            walletBalance: 0,
            lastRewardTimestamp: null,
            initialRewardClaimed: false,
            isReferred: false,
        };
        await userRef.set(initialData);
        appState.currentUser = { ...appState.currentUser,
            ...initialData
        };
        updateProfileUI();
        navigateTo('information-screen');
    }
}

let appInitializationComplete = false;

function initializeApp() {
    if (appInitializationComplete) return;
    appInitializationComplete = true;

    document.querySelectorAll('.nav-item[data-nav="profile"]').forEach(item => item.style.display = 'none');

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

function checkCustom(select, inputId) {
    document.getElementById(inputId).style.display = select.value === 'custom' ? 'block' : 'none';
}

async function saveAndContinue() {
    saveContinueBtn.disabled = true;
    saveContinueBtn.textContent = 'Saving...';

    const name = document.getElementById('info-name').value.trim();
    const stateValue = document.getElementById('info-state').value;
    const customState = document.getElementById('custom-state-input').value.trim();
    const state = stateValue === 'custom' ? customState : stateValue;
    const referralCodeInput = document.getElementById('info-referral').value.trim();

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

    if (referralCodeInput) {
        const referringUser = await processReferral(referralCodeInput, appState.currentUser.uid);
        if (referringUser) {
            userData.isReferred = true;
            userData.referredBy = referringUser.uid;
            // ★ बदलाव: नए यूज़र को रेफ़रल बोनस दिया गया
            const rewardAmount = Math.random() > 0.5 ? 2 : 1;
            userData.walletBalance = rewardAmount;
        } else {
            alert("Invalid referral code. Continuing without it.");
        }
    }

    const file = profileImageInput.files[0];
    if (file) {
        try {
            const storageRef = storage.ref(`avatars/${appState.currentUser.uid}/${file.name}`);
            const snapshot = await storageRef.put(file);
            userData.avatar = await snapshot.ref.getDownloadURL();
        } catch (error) {
            console.error("Avatar upload error:", error);
            alert("Failed to upload profile picture.");
            saveContinueBtn.disabled = false;
            saveContinueBtn.textContent = 'Continue';
            return;
        }
    }

    try {
        await db.collection('users').doc(appState.currentUser.uid).set(userData, {
            merge: true
        });

        const userDoc = await db.collection('users').doc(appState.currentUser.uid).get();
        if (!userDoc.data().referralCode) {
            await generateAndSaveReferralCode(appState.currentUser.uid, name);
        }

        const refreshedUserData = (await db.collection('users').doc(appState.currentUser.uid).get()).data();
        appState.currentUser = { ...appState.currentUser,
            ...refreshedUserData
        };

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
    console.log("Starting main app logic...");
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
        if (!video.id || video.id.kind !== 'youtube#video') return;
        const videoId = video.id?.videoId || video.id;
        if (!videoId) return;

        const slide = document.createElement('div');
        slide.className = 'video-slide';
        slide.dataset.videoId = videoId;
        slide.dataset.channelId = video.snippet.channelId;

        slide.addEventListener('click', (e) => {
            if (e.target.closest('.video-meta-overlay')) return;
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
            <div class="video-meta-overlay">
                <div class="uploader-info" onclick="${creatorProfileOnClick}"><img src="${uploaderAvatar}" class="uploader-avatar"><span class="uploader-name">${escapeHTML(uploaderName)}</span></div>
                <p class="video-title">${escapeHTML(title)}</p>
                <button class="add-channel-btn haptic-trigger" onclick="${addChannelOnClick}"><i class="fas fa-plus"></i> Add</button>
            </div>
        `;
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

// ★ नया: प्लेयर में त्रुटि होने पर यह फ़ंक्शन कॉल होगा
function onPlayerError(event) {
    const videoId = event.target.getVideoData().video_id;
    console.error(`[YT Player Error] Video ID: ${videoId}, Error Code: ${event.data}`);
    // त्रुटि कोड दस्तावेज़: https://developers.google.com/youtube/iframe_api_reference#onError
    // 2 – अमान्य पैरामीटर। (गलत वीडियो आईडी)
    // 5 – HTML5 प्लेयर त्रुटि।
    // 100 – वीडियो नहीं मिला (हटा दिया गया या निजी है)।
    // 101 या 150 – वीडियो के मालिक ने एम्बेडेड प्लेबैक की अनुमति नहीं दी है।

    // उपयोगकर्ता को UI पर सूचित करने का प्रयास करें
    const iframe = event.target.getIframe();
    if (iframe && iframe.parentElement) {
        const container = iframe.parentElement;
        container.innerHTML = `<div style="color:white; text-align:center; padding: 20px; font-size: 1.1em; display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%;">
            <p>Could Not Play Video</p>
            <p style="font-size:0.8em; color: #aaa;">(Error Code: ${event.data})</p>
        </div>`;
    }
}

// ★ संशोधित: अब यह प्लेयर बनाने के अनुरोधों को पंक्तिबद्ध करेगा
function onYouTubeIframeAPIReady() {
    console.log("[YT API] YouTube IFrame API is ready.");
    isYouTubeApiReady = true;

    // API तैयार होने से पहले पंक्तिबद्ध किए गए किसी भी प्लेयर निर्माण अनुरोध को संसाधित करें
    console.log(`[YT API] Processing ${youtubePlayerQueue.length} queued player requests.`);
    youtubePlayerQueue.forEach(request => {
        console.log(`[YT API] Creating queued player for container: ${request.containerId}`);
        if (request.type === 'shorts') {
            createPlayerForSlide(request.slide, true); // कतार से बचने के लिए एक ध्वज पास करें
        } else if (request.type === 'long') {
            initializeCreatorPagePlayer(request.videoId, request.containerId, 'long', true); // एक ध्वज पास करें
        }
    });
    // कतार साफ़ करें
    youtubePlayerQueue = [];
}

function onPlayerReady(event) {
    const iframe = event.target.getIframe();
    const videoId = event.target.getVideoData().video_id;
    console.log(`[YT Player] Player ready for video ID: ${videoId}`);
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
    if (videoData) addVideoToHistory(videoData);

    const player = players[videoId];
    if (!player || typeof player.playVideo !== 'function' || !player.getIframe() || !document.body.contains(player.getIframe())) {
        const slide = document.querySelector(`.video-slide[data-video-id="${videoId}"]`);
        if (slide) createPlayerForSlide(slide);
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

// ★ संशोधित: अब यह प्लेयर बनाने के अनुरोध को पंक्तिबद्ध करेगा यदि API तैयार नहीं है
function createPlayerForSlide(slide, forceCreation = false) {
    const videoId = slide.dataset.videoId;
    if (!isYouTubeApiReady && !forceCreation) {
        // API तैयार नहीं है, इस अनुरोध को पंक्तिबद्ध करें
        console.log(`[YT Player] API not ready. Queuing player for video ID: ${videoId}`);
        // डुप्लिकेट कतार से बचें
        if (!youtubePlayerQueue.some(item => item.videoId === videoId)) {
            youtubePlayerQueue.push({
                type: 'shorts',
                slide: slide,
                videoId: videoId
            });
        }
        return;
    }


    if (players[videoId]) {
        if (typeof players[videoId].playVideo === 'function') {
            console.log(`[YT Player] Player for ${videoId} already exists. Playing.`);
            playActivePlayer(videoId);
        }
        return;
    }

    const playerId = `player-${videoId}`;
    const playerElement = document.getElementById(playerId);
    if (!playerElement || playerElement.tagName === 'IFRAME') return;

    console.log(`[YT Player] Creating new shorts player for video ID: ${videoId}`);
    players[videoId] = new YT.Player(playerId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
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
                const slideRect = slide.getBoundingClientRect();
                const isInView = slideRect.top >= 0 && slideRect.bottom <= window.innerHeight;
                if (isInView) {
                    playActivePlayer(videoId);
                }
            },
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError // त्रुटि हैंडलर जोड़ा गया
        }
    });
}

function setupVideoObserver() {
    if (videoObserver) videoObserver.disconnect();
    if (!videoSwiper) return;
    const options = {
        root: videoSwiper,
        threshold: 0.8
    };
    videoObserver = new IntersectionObserver(async (entries) => {
        for (const entry of entries) {
            if (entry.target.id === 'shorts-load-more-trigger') {
                if (entry.isIntersecting) {
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

    const data = await fetchFromYouTubeAPI('search', {
        q: query,
        videoDuration: 'short',
        type: 'video'
    });
    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    if (data.items && data.items.length > 0) {
        renderVideoSwiper(data.items, false);
    } else {
        renderVideoSwiper([], false);
    }
}

async function loadMoreShorts() {
    const activeCategoryChip = document.querySelector('#category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.dataset.category : 'All';
    const query = category.toLowerCase() === 'trending' ? 'trending shorts india' : (category.toLowerCase() === 'all' ? getRandomTopic() + ' shorts' : `${category} shorts`);
    const data = await fetchFromYouTubeAPI('search', {
        q: query,
        videoDuration: 'short',
        pageToken: appState.youtubeNextPageTokens.shorts,
        type: 'video'
    });

    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    if (data.items) {
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

    // ★ बदलाव: सर्च कॉन्टेक्स्ट को अपडेट करें
    appState.longVideoSearchContext = {
        type: 'query',
        value: query
    };

    const data = await fetchFromYouTubeAPI('search', {
        q: query,
        videoDuration: 'long',
        type: 'video'
    });

    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    renderYouTubeLongVideos(data.items || [], false);
}

async function renderTrendingCarousel() {
    const carouselWrapper = document.getElementById('long-video-carousel-wrapper');
    if (!carouselWrapper) return;
    carouselWrapper.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
    const data = await fetchFromYouTubeAPI('search', {
        q: 'latest trending videos',
        videoDuration: 'long',
        type: 'video',
        limit: 10
    });

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

// ★★★ FIX: चैनल के नाम से लॉन्ग वीडियो सर्च करने के लिए फंक्शन को पूरी तरह से बदल दिया गया है ★★★
async function performLongVideoSearch() {
    const input = document.getElementById('long-video-search-input');
    let query = input.value.trim();
    if (!query) return;

    // अगर यूजर ने यूट्यूब लिंक पेस्ट किया है तो सीधे वीडियो चलाएं
    const videoIdFromUrl = extractYouTubeId(query);
    if (videoIdFromUrl) {
        playYouTubeVideoFromCard(videoIdFromUrl);
        return;
    }

    // कैटेगरी चिप्स को डीसेलेक्ट करें
    document.querySelectorAll('#long-video-category-scroller .category-chip').forEach(chip => chip.classList.remove('active'));

    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

    let searchParams = {
        videoDuration: 'long',
        type: 'video'
    };
    let finalData;

    // 1. पहले चैनल ढूंढने की कोशिश करें
    try {
        const channelData = await fetchFromYouTubeAPI('search', {
            q: query,
            type: 'channel',
            maxResults: 1
        });
        let channelId = null;
        if (channelData.items && channelData.items.length > 0) {
            // यह सुनिश्चित करने के लिए कि सही चैनल मिला है, टाइटल की जाँच करें
            const channelTitle = channelData.items[0].snippet.title.toLowerCase();
            const queryLower = query.toLowerCase();
            // सिंपल जाँच: अगर चैनल के नाम में सर्च किया गया टेक्स्ट है
            if (channelTitle.includes(queryLower)) {
                channelId = channelData.items[0].id.channelId;
            }
        }

        if (channelId) {
            // 2. अगर चैनल मिला, तो उस चैनल के वीडियो सर्च करें
            console.log(`Channel found: ${channelId}. Searching for videos in this channel.`);
            searchParams.channelId = channelId;
            appState.longVideoSearchContext = {
                type: 'channel',
                value: channelId
            };
        } else {
            // 3. अगर चैनल नहीं मिला, तो सामान्य टेक्स्ट सर्च करें
            console.log(`No specific channel found. Performing general search for: ${query}`);
            searchParams.q = query;
            appState.longVideoSearchContext = {
                type: 'query',
                value: query
            };
        }

        finalData = await fetchFromYouTubeAPI('search', searchParams);

    } catch (error) {
        console.error("Error during search process:", error);
        finalData = {
            items: [],
            nextPageToken: null
        };
        grid.innerHTML = '<p class="static-message">An error occurred during search.</p>';
    }

    appState.youtubeNextPageTokens.long = finalData.nextPageToken || null;
    renderYouTubeLongVideos(finalData.items || [], false);
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

function renderHistoryShortsScroller() { /* Unchanged */ }

function renderHistoryLongVideoList() { /* Unchanged */ }

function clearAllHistory() { /* Unchanged */ }

function deleteFromHistory(videoId) { /* Unchanged */ }

async function populateAddFriendsList(featuredUser = null) {
    const userListContainer = document.getElementById('add-friend-user-list');
    if (!userListContainer) return;
    userListContainer.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    try {
        const querySnapshot = await db.collection('users').get();
        const users = [];
        querySnapshot.forEach(doc => {
            if (doc.id !== appState.currentUser.uid) {
                users.push({
                    id: doc.id,
                    ...doc.data()
                });
            }
        });

        if (users.length === 0) {
            userListContainer.innerHTML = '<p class="static-message">No other users found to add.</p>';
            return;
        }

        userListContainer.innerHTML = users.map(user => {
            const isFriend = appState.currentUser.friends.includes(user.id);
            const buttonHtml = isFriend ?
                `<button class="add-button requested" disabled>Friends</button>` :
                `<button class="add-button" onclick="sendFriendRequest('${user.id}', this)">Add</button>`;

            return `
                <div class="holographic-card">
                    <div class="profile-pic" onclick="showEnlargedImage('${user.avatar}')">
                        <img src="${user.avatar || 'https://via.placeholder.com/50'}" alt="Profile Pic">
                    </div>
                    <div class="info">
                        <div class="name">${escapeHTML(user.name || 'Unnamed User')}</div>
                        <div class="subtext">${escapeHTML(user.referralCode || '@' + user.id.substring(0,6))}</div>
                    </div>
                    ${buttonHtml}
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Error fetching users:", error);
        userListContainer.innerHTML = '<p class="static-message">Could not load users. Please try again later.</p>';
    }
}
async function searchUser() { /* Unchanged */ }
async function sendFriendRequest(receiverId, buttonElement) { /* Unchanged */ }
async function populateFriendRequestsList() { /* Unchanged */ }
async function acceptFriendRequest(event, requestId, senderId) { /* Unchanged */ }
async function rejectFriendRequest(event, requestId) { /* Unchanged */ }
async function populateMembersList() { /* Unchanged */ }
async function startChat(friendId, friendName, friendAvatar) { /* Unchanged */ }
async function sendMessage() { /* Unchanged */ }

function loadChatMessages(chatId) { /* Unchanged */ }

// =======================================================
// ★★★ CREATOR PAGE LOGIC (REWORKED & FIXED) - START ★★★
// =======================================================

async function initializeCreatorPage(payload) {
    const {
        creatorId,
        startWith = 'home',
        videoId
    } = payload;
    appState.creatorPage.currentChannelId = creatorId;

    if (startWith === 'play' && videoId) {
        showCreatorPlayerView(videoId);
        return;
    }

    appState.creatorPage.currentView = 'channel';
    const creatorPageHeader = document.getElementById('creator-page-screen').querySelector('.screen-header');
    const creatorPageTabsContainer = document.getElementById('creator-page-tabs');
    const creatorPageContent = document.getElementById('creator-page-content');

    creatorPageHeader.style.display = 'flex';
    creatorPageTabsContainer.style.display = 'flex';
    creatorPageContent.innerHTML = '';
    creatorPageContent.classList.remove('player-active');

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
            loadCreatorPageContent({ ...payload,
                startWith: tab.dataset.type,
                videoId: null
            });
        });
    });

    const effectiveStartWith = (startWith === 'videos') ? 'home' : startWith;
    const initialTab = creatorPageTabsContainer.querySelector(`.creator-page-tab-btn[data-type="${effectiveStartWith}"]`) || creatorPageTabsContainer.querySelector(`.creator-page-tab-btn[data-type="home"]`);
    if (initialTab) initialTab.classList.add('active');

    await loadCreatorPageContent({ ...payload,
        startWith: effectiveStartWith
    });
}

async function loadCreatorPageContent(payload) {
    const {
        creatorId,
        startWith,
        playlistId
    } = payload;
    const contentArea = document.getElementById('creator-page-content');
    contentArea.innerHTML = '<div class="loader-container" style="height: 100%;"><div class="loader"></div></div>';
    let data;
    switch (startWith) {
        case 'home':
        case 'videos':
            data = await fetchFromYouTubeAPI('search', {
                channelId: creatorId,
                order: 'date',
                videoDuration: 'long',
                type: 'video'
            });
            renderCreatorVideoList(contentArea, data.items || [], 'long');
            break;
        case 'shorts':
            data = await fetchFromYouTubeAPI('search', {
                channelId: creatorId,
                videoDuration: 'short',
                order: 'date',
                type: 'video'
            });
            renderCreatorVideoList(contentArea, data.items || [], 'short');
            break;
        case 'playlists':
            data = await fetchFromYouTubeAPI('playlists', {
                channelId: creatorId
            });
            renderCreatorPlaylistList(contentArea, data.items || [], payload);
            break;
        case 'playlistItems':
            data = await fetchFromYouTubeAPI('playlistItems', {
                playlistId: playlistId
            });
            renderCreatorVideoList(contentArea, data.items || [], 'long');
            break;
    }
}

function renderCreatorVideoList(container, videos, type) { /* Unchanged */ }

function renderCreatorPlaylistList(container, playlists, payload) { /* Unchanged */ }

// ★★★ FIX: ज़ूम बटनों के साथ नया वीडियो प्लेयर व्यू ★★★
function showCreatorPlayerView(videoId) {
    appState.creatorPage.currentView = 'player';
    const creatorPageScreen = document.getElementById('creator-page-screen');
    const contentArea = document.getElementById('creator-page-content');

    creatorPageScreen.querySelector('.screen-header').style.display = 'none';
    contentArea.classList.add('player-active');

    // HTML में ज़ूम इन और ज़ूम आउट बटन जोड़े गए
    contentArea.innerHTML = `
        <div id="creator-page-player-container">
             <div class="player-controls-header">
                <div class="player-back-button haptic-trigger" onclick="navigateBack()">
                    <i class="fas fa-arrow-left"></i>
                </div>
                <div class="player-zoom-controls">
                    <button id="player-zoom-out-btn" class="haptic-trigger">
                        <i class="fas fa-search-minus"></i>
                    </button>
                    <button id="player-zoom-in-btn" class="haptic-trigger">
                        <i class="fas fa-search-plus"></i>
                    </button>
                </div>
                <button id="player-rotate-btn" class="haptic-trigger">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
            <div class="player-wrapper">
                <div id="creator-page-player-long"></div>
            </div>
        </div>
    `;

    initializeCreatorPagePlayer(videoId, 'creator-page-player-long', 'long');

    document.getElementById('player-rotate-btn').addEventListener('click', () => {
        document.getElementById('app-container').classList.toggle('fullscreen-active');
    });

    // ज़ूम बटनों के लिए इवेंट लिस्नर
    let currentZoom = 1.0;
    const playerWrapper = contentArea.querySelector('.player-wrapper');
    const zoomInBtn = document.getElementById('player-zoom-in-btn');
    const zoomOutBtn = document.getElementById('player-zoom-out-btn');

    zoomInBtn.addEventListener('click', () => {
        currentZoom = Math.min(2.5, currentZoom + 0.1); // अधिकतम ज़ूम 2.5x
        playerWrapper.style.transform = `scale(${currentZoom})`;
    });

    zoomOutBtn.addEventListener('click', () => {
        currentZoom = Math.max(0.5, currentZoom - 0.1); // न्यूनतम ज़ूम 0.5x
        playerWrapper.style.transform = `scale(${currentZoom})`;
    });
}

// ★ संशोधित: अब यह प्लेयर बनाने के अनुरोध को पंक्तिबद्ध करेगा यदि API तैयार नहीं है
function initializeCreatorPagePlayer(videoId, containerId, type, forceCreation = false) {
    if (appState.creatorPagePlayers[type]) {
        console.log(`[YT Player] Destroying existing creator player of type: ${type}`);
        appState.creatorPagePlayers[type].destroy();
        appState.creatorPagePlayers[type] = null;
    }

    const playerContainer = document.getElementById(containerId);

    if (!isYouTubeApiReady && !forceCreation) {
        console.log(`[YT Player] API not ready. Queuing creator player for video ID: ${videoId}`);
        youtubePlayerQueue.push({
            type: 'long',
            videoId: videoId,
            containerId: containerId
        });
        return;
    }

    if (!playerContainer) {
        console.error(`[YT Player] Player container #${containerId} not found in DOM.`);
        return;
    }

    console.log(`[YT Player] Creating new creator player for video ID: ${videoId} in container: #${containerId}`);
    appState.creatorPagePlayers[type] = new YT.Player(containerId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'rel': 0,
            'showinfo': 0,
            'mute': 0,
            'modestbranding': 1,
            'fs': 0,
            'origin': window.location.origin,
            'iv_load_policy': 3
        },
        events: {
            'onReady': (event) => {
                console.log(`[YT Player] Creator player ready for video ID: ${videoId}`);
                event.target.playVideo();
                event.target.unMute();
                const videoData = currentVideoCache.get(videoId);
                if (videoData) {
                    addLongVideoToHistory(videoData);
                }
            },
            'onStateChange': handleCreatorPlayerStateChange,
            'onError': onPlayerError // त्रुटि हैंडलर जोड़ा गया
        }
    });
}

function handleCreatorPlayerStateChange(event) { /* Unchanged */ }

// =======================================================
// ★★★ CREATOR PAGE LOGIC (REWORKED & FIXED) - END ★★★
// =======================================================

// =======================================================
// ★★★ REWARD SYSTEM LOGIC - START ★★★
// =======================================================

function initializeRewardScreen() {
    const screen = document.getElementById('reward-screen');
    if (!screen) return;
    updateRewardUI();
    startRewardTimerCheck();
}

function updateRewardUI() {
    const screen = document.getElementById('reward-screen');
    const {
        secondsRemaining,
        isEligible
    } = appState.rewardState;
    if (appState.rewardState.timerInterval) {
        clearInterval(appState.rewardState.timerInterval);
    }

    let contentHTML = '';

    if (isEligible) {
        contentHTML = `
            <div class="reward-status-container">
                <h2>Congratulations!</h2>
                <p>You have earned a new scratch card.</p>
                <div class="scratch-card-container" id="scratch-card-container">
                    <div class="scratch-card-overlay" id="scratch-overlay">Scratch Here</div>
                    <div class="scratch-card-reward" id="scratch-reward"></div>
                </div>
            </div>
        `;
    } else {
        const timeToShow = new Date(secondsRemaining * 1000).toISOString().substr(11, 8);
        contentHTML = `
            <div class="reward-status-container">
                <h2>Next Reward</h2>
                <p>You can earn a new reward after the timer ends.</p>
                <div class="reward-timer" id="reward-timer-display">${timeToShow}</div>
            </div>
        `;
        if (secondsRemaining > 0) {
            startCountdownTimer('reward-timer-display', secondsRemaining, startRewardTimerCheck);
        }
    }

    const contentArea = screen.querySelector('.content-area');
    if (contentArea) contentArea.innerHTML = contentHTML;

    if (isEligible) {
        setupScratchCard();
    }
}

function startRewardTimerCheck() {
    const {
        initialRewardClaimed,
        lastRewardTimestamp
    } = appState.currentUser;
    const now = new Date();

    // ★ बदलाव: टाइमर को हमेशा 60 सेकंड का कर दिया गया है
    const sixtySeconds = 60 * 1000;
    const lastRewardTime = lastRewardTimestamp ? lastRewardTimestamp.toDate() : new Date(0);
    const timePassed = now.getTime() - lastRewardTime.getTime();

    if (timePassed >= sixtySeconds) {
        appState.rewardState.isEligible = true;
        appState.rewardState.secondsRemaining = 0;
    } else {
        appState.rewardState.isEligible = false;
        appState.rewardState.secondsRemaining = Math.round((sixtySeconds - timePassed) / 1000);
    }

    updateRewardUI();
}

function startCountdownTimer(elementId, durationInSeconds, onComplete) {
    if (appState.rewardState.timerInterval) {
        clearInterval(appState.rewardState.timerInterval);
    }
    let timer = durationInSeconds;
    const timerDisplay = document.getElementById(elementId);

    appState.rewardState.timerInterval = setInterval(() => {
        const hours = Math.floor(timer / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = timer % 60;

        if (timerDisplay) {
            timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        if (--timer < 0) {
            clearInterval(appState.rewardState.timerInterval);
            appState.rewardState.timerInterval = null;
            if (onComplete) onComplete();
        }
    }, 1000);
}

function setupScratchCard() {
    const overlay = document.getElementById('scratch-overlay');
    const rewardElem = document.getElementById('scratch-reward');
    if (!overlay || !rewardElem) return;

    let isScratching = false;

    const random = Math.random();
    let rewardText;
    let rewardValue = 0;
    if (random < 0.2) {
        rewardText = "Try Again Next Time!";
    } else {
        // ★ इनाम 1 से 10 रुपये के बीच रहेगा
        rewardValue = Math.floor(Math.random() * 10) + 1;
        rewardText = `You Won ₹${rewardValue}!`;
    }
    rewardElem.textContent = rewardText;

    const scratch = (e) => {
        if (!isScratching) return;
        e.preventDefault();

        const currentOpacity = parseFloat(overlay.style.opacity || 1);
        const newOpacity = Math.max(0, currentOpacity - 0.05);
        overlay.style.opacity = newOpacity;

        if (newOpacity < 0.1) {
            overlay.style.display = 'none';
            window.removeEventListener('mouseup', stopScratching);
            window.removeEventListener('touchend', stopScratching);
            handleRewardRevealed(rewardValue, rewardText);
        }
    };

    const startScratching = () => isScratching = true;
    const stopScratching = () => isScratching = false;

    overlay.addEventListener('mousedown', startScratching);
    overlay.addEventListener('touchstart', startScratching, {
        passive: true
    });
    window.addEventListener('mouseup', stopScratching);
    window.addEventListener('touchend', stopScratching);
    overlay.addEventListener('mousemove', scratch);
    overlay.addEventListener('touchmove', scratch, {
        passive: true
    });
}

async function handleRewardRevealed(amount, text) {
    const userRef = db.collection('users').doc(appState.currentUser.uid);
    try {
        const updates = {
            initialRewardClaimed: true,
            lastRewardTimestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        // अगर इनाम मिला है तो वॉलेट बैलेंस भी अपडेट करें
        if (amount > 0) {
            updates.walletBalance = firebase.firestore.FieldValue.increment(amount);
        }

        await userRef.update(updates);

        // स्थानीय स्थिति को तुरंत अपडेट करें
        appState.currentUser.initialRewardClaimed = true;
        appState.currentUser.lastRewardTimestamp = {
            toDate: () => new Date()
        };
        if (amount > 0) {
            appState.currentUser.walletBalance += amount;
        }

    } catch (error) {
        console.error("Error updating user reward status:", error);
    }

    if (amount > 0) {
        const container = document.getElementById('scratch-card-container');
        if (container) {
            container.innerHTML += `
                <div class="claim-offer-section">
                    <p>इस ऑफर को पाने के लिए, अपने किसी दोस्त को 20 मिनट के अंदर इनवाइट करें।</p>
                    <p>(To claim this offer, invite a friend within 20 minutes.)</p>
                    <div id="claim-timer" class="reward-timer">20:00</div>
                    <button class="continue-btn" onclick="copyToClipboard(appState.currentUser.referralCode, event)">Copy Referral ID</button>
                </div>
            `;
            // ★ बदलाव: टाइमर को 20 मिनट का कर दिया गया है
            startCountdownTimer('claim-timer', 20 * 60, () => {
                const claimSection = document.querySelector('.claim-offer-section');
                if (claimSection) claimSection.innerHTML = "<p>Offer Expired!</p>";
            });
        }
    }

    // कुछ सेकंड के बाद टाइमर शुरू करने के लिए रीचेक करें
    setTimeout(() => {
        startRewardTimerCheck();
    }, 5000);
}

async function processReferral(referralCode, newUserId) {
    const querySnapshot = await db.collection('users').where('referralCode', '==', referralCode).limit(1).get();
    if (querySnapshot.empty) return null;

    const referringUserDoc = querySnapshot.docs[0];
    const referringUserId = referringUserDoc.id;

    if (referringUserId === newUserId) {
        console.warn("User tried to refer themselves.");
        return null;
    }

    // ★ बदलाव: इस फ़ंक्शन से इनाम देने का लॉजिक हटा दिया गया है।
    // यह अब saveAndContinue में हैंडल किया जाएगा।
    // यह फ़ंक्शन सिर्फ रेफ़रल कोड को वेरिफ़ाई करेगा।

    return {
        uid: referringUserId
    };
}

function initializeWalletScreen() {
    const screen = document.getElementById('wallet-screen');
    const balanceElem = document.getElementById('wallet-balance');
    if (screen && balanceElem) {
        balanceElem.textContent = `₹${appState.currentUser.walletBalance.toFixed(2)}`;
    }
}

async function submitWithdrawalRequest() {
    const upiId = document.getElementById('upi-id-input').value.trim();
    const mobileNo = document.getElementById('mobile-no-input').value.trim();
    const amount = appState.currentUser.walletBalance;
    if (amount < 50) {
        alert("Minimum withdrawal amount is ₹50.");
        return;
    }
    if (!upiId || !mobileNo) {
        alert("Please enter both UPI ID and Mobile Number.");
        return;
    }

    const message = `
        Shubhzone Withdrawal Request:
        --------------------------
        User UID: ${appState.currentUser.uid}
        Amount: ₹${amount.toFixed(2)}
        UPI ID: ${upiId}
        Mobile No: ${mobileNo}
        --------------------------
    `;

    const whatsappUrl = `https://wa.me/917390928912?text=${encodeURIComponent(message)}`;

    const userRef = db.collection('users').doc(appState.currentUser.uid);
    const withdrawalRef = db.collection('withdrawals').doc();

    const batch = db.batch();
    batch.update(userRef, {
        walletBalance: 0
    });
    batch.set(withdrawalRef, {
        userId: appState.currentUser.uid,
        amount: amount,
        upiId: upiId,
        mobile: mobileNo,
        status: 'pending',
        requestedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    try {
        await batch.commit();
        appState.currentUser.walletBalance = 0;
        alert("Withdrawal request submitted! It will be processed soon. You are now being redirected to WhatsApp.");
        window.open(whatsappUrl, '_blank');
        initializeWalletScreen();
    } catch (error) {
        console.error("Error submitting withdrawal request:", error);
        alert("There was an error submitting your request. Please try again.");
    }
}

// =======================================================
// ★★★ REWARD SYSTEM LOGIC - END ★★★
// =======================================================

async function addChannelToList(event, channelId) { /* Unchanged */ }

function renderMyChannelsList() { /* Unchanged */ }

function removeChannelFromList(event, channelId) { /* Unchanged */ }

function provideHapticFeedback() { /* Unchanged */ }

function loadHapticPreference() { /* Unchanged */ }

function showEnlargedImage(imageUrl) { /* Unchanged */ }

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.add('haptic-trigger');
        item.addEventListener('click', () => {
            const targetNav = item.getAttribute('data-nav');
            if (item.style.display === 'none') return;
            let targetScreen;
            switch (targetNav) {
                case 'shorts':
                    targetScreen = 'home-screen';
                    break;
                case 'reward':
                    targetScreen = 'reward-screen';
                    break;
                case 'wallet':
                    targetScreen = 'wallet-screen';
                    break;
                default:
                    targetScreen = `${targetNav}-screen`;
            }

            navigateTo(targetScreen);
            updateNavActiveState(targetNav);
        });
    });

    initializeApp();

    document.getElementById('get-started-btn')?.addEventListener('click', () => {
        userHasInteracted = true;
        startAppLogic();
    });

    appContainer.addEventListener('click', (event) => {
        if (!userHasInteracted) {
            userHasInteracted = true;
            Object.values(players).forEach(p => p && typeof p.unMute === 'function' && p.unMute());
            if (appState.creatorPagePlayers.long && typeof appState.creatorPagePlayers.long.unMute === 'function') {
                appState.creatorPagePlayers.long.unMute();
            }
        }
        if (event.target.closest('.haptic-trigger')) provideHapticFeedback();
    });

    document.getElementById('long-video-search-btn')?.addEventListener('click', performLongVideoSearch);
    document.getElementById('long-video-search-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performLongVideoSearch();
    });
    document.getElementById('wallet-icon-button')?.addEventListener('click', () => navigateTo('wallet-screen'));
    document.getElementById('withdraw-btn')?.addEventListener('click', submitWithdrawalRequest);

    document.querySelector('#creator-page-screen .header-icon-left')?.addEventListener('click', () => navigateBack());
    initializeMessagingInterface();
    document.getElementById('add-friend-search-btn')?.addEventListener('click', searchUser);
    document.getElementById('add-friend-search-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchUser();
    });

    const openSidebar = () => {
        document.getElementById('main-sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.add('open');
    };
    document.getElementById('home-menu-icon')?.addEventListener('click', openSidebar);
    document.getElementById('long-video-menu-icon')?.addEventListener('click', openSidebar);

    const profileSidebarBtn = document.getElementById('sidebar-profile-btn');
    if (profileSidebarBtn) {
        profileSidebarBtn.addEventListener('click', () => {
            navigateTo('profile-screen');
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
            const contentToShow = document.getElementById(`${tabId}-content`);
            if (contentToShow) contentToShow.classList.remove('hidden');
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
    inputField?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    inputField?.addEventListener('input', () => {
        if (inputField.value.trim().length > 0) {
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
