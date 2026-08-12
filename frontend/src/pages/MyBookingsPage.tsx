import { useState } from "react";
import { getBookingsByEmail, cancelFlight, FlightApiError } from "../api/flightApi";
import type { FlightBooking } from "../types/flight";
import { FlightCard } from "../components/FlightCard";
import { Toast } from "../components/Toast";
import { usePageTitle } from "../hooks/usePageTitle";

export function MyBookingsPage() {
    usePageTitle("My Bookings");
    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState<FlightBooking[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [pendingCancelId, setPendingCancelId] = useState<number | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);
    const [cancelSuccessMessage, setCancelSuccessMessage] = useState<string | null>(null);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setCancelSuccessMessage(null);

        try {
            const data = await getBookingsByEmail(email.trim());
            setBookings(data);
            setHasSearched(true);
        } catch (err) {
            const message = err instanceof FlightApiError ? err.message : "Failed to look up bookings";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleConfirmCancel(flightId: number) {
        setIsCancelling(true);
        setCancelError(null);

        try {
            await cancelFlight(flightId, email.trim());
            const cancelledFlight = bookings.find((b) => b.id === flightId);
            setBookings((current) => current.filter((b) => b.id !== flightId));
            setPendingCancelId(null);
            if (cancelledFlight) {
                setCancelSuccessMessage(`Booking for ${cancelledFlight.flightNumber} cancelled.`);
            }
        } catch (err) {
            const message = err instanceof FlightApiError ? err.message : "Failed to cancel booking";
            setCancelError(message);
        } finally {
            setIsCancelling(false);
        }
    }

    return (
        <div className="page-container">
            <div className="mybookings-row">

                {/* LEFT SIDE — search form and results */}
                <div className="mybookings-left">
                    <h1>My Bookings</h1>

                    <form onSubmit={handleSearch} className="lookup-form">
                        <label htmlFor="lookupEmail">Email address</label>
                        <input
                            id="lookupEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Searching..." : "Find my bookings"}
                        </button>
                    </form>

                    {error && <p className="form-error" role="alert">{error}</p>}
                    {cancelSuccessMessage && (
                        <Toast message={cancelSuccessMessage} onClose={() => setCancelSuccessMessage(null)} />
                    )}

                    {hasSearched && bookings.length === 0 && !error && (
                        <p>No bookings found for this email address.</p>
                    )}

                    {bookings.length > 0 && (
                        <div className="flight-list">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="booking-item">
                                    <FlightCard flight={booking} context="my-bookings"/>

                                    {pendingCancelId === booking.id ? (
                                        <div className="cancel-confirm">
                                            <p>Are you sure you want to cancel this booking?</p>
                                            {cancelError && <p className="form-error" role="alert">{cancelError}</p>}
                                            <button
                                                type="button"
                                                className="confirm-cancel-button"
                                                onClick={() => handleConfirmCancel(booking.id)}
                                                disabled={isCancelling}
                                            >
                                                {isCancelling ? "Cancelling..." : "Yes, cancel booking"}
                                            </button>
                                            <button
                                                type="button"
                                                className="keep-booking-button"
                                                onClick={() => setPendingCancelId(null)}
                                                disabled={isCancelling}
                                            >
                                                Keep booking
                                            </button>
                                        </div>
                                    ) : (
                                        <button type="button" className="cancel-button" onClick={() => setPendingCancelId(booking.id)}>
                                            Cancel booking
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT SIDE — full-height image */}
                <div className="mybookings-right">
                    <img
                        src={`${import.meta.env.BASE_URL}bookingplane.jpeg`}
                        alt="Fly Orange plane at sunset"
                        className="booking-plane-image"
                    />
                </div>

            </div>
        </div>
    );
}