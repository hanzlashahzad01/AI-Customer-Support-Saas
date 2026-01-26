# Perfect Pick AI - Customer Support SaaS

## Overview
A MERN Stack AI Customer Support & Ticketing Platform.

## Features implemented
- 🔐 **Authentication**: JWT, Role-based (Admin, User), Login/Register UI.
- 🎨 **Premium UI**: Tailwind CSS, Glassmorphism, Responsive Dashboard.
- 🤖 **AI Chatbot**: Configurable Bot (Name, Tone), AI Stub Integration.
- 💬 **Live Chat**: Socket.io real-time messaging, Chat Widget.
- 📊 **Dashboard**: Statistics, Charts (Recharts).

## Requirements
- Node.js
- MongoDB (running locally or URI in .env)

## Setup & Run

### 1. Server (Backend)
```bash
cd server
npm install
npm run dev
```
Server runs on http://localhost:5000

### 2. Client (Frontend)
```bash
cd client
npm install
npm run dev
```
Client runs on http://localhost:5173

## Environment Variables
Check `server/.env` to configure MongoDB URI and OpenAI API Key.

## Usage
1. Register a new account (creates a Company Admin).
2. Go to Dashboard -> Bot Builder to configure your bot.
3. Access the Chat Widget at `/widget/YOUR_COMPANY_ID`.
