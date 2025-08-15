/* ================================================= */
/* === Shubhzone App Script (Code 2) - FINAL v6.0 === */
/* === MODIFIED AS PER USER REQUEST - AUG 2025    === */
/* === FEATURE: Rewards, Wallet & Referral System === */
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
    container.innerHTML = ''; // पिछली सामग्री साफ़ करें
    container.style.display = 'none'; // विज्ञापन लोड होने तक कंटेनर छिपाएँ

    const observer = new MutationObserver((mutationsList, obs) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && container.hasChildNodes()) {
                container.style.display = 'flex';
                obs.disconnect();
                return;
            }
        }
    });

    observer.observe(container, { childList: true, subtree: true });

    setTimeout(() => {
        observer.disconnect();
        if (!container.hasChildNodes()) {
           container.remove();
        }
    }, 10000);

    if (Math.random() > 0.5) {
        console.log("[AD] Injecting Monetag Native Banner...");
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.text = `(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gizokraijaw.net',9583482,document.createElement('script'))`;
        container.appendChild(adScript);
    } else {
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

function triggerFullScreenAd() {
    const isAnyModalActive = document.querySelector('.modal-overlay.active, .comments-modal-overlay.active, #chat-screen-overlay.active, #rewards-screen.active');
    if (isAnyModalActive) {
        console.log("[AD] Modal or Rewards screen is active, skipping full-screen ad.");
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

function setupAdTimers() {
    if (appState.adState.timers.fullscreenAdLoop) {
        clearInterval(appState.adState.timers.fullscreenAdLoop);
    }
    
    injectSocialBarAd();
    appState.adState.timers.fullscreenAdLoop = setInterval(triggerFullScreenAd, 60000);
}
// =======================================================================
// ★★★ ADVERTISEMENT LOGIC - END ★★★
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
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
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
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
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

function extractYouTubeId(url) {
    if (!url) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
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
        walletBalance: 0,
    },
    currentScreen: 'splash-screen',
    navigationStack: ['splash-screen'],
    currentScreenPayload: null,
    viewingHistory: [],
    youtubeNextPageTokens: {
        long: null,
        shorts: null,
        search: null,
    },
    activeComments: { videoId: null, videoOwnerUid: null, channelId: null },
    activeChat: { chatId: null, friendId: null, friendName: null, friendAvatar: null },
    creatorPagePlayers: { short: null, long: null },
    creatorPage: { 
        currentLongVideo: { id: null, uploaderUid: null, channelId: null },
        channelCache: new Map(),
        currentView: 'channel', 
        currentChannelId: null, 
    },
    adState: {
        timers: { fullscreenAdLoop: null },
        fullscreenAd: { 
            sequence: ['monetag_interstitial', 'monetag_directlink', 'monetag_interstitial', 'adsterra_popunder', 'monetag_directlink', 'monetag_popunder'], 
            currentIndex: 0 
        },
    },
    rewards: {
        mainTimer: null,
        offerExpiryTimer: null,
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

async function fetchFromYouTubeAPI(type, params) {
    const cacheKey = `${type}-${JSON.stringify(params)}`;
    const cacheRef = db.collection('youtube_cache').doc(cacheKey);

    try {
        const cachedDoc = await cacheRef.get();
        if (cachedDoc.exists) {
            const cachedData = cachedDoc.data();
            const cacheAge = (new Date().getTime() - cachedData.retrievedAt.toDate().getTime()) / (1000 * 60 * 60); // hours
            if (cacheAge < 24) { // 24 घंटे का कैश
                console.log("Serving from Firebase Cache:", cacheKey);
                return cachedData.data;
            }
        }
    } catch (e) {
        console.error("Error reading from Firebase cache:", e);
    }
    
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
        
        // Firebase में API परिणामों को कैश करें
        const cacheData = {
            data: data,
            retrievedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        cacheRef.set(cacheData).catch(err => console.error("Error caching YouTube data to Firebase:", err));

        // स्थानीय कैश को भी अपडेट करें
        if (data.items) {
             data.items.forEach(item => {
                const videoId = item.id?.videoId || item.id?.resourceId?.videoId || item.id;
                if(videoId && item.snippet) {
                    currentVideoCache.set(videoId, item); 
                }
            });
        }

        return data;
    } catch (error) {
        console.error(`Critical Error Fetching from YouTube API (${type}):`, error);
        return { error: error.message, items: [], nextPageToken: null };
    }
}

function renderYouTubeLongVideos(videos, append = false) {
    const grid = document.getElementById('long-video-grid');
    const loadMoreBtn = document.getElementById('long-video-load-more-btn');

    if (!grid) return;
    if (!append) grid.innerHTML = '';
    if (videos.length === 0 && !append) {
        grid.innerHTML = '<p class="static-message">No videos found. Try a different search or category.</p>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    videos.forEach((video) => {
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
        type: 'video'
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
    
    if (loadMoreBtn) {
        loadMoreBtn.style.display = appState.youtubeNextPageTokens.long ? 'block' : 'none';
    }
}

async function playYouTubeVideoFromCard(videoId) {
    let video = currentVideoCache.get(videoId);
    if (!video) {
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
    
    navigateTo('creator-page-screen', { 
        creatorId: channelId, 
        startWith: 'play',
        videoId: videoId
    });
}
// =============================================================================
// ★★★ YOUTUBE API INTEGRATION - END ★★★
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
const videoSwiper = document.getElementById('video-swiper');
const homeStaticMessageContainer = document.getElementById('home-static-message-container');
const saveContinueBtn = document.getElementById('save-continue-btn');

const categories = [ "Trending", "Music", "Gaming", "Movies", "News", "Live", "Sports", "Learning", "Fashion & Beauty", "Comedy", "Entertainment", "Technology", "Cooking", "Travel", "Vlogs", "Podcasts", "Dance", "Animation", "Automotive", "Pets & Animals", "Science", "History", "Documentary", "DIY", "Health & Fitness", "Finance", "Real Estate", "Astrology", "Spirituality", "Motivation", "Bhakti", "Bollywood News", "Tollywood", "Kollywood", "Sandalwood", "Art & Craft", "Booktubers" ];
const diverseTopics = [ "latest movie trailers", "viral internet moments", "new tech gadgets 2025", "stand up comedy india", "amazing science experiments", "top music hits 2025", "travel vlogs Europe", "indian street food tour", "DIY home decor low cost", "cricket highlights today", "BGMI gameplay", "political debate india", "easy dinner recipes", "stock market analysis", "yoga for beginners", "hindi web series review", "celebrity interviews", "unboxing new phone", "ghost stories in hindi", "motivational speech sandeep maheshwari" ];

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
        document.getElementById('creator-page-content').innerHTML = '';
        document.getElementById('app-container').classList.remove('fullscreen-active');
    }
    activePlayerId = null;
    
    appState.currentScreenPayload = payload;
    activateScreen(nextScreenId);

    // स्क्रीन-विशिष्ट इनिशियलाइज़ेशन
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
    if (nextScreenId === 'rewards-screen') {
        initializeRewardsScreen();
    }
    if (nextScreenId === 'wallet-screen') {
        initializeWalletScreen();
    }

    const deprecatedScreens = ['earnsure-screen', 'payment-screen', 'track-payment-screen', 'advertisement-screen', 'report-screen', 'credit-screen', 'your-zone-screen', 'upload-screen'];
    if (deprecatedScreens.includes(nextScreenId)) {
        const screen = document.getElementById(nextScreenId);
        if (screen) screen.innerHTML = `<div class="screen-header"><div class="header-icon-left haptic-trigger" onclick="navigateBack()"><i class="fas fa-arrow-left"></i></div><span class="header-title">Feature Removed</span></div><p class="static-message" style="margin-top: 80px;">This feature is no longer available.</p>`;
    }
}

function navigateBack() {
    if (appState.currentScreen === 'creator-page-screen' && appState.creatorPage.currentView === 'player') {
        if (appState.creatorPagePlayers.long) {
            appState.creatorPagePlayers.long.destroy();
            appState.creatorPagePlayers.long = null;
        }
        document.getElementById('app-container').classList.remove('fullscreen-active');
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
        userData.walletBalance = userData.walletBalance || 0;
        
        appState.currentUser = { ...appState.currentUser, ...userData };

        const savedHistory = localStorage.getItem('shubhzoneViewingHistory');
        if (savedHistory) appState.viewingHistory = JSON.parse(savedHistory);
        
        updateProfileUI();
        
        if (userData.name && userData.state) {
            await startAppLogic();
        } else {
            navigateTo('information-screen');
        }

    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');

        const initialData = {
            uid: user.uid, name: '', email: user.email || '',
            avatar: user.photoURL || 'https://via.placeholder.com/120/222/FFFFFF?text=+',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            likedVideos: [], friends: [],
            walletBalance: 0,
            referredBy: refCode || null,
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

    // प्रोफ़ाइल आइकन को बॉटम नेविगेशन से छिपाएं
    document.querySelectorAll('.nav-item[data-nav="profile"]').forEach(item => {
        item.style.display = 'none';
    });
    // फ्रेंड्स टैब से "My Channels" को हटा दें
    const myChannelsTab = document.querySelector('.tab-button[data-tab="my-channels"]');
    if(myChannelsTab) myChannelsTab.style.display = 'none';
    
    // डिफ़ॉल्ट रूप से 'Add Friends' टैब को सक्रिय करें
    const addFriendsTab = document.querySelector('.tab-button[data-tab="add"]');
    if(addFriendsTab) addFriendsTab.click();


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
        saveContinueBtn.disabled = false; saveContinueBtn.textContent = 'Continue'; return;
    }

    const userData = { name, mobile: document.getElementById('info-mobile').value.trim(), email: document.getElementById('info-email').value.trim(), address: document.getElementById('info-address').value.trim(), hobby: document.getElementById('info-hobby').value.trim(), state: state, country: document.getElementById('info-country').value === 'custom' ? document.getElementById('custom-country-input').value.trim() : document.getElementById('info-country').value };

    const file = profileImageInput.files[0];
    if (file) {
        const cloudName = 'dzq7qb6ew'; const uploadPreset = 'bookswamp_unsigned'; const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`; const formData = new FormData(); formData.append('file', file); formData.append('upload_preset', uploadPreset);
        try {
            const response = await fetch(url, { method: 'POST', body: formData }); const data = await response.json();
            if (data.secure_url) userData.avatar = data.secure_url; else throw new Error('Image upload failed, no secure_url returned.');
        } catch (error) {
            console.error("Cloudinary avatar upload error:", error); alert("Failed to upload profile picture."); saveContinueBtn.disabled = false; saveContinueBtn.textContent = 'Continue'; return;
        }
    }

    try {
        const userRef = db.collection('users').doc(appState.currentUser.uid);
        await userRef.set(userData, { merge: true });

        const userDoc = await userRef.get();
        const existingData = userDoc.data();
        if (!existingData.referralCode) {
            await generateAndSaveReferralCode(appState.currentUser.uid, name);
        }

        // रेफरल को क्रेडिट दें
        if (existingData.referredBy && !existingData.referralCreditGiven) {
            await creditReferrer(existingData.referredBy, appState.currentUser.uid);
            await userRef.update({ referralCreditGiven: true });
        }

        const refreshedUserData = (await userRef.get()).data();
        appState.currentUser = { ...appState.currentUser, ...refreshedUserData };
        updateProfileUI();
        await startAppLogic();
    } catch (error) {
        console.error("Profile save error:", error); alert("Failed to save profile."); saveContinueBtn.disabled = false; saveContinueBtn.textContent = 'Continue';
    }
}

async function creditReferrer(referrerCode, newUserId) {
    try {
        const querySnapshot = await db.collection('users').where('referralCode', '==', referrerCode).limit(1).get();
        if (!querySnapshot.empty) {
            const referrerDoc = querySnapshot.docs[0];
            const referrerRef = referrerDoc.ref;
            
            // 10% chance for 10 RS, otherwise 1 or 2 RS
            const rewardAmount = Math.random() < 0.1 ? 10 : (Math.random() < 0.5 ? 1 : 2);
            
            await referrerRef.update({
                walletBalance: firebase.firestore.FieldValue.increment(rewardAmount)
            });
            console.log(`Credited ${rewardAmount} to referrer ${referrerDoc.id} for new user ${newUserId}`);
        } else {
            console.warn(`Referrer with code ${referrerCode} not found.`);
        }
    } catch (error) {
        console.error("Error crediting referrer:", error);
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
    if (appStartLogicHasRun && appState.currentScreen !== 'splash-screen' && appState.currentScreen !== 'information-screen') return;
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
    if (homeStaticMessageContainer) homeStaticMessageContainer.style.display = 'none';

    const fragment = document.createDocumentFragment();
    videos.forEach((video) => {
        if (video.id.kind !== 'youtube#video') return;
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
        
        // वीडियो मेटा ओवरले से सभी एक्शन बटन हटा दिए गए
        slide.innerHTML = `
            <div class="video-preloader" style="background-image: url('${thumbnailUrl}');"><div class="loader"></div></div>
            ${playerHtml}
            <div class="video-meta-overlay">
                <div class="uploader-info" onclick="${creatorProfileOnClick}">
                    <img src="${uploaderAvatar}" class="uploader-avatar">
                    <span class="uploader-name">${escapeHTML(uploaderName)}</span>
                </div>
                <p class="video-title">${escapeHTML(title)}</p>
            </div>`;
        fragment.appendChild(slide);
        videoObserver.observe(slide);
    });
    videoSwiper.appendChild(fragment);

    // विज्ञापन स्लाइड जोड़ें
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

function onYouTubeIframeAPIReady() { isYouTubeApiReady = true; }

function onPlayerReady(event) {
    const iframe = event.target.getIframe();
    const slide = iframe.closest('.video-slide');
    if (slide) {
        const preloader = slide.querySelector('.video-preloader');
        if (preloader) preloader.style.display = 'none';
    }
    if (userHasInteracted) event.target.unMute();
}

function onPlayerStateChange(event) {
    const iframe = event.target.getIframe();
    if (!iframe) return;
    if (iframe.id === 'creator-page-player-long') handleCreatorPlayerStateChange(event);
}

function addVideoToHistory(videoData, type = 'short') {
    if (!videoData || !videoData.id) return;
    const videoId = videoData.id.videoId || videoData.id;

    const historyItem = { id: videoId, watchedAt: new Date().toISOString(), title: videoData.snippet.title, channelTitle: videoData.snippet.channelTitle, channelId: videoData.snippet.channelId, thumbnailUrl: videoData.snippet.thumbnails.medium.url, videoLengthType: type };

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
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) player.pauseVideo();
    else player.playVideo();
}

function playActivePlayer(videoId) {
    if (!videoId) return;
    if (activePlayerId && activePlayerId !== videoId) pauseActivePlayer();
    
    activePlayerId = videoId;
    const videoData = currentVideoCache.get(videoId);
    if(videoData) addVideoToHistory(videoData, 'short');
    
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
        if(players[videoId] && typeof players[videoId].playVideo === 'function') playActivePlayer(videoId);
        return;
    }
    const playerId = `player-${videoId}`;
    const playerElement = document.getElementById(playerId);
    if (!playerElement || playerElement.tagName === 'IFRAME') return;

    players[videoId] = new YT.Player(playerId, { height: '100%', width: '100%', videoId: videoId, playerVars: { 'autoplay': 0, 'controls': 0, 'mute': userHasInteracted ? 0 : 1, 'rel': 0, 'showinfo': 0, 'modestbranding': 1, 'loop': 1, 'playlist': videoId, 'fs': 0, 'iv_load_policy': 3, 'origin': window.location.origin }, events: { 'onReady': (event) => { onPlayerReady(event); if (slide.getBoundingClientRect().top >= 0 && slide.getBoundingClientRect().bottom <= window.innerHeight) { playActivePlayer(videoId); } }, 'onStateChange': onPlayerStateChange } });
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
            
            if (entry.isIntersecting) playActivePlayer(videoId);
            else if (videoId === activePlayerId) { pauseActivePlayer(); activePlayerId = null; }
        }
    }, options);
}

function logoutUser() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.clear();
        auth.signOut().then(() => window.location.reload()).catch(error => { console.error("Logout failed:", error); alert("Logout failed."); });
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
            chip.textContent = category; chip.dataset.category = category;
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
        videoSwiper.innerHTML = ''; videoSwiper.appendChild(homeStaticMessageContainer);
        homeStaticMessageContainer.style.display = 'flex';
        homeStaticMessageContainer.querySelector('.static-message').innerHTML = '<div class="loader"></div> Loading shorts...';
    }
    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short', type: 'video' });
    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    renderVideoSwiper(data.items || [], false);
}

async function loadMoreShorts() {
    const activeCategoryChip = document.querySelector('#category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.dataset.category : 'All';
    const query = category.toLowerCase() === 'trending' ? 'trending shorts india' : (category.toLowerCase() === 'all' ? getRandomTopic() + ' shorts' : `${category} shorts`);
    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short', pageToken: appState.youtubeNextPageTokens.shorts, type: 'video' });
    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    if(data.items) renderVideoSwiper(data.items, true);
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
        loadMoreBtn.style.margin = '20px auto';
        loadMoreBtn.style.display = 'none';
        loadMoreBtn.onclick = loadMoreLongVideos;
        gridContainer.appendChild(loadMoreBtn);
    }
}

async function populateLongVideoGrid(category = 'All') {
    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    let query = category.toLowerCase() === 'trending' ? 'trending videos' : (category.toLowerCase() === 'all' ? getRandomTopic() : category); 
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
            return `<div class="carousel-card haptic-trigger" style="background-image: url('${escapeHTML(thumbnailUrl)}')" onclick="playYouTubeVideoFromCard('${videoId}')"></div>`;
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
    
    const youtubeId = extractYouTubeId(query);
    if (youtubeId) {
        playYouTubeVideoFromCard(youtubeId);
        return;
    }
    
    document.querySelectorAll('#long-video-category-scroller .category-chip').forEach(chip => chip.classList.remove('active'));

    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
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
    
    // add-channel-btn-long-grid हटा दिया गया
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
        <div class="history-short-card haptic-trigger" style="background-image: url(${escapeHTML(video.thumbnailUrl)})" onclick="navigateTo('creator-page-screen', { creatorId: '${video.channelId}', startWith: 'home' })">
            <div class="history-item-menu" onclick="event.stopPropagation(); deleteFromHistory('${video.id}')"><i class="fas fa-trash-alt"></i></div>
        </div>`).join('');
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
            <div class="history-item-menu haptic-trigger" onclick="deleteFromHistory('${video.id}')"><i class="fas fa-trash-alt"></i></div>
        </div>`).join('');
}

function clearAllHistory() { if (confirm("Are you sure you want to clear your entire watch history? This cannot be undone.")) { appState.viewingHistory = []; localStorage.removeItem('shubhzoneViewingHistory'); initializeHistoryScreen(); } }
function deleteFromHistory(videoId) { if (confirm(`Remove this video from your history?`)) { appState.viewingHistory = appState.viewingHistory.filter(item => item.id !== videoId); localStorage.setItem('shubhzoneViewingHistory', JSON.stringify(appState.viewingHistory)); initializeHistoryScreen(); } }

// Friends Screen Logic (My Channels removed)
async function populateAddFriendsList(featuredUser = null) { /* ... no change ... */ }
async function searchUser() { /* ... no change ... */ }
async function sendFriendRequest(receiverId, buttonElement) { /* ... no change ... */ }
async function populateFriendRequestsList() { /* ... no change ... */ }
async function acceptFriendRequest(event, requestId, senderId) { /* ... no change ... */ }
async function rejectFriendRequest(event, requestId) { /* ... no change ... */ }
async function populateMembersList() { /* ... no change ... */ }
async function startChat(friendId, friendName, friendAvatar) { /* ... no change ... */ }
async function sendMessage() { /* ... no change ... */ }
function loadChatMessages(chatId) { /* ... no change ... */ }

// =======================================================
// ★★★ CREATOR PAGE LOGIC (REWORKED & FIXED) - START ★★★
// =======================================================
async function initializeCreatorPage(payload) {
    const { creatorId, startWith = 'home', videoId } = payload;
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

    creatorPageTabsContainer.innerHTML = `<button class="creator-page-tab-btn haptic-trigger" data-type="home">Home</button><button class="creator-page-tab-btn haptic-trigger" data-type="videos">Videos</button><button class="creator-page-tab-btn haptic-trigger" data-type="shorts">Shorts</button><button class="creator-page-tab-btn haptic-trigger" data-type="playlists">Playlists</button>`;
    creatorPageTabsContainer.querySelectorAll('.creator-page-tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
             creatorPageTabsContainer.querySelectorAll('.creator-page-tab-btn').forEach(t => t.classList.remove('active'));
             tab.classList.add('active');
             loadCreatorPageContent({ ...payload, startWith: tab.dataset.type, videoId: null });
        });
    });
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
            data = await fetchFromYouTubeAPI('search', { channelId: creatorId, order: 'date', videoDuration: 'long', type: 'video' });
            renderCreatorVideoList(contentArea, data.items || [], 'long'); break;
        case 'shorts':
            data = await fetchFromYouTubeAPI('search', { channelId: creatorId, videoDuration: 'short', order: 'date', type: 'video' });
            renderCreatorVideoList(contentArea, data.items || [], 'short'); break;
        case 'playlists':
             data = await fetchFromYouTubeAPI('playlists', { channelId: creatorId });
             renderCreatorPlaylistList(contentArea, data.items || [], payload); break;
        case 'playlistItems':
             data = await fetchFromYouTubeAPI('playlistItems', { playlistId: playlistId });
             renderCreatorVideoList(contentArea, data.items || [], 'long'); break;
    }
}

function renderCreatorVideoList(container, videos, type) { /* ... no change ... */ }
function renderCreatorPlaylistList(container, playlists, payload) { /* ... no change ... */ }

function showCreatorPlayerView(videoId) {
    appState.creatorPage.currentView = 'player';
    const creatorPageScreen = document.getElementById('creator-page-screen');
    const contentArea = document.getElementById('creator-page-content');
    
    creatorPageScreen.querySelector('.screen-header').style.display = 'none';
    creatorPageScreen.querySelector('#creator-page-tabs').style.display = 'none';
    contentArea.classList.add('player-active');

    // बैक बटन को प्लेयर कंटेनर में जोड़ा गया
    contentArea.innerHTML = `
        <div id="creator-page-player-container">
            <div class="player-back-button haptic-trigger" onclick="navigateBack()"><i class="fas fa-arrow-left"></i></div>
            <div class="player-wrapper">
                <div id="creator-page-player-long"></div>
            </div>
            <button id="player-rotate-btn" class="haptic-trigger"><i class="fas fa-sync-alt"></i> Rotate</button>
        </div>
    `;
    
    initializeCreatorPagePlayer(videoId, 'creator-page-player-long', 'long');
    document.getElementById('player-rotate-btn').addEventListener('click', () => {
        document.getElementById('app-container').classList.toggle('fullscreen-active');
    });
}

function initializeCreatorPagePlayer(videoId, containerId, type) {
    if (appState.creatorPagePlayers[type]) appState.creatorPagePlayers[type].destroy();
    if (!document.getElementById(containerId) || !isYouTubeApiReady) return;

    appState.creatorPagePlayers[type] = new YT.Player(containerId, { height: '100%', width: '100%', videoId: videoId, playerVars: { 'autoplay': 1, 'controls': 1, 'rel': 0, 'showinfo': 0, 'mute': 0, 'modestbranding': 1, 'fs': 0, 'origin': window.location.origin, 'iv_load_policy': 3 }, events: { 'onReady': (event) => { event.target.playVideo(); event.target.unMute(); const videoData = currentVideoCache.get(videoId); if (videoData) addVideoToHistory(videoData, 'long'); }, 'onStateChange': handleCreatorPlayerStateChange } });
}
function handleCreatorPlayerStateChange(event) { /* ... no change ... */ }
// =======================================================
// ★★★ CREATOR PAGE LOGIC - END ★★★
// =======================================================

// =======================================================
// ★★★ REWARDS & WALLET LOGIC - START ★★★
// =======================================================

function initializeRewardsScreen() {
    const screen = document.getElementById('rewards-screen');
    if (!screen) return;
    screen.innerHTML = `
        <div class="rewards-top-bar">
            <span class="header-title">Reward</span>
            <div id="rewards-timer-container">00:00</div>
        </div>
        <div id="rewards-content-area" class="content-area">
            <!-- Content will be injected here -->
        </div>
        <div id="wallet-button-container">
            <button class="wallet-btn haptic-trigger" onclick="navigateTo('wallet-screen')">
                <i class="fas fa-wallet"></i> My Wallet
            </button>
        </div>
    `;
    startRewardCycle();
}

function startRewardCycle() {
    if (appState.rewards.mainTimer) clearInterval(appState.rewards.mainTimer);

    const contentArea = document.getElementById('rewards-content-area');
    const timerDisplay = document.getElementById('rewards-timer-container');
    let rewardState = JSON.parse(localStorage.getItem('shubhzoneRewardState')) || {};

    // यदि कोई अनक्लेम्ड रिवॉर्ड है, तो उसे दिखाएं
    if (rewardState.unclaimedReward) {
        renderScratchCard(rewardState.unclaimedReward.amount, rewardState.unclaimedReward.isTryAgain);
        return;
    }

    let endTime = rewardState.nextRewardTime ? new Date(rewardState.nextRewardTime).getTime() : 0;
    
    // यदि कोई टाइमर नहीं चल रहा है, तो एक नया शुरू करें
    if (!endTime || new Date().getTime() > endTime) {
        const isNewUser = !rewardState.lastRewardClaimedTime;
        const duration = isNewUser ? 60 * 1000 : 60 * 60 * 1000; // 60 sec for new, 60 min for old
        endTime = new Date().getTime() + duration;
        rewardState.nextRewardTime = new Date(endTime).toISOString();
        localStorage.setItem('shubhzoneRewardState', JSON.stringify(rewardState));
    }
    
    contentArea.innerHTML = `<p class="static-message">आपको नया इनाम कुछ समय बाद मिलेगा।<br><br>You will get a new reward after some time.</p>`;

    appState.rewards.mainTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            clearInterval(appState.rewards.mainTimer);
            timerDisplay.textContent = "Claim Reward!";
            generateAndShowReward();
            return;
        }

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function generateAndShowReward() {
    let rewardState = JSON.parse(localStorage.getItem('shubhzoneRewardState')) || {};
    const isTryAgain = Math.random() < 0.2; // 20% chance for "Try Again"
    const amount = isTryAgain ? 0 : Math.floor(Math.random() * 10) + 1; // 1 to 10
    
    rewardState.unclaimedReward = { amount, isTryAgain };
    localStorage.setItem('shubhzoneRewardState', JSON.stringify(rewardState));
    
    renderScratchCard(amount, isTryAgain);
}

function renderScratchCard(amount, isTryAgain) {
    const contentArea = document.getElementById('rewards-content-area');
    contentArea.innerHTML = `
        <div class="scratch-card-container">
            <div class="scratch-card" onclick="revealReward(this, ${amount}, ${isTryAgain})">
                <div class="scratch-card-cover">
                    <span>Scratch Here</span>
                </div>
                <div class="scratch-card-reward">
                    ${isTryAgain ? 'Try Again!' : `You Won<br>₹${amount}`}
                </div>
            </div>
        </div>
    `;
}

function revealReward(cardElement, amount, isTryAgain) {
    cardElement.classList.add('revealed');
    
    if (isTryAgain) {
        resetRewardCycle();
        return;
    }
    
    const contentArea = document.getElementById('rewards-content-area');
    contentArea.innerHTML += `
        <div class="reward-claim-info">
            <p class="multi-lang-p">इस ऑफर को पाने के लिए, अपने किसी दोस्त को 24 मिनट के अंदर इनवाइट करें।<br>To claim this offer, invite a friend within 24 minutes.</p>
            <div id="offer-expiry-timer">24:00</div>
            <div class="referral-link-container">
                <input type="text" value="https://shubhzone.onrender.com?ref=${appState.currentUser.referralCode}" readonly>
                <button class="haptic-trigger" onclick="copyToClipboard('https://shubhzone.onrender.com?ref=${appState.currentUser.referralCode}', event)"><i class="fas fa-copy"></i> Copy</button>
            </div>
            <p class="multi-lang-p small">यदि आप ऐसा नहीं करते हैं तो यह ऑफर समाप्त हो जाएगा।<br>This offer will expire if you fail to do so.</p>
        </div>
    `;
    startOfferExpiryTimer();
}

function startOfferExpiryTimer() {
    if(appState.rewards.offerExpiryTimer) clearInterval(appState.rewards.offerExpiryTimer);
    const timerDisplay = document.getElementById('offer-expiry-timer');
    let duration = 24 * 60; // 24 minutes in seconds

    appState.rewards.offerExpiryTimer = setInterval(() => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (--duration < 0) {
            clearInterval(appState.rewards.offerExpiryTimer);
            alert("Your reward offer has expired.");
            resetRewardCycle();
        }
    }, 1000);
}

function resetRewardCycle() {
    let rewardState = {
        lastRewardClaimedTime: new Date().toISOString()
    };
    localStorage.setItem('shubhzoneRewardState', JSON.stringify(rewardState));
    startRewardCycle();
}

function initializeWalletScreen() {
    const screen = document.getElementById('wallet-screen');
    if(!screen) return;
    
    const balance = appState.currentUser.walletBalance || 0;
    
    screen.innerHTML = `
        <div class="screen-header">
             <div class="header-icon-left haptic-trigger" onclick="navigateBack()"><i class="fas fa-arrow-left"></i></div>
            <span class="header-title">My Wallet</span>
        </div>
        <div class="wallet-content">
            <div class="balance-card">
                <span>Current Balance</span>
                <h2>₹ ${balance.toFixed(2)}</h2>
            </div>
            <div class="withdrawal-form">
                <h3>Withdraw Funds</h3>
                <p>Minimum withdrawal amount: ₹50.00</p>
                <div class="input-group">
                    <label for="upi-id">UPI ID</label>
                    <input type="text" id="upi-id" placeholder="yourname@upi">
                </div>
                <div class="input-group">
                    <label for="mobile-no">Mobile Number</label>
                    <input type="tel" id="mobile-no" placeholder="Enter your mobile number">
                </div>
                <button id="withdraw-btn" class="continue-btn haptic-trigger" ${balance < 50 ? 'disabled' : ''}>
                    Withdraw
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('withdraw-btn').addEventListener('click', handleWithdrawal);
}

function handleWithdrawal() {
    const upiId = document.getElementById('upi-id').value.trim();
    const mobileNo = document.getElementById('mobile-no').value.trim();
    const balance = appState.currentUser.walletBalance || 0;

    if (!upiId || !mobileNo) {
        alert("Please fill in both UPI ID and Mobile Number.");
        return;
    }
    if (balance < 50) {
        alert("You do not have enough balance to withdraw.");
        return;
    }

    const message = `Withdrawal Request:\nAmount: ₹${balance.toFixed(2)}\nUPI ID: ${upiId}\nMobile No: ${mobileNo}\nUser ID: ${appState.currentUser.uid}`;
    const whatsappUrl = `https://wa.me/917390928912?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}
// =======================================================
// ★★★ REWARDS & WALLET LOGIC - END ★★★
// =======================================================


// Haptic feedback and image enlarge logic (no change)
function provideHapticFeedback() { if (hapticFeedbackEnabled && navigator.vibrate) navigator.vibrate(50); }
function loadHapticPreference() { hapticFeedbackEnabled = (localStorage.getItem('hapticFeedbackEnabled') !== 'false'); }
function showEnlargedImage(imageUrl) { /* ... no change ... */ }


document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.add('haptic-trigger');
        item.addEventListener('click', () => {
            const targetNav = item.getAttribute('data-nav');
            if(item.style.display === 'none') return;
            
            let targetScreen;
            switch(targetNav) {
                case 'shorts': targetScreen = 'home-screen'; break;
                case 'long-video': targetScreen = 'long-video-screen'; break;
                case 'friends': targetScreen = 'friends-screen'; break;
                case 'rewards': targetScreen = 'rewards-screen'; break;
                default: targetScreen = `${targetNav}-screen`;
            }
            navigateTo(targetScreen);
            updateNavActiveState(targetNav);
        });
    });

    document.querySelector('#creator-page-screen .header-icon-left')?.addEventListener('click', () => navigateBack());

    initializeApp();

    document.getElementById('get-started-btn')?.addEventListener('click', () => { userHasInteracted = true; startAppLogic(); });
    appContainer.addEventListener('click', (event) => { if (!userHasInteracted) { userHasInteracted = true; Object.values(players).forEach(p => p && typeof p.unMute === 'function' && p.unMute()); if(appState.creatorPagePlayers.long && typeof appState.creatorPagePlayers.long.unMute === 'function') { appState.creatorPagePlayers.long.unMute(); } } if (event.target.closest('.haptic-trigger')) provideHapticFeedback(); });

    initializeMessagingInterface();
    document.getElementById('add-friend-search-btn')?.addEventListener('click', searchUser);
    document.getElementById('add-friend-search-input')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchUser(); });

    const openSidebar = () => { document.getElementById('main-sidebar').classList.add('open'); document.getElementById('sidebar-overlay').classList.add('open'); };
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

    document.getElementById('close-sidebar-btn')?.addEventListener('click', () => { document.getElementById('main-sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.remove('open'); });
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => { document.getElementById('main-sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.remove('open'); });
    
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
    inputField?.addEventListener('input', () => { inputField.value.trim().length > 0 ? sendButton.classList.add('active') : sendButton.classList.remove('active'); });
}

function toggleProfileVideoView(view) {
    const showShortsBtn = document.getElementById('profile-show-shorts-btn');
    const showLongsBtn = document.getElementById('profile-show-longs-btn');
    const shortGrid = document.getElementById('user-short-video-grid');
    const longGrid = document.getElementById('user-long-video-grid');
    if (!showShortsBtn || !showLongsBtn || !shortGrid || !longGrid) return;
    if (view === 'short') {
        showShortsBtn.classList.add('active'); showLongsBtn.classList.remove('active');
        shortGrid.style.display = 'grid'; longGrid.style.display = 'none';
    } else {
        showShortsBtn.classList.remove('active'); showLongsBtn.classList.add('active');
        shortGrid.style.display = 'none'; longGrid.style.display = 'grid';
    }
}
