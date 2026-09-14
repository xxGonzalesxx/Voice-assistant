package ru.superchack.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import ru.superchack.dto.Chatdto.ChatHistoryResponse;
import ru.superchack.model.Message;
import ru.superchack.service.ChatHistoryService;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final ChatHistoryService chatHistoryService;

    @GetMapping("/{userId}")
    public Mono<ResponseEntity<List<ChatHistoryResponse>>> getHistory(@PathVariable String userId) {
        log.debug("GET /api/history/{} - запрос истории", userId);
        return Mono.fromCallable(() -> chatHistoryService.getHistoryByUserId(userId))
                .subscribeOn(Schedulers.boundedElastic())
                .map(messages -> {
                    List<ChatHistoryResponse> response = messages.stream()
                            .map(m -> new ChatHistoryResponse(
                                    m.getId(),
                                    m.getMessage(),
                                    m.getReply(),
                                    m.getCreatedAt()
                            ))
                            .toList();

                    return ResponseEntity.ok(response);
                });
    }
}
