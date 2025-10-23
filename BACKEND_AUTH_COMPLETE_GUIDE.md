# Backend Authentication System - Complete Guide

## Overview
Authentication has been completely moved from Supabase Auth (frontend) to Java Spring Boot backend. Users now register and login through your backend API, which stores credentials securely in the Supabase PostgreSQL database.

---

## What Changed

### ✅ Backend (Java Spring Boot)

#### New Files Created:
1. **User.java** - User entity with password hash
2. **UserRepository.java** - JPA repository for users
3. **AuthService.java** - Authentication logic (register, login, token validation)
4. **AuthController.java** - REST API endpoints for auth
5. **LoginRequest.java** - DTO for login
6. **RegisterRequest.java** - DTO for registration
7. **AuthResponse.java** - DTO for auth responses

#### Key Features:
- ✅ User registration with password hashing (BCrypt)
- ✅ User login with email/password
- ✅ Automatic profile creation on registration
- ✅ Simple token generation (can upgrade to JWT later)
- ✅ CORS enabled for frontend access

### ✅ Frontend (JavaScript)

#### Files Modified:
1. **auth.js** - Now uses backend `/auth/login` API
2. **signup.js** - Now uses backend `/auth/register` API
3. **login.html** - Removed Supabase JS, added health check
4. **signup.html** - Removed Supabase JS, added health check
5. **backend-health-check.js** - New utility to check backend status

#### Key Changes:
- ❌ Removed Supabase Auth client calls
- ❌ Removed OAuth (Google login) - can be added back later
- ✅ Added backend health checking
- ✅ Login/signup forms disabled until backend is running
- ✅ Session management with tokens stored in localStorage
- ✅ Clear error messages from backend

---

## Database Schema

### `users` table (new)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### `profiles` table (existing)
- Auto-created when user registers
- Links to `users.id`
- Stores quiz stats and progress

---

## API Endpoints

