/* ================================================= */
/* === Shubhzone App Script (Code 2) - FINAL v5.17 === */
/* === MODIFIED AS PER USER REQUEST - AUG 2025    === */
/* === SOLVED: API Calls, Player, Load More & Channel Page Logic Fixed === */
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
// ★★★ ADVERTISEMENT LOGIC (UNCHANGED FROM PREVIOUS VERSION) - START ★★★
// =======================================================================
function injectBannerAd(container) {
    if (!container) {
        console.warn("[AD] Ad container not found.");
        return;
    }
    container.innerHTML = '';
    container.style.display = 'none';

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
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.text = `(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('gizokraijaw.net',9583482,document.createElement('script'))`;
        container.appendChild(adScript);
    } else {
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
    if (document.querySelector('script[src*="9b9bd0548874dd7f16f6f50929864be9"]')) return;
    const socialScript = document.createElement('script');
    socialScript.type = 'text/javascript';
    socialScript.src = '//decreaselackadmit.com/9b/9b/d0/9b9bd0548874dd7f16f6f50929864be9.js';
    document.body.appendChild(socialScript);
}

function triggerFullScreenAd() {
    const isAnyModalActive = document.querySelector('.modal-overlay.active, .comments-modal-overlay.active, #chat-screen-overlay.active');
    if (isAnyModalActive) return;

    const { sequence, currentIndex } = appState.adState.fullscreenAd;
    const adType = sequence[currentIndex];

    switch (adType) {
        case 'monetag_interstitial':
            const monetagInterstitial = document.createElement('script');
            monetagInterstitial.text = `(function(d,z,s){s.src='https://'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('groleegni.net',9572500,document.createElement('script'))`;
            document.body.appendChild(monetagInterstitial);
            break;
        case 'monetag_directlink':
            window.open('https://otieu.com/4/9578561', '_blank');
            break;
        case 'adsterra_popunder':
            const adsterraPopunder = document.createElement('script');
            adsterraPopunder.type = 'text/javascript';
            adsterraPopunder.src = '//decreaselackadmit.com/7d/0c/a8/7d0ca84cbcf7b35539ae2feb7dc2bd2e.js';
            document.body.appendChild(adsterraPopunder);
            break;
        case 'monetag_popunder':
            const monetagPopunderScript = document.createElement('script');
            monetagPopunderScript.text = `(s=>{s.dataset.zone='9578563',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
            document.body.appendChild(monetagPopunderScript);
            break;
    }
    appState.adState.fullscreenAd.currentIndex = (currentIndex + 1) % sequence.length;
}

function setupAdTimers() {
    if (appState.adState.timers.fullscreenAdLoop) clearInterval(appState.adState.timers.fullscreenAdLoop);
    injectSocialBarAd();
    appState.adState.timers.fullscreenAdLoop = setInterval(triggerFullScreenAd, 60000);
}
// =======================================================================
// ★★★ ADVERTISEMENT LOGIC (UNCHANGED FROM PREVIOUS VERSION) - END ★★★
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
                setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i>'; }, 1500);
            }
        }).catch(err => fallbackCopyToClipboard(text, event));
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
            setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i>'; }, 1500);
        }
    } catch (err) {
        console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
}

function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function extractYouTubeId(url) {
    if (!url) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
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
        uid: null, avatar: "https://via.placeholder.com/120/222/FFFFFF?text=+",
        name: "", friends: [], addedChannels: [],
    },
    currentScreen: 'splash-screen',
    navigationStack: ['splash-screen'],
    currentScreenPayload: null,
    viewingHistory: [],
    youtubeNextPageTokens: {
        long: null, shorts: null, search: null, trending: null,
        channelVideos: null, channelShorts: null, channelPlaylists: null,
    },
    activeComments: { videoId: null, channelId: null },
    creatorPagePlayers: { short: null, long: null },
    adState: {
        timers: { fullscreenAdLoop: null },
        fullscreenAd: { 
            sequence: ['monetag_interstitial', 'monetag_directlink', 'monetag_interstitial', 'adsterra_popunder', 'monetag_directlink', 'monetag_popunder'], 
            currentIndex: 0 
        },
    },
};

let isYouTubeApiReady = false;
let players = {};
let videoObserver;
let activePlayerId = null;
let userHasInteracted = false;

// =============================================================================
// ★★★ YOUTUBE API INTEGRATION (ROBUST VERSION) - START ★★★
// =============================================================================
let currentVideoCache = new Map();

async function fetchFromYouTubeAPI(type, params) {
    let url = `/api/youtube?type=${type}`;
    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
            url += `&${key}=${encodeURIComponent(params[key])}`;
        }
    }

    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) }); // 15-second timeout
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.items) {
            data.items.forEach(item => {
                const videoId = item.id?.videoId || item.id;
                if(videoId && item.snippet) {
                    // सुनिश्चित करें कि कैश में पूर्ण वस्तु है
                    const existingData = currentVideoCache.get(videoId);
                    currentVideoCache.set(videoId, { ...existingData, ...item });
                }
            });
        }
        return data;
    } catch (error) {
        console.error(`Error fetching from YouTube API (${type}):`, error.name === 'TimeoutError' ? 'Request Timed Out' : error.message);
        return { error: `Could not load data. ${error.name === 'TimeoutError' ? 'Server took too long to respond.' : 'Please check your connection.'}`, items: [], nextPageToken: null };
    }
}
// =============================================================================
// ★★★ YOUTUBE API INTEGRATION (ROBUST VERSION) - END ★★★
// =============================================================================

// DOM Elements
const appContainer = document.getElementById('app-container');
const videoSwiper = document.getElementById('video-swiper');
const homeStaticMessageContainer = document.getElementById('home-static-message-container');

const categories = ["Trending", "Entertainment", "Comedy", "Music", "Dance", "Education", "Travel", "Food", "DIY", "Sports", "Gaming", "News", "Lifestyle"];
const diverseTopics = ["latest movie trailers", "viral internet moments", "new tech gadgets", "stand up comedy", "amazing science experiments", "top music hits 2025", "travel vlogs Europe", "street food tour", "DIY home decor", "cricket highlights"];

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
    if (appState.currentScreen === nextScreenId && JSON.stringify(appState.currentScreenPayload) === JSON.stringify(payload)) return;

    if (appState.currentScreen === 'home-screen' && activePlayerId && players[activePlayerId]) pauseActivePlayer();
    
    // क्रिएटर पेज से बाहर निकलते समय प्लेयर को नष्ट करें
    if (appState.currentScreen === 'creator-page-screen') {
        if (appState.creatorPagePlayers.long) {
            appState.creatorPagePlayers.long.destroy();
            appState.creatorPagePlayers.long = null;
        }
        const videoWrapper = document.querySelector('#creator-page-long-view .main-video-card-wrapper.rotated');
        if (videoWrapper) {
            videoWrapper.classList.remove('rotated');
            appContainer.classList.remove('fullscreen-active');
            if (document.fullscreenElement) document.exitFullscreen();
        }
    }
    activePlayerId = null;
    
    if (appState.navigationStack[appState.navigationStack.length - 1] !== nextScreenId) {
        appState.navigationStack.push(nextScreenId);
    }
    
    appState.currentScreenPayload = payload;
    activateScreen(nextScreenId);

    const screenFunctionMap = {
        'profile-screen': renderUserProfileVideos,
        'long-video-screen': setupLongVideoScreen,
        'history-screen': initializeHistoryScreen,
        'home-screen': setupShortsScreen,
        'creator-page-screen': () => payload && payload.creatorId ? initializeCreatorPage(payload) : null,
        'friends-screen': () => {
            renderMyChannelsList();
            // अन्य मित्र टैब भी लोड करें
            populateAddFriendsList();
            populateFriendRequestsList();
            populateMembersList();
        }
    };

    if (screenFunctionMap[nextScreenId]) {
        screenFunctionMap[nextScreenId]();
    }
}

function navigateBack() {
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
        appState.currentUser = { ...appState.currentUser, ...doc.data() };
        appState.currentUser.addedChannels = JSON.parse(localStorage.getItem(`shubhzone_addedChannels_${user.uid}`) || '[]');
        appState.viewingHistory = JSON.parse(localStorage.getItem(`shubhzoneViewingHistory_${user.uid}`) || '[]');
        updateProfileUI();
        if (appState.currentUser.name && appState.currentUser.state) {
            await startAppLogic();
        } else {
            navigateTo('information-screen');
        }
    } else {
        const initialData = { uid: user.uid, name: '', email: user.email || '', avatar: user.photoURL || 'https://via.placeholder.com/120/222/FFFFFF?text=+', createdAt: firebase.firestore.FieldValue.serverTimestamp(), friends: [] };
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

    auth.onAuthStateChanged(user => {
        if (user) {
            checkUserProfileAndProceed(user);
        } else {
            auth.signInAnonymously().catch(error => console.error("Anonymous sign-in failed:", error));
        }
    });
    activateScreen('splash-screen');
}

let appStartLogicHasRun = false;
async function startAppLogic() {
    if (appStartLogicHasRun) return;
    appStartLogicHasRun = true;
    setupAdTimers();
    const getStartedBtn = document.getElementById('get-started-btn');
    const loadingContainer = document.getElementById('loading-container');
    if (getStartedBtn) getStartedBtn.style.display = 'none';
    if (loadingContainer) loadingContainer.style.display = 'flex';
    navigateTo('long-video-screen');
    updateNavActiveState('long-video');
}

function updateNavActiveState(activeNav) {
    document.querySelectorAll('.bottom-nav').forEach(navBar => {
        navBar.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        const currentItem = navBar.querySelector(`.nav-item[data-nav="${activeNav}"]`);
        if (currentItem) currentItem.classList.add('active');
    });
}

async function saveAndContinue() {
    const saveBtn = document.getElementById('save-continue-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    const userData = {
        name: document.getElementById('info-name').value.trim(),
        mobile: document.getElementById('info-mobile').value.trim(),
        email: document.getElementById('info-email').value.trim(),
        address: document.getElementById('info-address').value.trim(),
        hobby: document.getElementById('info-hobby').value.trim(),
        state: document.getElementById('info-state').value === 'custom' ? document.getElementById('custom-state-input').value.trim() : document.getElementById('info-state').value,
        country: document.getElementById('info-country').value === 'custom' ? document.getElementById('custom-country-input').value.trim() : document.getElementById('info-country').value
    };

    if (!userData.name || !userData.state) {
        alert('Please enter your name and select your state.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Continue';
        return;
    }

    try {
        await db.collection('users').doc(appState.currentUser.uid).set(userData, { merge: true });
        const refreshedUserData = (await db.collection('users').doc(appState.currentUser.uid).get()).data();
        appState.currentUser = { ...appState.currentUser, ...refreshedUserData };
        updateProfileUI();
        await startAppLogic();
    } catch (error) {
        alert("Failed to save profile.");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Continue';
    }
}

function updateProfileUI() {
    const { avatar, name, mobile, email, address, hobby, state, country } = appState.currentUser;
    document.getElementById('profile-header-avatar').src = avatar || "https://via.placeholder.com/50/222/FFFFFF?text=+";
    document.getElementById('profile-image-preview').src = avatar || "https://via.placeholder.com/120/222/FFFFFF?text=+";
    document.getElementById('info-name').value = name || '';
    document.getElementById('info-mobile').value = mobile || '';
    document.getElementById('info-email').value = email || '';
    document.getElementById('info-address').value = address || '';
    document.getElementById('info-hobby').value = hobby || '';
    document.getElementById('info-state').value = state || '';
    document.getElementById('info-country').value = country || 'India';
}

function onYouTubeIframeAPIReady() { isYouTubeApiReady = true; }

function onPlayerReady(event) {
    const iframe = event.target.getIframe();
    const slide = iframe.closest('.video-slide');
    if (slide) {
        const preloader = slide.querySelector('.video-preloader');
        if (preloader) preloader.style.display = 'none';
    }
}

function togglePlayPause(videoId) {
    const player = players[videoId];
    if (!player || typeof player.getPlayerState !== 'function') return;
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) player.pauseVideo();
    else {
        if(userHasInteracted) player.unMute();
        player.playVideo();
    }
}

function playActivePlayer(videoId) {
    if (!videoId) return;
    if (activePlayerId && activePlayerId !== videoId) pauseActivePlayer();
    
    activePlayerId = videoId;
    const videoData = currentVideoCache.get(videoId);
    if(videoData) addVideoToHistory(videoData);
    
    const player = players[videoId];
    if (player && typeof player.playVideo === 'function') {
        if (userHasInteracted) player.unMute();
        player.playVideo();
    } else {
        createPlayerForSlide(document.querySelector(`.video-slide[data-video-id="${videoId}"]`));
    }
}

function pauseActivePlayer() {
    if (!activePlayerId) return;
    const player = players[activePlayerId];
    if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
    }
}

function createPlayerForSlide(slide) {
    if (!slide || !isYouTubeApiReady) return;
    const videoId = slide.dataset.videoId;
    if (players[videoId]) {
        playActivePlayer(videoId);
        return;
    }

    const playerId = `player-${videoId}`;
    players[videoId] = new YT.Player(playerId, {
        height: '100%', width: '100%', videoId: videoId,
        playerVars: { 'autoplay': 0, 'controls': 0, 'mute': 1, 'rel': 0, 'loop': 1, 'playlist': videoId, 'fs': 0, 'iv_load_policy': 3 },
        events: {
            'onReady': (event) => {
                onPlayerReady(event);
                if (slide.getBoundingClientRect().top >= 0 && slide.getBoundingClientRect().bottom <= window.innerHeight) {
                    playActivePlayer(videoId);
                }
            }
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
            } else if (entry.isIntersecting && entry.target.dataset.videoId) {
                playActivePlayer(entry.target.dataset.videoId);
            } else if (entry.target.dataset.videoId === activePlayerId) {
                pauseActivePlayer();
                activePlayerId = null;
            }
        }
    }, options);
}

function addVideoToHistory(videoData) {
    if (!videoData || !videoData.id) return;
    const videoId = videoData.id.videoId || videoData.id;
    const historyItem = {
        id: videoId, watchedAt: new Date().toISOString(), title: videoData.snippet.title,
        channelTitle: videoData.snippet.channelTitle, channelId: videoData.snippet.channelId,
        thumbnailUrl: videoData.snippet.thumbnails.medium.url, videoLengthType: 'short'
    };
    appState.viewingHistory = [historyItem, ...appState.viewingHistory.filter(item => item.id !== videoId)].slice(0, 100);
    localStorage.setItem(`shubhzoneViewingHistory_${appState.currentUser.uid}`, JSON.stringify(appState.viewingHistory));
}

function addLongVideoToHistory(videoData) {
    if (!videoData || !videoData.id) return;
    const videoId = videoData.id.videoId || videoData.id;
    const historyItem = {
        id: videoId, watchedAt: new Date().toISOString(), title: videoData.snippet.title,
        channelTitle: videoData.snippet.channelTitle, channelId: videoData.snippet.channelId,
        thumbnailUrl: videoData.snippet.thumbnails.medium.url, videoLengthType: 'long'
    };
    appState.viewingHistory = [historyItem, ...appState.viewingHistory.filter(item => item.id !== videoId)].slice(0, 100);
    localStorage.setItem(`shubhzoneViewingHistory_${appState.currentUser.uid}`, JSON.stringify(appState.viewingHistory));
}

async function setupShortsScreen(category = 'All') {
    const query = category.toLowerCase() === 'trending' ? 'trending shorts india' : (category.toLowerCase() === 'all' ? getRandomTopic() + ' shorts' : `${category} shorts`);
    homeStaticMessageContainer.innerHTML = '<div class="loader"></div>';
    homeStaticMessageContainer.style.display = 'flex';
    videoSwiper.innerHTML = '';
    videoSwiper.appendChild(homeStaticMessageContainer);

    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short' });
    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    renderVideoSwiper(data.items, false);
}

async function loadMoreShorts() {
    const activeCategoryChip = document.querySelector('#category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.dataset.category : 'All';
    const query = category.toLowerCase() === 'trending' ? 'trending shorts india' : (category.toLowerCase() === 'all' ? getRandomTopic() + ' shorts' : `${category} shorts`);
    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short', pageToken: appState.youtubeNextPageTokens.shorts });
    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    if(data.items) renderVideoSwiper(data.items, true);
}

function renderVideoSwiper(videos, append = false) {
    if (!append) {
        videoSwiper.innerHTML = '';
        Object.values(players).forEach(p => p && p.destroy());
        players = {};
        if (videoObserver) videoObserver.disconnect();
        setupVideoObserver();
    }
    
    if (!videos || videos.length === 0) {
        if (!append) homeStaticMessageContainer.innerHTML = `<p class="static-message">${data.error || 'No shorts found for this category.'}</p>`;
        return;
    }
    homeStaticMessageContainer.style.display = 'none';

    const fragment = document.createDocumentFragment();
    videos.forEach(video => {
        const videoId = video.id?.videoId || video.id;
        if (!videoId) return;
        const slide = document.createElement('div');
        slide.className = 'video-slide';
        slide.dataset.videoId = videoId;
        slide.dataset.channelId = video.snippet.channelId;
        slide.addEventListener('click', (e) => { if (!e.target.closest('.video-actions-overlay, .video-meta-overlay')) togglePlayPause(videoId); });
        slide.innerHTML = `<div class="video-preloader" style="background-image: url('${video.snippet.thumbnails.high?.url}');"><div class="loader"></div></div> <div class="player-container" id="player-${videoId}"></div> <div class="video-meta-overlay"> <div class="uploader-info" onclick="navigateTo('creator-page-screen', { creatorId: '${video.snippet.channelId}', startWith: 'videos' })"><img src="https://via.placeholder.com/40" class="uploader-avatar"><span class="uploader-name">${escapeHTML(video.snippet.channelTitle)}</span></div> <p class="video-title">${escapeHTML(video.snippet.title)}</p> <button class="add-channel-btn haptic-trigger" onclick="addChannelToList(event, '${video.snippet.channelId}')"><i class="fas fa-plus"></i> Add</button> </div> <div class="video-actions-overlay"> <div class="action-icon-container" onclick="navigateTo('creator-page-screen', { creatorId: '${video.snippet.channelId}', startWith: 'videos' })"><i class="fas fa-user-circle icon"></i><span class="count">Creator</span></div> <div class="action-icon-container" onclick="alert('Comments can be viewed on YouTube.')"><i class="fas fa-comment-dots icon"></i><span class="count">...</span></div> </div>`;
        fragment.appendChild(slide);
        videoObserver.observe(slide);
    });
    videoSwiper.appendChild(fragment);

    const oldTrigger = document.getElementById('shorts-load-more-trigger');
    if (oldTrigger) oldTrigger.remove();
    if (appState.youtubeNextPageTokens.shorts) {
        const trigger = document.createElement('div');
        trigger.id = 'shorts-load-more-trigger';
        trigger.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
        videoSwiper.appendChild(trigger);
        videoObserver.observe(trigger);
    }
}

async function setupLongVideoScreen() {
    renderCategoriesInBar();
    await populateLongVideoGrid('Trending');
    await renderTrendingCarousel();
    const gridContainer = document.querySelector('.long-video-screen-content');
    if (!document.getElementById('long-video-load-more-btn')) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'long-video-load-more-btn';
        loadMoreBtn.className = 'continue-btn haptic-trigger';
        loadMoreBtn.textContent = 'Load More';
        loadMoreBtn.style.margin = '0 20px 20px';
        loadMoreBtn.style.display = 'none';
        loadMoreBtn.onclick = loadMoreLongVideos;
        gridContainer.appendChild(loadMoreBtn);
    }
}

function renderCategoriesInBar() {
    const scrollers = [document.getElementById('category-scroller'), document.getElementById('long-video-category-scroller')];
    scrollers.forEach(scroller => {
        if (!scroller) return;
        scroller.innerHTML = '';
        const allChip = document.createElement('div');
        allChip.className = 'category-chip active haptic-trigger';
        allChip.textContent = 'All';
        allChip.dataset.category = "All";
        allChip.onclick = () => filterVideosByCategory(scroller.id, 'All', allChip);
        scroller.appendChild(allChip);
        categories.forEach(category => {
            const chip = document.createElement('div');
            chip.className = 'category-chip haptic-trigger';
            chip.textContent = category;
            chip.dataset.category = category;
            chip.onclick = () => filterVideosByCategory(scroller.id, category, chip);
            scroller.appendChild(chip);
        });
    });
}

function filterVideosByCategory(scrollerId, category, element) {
    const scroller = document.getElementById(scrollerId);
    if (!scroller) return;
    scroller.querySelectorAll('.category-chip').forEach(chip => chip.classList.remove('active'));
    if (element) element.classList.add('active');
    
    if (scrollerId === 'category-scroller') {
        if (activePlayerId) pauseActivePlayer();
        activePlayerId = null;
        setupShortsScreen(category);
    } else {
        populateLongVideoGrid(category);
    }
}

async function populateLongVideoGrid(category = 'All') {
    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    const query = category.toLowerCase() === 'trending' ? null : (category.toLowerCase() === 'all' ? getRandomTopic() : category);
    const apiType = query ? 'search' : 'trending';
    const params = query ? { q: query, videoDuration: 'long' } : { limit: 20, regionCode: 'IN' };
    
    const data = await fetchFromYouTubeAPI(apiType, params);
    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    renderYouTubeLongVideos(data.items, false, data.error);
}

function renderYouTubeLongVideos(videos, append = false, errorMsg = null) {
    const grid = document.getElementById('long-video-grid');
    const loadMoreBtn = document.getElementById('long-video-load-more-btn');
    if (!grid || !loadMoreBtn) return;
    if (!append) grid.innerHTML = '';

    if (errorMsg || (videos.length === 0 && !append)) {
        grid.innerHTML = `<p class="static-message">${errorMsg || 'No videos found.'}</p>`;
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    const fragment = document.createDocumentFragment();
    videos.forEach(video => fragment.appendChild(createLongVideoCard(video)));
    grid.appendChild(fragment);

    loadMoreBtn.style.display = appState.youtubeNextPageTokens.long ? 'block' : 'none';
    loadMoreBtn.disabled = false;
}


async function loadMoreLongVideos() {
    const loadMoreBtn = document.getElementById('long-video-load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.textContent = "Loading...";
    }

    const activeCategoryChip = document.querySelector('#long-video-category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.dataset.category : 'All';
    const query = category.toLowerCase() === 'trending' ? null : (category.toLowerCase() === 'all' ? getRandomTopic() : category);
    const apiType = query ? 'search' : 'trending';
    const params = query ? { q: query, videoDuration: 'long', pageToken: appState.youtubeNextPageTokens.long } : { regionCode: 'IN', pageToken: appState.youtubeNextPageTokens.long };
    
    const data = await fetchFromYouTubeAPI(apiType, params);
    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    if(data.items) renderYouTubeLongVideos(data.items, true, data.error);
    
    if (loadMoreBtn) {
        loadMoreBtn.textContent = "Load More";
        if (!appState.youtubeNextPageTokens.long) loadMoreBtn.style.display = 'none';
    }
}

async function renderTrendingCarousel() {
    const carouselWrapper = document.getElementById('long-video-carousel-wrapper');
    if (!carouselWrapper) return;
    carouselWrapper.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
    const data = await fetchFromYouTubeAPI('trending', { limit: 10, regionCode: 'IN' });
    if (data.items && data.items.length > 0) {
        carouselWrapper.innerHTML = data.items.map(video => `<div class="carousel-card haptic-trigger" style="background-image: url('${escapeHTML(video.snippet.thumbnails.high?.url)}')" onclick="playYouTubeVideoFromCard('${video.id?.videoId || video.id}')"></div>`).join('');
    } else {
        carouselWrapper.innerHTML = `<p class="static-message">${data.error || 'Could not load trending videos.'}</p>`;
    }
}

function createLongVideoCard(video) {
    const videoId = video.id?.videoId || video.id;
    if (!videoId) return document.createElement('div');
    const card = document.createElement('div');
    card.className = 'long-video-card';
    card.innerHTML = `<div class="long-video-thumbnail" style="background-image: url('${escapeHTML(video.snippet.thumbnails.high?.url)}')" onclick="playYouTubeVideoFromCard('${videoId}')"><i class="fas fa-play play-icon-overlay"></i></div> <div class="long-video-info-container" onclick="navigateTo('creator-page-screen', { creatorId: '${video.snippet.channelId}', startWith: 'videos' })"> <div class="long-video-details"> <span class="long-video-name">${escapeHTML(video.snippet.title)}</span> <span class="long-video-uploader">${escapeHTML(video.snippet.channelTitle)}</span> </div> </div> <button class="add-channel-btn-long-grid haptic-trigger" onclick="addChannelToList(event, '${video.snippet.channelId}')"><i class="fas fa-plus"></i> Add Channel</button>`;
    return card;
}

async function playYouTubeVideoFromCard(videoId) {
    let video = currentVideoCache.get(videoId);
    if (!video || !video.snippet) {
        const data = await fetchFromYouTubeAPI('videoDetails', { id: videoId });
        if (data.items && data.items[0]) {
            video = data.items[0];
            currentVideoCache.set(videoId, video);
        } else {
            return alert("Video details could not be loaded.");
        }
    }
    navigateTo('creator-page-screen', { creatorId: video.snippet.channelId, startWith: 'videos', videoId: videoId });
}

function initializeHistoryScreen() {
    document.getElementById('history-date-button').onclick = clearAllHistory;
    renderHistoryShortsScroller();
    renderHistoryLongVideoList();
}

function renderHistoryShortsScroller() {
    const scroller = document.getElementById('history-shorts-scroller');
    const historyVideos = appState.viewingHistory.filter(v => v.videoLengthType === 'short');
    if (historyVideos.length === 0) {
        scroller.innerHTML = `<p class="static-message">No short video history.</p>`;
        return;
    }
    scroller.innerHTML = historyVideos.map(v => `<div class="history-short-card haptic-trigger" style="background-image: url(${escapeHTML(v.thumbnailUrl)})" onclick="navigateTo('creator-page-screen', { creatorId: '${v.channelId}', startWith: 'shorts', videoId: '${v.id}' })"><div class="history-item-menu" onclick="event.stopPropagation(); deleteFromHistory('${v.id}')"><i class="fas fa-trash-alt"></i></div></div>`).join('');
}

function renderHistoryLongVideoList() {
    const list = document.getElementById('history-long-video-list');
    const historyVideos = appState.viewingHistory.filter(v => v.videoLengthType === 'long');
    if (historyVideos.length === 0) {
        list.innerHTML = `<p class="static-message">No long video history.</p>`;
        return;
    }
    list.innerHTML = historyVideos.map(v => `<div class="history-list-item haptic-trigger" onclick="playYouTubeVideoFromCard('${v.id}')"><div class="history-item-thumbnail" style="background-image: url('${escapeHTML(v.thumbnailUrl)})'"></div><div class="history-item-info"><span class="history-item-title">${escapeHTML(v.title)}</span><span class="history-item-uploader">${escapeHTML(v.channelTitle)}</span></div><div class="history-item-menu" onclick="event.stopPropagation(); deleteFromHistory('${v.id}')"><i class="fas fa-trash-alt"></i></div></div>`).join('');
}

function clearAllHistory() {
    if (confirm("Are you sure?")) {
        appState.viewingHistory = [];
        localStorage.removeItem(`shubhzoneViewingHistory_${appState.currentUser.uid}`);
        initializeHistoryScreen();
    }
}

function deleteFromHistory(videoId) {
    if (confirm("Remove this from history?")) {
        appState.viewingHistory = appState.viewingHistory.filter(item => item.id !== videoId);
        localStorage.setItem(`shubhzoneViewingHistory_${appState.currentUser.uid}`, JSON.stringify(appState.viewingHistory));
        initializeHistoryScreen();
    }
}

function renderUserProfileVideos() {
    const message = '<p class="static-message" style="grid-column: 1 / -1;">Video uploads are not supported.</p>';
    document.getElementById('user-short-video-grid').innerHTML = message;
    document.getElementById('user-long-video-grid').innerHTML = message;
}

// =======================================================
// ★★★ CREATOR PAGE LOGIC (REWORKED & ROBUST) - START ★★★
// =======================================================
async function initializeCreatorPage(payload) {
    const creatorPageTabs = document.getElementById('creator-page-tabs');
    creatorPageTabs.innerHTML = `
        <button class="creator-page-tab-btn haptic-trigger" data-type="videos">Videos</button>
        <button class="creator-page-tab-btn haptic-trigger" data-type="shorts">Shorts</button>
        <button class="creator-page-tab-btn haptic-trigger" data-type="playlists">Playlists</button>`;
    
    creatorPageTabs.querySelectorAll('.creator-page-tab-btn').forEach(tab => {
        tab.addEventListener('click', () => {
             creatorPageTabs.querySelectorAll('.creator-page-tab-btn').forEach(t => t.classList.remove('active'));
             tab.classList.add('active');
             loadCreatorPageContent({ ...payload, startWith: tab.dataset.type, videoId: null, playlistId: null }); // Reset IDs on tab change
        });
    });

    const initialTabType = payload.startWith === 'long' ? 'videos' : payload.startWith;
    const initialTab = creatorPageTabs.querySelector(`.creator-page-tab-btn[data-type="${initialTabType}"]`);
    if(initialTab) initialTab.classList.add('active');
    
    await loadCreatorPageContent(payload);
}

async function loadCreatorPageContent(payload) {
    const { creatorId, startWith, videoId, playlistId } = payload;
    const contentArea = document.getElementById('creator-page-content');
    contentArea.innerHTML = '<div class="loader-container" style="height: 100%;"><div class="loader"></div></div>';

    let data;
    switch(startWith) {
        case 'videos':
        case 'long':
            data = await fetchFromYouTubeAPI('channelVideos', { channelId: creatorId });
            renderCreatorVideoList(contentArea, data, 'long', payload);
            break;
        case 'shorts':
            data = await fetchFromYouTubeAPI('channelShorts', { channelId: creatorId });
            renderCreatorVideoList(contentArea, data, 'short', payload);
            break;
        case 'playlists':
            data = await fetchFromYouTubeAPI('playlists', { channelId: creatorId });
            renderCreatorPlaylistList(contentArea, data, payload);
            break;
        case 'playlistItems':
            data = await fetchFromYouTubeAPI('playlistItems', { playlistId: playlistId });
            renderCreatorVideoList(contentArea, data, 'long', payload);
            break;
    }
}

function renderCreatorVideoList(container, data, type, payload) {
    if (data.error || !data.items || data.items.length === 0) {
        container.innerHTML = `<p class="static-message">${data.error || `No ${type} videos found.`}</p>`;
        return;
    }

    const grid = document.createElement('div');
    grid.className = `creator-video-grid ${type}-video-list`;
    
    grid.innerHTML = data.items.map(item => {
        const videoDetails = item.snippet;
        const videoId = videoDetails.resourceId?.videoId || item.id?.videoId || item.id;
        const thumbnailUrl = videoDetails.thumbnails.high?.url || videoDetails.thumbnails.medium?.url;
        
        if (type === 'long') {
            return `<div class="long-video-card" onclick="playYouTubeVideoFromCard('${videoId}')"><div class="long-video-thumbnail" style="background-image: url('${escapeHTML(thumbnailUrl)}')"><i class="fas fa-play play-icon-overlay"></i></div><div class="long-video-info-container"><div class="long-video-details"><span class="long-video-name">${escapeHTML(videoDetails.title)}</span><span class="long-video-uploader">${escapeHTML(videoDetails.videoOwnerChannelTitle || videoDetails.channelTitle)}</span></div></div></div>`;
        } else {
            return `<div class="history-short-card" style="background-image: url('${escapeHTML(thumbnailUrl)}');" onclick="navigateTo('home-screen')"></div>`;
        }
    }).join('');
    
    container.innerHTML = '';
    container.appendChild(grid);
    
    // अगर कोई वीडियोID पास किया गया है तो सीधे उसे चलाएं
    if (payload.videoId && type === 'long') {
        const firstCard = grid.querySelector('.long-video-card');
        if (firstCard) {
            const playerWrapper = document.createElement('div');
            playerWrapper.id = 'creator-player-wrapper';
            playerWrapper.style.marginBottom = '15px';
            playerWrapper.innerHTML = `<div class="main-video-card"><div id="creator-page-player-long"></div> <div class="custom-player-controls-overlay"> <div class="controls-center" onclick="toggleCreatorPlayer('long')"><i class="fas fa-play-circle control-btn-main"></i></div> <div class="controls-bottom"><i class="fas fa-sync-alt rotate-btn-player" onclick="event.stopPropagation(); toggleVideoRotation();"></i></div> </div></div>`;
            container.insertBefore(playerWrapper, grid);
            initializeCreatorPagePlayer(payload.videoId, 'creator-page-player-long', 'long');
        }
    }
}

function renderCreatorPlaylistList(container, data, payload) {
    if (data.error || !data.items || data.items.length === 0) {
        container.innerHTML = `<p class="static-message">${data.error || 'No playlists found.'}</p>`;
        return;
    }
    const list = document.createElement('div');
    list.className = 'creator-playlist-list';
    list.innerHTML = data.items.map(playlist => {
        const p = playlist.snippet;
        return `<div class="history-list-item haptic-trigger" onclick="loadCreatorPageContent({ creatorId: '${payload.creatorId}', startWith: 'playlistItems', playlistId: '${playlist.id}' })"><div class="history-item-thumbnail" style="background-image: url('${escapeHTML(p.thumbnails.medium.url)}')"></div><div class="history-item-info"><span class="history-item-title">${escapeHTML(p.title)}</span><span class="history-item-uploader">${playlist.contentDetails.itemCount} videos</span></div></div>`;
    }).join('');
    container.innerHTML = '';
    container.appendChild(list);
}

function initializeCreatorPagePlayer(videoId, containerId, type) {
    if (appState.creatorPagePlayers[type]) appState.creatorPagePlayers[type].destroy();
    
    if (!document.getElementById(containerId)) return;

    appState.creatorPagePlayers[type] = new YT.Player(containerId, {
        height: '100%', width: '100%', videoId: videoId,
        playerVars: { 'autoplay': 1, 'controls': 0, 'rel': 0, 'showinfo': 0, 'mute': 0, 'modestbranding': 1, 'fs': 0 },
        events: {
            'onReady': (event) => {
                if(userHasInteracted) event.target.unMute();
                event.target.playVideo();
                const videoData = currentVideoCache.get(videoId);
                if (videoData) addLongVideoToHistory(videoData);
            },
            'onStateChange': handleCreatorPlayerStateChange
        }
    });
}

function handleCreatorPlayerStateChange(event) {
    const player = event.target;
    const playerState = event.data;
    const iframe = player.getIframe();
    if (!iframe) return;
    const playPauseBtn = iframe.closest('.main-video-card')?.querySelector('.control-btn-main');
    if (playPauseBtn) {
        if (playerState === YT.PlayerState.PLAYING) playPauseBtn.classList.replace('fa-play-circle', 'fa-pause-circle');
        else playPauseBtn.classList.replace('fa-pause-circle', 'fa-play-circle');
    }
}

function toggleCreatorPlayer(type) {
    const player = appState.creatorPagePlayers[type];
    if (player && typeof player.getPlayerState === 'function') {
        if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
        else {
            player.unMute();
            player.playVideo();
        }
    }
}

function toggleVideoRotation() {
    const playerWrapper = document.getElementById('creator-player-wrapper');
    if (!playerWrapper) return;
    const videoWrapper = playerWrapper.querySelector('.main-video-card-wrapper') || playerWrapper;
    const isRotated = videoWrapper.classList.toggle('rotated');
    appContainer.classList.toggle('fullscreen-active', isRotated);
    try {
        if (isRotated) {
            if (appContainer.requestFullscreen) appContainer.requestFullscreen();
            screen.orientation.lock('landscape').catch(() => {});
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            screen.orientation.unlock();
        }
    } catch (err) { console.error("Fullscreen API error:", err); }
}
// =======================================================
// ★★★ CREATOR PAGE LOGIC (REWORKED & ROBUST) - END ★★★
// =======================================================

async function addChannelToList(event, channelId) {
    event.stopPropagation();
    if (!channelId || appState.currentUser.addedChannels.some(c => c.id === channelId)) return;
    try {
        const data = await fetchFromYouTubeAPI('channelDetails', { id: channelId });
        if (!data.items || data.items.length === 0) return alert("Could not get channel details.");
        
        const channelDetails = { id: channelId, name: data.items[0].snippet.title, avatar: data.items[0].snippet.thumbnails.default.url };
        appState.currentUser.addedChannels.push(channelDetails);
        localStorage.setItem(`shubhzone_addedChannels_${appState.currentUser.uid}`, JSON.stringify(appState.currentUser.addedChannels));
        alert(`Channel "${channelDetails.name}" added.`);
        if (appState.currentScreen === 'friends-screen') renderMyChannelsList();
    } catch (error) {
        alert("Failed to add channel.");
    }
}

function renderMyChannelsList() {
    const container = document.getElementById('my-channels-content');
    if (!container) return;
    const channels = appState.currentUser.addedChannels || [];
    if (channels.length === 0) {
        container.innerHTML = `<p class="static-message">You haven't added any channels yet.</p>`;
        return;
    }
    container.innerHTML = channels.map(c => `<div class="holographic-card"><div class="profile-pic"><img src="${escapeHTML(c.avatar)}" alt="avatar"></div><div class="info"><div class="name">${escapeHTML(c.name)}</div><div class="subtext">Added Channel</div></div><div class="channel-actions"><button class="open-button" onclick="navigateTo('creator-page-screen', { creatorId: '${c.id}' })">Open</button><button class="reject-button" onclick="removeChannelFromList(event, '${c.id}')"><i class="fas fa-trash-alt"></i></button></div></div>`).join('');
}

