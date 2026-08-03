import { useEffect, useRef } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number; // milliseconds before auto-dismiss, defaults to 1 minute
}

export function Toast({ message, onClose, duration = 60000 }: ToastProps) {
    // Keep the latest onClose in a ref so the timer effect doesn't need to
    // restart every time the parent re-renders and passes a new function instance
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        const timer = setTimeout(() => onCloseRef.current(), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    return (
        <div className="toast" role="status">
            <CheckCircle2 size={18} />
            <span>{message}</span>
            <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss notification">
                <X size={16} />
            </button>
        </div>
    );
}