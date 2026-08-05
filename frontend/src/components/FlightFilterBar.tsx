import { ArrowUpDown, Search, Filter } from "lucide-react";

export type SortOption = "departure-asc" | "departure-desc" | "price-asc" | "price-desc";
export type StatusFilterOption = "all" | "AVAILABLE" | "BOOKED";

interface FlightFilterBarProps {
    destinationFilter: string;
    onDestinationFilterChange: (value: string) => void;
    sortBy: SortOption;
    onSortByChange: (value: SortOption) => void;
    // Optional: only pages that show a mix of statuses (like All Flights) need this
    statusFilter?: StatusFilterOption;
    onStatusFilterChange?: (value: StatusFilterOption) => void;
}

export function FlightFilterBar({
                                    destinationFilter,
                                    onDestinationFilterChange,
                                    sortBy,
                                    onSortByChange,
                                    statusFilter,
                                    onStatusFilterChange,
                                }: FlightFilterBarProps) {
    return (
        <div className="filter-bar">
            <div className="filter-field">
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Filter by destination..."
                    value={destinationFilter}
                    onChange={(e) => onDestinationFilterChange(e.target.value)}
                />
            </div>

            {statusFilter !== undefined && onStatusFilterChange && (
                <div className="filter-field">
                    <Filter size={16} />
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value as StatusFilterOption)}
                    >
                        <option value="all">All statuses</option>
                        <option value="AVAILABLE">Available only</option>
                        <option value="BOOKED">Booked only</option>
                    </select>
                </div>
            )}

            <div className="filter-field">
                <ArrowUpDown size={16} />
                <select value={sortBy} onChange={(e) => onSortByChange(e.target.value as SortOption)}>
                    <option value="departure-asc">Departure time (soonest first)</option>
                    <option value="departure-desc">Departure time (latest first)</option>
                    <option value="price-asc">Price (low to high)</option>
                    <option value="price-desc">Price (high to low)</option>
                </select>
            </div>
        </div>
    );
}