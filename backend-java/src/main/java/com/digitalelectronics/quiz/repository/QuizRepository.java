package com.digitalelectronics.quiz.repository;

import com.digitalelectronics.quiz.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    
    List<Quiz> findByIsPublished(Boolean isPublished);
    
    List<Quiz> findByCategory(String category);
    
    List<Quiz> findByDifficulty(String difficulty);
    
    List<Quiz> findByCreatedBy(UUID createdBy);
}
