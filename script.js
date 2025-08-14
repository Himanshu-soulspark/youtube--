
/* ================================================= */
/* === Shubhzone App Script (Code 2) - FINAL v5.15 === */
/* === MODIFIED AS PER USER REQUEST - AUG 2025    === */
/* === SOLVED: Player, Load More & UI Bugs Fixed === */
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
 * @param {HTMLElement} container The container element to inject the ad into.
 */
function injectBannerAd(container) {
    if (!container) {
        console.warn("[AD] Ad container not found. Cannot inject banner ad.");
        return;
    }
    container.innerHTML = ''; // Clear previous content

    // Alternate between Monetag and Adsterra native banners
    if (Math.random() > 0.5) {
        // Monetag Native Banner
        console.log("[AD] Injecting Monetag Native Banner...");
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.text = `(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gizokraijaw.net',9583482,document.createElement('script'))`;
        container.appendChild(adScript);
    } else {
        // Adsterra Native Banner
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
        channel: null
    },
    uploadDetails: { category: null, audience: 'all', lengthType: 'short' },
    activeComments: { videoId: null, videoOwnerUid: null, channelId: null },
    activeChat: { chatId: null, friendId: null, friendName: null, friendAvatar: null },
    creatorPagePlayers: { short: null, long: null },
    creatorPage: { currentLongVideo: { id: null, uploaderUid: null, channelId: null } },
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
// ★★★ YOUTUBE API INTEGRATION (REFACTORED) - START ★★★
// =============================================================================

let currentVideoCache = new Map();

/**
 * YouTube API से वीडियो लाने के लिए जेनेरिक फ़ंक्शन।
 * @param {string} type 'search', 'trending', 'channel', or 'videoDetails' में से एक।
 * @param {object} params API के लिए पैरामीटर।
 * @returns {Promise<object>} API से प्रतिक्रिया।
 */
async function fetchFromYouTubeAPI(type, params) {
    let url = `/api/youtube?type=${type}`;
    for (const key in params) {
        if (params[key]) {
            url += `&${key}=${encodeURIComponent(params[key])}`;
        }
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.items) {
            data.items.forEach(video => {
                const videoId = typeof video.id === 'object' ? video.id.videoId : video.id;
                if(videoId) currentVideoCache.set(videoId, video);
            });
        }

        return data;
    } catch (error) {
        console.error(`Error fetching from YouTube API (${type}):`, error);
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
    const loader = document.getElementById('youtube-grid-loader');
    const loadMoreBtn = document.getElementById('long-video-load-more-btn');

    if (!grid) return;
    if (loader) loader.style.display = 'none';

    if (!append) {
        grid.innerHTML = '';
    }

    if (videos.length === 0 && !append) {
        grid.innerHTML = '<p class="static-message">No videos found. Try a different search or category.</p>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }
    
    videos.forEach((video, index) => {
        const card = createLongVideoCard(video);
        grid.appendChild(card);
        if ((index + 1) % 4 === 0) {
            const adContainer = document.createElement('div');
            adContainer.className = 'long-video-grid-ad';
            grid.appendChild(adContainer);
            setTimeout(() => injectBannerAd(adContainer), 100);
        }
    });

    if (loadMoreBtn) {
        loadMoreBtn.style.display = appState.youtubeNextPageTokens.long ? 'block' : 'none';
        loadMoreBtn.disabled = false;
    }
}

async function loadMoreLongVideos() {
    const loadMoreBtn = document.getElementById('long-video-load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = "Loading...";
    }

    const activeCategoryChip = document.querySelector('#long-video-category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.textContent : 'All';
    const searchInput = document.getElementById('long-video-search-input').value.trim();
    
    let data;
    if (searchInput) {
        data = await fetchFromYouTubeAPI('search', { q: searchInput, pageToken: appState.youtubeNextPageTokens.long, videoDuration: 'long' });
    } else if (category.toLowerCase() === 'trending') {
        data = await fetchFromYouTubeAPI('trending', { pageToken: appState.youtubeNextPageTokens.long, regionCode: 'IN' });
    } else {
        const query = category.toLowerCase() === 'all' ? 'latest music videos' : category;
        data = await fetchFromYouTubeAPI('search', { q: query, pageToken: appState.youtubeNextPageTokens.long, videoDuration: 'long' });
    }

    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    if(data.items) {
        renderYouTubeLongVideos(data.items, true);
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.textContent = "Load More";
    }
}

function playYouTubeVideoFromCard(videoId) {
    const video = currentVideoCache.get(videoId);
    if (!video) {
        console.error("Video details not found in cache for ID:", videoId);
        alert("Video details not found. Please try again.");
        return;
    }
    
    const channelId = video.snippet.channelId;
    
    navigateTo('creator-page-screen', { 
        creatorId: channelId, 
        startWith: 'long', 
        videoId: videoId
    });
}

// =============================================================================
// ★★★ YOUTUBE API INTEGRATION (REFACTORED) - END ★★★
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

const categories = ["Trending", "Entertainment", "Comedy", "Music", "Dance", "Education", "Travel", "Food", "DIY", "Sports", "Gaming", "News", "Lifestyle"];

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
        activeScreen.classList.add('active'); 
    }
    appState.currentScreen = screenId;
}


function navigateTo(nextScreenId, payload = null) {
    if (appState.currentScreen === nextScreenId && !payload) return;

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
        if (appState.creatorPagePlayers.short) appState.creatorPagePlayers.short.destroy();
        if (appState.creatorPagePlayers.long) appState.creatorPagePlayers.long.destroy();
        appState.creatorPagePlayers = { short: null, long: null };
        const videoWrapper = document.querySelector('#creator-page-long-view .main-video-card-wrapper');
        if (videoWrapper && videoWrapper.classList.contains('rotated')) {
            videoWrapper.classList.remove('rotated');
            // Exit fullscreen if active due to rotation
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    }
    activePlayerId = null;
    
    activateScreen(nextScreenId);
    appState.currentScreenPayload = payload;

    if (nextScreenId === 'profile-screen') loadUserVideosFromFirebase(); 
    if (nextScreenId === 'long-video-screen') setupLongVideoScreen();
    if (nextScreenId === 'history-screen') initializeHistoryScreen();
    if (nextScreenId === 'your-zone-screen') populateYourZoneScreen();
    if (nextScreenId === 'home-screen') setupShortsScreen();
    if (nextScreenId === 'creator-page-screen' && payload && payload.creatorId) initializeCreatorPage(payload.creatorId, payload.startWith, payload.videoId);
    if (nextScreenId === 'credit-screen' && payload && payload.videoId) initializeCreditScreen(payload.videoId);
    if (nextScreenId === 'report-screen') initializeReportScreen();
    if (nextScreenId === 'friends-screen') {
        populateAddFriendsList();
        populateFriendRequestsList();
        populateMembersList(); 
        renderMyChannelsList(); // ★ नया: मित्रों स्क्रीन पर चैनल सूची प्रस्तुत करें
    }
    
    // Deprecated screens navigation handling
    const deprecatedScreens = ['earnsure-screen', 'payment-screen', 'track-payment-screen', 'advertisement-screen'];
    if (deprecatedScreens.includes(nextScreenId)) {
        const screen = document.getElementById(nextScreenId);
        if (screen) screen.innerHTML = `<div class="screen-header"><div class="header-icon-left haptic-trigger" onclick="navigateBack()"><i class="fas fa-arrow-left"></i></div><span class="header-title">Feature Removed</span></div><p class="static-message" style="margin-top: 80px;">This feature is no longer available.</p>`;
    }
}

function navigateBack() {
    if (appState.navigationStack.length <= 1) return;
    
    // Handle exiting rotated fullscreen view
    const creatorView = document.getElementById('creator-page-long-view');
    if (creatorView && creatorView.classList.contains('active')) {
        const videoWrapper = creatorView.querySelector('.main-video-card-wrapper');
        if (videoWrapper && videoWrapper.classList.contains('rotated')) {
            toggleVideoRotation(); // This will handle class removal and exiting fullscreen
            return; // Don't navigate back yet, just exit rotation
        }
    }
    
    appState.navigationStack.pop();
    const previousScreenId = appState.navigationStack[appState.navigationStack.length - 1] || 'long-video-screen';

    if (appState.currentScreen === 'creator-page-screen') {
        if (appState.creatorPagePlayers.short) appState.creatorPagePlayers.short.destroy();
        if (appState.creatorPagePlayers.long) appState.creatorPagePlayers.long.destroy();
        appState.creatorPagePlayers = { short: null, long: null };
    }
    
    navigateTo(previousScreenId);
}

async function checkUserProfileAndProceed(user, lastScreenToRestore = null) {
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
        // Resetting payment related fields for all users
        userData.creatorCoins = 0;
        userData.unconvertedCreatorSeconds = 0;
        
        appState.currentUser = { ...appState.currentUser, ...userData };

        // ★ नया: स्थानीय संग्रहण से जोड़े गए चैनलों को लोड करें
        const savedChannels = localStorage.getItem('shubhzone_addedChannels');
        appState.currentUser.addedChannels = savedChannels ? JSON.parse(savedChannels) : [];

        const savedHistory = localStorage.getItem('shubhzoneViewingHistory');
        if (savedHistory) {
            appState.viewingHistory = JSON.parse(savedHistory);
        }
        updateProfileUI();
        
        // ★ बदलाव: उपयोगकर्ता को हमेशा एक नई शुरुआत दें
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

    // ★ बदलाव: पिछली स्क्रीन को पुनर्स्थापित करने के लिए तर्क को हटा दिया गया
    auth.onAuthStateChanged(user => {
        if (user) {
            checkUserProfileAndProceed(user);
        } else {
            auth.signInAnonymously().catch(error => console.error("Anonymous sign-in failed:", error));
        }
    });

    activateScreen('splash-screen');
    startAppTimeTracker();
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
    
    const yourZoneAvatar = document.getElementById('your-zone-header-avatar');
    if (yourZoneAvatar) yourZoneAvatar.src = appState.currentUser.avatar || "https://via.placeholder.com/40";
    
    profileImagePreview.src = appState.currentUser.avatar || "https://via.placeholder.com/120/222/FFFFFF?text=+";
    document.getElementById('info-name').value = appState.currentUser.name || '';
    document.getElementById('info-mobile').value = appState.currentUser.mobile || '';
    document.getElementById('info-email').value = appState.currentUser.email || '';
    document.getElementById('info-address').value = appState.currentUser.address || '';
    document.getElementById('info-hobby').value = appState.currentUser.hobby || '';
    document.getElementById('info-state').value = appState.currentUser.state || '';
    document.getElementById('info-country').value = appState.currentUser.country || 'India';
}

function openUploadDetailsModal() {
    // ★ बदलाव: इस सुविधा को हटा दिया गया है
    alert("This feature is no longer available. All video content is now sourced directly from YouTube.");
}

let appStartLogicHasRun = false;
const startAppLogic = async () => {
    // ★ बदलाव: यह सुनिश्चित करने के लिए कि यह केवल एक बार चले, मौजूदा चेक को रखा गया है
    if (appStartLogicHasRun && appState.currentScreen !== 'splash-screen' && appState.currentScreen !== 'information-screen') {
        return;
    }
    appStartLogicHasRun = true;

    setupAdTimers();

    const getStartedBtn = document.getElementById('get-started-btn');
    const loadingContainer = document.getElementById('loading-container');
    if (getStartedBtn) getStartedBtn.style.display = 'none';
    if (loadingContainer) loadingContainer.style.display = 'flex';
    
    renderCategoriesInBar();
    
    // ★ बदलाव: ऐप हमेशा लॉन्ग वीडियो स्क्रीन से शुरू होता है
    const screenToNavigate = 'long-video-screen';
    
    navigateTo(screenToNavigate);
    updateNavActiveState('long-video');
    
    // हर बार नए वीडियो लोड हों, इसलिए सीधे सेटअप फ़ंक्शंस को कॉल करें
    await setupLongVideoScreen();
    await setupShortsScreen();
};

function renderVideoSwiper(videos, append = false) {
    if (!videoSwiper) return;

    if (!append) {
        videoSwiper.innerHTML = '';
        // सभी खिलाड़ियों को नष्ट करें और रीसेट करें
        Object.values(players).forEach(player => {
            if (player && typeof player.destroy === 'function') {
                player.destroy();
            }
        });
        players = {};
        if (videoObserver) videoObserver.disconnect();
        setupVideoObserver(); // नए सामग्री सेट के लिए ऑब्जर्वर को फिर से शुरू करें
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

    videos.forEach((video, index) => {
        const videoId = typeof video.id === 'object' ? video.id.videoId : video.id;
        if (!videoId) return;

        const slide = document.createElement('div');
        slide.className = 'video-slide';
        slide.dataset.videoId = videoId;
        slide.dataset.channelId = video.snippet.channelId;
        
        slide.addEventListener('click', (e) => {
            if (e.target.closest('.video-actions-overlay') || e.target.closest('.uploader-info')) return;
            togglePlayPause(videoId);
        });
        
        const playerHtml = `<div class="player-container" id="player-${videoId}"></div>`;
        const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url;
        const uploaderName = video.snippet.channelTitle;
        const uploaderAvatar = 'https://via.placeholder.com/40'; // प्लेसहोल्डर, क्योंकि चैनल अवतार के लिए अतिरिक्त एपीआई कॉल की आवश्यकता होती है
        const title = video.snippet.title;

        const creatorProfileOnClick = `navigateTo('creator-page-screen', { creatorId: '${video.snippet.channelId}', startWith: 'short', videoId: '${videoId}' })`;

        // ★ बदलाव: क्रेडिट बटन को ऐड चैनल बटन से बदला गया
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
        videoSwiper.appendChild(slide);
        
        videoObserver.observe(slide);

        if ((index + 1) % 5 === 0) {
            const adSlide = document.createElement('div');
            adSlide.className = 'video-slide native-ad-slide';
            const adSlotContainer = document.createElement('div');
            adSlotContainer.className = 'ad-slot-container';
            adSlide.innerHTML = `<div class="ad-slide-wrapper"><p style="color: var(--text-secondary); font-size: 0.9em; text-align: center; margin-bottom: 10px;">Advertisement</p></div>`;
            adSlide.querySelector('.ad-slide-wrapper').appendChild(adSlotContainer);
            videoSwiper.appendChild(adSlide);
            setTimeout(() => injectBannerAd(adSlotContainer), 200);
        }
    });
    
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
    if (window.pendingAppStartResolve) {
        window.pendingAppStartResolve();
        delete window.pendingAppStartResolve;
    }
}

function onPlayerReady(event) {
    const iframe = event.target.getIframe();
    const slide = iframe.closest('.video-slide');
    if (!slide) return;

    const preloader = slide.querySelector('.video-preloader');
    if (preloader) preloader.style.display = 'none';
}


function onPlayerStateChange(event) {
    const iframe = event.target.getIframe();
    if (!iframe) return;
    
    const creatorPlayerView = iframe.closest('.creator-page-view');
    if (creatorPlayerView) {
        handleCreatorPlayerStateChange(event);
        return;
    }

    const slide = iframe.closest('.video-slide');
    if (!slide) return;

    const videoId = slide.dataset.videoId;
    const preloader = slide.querySelector('.video-preloader');
    if (event.data !== YT.PlayerState.UNSTARTED && preloader) {
        preloader.style.display = 'none';
    }
}

function addVideoToHistory(videoId) {
    if (!videoId) return;
    const videoData = currentVideoCache.get(videoId);
    if (!videoData) return;

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

function addLongVideoToHistory(videoId) {
    if (!videoId) return;
    const videoData = currentVideoCache.get(videoId);
    if (!videoData) return;
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
        playActivePlayer(videoId);
    }
}

function playActivePlayer(videoId) {
    if (!videoId) return;
    
    if (activePlayerId && activePlayerId !== videoId) {
        pauseActivePlayer();
    }
    activePlayerId = videoId;
    addVideoToHistory(videoId);
    
    const player = players[videoId];
    if (!player || typeof player.playVideo !== 'function' || !player.getIframe() || !document.body.contains(player.getIframe())) {
        const slide = document.querySelector(`.video-slide[data-video-id="${videoId}"]`);
        if(slide) createPlayerForSlide(slide);
        return;
    }
    
    if (userHasInteracted) player.unMute();
    else player.mute();

    player.playVideo();
}

function pauseActivePlayer() {
    if (!activePlayerId) return;
    const player = players[activePlayerId];
    if (player && typeof player.pauseVideo === 'function') {
        if (player.getPlayerState() === YT.PlayerState.PLAYING || player.getPlayerState() === YT.PlayerState.BUFFERING) {
             player.pauseVideo();
        }
        player.mute();
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
            'autoplay': 0, 'controls': 0, 'mute': 1, 'rel': 0, 
            'showinfo': 0, 'modestbranding': 1, 'loop': 1,
            'playlist': videoId, 'fs': 0, 'iv_load_policy': 3, 
            'origin': window.location.origin
        },
        events: {
            'onReady': (event) => {
                onPlayerReady(event);
                if (videoId === activePlayerId) {
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
    try {
        // टिप्पणियाँ अब समर्थित नहीं हैं क्योंकि वे YouTube से हैं
        commentsList.innerHTML = '<li style="text-align:center; color: var(--text-secondary);">Comments can be viewed on YouTube.</li>';
        sendCommentBtn.disabled = true;
        commentInput.disabled = true;
    } catch (error) {
        console.error("Error loading comments:", error);
        commentsList.innerHTML = '<li style="text-align:center; color: var(--error-red);">Could not load comments.</li>';
        sendCommentBtn.disabled = true;
        commentInput.disabled = true;
    }
}

function formatTimeAgo(date) {
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.round(days / 30.4);
    if (months < 12) return `${months}mo ago`;
    const years = Math.round(days / 365);
    return `${years}y ago`;
}

function closeCommentsModal() {
    commentsModal.classList.remove('active');
    appState.activeComments = { videoId: null, videoOwnerUid: null };
    commentInput.value = '';
}

async function postComment() {
    alert("Commenting is not available here. Please comment on YouTube.");
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
        allChip.onclick = () => filterVideosByCategory(s.id, 'All', allChip);
        s.appendChild(allChip);
        categories.forEach(category => {
            const chip = document.createElement('div');
            chip.className = 'category-chip haptic-trigger';
            chip.textContent = category;
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
    
    // खोज इनपुट साफ़ करें
    const searchInput = document.getElementById('long-video-search-input');
    if (searchInput) searchInput.value = '';

    if (scrollerId === 'category-scroller') { 
        if (activePlayerId) {
            pauseActivePlayer();
            activePlayerId = null;
        }
        setupShortsScreen(category);
    } else { 
        populateLongVideoGrid(category);
    }
}


function renderUserProfileVideos() {
    // ★ बदलाव: उपयोगकर्ता द्वारा अपलोड किए गए वीडियो अब समर्थित नहीं हैं
    const shortGrid = document.getElementById('user-short-video-grid');
    const longGrid = document.getElementById('user-long-video-grid');
    
    const message = '<p class="static-message" style="color: var(--text-secondary); grid-column: 1 / -1;">Video uploads are no longer supported. All content is from YouTube.</p>';

    if (shortGrid) shortGrid.innerHTML = message;
    if (longGrid) longGrid.innerHTML = message;
}

function showAudioIssuePopup() {
    if (!hasShownAudioPopup) {
        document.getElementById('audio-issue-popup').classList.add('active');
        hasShownAudioPopup = true;
    }
}

function closeAudioIssuePopup() {
    document.getElementById('audio-issue-popup').classList.remove('active');
}

async function setupShortsScreen(category = 'All') {
    const query = category.toLowerCase() === 'trending' ? 'trending shorts india' : (category.toLowerCase() === 'all' ? 'youtube shorts' : `${category} shorts`);

    if (homeStaticMessageContainer) {
        videoSwiper.innerHTML = '';
        videoSwiper.appendChild(homeStaticMessageContainer);
        homeStaticMessageContainer.style.display = 'flex';
        homeStaticMessageContainer.querySelector('.static-message').innerHTML = '<div class="loader"></div> Loading shorts...';
    }

    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short' });
    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    if(data.items && data.items.length > 0) {
        renderVideoSwiper(data.items, false);
    } else {
        renderVideoSwiper([], false); // खाली प्रस्तुत करें
        homeStaticMessageContainer.querySelector('.static-message').textContent = 'No shorts found for this category.';
    }
}

async function loadMoreShorts() {
    const activeCategoryChip = document.querySelector('#category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.textContent : 'All';
    const query = category.toLowerCase() === 'trending' ? 'trending shorts india' : (category.toLowerCase() === 'all' ? 'youtube shorts' : `${category} shorts`);

    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short', pageToken: appState.youtubeNextPageTokens.shorts });

    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    if(data.items) {
        renderVideoSwiper(data.items, true);
    }
}


async function setupLongVideoScreen() {
    populateLongVideoCategories();
    // ★ बदलाव: डिफ़ॉल्ट रूप से ट्रेंडिंग वीडियो लोड करें
    await populateLongVideoGrid('Trending');
    await renderTrendingCarousel();
    
    const gridContainer = document.querySelector('.long-video-screen-content');
    let loadMoreBtn = document.getElementById('long-video-load-more-btn');
    if (!loadMoreBtn) {
        loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'long-video-load-more-btn';
        loadMoreBtn.className = 'continue-btn haptic-trigger';
        loadMoreBtn.textContent = 'Load More';
        loadMoreBtn.style.margin = '0 20px 20px 20px';
        loadMoreBtn.style.display = 'none';
        loadMoreBtn.onclick = loadMoreLongVideos;
        gridContainer.appendChild(loadMoreBtn);
    }
}

function populateLongVideoCategories() {
    renderCategoriesInBar();
}

async function populateLongVideoGrid(category = 'All') {
    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    let data;
    if (category.toLowerCase() === 'trending') {
        data = await fetchFromYouTubeAPI('trending', { limit: 20, regionCode: 'IN' });
    } else {
        const query = category.toLowerCase() === 'all' ? 'latest music videos' : category; 
        data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'long' });
    }
    
    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    if (data.items) {
        renderYouTubeLongVideos(data.items, false);
    } else {
        renderYouTubeLongVideos([], false); // खाली प्रस्तुत करें
        grid.innerHTML = `<p class="static-message">${data.error || 'Could not load videos.'}</p>`;
    }
}

async function renderTrendingCarousel() {
    const carouselWrapper = document.getElementById('long-video-carousel-wrapper');
    if (!carouselWrapper) return;
    carouselWrapper.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
    
    const data = await fetchFromYouTubeAPI('trending', { limit: 10, regionCode: 'IN' });
    
    if (data.items && data.items.length > 0) {
        carouselWrapper.innerHTML = data.items.map(video => {
            const videoId = typeof video.id === 'object' ? video.id.videoId : video.id;
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
        // यदि खोज खाली है, तो सक्रिय श्रेणी पर वापस लौटें
        const activeCategoryChip = document.querySelector('#long-video-category-scroller .category-chip.active');
        const category = activeCategoryChip ? activeCategoryChip.textContent : 'Trending';
        filterVideosByCategory('long-video-category-scroller', category, activeCategoryChip);
        return;
    }
    
    // श्रेणी चयन को निष्क्रिय करें
    document.querySelectorAll('#long-video-category-scroller .category-chip').forEach(chip => chip.classList.remove('active'));

    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'long' });
    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    if(data.items) {
        renderYouTubeLongVideos(data.items, false);
    } else {
        renderYouTubeLongVideos([], false); // खाली प्रस्तुत करें
    }
}

function createLongVideoCard(video) {
    const videoId = typeof video.id === 'object' ? video.id.videoId : video.id;
    if (!videoId) return document.createElement('div');

    const card = document.createElement('div');
    card.className = 'long-video-card';
    card.dataset.videoId = videoId;
    card.dataset.channelId = video.snippet.channelId;
    
    const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url;
    
    // ★ बदलाव: क्रेडिट बटन को ऐड चैनल बटन से बदला गया
    const addChannelOnClick = `addChannelToList(event, '${video.snippet.channelId}')`;

    card.innerHTML = `
        <div class="long-video-thumbnail" style="background-image: url('${escapeHTML(thumbnailUrl)}')" onclick="playYouTubeVideoFromCard('${videoId}')">
            <i class="fas fa-play play-icon-overlay"></i>
        </div>
        <div class="long-video-info-container">
            <div class="long-video-details" onclick="navigateTo('creator-page-screen', { creatorId: '${video.snippet.channelId}', startWith: 'long', videoId: '${videoId}' })">
                <span class="long-video-name">${escapeHTML(video.snippet.title)}</span>
                <span class="long-video-uploader">${escapeHTML(video.snippet.channelTitle)}</span>
            </div>
        </div>
        <button class="add-channel-btn-long-grid haptic-trigger" onclick="${addChannelOnClick}"><i class="fas fa-plus"></i> Add Channel</button>
    `;
    return card;
}

function showVideoDescription(event, videoId) {
    event.stopPropagation();
    const video = currentVideoCache.get(videoId);
    if (video) {
        const descriptionText = video.snippet.description || "No description available.";
        descriptionContent.innerHTML = escapeHTML(descriptionText).replace(/\n/g, '<br>');
        descriptionModal.classList.add('active');
    } else {
        alert("Could not find video details.");
    }
}

function closeDescriptionModal() {
    descriptionModal.classList.remove('active');
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
    scroller.innerHTML = '';

    const historyVideos = appState.viewingHistory.filter(v => v.videoLengthType !== 'long');
        
    if (historyVideos.length === 0) {
        scroller.innerHTML = `<p class="static-message" style="color: var(--text-secondary);">No short video history.</p>`;
        return;
    }

    historyVideos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'history-short-card haptic-trigger';
        card.style.backgroundImage = `url(${escapeHTML(video.thumbnailUrl)})`;
        card.innerHTML = `<div class="history-item-menu" onclick="event.stopPropagation(); showHistoryItemMenu(event, '${video.id}')"><i class="fas fa-trash-alt"></i></div>`;
        card.onclick = () => navigateTo('creator-page-screen', { creatorId: video.channelId, startWith: 'short', videoId: video.id });
        scroller.appendChild(card);
    });
}


function renderHistoryLongVideoList() {
    const list = document.getElementById('history-long-video-list');
    if (!list) return;
    list.innerHTML = '';

    const historyVideos = appState.viewingHistory.filter(v => v.videoLengthType === 'long');

    if (historyVideos.length === 0) {
        list.innerHTML = `<p class="static-message" style="color: var(--text-secondary);">No long video history.</p>`;
        return;
    }

    historyVideos.forEach(video => {
        const item = document.createElement('div');
        item.className = 'history-list-item haptic-trigger';
        item.innerHTML = `
            <div class="history-item-thumbnail" style="background-image: url('${escapeHTML(video.thumbnailUrl)})'" onclick="playYouTubeVideoFromCard('${video.id}')"></div>
            <div class="history-item-info" onclick="playYouTubeVideoFromCard('${video.id}')">
                <span class="history-item-title">${escapeHTML(video.title)}</span>
                <span class="history-item-uploader">${escapeHTML(video.channelTitle)}</span>
            </div>
            <div class="history-item-menu haptic-trigger" onclick="showHistoryItemMenu(event, '${video.id}')">
                <i class="fas fa-trash-alt"></i>
            </div>
        `;
        list.appendChild(item);
    });
}

function clearAllHistory() {
    if (confirm("Are you sure you want to clear your entire watch history? This cannot be undone.")) {
        appState.viewingHistory = [];
        localStorage.removeItem('shubhzoneViewingHistory');
        initializeHistoryScreen();
        alert("Watch history cleared.");
    }
}


function showHistoryItemMenu(event, videoId) {
    event.stopPropagation();
    if (confirm(`Remove this video from your history?`)) {
        deleteFromHistory(videoId);
    }
}

function deleteFromHistory(videoId) {
    const index = appState.viewingHistory.findIndex(item => item.id === videoId);
    if (index > -1) {
        appState.viewingHistory.splice(index, 1);
        localStorage.setItem('shubhzoneViewingHistory', JSON.stringify(appState.viewingHistory));
        initializeHistoryScreen();
    }
}

function populateYourZoneScreen() {
    const content = document.getElementById('your-zone-content');
    if (!content) return;
    
    const { uid, referralCode, avatar, name, email } = appState.currentUser;
    content.innerHTML = `
        <div class="your-zone-header">
            <img id="your-zone-header-avatar" src="${escapeHTML(avatar)}" alt="Avatar" class="your-zone-avatar">
            <h3 class="your-zone-name">${escapeHTML(name)}</h3>
            <p class="your-zone-email">${escapeHTML(email)}</p>
        </div>
        <div class="your-zone-card">
            <label>Your Unique ID</label>
            <div class="input-with-button">
                <input type="text" value="${escapeHTML(uid)}" readonly>
                <button class="copy-btn haptic-trigger" onclick="copyToClipboard('${escapeHTML(uid)}', event)"><i class="fas fa-copy"></i></button>
            </div>
        </div>
        <div class="your-zone-card">
            <label>Your Referral Code</label>
            <div class="input-with-button">
                <input type="text" value="${escapeHTML(referralCode || 'N/A')}" readonly>
                <button class="copy-btn haptic-trigger" onclick="copyToClipboard('${escapeHTML(referralCode)}', event)"><i class="fas fa-copy"></i></button>
            </div>
        </div>
        <button class="your-zone-action-btn edit haptic-trigger" onclick="navigateTo('information-screen')">
            <i class="fas fa-user-edit"></i> Edit Profile
        </button>
        <button class="your-zone-action-btn logout haptic-trigger" onclick="logoutUser()">
            <i class="fas fa-sign-out-alt"></i> Log Out
        </button>
    `;
}

async function sendFriendRequest(receiverId, buttonElement) {
    if (!appState.currentUser.uid || !receiverId) return;

    buttonElement.disabled = true;
    buttonElement.textContent = '...';

    const requestData = {
        senderId: appState.currentUser.uid,
        senderName: appState.currentUser.name,
        senderAvatar: appState.currentUser.avatar,
        receiverId: receiverId,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        const existingRequest = await db.collection('friendRequests')
            .where('senderId', '==', appState.currentUser.uid)
            .where('receiverId', '==', receiverId)
            .get();

        if (!existingRequest.empty) {
            alert("You have already sent a friend request to this user.");
            buttonElement.textContent = 'Requested';
            buttonElement.classList.add('requested');
            return;
        }

        await db.collection('friendRequests').add(requestData);
        buttonElement.textContent = 'Requested';
        buttonElement.classList.add('requested');
    } catch (error) {
        console.error("Error sending friend request:", error);
        alert("Failed to send friend request.");
        buttonElement.disabled = false;
        buttonElement.textContent = 'Add Friend';
    }
}

async function populateFriendRequestsList() {
    const requestsContent = document.getElementById('requests-content');
    if (!requestsContent) return;
    requestsContent.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

    try {
        const requestsSnapshot = await db.collection('friendRequests')
            .where('receiverId', '==', appState.currentUser.uid)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get();

        if (requestsSnapshot.empty) {
            requestsContent.innerHTML = '<p class="static-message">No new friend requests.</p>';
            return;
        }

        const requestsHtml = requestsSnapshot.docs.map(doc => {
            const request = { id: doc.id, ...doc.data() };
            return `
                <div class="holographic-card" id="request-${request.id}">
                    <div class="profile-pic" onclick="showEnlargedImage('${escapeHTML(request.senderAvatar) || 'https://via.placeholder.com/60'}')"><img src="${escapeHTML(request.senderAvatar) || 'https://via.placeholder.com/60'}" alt="avatar"></div>
                    <div class="info">
                        <div class="name">${escapeHTML(request.senderName) || 'User'}</div>
                        <div class="subtext">Wants to be your friend</div>
                    </div>
                    <div class="request-actions">
                        <button class="accept-button haptic-trigger" onclick="acceptFriendRequest(event, '${request.id}', '${request.senderId}')">Accept</button>
                        <button class="reject-button haptic-trigger" onclick="rejectFriendRequest(event, '${request.id}')">Reject</button>
                    </div>
                </div>
            `;
        }).join('');

        requestsContent.innerHTML = requestsHtml;

    } catch (error) {
        console.error("Error fetching friend requests:", error);
        requestsContent.innerHTML = `<p class="static-message" style="color: var(--error-red);">Could not load requests. Please check your Firestore Indexes.</p><p style="font-size: 0.8em; color: var(--text-secondary);">${error.message}</p>`;
    }
}

async function acceptFriendRequest(event, requestId, senderId) {
    const actionDiv = event.target.closest('.request-actions');
    actionDiv.innerHTML = '<div class="loader" style="width: 20px; height: 20px;"></div>';

    const batch = db.batch();
    
    const requestRef = db.collection('friendRequests').doc(requestId);
    batch.update(requestRef, { status: 'accepted' });

    const currentUserRef = db.collection('users').doc(appState.currentUser.uid);
    batch.update(currentUserRef, { friends: firebase.firestore.FieldValue.arrayUnion(senderId) });
    
    const senderUserRef = db.collection('users').doc(senderId);
    batch.update(senderUserRef, { friends: firebase.firestore.FieldValue.arrayUnion(appState.currentUser.uid) });

    try {
        await batch.commit();
        
        if (!appState.currentUser.friends.includes(senderId)) {
            appState.currentUser.friends.push(senderId);
        }

        alert("Friend request accepted!");
        
        const requestCard = document.getElementById(`request-${requestId}`);
        if (requestCard) requestCard.remove();
        
        populateMembersList();

    } catch (error) {
        console.error("Error accepting friend request:", error);
        alert("Failed to accept request. Please check your internet connection and Firestore rules.");
        actionDiv.innerHTML = `<button class="accept-button haptic-trigger" onclick="acceptFriendRequest(event, '${requestId}', '${senderId}')">Accept</button>
                               <button class="reject-button haptic-trigger" onclick="rejectFriendRequest(event, '${requestId}')">Reject</button>`;
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
        actionDiv.innerHTML = `<button class="accept-button haptic-trigger" onclick="acceptFriendRequest(event, '${requestId}', '${senderId}')">Accept</button>
                               <button class="reject-button haptic-trigger" onclick="rejectFriendRequest(event, '${requestId}')">Reject</button>`;
    }
}

async function populateMembersList() {
    const membersContent = document.getElementById('members-content');
    if (!membersContent) return;
    membersContent.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

    const friendIds = appState.currentUser.friends || [];

    if (friendIds.length === 0) {
        membersContent.innerHTML = '<p class="static-message">You have no friends yet. Add some from the "Add" tab!</p>';
        return;
    }

    try {
        const friendPromises = friendIds.map(id => db.collection('users').doc(id).get());
        const friendDocs = await Promise.all(friendPromises);

        let finalHtml = '';
        
        const friends = friendDocs
            .map(doc => ({ id: doc.id, ...doc.data() }));

        friends.forEach((friend, index) => {
            finalHtml += `
                <div class="holographic-card" onclick="startChat('${friend.id}', '${escapeHTML(friend.name)}', '${escapeHTML(friend.avatar)}')">
                    <div class="profile-pic" onclick="event.stopPropagation(); showEnlargedImage('${escapeHTML(friend.avatar) || 'https://via.placeholder.com/60'}')">
                        <img src="${escapeHTML(friend.avatar) || 'https://via.placeholder.com/60'}" alt="avatar">
                    </div>
                    <div class="info">
                        <div class="name">${escapeHTML(friend.name) || 'Shubhzone User'}</div>
                        <div class="subtext">Tap to chat</div>
                    </div>
                </div>`;
            
            if ((index + 1) % 5 === 0) {
                const adContainerId = `friend-ad-${index}`;
                finalHtml += `<div class="friend-list-ad" id="${adContainerId}"></div>`;
                setTimeout(() => {
                    const adElement = document.getElementById(adContainerId);
                    if (adElement) injectBannerAd(adElement);
                }, 100);
            }
        });
        
        membersContent.innerHTML = finalHtml || '<p class="static-message">Could not load friends list.</p>';

    } catch (error) {
        console.error("Error fetching members:", error);
        membersContent.innerHTML = '<p class="static-message" style="color: var(--error-red);">Could not load your friends.</p>';
    }
}


async function populateAddFriendsList(featuredUser = null) {
    const addContent = document.querySelector('#friends-screen #add-content');
    if (!addContent) return;
    
    const userListContainer = addContent.querySelector('#add-friend-user-list');
    if (!userListContainer) {
        console.error('#add-friend-user-list container not found');
        return;
    }
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
            userQuery = await db.collection('users')
                .where('referralCode', '==', query)
                .limit(1)
                .get();
        } else {
             userQuery = await db.collection('users')
                .where('name', '>=', query)
                .where('name', '<=', query + '\uf8ff')
                .get();
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

async function startChat(friendId, friendName, friendAvatar) {
    const chatScreen = document.getElementById('chat-screen-overlay');
    if (!chatScreen) return;
    
    document.getElementById('chat-username').textContent = friendName;
    document.getElementById('chat-user-profile-pic').src = friendAvatar || 'https://via.placeholder.com/50';

    const uids = [appState.currentUser.uid, friendId].sort();
    const chatId = uids.join('_');
    
    appState.activeChat = { chatId, friendId, friendName, friendAvatar };

    try {
        const chatRef = db.collection('chats').doc(chatId);
        
        const friendDoc = await db.collection('users').doc(friendId).get();
        let finalFriendName = friendName;
        let finalFriendAvatar = friendAvatar;
        
        if (friendDoc.exists) {
            finalFriendName = friendDoc.data().name || friendName;
            finalFriendAvatar = friendDoc.data().avatar || friendAvatar;
        }

        await chatRef.set({
            members: uids,
            memberDetails: {
                [appState.currentUser.uid]: { name: appState.currentUser.name, avatar: appState.currentUser.avatar },
                [friendId]: { name: finalFriendName, avatar: finalFriendAvatar }
            }
        }, { merge: true });

        chatScreen.classList.add('active');
        loadChatMessages(chatId);

    } catch (error) {
        console.error("Error starting chat:", error);
        alert("Could not start chat. Please check your internet connection or try again.");
    }
}

async function sendMessage() {
    const { chatId } = appState.activeChat;
    const inputField = document.querySelector('#chat-screen-overlay .input-field');
    const text = inputField.value.trim();

    if (!text || !chatId) return;

    const messageData = {
        text: text,
        senderId: appState.currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    inputField.value = '';

    try {
        await db.collection('chats').doc(chatId).collection('messages').add(messageData);
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Message could not be sent.");
        inputField.value = text;
    }
}

function loadChatMessages(chatId) {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    db.collection('chats').doc(chatId).collection('messages').orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
          if (snapshot.empty) {
              messagesContainer.innerHTML = '<p class="static-message">No messages yet. Say hi!</p>';
              return;
          }
          const messagesHtml = snapshot.docs.map(doc => {
              const msg = doc.data();
              const bubbleClass = msg.senderId === appState.currentUser.uid ? 'sender' : 'receiver';
              return `<div class="message-bubble ${bubbleClass}">${escapeHTML(msg.text)}</div>`;
          }).join('');

          messagesContainer.innerHTML = messagesHtml;
          messagesContainer.scrollTop = messagesContainer.scrollHeight; 
      }, error => {
          console.error("Error loading chat messages:", error);
          messagesContainer.innerHTML = '<p class="static-message" style="color: var(--error-red);">Could not load chat. Check security rules.</p>';
      });
}

function initializeMessagingInterface() {
    const friendsScreen = document.getElementById('friends-screen');
    if (!friendsScreen) return;
    
    friendsScreen.querySelectorAll('.tab-button').forEach(button => {
        button.classList.add('haptic-trigger');
        button.addEventListener('click', () => {
             friendsScreen.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
             friendsScreen.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
             button.classList.add('active');
             const contentToShow = friendsScreen.querySelector('#' + button.dataset.tab + '-content');
             if (contentToShow) contentToShow.classList.remove('hidden');

             if (button.dataset.tab === 'add') populateAddFriendsList();
             if (button.dataset.tab === 'requests') populateFriendRequestsList();
             if (button.dataset.tab === 'members') populateMembersList();
             if (button.dataset.tab === 'my-channels') renderMyChannelsList(); // ★ नया: टैब क्लिक पर चैनल सूची रेंडर करें
        });
    });

    const chatScreenOverlay = document.getElementById('chat-screen-overlay');
    chatScreenOverlay.querySelector('.back-arrow')?.addEventListener('click', () => {
        chatScreenOverlay.classList.remove('active');
        const { chatId } = appState.activeChat;
        if (chatId) {
            const unsubscribe = db.collection('chats').doc(chatId).collection('messages').onSnapshot(() => {});
            if (unsubscribe) unsubscribe();
        }
        appState.activeChat = {};
    });

    const sendButton = document.getElementById('send-button');
    const messageInput = document.querySelector('#chat-screen-overlay .input-field');

    sendButton?.addEventListener('click', sendMessage);
    messageInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    messageInput?.addEventListener('input', (e) => {
        if (e.target.value.trim().length > 0) {
            sendButton.classList.add('active');
        } else {
            sendButton.classList.remove('active');
        }
    });

}

function provideHapticFeedback() { if (hapticFeedbackEnabled && navigator.vibrate) navigator.vibrate(50); }
function loadHapticPreference() {
    hapticFeedbackEnabled = (localStorage.getItem('hapticFeedbackEnabled') !== 'false');
    const hapticToggleInput = document.getElementById('haptic-toggle-input');
    if (hapticToggleInput) hapticToggleInput.checked = hapticFeedbackEnabled;
}
function saveHapticPreference(enabled) {
    localStorage.setItem('hapticFeedbackEnabled', enabled);
    hapticFeedbackEnabled = enabled;
}

function toggleProfileVideoView(viewType) {
    const shortGrid = document.getElementById('user-short-video-grid');
    const longGrid = document.getElementById('user-long-video-grid');
    const shortBtn = document.getElementById('profile-show-shorts-btn');
    const longBtn = document.getElementById('profile-show-longs-btn');

    if (viewType === 'short') {
        if(shortGrid) shortGrid.style.display = 'grid';
        if(longGrid) longGrid.style.display = 'none';
        if(shortBtn) shortBtn.classList.add('active');
        if(longBtn) longBtn.classList.remove('active');
    } else {
        if(shortGrid) shortGrid.style.display = 'none';
        if(longGrid) longGrid.style.display = 'grid';
        if(shortBtn) shortBtn.classList.remove('active');
        if(longBtn) longBtn.classList.add('active');
    }
}

// =======================================================
// ★★★ CREATOR PAGE LOGIC - START ★★★
// =======================================================

async function initializeCreatorPage(channelId, startWith = 'short', startVideoId = null) {
    const shortView = document.getElementById('creator-page-short-view');
    const longView = document.getElementById('creator-page-long-view');
    if (!shortView || !longView) return;
    
    shortView.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    longView.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    const channelVideosData = await fetchFromYouTubeAPI('channel', { channelId: channelId });
    const allVideos = channelVideosData.items || [];
    
    // लघु और लंबे वीडियो को अलग करने के लिए एक सरल अनुमान
    const shortVideos = allVideos.filter(v => 
        (v.snippet.title && v.snippet.title.toLowerCase().includes('#shorts')) ||
        (v.snippet.description && v.snippet.description.toLowerCase().includes('#shorts'))
    );
    const longVideos = allVideos.filter(v => !shortVideos.some(short => (short.id.videoId || short.id) === (v.id.videoId || v.id)));

    let startShortVideo = shortVideos.find(v => (v.id.videoId || v.id) === startVideoId) || shortVideos[0];
    let startLongVideo = longVideos.find(v => (v.id.videoId || v.id) === startVideoId) || longVideos[0];
    
    const tabs = document.querySelectorAll('#creator-page-tabs .creator-page-tab-btn');
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.creator-page-view').forEach(v => v.classList.remove('active'));
            const activeView = document.getElementById(`creator-page-${tab.dataset.type}-view`);
            if (activeView) activeView.classList.add('active');
            
            const otherType = tab.dataset.type === 'short' ? 'long' : 'short';
            if(appState.creatorPagePlayers[otherType] && typeof appState.creatorPagePlayers[otherType].pauseVideo === 'function') {
                appState.creatorPagePlayers[otherType].pauseVideo();
            }
            if(appState.creatorPagePlayers[tab.dataset.type] && typeof appState.creatorPagePlayers[tab.dataset.type].playVideo === 'function') {
                appState.creatorPagePlayers[tab.dataset.type].playVideo();
            }
        };
    });
    
    if (startWith === 'long' && startLongVideo) {
        appState.creatorPage.currentLongVideo = { id: (startLongVideo.id.videoId || startLongVideo.id), channelId: channelId };
    }
    
    renderCreatorVideoView(shortView, shortVideos, 'short', channelId, startShortVideo ? (startShortVideo.id.videoId || startShortVideo.id) : null);
    renderCreatorVideoView(longView, longVideos, 'long', channelId, startLongVideo ? (startLongVideo.id.videoId || startLongVideo.id) : null);
    
    document.querySelectorAll('.creator-page-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.creator-page-tab-btn').forEach(t => t.classList.remove('active'));
    document.getElementById(`creator-page-${startWith}-view`).classList.add('active');
    document.querySelector(`.creator-page-tab-btn[data-type="${startWith}"]`).classList.add('active');
}


function renderCreatorVideoView(container, videos, type, channelId, startVideoId = null) {
    container.innerHTML = '';
    if (videos.length === 0) {
        container.innerHTML = `<p class="static-message">This creator has no ${type} videos.</p>`;
        return;
    }
    
    let firstVideo = videos.find(v => (v.id.videoId || v.id) === startVideoId) || videos[0];
    
    const videoListHtml = videos.map((v) => {
        const thumbClass = (type === 'long') ? 'side-video-thumb-long' : 'side-video-thumb-short';
        const videoId = v.id.videoId || v.id;
        return `<img src="${v.snippet.thumbnails.medium.url}" class="side-video-thumb haptic-trigger ${thumbClass}" onclick="playCreatorVideo('${type}', '${videoId}', '${channelId}')">`;
    }).join('');

    // ★ बदलाव: कस्टम नियंत्रणों को सरल बनाया गया
    const playerControlsHtml = `
        <div class="custom-player-controls-overlay">
            <div class="controls-center" onclick="toggleCreatorPlayer('${type}')">
                <i class="fas fa-play-circle control-btn-main"></i>
            </div>
            <div class="controls-bottom">
                <i class="fas fa-sync-alt rotate-btn-player haptic-trigger" onclick="event.stopPropagation(); toggleVideoRotation();"></i>
            </div>
        </div>
    `;

    container.innerHTML = `
        <div class="creator-video-viewer">
            <div class="main-video-card-wrapper">
                <div class="main-video-card">
                    <div id="creator-page-player-${type}"></div>
                    ${type === 'long' ? playerControlsHtml : ''}
                </div>
            </div>
            <div class="side-video-list-scroller">${videoListHtml}</div>
        </div>
    `;
    
    if (firstVideo && isYouTubeApiReady) {
        const videoIdToPlay = firstVideo.id.videoId || firstVideo.id;
        initializeCreatorPagePlayer(videoIdToPlay, `creator-page-player-${type}`, type);
    }
}

function initializeCreatorPagePlayer(videoId, containerId, type) {
    if (appState.creatorPagePlayers[type]) {
        appState.creatorPagePlayers[type].destroy();
    }
    
    appState.creatorPagePlayers[type] = new YT.Player(containerId, {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'autoplay': 1, 
            'controls': 0, // ★ बदलाव: सभी डिफ़ॉल्ट नियंत्रण छिपाएँ
            'rel': 0, 'showinfo': 0, 'mute': 0, 'modestbranding': 1,
            'fs': 0, // ★ बदलाव: डिफ़ॉल्ट फ़ुलस्क्रीन बटन अक्षम करें
            'origin': window.location.origin
        },
        events: {
            'onReady': (event) => {
                event.target.playVideo();
                // पहले वीडियो के लिए इतिहास जोड़ें
                if (type === 'long') {
                    addLongVideoToHistory(videoId);
                } else {
                    addVideoToHistory(videoId);
                }
            },
            'onStateChange': handleCreatorPlayerStateChange
        }
    });
}

