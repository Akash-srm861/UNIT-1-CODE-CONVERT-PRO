package com.digitalelectronics.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO for creating a new user profile after Supabase authentication signup.
 * This ensures that the profile table is synced with Supabase auth.users.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProfileRequest {
    
    /**
     * The Supabase auth user ID (from auth.users table)
     * This should match the UUID returned by Supabase signUp
     */
    private UUID userId;
    
    /**
     * User's email address (from Supabase auth)
     */
    private String email;
    
    /**
     * User's full name (optional, from signup form)
     */
    private String fullName;
    
    /**
     * User's avatar URL (optional, from OAuth providers like Google)
     */
    private String avatarUrl;
}
