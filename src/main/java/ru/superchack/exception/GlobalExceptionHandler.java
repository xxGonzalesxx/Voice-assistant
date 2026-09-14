package ru.superchack.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public Mono<ResponseEntity<Map<String, Object>>> handleApiException(ApiException e) {
        log.error("ApiException зафиксировано: {}", e.getMessage());

        // СВЕЖЕЕ: Возвращаем универсальную JSON-структуру ошибки вместо DTO чата
        Map<String, Object> errorBody = Map.of(
                "error", e.getMessage(),
                "status", HttpStatus.SERVICE_UNAVAILABLE.value(),
                "timestamp", LocalDateTime.now().toString()
        );

        return Mono.just(ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(errorBody));
    }

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<Map<String, Object>>> handleException(Exception e) {
        log.error("Непредвиденное исключение в системе: {}", e.getMessage(), e);

        Map<String, Object> errorBody = Map.of(
                "error", "Произошла внутренняя ошибка сервера. Пожалуйста, повторите попытку позже.",
                "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "timestamp", LocalDateTime.now().toString()
        );

        return Mono.just(ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody));
    }
}
