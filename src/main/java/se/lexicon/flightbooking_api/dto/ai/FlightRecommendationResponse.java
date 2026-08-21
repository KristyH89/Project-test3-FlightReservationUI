package se.lexicon.flightbooking_api.dto.ai;

public record FlightRecommendationResponse(
        String recommendedDestination,
        String reason,
        String estimatedPriceRange,
        String tip
) {}