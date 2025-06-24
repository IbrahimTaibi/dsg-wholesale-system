import React from "react";
import { Search } from "lucide-react";
import { useUI } from "../../contexts/UIContext";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { searchQuery, setSearchQuery } = useUI();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white/70"
          size={20}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search water, juice, cakes, chips, groceries..."
          className="w-full pl-12 pr-4 py-2 sm:py-3 bg-white dark:bg-white/20 backdrop-blur-sm border border-gray-200 dark:border-white/30 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-white/50 focus:bg-white dark:focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
        />
      </div>
    </div>
  );
};
