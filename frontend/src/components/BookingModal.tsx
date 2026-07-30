import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { bookFlight, FlightApiError } from "../api/flightApi";
import type { AvailableFlight, FlightBooking } from "../types/flight";

interface BookingModalProps {
    flight: AvailableFlight;
    onClose: () => void;
    onBooked: (booking: FlightBooking) => void; // called after a successful booking
}

export function BookingModal({ flight, onClose, onBooked }: BookingModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [passengerName, setPassengerName] = useState("");
    const [passengerEmail, setPassengerEmail] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Open the native dialog as a modal as soon as this component mounts
    useEffect(() => {
        dialogRef.current?.showModal();
    }, []);

    // Mirror the backend validation so users receive immediate feedback.
    function validate(): string | null {
        const trimmedName = passengerName.trim();

        const trimmedEmail = passengerEmail.trim();

        if (trimmedName.length < 2 || trimmedName.length > 100) {
            return "Passenger name must be between 2 and 100 characters.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(trimmedEmail)) {
            return "Please enter a valid email address.";
        }

        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setApiError(null);

        const validationMessage = validate();
        if (validationMessage) {
            setValidationError(validationMessage);
            return;
        }
        setValidationError(null);

        setIsSubmitting(true);
        try {
            const booking = await bookFlight(flight.id, {
                passengerName: passengerName.trim(),
                passengerEmail: passengerEmail.trim(),
            });
            onBooked(booking);
        } catch (err) {
            const message = err instanceof FlightApiError ? err.message : "Failed to book flight";
            setApiError(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Prevent the browser from automatically closing the dialog.
    // We let React control when it closes.
    function handleCancel(
        event: React.SyntheticEvent<HTMLDialogElement>
    ) {
        event.preventDefault();
        onClose();
    }

    return (
        <dialog
            ref={dialogRef}
            className="booking-modal"
            onCancel={handleCancel}
        >
            <div className="booking-modal-header">
                <h2>Book {flight.flightNumber}</h2>

                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close booking dialog"
                >
                    <X size={20} />
                </button>
            </div>

            <p className="booking-modal-route">
                {flight.origin} → {flight.destination}
                <br />
                {new Date(flight.departureTime).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                <br />
                € {flight.price.toFixed(2)}
            </p>

            <form onSubmit={handleSubmit}>

                <label htmlFor="passengerName">
                    Passenger name
                </label>

                <input
                    id="passengerName"
                    type="text"

                    // Automatically focus the first input.
                    autoFocus

                    value={passengerName}

                    // Clear validation errors while typing.
                    onChange={(e) => {
                        setPassengerName(e.target.value);
                        setValidationError(null);
                    }}

                    disabled={isSubmitting}
                    required
                />

                <label htmlFor="passengerEmail">
                    Email address
                </label>

                <input
                    id="passengerEmail"
                    type="email"

                    value={passengerEmail}

                    // Clear validation errors while typing.
                    onChange={(e) => {
                        setPassengerEmail(e.target.value);
                        setValidationError(null);
                    }}

                    disabled={isSubmitting}
                    required
                />

                {validationError && (
                    <p
                        className="form-error"
                        role="alert"
                    >
                        {validationError}
                    </p>
                )}

                {apiError && (
                    <p
                        className="form-error"
                        role="alert"
                    >
                        {apiError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Booking..."
                        : "Confirm booking"}
                </button>
            </form>
        </dialog>
    );
}