# 🛡️ SHEGUARDIAN - Advanced AI Women's Safety Companion

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

## Overview
**SheGuardian** is a futuristic, highly innovative full-stack mobile-first web application designed as a comprehensive 3rd-year academic project. It serves as an advanced safety companion engineered to provide immediate assistance, proactive environmental protection, and AI-driven threat analysis in critical situations.

Unlike standard safety apps, SheGuardian utilizes hardware-level browser APIs (Camera, Microphone, GPS, Wake-locks, Strobe lights) and real-time AI to ensure maximum user protection.

---

## 🚀 Live Deployment Links
* **Frontend App:** [https://she-guardian-2026.vercel.app](https://she-guardian-2026.vercel.app)
* **Backend API:** *Hosted on Render/Railway*

---

## 🛠️ Tech Stack
* **Frontend:** React.js + Vite, Framer Motion, Tailwind CSS (Antigravity Glassmorphism UI)
* **Backend:** Node.js, Express.js, Multer
* **Database:** MongoDB (Mongoose ORM)
* **AI Integration:** Google Gemini 2.5 Flash API (for Audio/Video Threat Analysis)

---

## ✨ Core Modules & Advanced Features

### 1. 🚨 Smart SOS Interface & Offline Fallback
A one-tap emergency activation system that simulates logging an alert with the current location. 
* **Offline Fallback**: If the internet disconnects during an emergency, the app catches the fetch failure and automatically opens the native SMS app pre-filled with exact GPS coordinates to send via standard carrier towers.
* **Hardware Deterrence**: On activation, it automatically requests maximum screen brightness, engages a Wake-Lock to keep the phone alive, and flashes the camera's torch in a high-frequency strobe pattern to disorient attackers.

### 2. 🤖 Gemini Cloud Evidence Locker
When the SOS is triggered, the app silently accesses the phone's camera and microphone using the WebRTC/MediaRecorder API. It streams video/audio chunks directly to the backend where **Google Gemini 2.5 AI** analyzes the feed for screams, aggressive voices, or weapons. This ensures encrypted evidence is saved to the cloud even if the physical device is destroyed.

### 3. 🎙️ "Whisper Mode" Voice Trigger
Using the Web Speech API, users can toggle on "Whisper Mode" when walking alone. The browser passively listens for custom safe phrases (e.g., *"help me"*, *"code red"*). If detected, it programmatically triggers the SOS panic sequence entirely hands-free.

### 4. 🗺️ Safe Zone Heatmap & Crowdsourced Reporting
A dynamic map visualizing the safety levels of nearby areas. Users can actively drop "Danger Pins" to report issues like broken streetlights or harassment-prone zones, which render as glowing red heatmaps to warn the community.

### 5. 🔀 Route Deviation "Shadow Tracker"
A background logic module that monitors GPS coordinates every 2 minutes. If a significant deviation from a route is detected, or if the user fails to check-in after 10 minutes, the app triggers an automatic "Are you okay?" countdown. Failure to respond triggers an automatic SOS dispatch.

### 6. 🥷 Stealth Exit & Fake Call UI
* **Stealth Exit**: A discreet weather icon that instantly redirects the browser to a harmless Google News page, wiping the safety app from view to protect against coercive attackers.
* **Fake Call**: Generates an incredibly realistic incoming call screen with pre-recorded high-quality audio simulating a friend arriving, designed to de-escalate uncomfortable situations.

---

## 💻 How to Run Locally

### Prerequisites
* Node.js installed
* MongoDB installed and running locally on port 27017
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/SunilSubramanian02/she-guardian-2026.git
cd she-guardian-2026
```

### 2. Start the Backend Server
```bash
cd backend
npm install
# Create a .env file and add MONGO_URI, PORT, and GEMINI_API_KEY
npm start
```
*The server will run on http://localhost:5000*

### 3. Start the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The React app will start on http://localhost:5173*

---

## 🔮 Future Improvements (Beyond 3rd Year Scope)
* **Bluetooth IoT Integration**: Connect the web application via WebBluetooth API to physical wearable panic rings/buttons.
* **Live WebSocket Tracking**: Upgrade the 2-minute interval tracking to continuous real-time WebSocket location streaming for emergency contacts during an active SOS.
