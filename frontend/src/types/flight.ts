// Mirrors FlightListDTO from the backend — used for the "all flights" view
export interface FlightListItem {
    id: number;
    flightNumber: string;
    departureTime: string; // ISO 8601 string, backend sends LocalDateTime as text
    arrivalTime: string;
    status: "AVAILABLE" | "BOOKED";
    destination: string;
    price: number;
}

// Mirrors AvailableFlightDTO — note: no status field, since these are always available by definition
export interface AvailableFlight {
    id: number;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    destination: string;
    price: number;
}

// Mirrors FlightBookingDTO — the full booking record, returned after booking or when looking up by email
export interface FlightBooking {
    id: number;
    flightNumber: string;
    passengerName: string;
    passengerEmail: string;
    departureTime: string;
    arrivalTime: string;
    status: "AVAILABLE" | "BOOKED";
    destination: string;
    price: number;
}

// Mirrors BookFlightRequestDTO — what the frontend sends when booking a flight
export interface BookFlightRequest {
    passengerName: string;
    passengerEmail: string;
}

// Mirrors the ProblemDetail error shape the backend's exception handler returns
export interface ApiError {
    title: string;
    detail: string;
    status: number;
}