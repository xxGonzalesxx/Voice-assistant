package ru.superchack.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.superchack.dto.Chatdto.ChatHistoryResponse;
import ru.superchack.model.Message;
import ru.superchack.service.ChatHistoryService;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final ChatHistoryService chatHistoryService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<ChatHistoryResponse>> getHistory(@PathVariable String userId) {
        List<Message> messages = chatHistoryService.getHistoryByUserId(userId);

        List<ChatHistoryResponse> response = messages.stream()
                .map(m -> new ChatHistoryResponse(
                        m.getId(),
                        m.getMessage(),
                        m.getReply(),
                        m.getCreatedAt()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}