import { Palette, Code2, MapPin } from "lucide-react";

export function AboutPage() {
    return (
        <div className="page-container">
            <h1>About Fly Orange</h1>
            <p className="about-intro">
                Fly Orange is a student project built for Lexicon's frontend course. It's a working
                flight search and booking interface built on top of a provided Spring Boot API. This
                page explains some of the thinking behind it.
            </p>

            <div className="about-grid">
                <div className="feature-card about-card">
                    <MapPin size={20} />
                    <h3>Why these destinations</h3>
                    <p>
                        The flights in this app don't go to random cities. All ten destinations
                        (Guernsey, Heraklion, Skopje, Zurich, Budapest, Sal, San Francisco, Madrid,
                        Istanbul, and Rome) are places I've actually travelled to. I deliberately kept
                        the list at the original ten rather than adding more, since those ten already
                        cover the trips that matter to me. It felt more honest to build with real,
                        personal data than to fill the app with placeholder cities that mean nothing
                        to me.
                    </p>
                </div>

                <div className="feature-card about-card">
                    <Palette size={20} />
                    <h3>Design decisions</h3>
                    <p>
                        The name "Fly Orange" and the orange color scheme are a deliberate nod to the
                        Netherlands, without leaning on a more literal name that was already taken, such
                        as "Tulip Air". The flight cards are styled after a boarding pass, right down to
                        the perforated tear line, to keep the visual language tied to what the app is
                        actually about: flights.
                    </p>
                </div>

                <div className="feature-card about-card">
                    <Code2 size={20} />
                    <h3>Built with</h3>
                    <p>
                        The frontend is built with React, TypeScript, and React Router, consuming a Spring
                        Boot REST API. On top of the required features, I added booking lookup by email and
                        booking cancellation. I also found and fixed a handful of bugs in the provided
                        backend along the way, including a race condition risk in the booking flow and an
                        email comparison that ignored letter casing.
                    </p>
                </div>
            </div>
            <div className="about-map-banner">
                <img
                    src="/travel-map.png"
                    alt="World map showing the ten destinations I've personally travelled to"
                    className="about-map-image"
                />
            </div>
        </div>
    );
}