package ru.superchack.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import ru.superchack.dto.Ollamadto.OllamaRequest;
import ru.superchack.dto.Ollamadto.OllamaResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class OllamaService {
    private final WebClient ollamaWebClient;

    @Value("${ollama.model}")
    private String model;

    @Value("${ollama.system-prompt}")
    private String systemPrompt;

    public String chat(String userMessage) {
        String fullPrompt = systemPrompt + "\n\nВопрос пользователя: " + userMessage;

        log.debug("Отправка пользователя к Ollama,модель: {}",model);

        OllamaRequest request = new OllamaRequest(model,fullPrompt,false);

        OllamaResponse response = ollamaWebClient
                .post()
                .uri("/api/generate")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OllamaResponse.class)
                .block();

        if (response == null || response.getResponse() == null ) {
            log.error("Ollama вернула пустой ответ");
            return "Извините, не удалось получить ответ. Попробуйте позже";
        }
        log.debug("Ответ от Ollama получен");
        return response.getResponse();
    }
}
