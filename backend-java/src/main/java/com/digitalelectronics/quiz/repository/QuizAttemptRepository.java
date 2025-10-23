package com.digitalelectronics.quiz.repository;

import com.digitalelectronics.quiz.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, UUID> {
    
    List<QuizAttempt> findByUserId(UUID userId);
    
    List<QuizAttempt> findByQuizId(UUID quizId);
    
    List<QuizAttempt> findByUserIdAndQuizId(UUID userId, UUID quizId);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.userId = ?1 AND qa.completed = true ORDER BY qa.completedAt DESC")
    List<QuizAttempt> findCompletedAttemptsByUserId(UUID userId);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.quizId = ?1 AND qa.completed = true ORDER BY qa.score DESC")
    List<QuizAttempt> findTopScoresByQuizId(UUID quizId);
}
