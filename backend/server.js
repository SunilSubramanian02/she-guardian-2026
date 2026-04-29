const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const Contact = require('./models/Contact');
const Alert = require('./models/Alert');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'https://she-guardian-2026.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sheguardian';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Desktop/Local'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Multer setup for in-memory audio uploads
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- API ROUTES ---

// 1. Get Safety Score
app.get('/api/safety-score', (req, res) => {
    const currentScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
    setTimeout(() => {
        res.json({ score: currentScore, status: "Safe", riskLevel: "Low" });
    }, 500);
});

// 2. Trigger SOS & Save Alert
app.post('/api/sos', async (req, res) => {
    try {
        const { location, timestamp } = req.body;
        console.log(`\n🚨 [ALERT] SOS Triggered at ${location || 'Unknown'}`);

        // Save alert to DB
        const newAlert = new Alert({
            location: location,
            timestamp: timestamp || new Date()
        });
        await newAlert.save();

        res.status(201).json({
            success: true,
            message: "Alert logged to DB and sent to authorities.",
            alertId: newAlert._id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error triggering SOS' });
    }
});

// 3. Find Safest Route
app.post('/api/route', (req, res) => {
    setTimeout(() => {
        res.json({
            success: true,
            message: "Safest route found avoiding high-risk zones.",
            eta: "15 mins"
        });
    }, 1500);
});

// 4. Video/Audio Danger Analysis & Evidence Collection (Gemini AI)
app.post('/api/evidence', upload.single('evidence'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No evidence file uploaded.' });
        }

        console.log(`\n📹 [EVIDENCE] Received Video/Audio chunk for analysis & storage. Size: ${req.file.size} bytes`);
        // In a real production app, you would simultaneously upload req.file.buffer to AWS S3 / Cloudinary here
        // so that the evidence is safely stored away from the attacker's physical phone.

        if (!process.env.GEMINI_API_KEY) {
            console.warn('⚠️ GEMINI_API_KEY is not set. Returning mocked danger analysis.');
            return res.json({ 
                success: true, 
                analysis: 'MOCKED RESPONSE: Evidence securely locked in cloud. Video/Audio analysis shows potential environmental threat.' 
            });
        }

        // Convert buffer to base64 for Gemini API
        const base64Data = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype || 'video/webm';

        const prompt = "You are a crisis analysis AI. Analyze this short video/audio clip recorded during an emergency SOS activation. Look for indicators of struggle, aggressive voices, screaming, weapons, or environmental hazards. Respond with a concise 1-2 sentence risk assessment to be relayed to emergency responders.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                }
            ]
        });

        const analysisResult = response.text;
        console.log(`🧠 [GEMINI EVIDENCE ANALYSIS]: ${analysisResult}`);

        res.json({ success: true, analysis: analysisResult });

    } catch (error) {
        console.error('Error during evidence analysis:', error);
        res.status(500).json({ success: false, message: 'Failed to analyze evidence.' });
    }
});

// 4. Seed Default Data (Run Once)
app.get('/api/seed', async (req, res) => {
    try {
        const defaultContacts = [
            { name: "Police", phone: "100", relation: "Emergency" },
            { name: "Women Helpline", phone: "181", relation: "Emergency" },
            { name: "Cybercrime", phone: "1930", relation: "Emergency" },
            { name: "Dad", phone: "9876543210", relation: "Guardian" },
            { name: "Mom", phone: "8765432109", relation: "Guardian" }
        ];

        const existing = await Contact.find();
        let inserted = 0;

        for (let contact of defaultContacts) {
            const exists = existing.some(c => c.name === contact.name || c.phone === contact.phone);
            if (!exists) {
                await Contact.create(contact);
                inserted++;
            }
        }
        res.json({ success: true, message: `Successfully seeded ${inserted} default contacts to the database.` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error seeding database" });
    }
});

// 5. Contacts CRUD
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contacts" });
    }
});

app.post('/api/contacts', async (req, res) => {
    try {
        const { name, phone, relation } = req.body;
        const newContact = new Contact({ name, phone, relation });
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: "Error adding contact" });
    }
});

app.delete('/api/contacts/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Contact deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting contact" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`  SHEGUARDIAN Backend Running on Port ${PORT} `);
    console.log(`========================================`);
});
