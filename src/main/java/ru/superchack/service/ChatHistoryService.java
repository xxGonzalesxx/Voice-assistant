package ru.superchack.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.superchack.model.Message;
import ru.superchack.repository.MessageRepository;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatHistoryService {

    private final MessageRepository messageRepository;

    public void saveMessage(String userId, String message, String reply, String modelUsed) {
        try {
            Message entity = new Message();
            entity.setUserId(userId);
            entity.setMessage(message);
            entity.setReply(reply);
            entity.setSessionId(UUID.randomUUID().toString());
            entity.setModelUsed(modelUsed);
            entity.setTokensUsed(0);

            messageRepository.save(entity);
            log.debug("Сообщение сохранено в БД");
        } catch (Exception e) {
            log.error("Ошибка сохранения в БД: {}", e.getMessage());
        }
    }

    public List<Message> getHistoryByUserId(String userId) {
        return messageRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Message> getHistoryBySessionId(String sessionId) {
        return messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }
}
