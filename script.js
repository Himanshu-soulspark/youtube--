
/* ================================================= */
/* === Shubhzone App Script (Code 2) - FINAL v5.14 === */
/* === MODIFIED AS PER USER REQUEST - AUG 2025    === */
/* === SOLVED: Full YouTube API Integration      === */
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
    },
    currentScreen: 'splash-screen',
    navigationStack: ['splash-screen'],
    currentScreenPayload: null,
    // allVideos, userShortVideos, userLongVideos are now deprecated
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
            // Heavily prioritized Monetag Interstitial & Direct Link
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
let players = {}; // Player instances for the shorts swiper
let videoObserver;
// fullVideoList is deprecated.
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
 * @param {string} type 'search', 'trending', or 'channel' में से एक।
 * @param {object} params API के लिए पैरामीटर (जैसे, q, pageToken, channelId)।
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
        
        // नए प्राप्त वीडियो को कैश में जोड़ें
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
    const loader = document.getElementById('youtube-grid-loader'); // Assuming a general loader
    const loadMoreBtn = document.getElementById('long-video-load-more-btn');

    if (!grid) return;
    if (loader) loader.style.display = 'none';

    if (!append) {
        grid.innerHTML = '';
    }

    if (videos.length === 0 && !append) {
        grid.innerHTML = '<p class="static-message">No videos found. Try a different search or category.</p>';
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
    if (loadMoreBtn) loadMoreBtn.disabled = true;

    const activeCategoryChip = document.querySelector('#long-video-category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.textContent : 'All';
    
    let data;
    if (category.toLowerCase() === 'trending') {
        data = await fetchFromYouTubeAPI('trending', { pageToken: appState.youtubeNextPageTokens.long });
    } else {
        const query = category.toLowerCase() === 'all' ? '' : category;
        data = await fetchFromYouTubeAPI('search', { q: query, pageToken: appState.youtubeNextPageTokens.long, videoDuration: 'long' });
    }

    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    if(data.items) {
        renderYouTubeLongVideos(data.items, true);
    }
}

function playYouTubeVideoFromCard(videoId) {
    const video = currentVideoCache.get(videoId);
    if (!video) {
        alert("Video details not found. Please try again.");
        return;
    }
    
    const channelId = video.snippet.channelId;
    
    navigateTo('creator-page-screen', { 
        creatorId: channelId, // Pass channelId as creatorId
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
const uploadDetailsModal = document.getElementById('upload-details-modal');
const modalVideoTitle = document.getElementById('modal-video-title');
const modalVideoDescription = document.getElementById('modal-video-description');
const modalVideoHashtags = document.getElementById('modal-video-hashtags');
const modalVideoUrlInput = document.getElementById('modal-video-url');
const modalChannelNameInput = document.getElementById('modal-channel-name');
const modalChannelLinkInput = document.getElementById('modal-channel-link');
const selectedCategoryText = document.getElementById('selected-category-text');
const categoryOptionsContainer = document.getElementById('category-options');
const commentsToggleInput = document.getElementById('comments-toggle-input');
const audienceOptions = document.querySelectorAll('.audience-option');
const categorySelectorDisplay = document.querySelector('.category-selector-display');
const videoSwiper = document.getElementById('video-swiper');
const homeStaticMessageContainer = document.getElementById('home-static-message-container');
const saveContinueBtn = document.getElementById('save-continue-btn');
const modalTitle = document.getElementById('modal-title');
const modalSaveButton = document.getElementById('modal-save-button');
const editingVideoIdInput = document.getElementById('editing-video-id');
const commentsModal = document.getElementById('comments-modal');
const commentsList = document.getElementById('comments-list');
const commentInput = document.getElementById('comment-input');
const sendCommentBtn = document.getElementById('send-comment-btn');
const descriptionModal = document.getElementById('description-modal');
const descriptionContent = document.getElementById('description-content');
const closeDescriptionBtn = document.getElementById('close-description-btn');

const categories = ["Trending", "Entertainment", "Comedy", "Music", "Dance", "Education", "Travel", "Food", "DIY", "Sports", "Gaming", "News", "Lifestyle"];
const earnsureContent = {
    hi: `<h4>🌟 आपका अपना वीडियो प्लेटफॉर्म – जहां हर व्यू की क़ीमत है! 🎥💰</h4><hr><p><strong>🎥 क्रिएटर्स के लिए (Creators):</strong></p><p>अगर आप अपना खुद का वीडियो इस प्लेटफ़ॉर्म पर डालते हैं और लोग उसे देखते हैं, तो आपके वीडियो के Watch Time के आधार पर आपको कमाई (Ad Revenue Share) दी जाएगी।</p><p>🛑 <strong>अगर आप किसी और का वीडियो डालते हैं, तो:</strong></p><ul><li>आपको उससे कोई कमाई नहीं मिलेगी।</li><li>जब दूसरे लोग आपके द्वारा अपलोड किए गए वीडियो को देखेंगे, तो उससे होने वाली कमाई असली क्रिएटर को जाएगी (अगर वे हमसे संपर्क करते हैं)।</li></ul><hr><p><strong>🧾 पेमेंट पॉलिसी (Payment Policy):</strong></p><p>🗓️ <strong>हर सोमवार को पेमेंट Apply करें – 24 घंटे का समय!</strong></p><p>अब से, आप हर सोमवार को पूरे दिन (00:00 से 23:59 तक) "Payment Apply" बटन पर क्लिक कर सकते हैं।</p><p>✅ अगर आप सोमवार को अप्लाई नहीं करते, तो उस सप्ताह की कमाई रद्द (forfeit) मानी जाएगी।</p><hr><p><strong>💵 पेमेंट कब मिलेगा?</strong></p><p>पहली बार पेमेंट तब मिलेगा जब आपकी कुल कमाई ₹5000 (लगभग $60 USD) हो जाएगी।</p><p>इसके बाद आप चाहे ₹2 (लगभग $0.02 USD) भी कमाएं, आप उसे कभी भी निकाल सकते हैं।</p><hr><p><strong>💼 ऐप की दो खास विशेषताएं:</strong></p><p>📢 <strong>1. ब्रांड प्रमोशन का मौका</strong></p><p>इस ऐप पर आप अपने ब्रांड, प्रोडक्ट या सर्विस का विज्ञापन कर सकते हैं — वो भी सही टारगेटेड ऑडियंस के सामने।</p><p>📬 <strong>2. सीधे यूज़र से संपर्क करें</strong></p><p>अगर आपको किसी यूज़र से बात करनी है – सुझाव, फीडबैक या काम के लिए – तो आप ऐप के ज़रिए सीधे मैसेज या संपर्क कर सकते हैं।</p><hr><p><strong>✅ वेरिफिकेशन के नियम:</strong></p><p>अगर आप अपने वीडियो से क्रिएटर के रूप में कमाई करना चाहते हैं, तो आपको:</p><ol><li>अपनी कम से कम 5 यूट्यूब वीडियो में ऐप का नाम या लिंक (Shout-out) देना होगा।</li><li>इससे हम यह पुष्टि कर सकेंगे कि चैनल आपका है।</li></ol><hr><p><strong>🔒 ईमानदारी और पारदर्शिता हमारी प्राथमिकता है</strong></p><p>हम चाहते हैं कि हर Creator को उनका पूरा हक़ मिले — बिना किसी धोखे और बिना किसी मुश्किल के।</p><blockquote>"कमाई और विश्वास का रिश्ता तभी टिकता है, जब दोनों तरफ से इज्ज़त हो।"</blockquote><hr><p><strong>📩 संपर्क करें:</strong></p><p>कोई सवाल या सहायता चाहिए? ईमेल करें 👉 udbhavscience12@gmail.com</p><hr><h4>🌈 आइए, साथ मिलकर कुछ बड़ा बनाएं।</h4><p>आप देखिए, कमाइए, प्रमोट कीजिए, जुड़िए — यह मंच आपका है। 🚀💖</p>`,
    en: `<h4>🌟 Your Own Video Platform – Where Every View Has Value! 🎥💰</h4><hr><p><strong>🎥 For Creators:</strong></p><p>If you upload your own videos to this platform and people watch them, you earn money (Ad Revenue Share) based on the watch time of those videos.</p><p>🛑 <strong>But if you upload someone else’s video:</strong></p><ul><li>You won’t earn any revenue from it.</li><li>The revenue generated from views on videos you upload will go to the original creator if they contact us.</li></ul><hr><p><strong>🧾 Payment Policy:</strong></p><p>🗓️ <strong>Apply for Payment Every Monday – Full 24 Hours!</strong></p><p>You can apply for payment every Monday, anytime between 00:00 and 23:59 (24 hours window).</p><p>✅ If you do not apply on Monday, the earnings for that week will be forfeited.</p><hr><p><strong>💵 When Will You Get Paid?</strong></p><p>Your first payment will be released only when your total earnings reach ₹5000 (approx. $60 USD).</p><p>After that, even if you earn just ₹2 (approx. $0.02 USD), you can withdraw it anytime.</p><hr><p><strong>💼 Two Special Features of This App:</strong></p><p>📢 <strong>1. Promote Your Own Brand</strong></p><p>You can advertise your brand, product, or services directly on this platform — to a real, engaged audience who already loves content.</p><p>📬 <strong>2. Contact Any User Directly</strong></p><p>Need to reach out to a user for collaboration, feedback, or business? The app allows you to directly contact any user via messaging.</p><hr><p><strong>✅ Verification Rules for Creators:</strong></p><p>If you want to earn revenue as a creator, you must:</p><ol><li>Give a shout-out (mentioning/link to this app) in any 5 videos on your YouTube channel.</li><li>This helps us verify that the channel is genuinely yours.</li></ol><hr><p><strong>🔒 Honesty & Transparency Come First</strong></p><p>We are committed to giving every creator their fair share, with zero cheating and zero complications.</p><blockquote>"True earnings and trust grow only when there's respect on both sides."</blockquote><hr><p><strong>📩 Need Help? Contact Us:</strong></p><p>Have questions or suggestions? 📧 Email us at: udbhavscience12@gmail.com</p><hr><h4>🌈 Let’s build something great, together.</h4><p>Watch, Earn, Promote, and Connect — This platform is truly yours. 🚀💖</p>`
};
let currentEarnsureLanguage = 'hi';

function activateScreen(screenId) {
    // Animation logic removed for performance
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    const activeScreen = document.getElementById(screenId);
    if (activeScreen) {
        activeScreen.style.display = 'flex';
        activeScreen.classList.add('active'); // Keep class for state checking
    }
    
    // Clean up active class from others
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== screenId) {
            screen.classList.remove('active');
        }
    });

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
    }
    activePlayerId = null;
    
    activateScreen(nextScreenId);
    appState.currentScreenPayload = payload;

    if (nextScreenId === 'profile-screen') loadUserVideosFromFirebase(); // Now this will show a message
    if (nextScreenId === 'long-video-screen') setupLongVideoScreen();
    if (nextScreenId === 'history-screen') initializeHistoryScreen();
    if (nextScreenId === 'your-zone-screen') populateYourZoneScreen();
    if (nextScreenId === 'home-screen') setupShortsScreen();
    // if (nextScreenId === 'upload-screen') initializeNewHomeScreen(); // Deprecated
    if (nextScreenId === 'earnsure-screen') initializeEarnsureScreen();
    if (nextScreenId === 'creator-page-screen' && payload && payload.creatorId) initializeCreatorPage(payload.creatorId, payload.startWith, payload.videoId);
    if (nextScreenId === 'advertisement-screen') initializeAdvertisementPage();
    if (nextScreenId === 'credit-screen' && payload && payload.videoId) initializeCreditScreen(payload.videoId);
    if (nextScreenId === 'payment-screen') initializePaymentScreen();
    if (nextScreenId === 'track-payment-screen') initializeTrackPaymentScreen();
    if (nextScreenId === 'report-screen') initializeReportScreen();
    if (nextScreenId === 'friends-screen') {
        populateAddFriendsList();
        populateFriendRequestsList();
        populateMembersList(); 
    }
}

