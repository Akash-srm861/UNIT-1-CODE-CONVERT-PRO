package com.digitalelectronics.quiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class QuizApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(QuizApplication.class, args);
        System.out.println("🚀 Digital Electronics Quiz API is running!");
        System.out.println("🌐 Server started on port 5000");
        System.out.println("📊 API endpoint: http://localhost:5000/api");
    }
}
