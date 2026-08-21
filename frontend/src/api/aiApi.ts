const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface FlightQueryParameters {
    preference: string;
    budget?: string;
}

// Uses the same FlightApiError pattern as flightApi.ts for consistent error handling
export class ChatApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ChatApiError";
        this.status = status;
    }
}

export async function getFlightRecommendation(params: FlightQueryParameters): Promise<string> {
    const response = await fetch(`${BASE_URL}/api/v1/ai/recommend-new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        throw new ChatApiError("Failed to get a recommendation", response.status);
    }

    // This endpoint returns plain text, not JSON, so we read it as text
    return response.text();
}