function toggleCreatorPlayer(type) {
    const player = appState.creatorPagePlayers[type];
    if (player && typeof player.getPlayerState === 'function') {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) player.pauseVideo();
        else player.playVideo();
    }
}

function playCreatorVideo(type, videoId, channelId) {
    if (type === 'long') {
        appState.creatorPage.currentLongVideo = { id: videoId, channelId: channelId };
        addLongVideoToHistory(videoId);
    } else {
        addVideoToHistory(videoId);
    }
    const player = appState.creatorPagePlayers[type];
    if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(videoId);
    }
}


function toggleCreatorVideoList() {
    const activeView = document.querySelector('.creator-page-view.active');
    if (activeView) {
        const viewer = activeView.querySelector('.creator-video-viewer');
        if (viewer) viewer.classList.toggle('show-side-list');
    }
}

function toggleVideoRotation() {
    const longVideoView = document.getElementById('creator-page-long-view');
    if (longVideoView && longVideoView.classList.contains('active')) {
        const videoWrapper = longVideoView.querySelector('.main-video-card-wrapper');
        const appContainer = document.getElementById('app-container');

        if (videoWrapper) {
            videoWrapper.classList.toggle('rotated');
            appContainer.classList.toggle('fullscreen-active');

            // फ़ुलस्क्रीन मोड को प्रबंधित करें
            try {
                if (videoWrapper.classList.contains('rotated')) {
                    if (appContainer.requestFullscreen) {
                        appContainer.requestFullscreen();
                    } else if (appContainer.webkitRequestFullscreen) { /* Safari */
                        appContainer.webkitRequestFullscreen();
                    }
                    screen.orientation.lock('landscape').catch(err => console.log("Screen orientation lock failed:", err));
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) { /* Safari */
                        document.webkitExitFullscreen();
                    }
                    screen.orientation.unlock();
                }
            } catch (err) {
                console.error("Fullscreen API error:", err);
            }
        }
    } else {
        alert("Rotation is only available for long videos.");
    }
}


