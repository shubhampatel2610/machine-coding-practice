import { Search } from "lucide-react";
import type { SearchBarProps } from "./SearchBar.types";
import "./SearchBar.scss";

// Generic controlled search input - reusable anywhere a filter text box is needed
const SearchBar = ({ value, onChange, placeholder = "Search..." }: SearchBarProps) => {
  return (
    <div className="search-bar">
      <Search size={18} className="search-bar-icon" />
      <input
        type="text"
        className="search-bar-input"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;
