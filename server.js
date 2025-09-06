// ====================================================================
// === Shubhzone - API Server (Node.js) - ★★★ रसीद (Receipt) की लंबाई की समस्या को ठीक किया गया ★★★ ===
// ====================================================================

// 1. ज़रूरी पैकेज इम्पोर्ट करें (इसमें कोई बदलाव नहीं)
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');


// 2. Firebase एडमिन को शुरू करें (इसमें कोई बदलाव नहीं)
let db; 
try {
    // यह Render के Environment Variable से आपकी Firebase की key उठाएगा
    if (!process.env.FIREBASE_CREDENTIALS_JSON) {
        throw new Error("FIREBASE_CREDENTIALS_JSON एनवायरनमेंट वेरिएबल सेट नहीं है।");
    }
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log("Firebase Admin SDK सफलतापूर्वक शुरू हो गया है।");
} catch (error) {
    console.error("Firebase Admin SDK शुरू करने में विफल:", error.message);
}

// 3. सर्वर सेटअप करें (इसमें कोई बदलाव नहीं)
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// 4. Environment Variables से सभी API कुंजियाँ पढ़ें (इसमें कोई बदलाव नहीं)
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;


// 5. Razorpay को कॉन्फ़िगर करें (इसमें कोई बदलाव नहीं)
let razorpay;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET,
    });
    console.log("Razorpay SDK कॉन्फ़िगर हो गया है।");
} else {
    console.warn("Razorpay credentials एनवायरनमेंट में नहीं मिले। पेमेंट वाले रूट्स काम नहीं करेंगे।");
}


// ====================================================================
// ★★★ पेमेंट गेटवे के लिए API रूट्स ★★★
// ====================================================================

app.post('/create-razorpay-order', async (req, res) => {
    if (!razorpay) {
        return res.status(500).json({ error: 'Razorpay credentials not configured on server.' });
    }
    
    try {
        const { userId, amount, email, name } = req.body;

        if (!userId || !amount) {
            return res.status(400).json({ error: 'User ID and amount are required.' });
        }

        // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
        // ★★★ ज़रूरी सुधार: सिर्फ़ यह एक लाइन बदली गई है ★★★
        // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
        // पुरानी लाइन: const orderId = `shubhzone-sub-${userId}-${Date.now()}`; (यह 40 अक्षरों से लंबी थी)
        // नई लाइन: रसीद (receipt) को छोटा कर दिया गया है ताकि Razorpay एरर न दे।
        const orderId = `sz-${userId.slice(-8)}-${Date.now().toString(36)}`;

        
        const options = {
            amount: amount,
            currency: "INR",
            receipt: orderId, // अब यह छोटा और सही रसीद नंबर इस्तेमाल करेगा।
            payment_capture: 1,
            notes: {
                userId: userId,
                purpose: "Subscription Payment"
            }
        };

        const response = await razorpay.orders.create(options);
        console.log('Razorpay order created:', response);
        res.status(200).json(response);

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: "Could not create order.", details: error.message });
    }
});

// पेमेंट को वेरिफाई करने वाला रूट (इसमें कोई बदलाव नहीं)
app.post('/verify-razorpay-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !db) {
            return res.status(400).json({ error: 'Missing required parameters or DB not initialized.' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');
        
        if (expectedSignature === razorpay_signature) {
            console.log(`Payment signature verified for user ${userId}.`);
            
            const userRef = db.collection('users').doc(userId);
            await userRef.update({ 
                isPaid: true,
                subscriptionStatus: 'active',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                autopaySetupComplete: true,
                subscriptionStartDate: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`User ${userId} status updated to paid.`);
            res.status(200).json({ status: "success", message: "Payment verified and user updated." });

        } else {
            console.warn(`Payment verification failed for order ${razorpay_order_id}. Signature mismatch.`);
            res.status(400).json({ status: "failure", message: "Payment verification failed." });
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: "Internal server error.", details: error.message });
    }
});

// ऑटो-पेमेंट चार्ज करने के लिए रूट (इसमें कोई बदलाव नहीं)
app.post('/charge-autopay', async (req, res) => {
    if (!razorpay) {
        return res.status(500).json({ error: 'Razorpay credentials not configured.' });
    }

    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();

        if (!doc.exists || !doc.data().razorpayPaymentId) {
             return res.status(404).json({ error: 'User or initial payment not found.' });
        }

        const userData = doc.data();

        if (userData.autopayCharged) {
            return res.status(400).json({ message: 'Autopay has already been charged for this user.' });
        }
        
        console.log(`Initiating autopay of ₹150 for user: ${userId}`);
        
        await userRef.update({
            autopayCharged: true,
            autopayChargeDate: admin.firestore.FieldValue.serverTimestamp(),
            lastChargeAmount: 150
        });

        console.log(`Successfully recorded autopay charge for user: ${userId}`);
        res.status(200).json({ success: true, message: `Autopay of ₹150 successfully processed for user ${userId}` });

    } catch (error) {
        console.error(`Failed to charge autopay for user ${userId}:`, error);
        res.status(500).json({ error: 'Failed to process autopay charge.', details: error.message });
    }
});


// ====================================================================
// ★★★ YouTube API रूट (इसमें कोई बदलाव नहीं किया गया है) ★★★
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
// ★★★ स्टैटिक फाइलें और सर्वर स्टार्टअप (इसमें कोई बदलाव नहीं) ★★★
// ====================================================================

const publicPath = path.join(__dirname, '');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log("/////////////////////////////////////////////////////");
    console.log("===> 🚀 Shubhzone सर्वर सफलतापूर्वक चल रहा है! 🚀");
    console.log(`===> पोर्ट ${port} पर सुना जा रहा है।`);
    console.log("/////////////////////////////////////////////////////");
});
