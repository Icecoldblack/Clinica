package com.medapath.backend.controller;

import com.medapath.backend.dto.ChatRequest;
import com.medapath.backend.dto.ChatResponse;
import com.medapath.backend.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = chatService.chat(request.getSessionId(), request.getMessage());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<ChatResponse.MessageDto>> getHistory(@PathVariable Long sessionId) {
        return ResponseEntity.ok(chatService.getHistory(sessionId));
    }
}
