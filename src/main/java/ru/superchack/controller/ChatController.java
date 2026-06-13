package ru.superchack.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.superchack.dto.Chatdto.ChatRequest;
import ru.superchack.dto.Chatdto.ChatResponse;
import ru.superchack.service.OllamaService;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatController {
    private final OllamaService ollamaService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        log.debug("Получен запрос: {}",request.getMessage());
        String reply = ollamaService.chat(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
