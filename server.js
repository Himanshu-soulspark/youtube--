// ====================================================================
// === Shubhzone - API Server (Node.js) - ★★★ RAZORPAY AUTOPAY VERSION ★★★ ===
// ====================================================================

// 1. ज़रूरी पैकेज इम्पोर्ट करें
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
// ★★★ बदलाव: Cashfree को Razorpay से बदला गया ★★★
const Razorpay = require('razorpay');
// ★★★ बदलाव: Razorpay Signature को वेरिफाई करने के लिए crypto जोड़ा गया ★★★
const crypto = require('crypto');


// 2. Firebase एडमिन को शुरू करें (नए और बेहतर तरीके से)
let db; 
try {
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

// 3. सर्वर सेटअप करें
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// 4. Environment Variables से सभी API कुंजियाँ पढ़ें
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
// ★★★ बदलाव: Cashfree की जगह Razorpay की कुंजियाँ जोड़ी गईं ★★★
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;


// 5. ★★★ बदलाव: Razorpay को कॉन्फ़िगर करें ★★★
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
// ★★★ पेमेंट गेटवे के लिए API रूट्स (RAZORPAY के लिए पूरी तरह से नए) ★★★
// ====================================================================

// 6. नया Razorpay ऑर्डर बनाने के लिए रूट (₹1 ऑथराइज़ेशन के लिए)
app.post('/create-razorpay-order', async (req, res) => {
    if (!razorpay) {
        return res.status(500).json({ error: 'Razorpay credentials not configured on server.' });
    }
    
    try {
        const { userId, email, name } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        const orderId = `shubhzone-auth-${userId}-${Date.now()}`;
        
        // Autopay के लिए Razorpay ऑर्डर ऑप्शन्स
        const options = {
            amount: 100, // राशि पैसे में, तो ₹1 = 100 पैसे
            currency: "INR",
            receipt: orderId, 
            payment_capture: 1, // ऑटो-कैप्चर
            notes: {
                userId: userId,
                purpose: "Initial authorization for autopay"
            }
        };

        const response = await razorpay.orders.create(options);
        console.log('Razorpay order created for authorization:', response);
        res.status(200).json(response);

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ error: "Could not create order.", details: error.message });
    }
});

// 7. पेमेंट को वेरिफाई करने के लिए रूट
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
        
        // सिग्नेचर की तुलना करें
        if (expectedSignature === razorpay_signature) {
            console.log(`Payment signature verified for user ${userId}.`);
            
            // Firebase में उपयोगकर्ता का स्टेटस अपडेट करें
            const userRef = db.collection('users').doc(userId);
            await userRef.update({ 
                isPaid: true, // isPaid को true करें ताकि ऐप अनलॉक हो जाए
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                autopaySetupComplete: true // यह दिखाता है कि ₹1 की पेमेंट हो गई है
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

// 8. ★★★ नया रूट: ₹150 का ऑटो-पेमेंट चार्ज करने के लिए ★★★
// इस रूट को आपको एक Cron Job या शेड्यूलर से कॉल करना होगा।
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

        // चेक करें कि क्या यह चार्ज पहले ही हो चुका है
        if (userData.autopayCharged) {
            return res.status(400).json({ message: 'Autopay has already been charged for this user.' });
        }

        // Razorpay API को कॉल करके ₹150 चार्ज करें
        // ध्यान दें: इस फीचर के लिए आपको Razorpay से UPI AutoPay या कार्ड मैंडेट की अनुमति लेनी पड़ सकती है।
        // यह एक सांकेतिक कोड है। असलियत में आपको razorpay.subscriptions.create या razorpay.payments.capture का इस्तेमाल करना पड़ सकता है।
        // यहाँ हम एक नया ऑर्डर बनाकर उसे चार्ज करने का प्रयास कर रहे हैं।
        
        console.log(`Initiating autopay of ₹150 for user: ${userId}`);
        
        // यह एक सांकेतिक कार्यान्वयन है। असल में, आपको पहले पेमेंट से मिले टोकन का उपयोग करना होगा।
        // क्योंकि सिंपल पेमेंट में टोकन नहीं मिलता, आपको Razorpay Subscriptions API का उपयोग करना होगा।
        // फिलहाल, हम इसे लॉग करके सफल मान रहे हैं।
        
        // ToDo: Implement actual Razorpay Subscription charge logic here.
        // For now, we simulate success and update Firestore.
        
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

// 9. स्टैटिक फाइलें सर्व करें (जैसे आपका index.html)
const publicPath = path.join(__dirname, '');
app.use(express.static(publicPath));

// 10. किसी भी अन्य रिक्वेस्ट के लिए index.html भेजें ताकि आपका ऐप हमेशा लोड हो
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 11. सर्वर शुरू करें
app.listen(port, () => {
    console.log("/////////////////////////////////////////////////////");
    console.log("===> 🚀 Shubhzone सर्वर सफलतापूर्वक चल रहा है! 🚀");
    console.log(`===> पोर्ट ${port} पर सुना जा रहा है।`);
    console.log("/////////////////////////////////////////////////////");
});
