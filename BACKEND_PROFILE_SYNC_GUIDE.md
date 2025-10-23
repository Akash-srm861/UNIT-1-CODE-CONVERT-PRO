# Backend Profile Sync - Setup Guide

## What's New

I've implemented a secure backend endpoint to handle user profile creation after signup. This eliminates the need for client-side database writes and ensures data consistency.

## Architecture

### Flow:
1. User signs up through Supabase (frontend)
2. Supabase creates auth user in `auth.users`
3. Frontend calls backend endpoint `/user/profile/sync`
4. Backend creates/updates profile in `profiles` table
5. User is redirected to the app

### Benefits:
- ✅ More secure (backend controls database writes)
- ✅ Works even if RLS blocks client writes
- ✅ Handles both email/password and OAuth signups
- ✅ Automatic upsert (no duplicate errors)
- ✅ Consistent data format

## Files Changed

### Backend (Java)
1. **CreateProfileRequest.java** - DTO for profile sync request
2. **ProfileService.java** - Added `createOrUpdateProfileAfterSignup()` method
3. **UserController.java** - Added `POST /user/profile/sync` endpoint

### Frontend (JavaScript)
1. **config.js** - New configuration file for backend URL
2. **signup.js** - Calls backend after successful signup
3. **auth.js** - Syncs profile on login (for OAuth users)
4. **signup.html** - Added config.js script tag
5. **login.html** - Added config.js script tag

## How to Test

### 1. Start the Backend

```powershell
cd "c:\Users\THIS PC\OneDrive\Desktop\Coa-project-unit1-learning-app-main\backend-java"
mvn spring-boot:run
```

Wait for: `Started QuizApplication in X seconds`

### 2. Start the Frontend

Open a new terminal:

```powershell
cd "c:\Users\THIS PC\OneDrive\Desktop\Coa-project-unit1-learning-app-main"
python -m http.server 8000
```

### 3. Test Signup Flow

1. Open browser: http://localhost:8000/signup.html
2. Open DevTools (F12) → Console tab
3. Sign up with a new email
4. Watch console for:
   ```
   Syncing profile with backend for user: your@email.com
   Profile synced successfully: { id: ..., email: ..., fullName: ... }
   ```
5. Check Supabase Dashboard → Table Editor → `profiles`
   - You should see the new profile row

### 4. Test Google OAuth

1. Go to http://localhost:8000/login.html
2. Click "Sign in with Google"
3. After redirect, check console for profile sync message
4. Verify profile created in Supabase

## API Documentation

### POST /user/profile/sync

Creates or updates a user profile after authentication.

**Request:**
```json
{
  "userId": "uuid-from-supabase-auth",
  "email": "user@example.com",
  "fullName": "John Doe",
  "avatarUrl": "https://..." // optional
}
```

**Response (Success):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "avatarUrl": null,
  "totalPoints": 0,
  "quizzesCompleted": 0,
  "currentStreak": 0,
  "longestStreak": 0,
  "lastQuizDate": null,
  "createdAt": "2025-10-23T12:00:00",
  "updatedAt": "2025-10-23T12:00:00"
}
```

**Response (Error):**
```json
{
  "message": "Error description"
}
```

## Troubleshooting

### Backend Not Starting

**Error:** `UnknownHostException: db.fhttozvplleogncrjjze.supabase.co`

**Solutions:**
1. Check your internet connection
2. Try changing DNS to Google's DNS (8.8.8.8)
3. Disable VPN/firewall temporarily
4. Verify Supabase credentials in `application.properties`

### Profile Not Created

**Check:**
1. Backend console logs for errors
2. Browser console (F12) for sync errors
3. Network tab for failed API calls
4. Verify backend is running on port 8080

**Common Issues:**
- Backend not running → Start it with `mvn spring-boot:run`
- CORS error → Backend allows localhost:8000 by default
- Database connection error → Check Supabase credentials

### Alternative: Manual SQL Setup

If backend connectivity fails, you can create tables manually:

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Open the file: `supabase-tables-setup.sql`
4. Copy all content
5. Paste in SQL Editor
6. Click "Run"

This creates:
- Tables (profiles, quizzes, questions, quiz_attempts)
- RLS policies
- Database trigger (auto-creates profiles on signup)

## Configuration

### Change Backend Port

Edit `backend-java/src/main/resources/application.properties`:
```properties
server.port=8080
```

Then update `config.js`:
```javascript
BACKEND_URL: 'http://localhost:8080',
```

### Change Frontend Port

```powershell
python -m http.server 9000  # Use port 9000 instead
```

Then update backend CORS in `SecurityConfig.java`:
```java
@CrossOrigin(origins = {"http://localhost:9000", ...})
```

## Next Steps

1. **Test the complete flow:**
   - Signup → Profile created
   - Login → Profile synced
   - Google OAuth → Profile created

2. **Verify database:**
   - Check Supabase Dashboard
   - Ensure profiles table exists
   - Verify RLS policies work

3. **Production setup:**
   - Update `config.js` with production backend URL
   - Update CORS in `SecurityConfig.java`
   - Set up environment variables

## Support

If you encounter any issues:
1. Check console logs (both frontend and backend)
2. Verify all services are running
3. Check network connectivity
4. Review Supabase credentials
