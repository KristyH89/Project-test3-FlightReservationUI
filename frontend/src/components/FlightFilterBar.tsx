import { ArrowUpDown, Search } from "lucide-react";

export type SortOption = "departure-asc" | "price-asc" | "price-desc";

interface FlightFilterBarProps {
    destinationFilter: string;
    onDestinationFilterChange: (value: string) => void;
    sortBy: SortOption;
    onSortByChange: (value: SortOption) => void;
}

export function FlightFilterBar({
                                    destinationFilter,
                                    onDestinationFilterChange,
                                    sortBy,
                                    onSortByChange,
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

            <div className="filter-field">
                <ArrowUpDown size={16} />
                <select value={sortBy} onChange={(e) => onSortByChange(e.target.value as SortOption)}>
                    <option value="departure-asc">Departure time (soonest first)</option>
                    <option value="price-asc">Price (low to high)</option>
                    <option value="price-desc">Price (high to low)</option>
                </select>
            </div>
        </div>
    );
}