package ru.superchack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.superchack.model.Message;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Message> findBySessionIdOrderByCreatedAtAsc(String sessionId);
}