package ru.superchack.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import ru.superchack.dto.Chatdto.ChatRequest;
import ru.superchack.dto.Chatdto.ChatResponse;
import ru.superchack.service.OllamaService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final OllamaService ollamaService;

    @PostMapping
    public Mono<ResponseEntity<ChatResponse>> handleChatMessage(@RequestBody ChatRequest request) {
        return Mono.fromCallable(() -> ollamaService.chat(request.getMessage()))
                .subscribeOn(Schedulers.boundedElastic())
                .map(aiResponse -> ResponseEntity.ok(new ChatResponse(aiResponse)));
    }
}
