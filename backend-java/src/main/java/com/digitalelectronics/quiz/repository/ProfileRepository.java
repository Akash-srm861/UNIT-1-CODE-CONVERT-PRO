package com.digitalelectronics.quiz.repository;

import com.digitalelectronics.quiz.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    
    Optional<Profile> findByEmail(String email);
    
    @Query("SELECT p FROM Profile p ORDER BY p.totalPoints DESC")
    List<Profile> findTopByOrderByTotalPointsDesc();
    
    @Query("SELECT p FROM Profile p ORDER BY p.currentStreak DESC")
    List<Profile> findTopByOrderByCurrentStreakDesc();
}
