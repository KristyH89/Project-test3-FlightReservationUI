import { useEffect, useMemo, useState } from "react";
import { getAvailableFlights, FlightApiError } from "../api/flightApi";
import type { AvailableFlight, FlightBooking } from "../types/flight";
import { FlightCard } from "../components/FlightCard";
import { BookingModal } from "../components/BookingModal";
import { Toast } from "../components/Toast";
import { FlightFilterBar, type SortOption } from "../components/FlightFilterBar";
import { usePageTitle } from "../hooks/usePageTitle";
import { Plane } from "lucide-react";

export function AvailableFlightsPage() {
    usePageTitle("Available Flights");

    const [flights, setFlights] = useState<AvailableFlight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<AvailableFlight | null>(null);
    const [confirmedBooking, setConfirmedBooking] = useState<FlightBooking | null>(null);

    const [destinationFilter, setDestinationFilter] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("departure-asc");

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

    const visibleFlights = useMemo(() => {
        const filtered = flights.filter((flight) =>
            flight.destination.toLowerCase().includes(destinationFilter.toLowerCase())
        );

        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "departure-desc":
                    return new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime();
                case "departure-asc":
                default:
                    return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
            }
        });

        return sorted;
    }, [flights, destinationFilter, sortBy]);

    function handleBooked(booking: FlightBooking) {
        setFlights((current) => current.filter((f) => f.id !== booking.id));
        setSelectedFlight(null);
        setConfirmedBooking(booking);
    }

    if (isLoading) {
        return (
            <div className="page-container loading-notice">
                <Plane className="loading-plane" size={32} />
                <p>Warming up the engines...</p>
                <p className="loading-notice-detail">
                    Our backend runs on a free hosting tier, so it takes a little runway to get going if
                    it's been idle for a while. Almost there!
                </p>
            </div>
        );
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

            <FlightFilterBar
                destinationFilter={destinationFilter}
                onDestinationFilterChange={setDestinationFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
            />

            {visibleFlights.length === 0 ? (
                <p>No flights match your filter.</p>
            ) : (
                <div className="flight-list">
                    {visibleFlights.map((flight) => (
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