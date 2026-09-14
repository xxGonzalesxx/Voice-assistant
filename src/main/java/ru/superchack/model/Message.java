package ru.superchack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // СВЕЖЕЕ: Размечаем как родной UUID для ускорения индексов в Postgres
    @Column(name = "user_id", nullable = false, columnDefinition = "UUID")
    private String userId;

    // СВЕЖЕЕ: Заменили зарезервированное имя 'message' на безопасное 'user_message'
    @Column(name = "user_message", columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "reply", columnDefinition = "TEXT")
    private String reply;

    // СВЕЖЕЕ: Размечаем как родной UUID
    @Column(name = "session_id", columnDefinition = "UUID")
    private String sessionId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // СВЕЖЕЕ: Примитив boolean защищает от null-pointer и лишних проверок
    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted = false;

    @Column(name = "model_used", length = 50)
    private String modelUsed;

    @Column(name = "tokens_used")
    private Integer tokensUsed;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
