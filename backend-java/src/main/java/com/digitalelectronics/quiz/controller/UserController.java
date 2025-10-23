package com.digitalelectronics.quiz.controller;

import com.digitalelectronics.quiz.dto.CreateProfileRequest;
import com.digitalelectronics.quiz.model.Profile;
import com.digitalelectronics.quiz.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:8000", "http://127.0.0.1:5500", "http://127.0.0.1:5501"})
public class UserController {
    
    private final ProfileService profileService;
    
    @GetMapping("/profiles")
    public ResponseEntity<List<Profile>> getAllProfiles() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }
    
    @GetMapping("/profile/{id}")
    public ResponseEntity<Profile> getProfileById(@PathVariable UUID id) {
        return profileService.getProfileById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/profile/email/{email}")
    public ResponseEntity<Profile> getProfileByEmail(@PathVariable String email) {
        return profileService.getProfileByEmail(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/profile")
    public ResponseEntity<Profile> createProfile(@RequestBody Profile profile) {
        try {
            Profile created = profileService.createProfile(profile);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Creates or updates a user profile after Supabase signup.
     * This endpoint should be called by the frontend immediately after successful signup.
     * It ensures the profile table is synchronized with Supabase auth.users.
     * 
     * POST /user/profile/sync
     * Body: { userId: UUID, email: string, fullName?: string, avatarUrl?: string }
     * 
     * @param request Profile creation request from frontend
     * @return The created or updated profile with HTTP 200/201
     */
    @PostMapping("/profile/sync")
    public ResponseEntity<?> syncProfileAfterSignup(@RequestBody CreateProfileRequest request) {
        try {
            log.info("Received profile sync request for user: {} ({})", request.getEmail(), request.getUserId());
            
            // Validate request
            if (request.getUserId() == null || request.getEmail() == null || request.getEmail().isBlank()) {
                log.warn("Invalid profile sync request: missing userId or email");
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("userId and email are required"));
            }
            
            Profile profile = profileService.createOrUpdateProfileAfterSignup(request);
            
            log.info("Profile synced successfully for user: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body(profile);
            
        } catch (Exception e) {
            log.error("Error syncing profile for user {}: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Failed to sync profile: " + e.getMessage()));
        }
    }
    
    // Simple error response class
    private record ErrorResponse(String message) {}
    
    @PutMapping("/profile/{id}")
    public ResponseEntity<Profile> updateProfile(
            @PathVariable UUID id,
            @RequestBody Profile profileDetails) {
        try {
            Profile updated = profileService.updateProfile(id, profileDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/profile/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable UUID id) {
        try {
            profileService.deleteProfile(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats/{userId}")
    public ResponseEntity<Profile> getUserStats(@PathVariable UUID userId) {
        return profileService.getProfileById(userId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
