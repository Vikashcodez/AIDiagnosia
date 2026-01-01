# Google OAuth Setup Guide

## Steps to Enable Google Login

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API for your project

### 2. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application** as the application type
4. Add the following to **Authorized JavaScript origins**:
   - `http://localhost:8080`
   - `http://localhost:5000`
5. Add the following to **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback`
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

### 3. Update Backend Environment Variables

Open `backend/.env` and update the following variables:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your_strong_session_secret_here
```

### 4. Update Frontend URL (if needed)

Make sure your frontend URL matches in the backend `.env`:

```env
FRONTEND_URL=http://localhost:8080
```

### 5. Restart Backend Server

After updating the environment variables, restart your backend server:

```bash
cd backend
npm run dev
```

### 6. Test Google Login

1. Open your frontend application
2. Go to the Login or Register page
3. Click "Sign in with Google" or "Sign up with Google"
4. Complete the Google authentication flow
5. You should be redirected back to your application and logged in

## How It Works

1. User clicks "Sign in with Google" button
2. User is redirected to Google OAuth consent screen
3. After approval, Google redirects to `http://localhost:5000/api/auth/google/callback`
4. Backend verifies the authentication and creates/finds user in database
5. Backend generates JWT token and redirects to frontend with token
6. Frontend stores token and logs user in

## Security Notes

- Never commit your `.env` file with real credentials
- Use strong, random values for `SESSION_SECRET`
- In production, update URLs to use HTTPS
- Add your production domains to Google Cloud Console authorized origins/redirect URIs
