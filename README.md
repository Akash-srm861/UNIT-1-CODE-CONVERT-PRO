# Digital Electronics Learning Platform - CodeConvert Pro

## 🚀 Project Overview
A comprehensive learning platform for digital electronics with interactive quizzes, progress tracking, leaderboards, and authentication.

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Supabase JS Client for authentication
- Python HTTP server (development)

### Backend
- **Java 17** + **Spring Boot 3.2.0**
- PostgreSQL via **Supabase**
- Spring Data JPA / Hibernate
- Maven

### Database
- **Supabase PostgreSQL**
- Email/Password + Google OAuth authentication

## ⚡ Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Python 3.x
- Internet connection

### 1️⃣ Database Setup
```bash
1. Go to https://supabase.com/dashboard
2. Open SQL Editor
3. Run: supabase-tables-setup.sql
4. Verify tables in Table Editor
```

### 2️⃣ Start Backend (Java)
```powershell
cd backend-java
mvn clean install
mvn spring-boot:run
```
**Backend**: http://localhost:5000/api

### 3️⃣ Start Frontend
```powershell
python -m http.server 8000
```
**Frontend**: http://localhost:8000

### 4️⃣ Access App
1. Open: http://localhost:8000/landing.html
2. Sign up or login
3. Start learning!

## 📁 Project Structure
```
├── backend-java/          # Spring Boot REST API
│   ├── src/main/java/
│   │   └── com/digitalelectronics/quiz/
│   │       ├── QuizApplication.java
│   │       ├── config/      # Security, CORS
│   │       ├── controller/  # REST endpoints
│   │       ├── model/       # JPA entities
│   │       ├── repository/  # Data access
│   │       └── service/     # Business logic
│   └── pom.xml
├── landing.html           # Public page
├── login.html / signup.html
├── index.html             # Main app (protected)
├── supabase-config.js     # Config
└── supabase-tables-setup.sql
```

## 🔌 API Endpoints
**Base URL**: `http://localhost:5000/api`

- `GET /health` - Health check
- `GET /quiz/published` - Get quizzes
- `POST /attempts/start` - Start quiz
- `PUT /attempts/{id}/submit` - Submit answers
- `GET /leaderboard/top` - Leaderboard
- `GET /user/profile/{id}` - User profile

## ✨ Features
✅ Supabase Authentication (Email + Google OAuth)  
✅ Protected Routes  
✅ Interactive Quizzes  
✅ Progress Tracking & Streaks  
✅ Leaderboard  
✅ Responsive Design  

## 🔧 Troubleshooting

### Connection Error (UnknownHostException)
```powershell
# Check DNS
ping db.fhttozvplleogncrjjze.supabase.co

# Try Google DNS: 8.8.8.8
# Disable VPN
# Check firewall (allow port 5432)
```

### Port in Use
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Tables Missing
Run `supabase-tables-setup.sql` in Supabase SQL Editor

## 📝 License
MIT License

---
**Developed by Tamil Techies Hub** | v1.0.0
