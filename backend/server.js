const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Contact = require('./models/Contact');
const Alert = require('./models/Alert');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sheguardian';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Desktop/Local'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

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

// 4. Contacts CRUD
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
