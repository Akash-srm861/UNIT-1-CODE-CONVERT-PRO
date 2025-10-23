package com.digitalelectronics.quiz.controller;

import com.digitalelectronics.quiz.model.QuizAttempt;
import com.digitalelectronics.quiz.service.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/attempts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:8000", "http://localhost:3000", "http://localhost:5500", "http://127.0.0.1:8000", "http://127.0.0.1:5500", "http://127.0.0.1:5501"})
public class QuizAttemptController {
    
    private final QuizAttemptService quizAttemptService;
    
    @GetMapping("/all")
    public ResponseEntity<List<QuizAttempt>> getAllAttempts() {
        return ResponseEntity.ok(quizAttemptService.getAllAttempts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuizAttempt> getAttemptById(@PathVariable UUID id) {
        return quizAttemptService.getAttemptById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuizAttempt>> getUserAttempts(@PathVariable UUID userId) {
        return ResponseEntity.ok(quizAttemptService.getAttemptsByUserId(userId));
    }
    
    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<List<QuizAttempt>> getUserCompletedAttempts(@PathVariable UUID userId) {
        return ResponseEntity.ok(quizAttemptService.getCompletedAttemptsByUserId(userId));
    }
    
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<List<QuizAttempt>> getQuizAttempts(@PathVariable UUID quizId) {
        return ResponseEntity.ok(quizAttemptService.getAttemptsByQuizId(quizId));
    }
    
    @GetMapping("/quiz/{quizId}/top-scores")
    public ResponseEntity<List<QuizAttempt>> getTopScores(@PathVariable UUID quizId) {
        return ResponseEntity.ok(quizAttemptService.getTopScoresByQuizId(quizId));
    }
    
    @PostMapping("/start")
    public ResponseEntity<QuizAttempt> startAttempt(@RequestBody QuizAttempt attempt) {
        try {
            QuizAttempt created = quizAttemptService.startAttempt(attempt);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{attemptId}/submit")
    public ResponseEntity<QuizAttempt> submitAttempt(
            @PathVariable UUID attemptId,
            @RequestBody QuizAttempt attemptDetails) {
        try {
            QuizAttempt submitted = quizAttemptService.submitAttempt(attemptId, attemptDetails);
            return ResponseEntity.ok(submitted);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttempt(@PathVariable UUID id) {
        try {
            quizAttemptService.deleteAttempt(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