function navigateBack() {
    if (appState.navigationStack.length <= 1) return;
    
    appState.navigationStack.pop();
    const previousScreenId = appState.navigationStack[appState.navigationStack.length - 1];

    if (appState.currentScreen === 'creator-page-screen') {
        if (appState.creatorPagePlayers.short) appState.creatorPagePlayers.short.destroy();
        if (appState.creatorPagePlayers.long) appState.creatorPagePlayers.long.destroy();
        appState.creatorPagePlayers = { short: null, long: null };
        const videoWrapper = document.querySelector('#creator-page-long-view .main-video-card-wrapper');
        if (videoWrapper && videoWrapper.classList.contains('rotated')) {
            videoWrapper.classList.remove('rotated');
        }
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
        userData.creatorCoins = userData.creatorCoins || 0;
        userData.unconvertedCreatorSeconds = userData.unconvertedCreatorSeconds || 0;
        
        appState.currentUser = { ...appState.currentUser, ...userData };
        const savedHistory = localStorage.getItem('shubhzoneViewingHistory');
        if (savedHistory) {
            appState.viewingHistory = JSON.parse(savedHistory);
        }
        updateProfileUI();
        
        if (lastScreenToRestore && lastScreenToRestore !== 'upload-screen' && lastScreenToRestore !== 'new-home-screen') {
             console.log(`[App Restore] Found last screen in localStorage: ${lastScreenToRestore}. Restoring...`);
             await startAppLogic(lastScreenToRestore);
        } else if (userData.name && userData.state) {
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

    const lastScreenToRestore = localStorage.getItem('shubhzone_lastScreen');

    auth.onAuthStateChanged(user => {
        if (user) {
            checkUserProfileAndProceed(user, lastScreenToRestore);
        } else {
            auth.signInAnonymously().catch(error => console.error("Anonymous sign-in failed:", error));
        }
    });

    activateScreen('splash-screen');
    startAppTimeTracker();
}


function loadUserVideosFromFirebase() {
    // This function is now deprecated for showing videos, as they come from YouTube.
    // We'll just show a message on the profile screen.
    renderUserProfileVideos(); 
}

// DEPRECATED - Videos are fetched on demand from YouTube.
// async function refreshAndRenderFeed() { }


// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// ★★★ महत्वपूर्ण सुधार: बॉटम नेविगेशन के लिए नया सेटअप ★★★
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

function setupBottomNav() {
    // This function's content has been moved to DOMContentLoaded to ensure elements exist.
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
        // उपयोगकर्ता डेटा को अपडेट करते समय merge: true का उपयोग करें ताकि पुराने फ़ील्ड बने रहें
        await db.collection('users').doc(appState.currentUser.uid).set(userData, { merge: true });

        // यह सुनिश्चित करें कि referralCode मौजूद है
        const userDoc = await db.collection('users').doc(appState.currentUser.uid).get();
        if (!userDoc.data().referralCode) {
            await generateAndSaveReferralCode(appState.currentUser.uid, name);
        }

        // लोकल स्टेट को अपडेट करें
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

function openUploadDetailsModal(lengthType = 'short', videoData = null) {
    // This function is now deprecated
    alert("This feature is no longer available. All video content is sourced directly from YouTube.");
}

function closeUploadDetailsModal() {
    uploadDetailsModal.classList.remove('active');
}

function toggleCategoryOptions() { categorySelectorDisplay.classList.toggle('open'); }

function selectCategory(category) {
    appState.uploadDetails.category = category;
    selectedCategoryText.textContent = category;
    categorySelectorDisplay.classList.remove('open');
}

function selectAudience(audienceType) {
    appState.uploadDetails.audience = audienceType;
    audienceOptions.forEach(option => option.classList.remove('selected'));
    const selectedOption = document.querySelector(`.audience-option[data-audience="${audienceType}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    } else {
        document.querySelector(`.audience-option[data-audience="all"]`).classList.add('selected');
        appState.uploadDetails.audience = 'all';
    }
}

// Deprecated functions for Firebase video management
async function handleSave() { openUploadDetailsModal(); }
async function saveVideoEdits(videoId) { openUploadDetailsModal(); }
async function saveNewVideo() { openUploadDetailsModal(); }

let appStartLogicHasRun = false;
const startAppLogic = async (restoreScreen = null) => {
    if (!restoreScreen && appStartLogicHasRun && appState.currentScreen !== 'splash-screen' && appState.currentScreen !== 'information-screen') {
        return;
    }
    appStartLogicHasRun = true;

    setupAdTimers();

    const getStartedBtn = document.getElementById('get-started-btn');
    const loadingContainer = document.getElementById('loading-container');
    if (getStartedBtn) getStartedBtn.style.display = 'none';
    if (loadingContainer) loadingContainer.style.display = 'flex';
    
    renderCategories();
    renderCategoriesInBar();
    
    // Default screen is now 'long-video-screen'
    const screenToNavigate = restoreScreen || 'long-video-screen';
    
    navigateTo(screenToNavigate);
    
    if (screenToNavigate === 'long-video-screen') {
        updateNavActiveState('long-video');
    } else if (screenToNavigate === 'home-screen') { // This is now shorts
        updateNavActiveState('shorts');
    } else {
        const navId = screenToNavigate.replace('-screen', '');
        updateNavActiveState(navId);
    }


    if (restoreScreen) {
        localStorage.removeItem('shubhzone_lastScreen');
    }
};

function renderCategories() {
    if (categoryOptionsContainer) {
        categoryOptionsContainer.innerHTML = categories.map(cat => `<div class="category-option haptic-trigger" onclick="selectCategory('${cat}')">${cat}</div>`).join('');
        selectCategory(categories[0]);
    }
}

function renderVideoSwiper(videos, append = false) {
    if (!videoSwiper) return;

    if (!append) {
        videoSwiper.innerHTML = '';
        players = {};
        if (videoObserver) videoObserver.disconnect();
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
            if (e.target.closest('.video-actions-overlay') || e.target.closest('.uploader-info') || e.target.closest('.credit-btn')) return;
            togglePlayPause(videoId);
        });
        slide.addEventListener('dblclick', (e) => {
            if (!e.target.closest('.video-actions-overlay') && !e.target.closest('.uploader-info')) {
                // Like action can be implemented here if needed, requires auth state
            }
        });

        const playerHtml = `<div class="player-container" id="player-${videoId}"></div>`;
        const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url;
        const uploaderName = video.snippet.channelTitle;
        // Since we can't get avatar easily from search results, we use a placeholder
        const uploaderAvatar = 'https://via.placeholder.com/40'; 
        const title = video.snippet.title;

        const creatorProfileOnClick = `navigateTo('creator-page-screen', { creatorId: '${video.snippet.channelId}', startWith: 'short', videoId: '${videoId}' })`;

        slide.innerHTML = `
            <div class="video-preloader" style="background-image: url('${thumbnailUrl}');"><div class="loader"></div></div>
            ${playerHtml}
            <i class="fas fa-heart like-heart-popup"></i>
            <div class="video-meta-overlay">
                <div class="uploader-info" onclick="${creatorProfileOnClick}"><img src="${uploaderAvatar}" class="uploader-avatar"><span class="uploader-name">${escapeHTML(uploaderName)}</span></div>
                <p class="video-title">${escapeHTML(title)}</p>
                <button class="credit-btn haptic-trigger" onclick="navigateTo('credit-screen', { videoId: '${videoId}' })">Credit</button>
            </div>
            <div class="video-actions-overlay">
                <div class="action-icon-container haptic-trigger" data-action="creator" onclick="${creatorProfileOnClick}">
                    <i class="fas fa-user-circle icon"></i>
                    <span class="count">Creator</span>
                </div>
                <div class="action-icon-container haptic-trigger" data-action="like">
                    <i class="far fa-heart icon"></i>
                    <span class="count">...</span>
                </div>
                <div class="action-icon-container haptic-trigger" data-action="comment" onclick="openCommentsModal('${videoId}', null, '${video.snippet.channelId}')">
                    <i class="fas fa-comment-dots icon"></i>
                    <span class="count">...</span>
                </div>
            </div>`;
        videoSwiper.appendChild(slide);
        
        if (!append) videoObserver.observe(slide);

        if ((index + 1) % 5 === 0) { // Show ad every 5 videos
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
    
    const loadMoreTrigger = document.getElementById('shorts-load-more-trigger');
    if (!loadMoreTrigger && appState.youtubeNextPageTokens.shorts) {
        const trigger = document.createElement('div');
        trigger.id = 'shorts-load-more-trigger';
        videoSwiper.appendChild(trigger);
        videoObserver.observe(trigger);
    } else if (loadMoreTrigger && !appState.youtubeNextPageTokens.shorts) {
        videoObserver.unobserve(loadMoreTrigger);
        loadMoreTrigger.remove();
    }


    if (isYouTubeApiReady && !append) {
        initializePlayers();
    }
}

function onYouTubeIframeAPIReady() {
    isYouTubeApiReady = true;
    if (window.pendingAppStartResolve) {
        window.pendingAppStartResolve();
        delete window.pendingAppStartResolve;
    }
    // Player initialization is now handled dynamically by the observer
}

function initializePlayers() {
    // This is now handled by the intersection observer one by one.
    // This function can be kept for pre-loading logic if needed, but for now it's better to load on demand.
}

// ★★★ AUTO PLAY FIX ★★★
function onPlayerReady(event) {
    const iframe = event.target.getIframe();
    const slide = iframe.closest('.video-slide');
    if (!slide) return;

    // Hide preloader once player is ready to be controlled
    const preloader = slide.querySelector('.video-preloader');
    if (preloader) preloader.style.display = 'none';

    // IMPORTANT: Do not trigger play here.
    // The IntersectionObserver will handle the play logic exclusively
    // to prevent race conditions and ensure the correct video plays.
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
    
    const videoData = currentVideoCache.get(videoId);
    if (!videoData) return;

    if (event.data === YT.PlayerState.PLAYING) {
        // Watch time tracking can be re-implemented here if needed.
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        //
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
        thumbnailUrl: videoData.snippet.thumbnails.medium.url,
        videoLengthType: 'short' // Assuming this is called from shorts player
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
        thumbnailUrl: videoData.snippet.thumbnails.medium.url,
        videoLengthType: 'long'
    };
    const existingIndex = appState.viewingHistory.findIndex(item => item.id === videoId);
    if (existingIndex > -1) appState.viewingHistory.splice(existingIndex, 1);
    appState.viewingHistory.unshift(historyItem);
    if (appState.viewingHistory.length > 100) appState.viewingHistory.pop();
    localStorage.setItem('shubhzoneViewingHistory', JSON.stringify(appState.viewingHistory));
}


function isElementVisible(el, container) {
    if (!el || !container) return false;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return (elRect.top >= containerRect.top && elRect.bottom <= containerRect.bottom);
}

function togglePlayPause(videoId) {
    const player = players[videoId];
    if (!player || typeof player.getPlayerState !== 'function') return;
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
        player.pauseVideo();
    } else {
        if (activePlayerId && activePlayerId !== videoId) pauseActivePlayer();
        playActivePlayer(videoId);
    }
}

// ★★★ UNMUTE FIX ★★★
function playActivePlayer(videoId) {
    if (!videoId) return;
    
    if (activePlayerId && activePlayerId !== videoId) {
        pauseActivePlayer();
    }
    activePlayerId = videoId;
    addVideoToHistory(videoId);
    
    const player = players[videoId];
    if (!player || typeof player.playVideo !== 'function' || !player.getIframe() || !document.body.contains(player.getIframe())) {
        // Player not ready, create it
        const slide = document.querySelector(`.video-slide[data-video-id="${videoId}"]`);
        if(slide) createPlayerForSlide(slide);
        return;
    }
    
    if (userHasInteracted) {
        player.unMute();
    } else {
        player.mute();
    }
    player.playVideo();
}

function pauseActivePlayer() {
    if (!activePlayerId) return;
    const player = players[activePlayerId];
    if (!player || typeof player.pauseVideo !== 'function') return;
    
    if (player.getPlayerState() === YT.PlayerState.PLAYING || player.getPlayerState() === YT.PlayerState.BUFFERING) {
         player.pauseVideo();
    }
    player.mute();
}

function createPlayerForSlide(slide) {
    const videoId = slide.dataset.videoId;
    if (players[videoId]) { // Player already exists or is being created
        // If it exists, just play it.
        if (typeof players[videoId].playVideo === 'function') {
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
                // Now that it's ready, play it if it's the active slide
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
                    console.log('loading more shorts');
                    videoObserver.unobserve(entry.target);
                    entry.target.remove();
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

    const allSlides = document.querySelectorAll('.video-slide, #shorts-load-more-trigger');
    allSlides.forEach(slide => videoObserver.observe(slide));
}


async function openCommentsModal(videoId, videoOwnerUid = null, channelId = null) {
    appState.activeComments = { videoId, videoOwnerUid, channelId };
    commentsModal.classList.add('active');
    commentsList.innerHTML = '<li style="text-align:center; color: var(--text-secondary);">Loading comments...</li>';
    try {
        // YouTube comments require API call, which is complex and quota-intensive.
        // For now, we will show a placeholder message.
        // In a real app, this would call a server endpoint to get comments for videoId.
        commentsList.innerHTML = '<li style="text-align:center; color: var(--text-secondary);">Comments are not available at this moment.</li>';
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
    // Commenting is disabled as it requires YouTube API authentication
    alert("Commenting is not available at this moment.");
}

async function deleteComment(videoId, commentId) {
    // Also disabled
    alert("Commenting is not available at this moment.");
}

async function toggleLikeAction(videoId, slideElement) {
    // Liking is disabled as it requires YouTube API authentication
    alert("Liking is not available at this moment.");
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

    if (scrollerId === 'category-scroller') { // This is for Shorts screen
        if (activePlayerId) {
            pauseActivePlayer();
            activePlayerId = null;
        }
        setupShortsScreen(category);
    } else { // This is for Long Video screen
        populateLongVideoGrid(category);
    }
}


function renderUserProfileVideos() {
    const shortGrid = document.getElementById('user-short-video-grid');
    const longGrid = document.getElementById('user-long-video-grid');
    
    if (shortGrid) {
        shortGrid.innerHTML = '<p class="static-message" style="color: var(--text-secondary); grid-column: 1 / -1;">Video uploads are no longer supported. All content is from YouTube.</p>';
    }
    if (longGrid) {
        longGrid.innerHTML = '<p class="static-message" style="color: var(--text-secondary); grid-column: 1 / -1;">Video uploads are no longer supported. All content is from YouTube.</p>';
    }
}

// These functions are deprecated as users can't have their own videos anymore.
function renderUserProfileShortGrid() {}
function renderUserProfileLongGrid() {}

function playVideoFromProfile(videoId) {
    // Deprecated. Playing is handled by playYouTubeVideoFromCard
}

async function editVideoDetails(videoId) {
    // Deprecated
    openUploadDetailsModal();
}

async function deleteVideo(videoId) {
    // Deprecated
    openUploadDetailsModal();
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

function setupShortsScreen(category = 'All') {
    const query = category.toLowerCase() === 'all' ? 'youtube shorts' : `${category} shorts`;

    if (homeStaticMessageContainer) {
        videoSwiper.innerHTML = '';
        videoSwiper.appendChild(homeStaticMessageContainer);
        homeStaticMessageContainer.style.display = 'flex';
        homeStaticMessageContainer.querySelector('.static-message').innerHTML = '<div class="loader"></div> Loading shorts...';
    }

    fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short' }).then(data => {
        appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
        if(data.items) {
            renderVideoSwiper(data.items, false);
            setupVideoObserver();
        }
    });
}

async function loadMoreShorts() {
    const activeCategoryChip = document.querySelector('#category-scroller .category-chip.active');
    const category = activeCategoryChip ? activeCategoryChip.textContent : 'All';
    const query = category.toLowerCase() === 'all' ? 'youtube shorts' : `${category} shorts`;

    const data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'short', pageToken: appState.youtubeNextPageTokens.shorts });

    appState.youtubeNextPageTokens.shorts = data.nextPageToken || null;
    if(data.items) {
        renderVideoSwiper(data.items, true);
    }
}


function setupLongVideoScreen() {
    populateLongVideoCategories();
    populateLongVideoGrid('All');
    
    const gridContainer = document.querySelector('.long-video-screen-content');
    let loadMoreBtn = document.getElementById('long-video-load-more-btn');
    if (!loadMoreBtn) {
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

function populateLongVideoCategories() {
    // This is now handled by the generic renderCategoriesInBar
}

function filterLongVideosByCategory(category, element) {
    document.querySelectorAll('#long-video-category-scroller .category-chip').forEach(chip => chip.classList.remove('active'));
    if (element) element.classList.add('active');
    populateLongVideoGrid(category);
}

function populateLongVideoCarousel() {
    // Carousel is removed for simplicity, focusing on the main grid.
    const carouselContainer = document.getElementById('long-video-carousel-container');
    if (carouselContainer) carouselContainer.style.display = 'none';
}

async function populateLongVideoGrid(category = 'All') {
    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    let data;
    if (category.toLowerCase() === 'trending') {
        data = await fetchFromYouTubeAPI('trending', { limit: 10 }); // Fetches 10 trending videos
    } else {
        const query = category.toLowerCase() === 'all' ? 'new songs' : category; // Default to something popular
        data = await fetchFromYouTubeAPI('search', { q: query, videoDuration: 'long' });
    }
    
    appState.youtubeNextPageTokens.long = data.nextPageToken || null;
    if (data.items) {
        renderYouTubeLongVideos(data.items, false);
    } else {
        grid.innerHTML = `<p class="static-message">${data.error || 'Could not load videos.'}</p>`;
    }
}


function performLongVideoSearch() {
    const input = document.getElementById('long-video-search-input');
    const query = input.value.trim().toLowerCase();
    
    const grid = document.getElementById('long-video-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    fetchFromYouTubeAPI('search', { q: query, videoDuration: 'long' }).then(data => {
        appState.youtubeNextPageTokens.long = data.nextPageToken || null;
        if(data.items) {
             renderYouTubeLongVideos(data.items, false);
        }
    });
}

function createLongVideoCard(video) {
    const videoId = typeof video.id === 'object' ? video.id.videoId : video.id;
    if (!videoId) return document.createElement('div'); // Return empty div if no ID

    const card = document.createElement('div');
    card.className = 'long-video-card';
    card.dataset.videoId = videoId;
    card.dataset.channelId = video.snippet.channelId;
    
    const thumbnailUrl = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url;
    
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
        <button class="credit-btn-long-grid haptic-trigger" onclick="navigateTo('credit-screen', { videoId: '${videoId}' })">Credit</button>
    `;
    return card;
}


function showLongVideoMenu(event, videoId) {
    event.stopPropagation();
    if (confirm("Show video description?")) {
        showVideoDescription(event, videoId);
    }
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
        // Clicking history item should go to creator page
        card.onclick = () => {
            alert("This function needs channelId stored in history. Re-implementing.");
            // To fix this, channelId must be saved to history object.
        };
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


function populateEarnsureContent(lang) {
    const earnsureContentDiv = document.querySelector('.earnsure-section-content');
    if (earnsureContentDiv) {
        earnsureContentDiv.innerHTML = earnsureContent[lang];
        currentEarnsureLanguage = lang;
    }
}

function initializeEarnsureScreen() {
    const contentArea = document.querySelector('#earnsure-screen .earnsure-content-area');
    if (!contentArea) return;

    const adContainer = document.createElement('div');
    adContainer.className = 'earnsure-ad-container';

    contentArea.innerHTML = `
        <div class="earnsure-section">
            <div class="earnsure-section-content">
                <!-- Content populated by JS -->
            </div>
        </div>
    `;
    contentArea.prepend(adContainer);

    injectBannerAd(adContainer);
    
    populateEarnsureContent(currentEarnsureLanguage);

    const languageToggle = document.getElementById('earnsure-language-toggle');
    if (languageToggle) {
        let enButton = languageToggle.querySelector('[data-lang="en"]');
        let hiButton = languageToggle.querySelector('[data-lang="hi"]');
        if (!enButton) {
            enButton = document.createElement('button');
            enButton.classList.add('haptic-trigger');
            enButton.setAttribute('data-lang', 'en');
            enButton.textContent = 'EN';
            languageToggle.appendChild(enButton);
        }
        if (!hiButton) {
            hiButton = document.createElement('button');
            hiButton.classList.add('haptic-trigger');
            hiButton.setAttribute('data-lang', 'hi');
            hiButton.textContent = 'HI';
            languageToggle.appendChild(hiButton);
        }
        
        const updateButtons = (lang) => {
            enButton.classList.toggle('active', lang === 'en');
            hiButton.classList.toggle('active', lang === 'hi');
            populateEarnsureContent(lang);
        };
        
        updateButtons(currentEarnsureLanguage);

        enButton.onclick = () => updateButtons('en');
        hiButton.onclick = () => updateButtons('hi');
    }
}


function populateYourZoneScreen() {
    const content = document.getElementById('your-zone-content');
    if (!content) {
        console.error("'your-zone-content' element not found in HTML.");
        return;
    }
    const { uid, referralCode, avatar, name, email } = appState.currentUser;
    content.innerHTML = `
        <div class="your-zone-header">
            <img src="${escapeHTML(avatar)}" alt="Avatar" class="your-zone-avatar">
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

async function populateLeaderboard() {
    console.log("Leaderboard is disabled.");
    const content = document.getElementById('leaderboard-content');
    if(content) {
        content.innerHTML = '<p class="static-message">Leaderboard is currently unavailable.</p>';
    }
    return;
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

// ★★★ UI FIX ★★★
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
            // This is the corrected HTML structure for each friend card
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

function openCommentsForCurrentCreatorVideo() {
    const { id, channelId } = appState.creatorPage.currentLongVideo;
    if (id && channelId) {
        openCommentsModal(id, null, channelId);
    } else {
        console.error("No current long video data to open comments for.");
        alert("Could not load comments for this video.");
    }
}

async function initializeCreatorPage(channelId, startWith = 'short', startVideoId = null) {
    const shortView = document.getElementById('creator-page-short-view');
    const longView = document.getElementById('creator-page-long-view');
    if (!shortView || !longView) return;
    
    shortView.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    longView.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    
    // Fetch videos for the channel
    const channelVideosData = await fetchFromYouTubeAPI('channel', { channelId: channelId });
    const allVideos = channelVideosData.items || [];
    
    const shortVideos = allVideos.filter(v => v.snippet.title.toLowerCase().includes('#shorts') || (v.contentDetails && v.contentDetails.duration && parseISO8601Duration(v.contentDetails.duration) <= 60));
    const longVideos = allVideos.filter(v => !shortVideos.includes(v));

    let startShortVideo = shortVideos.find(v => (v.id.videoId || v.id) === startVideoId) || shortVideos[0];
    let startLongVideo = longVideos.find(v => (v.id.videoId || v.id) === startVideoId) || longVideos[0];

    // Setup menus and tabs
    const menu = document.getElementById('more-function-menu');
    let commentBtn = document.getElementById('creator-page-comment-btn');
    if (!commentBtn) {
        commentBtn = document.createElement('button');
        commentBtn.id = 'creator-page-comment-btn';
        commentBtn.className = 'function-menu-item haptic-trigger';
        commentBtn.innerHTML = `<i class="fas fa-comment-dots"></i> Comment`;
        commentBtn.onclick = openCommentsForCurrentCreatorVideo;
        menu.appendChild(commentBtn);
    }

    const tabs = document.querySelectorAll('#creator-page-tabs .creator-page-tab-btn');
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.creator-page-view').forEach(v => v.classList.remove('active'));
            const activeView = document.getElementById(`creator-page-${tab.dataset.type}-view`);
            if (activeView) activeView.classList.add('active');
            
            commentBtn.style.display = tab.dataset.type === 'long' ? 'flex' : 'none';

            const otherType = tab.dataset.type === 'short' ? 'long' : 'short';
            if(appState.creatorPagePlayers[otherType] && typeof appState.creatorPagePlayers[otherType].pauseVideo === 'function') {
                appState.creatorPagePlayers[otherType].pauseVideo();
            }
            if(appState.creatorPagePlayers[tab.dataset.type] && typeof appState.creatorPagePlayers[tab.dataset.type].playVideo === 'function') {
                appState.creatorPagePlayers[tab.dataset.type].playVideo();
            }

            const videoWrapper = document.querySelector('#creator-page-long-view .main-video-card-wrapper');
            if (videoWrapper && videoWrapper.classList.contains('rotated')) {
                videoWrapper.classList.remove('rotated');
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
    commentBtn.style.display = startWith === 'long' ? 'flex' : 'none';
}


function renderCreatorVideoView(container, videos, type, channelId, startVideoId = null) {
    container.innerHTML = '';
    if (videos.length === 0) {
        container.innerHTML = `<p class="static-message">This creator has no ${type} videos.</p>`;
        return;
    }
    
    let firstVideo = videos.find(v => (v.id.videoId || v.id) === startVideoId) || videos[0];
    
    const videoListHtml = videos.map((v, index) => {
        const thumbClass = (type === 'long') ? 'side-video-thumb-long' : 'side-video-thumb-short';
        const videoId = v.id.videoId || v.id;
        return `<img src="${v.snippet.thumbnails.medium.url}" class="side-video-thumb haptic-trigger ${thumbClass}" onclick="playCreatorVideo('${type}', '${videoId}', '${channelId}')">`;
    }).join('');

    const playerControlsHtml = `
        <div class="custom-player-controls-overlay">
            <div class="controls-center">
                <i class="fas fa-backward control-btn" onclick="seekVideo('${type}', -10)"></i>
                <i class="fas fa-play-circle control-btn-main" onclick="toggleCreatorPlayer('${type}')"></i>
                <i class="fas fa-forward control-btn" onclick="seekVideo('${type}', 10)"></i>
            </div>
            <div class="controls-bottom">
                <span class="playback-speed-btn" onclick="cyclePlaybackSpeed('${type}')">1x</span>
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
            'controls': (type === 'short' ? 0 : 1), 
            'rel': 0, 'showinfo': 0, 'mute': 0, 'modestbranding': 1,
            'fs': 1, 'origin': window.location.origin
        },
        events: {
            'onReady': (event) => event.target.playVideo(),
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

function seekVideo(type, amount) {
    const player = appState.creatorPagePlayers[type];
    if (player && typeof player.getCurrentTime === 'function') {
        player.seekTo(player.getCurrentTime() + amount, true);
    }
}

function cyclePlaybackSpeed(type) {
    const player = appState.creatorPagePlayers[type];
    const speedBtn = document.querySelector(`#creator-page-${type}-view .playback-speed-btn`);
    if (player && speedBtn && typeof player.getPlaybackRate === 'function') {
        const rates = [1, 1.25, 1.5, 2, 0.75];
        const currentRate = player.getPlaybackRate();
        const nextRateIndex = (rates.indexOf(currentRate) + 1) % rates.length;
        const newRate = rates[nextRateIndex];
        player.setPlaybackRate(newRate);
        speedBtn.textContent = `${newRate}x`;
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
        if (videoWrapper) videoWrapper.classList.toggle('rotated');
    } else {
        alert("Rotation is only available for long videos.");
    }
}


function handleCreatorPlayerStateChange(event) {
    const player = event.target;
    const playerState = event.data;
    const iframe = player.getIframe();
    
    const playPauseBtn = iframe.closest('.main-video-card').querySelector('.control-btn-main');
    if (playPauseBtn) {
        if (playerState === YT.PlayerState.PLAYING) playPauseBtn.classList.replace('fa-play-circle', 'fa-pause-circle');
        else playPauseBtn.classList.replace('fa-pause-circle', 'fa-play-circle');
    }

    const videoId = player.getVideoData().video_id;
    const videoData = currentVideoCache.get(videoId);
    if (!videoData) return;
    
    if (playerState === YT.PlayerState.PLAYING) {
        // tracking logic can be here
        addLongVideoToHistory(videoId);
    } else if (playerState === YT.PlayerState.PAUSED || playerState === YT.PlayerState.ENDED) {
        //
    }
}

// =======================================================
// ★★★ PAYMENT & TRACKING LOGIC - START ★★★
// =======================================================

function initializePaymentScreen() {
    const content = document.getElementById('payment-content');
    if (!content) return;
    const user = appState.currentUser;

    content.innerHTML = `
        <div class="form-group"><label>Unique ID</label><input type="text" value="${escapeHTML(user.uid)}" readonly></div>
        <div class="form-group"><label>Name</label><input type="text" id="payment-name" value="${escapeHTML(user.name)}" readonly></div>
        <div class="form-group"><label for="payment-method">Payment Method</label><select id="payment-method" onchange="togglePaymentDetails()"><option value="">--Select Method--</option><option value="upi">UPI</option><option value="bank">Bank Transfer</option></select></div>
        <div id="upi-details" class="payment-details" style="display:none;"><div class="form-group"><label for="upi-id">UPI ID</label><input type="text" id="upi-id" placeholder="yourname@okhdfcbank"></div></div>
        <div id="bank-details" class="payment-details" style="display:none;"><div class="form-group"><label for="bank-account-number">Account Number</label><input type="text" id="bank-account-number" placeholder="Enter Account Number"></div><div class="form-group"><label for="bank-ifsc-code">IFSC Code</label><input type="text" id="bank-ifsc-code" placeholder="Enter IFSC Code"></div></div>
        <div class="form-group"><label for="payment-address">Address</label><textarea id="payment-address" rows="3" placeholder="Enter your full address">${escapeHTML(user.address)}</textarea></div>
        <div class="form-group"><label for="payment-aadhar">Aadhar Number</label><input type="text" id="payment-aadhar" placeholder="Enter your Aadhar number"></div>
        <button class="continue-btn haptic-trigger" onclick="navigateTo('track-payment-screen')" style="background-color: var(--success-green); margin-bottom: 10px;">Track Payment</button>
        <button class="continue-btn haptic-trigger" onclick="handlePaymentRequest(event)">Request Payment</button>
    `;
}

function togglePaymentDetails() {
    const method = document.getElementById('payment-method').value;
    document.getElementById('upi-details').style.display = (method === 'upi') ? 'block' : 'none';
    document.getElementById('bank-details').style.display = (method === 'bank') ? 'block' : 'none';
}

async function handlePaymentRequest(event) {
    const user = appState.currentUser;
    const method = document.getElementById('payment-method').value;
    
    if(!method) {
        alert("Please select a payment method.");
        return;
    }

    let paymentDetails = {};
    if (method === 'upi') {
        const upiId = document.getElementById('upi-id').value.trim();
        if (!upiId) { alert("Please enter your UPI ID."); return; }
        paymentDetails.upiId = upiId;
    } else if (method === 'bank') {
        const accNum = document.getElementById('bank-account-number').value.trim();
        const ifsc = document.getElementById('bank-ifsc-code').value.trim();
        if (!accNum || !ifsc) { alert("Please enter bank account details."); return; }
        paymentDetails.accountNumber = accNum;
        paymentDetails.ifscCode = ifsc;
    }

    const address = document.getElementById('payment-address').value.trim();
    const aadhar = document.getElementById('payment-aadhar').value.trim();

    if (!address || !aadhar) {
        alert("Please fill in your address and Aadhar number.");
        return;
    }

    if(!confirm("This will submit your payment request to the admin. After submitting, your tracking data will be reset. Continue?")) {
        return;
    }
    
    const button = event.target;
    button.disabled = true;
    button.textContent = "Submitting...";

    const requestData = {
        requesterUid: user.uid,
        requesterName: user.name,
        paymentMethod: method,
        paymentDetails: paymentDetails,
        address: address,
        aadhar: aadhar,
        creatorCoins: user.creatorCoins || 0,
        unconvertedCreatorSeconds: user.unconvertedCreatorSeconds || 0,
        status: "pending",
        requestedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection("paymentRequests").add(requestData);
        await resetTrackingData();
        alert("Payment request submitted successfully! Your tracking data has been reset.");
        navigateTo('long-video-screen'); 
    } catch(error) {
        console.error("Error submitting payment request:", error);
        alert("Failed to submit request. Please try again.");
    } finally {
        button.disabled = false;
        button.textContent = "Request Payment";
    }
}

function initializeTrackPaymentScreen() {
    const content = document.getElementById('track-payment-content');
    if (!content) return;
    const user = appState.currentUser;
    content.innerHTML = `
        <div class="track-payment-card creator-card">
            <div class="card-strip red"><span><i class="fas fa-crown"></i> Red Coin for Creator</span></div>
            <div class="card-content">
                <p>This is your income as a Creator. Earned when others watch your original videos. <br>(1 Coin ≈ 15 mins watch time)</p>
                <div class="coin-display">
                    <span class="coin-icon creator"><i class="fas fa-coins"></i></span>
                    <span class="coin-count">${user.creatorCoins || 0}</span>
                </div>
                <div class="unconverted-time">
                    <p>Unconverted Watch Time from Viewers: <strong>${formatSecondsToHMS(user.unconvertedCreatorSeconds || 0)}</strong></p>
                    <p class="coin-info-note">(Your own watch time on your videos is not counted here. Updates may take a few minutes.)</p>
                </div>
            </div>
        </div>
    `;
}

function startAppTimeTracker() {
    if (appState.appTimeTrackerInterval) clearInterval(appState.appTimeTrackerInterval);
    appState.appTimeTrackerInterval = setInterval(() => {}, 5000);
}

async function updateWatchTimeStats(creatorId, videoId, isStarting) {
    // This feature is currently disabled to avoid heavy Firestore writes from direct YouTube browsing.
    // It can be re-enabled if a proper tracking and revenue sharing model is established.
}


async function resetTrackingData() {
    try {
        const userRef = db.collection('users').doc(appState.currentUser.uid);
        await userRef.update({ 
            creatorCoins: 0,
            unconvertedCreatorSeconds: 0
        });
        appState.currentUser.creatorCoins = 0;
        appState.currentUser.unconvertedCreatorSeconds = 0;
    } catch (error) {
        console.error("Failed to reset tracking data:", error);
    }
}


function formatSecondsToHMS(secs) {
    if (isNaN(secs) || secs < 0) return "0s";
    secs = Math.round(secs);
    const d = Math.floor(secs / (3600*24));
    secs  -= d*3600*24;
    const h = Math.floor(secs / 3600);
    secs  -= h*3600;
    const m = Math.floor(secs / 60);
    secs  -= m*60;
    let parts = [];
    if (d > 0) parts.push(d + "d");
    if (h > 0) parts.push(h + "h");
    if (m > 0) parts.push(m + "m");
    if (secs > 0 || parts.length === 0) parts.push(secs + "s");
    return parts.join(' ');
}

// =======================================================
// ★★★ PAYMENT & TRACKING LOGIC - END ★★★
// =======================================================

// =======================================================
// ★★★ ADVERTISER DASHBOARD LOGIC - START ★★★
// =======================================================
const advertiserFunctions = {
    planData: [ { name: 'Basic', cost: 100, impressions: { banner: 1000, image_5s: 500, video: 100 } }, { name: 'Starter', cost: 250, impressions: { banner: 3000, image_5s: 1500, video: 300 } }, { name: 'Lite', cost: 500, impressions: { banner: 6000, image_5s: 3000, video: 700 } }, { name: 'Bronze', cost: 1000, impressions: { banner: 12000, image_5s: 6000, video: 1500 } }, { name: 'Silver', cost: 2000, impressions: { banner: 25000, image_5s: 12000, video: 3000 } }, { name: 'Gold', cost: 3000, impressions: { banner: 40000, image_5s: 20000, video: 5000 } }, { name: 'Platinum', cost: 5000, impressions: { banner: 75000, image_5s: 38000, video: 9000 } }, { name: 'Diamond', cost: 7500, impressions: { banner: 115000, image_5s: 60000, video: 13000 } }, { name: 'Titanium', cost: 9000, impressions: { banner: 150000, image_5s: 80000, video: 16000 } }, { name: 'Dymond Elite', cost: 10000, impressions: { banner: 175000, image_5s: 100000, video: 20000 } } ],
    showSection(sectionId) { document.querySelectorAll('#advertisement-screen .section').forEach(sec => sec.classList.remove('active')); const section = document.getElementById(sectionId); if (section) section.classList.add('active'); },
    populatePlans() { const container = document.getElementById('planContainer'); if (!container) return; container.innerHTML = ''; this.planData.forEach((plan, index) => { const planElement = document.createElement('div'); planElement.className = 'plan'; planElement.onclick = () => this.selectPlan(index, planElement); planElement.innerHTML = `<div class="plan-header"><div class="plan-name">${plan.name}</div><div class="plan-price"><span>₹</span>${plan.cost.toLocaleString('en-IN')}</div></div><ul class="impression-details"><li><span class="icon">🖼️</span><span class="label">Banner Ad</span><span class="value">${plan.impressions.banner.toLocaleString('en-IN')}</span></li><li><span class="icon">✨</span><span class="label">Image Ad (5s)</span><span class="value">${plan.impressions.image_5s.toLocaleString('en-IN')}</span></li><li><span class="icon">▶️</span><span class="label">Video Ad</span><span class="value">${plan.impressions.video.toLocaleString('en-IN')}</span></li></ul>`; container.appendChild(planElement); }); },
    selectPlan(planIndex, element) { document.querySelectorAll('#advertisement-screen .plan').forEach(p => p.classList.remove('selected')); element.classList.add('selected'); document.getElementById('selectedPlanData').value = JSON.stringify(this.planData[planIndex]); },
    goToForm() { const selectedPlanData = document.getElementById('selectedPlanData').value; if (!selectedPlanData) { alert('Please select a plan to continue.'); return; } const userProfile = JSON.parse(localStorage.getItem('advertiserProfile')); document.getElementById('adv-contactWhatsapp').value = userProfile.whatsapp; this.updateImpressionDisclaimer(); this.showSection('adFormSection'); },
    updateImpressionDisclaimer() { const planString = document.getElementById('selectedPlanData').value; const disclaimerEl = document.getElementById('impressionDisclaimer'); if (!planString || !disclaimerEl) return; const plan = JSON.parse(planString); const adType = document.getElementById('adv-adType').value; const finalImpressions = plan.impressions[adType]; disclaimerEl.innerHTML = `You will receive approximately <strong>${finalImpressions.toLocaleString('en-IN')}</strong> impressions for this Ad Type.`; },
    processRegistration() { const name = document.getElementById('adv-name').value.trim(); const whatsapp = document.getElementById('adv-whatsapp').value.trim(); if (!name || !whatsapp) { alert('Please fill in your name and WhatsApp number.'); return; } const profile = { name: name, businessName: document.getElementById('adv-businessName').value.trim(), whatsapp: whatsapp, campaigns: [] }; localStorage.setItem('advertiserProfile', JSON.stringify(profile)); this.showSection('planSection'); },
    async submitAdRequest() { 
        const adTitle = document.getElementById('adv-adTitle').value.trim();
        const adLink = document.getElementById('adv-adLink').value.trim();
        const contactWhatsapp = document.getElementById('adv-contactWhatsapp').value.trim();
        if (!adTitle || !adLink || !contactWhatsapp) {
            alert('Please fill out all ad details.');
            return;
        }
        const plan = JSON.parse(document.getElementById('selectedPlanData').value);
        const adType = document.getElementById('adv-adType').value;
        const finalImpressions = plan.impressions[adType];
        const userProfile = JSON.parse(localStorage.getItem('advertiserProfile'));

        const newCampaignRequest = {
            advertiserName: userProfile.name,
            advertiserBusiness: userProfile.businessName,
            advertiserWhatsapp: userProfile.whatsapp,
            planName: plan.name,
            planCost: plan.cost,
            title: adTitle,
            description: document.getElementById('adv-adDesc').value.trim(),
            cta: document.getElementById('adv-cta').value,
            link: adLink,
            adType: adType,
            contactWhatsapp: contactWhatsapp,
            targetImpressions: finalImpressions,
            submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
        };

        try {
            await db.collection('advertiserCampaignRequests').add(newCampaignRequest);

            userProfile.campaigns.push(newCampaignRequest); 
            localStorage.setItem('advertiserProfile', JSON.stringify(userProfile));
            
            this.sendWhatsAppNotification(userProfile, newCampaignRequest); 
            document.getElementById('adSubmissionForm').reset();
            alert('Request Submitted! Your request has been sent for approval.');
            this.showDashboard(userProfile);

        } catch (error) {
            console.error("Error submitting ad request to Firebase:", error);
            alert("There was an error submitting your request. Please try again.");
        }
    },
    showDashboard(profile) { document.getElementById('welcomeMessage').innerText = `Welcome back, ${profile.name}!`; const container = document.getElementById('campaignListContainer'); container.innerHTML = ''; if (profile.campaigns && profile.campaigns.length > 0) { profile.campaigns.forEach((campaign, index) => { const card = document.createElement('div'); card.className = 'campaign-item-card'; card.onclick = () => this.showCampaignDetails(index); card.innerHTML = `<div><h5>${campaign.title}</h5><p>${campaign.planName} Plan - ${Number(campaign.targetImpressions || campaign.finalImpressions).toLocaleString('en-IN')} Impressions</p></div><div class="arrow">›</div>`; container.appendChild(card); }); } else { container.innerHTML = `<p style="text-align:center; color: var(--text-secondary);">You have no active campaigns. Click 'Add New Plan' to get started.</p>`; } this.showSection('dashboardSection'); },
    showCampaignDetails(index) { const profile = JSON.parse(localStorage.getItem('advertiserProfile')); const campaign = profile.campaigns[index]; const adTypeMap = { 'banner': 'Banner Ad', 'image_5s': '5-Sec Image Ad', 'video': 'Video Ad' }; document.getElementById('detailCampaignTitle').innerText = campaign.title; document.getElementById('detailCampaignPlan').innerText = `${campaign.planName} Plan - ₹${Number(campaign.planCost).toLocaleString('en-IN')}`; document.getElementById('detailAdType').innerText = adTypeMap[campaign.adType]; const maxImpressions = Number(campaign.targetImpressions || campaign.finalImpressions); const impressions = Math.floor(Math.random() * (maxImpressions * 0.4) + (maxImpressions * 0.1)); const clicks = Math.floor(impressions * (Math.random() * (0.05 - 0.01) + 0.01)); const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00"; document.getElementById('detailFinalImpressions').innerText = impressions.toLocaleString('en-IN'); document.getElementById('detailClickCount').innerText = `${clicks} (${ctr}%)`; const locations = ['Mumbai, MH', 'Delhi, DL', 'Bengaluru, KA', 'Pune, MH', 'Hyderabad, TS', 'Chennai, TN']; document.getElementById('detailGeoData').innerHTML = [...locations].sort(() => 0.5 - Math.random()).slice(0, 4).join('<br>'); this.showSection('campaignDetailSection'); },
    createNewAd() { this.showSection('planSection'); },
    goBackToDashboard() { 
        const userProfile = JSON.parse(localStorage.getItem('advertiserProfile'));
        if (userProfile) {
            this.showDashboard(userProfile);
        } else {
            this.showSection('registrationSection');
        }
    },
    resetUser() { if (confirm('Are you sure you want to reset? This will clear your profile.')) { localStorage.removeItem('advertiserProfile'); this.showSection('registrationSection'); } },
    sendWhatsAppNotification(profile, campaign) { 
        const adminWhatsAppNumber = "7390928912"; 
        const adTypeMap = { 'banner': 'Banner Ad', 'image_5s': '5-Sec Image Ad', 'video': 'Video Ad' }; const message = `*🔥 New Ad Campaign Request*\n*👤 User Info:*\nName: ${profile.name}\nBusiness: ${profile.businessName || 'N/A'}\nProfile WA: ${profile.whatsapp}\n*📞 Campaign Contact WA:*\n${campaign.contactWhatsapp}\n*📦 Campaign Details:*\nPlan: *${campaign.planName}* (₹${Number(campaign.planCost).toLocaleString('en-IN')})\nAd Type: *${adTypeMap[campaign.adType]}*\nTarget Impressions: *${Number(campaign.targetImpressions || campaign.finalImpressions).toLocaleString('en-IN')}*\n*📢 Ad Content:*\nTitle: ${campaign.title}\nLink: ${campaign.link}\nRequest needs manual approval.`; const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message.trim())}`; console.log("Admin Notification URL:", whatsappUrl); window.open(whatsappUrl, '_blank'); },
    applyCode() { const code = document.getElementById('uniqueCodeInput').value.trim(); if (!code) { alert('Please enter your unique ID.'); return; } const userProfile = JSON.parse(localStorage.getItem('advertiserProfile')); if (userProfile && userProfile.name) { this.showDashboard(userProfile); } else { alert('Invalid Unique ID. Please register if you are a new user.'); this.showSection('registrationSection'); } }
};

function initializeAdPerformanceTracker() {
    const container = document.querySelector('#advertisement-screen .container');
    if (!container || document.getElementById('adPerformanceSection')) return;
    const performanceSection = document.createElement('div');
    performanceSection.id = 'adPerformanceSection';
    performanceSection.className = 'section';
    performanceSection.innerHTML = `
        <div class="card">
            <h2>Track Ad Performance</h2>
            <h3>Enter your Ad ID (Password) to see its performance stats.</h3>
            <div class="form-group">
                <label for="ad-performance-id">Ad ID (Password)</label>
                <input type="text" id="ad-performance-id" placeholder="Enter the unique Ad ID">
            </div>
            <button class="btn" onclick="fetchAdStats()">Get Performance Stats</button>
            <div id="ad-performance-results" style="margin-top: 20px;"></div>
        </div>
    `;
    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection) dashboardSection.insertAdjacentElement('afterend', performanceSection);
    else container.appendChild(performanceSection);
    const dashboardCard = dashboardSection.querySelector('.card');
    if (dashboardCard && !document.getElementById('track-perf-btn')) {
        const trackButton = document.createElement('button');
        trackButton.id = 'track-perf-btn';
        trackButton.className = 'btn btn-secondary';
        trackButton.textContent = 'Track Ad Performance';
        trackButton.onclick = () => advertiserFunctions.showSection('adPerformanceSection');
        dashboardCard.insertAdjacentElement('beforebegin', trackButton);
    }
}

async function fetchAdStats() {
    const adId = document.getElementById('ad-performance-id').value.trim();
    const resultsContainer = document.getElementById('ad-performance-results');
    if (!adId) { alert('Please enter an Ad ID.'); return; }
    resultsContainer.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
    try {
        const statDoc = await db.collection('advertisementStats').doc(adId).get();
        if (!statDoc.exists) {
            resultsContainer.innerHTML = '<p class="static-message">No performance data found for this Ad ID. Data will appear here after users start interacting with your ad.</p>';
            return;
        }
        const stats = statDoc.data();
        const closedCount = stats.closedCount || 0;
        let resultsHtml = `<h4 style="margin-bottom: 10px;">Performance for Ad: ${adId}</h4>`;
        resultsHtml += `<p style="font-size: 1.2em;">Total Times Closed by User: <strong style="color: var(--primary-neon);">${closedCount}</strong></p>`;
        resultsContainer.innerHTML = resultsHtml;
    } catch (error) {
        console.error("Error fetching ad stats:", error);
        resultsContainer.innerHTML = `<p class="static-message" style="color: var(--error-red);">Error fetching data. Reason: ${error.message}. Please check Firestore Rules.</p>`;
    }
}


function initializeAdvertisementPage() {
    advertiserFunctions.populatePlans();
    const userProfile = JSON.parse(localStorage.getItem('advertiserProfile'));
    initializeAdPerformanceTracker(); 
    if (userProfile && userProfile.name) advertiserFunctions.showDashboard(userProfile);
    else advertiserFunctions.showSection('registrationSection');
}
// =======================================================
// ★★★ REPORT & VIEW COUNT LOGIC - START ★★★
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

// =======================================================
// ★★★ NEW HOME SCREEN LOGIC (DEPRECATED) ★★★
// =======================================================
function initializeNewHomeScreen() {
    // This screen is no longer used. The functionality is merged into Long Video and Shorts screens.
    const container = document.querySelector('#upload-screen .upload-container-new');
    if (container) {
        container.innerHTML = '<p class="static-message">This section is no longer in use.</p>';
    }
}
// =======================================================
// ★★★ CREDIT SCREEN LOGIC - START ★★★
// =======================================================
function initializeCreditScreen(videoId) {
    const screen = document.getElementById('credit-screen');
    if (!screen) return;

    const video = currentVideoCache.get(videoId);
    if (!video) {
        screen.innerHTML = `<p class="static-message">Video details not found.</p><button onclick="navigateBack()">Back</button>`;
        return;
    }

    const channelName = escapeHTML(video.snippet.channelTitle) || 'Original Creator';
    const channelLink = `https://www.youtube.com/channel/${video.snippet.channelId}`;
    const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
    
    const watchOnYoutubeHTML = `<a href="${channelLink}" target="_blank" rel="noopener noreferrer">${channelName}</a>`;

    const commonFooter = `
        <div class="credit-footer">
            <p>This site features embedded YouTube videos and gives full credit to the original creators. We do not claim any rights over the videos.</p>
            <p><strong>Revenue Policy:</strong> If the original creator reaches out, we are happy to share revenue at a fixed rate per 1,000 views as agreed upon. Until then, earnings are retained to support platform costs.</p>
            <p>For takedown requests or revenue discussion, contact: udbhavscience12@gmail.com</p>
        </div>
    `;

    const contentHi = `
        <div id="credit-content-hi" class="credit-content-lang">
            <p><strong>🎥 क्रेडिट:</strong> ${channelName}</p>
            <p><strong>📺 यूट्यूब पर देखें:</strong> ${watchOnYoutubeHTML}</p>
            <p><strong>अस्वीकरण:</strong> यह वीडियो यूट्यूब से एम्बेड किया गया है। इस वीडियो के सभी अधिकार इसके मूल निर्माता के पास सुरक्षित हैं।</p>
            <p>यदि आप इस वीडियो के असली निर्माता हैं और चाहते हैं कि यह वीडियो इस प्लेटफ़ॉर्म से हटा दिया जाए, तो कृपया हमें इस ईमेल आईडी पर संपर्क करें: udbhavscience12@gmail.com</p>
            <p>यदि आप चाहते हैं कि यह वीडियो प्लेटफ़ॉर्म पर बना रहे और आप इसके माध्यम से होने वाली कमाई में भागीदार बनें, तो हम आगे आने वाले व्यूज़ पर 10% विज्ञापन राजस्व (ad revenue) साझा करने के लिए तैयार हैं।</p>
            <p>बस एक छोटी-सी अनुरोध है:</p>
            <ul>
                <li>🔹 पुष्टि (verification) के लिए आपको अपने यूट्यूब चैनल की किसी भी 5 वीडियो में हमारा एक छोटा सा शाउटआउट (नाम या वेबसाइट का ज़िक्र) देना होगा, ताकि यह प्रमाणित किया जा सके कि चैनल वास्तव में आपका ही है।</li>
                <li>🔹 साथ ही, हर महीने कम से कम एक बार अपने किसी वीडियो या पोस्ट में हमारी वेबसाइट का उल्लेख (mention) करना होगा, ताकि हम दोनों मिलकर आगे बढ़ सकें।</li>
            </ul>
            <p>यह कोई व्यापारिक लेन-देन नहीं, बल्कि एक आपसी सहयोग (collaboration) है — जिसमें हम दोनों एक-दूसरे की इज़्ज़त करते हुए और पारदर्शिता के साथ आगे बढ़ें।</p>
            <p>आइए मिलकर एक अच्छा और ईमानदार डिजिटल सफर तय करें ✨</p>
        </div>
    `;
    
    const contentEn = `
        <div id="credit-content-en" class="credit-content-lang active">
             <p><strong>🎥 Credit:</strong> ${channelName}</p>
             <p><strong>📺 Watch on YouTube:</strong> ${watchOnYoutubeHTML}</p>
             <p><strong>Disclaimer:</strong> This video is embedded directly from YouTube. All rights to the content belong to its original creator.</p>
             <p>If you are the original creator of this video and would like it to be removed from this platform, please feel free to contact us at: udbhavscience12@gmail.com</p>
             <p>However, if you would like the video to remain on this platform and are open to collaborating, we are happy to offer 10% of the ad revenue generated from future views of your video.</p>
             <p>We do have a small request:</p>
             <ul>
                 <li>🔹 For verification, we ask you to give a short shout-out (mentioning our name or website) in any 5 videos on your YouTube channel. This helps us confirm that the channel truly belongs to you.</li>
                 <li>🔹 Additionally, we request that you kindly mention our website at least once a month in any of your videos or posts — so that we can grow together, as true collaborators.</li>
             </ul>
             <p>This is not just a financial agreement — it’s a respectful and transparent collaboration built on mutual support.</p>
             <p>Let’s grow together ✨</p>
        </div>
    `;

    const adContainer = document.createElement('div');
    adContainer.id = 'credit-screen-ad-container';

    screen.innerHTML = `
        <div class="screen-header transparent">
            <div class="header-icon-left haptic-trigger" onclick="navigateBack()"><i class="fas fa-arrow-left"></i></div>
            <span class="header-title">Credit</span>
            <div class="credit-language-toggle">
                <button id="credit-lang-en" class="active">EN</button>
                <button id="credit-lang-hi">HI</button>
            </div>
        </div>
        <div class="credit-content-area">
            ${contentEn}
            ${contentHi}
            ${commonFooter}
        </div>
    `;
    screen.querySelector('.credit-content-area').prepend(adContainer);

    injectBannerAd(adContainer);

    document.getElementById('credit-lang-en').addEventListener('click', () => {
        document.getElementById('credit-content-en').classList.add('active');
        document.getElementById('credit-content-hi').classList.remove('active');
        document.getElementById('credit-lang-en').classList.add('active');
        document.getElementById('credit-lang-hi').classList.remove('active');
    });
    document.getElementById('credit-lang-hi').addEventListener('click', () => {
        document.getElementById('credit-content-hi').classList.add('active');
        document.getElementById('credit-content-en').classList.remove('active');
        document.getElementById('credit-lang-hi').classList.add('active');
        document.getElementById('credit-lang-en').classList.remove('active');
    });
}
// ★★★ NEW CREDIT SCREEN LOGIC - END ★★★

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


// ★★★ SPECIAL VIDEO PLAYER LOGIC - START ★★★
function showSpecialVideoPlayer(videoId, title = '', channelTitle = '') {
    let modal = document.getElementById('special-video-player-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'special-video-player-modal';
        modal.className = 'modal-overlay active';
        modal.style.zIndex = '9997';
        modal.innerHTML = `
            <div class="modal-content" style="padding: 10px; background-color: #000; border: 2px solid var(--primary-neon); max-width: 800px;">
                <span class="close-button" onclick="closeSpecialVideoPlayer()" style="top: 15px; right: 15px; color: #fff; font-size: 2em;">&times;</span>
                <div style="width: 100%; aspect-ratio: 16 / 9; background-color: #000;">
                    <div id="special-video-player-container" style="width: 100%; height: 100%;"></div>
                </div>
                <div id="special-video-info" style="padding: 10px; text-align: left; color: white;">
                     <h4 style="margin: 5px 0; font-size: 1.1em;">${escapeHTML(title)}</h4>
                     <p style="margin: 0; font-size: 0.9em; color: var(--text-secondary);">${escapeHTML(channelTitle)}</p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        modal.querySelector('#special-video-info h4').textContent = title;
        modal.querySelector('#special-video-info p').textContent = channelTitle;
        modal.classList.add('active');
    }

    if (isYouTubeApiReady) initializeSpecialPlayer(videoId);
}

function closeSpecialVideoPlayer() {
    const modal = document.getElementById('special-video-player-modal');
    if (modal) modal.classList.remove('active');
    if (appState.specialVideoPlayer && typeof appState.specialVideoPlayer.destroy === 'function') {
        appState.specialVideoPlayer.destroy();
        appState.specialVideoPlayer = null;
    }
}

function initializeSpecialPlayer(videoId = 'UL5Q1rDsDtg') { // डिफ़ॉल्ट वीडियो को पैरामीटर से बदलें
    if (appState.specialVideoPlayer) appState.specialVideoPlayer.destroy();
    appState.specialVideoPlayer = new YT.Player('special-video-player-container', {
        height: '100%', width: '100%', videoId: videoId,
        playerVars: {
            'autoplay': 1, 'controls': 1, 'rel': 0, 'showinfo': 0,
            'modestbranding': 1, 'origin': window.location.origin
        },
        events: { 'onReady': (event) => event.target.playVideo() }
    });
}
// ★★★ SPECIAL VIDEO PLAYER LOGIC - END ★★★


document.addEventListener('DOMContentLoaded', () => {
    
    // Hide the "Home" button as requested
    document.querySelectorAll('.nav-item[data-nav="new-home"]').forEach(item => {
        item.style.display = 'none';
    });

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.add('haptic-trigger');
        item.addEventListener('click', () => {
            const targetNav = item.getAttribute('data-nav');
            
            let targetScreen;
            if (targetNav === 'new-home') { // Should not happen, but as a fallback
                return;
            } else if (targetNav === 'shorts') {
                targetScreen = 'home-screen';
            } else {
                targetScreen = `${targetNav}-screen`;
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

    const sidebar = document.getElementById('main-sidebar');
    if (sidebar) {
        const paymentBtn = document.getElementById('navigate-to-payment-btn');
        if (paymentBtn) paymentBtn.style.display = 'none';
        const adBtn = document.getElementById('navigate-to-advertisement-btn');
        if (adBtn) adBtn.style.display = 'none';

        let reportButton = document.getElementById('navigate-to-report-btn');
        if (!reportButton) {
            reportButton = document.createElement('button');
            reportButton.id = 'navigate-to-report-btn';
            reportButton.className = 'sidebar-option haptic-trigger';
            reportButton.innerHTML = `<i class="fas fa-flag" style="margin-right: 10px;"></i>Report`;
            reportButton.onclick = () => navigateTo('report-screen');
            const premiumCard = document.querySelector('.premium-features-card');
            if (premiumCard) {
                sidebar.insertBefore(reportButton, premiumCard);
            } else {
                sidebar.appendChild(reportButton);
            }
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
    
    document.getElementById('category-selector-display')?.addEventListener('click', toggleCategoryOptions);
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
    renderCategories();
    renderCategoriesInBar();
});
