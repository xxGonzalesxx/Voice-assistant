package ru.superchack.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
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
        log.debug("Отправка к Ollama, модель: {}", model);

        try {
            // СВЕЖЕЕ: Разделяем prompt пользователя и systemPrompt согласно спецификации Ollama API
            OllamaRequest request = new OllamaRequest(model, userMessage, systemPrompt, false,false);

            OllamaResponse response = ollamaWebClient
                    .post()
                    .uri("/api/generate")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(OllamaResponse.class)
                    .block(); // Оставляем block, но вызов в контроллере нужно будет изолировать

            if (response == null || response.getResponse() == null) {
                String error = "Извините, не удалось получить ответ.";
                chatHistoryService.saveMessage(userId, userMessage, error, model);
                return error;
            }

            String reply = response.getResponse();
            // СВЕЖЕЕ: Сохраняем в историю актуальную модель qwen2.5:3b
            chatHistoryService.saveMessage(userId, userMessage, reply, model);

            log.debug("Ответ получен и успешно сохранён");
            return reply;

        } catch (Exception e) {
            log.error("Ошибка при работе с Ollama: {}", e.getMessage());
            String error = "Ollama не отвечает. Проверьте, запущен ли сервис.";
            chatHistoryService.saveMessage(userId, userMessage, error, model);
            return error;
        }
    }
}
