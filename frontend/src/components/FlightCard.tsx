import { CheckCircle2, XCircle, Plane, Calendar, Clock } from "lucide-react";

interface FlightCardProps {
    flight: {
        id: number;
        flightNumber: string;
        departureTime: string;
        arrivalTime: string;
        origin: string;
        destination: string;
        price: number;
        status?: "AVAILABLE" | "BOOKED";
    };
    onBook?: (flightId: number) => void; // Optional booking handler. When provided, a "Book flight" button is shown.
    context?: "flights" | "my-bookings"; // determines how the BOOKED status is visually framed
}

export function FlightCard({ flight, onBook, context = "flights" }: FlightCardProps) {
    // Format an ISO date string into a readable format, e.g. "3 Aug 2026, 09:20".
    const formatDateTime = (isoString: string) =>
        new Date(isoString).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    // Calculate flight duration from the two timestamps, shown as e.g. "2h 30m"
    const departure = new Date(flight.departureTime);
    const arrival = new Date(flight.arrivalTime);

    const durationMinutes =
        Math.round((arrival.getTime() - departure.getTime()) / 60000);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const formattedDuration = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;

    // Was the flight booked through the "my bookings" context? If so, treat it as
    // a positive outcome (the user successfully booked it) rather than a negative one.
    const isPositiveBooked = flight.status === "BOOKED" && context === "my-bookings";

    return (
        <div className="flight-card">
            <div className="flight-card-main">
                <p className="flight-number">{flight.flightNumber}</p>
                <div className="flight-route">
                    <Plane size={16}/>
                    <span>{flight.origin} → {flight.destination}</span>
                </div>
                <div className="flight-time">
                    <Calendar size={16}/>
                    <span>{formatDateTime(flight.departureTime)} → {formatDateTime(flight.arrivalTime)}</span>
                </div>
                <div className="flight-duration">
                    <Clock size={16}/>
                    <span>{formattedDuration}</span>
                </div>
            </div>


            <div className="flight-card-side">
                {/* Only show a status badge when the data includes a status field. */}
                {flight.status && (
                    <span className={`status-badge ${flight.status === "AVAILABLE" || isPositiveBooked ? "available" : "booked"}`}>
        {flight.status === "AVAILABLE" || isPositiveBooked ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                        {flight.status}
        </span>
                )}
                <p className="flight-price">€ {flight.price.toFixed(2)}</p>
                {onBook && (
                    <button type="button" className="book-button" onClick={() => onBook(flight.id)}>
                        Book now
                    </button>
                )}
            </div>
        </div>
    );
}