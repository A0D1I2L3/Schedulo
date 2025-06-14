# Schedulo


Schedulo is a lightweight event management system designed to make event registration and participation smooth, fast, and reliable.

## Features

- Firebase Authentication for secure sign-in
- Register for events effortlessly
- Host events with unique event IDs
- Check and view participant details
- Clean, minimal dark UI design

## Tech Stack

- Frontend: React
- Styling: CSS 
- Backend: Firebase Authentication & Firestore Database

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/A0D1I2L3/Schedulo.git
cd Schedulo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

- Create a Firebase project at [https://firebase.google.com](https://firebase.google.com)
- Enable Authentication (Email/Password)
- Set up Firestore Database
- Copy your Firebase config and create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Replace the placeholders with your actual Firebase credentials.

### 4. Run the App

```bash
npm run dev
```

The app will run locally at [http://localhost:5173](http://localhost:5173)


Made with care using Schedulo.
