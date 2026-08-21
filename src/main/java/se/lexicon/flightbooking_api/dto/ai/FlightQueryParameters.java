package se.lexicon.flightbooking_api.dto.ai;

import jakarta.validation.constraints.NotBlank;

// What the user is looking for, in their own words — kept loose since this is
// a recommendation assistant, not a structured search form
public record FlightQueryParameters(
        @NotBlank(message = "Preference cannot be blank")
        String preference, // e.g. "somewhere warm and relaxing" or "a short city trip"

        String budget // optional, free text like "under 300 euros"
) {}