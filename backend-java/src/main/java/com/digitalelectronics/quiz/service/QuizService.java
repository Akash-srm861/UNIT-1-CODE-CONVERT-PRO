package com.digitalelectronics.quiz.service;

import com.digitalelectronics.quiz.model.Question;
import com.digitalelectronics.quiz.model.Quiz;
import com.digitalelectronics.quiz.repository.QuestionRepository;
import com.digitalelectronics.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuizService {
    
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }
    
    public List<Quiz> getPublishedQuizzes() {
        return quizRepository.findByIsPublished(true);
    }
    
    public Optional<Quiz> getQuizById(UUID id) {
        return quizRepository.findById(id);
    }
    
    public List<Quiz> getQuizzesByCategory(String category) {
        return quizRepository.findByCategory(category);
    }
    
    public List<Quiz> getQuizzesByDifficulty(String difficulty) {
        return quizRepository.findByDifficulty(difficulty);
    }
    
    @Transactional
    public Quiz createQuiz(Quiz quiz) {
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setUpdatedAt(LocalDateTime.now());
        return quizRepository.save(quiz);
    }
    
    @Transactional
    public Quiz updateQuiz(UUID id, Quiz quizDetails) {
        Quiz quiz = quizRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        if (quizDetails.getTitle() != null) {
            quiz.setTitle(quizDetails.getTitle());
        }
        if (quizDetails.getDescription() != null) {
            quiz.setDescription(quizDetails.getDescription());
        }
        if (quizDetails.getCategory() != null) {
            quiz.setCategory(quizDetails.getCategory());
        }
        if (quizDetails.getDifficulty() != null) {
            quiz.setDifficulty(quizDetails.getDifficulty());
        }
        if (quizDetails.getTimeLimit() != null) {
            quiz.setTimeLimit(quizDetails.getTimeLimit());
        }
        if (quizDetails.getPassingScore() != null) {
            quiz.setPassingScore(quizDetails.getPassingScore());
        }
        if (quizDetails.getIsPublished() != null) {
            quiz.setIsPublished(quizDetails.getIsPublished());
        }
        
        quiz.setUpdatedAt(LocalDateTime.now());
        return quizRepository.save(quiz);
    }
    
    @Transactional
    public void deleteQuiz(UUID id) {
        questionRepository.deleteByQuizId(id);
        quizRepository.deleteById(id);
    }
    
    public List<Question> getQuestionsByQuizId(UUID quizId) {
        return questionRepository.findByQuizIdOrderByOrderNumberAsc(quizId);
    }
    
    @Transactional
    public Question addQuestion(Question question) {
        question.setCreatedAt(LocalDateTime.now());
        Question savedQuestion = questionRepository.save(question);
        
        // Update quiz total questions count
        Quiz quiz = quizRepository.findById(question.getQuizId())
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        quiz.setTotalQuestions(quiz.getTotalQuestions() + 1);
        quiz.setUpdatedAt(LocalDateTime.now());
        quizRepository.save(quiz);
        
        return savedQuestion;
    }
    
    @Transactional
    public void deleteQuestion(UUID questionId) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found"));
        
        questionRepository.deleteById(questionId);
        
        // Update quiz total questions count
        Quiz quiz = quizRepository.findById(question.getQuizId())
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        quiz.setTotalQuestions(Math.max(0, quiz.getTotalQuestions() - 1));
        quiz.setUpdatedAt(LocalDateTime.now());
        quizRepository.save(quiz);
    }
}
