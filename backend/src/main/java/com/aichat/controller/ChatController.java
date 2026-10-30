
package com.aichat.controller;

import com.aichat.service.GeminiService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public record ChatRequest(
            @NotBlank(message = "Message cannot be empty")
            @Size(max = 10000, message = "Message is too long")
            String message
    ) {}

    public record ChatResponse(String reply) {}

    @PostMapping
    public ChatResponse chat(
            @Valid @RequestBody ChatRequest request) {

        String reply =
                geminiService.generateResponse(request.message());

        return new ChatResponse(reply);
    }
}
