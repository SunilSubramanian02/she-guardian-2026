# SHEGUARDIAN - AI Inspired Women Safety Companion 2026

## Overview
**Women Safety Platform** is a futuristic, highly innovative full-stack web application designed for a Social Impact Hackathon. It serves as a comprehensive safety companion designed to provide immediate assistance and proactive protection in critical situations.

## Tech Stack
- **Frontend:** React.js + Vite, styled-components, CSS3 Glassmorphism UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Deployment:** [Frontend URL Placeholder], [Backend URL Placeholder]

## Core Modules Built

1.  **Smart SOS Interface:** A one-tap emergency activation system that immediately simulates logging an alert with the current location and time to the database.
2.  **Safe Zone Heatmap & Navigator:** Visualizes safety levels of areas and algorithmically calculates the safest route avoiding high-risk zones.
3.  **Digital Safety Shield Score:** Calculates a dynamic safety score based on live environmental data, providing real-time risk assessment.
4.  **Emergency Contact Vault:** A secure, CRUD-enabled repository to manage trusted emergency contacts directly linked to the MongoDB database.
5.  **Empowerment Hub & Defense Tools:** A library of resources including defense strategies, legal rights, and psychological support guides.
6.  **Emergency Simulation Mode:** A toggleable interface theme that simulates an active emergency environment, demonstrating the application's responsiveness under stress.

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB installed and running locally on port `27017`
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/women-safety-platform.git
cd women-safety-platform
```

### 2. Start the Backend Server (Express + MongoDB)
```bash
cd backend
npm install
# Create a .env file and add MONGO_URI and PORT if needed, or rely on defaults.
npm start
```
*The server will run on `http://localhost:5000`*

### 3. Start the Frontend (Vite + React)
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The React app will likely start on `http://localhost:5173`*

## Live Deployment Links
- **Frontend App:** [Insert Vercel/Netlify Link Here]
- **Backend API:** [Insert Render/Railway Link Here]

## Future Improvements
- **Live Location Tracking:** Implement WebSockets for continuous real-time location streaming during an active SOS.
- **AI Voice Activation:** Trigger SOS using completely hands-free voice commands.
- **Community Threat Reporting:** Allow users to anonymously report and verify local safety incidents on the map.
- **Hardware Integration:** Connect with physical IoT wearable panic buttons via Bluetooth.
