# Digital Electronics Quiz Backend (Java/Spring Boot)

## Overview
Spring Boot REST API for Digital Electronics Learning Platform with PostgreSQL/Supabase database.

## Tech Stack
- **Java**: 17
- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL (Supabase)
- **Build Tool**: Maven
- **ORM**: Spring Data JPA / Hibernate

## Prerequisites
- Java 17 or higher
- Maven 3.6+
- Supabase account (already configured)

## Configuration
All database credentials are configured in `src/main/resources/application.properties`:
- Database URL: `jdbc:postgresql://db.fhttozvplleogncrjjze.supabase.co:5432/postgres`
- Server Port: `5000`
- Context Path: `/api`

## Running the Application

### Option 1: Using Maven Wrapper (Recommended)
```bash
cd backend-java
./mvnw clean install
./mvnw spring-boot:run
```

### Option 2: Using Maven
```bash
cd backend-java
mvn clean install
mvn spring-boot:run
```

### Option 3: Run JAR directly
```bash
cd backend-java
mvn clean package
java -jar target/quiz-backend-1.0.0.jar
```

## API Endpoints

### Base URL
`http://localhost:5000/api`

### Health Check
- `GET /api/health` - Check API status
- `GET /api/` - API information

### User/Profile
- `GET /api/user/profiles` - Get all profiles
- `GET /api/user/profile/{id}` - Get profile by ID
- `GET /api/user/profile/email/{email}` - Get profile by email
- `POST /api/user/profile` - Create new profile
- `PUT /api/user/profile/{id}` - Update profile
- `DELETE /api/user/profile/{id}` - Delete profile
- `GET /api/user/stats/{userId}` - Get user stats

### Quiz
- `GET /api/quiz/all` - Get all quizzes
- `GET /api/quiz/published` - Get published quizzes
- `GET /api/quiz/{id}` - Get quiz by ID
- `GET /api/quiz/category/{category}` - Get quizzes by category
- `GET /api/quiz/difficulty/{difficulty}` - Get quizzes by difficulty
- `POST /api/quiz/create` - Create new quiz
- `PUT /api/quiz/{id}` - Update quiz
- `DELETE /api/quiz/{id}` - Delete quiz
- `GET /api/quiz/{quizId}/questions` - Get quiz questions
- `POST /api/quiz/{quizId}/questions` - Add question to quiz
- `DELETE /api/quiz/questions/{questionId}` - Delete question

### Quiz Attempts
- `GET /api/attempts/all` - Get all attempts
- `GET /api/attempts/{id}` - Get attempt by ID
- `GET /api/attempts/user/{userId}` - Get user attempts
- `GET /api/attempts/user/{userId}/completed` - Get completed attempts
- `GET /api/attempts/quiz/{quizId}` - Get quiz attempts
- `GET /api/attempts/quiz/{quizId}/top-scores` - Get top scores
- `POST /api/attempts/start` - Start new attempt
- `PUT /api/attempts/{attemptId}/submit` - Submit attempt
- `DELETE /api/attempts/{id}` - Delete attempt

### Leaderboard
- `GET /api/leaderboard/top?limit=10` - Get top users by points
- `GET /api/leaderboard/streaks?limit=10` - Get top users by streak

## Database Setup

### Step 1: Create Tables
Run the SQL script in Supabase SQL Editor:
1. Go to https://supabase.com/dashboard
2. Open SQL Editor
3. Copy content from `supabase-tables-setup.sql` (in project root)
4. Run the script

### Step 2: Verify Connection
The application will automatically connect on startup. Check logs for:
```
✅ Connected to Supabase PostgreSQL successfully
```

## Project Structure
```
backend-java/
├── src/
│   └── main/
│       ├── java/com/digitalelectronics/quiz/
│       │   ├── QuizApplication.java (Main)
│       │   ├── config/
│       │   │   └── SecurityConfig.java
│       │   ├── controller/
│       │   │   ├── HealthController.java
│       │   │   ├── UserController.java
│       │   │   ├── QuizController.java
│       │   │   ├── QuizAttemptController.java
│       │   │   └── LeaderboardController.java
│       │   ├── model/
│       │   │   ├── Profile.java
│       │   │   ├── Quiz.java
│       │   │   ├── Question.java
│       │   │   └── QuizAttempt.java
│       │   ├── repository/
│       │   │   ├── ProfileRepository.java
│       │   │   ├── QuizRepository.java
│       │   │   ├── QuestionRepository.java
│       │   │   └── QuizAttemptRepository.java
│       │   └── service/
│       │       ├── ProfileService.java
│       │       ├── QuizService.java
│       │       └── QuizAttemptService.java
│       └── resources/
│           └── application.properties
├── pom.xml
└── README.md
```

## Development

### Hot Reload
Spring Boot DevTools is included. Changes will auto-reload during development.

### Logging
- Default level: INFO
- Application level: DEBUG
- SQL queries: Enabled (formatted)

### CORS
Configured origins:
- http://localhost:8000
- http://localhost:3000
- http://127.0.0.1:8000

## Testing

### Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

### Test Get Published Quizzes
```bash
curl http://localhost:5000/api/quiz/published
```

## Troubleshooting

### Port Already in Use
Change port in `application.properties`:
```properties
server.port=8080
```

### Database Connection Issues
1. Check Supabase project is active
2. Verify credentials in `application.properties`
3. Check firewall allows outbound PostgreSQL (port 5432)

### Maven Build Errors
```bash
mvn clean install -U
```

## Migration from Node.js
This Java backend replaces the previous Node.js backend. Key differences:
- ✅ Strong typing with Java
- ✅ Built-in JPA/Hibernate ORM
- ✅ Enterprise-grade Spring ecosystem
- ✅ Better performance and scalability
- ✅ No need for separate database driver installation

## Next Steps
1. Run the SQL setup script in Supabase
2. Start the backend: `./mvnw spring-boot:run`
3. Test endpoints using browser or Postman
4. Update frontend API calls to use Java backend URLs
