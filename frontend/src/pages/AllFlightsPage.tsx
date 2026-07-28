import { useEffect, useState } from "react";
import {FlightApiError, getAllFlights} from "../api/flightApi";
import type { FlightListItem} from "../types/flight";
import { FlightCard} from "../components/FlightCard";

export function AllFlightsPage() {
    const [flights, setFlights] = useState<FlightListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch flights once when the page mounts
        async function loadFlights() {
            try {
                const data = await getAllFlights();
                setFlights(data);
            } catch (err) {
                // Show the backend's error message if we have one, otherwise a generic fallback
                const message = err instanceof FlightApiError ? err.message : "Failed to load flights";
                setError(message);
            } finally {
                setIsLoading(false);
            }
        }

        loadFlights();
    }, []);

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
            <div className="flight-list">
                {flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight}/>
                ))}
            </div>
        </div>
    );


}