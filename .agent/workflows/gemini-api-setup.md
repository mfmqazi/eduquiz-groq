---
description: How to get a free Google Gemini API key for AI-generated questions
---

# Getting a Google Gemini API Key

To enable AI-powered, textbook-quality quiz questions, you need a free Google Gemini API key.

## Step 1: Go to Google AI Studio
1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account

## Step 2: Create an API Key
1. Click **"Get API key"** or **"Create API key"**
2. Select **"Create API key in new project"** (or use an existing project)
3. Copy the generated API key

## Step 3: Add to Your .env File
1. Open your `.env` file in the project root
2. Find the line: `VITE_GEMINI_API_KEY=your_gemini_api_key_here`
3. Replace `your_gemini_api_key_here` with your actual API key
4. Save the file

Example:
```env
VITE_GEMINI_API_KEY=AIzaSyABC123...your_actual_key_here
```

## Step 4: Restart the Dev Server
1. Stop the running server (Ctrl+C in terminal)
2. Run `npm run dev` again

## Important Notes
- The free tier includes 60 requests per minute
- This is more than enough for a quiz app
- Keep your API key private (it's in .gitignore by default)
- Questions will now be generated in real-time using AI based on actual curriculum standards

## Fallback Behavior
If no API key is provided, the app will use a basic fallback generator with simple math questions.
