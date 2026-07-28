import type {
    FlightListItem,
    AvailableFlight,
    FlightBooking,
    BookFlightRequest,
    ApiError,
} from "../types/flight";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Custom error class so components can distinguish API errors from network/parsing errors
export class FlightApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "FlightApiError";
        this.status = status;
    }
}

// Shared response handler: parses JSON on success, throws FlightApiError with the
// backend's ProblemDetail message on failure, so every caller gets consistent error handling
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        // Try to parse the backend's ProblemDetail error body for a readable message
        let detail = "An unexpected error occurred.";
        try {
            const errorBody: ApiError = await response.json();
            detail = errorBody.detail || detail;
        } catch {
            // Response body wasn't JSON, fall back to the default message
        }
        throw new FlightApiError(detail, response.status);
    }

    // DELETE requests return 204 No Content, no body to parse
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

// GET /api/flights - all flights, regardless of status
export async function getAllFlights(): Promise<FlightListItem[]> {
    const response = await fetch(`${BASE_URL}/api/flights`);
    return handleResponse<FlightListItem[]>(response);
}

// GET /api/flights/available = only flights open for booking
export async function getAvailableFlights(): Promise<AvailableFlight[]> {
    const response = await fetch(`${BASE_URL}/api/flights/available`);
    return handleResponse<AvailableFlight[]>(response);
}

// POST /api/flights/{flightId} - book a flight for a passenger
export async function bookFlight(
    flightId: number,
    bookingRequest: BookFlightRequest
): Promise<FlightBooking> {
    const response = await fetch(`${BASE_URL}/api/flights/${flightId}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingRequest),
    });
    return handleResponse<FlightBooking>(response);
}

// GET /api/flights/bookings?email= - all bookings for a given passenger email
export async function getBookingsByEmail(email: string): Promise<FlightBooking[]> {
    const response = await fetch(
        `${BASE_URL}/api/flights/bookings?email=${encodeURIComponent(email)}`
    );
    return handleResponse<FlightBooking[]>(response);
}

// DELETE /api/flights/{flightId}/cancel?email= - cancel a booking
export async function cancelFlight(flightId: number, email: string): Promise<void> {
    const response = await fetch(
        `${BASE_URL}/api/flights/${flightId}/cancel?email=${encodeURIComponent(email)}`,
        { method: "DELETE" }
    );
    return handleResponse<void>(response);
}

