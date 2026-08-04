import { useEffect, useState } from "react";
import { getAvailableFlights, FlightApiError } from "../api/flightApi";
import type { AvailableFlight, FlightBooking } from "../types/flight";
import { FlightCard } from "../components/FlightCard";
import { BookingModal } from "../components/BookingModal";
import { Toast } from "../components/Toast";
import { usePageTitle } from "../hooks/usePageTitle";

export function AvailableFlightsPage() {
    usePageTitle("Available Flights");
    const [flights, setFlights] = useState<AvailableFlight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<AvailableFlight | null>(null);
    const [confirmedBooking, setConfirmedBooking] = useState<FlightBooking | null>(null);

    useEffect(() => {
        async function loadAvailableFlights() {
            try {
                const data = await getAvailableFlights();
                setFlights(data);
            } catch (err) {
                const message = err instanceof FlightApiError ? err.message : "Failed to load available flights";
                setError(message);
            } finally {
                setIsLoading(false);
            }
        }

        void loadAvailableFlights();
    }, []);

    function handleBooked(booking: FlightBooking) {
        // Remove the now-booked flight from the available list, no full page reload needed
        setFlights((current) => current.filter((f) => f.id !== booking.id));
        setSelectedFlight(null);
        setConfirmedBooking(booking);
    }

    if (isLoading) {
        return <p>Loading available flights...</p>;
    }

    if (error) {
        return <p role="alert">Something went wrong: {error}</p>;
    }

    return (
        <div className="page-container">
            <h1>Available Flights</h1>

            {confirmedBooking && (
                <Toast
                    message={`Booking confirmed for ${confirmedBooking.passengerName} on ${confirmedBooking.flightNumber} (${confirmedBooking.origin} → ${confirmedBooking.destination}).`}
                    onClose={() => setConfirmedBooking(null)}
                />
            )}
            {flights.length === 0 ? (
                <p>No flights currently available.</p>
            ) : (
                <div className="flight-list">
                    {flights.map((flight) => (
                        <FlightCard key={flight.id} flight={flight} onBook={() => setSelectedFlight(flight)} />
                    ))}
                </div>
            )}

            {selectedFlight && (
                <BookingModal
                    flight={selectedFlight}
                    onClose={() => setSelectedFlight(null)}
                    onBooked={handleBooked}
                />
            )}
        </div>
    );
}


