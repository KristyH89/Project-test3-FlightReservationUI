import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-text">
                <Link to="/" className="footer-title-row">
                    <img
                        src="/FlyOrange2-Photoroom.ico"
                        alt="Fly Orange logo"
                        className="footer-logo"
                    />
                    <p className="footer-title">
                        <strong>Fly Orange</strong> – Dutch roots. Worldwide destinations.
                    </p>
                </Link>

                <p className="footer-subtitle">
                    A fictional flight booking platform created as a student project for Lexicon.
                </p>
            </div>
        </footer>
    );
}