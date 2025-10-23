package com.digitalelectronics.quiz.service;

import com.digitalelectronics.quiz.dto.CreateProfileRequest;
import com.digitalelectronics.quiz.model.Profile;
import com.digitalelectronics.quiz.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {
    
    private final ProfileRepository profileRepository;
    
    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }
    
    public Optional<Profile> getProfileById(UUID id) {
        return profileRepository.findById(id);
    }
    
    public Optional<Profile> getProfileByEmail(String email) {
        return profileRepository.findByEmail(email);
    }
    
    @Transactional
    public Profile createProfile(Profile profile) {
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());
        return profileRepository.save(profile);
    }
    
    /**
     * Creates or updates a user profile after Supabase signup.
     * This method uses upsert logic to handle cases where:
     * - Profile already exists (DB trigger created it)
     * - Profile doesn't exist yet (manual creation needed)
     * 
     * @param request Profile creation request with user details
     * @return The created or updated profile
     */
    @Transactional
    public Profile createOrUpdateProfileAfterSignup(CreateProfileRequest request) {
        log.info("Creating/updating profile for user: {} ({})", request.getEmail(), request.getUserId());
        
        // Check if profile already exists
        Optional<Profile> existingProfile = profileRepository.findById(request.getUserId());
        
        if (existingProfile.isPresent()) {
            log.info("Profile already exists for user: {}. Updating if needed.", request.getEmail());
            Profile profile = existingProfile.get();
            
            // Update fields if they're different
            boolean updated = false;
            
            if (request.getFullName() != null && !request.getFullName().equals(profile.getFullName())) {
                profile.setFullName(request.getFullName());
                updated = true;
            }
            
            if (request.getAvatarUrl() != null && !request.getAvatarUrl().equals(profile.getAvatarUrl())) {
                profile.setAvatarUrl(request.getAvatarUrl());
                updated = true;
            }
            
            if (updated) {
                profile.setUpdatedAt(LocalDateTime.now());
                return profileRepository.save(profile);
            }
            
            return profile;
        } else {
            log.info("Creating new profile for user: {}", request.getEmail());
            
            // Create new profile
            Profile newProfile = new Profile();
            newProfile.setId(request.getUserId());
            newProfile.setEmail(request.getEmail());
            newProfile.setFullName(request.getFullName());
            newProfile.setAvatarUrl(request.getAvatarUrl());
            
            // Set default values
            newProfile.setTotalPoints(0);
            newProfile.setQuizzesCompleted(0);
            newProfile.setCurrentStreak(0);
            newProfile.setLongestStreak(0);
            
            // Set timestamps
            LocalDateTime now = LocalDateTime.now();
            newProfile.setCreatedAt(now);
            newProfile.setUpdatedAt(now);
            
            return profileRepository.save(newProfile);
        }
    }
    
    @Transactional
    public Profile updateProfile(UUID id, Profile profileDetails) {
        Profile profile = profileRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Profile not found"));
        
        if (profileDetails.getFullName() != null) {
            profile.setFullName(profileDetails.getFullName());
        }
        if (profileDetails.getAvatarUrl() != null) {
            profile.setAvatarUrl(profileDetails.getAvatarUrl());
        }
        
        profile.setUpdatedAt(LocalDateTime.now());
        return profileRepository.save(profile);
    }
    
    @Transactional
    public void updateStats(UUID userId, int points, boolean completed) {
        Profile profile = profileRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Profile not found"));
        
        profile.setTotalPoints(profile.getTotalPoints() + points);
        
        if (completed) {
            profile.setQuizzesCompleted(profile.getQuizzesCompleted() + 1);
            
            // Update streak
            LocalDateTime now = LocalDateTime.now();
            if (profile.getLastQuizDate() != null && 
                profile.getLastQuizDate().toLocalDate().equals(now.minusDays(1).toLocalDate())) {
                profile.setCurrentStreak(profile.getCurrentStreak() + 1);
            } else if (profile.getLastQuizDate() == null || 
                       !profile.getLastQuizDate().toLocalDate().equals(now.toLocalDate())) {
                profile.setCurrentStreak(1);
            }
            
            if (profile.getCurrentStreak() > profile.getLongestStreak()) {
                profile.setLongestStreak(profile.getCurrentStreak());
            }
            
            profile.setLastQuizDate(now);
        }
        
        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.save(profile);
    }
    
    public List<Profile> getLeaderboard() {
        return profileRepository.findTopByOrderByTotalPointsDesc();
    }
    
    public List<Profile> getStreakLeaderboard() {
        return profileRepository.findTopByOrderByCurrentStreakDesc();
    }
    
    @Transactional
    public void deleteProfile(UUID id) {
        profileRepository.deleteById(id);
    }
}
