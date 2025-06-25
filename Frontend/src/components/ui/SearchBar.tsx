import React from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/RouteManager";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  value?: string;
  placeholder?: string;
  onSearchSubmit?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  value = "",
  placeholder = "Search water, juice, cakes, chips, groceries...",
  onSearchSubmit,
}) => {
  const navigate = useNavigate();

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
      if (onSearchSubmit) {
        onSearchSubmit(query);
      } else {
        // Default behavior: navigate to search results
        navigate(ROUTES.SEARCH_RESULTS);
      }
    }
  };

  return (
    <div className="w-full">
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
    </div>
  );
};
