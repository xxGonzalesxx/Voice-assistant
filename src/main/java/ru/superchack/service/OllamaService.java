package ru.superchack.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import ru.superchack.dto.Ollamadto.OllamaRequest;
import ru.superchack.dto.Ollamadto.OllamaResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class OllamaService {

    private final WebClient ollamaWebClient;
    private final ChatHistoryService chatHistoryService;

    @Value("${ollama.model}")
    private String model;

    @Value("${ollama.system-prompt}")
    private String systemPrompt;

    public String chat(String userMessage) {
        return chat(userMessage, "anonymous");
    }

    public String chat(String userMessage, String userId) {
        String fullPrompt = systemPrompt + "\n\nВопрос пользователя: " + userMessage;

        log.debug("Отправка к Ollama, модель: {}", model);

        try {
            OllamaRequest request = new OllamaRequest(model, fullPrompt, false);

            OllamaResponse response = ollamaWebClient
                    .post()
                    .uri("/api/generate")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(OllamaResponse.class)
                    .block();

            if (response == null || response.getResponse() == null) {
                String error = "Извините, не удалось получить ответ.";
                chatHistoryService.saveMessage(userId, userMessage, error);
                return error;
            }

            String reply = response.getResponse();
            chatHistoryService.saveMessage(userId, userMessage, reply);

            log.debug("Ответ получен и сохранён");
            return reply;

        } catch (Exception e) {
            log.error("Ошибка: {}", e.getMessage());
            String error = "Ollama не отвечает. Проверьте, запущен ли сервис.";
            chatHistoryService.saveMessage(userId, userMessage, error);
            return error;
        }
    }
}