package com.digitalelectronics.quiz.controller;

import com.digitalelectronics.quiz.model.Profile;
import com.digitalelectronics.quiz.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:8000", "http://127.0.0.1:5500", "http://127.0.0.1:5501"})
public class LeaderboardController {
    
    private final ProfileService profileService;
    
    @GetMapping("/top")
    public ResponseEntity<Map<String, Object>> getTopLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        List<Profile> topProfiles = profileService.getLeaderboard();
        
        if (limit > 0 && limit < topProfiles.size()) {
            topProfiles = topProfiles.subList(0, limit);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("leaderboard", topProfiles);
        response.put("total", topProfiles.size());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/streaks")
    public ResponseEntity<Map<String, Object>> getStreakLeaderboard(@RequestParam(defaultValue = "10") int limit) {
        List<Profile> topStreaks = profileService.getStreakLeaderboard();
        
        if (limit > 0 && limit < topStreaks.size()) {
            topStreaks = topStreaks.subList(0, limit);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("leaderboard", topStreaks);
        response.put("total", topStreaks.size());
        
        return ResponseEntity.ok(response);
    }
}
