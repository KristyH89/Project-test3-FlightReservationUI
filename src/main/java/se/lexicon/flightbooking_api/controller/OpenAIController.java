package se.lexicon.flightbooking_api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import se.lexicon.flightbooking_api.dto.ai.FlightQueryParameters;
import se.lexicon.flightbooking_api.dto.ai.FlightRecommendationResponse;
import se.lexicon.flightbooking_api.service.OpenAIService;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class OpenAIController {

    private final OpenAIService openAIService;

    // Step 1
    @GetMapping("/chat")
    public String processSimpleChatQuery(@RequestParam String question) {
        return openAIService.processSimpleChatQuery(question);
    }

    // Step 2
    @PostMapping("/recommend")
    public String generateFlightRecommendation(@RequestBody @Valid FlightQueryParameters parameters) {
        return openAIService.generateFlightRecommendation(parameters);
    }

    // Step 3
    @PostMapping("/recommend-new")
    public String generateFlightRecommendationNew(@RequestBody @Valid FlightQueryParameters parameters) {
        return openAIService.generateFlightRecommendationNew(parameters);
    }

    // Step 4
    @PostMapping("/recommend/json")
    public FlightRecommendationResponse generateFlightRecommendationJson(@RequestBody @Valid FlightQueryParameters parameters) {
        return openAIService.generateFlightRecommendationJson(parameters);
    }
}