
package com.aichat.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;
    private final String model;

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.model}") String model) {

        if (apiKey == null || apiKey.isBlank()
                || apiKey.equals("YOUR_GEMINI_API_KEY")) {
            throw new IllegalStateException(
                    "Configure gemini.api.key in application.properties"
            );
        }

        this.client = Client.builder()
                .apiKey(apiKey)
                .build();

        this.model = model;
    }

    public String generateResponse(String message) {

        long startTime = System.currentTimeMillis();

        try {
            GenerateContentResponse response =
                    client.models.generateContent(
                            model,
                            message,
                            null
                    );

            String answer = response.text();

            if (answer == null || answer.isBlank()) {
                throw new IllegalStateException(
                        "Gemini returned an empty response."
                );
            }

            return answer;

        } finally {
            long elapsedTime =
                    System.currentTimeMillis() - startTime;

            System.out.println(
                    "Gemini response time: "
                            + elapsedTime + " ms"
            );
        }
    }
}
