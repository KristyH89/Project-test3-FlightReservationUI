import { Link } from "react-router-dom";
import { PlaneTakeoff } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

export function NotFoundPage() {
    usePageTitle("Page not found");

    return (
        <div className="page-container not-found">
            <PlaneTakeoff size={48} />
            <h1>This flight doesn't exist</h1>
            <p>
                The page you're looking for seems to have taken off without you. Let's get you back
                on track.
            </p>
            <Link to="/" className="hero-cta-primary">
                Back to homepage
            </Link>
        </div>
    );
}