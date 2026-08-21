package se.lexicon.flightbooking_api.service;

import se.lexicon.flightbooking_api.dto.ai.FlightQueryParameters;
import se.lexicon.flightbooking_api.dto.ai.FlightRecommendationResponse;

public interface OpenAIService {

    // Step 1
    String processSimpleChatQuery(String question);

    // Step 2
    String generateFlightRecommendation(FlightQueryParameters parameters);

    // Step 3
    String generateFlightRecommendationNew(FlightQueryParameters parameters);

    // Step 4
    FlightRecommendationResponse generateFlightRecommendationJson(FlightQueryParameters parameters);
}