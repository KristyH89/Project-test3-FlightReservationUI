import { NavLink } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-brand">
                <img src="/FlyOrange2-Photoroom(5).ico" alt="Fly Orange logo" className="navbar-logo" />
                Fly Orange
            </NavLink>
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
    );
}