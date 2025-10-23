package com.digitalelectronics.quiz.controller;

import com.digitalelectronics.quiz.dto.AuthResponse;
import com.digitalelectronics.quiz.dto.LoginRequest;
import com.digitalelectronics.quiz.dto.RegisterRequest;
import com.digitalelectronics.quiz.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:8000", "http://127.0.0.1:5500", "http://127.0.0.1:5501"})
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            log.info("Registration request received for: {}", request.getEmail());
            
            // Validate input
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Email is required"));
            }
            
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Password is required"));
            }
            
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (RuntimeException e) {
            log.error("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Registration error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Registration failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            log.info("Login request received for: {}", request.getEmail());
            
            // Validate input
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Email is required"));
            }
            
            if (request.getPassword() == null || request.getPassword().isBlank()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Password is required"));
            }
            
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Login error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Login failed: " + e.getMessage()));
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            var user = authService.validateToken(token);
            return ResponseEntity.ok(new ValidateResponse(true, user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ValidateResponse(false, null));
        }
    }
    
    // Error response DTO
    private record ErrorResponse(String message) {}
    
    // Validate response DTO
    private record ValidateResponse(boolean valid, String email) {}
}
