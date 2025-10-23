package com.digitalelectronics.quiz.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:8000", "http://127.0.0.1:5500", "http://127.0.0.1:5501"})
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Digital Electronics Quiz API is running");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", "UP");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "🧮 Digital Electronics Learning Platform API");
        response.put("version", "1.0.0");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("health", "/api/health");
        endpoints.put("user", "/api/user");
        endpoints.put("quiz", "/api/quiz");
        endpoints.put("attempts", "/api/attempts");
        endpoints.put("leaderboard", "/api/leaderboard");
        
        response.put("endpoints", endpoints);
        
        return ResponseEntity.ok(response);
    }
}