function handleCreatorPlayerStateChange(event) {
    const player = event.target;
    const playerState = event.data;
    const iframe = player.getIframe();
    
    const playPauseBtn = iframe.closest('.main-video-card')?.querySelector('.control-btn-main');
    if (playPauseBtn) {
        if (playerState === YT.PlayerState.PLAYING) {
            playPauseBtn.classList.replace('fa-play-circle', 'fa-pause-circle');
        } else {
            playPauseBtn.classList.replace('fa-pause-circle', 'fa-play-circle');
        }
    }

    const videoId = player.getVideoData().video_id;
    if (!videoId) return;
    
    if (playerState === YT.PlayerState.PLAYING) {
        addLongVideoToHistory(videoId);
    }
}

// =======================================================
// ★★★ CREATOR PAGE LOGIC - END ★★★
// =======================================================

// =======================================================
// ★★★ ADDED CHANNELS LOGIC - START ★★★
// =======================================================
async function addChannelToList(event, channelId) {
    event.stopPropagation(); // कार्ड पर क्लिक होने से रोकें
    if (!channelId) return;

    let channels = appState.currentUser.addedChannels || [];
    if (channels.some(c => c.id === channelId)) {
        alert("This channel is already in your list.");
        return;
    }

    try {
        // चैनल विवरण प्राप्त करें (कैश से या एपीआई से)
        let channelDetails = {};
        const videoWithChannel = Array.from(currentVideoCache.values()).find(v => v.snippet.channelId === channelId);

        if (videoWithChannel) {
            channelDetails = {
                id: channelId,
                name: videoWithChannel.snippet.channelTitle,
                // चैनल अवतार के लिए एक अलग एपीआई कॉल की आवश्यकता होगी, अभी के लिए प्लेसहोल्डर का उपयोग करें
                avatar: 'https://via.placeholder.com/60' 
            };
        } else {
            // यदि कैश में नहीं है तो एक वीडियो से विवरण प्राप्त करने का प्रयास करें
            const data = await fetchFromYouTubeAPI('channel', { channelId: channelId, limit: 1 });
            if (data.items && data.items.length > 0) {
                 channelDetails = {
                    id: channelId,
                    name: data.items[0].snippet.channelTitle,
                    avatar: 'https://via.placeholder.com/60'
                };
            } else {
                alert("Could not retrieve channel details.");
                return;
            }
        }
        
        channels.push(channelDetails);
        appState.currentUser.addedChannels = channels;
        localStorage.setItem('shubhzone_addedChannels', JSON.stringify(channels));
        alert(`Channel "${channelDetails.name}" has been added to your list.`);

        // यदि मित्र स्क्रीन पर है तो सूची को ताज़ा करें
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
                <button class="open-button haptic-trigger" onclick="navigateTo('creator-page-screen', { creatorId: '${channel.id}' })">Open</button>
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

function startAppTimeTracker() {
    if (appState.appTimeTrackerInterval) clearInterval(appState.appTimeTrackerInterval);
    // यह फ़ंक्शन अब केवल एक प्लेसहोल्डर है क्योंकि ट्रैकिंग तर्क हटा दिया गया है
    appState.appTimeTrackerInterval = setInterval(() => {}, 60000); 
}

// =======================================================
// ★★★ REPORT & CREDIT LOGIC - START ★★★
// =======================================================
function initializeReportScreen() {
    const screen = document.getElementById('report-screen');
    if (!screen) return;
    screen.innerHTML = `
        <div class="screen-header">
            <div class="header-icon-left haptic-trigger" onclick="navigateBack()"><i class="fas fa-arrow-left"></i></div>
            <span class="header-title">Submit a Report</span>
        </div>
        <div id="report-content">
            <div class="form-group">
                <label for="report-text">Describe your issue</label>
                <textarea id="report-text" rows="10" placeholder="Please provide as much detail as possible..."></textarea>
            </div>
            <button class="continue-btn haptic-trigger" onclick="submitReport()">Submit Report</button>
        </div>
    `;
}

async function submitReport() {
    const reportText = document.getElementById('report-text').value.trim();
    if (!reportText) { alert("Please describe the issue before submitting."); return; }
    const button = document.querySelector('#report-content .continue-btn');
    button.disabled = true;
    button.textContent = "Submitting...";
    try {
        await db.collection('reports').add({
            reporterUid: appState.currentUser.uid, 
            reporterName: appState.currentUser.name,
            reportText: reportText,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'new'
        });
        alert("Report submitted successfully. We will look into it shortly.");
        navigateBack();
    } catch (error) {
        console.error("Error submitting report:", error);
        alert("Failed to submit report. Please try again. Error: " + error.message);
    } finally {
        button.disabled = false;
        button.textContent = "Submit Report";
    }
}

async function initializeCreditScreen(videoId) {
    // This screen is now deprecated in favor of the 'Add Channel' button.
    // If navigated to, just go back.
    navigateBack();
}
// =======================================================
// ★★★ REPORT & CREDIT LOGIC - END ★★★
// =======================================================

// ★★★ IMAGE ENLARGE LOGIC - START ★★★
function showEnlargedImage(imageUrl) {
    let modal = document.getElementById('image-enlarge-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-enlarge-modal';
        modal.className = 'modal-overlay';
        modal.style.zIndex = '3000';
        modal.innerHTML = `
            <div class="enlarged-image-content" style="max-width: 90vw; max-height: 90vh;">
                <img id="enlarged-image-src" src="" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', () => modal.classList.remove('active'));
    }
    
    const imgElement = document.getElementById('enlarged-image-src');
    if(imgElement) {
        imgElement.src = imageUrl;
        modal.classList.add('active');
    }
}
// ★★★ IMAGE ENLARGE LOGIC - END ★★★

document.addEventListener('DOMContentLoaded', () => {
    
    // होम नेविगेशन आइटम को पूरी तरह से छिपा दिया गया है
    document.querySelectorAll('.nav-item[data-nav="new-home"]').forEach(item => {
        item.style.display = 'none';
    });
    
    // साइडबार से हटाए गए सुविधाओं के लिए बटन हटाएं
    const sidebar = document.getElementById('main-sidebar');
    if(sidebar) {
        const buttonsToRemove = ['navigate-to-payment-btn', 'navigate-to-advertisement-btn', 'navigate-to-earnsure-btn'];
        buttonsToRemove.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.remove();
        });
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.add('haptic-trigger');
        item.addEventListener('click', () => {
            const targetNav = item.getAttribute('data-nav');
            if(item.style.display === 'none') return;
            
            let targetScreen = `${targetNav}-screen`;
            if (targetNav === 'shorts') {
                targetScreen = 'home-screen';
            }
            
            if (appState.currentScreen !== targetScreen) {
                navigateTo(targetScreen);
                updateNavActiveState(targetNav);
            }
        });
    });


    document.querySelectorAll('.header-icon-left').forEach(btn => {
        if (!btn.closest('#history-top-bar') && !btn.closest('#creator-page-screen .screen-header')) {
            btn.onclick = () => navigateBack();
        }
    });
    const creatorBackBtn = document.querySelector('#creator-page-screen .header-icon-left');
    if (creatorBackBtn) creatorBackBtn.onclick = () => navigateBack();

    // साइडबार में रिपोर्ट बटन जोड़ना
    if (sidebar) {
        let reportButton = document.getElementById('navigate-to-report-btn');
        if (!reportButton) {
            reportButton = document.createElement('button');
            reportButton.id = 'navigate-to-report-btn';
            reportButton.className = 'sidebar-option haptic-trigger';
            reportButton.innerHTML = `<i class="fas fa-flag" style="margin-right: 10px;"></i>Report`;
            reportButton.onclick = () => {
                document.getElementById('main-sidebar').classList.remove('open');
                document.getElementById('sidebar-overlay').classList.remove('open');
                navigateTo('report-screen');
            };
            sidebar.appendChild(reportButton);
        }
    }
    
    initializeApp();

    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.classList.add('haptic-trigger');
        getStartedBtn.addEventListener('click', () => {
            userHasInteracted = true;
            startAppLogic();
        });
    }

    if (appContainer) {
        appContainer.addEventListener('click', (event) => { 
            if (!userHasInteracted) userHasInteracted = true; 
            if (event.target.closest('.haptic-trigger')) provideHapticFeedback(); 
        });
    }

    initializeMessagingInterface();
    document.getElementById('add-friend-search-btn')?.addEventListener('click', searchUser);
    document.getElementById('add-friend-search-input')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchUser();
    });

    document.getElementById('home-menu-icon')?.addEventListener('click', () => {
        document.getElementById('main-sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.add('open');
    });
    document.getElementById('long-video-menu-icon')?.addEventListener('click', () => {
        document.getElementById('main-sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.add('open');
    });
    document.getElementById('close-sidebar-btn')?.addEventListener('click', () => {
        document.getElementById('main-sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('open');
    });
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
        document.getElementById('main-sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('open');
    });
    
    document.getElementById('send-comment-btn')?.addEventListener('click', postComment);
    document.getElementById('comment-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') postComment(); });
    document.getElementById('audio-issue-ok-btn')?.addEventListener('click', closeAudioIssuePopup);
    document.getElementById('close-description-btn')?.addEventListener('click', closeDescriptionModal);

    document.getElementById('long-video-search-btn')?.addEventListener('click', performLongVideoSearch);
    document.getElementById('long-video-search-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') performLongVideoSearch(); });
    document.getElementById('long-video-history-btn')?.addEventListener('click', () => navigateTo('history-screen'));
    document.getElementById('back-from-history-btn')?.addEventListener('click', () => navigateBack());
    
    document.getElementById('haptic-toggle-input')?.addEventListener('change', (e) => saveHapticPreference(e.target.checked));
    document.getElementById('profile-your-zone-btn')?.addEventListener('click', () => navigateTo('your-zone-screen'));
    document.getElementById('profile-show-shorts-btn')?.addEventListener('click', () => toggleProfileVideoView('short'));
    document.getElementById('profile-show-longs-btn')?.addEventListener('click', () => toggleProfileVideoView('long'));
    
    document.getElementById('more-function-btn')?.addEventListener('click', () => {
        document.getElementById('more-function-menu').classList.toggle('open');
    });
    document.getElementById('more-videos-btn')?.addEventListener('click', toggleCreatorVideoList);

    loadHapticPreference();
    renderCategoriesInBar();
});
