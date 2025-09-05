// ====================================================================
// === Shubhzone - API Server (Node.js) - ★★★ FINAL & FOOLPROOF VERSION ★★★ ===
// ====================================================================

// 1. ज़रूरी पैकेज इम्पोर्ट करें
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const { Cashfree } = require('cashfree-pg');

// 2. Firebase एडमिन को शुरू करें (नए और बेहतर तरीके से)
let db; 
try {
    if (!process.env.FIREBASE_CREDENTIALS_JSON) {
        throw new Error("FIREBASE_CREDENTIALS_JSON एनवायरनमेंट वेरिएबल सेट नहीं है।");
    }
    // ★★★★★★★★★★ यही है असली समाधान ★★★★★★★★★★
    // अब हम फाइल की जगह सीधे एनवायरनमेंट वेरिएबल से JSON को पढ़ेंगे।
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("Firebase Admin SDK सफलतापूर्वक शुरू हो गया है।");
} catch (error) {
    console.error("Firebase Admin SDK शुरू करने में विफल:", error.message);
}

// 3. सर्वर सेटअप करें
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// 4. Environment Variables से सभी API कुंजियाँ पढ़ें
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// 5. Cashfree को कॉन्फ़िगर करें
if (CASHFREE_APP_ID && CASHFREE_SECRET_KEY) {
    Cashfree.XClientId = CASHFREE_APP_ID;
    Cashfree.XClientSecret = CASHFREE_SECRET_KEY;
    Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION; // या Cashfree.Environment.SANDBOX टेस्टिंग के लिए
    console.log("Cashfree SDK कॉन्फ़िगर हो गया है।");
} else {
    console.warn("Cashfree credentials एनवायरनमेंट में नहीं मिले। पेमेंट वाले रूट्स काम नहीं करेंगे।");
}


// ====================================================================
// ★★★ पेमेंट गेटवे के लिए API रूट्स ★★★
// ====================================================================

// 6. नया ऑर्डर बनाने के लिए रूट
app.post('/create-order', async (req, res) => {
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
        return res.status(500).json({ error: 'Cashfree credentials not configured on server.' });
    }
    
    try {
        const { userId, email, name } = req.body;
        const orderId = `shubhzone-order-${userId}-${Date.now()}`;

        const request = {
            order_amount: 1.00,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: userId,
                customer_email: email || "default@email.com",
                customer_name: name || "Shubhzone User",
            },
            order_meta: {
                // ★★★ अपनी वेबसाइट का सही URL डालें। Render पर यह shboard.render.com होता है।
                return_url: `https://shboard.render.com?order_id={order_id}`, 
            }
        };

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        console.log('Cashfree order created:', response.data);
        res.status(200).json(response.data);

    } catch (error) {
        console.error('Error creating Cashfree order:', error.response?.data?.message || error.message);
        res.status(500).json({ error: error.response?.data?.message || "Could not create order." });
    }
});

// 7. पेमेंट को वेरिफाई करने के लिए रूट
app.post('/verify-payment', async (req, res) => {
    try {
        const { orderId, userId } = req.body;
        if (!orderId || !userId || !db) {
            return res.status(400).json({ error: 'Missing orderId or userId, or DB not initialized.' });
        }
        
        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
        const paymentInfo = response.data && response.data[0];

        if (paymentInfo && paymentInfo.payment_status === "SUCCESS") {
            const userRef = db.collection('users').doc(userId);
            await userRef.update({ isPaid: true, paymentOrderId: orderId });
            console.log(`Payment verified for user ${userId}. Status updated to paid.`);
            res.status(200).json({ success: true, message: "Payment verified and user updated." });
        } else {
            console.warn(`Payment verification failed for order ${orderId}. Status: ${paymentInfo?.payment_status}`);
            res.status(400).json({ success: false, message: "Payment not successful." });
        }

    } catch (error) {
        console.error('Error verifying payment:', error.response?.data?.message || error.message);
        res.status(500).json({ error: error.response?.data?.message || "Internal server error." });
    }
});