function removeChannelFromList(event, channelId) {
    event.stopPropagation();
    if (!confirm("Remove this channel?")) return;
    appState.currentUser.addedChannels = appState.currentUser.addedChannels.filter(c => c.id !== channelId);
    localStorage.setItem(`shubhzone_addedChannels_${appState.currentUser.uid}`, JSON.stringify(appState.currentUser.addedChannels));
    renderMyChannelsList();
}


// Dummy functions for friend system as they are not the focus of the fix
function populateAddFriendsList() { document.getElementById('add-friend-user-list').innerHTML = '<p class="static-message">Friend system is currently under maintenance.</p>'; }
function populateFriendRequestsList() { document.getElementById('requests-content').innerHTML = '<p class="static-message">Friend system is currently under maintenance.</p>';}
function populateMembersList() { document.getElementById('members-content').innerHTML = '<p class="static-message">Friend system is currently under maintenance.</p>';}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const targetNav = item.getAttribute('data-nav');
            const targetScreen = targetNav === 'shorts' ? 'home-screen' : `${targetNav}-screen`;
            navigateTo(targetScreen);
            updateNavActiveState(targetNav);
        });
    });
    
    document.getElementById('get-started-btn')?.addEventListener('click', () => {
        userHasInteracted = true;
        startAppLogic();
    });

    appContainer.addEventListener('click', () => { if (!userHasInteracted) userHasInteracted = true; });
    
    document.getElementById('friends-screen')?.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
             document.getElementById('friends-screen').querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
             document.getElementById('friends-screen').querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
             button.classList.add('active');
             document.getElementById(button.dataset.tab + '-content').classList.remove('hidden');
        });
    });
    
    const sidebar = document.getElementById('main-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    document.getElementById('home-menu-icon')?.addEventListener('click', () => { sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); });
    document.getElementById('long-video-menu-icon')?.addEventListener('click', () => { sidebar.classList.add('open'); sidebarOverlay.classList.add('open'); });
    document.getElementById('close-sidebar-btn')?.addEventListener('click', () => { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); });
    sidebarOverlay?.addEventListener('click', () => { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('open'); });

    document.getElementById('long-video-search-btn')?.addEventListener('click', () => populateLongVideoGrid(document.getElementById('long-video-search-input').value.trim()));
    document.getElementById('long-video-history-btn')?.addEventListener('click', () => navigateTo('history-screen'));
    document.getElementById('back-from-history-btn')?.addEventListener('click', () => navigateBack());
    
    document.getElementById('profile-your-zone-btn')?.addEventListener('click', () => navigateTo('information-screen'));
    document.getElementById('profile-show-shorts-btn')?.addEventListener('click', () => document.getElementById('user-short-video-grid').style.display = 'grid', document.getElementById('user-long-video-grid').style.display = 'none');
    document.getElementById('profile-show-longs-btn')?.addEventListener('click', () => document.getElementById('user-short-video-grid').style.display = 'none', document.getElementById('user-long-video-grid').style.display = 'grid');

    initializeApp();
});