### 1. Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Success Response (201):**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "token": "base64-encoded-token"
}
```

**Error Response (400):**
```json
{
  "message": "Email already registered"
}
```

### 2. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "token": "base64-encoded-token"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

### 3. Validate Token
```http
GET /auth/validate
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "valid": true,
  "email": "user@example.com"
}
```

---

## How to Use

### 1. Start the Backend

```powershell
cd "c:\Users\THIS PC\OneDrive\Desktop\Coa-project-unit1-learning-app-main\backend-java"
mvn clean package -DskipTests
mvn spring-boot:run
```

**Wait for:**
```
Started QuizApplication in X seconds (JVM running for Y)
```

### 2. Start the Frontend

Open new terminal:

```powershell
cd "c:\Users\THIS PC\OneDrive\Desktop\Coa-project-unit1-learning-app-main"
python -m http.server 8000
```

### 3. Test Registration

1. Open: http://localhost:8000/signup.html
2. Fill in the form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - ✓ Agree to terms
3. Click "Create Account"
4. Should redirect to index.html if successful

### 4. Test Login

1. Open: http://localhost:8000/login.html
2. Enter credentials:
   - Email: test@example.com
   - Password: password123
3. Click "Sign In"
4. Should redirect to index.html if successful

### 5. Verify in Database

Check Supabase Dashboard:
- Table Editor → `users` → Should see new user
- Table Editor → `profiles` → Should see corresponding profile

---

## Security Features

### ✅ Implemented:
- Password hashing with BCrypt (strength 10)
- CORS protection (only allows localhost origins)
- SQL injection protection (JPA/Hibernate)
- Input validation on backend
- Session tokens stored securely

### 🔄 Future Enhancements:
- JWT tokens with expiration
- Refresh tokens
- Email verification
- Password reset via email
- Account lockout after failed attempts
- OAuth (Google/GitHub) through backend
- Rate limiting on auth endpoints

---

## Troubleshooting

### Backend Won't Start

**Error:** `UnknownHostException: db.fhttozvplleogncrjjze.supabase.co`

**Solutions:**
1. Check internet connection
2. Test DNS: `nslookup db.fhttozvplleogncrjjze.supabase.co`
3. Try Google DNS (8.8.8.8)
4. Disable VPN/firewall temporarily
5. Verify `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://db.fhttozvplleogncrjjze.supabase.co:5432/postgres
   spring.datasource.username=postgres
   spring.datasource.password=XkFzk8kfL2R6xDkH
   ```

### Login/Signup Buttons Disabled

**Reason:** Frontend detected backend is offline

**Solutions:**
1. Start backend with `mvn spring-boot:run`
2. Check backend logs for errors
3. Verify backend is on port 8080
4. Click "🔄 Retry Connection" button on warning banner

### Registration Fails

**Error:** "Email already registered"
- User already exists, try logging in instead

**Error:** "Password must be at least 6 characters"
- Use longer password

**Error:** Network error
- Backend not running or CORS issue
- Check browser console (F12) for details

### Login Fails

**Error:** "Invalid email or password"
- Check credentials
- Verify user exists in `users` table

**Error:** "Account is deactivated"
- Check `is_active` column in database

---

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads signup page
- [ ] Health check shows backend online
- [ ] Can register new user
- [ ] User appears in `users` table
- [ ] Profile auto-created in `profiles` table
- [ ] Can login with registered credentials
- [ ] Token stored in localStorage
- [ ] Redirects to index.html after login
- [ ] Can't register same email twice
- [ ] Password validation works
- [ ] Backend health check auto-retries
- [ ] Forms disabled when backend offline
- [ ] Google login shows "unavailable" message

---

## Migration Notes

### What Was Removed:
- ❌ Supabase Auth SDK from frontend
- ❌ OAuth (Google) login (temporary)
- ❌ Email verification flow
- ❌ Password reset via email
- ❌ Supabase session management

### What Was Added:
- ✅ Custom authentication system
- ✅ Backend API for auth
- ✅ Password hashing in database
- ✅ Backend health checking
- ✅ Simple token-based sessions

### Data Migration:
If you had users in Supabase Auth:
1. No automatic migration available
2. Users need to re-register
3. Or manually migrate data:
   - Export from `auth.users`
   - Hash passwords
   - Import to new `users` table

---

## Configuration

### Backend Port
Edit `application.properties`:
```properties
server.port=8080
```

Update `config.js`:
```javascript
BACKEND_URL: 'http://localhost:8080'
```

### Frontend Port
```powershell
python -m http.server 9000
```

Update backend CORS in `SecurityConfig.java`:
```java
@CrossOrigin(origins = {"http://localhost:9000", ...})
```

---

## Production Deployment

### Backend:
1. Use environment variables for DB credentials
2. Implement JWT with secret key
3. Add HTTPS
4. Update CORS to production domain
5. Add rate limiting
6. Enable email verification
7. Set up logging/monitoring

### Frontend:
1. Update `config.js` with production API URL
2. Use HTTPS
3. Add error tracking (Sentry, etc.)
4. Minify JavaScript
5. Add CSP headers

---

## Support

If you encounter issues:
1. Check backend logs in terminal
2. Check browser console (F12)
3. Verify database connection
4. Test endpoints with Postman/curl
5. Review this guide

**Common Commands:**
```powershell
# Backend logs
mvn spring-boot:run

# Test login endpoint
curl -X POST http://localhost:8080/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"

# Test registration
curl -X POST http://localhost:8080/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"new@example.com\",\"password\":\"password123\",\"fullName\":\"New User\"}"
```

---

## Success!  🎉

You now have a complete backend authentication system with:
- ✅ User registration
- ✅ User login
- ✅ Password hashing
- ✅ Automatic profile creation
- ✅ Health checking
- ✅ Token-based sessions

The login and registration pages will only work when your Java backend is running!
