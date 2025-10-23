package com.digitalelectronics.quiz.service;

import com.digitalelectronics.quiz.model.QuizAttempt;
import com.digitalelectronics.quiz.repository.QuizAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizAttemptService {
    
    private final QuizAttemptRepository quizAttemptRepository;
    private final ProfileService profileService;
    
    public List<QuizAttempt> getAllAttempts() {
        return quizAttemptRepository.findAll();
    }
    
    public Optional<QuizAttempt> getAttemptById(UUID id) {
        return quizAttemptRepository.findById(id);
    }
    
    public List<QuizAttempt> getAttemptsByUserId(UUID userId) {
        return quizAttemptRepository.findByUserId(userId);
    }
    
    public List<QuizAttempt> getCompletedAttemptsByUserId(UUID userId) {
        return quizAttemptRepository.findCompletedAttemptsByUserId(userId);
    }
    
    public List<QuizAttempt> getAttemptsByQuizId(UUID quizId) {
        return quizAttemptRepository.findByQuizId(quizId);
    }
    
    public List<QuizAttempt> getTopScoresByQuizId(UUID quizId) {
        return quizAttemptRepository.findTopScoresByQuizId(quizId);
    }
    
    @Transactional
    public QuizAttempt startAttempt(QuizAttempt attempt) {
        attempt.setCreatedAt(LocalDateTime.now());
        attempt.setCompleted(false);
        return quizAttemptRepository.save(attempt);
    }
    
    @Transactional
    public QuizAttempt submitAttempt(UUID attemptId, QuizAttempt attemptDetails) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
            .orElseThrow(() -> new RuntimeException("Attempt not found"));
        
        attempt.setAnswers(attemptDetails.getAnswers());
        attempt.setScore(attemptDetails.getScore());
        attempt.setCorrectAnswers(attemptDetails.getCorrectAnswers());
        attempt.setTimeTaken(attemptDetails.getTimeTaken());
        attempt.setCompleted(true);
        attempt.setCompletedAt(LocalDateTime.now());
        
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
        
        // Update user profile stats
        profileService.updateStats(attempt.getUserId(), attempt.getScore(), true);
        
        return savedAttempt;
    }
    
    @Transactional
    public void deleteAttempt(UUID id) {
        quizAttemptRepository.deleteById(id);
    }
}
