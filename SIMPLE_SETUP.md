# Simple Setup - Backend Auth with Supabase Database

## What We Did

Simplified your app to use:
- ✅ **Java Spring Boot backend** (port 5000) for authentication
- ✅ **Supabase PostgreSQL database** for data storage
- ✅ **Simple username/password** login (no email verification, no OAuth)
- ✅ **Removed** all unnecessary files (Supabase JS client, health checks, config files)

## How It Works

1. **Frontend** (login.html, signup.html) → calls backend API
2. **Backend** (Java Spring Boot) → authenticates users & stores in Supabase database
3. **Database** (Supabase PostgreSQL) → stores users and profiles

## Files Structure

### Frontend (Kept Simple)
- `login.html` - Login page
- `signup.html` - Registration page
- `auth-simple.js` - Simple login logic
- `signup-simple.js` - Simple registration logic
- `index.html` - Main quiz app
- `script.js` - Quiz functionality

### Backend (Java)
- `backend-java/` - Spring Boot application
  - `AuthController.java` - Login/Register endpoints
  - `UserController.java` - User profile management
  - `AuthService.java` - Authentication logic
  - `User.java` & `Profile.java` - Database models

### Removed Files
- ❌ `supabase-config.js` - Not needed (backend handles DB)
- ❌ `backend-health-check.js` - Removed complexity
- ❌ `config.js` - Not needed (direct URL in JS)
- ❌ `auth.js` & `signup.js` - Replaced with simpler versions

## How to Use

### 1. Start Backend
```powershell
cd backend-java
mvn spring-boot:run
```
**Backend runs on:** http://localhost:5000/api

### 2. Start Frontend
```powershell
python -m http.server 5500
```
**Frontend runs on:** http://127.0.0.1:5500

### 3. Test It
1. Open http://127.0.0.1:5500/signup.html
2. Create an account (any email format, password 6+ chars)
3. You'll be auto-logged in and redirected to index.html
4. Your data is stored in Supabase database

## API Endpoints

### POST /api/auth/register
Register new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### POST /api/auth/login
Login existing user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "token": "base64-token"
}
```

## Database Tables

### users
- id (UUID, primary key)
- email (unique)
- password_hash
- full_name
- is_active
- created_at, updated_at

### profiles
- id (UUID, references users)
- email
- full_name
- total_points
- quizzes_completed
- current_streak
- created_at, updated_at

## Troubleshooting

### Backend won't start
- Check if port 5000 is free
- Verify Supabase database credentials in `application.properties`
- Check network/firewall for database connection

### Login/Register not working
- Open browser DevTools (F12) → Console
- Check for fetch errors
- Verify backend is running on port 5000
- Check CORS errors (backend allows 127.0.0.1:5500, localhost:5500)

### CORS Error
Backend already configured for:
- http://localhost:5500
- http://127.0.0.1:5500
- http://127.0.0.1:5501
- http://localhost:8000

## Next Steps

1. ✅ Backend is running
2. ✅ Database connected (Supabase)
3. ✅ Simple auth working
4. Test registration and login
5. Build your quiz features!

## No More Complexity!
- No Supabase JS client
- No email verification
- No OAuth/Google login
- No health checks
- Just simple username/password → backend → database
