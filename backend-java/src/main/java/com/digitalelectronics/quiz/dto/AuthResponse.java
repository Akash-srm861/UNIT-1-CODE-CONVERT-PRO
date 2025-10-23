package com.digitalelectronics.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private UUID userId;
    private String email;
    private String fullName;
    private String token;
    private String message;
    
    public AuthResponse(UUID userId, String email, String fullName, String token) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.token = token;
    }
}
