import { useEffect, useMemo, useState } from "react";
import { getAllFlights, FlightApiError } from "../api/flightApi";
import type { FlightListItem, FlightBooking } from "../types/flight";
import { FlightCard } from "../components/FlightCard";
import { BookingModal } from "../components/BookingModal";
import { Toast } from "../components/Toast";
import { FlightFilterBar, type SortOption, type StatusFilterOption } from "../components/FlightFilterBar";
import { usePageTitle } from "../hooks/usePageTitle";

export function AllFlightsPage() {
    usePageTitle("All Flights");

    const [flights, setFlights] = useState<FlightListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFlight, setSelectedFlight] = useState<FlightListItem | null>(null);
    const [confirmedBooking, setConfirmedBooking] = useState<FlightBooking | null>(null);

    const [destinationFilter, setDestinationFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("all");
    const [sortBy, setSortBy] = useState<SortOption>("departure-asc");

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

        void loadFlights();
    }, []);

    const visibleFlights = useMemo(() => {
        const byStatus = flights.filter((flight) =>
            statusFilter === "all" ? true : flight.status === statusFilter
        );

        const byDestination = byStatus.filter((flight) =>
            flight.destination.toLowerCase().includes(destinationFilter.toLowerCase())
        );

        const sorted = [...byDestination].sort((a, b) => {
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
    }, [flights, destinationFilter, statusFilter, sortBy]);

    function handleBooked(booking: FlightBooking) {
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

    return (
        <div className="page-container">
            <h1>All Flights</h1>

            {confirmedBooking && (
                <Toast
                    message={`Booking confirmed for ${confirmedBooking.passengerName} on ${confirmedBooking.flightNumber} (${confirmedBooking.origin} → ${confirmedBooking.destination}).`}
                    onClose={() => setConfirmedBooking(null)}
                />
            )}

            <FlightFilterBar
                destinationFilter={destinationFilter}
                onDestinationFilterChange={setDestinationFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
            />

            {visibleFlights.length === 0 ? (
                <p>No flights match your filter.</p>
            ) : (
                <div className="flight-list">
                    {visibleFlights.map((flight) => (
                        <FlightCard
                            key={flight.id}
                            flight={flight}
                            onBook={() => setSelectedFlight(flight)}
                            bookingStyle="badge"
                        />
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