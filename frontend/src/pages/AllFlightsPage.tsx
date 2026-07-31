import { useEffect, useState } from "react";
import { getAllFlights, FlightApiError } from "../api/flightApi";
import type { FlightListItem, FlightBooking } from "../types/flight";
import { FlightCard } from "../components/FlightCard";
import { BookingModal } from "../components/BookingModal";

export function AllFlightsPage() {
    const [flights, setFlights] = useState<FlightListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<FlightListItem | null>(null);
    const [confirmedBooking, setConfirmedBooking] = useState<FlightBooking | null>(null);

    useEffect(() => {
        async function loadFlights() {
            try {
                const data = await getAllFlights();
                setFlights(data);
            } catch (err) {
                const message = err instanceof FlightApiError ? err.message : "Failed to load flights";
                setError(message);
            } finally {
                setIsLoading(false);
            }
        }

        loadFlights();
    }, []);

    function handleBooked(booking: FlightBooking) {
        // Update the booked flight's status in place, rather than removing it,
        // since this page shows both available and booked flights together
        setFlights((current) =>
            current.map((f) => (f.id === booking.id ? { ...f, status: "BOOKED" } : f))
        );
        setSelectedFlight(null);
        setConfirmedBooking(booking);
    }

    if (isLoading) {
        return <p>Loading flights...</p>;
    }

    if (error) {
        return <p role="alert">Something went wrong: {error}</p>;
    }

    if (flights.length === 0) {
        return <p>No flights found.</p>;
    }

    return (
        <div>
            <h1>All Flights</h1>

            {confirmedBooking && (
                <p className="booking-success" role="status">
                    Booking confirmed for {confirmedBooking.passengerName} on {confirmedBooking.flightNumber}
                    {" "}({confirmedBooking.origin} → {confirmedBooking.destination}).
                </p>
            )}

            <div className="flight-list">
                {flights.map((flight) => (
                    <FlightCard
                        key={flight.id}
                        flight={flight}
                        onBook={() => setSelectedFlight(flight)}
                        bookingStyle="badge"
                    />
                ))}
            </div>

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