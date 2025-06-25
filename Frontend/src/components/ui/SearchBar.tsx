import React, { useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/RouteManager";
import { SearchSuggestions } from "./SearchSuggestions";
import { useSearchSuggestions } from "../../hooks";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  value?: string;
  placeholder?: string;
  onSearchSubmit?: (query: string) => void;
  showSuggestions?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  value = "",
  placeholder = "Search water, juice, cakes, chips, groceries...",
  onSearchSubmit,
  showSuggestions = true,
}) => {
  const navigate = useNavigate();
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Use search suggestions hook
  const { suggestions, isVisible, hideSuggestions } = useSearchSuggestions({
    query: value,
    limit: 5,
    minQueryLength: 2,
    debounceMs: 300,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = value.trim();
    if (query) {
      hideSuggestions();
      if (onSearchSubmit) {
        onSearchSubmit(query);
      } else {
        // Default behavior: navigate to search results
        navigate(ROUTES.SEARCH_RESULTS);
      }
    }
  };

  const handleSuggestionSelect = () => {
    hideSuggestions();
    // The suggestion component will handle navigation
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        hideSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideSuggestions]);

  return (
    <div className="w-full relative" ref={searchBarRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white/70"
          size={20}
        />
        <input
          type="text"
          value={value}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-2 sm:py-3 bg-white dark:bg-white/20 backdrop-blur-sm border border-gray-200 dark:border-white/30 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 focus:bg-white dark:focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 dark:text-white/70 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          aria-label="Search">
          <Search size={18} />
        </button>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && (
        <SearchSuggestions
          suggestions={suggestions}
          visible={isVisible}
          onSelectSuggestion={handleSuggestionSelect}
        />
      )}
    </div>
  );
};
