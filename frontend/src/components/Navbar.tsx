import { NavLink } from "react-router-dom";
import { Plane } from "lucide-react";

export function Navbar() {
    return (
        <nav>
            <NavLink to="/">
                <Plane size={20} />
                Fly Orange
            </NavLink>
            <div>
                <NavLink to="/flights">All Flights</NavLink>
                <NavLink to="/flights/available">Available Flights</NavLink>
                <NavLink to="/my-bookings">My Bookings</NavLink>
            </div>
        </nav>
    );
}