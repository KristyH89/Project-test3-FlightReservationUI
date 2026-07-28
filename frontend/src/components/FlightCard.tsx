import { CheckCircle2, XCircle, MapPin, Calendar } from "lucide-react";
import type { FlightListItem } from "../types/flight";

interface FlightCardProps {
    flight: FlightListItem;
}

export function FlightCard({ flight }: FlightCardProps) {
    const isAvailable = flight.status === "AVAILABLE";

    // Format an ISO date string into a readable format, e.g. "3 Aug 2026, 09:20".
    const formattedDeparture = new Date(flight.departureTime).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
});

return (
    <div className="flight-card">
        <div className="flight-card-main">
        <p className="flight-number">{flight.flightNumber}</p>
            <div className="flight-route">
                <MapPin size={16} />
                <span>{flight.origin} → {flight.destination}</span>
            </div>
            <div className="flight-time">
                <Calendar size={16} />
                <span>{formattedDeparture}</span>
            </div>
        </div>

        <div className="flight-card-side">
            <span className={`status-badge ${isAvailable ? "available" : "booked"}`}>
                {isAvailable ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {flight.status}
            </span>
            <p className="flight-price">€{flight.price.toFixed(2)}</p>
        </div>
    </div>
);
}
