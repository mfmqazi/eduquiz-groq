---
description: How to set up Firebase for the EduQuiz application
---

# Firebase Setup Guide

To make the application work, you need to set up a Firebase project and configure the environment variables.

## Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the setup steps.
3. Once the project is created, enable **Authentication**:
   - Go to **Build** > **Authentication** > **Get Started**.
   - Enable **Email/Password** provider.
4. Enable **Firestore Database**:
   - Go to **Build** > **Firestore Database** > **Create Database**.
   - Start in **Test mode** (for development purposes).

## Step 2: Get Configuration
1. In your project settings (gear icon > Project settings), scroll down to **Your apps**.
2. Click the **Web** icon (</>) to create a web app.
3. Register the app (you can ignore the hosting setup for now).
4. You will see a configuration object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

## Step 3: Configure Environment Variables
1. Create a file named `.env` in the root of your project (same level as `package.json`).
2. Copy the following content into it, replacing the values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 4: Restart Development Server
After creating the `.env` file, you must restart the development server for the changes to take effect:
1. Stop the running server (Ctrl+C).
2. Run `npm run dev` again.
