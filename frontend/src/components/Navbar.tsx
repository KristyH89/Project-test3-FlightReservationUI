import { NavLink, Link } from "react-router-dom";

export function Navbar() {
    return (
        <>
            {/* White header strip with logo */}
            <div className="top-header">
                <div className="top-header-inner">
                    <Link to="/" className="top-header-link">
                        <img
                            src="/FlyOrange2-Photoroom(5).ico"
                            alt="Fly Orange logo"
                            className="top-logo"
                        />
                        <span className="top-title">Fly Orange</span>
                    </Link>
                </div>
            </div>

            {/* Orange navigation bar */}
            <nav className="navbar">
                <div className="navbar-links">
                    <NavLink to="/flights" className={({ isActive }) => isActive ? "active" : ""}>
                        All Flights
                    </NavLink>
                    <NavLink to="/flights/available" className={({ isActive }) => isActive ? "active" : ""}>
                        Available Flights
                    </NavLink>
                    <NavLink to="/my-bookings" className={({ isActive }) => isActive ? "active" : ""}>
                        My Bookings
                    </NavLink>
                </div>
            </nav>
        </>
    );
}