package com.digitalelectronics.quiz.service;

import com.digitalelectronics.quiz.dto.AuthResponse;
import com.digitalelectronics.quiz.dto.LoginRequest;
import com.digitalelectronics.quiz.dto.RegisterRequest;
import com.digitalelectronics.quiz.model.Profile;
import com.digitalelectronics.quiz.model.User;
import com.digitalelectronics.quiz.repository.ProfileRepository;
import com.digitalelectronics.quiz.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getEmail());
        
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Validate password
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }
        
        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setIsActive(true);
        user.setEmailVerified(true); // Auto-verify for now
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        user = userRepository.save(user);
        log.info("User created with ID: {}", user.getId());
        
        // Create corresponding profile
        Profile profile = new Profile();
        profile.setId(user.getId());
        profile.setEmail(user.getEmail());
        profile.setFullName(user.getFullName());
        profile.setTotalPoints(0);
        profile.setQuizzesCompleted(0);
        profile.setCurrentStreak(0);
        profile.setLongestStreak(0);
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());
        
        profileRepository.save(profile);
        log.info("Profile created for user: {}", user.getEmail());
        
        // Generate simple token (user ID for now - you can implement JWT later)
        String token = generateToken(user);
        
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            token
        );
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for user: {}", request.getEmail());
        
        // Find user
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Check if user is active
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("User logged in successfully: {}", user.getEmail());
        
        // Generate token
        String token = generateToken(user);
        
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            token
        );
    }
    
    private String generateToken(User user) {
        // Simple token: base64(userId:email:timestamp)
        // In production, use JWT with proper signing
        String tokenData = user.getId() + ":" + user.getEmail() + ":" + System.currentTimeMillis();
        return java.util.Base64.getEncoder().encodeToString(tokenData.getBytes());
    }
    
    public User validateToken(String token) {
        try {
            String decoded = new String(java.util.Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            if (parts.length >= 2) {
                UUID userId = UUID.fromString(parts[0]);
                return userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Invalid token"));
            }
        } catch (Exception e) {
            log.error("Token validation failed", e);
        }
        throw new RuntimeException("Invalid token");
    }
}
