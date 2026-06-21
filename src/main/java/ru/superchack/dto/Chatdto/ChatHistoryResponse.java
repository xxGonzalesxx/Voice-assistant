package ru.superchack.dto.Chatdto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatHistoryResponse {
    private Long id;
    private String message;
    private String reply;
    private LocalDateTime createdAt;
}