// ====================================================================
// ★★★ YouTube API रूट (कोई बदलाव नहीं) ★★★
// ====================================================================

app.get('/api/youtube', async (req, res) => {
    if (!db || !YOUTUBE_API_KEY) {
        console.error("त्रुटि: Firebase या YouTube API कुंजी कॉन्फ़िगर नहीं है।");
        return res.status(500).json({ error: "सर्वर ठीक से कॉन्फ़िगर नहीं है।" });
    }

    const { type, ...queryParams } = req.query;
    const safeParams = Object.keys(queryParams).sort().map(key => `${key}=${queryParams[key]}`).join('&');
    const cacheKey = Buffer.from(`${type}_${safeParams}`).toString('base64');
    const cacheRef = db.collection('youtube_cache').doc(cacheKey);

    let youtubeApiUrl;
    const baseUrl = 'https://www.googleapis.com/youtube/v3/';
    
    switch (type) {
        case 'search':
            youtubeApiUrl = `${baseUrl}search?part=snippet&type=video&key=${YOUTUBE_API_KEY}&${safeParams}`;
            break;
        case 'videoDetails':
            youtubeApiUrl = `${baseUrl}videos?part=snippet,contentDetails&key=${YOUTUBE_API_KEY}&${safeParams}`;
            break;
        case 'playlists':
            youtubeApiUrl = `${baseUrl}playlists?part=snippet&key=${YOUTUBE_API_KEY}&${safeParams}`;
            break;
        case 'playlistItems':
            youtubeApiUrl = `${baseUrl}playlistItems?part=snippet&key=${YOUTUBE_API_KEY}&${safeParams}`;
            break;
        default:
            youtubeApiUrl = `${baseUrl}videos?part=snippet,contentDetails&chart=mostPopular&regionCode=IN&maxResults=20&key=${YOUTUBE_API_KEY}`;
    }

    try {
        const youtubeResponse = await fetch(youtubeApiUrl, { timeout: 8000 }); 
        
        if (!youtubeResponse.ok) {
            const errorBody = await youtubeResponse.text();
            console.error(`YouTube API Error Body: ${errorBody}`);
            throw new Error(`YouTube API ने एरर दिया: ${youtubeResponse.statusText}`);
        }

        const data = await youtubeResponse.json();

        if (data.error) {
            throw new Error(`YouTube API से त्रुटि: ${data.error.message}`);
        }

        await cacheRef.set({ data: data, timestamp: Date.now() });
        return res.status(200).json(data);

    } catch (error) {
        console.warn(`API कॉल विफल हुई: ${error.message}। अब Firebase कैश से डेटा लाने का प्रयास किया जा रहा है।`);
        
        try {
            const cachedDoc = await cacheRef.get();
            if (cachedDoc.exists) {
                return res.status(200).json(cachedDoc.data().data);
            } else {
                return res.status(503).json({ error: "Service unavailable and no cache found." });
            }
        } catch (cacheError) {
            return res.status(500).json({ error: "API and cache both failed." });
        }
    }
});

// ====================================================================
// ★★★ स्टैटिक फाइलें और सर्वर स्टार्टअप ★★★
// ====================================================================

// 8. स्टैटिक फाइलें सर्व करें (जैसे आपका index.html)
const publicPath = path.join(__dirname, '');
app.use(express.static(publicPath));

// 9. किसी भी अन्य रिक्वेस्ट के लिए index.html भेजें ताकि आपका ऐप हमेशा लोड हो
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 10. सर्वर शुरू करें
app.listen(port, () => {
    console.log("/////////////////////////////////////////////////////");
    console.log("===> 🚀 Shubhzone सर्वर सफलतापूर्वक चल रहा है! 🚀");
    console.log(`===> पोर्ट ${port} पर सुना जा रहा है।`);
    console.log("/////////////////////////////////////////////////////");
});
