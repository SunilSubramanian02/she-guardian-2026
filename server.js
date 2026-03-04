const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve static HTML/CSS/JS files from the current directory
app.use(express.static(path.join(__dirname)));

// Simulated Data Store for Contacts
const contacts = [
    { id: 1, name: "Dad", phone: "+91 9876543210", relation: "Family" },
    { id: 2, name: "Brother", phone: "+91 9876543211", relation: "Family" }
];

// In-Memory state
let safetyScore = 72;

// --- API Endpoints ---

// 1. Get Safety Score
app.get('/api/safety-score', (req, res) => {
    // Generate a slightly randomized score for realism
    const currentScore = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
    safetyScore = currentScore;

    // Simulate slight network delay
    setTimeout(() => {
        res.json({ score: safetyScore, status: "Safe", riskLevel: "Low" });
    }, 500);
});

// 2. Trigger SOS
app.post('/api/sos', (req, res) => {
    const { location, timestamp } = req.body || {};
    console.log(`\n[ALERT] SOS Triggered at ${location || 'Unknown Location'} on ${timestamp || new Date().toISOString()}`);
    console.log(`Dispatching alerts to ${contacts.length} emergency contacts...`);

    // Simulate dispatch delay
    setTimeout(() => {
        console.log(`[SUCCESS] Alerts Dispatched.`);
        res.json({
            success: true,
            message: "Simulated alert sent to emergency contacts & nearby authorities.",
            dispatched: true
        });
    }, 2000);
});

// 3. Find Safest Route
app.post('/api/route', (req, res) => {
    const { start, destination } = req.body || {};
    console.log(`\n[ROUTE] Calculating safe route from ${start || 'Current Location'} to ${destination || 'Unknown'}`);

    // Simulate calculation delay
    setTimeout(() => {
        console.log(`[SUCCESS] Route calculated safely.`);
        res.json({
            success: true,
            message: "Safest route found avoiding high-risk zones.",
            eta: "15 mins"
        });
    }, 1500);
});

// 4. Get Contacts
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

// Add a test route
app.get('/api/ping', (req, res) => {
    res.json({ message: "pong" });
});

// Start the Express Server
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(` SHEGUARDIAN Backend Server Started! `);
    console.log(`========================================`);
    console.log(` Running on: http://localhost:${PORT}`);
    console.log(`========================================\n`);
});
