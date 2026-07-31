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
    onBook?: (flightId: number) => void; // Optional booking handler. When provided, booking becomes possible.
    context?: "flights" | "my-bookings"; // determines how the BOOKED status is visually framed
    bookingStyle?: "button" | "badge"; // "button" shows a separate Book now button; "badge" makes the AVAILABLE badge itself clickable
}

export function FlightCard({ flight, onBook, context = "flights", bookingStyle = "button" }: FlightCardProps) {
    const formatDateTime = (isoString: string) =>
        new Date(isoString).toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const departure = new Date(flight.departureTime);
    const arrival = new Date(flight.arrivalTime);

    const durationMinutes =
        Math.round((arrival.getTime() - departure.getTime()) / 60000);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    const formattedDuration = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;

    const isPositiveBooked = flight.status === "BOOKED" && context === "my-bookings";
    /*  A flight is bookable when a handler is provided, and its status is either
        explicitly "AVAILABLE" (All Flights) or simply absent (Available Flights,
        where every entry is available by definition and has no status field)     */
    const canBook = Boolean(onBook) && (flight.status === undefined || flight.status === "AVAILABLE");
    const isBadgeClickable = canBook && bookingStyle === "badge";
    const showBookButton = canBook && bookingStyle === "button";

    const badgeContent = (
        <>
            {flight.status === "AVAILABLE" || isPositiveBooked ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
            {flight.status}
        </>
    );

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
                {flight.status && (
                    isBadgeClickable ? (
                        <button
                            type="button"
                            className="status-badge available clickable"
                            onClick={() => onBook?.(flight.id)}
                            aria-label={`Book flight ${flight.flightNumber}`}
                        >
                            {badgeContent}
                        </button>
                    ) : (
                        <span className={`status-badge ${flight.status === "AVAILABLE" || isPositiveBooked ? "available" : "booked"}`}>
                            {badgeContent}
                        </span>
                    )
                )}
                <p className="flight-price">€ {flight.price.toFixed(2)}</p>
                {showBookButton && (
                    <button type="button" className="book-button" onClick={() => onBook?.(flight.id)}>
                        Book now
                    </button>
                )}
            </div>
        </div>
    );
}