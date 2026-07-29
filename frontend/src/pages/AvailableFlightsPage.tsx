import { useEffect, useState } from "react";
import { getAvailableFlights, FlightApiError } from "../api/flightApi";
import type { AvailableFlight } from "../types/flight";
import { FlightCard } from "../components/FlightCard";

export function AvailableFlightsPage() {
    const [flights, setFlights] = useState<AvailableFlight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

        loadAvailableFlights();
    }, []);

    if (isLoading) {
        return <p>Loading available flights...</p>;
    }

    if (error) {
        return <p role="alert">Something went wrong: {error}</p>;
    }

    if (flights.length === 0) {
        return <p>No flights currently available.</p>;
    }

    return (
        <div>
            <h1>Available Flights</h1>
            <div className="flight-list">
                {flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                ))}
            </div>
        </div>
    );
}