import { Link } from "react-router-dom";
import { Search, ShieldCheck, Sparkles, GraduationCap } from "lucide-react";

export function HomePage() {
    return (
        <div className="home">

            {/* Hero inside white block */}
            <section className="hero">
                <img
                    src="/Molen-met-tulpen-scaled.jpg"
                    alt="Dutch landscape"
                    className="hero-landscape"
                />

                <div className="hero-lower">
                    <div className="hero-content">
                        <p className="hero-eyebrow">Amsterdam → Anywhere</p>
                        <h1 className="hero-title">Fly Orange</h1>
                        <p className="hero-tagline">Dutch roots. Worldwide destinations.</p>
                        <p className="hero-subtitle">
                            Book your next flight with a touch of Dutch efficiency and a splash of orange flair.
                        </p>

                        <div className="hero-actions">
                            <Link to="/flights/available" className="hero-cta-primary">
                                Browse available flights
                            </Link>
                            <Link to="/my-bookings" className="hero-cta-secondary">
                                Manage my bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Intro */}
            <section className="home-section">
                <h2>Welcome to Fly Orange</h2>
                <p>
                    Born from Dutch roots and built as a modern student project, Fly Orange brings a clean,
                    no-nonsense way to explore flights, check availability, and manage your bookings.
                    No clutter, no confusion. Just clear routes, transparent prices, and a smooth booking experience.
                </p>
            </section>

            {/* Why Fly Orange */}
            <section className="home-section">
                <h2>Why Fly Orange?</h2>

                <div className="feature-grid">
                    <div className="feature-card">
                        <Search size={20} />
                        <h3>Dutch clarity</h3>
                        <p>Straightforward routes, clear prices, and a user interface that doesn't beat around the bush.</p>
                    </div>

                    <div className="feature-card">
                        <Sparkles size={20} />
                        <h3>Smart booking</h3>
                        <p>See all flights, filter only available ones, and book in just a few steps.</p>
                    </div>

                    <div className="feature-card">
                        <ShieldCheck size={20} />
                        <h3>Stay in control</h3>
                        <p>Look up your bookings by email and cancel when plans change. No drama, just good service.</p>
                    </div>

                    <div className="feature-card">
                        <GraduationCap size={20} />
                        <h3>Student-built, professionally inspired</h3>
                        <p>Designed as a learning project, with real-world patterns and clean code behind the scenes.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="home-cta-section">
                <img
                    src="/orangeplane2.jpeg"
                    alt="Fly Orange airplane"
                    className="cta-plane-image"
                />

                <div className="home-cta-content">
                    <h2>Ready for take-off?</h2>
                    <p>
                        Browse <strong>All Flights</strong>, check <strong>Available Flights</strong>, or open <strong>My Bookings</strong> to
                        manage your upcoming trips. Fly Orange keeps it simple, just like we do back home.
                    </p>

                    <div className="hero-actions">
                        <Link to="/flights" className="hero-cta-primary">
                            View all flights
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
