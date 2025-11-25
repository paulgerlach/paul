"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type SearchControlsProps = {
  totalResults: number;
  currentResults: number;
};

export default function SearchControls({
  totalResults,
  currentResults,
}: SearchControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sort") as "asc" | "desc") || "asc"
  );

  // Update URL when sort order changes (immediate)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    
    params.set("sort", sortOrder);
    
    // Use push for immediate navigation (not replace)
    router.push(`?${params.toString()}`);
  }, [sortOrder]); // Only trigger on sort change
  
  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      } else {
        params.delete("search");
      }
      
      params.set("sort", sortOrder);
      
      router.push(`?${params.toString()}`);
    }, 500); // 500ms debounce for search
    
    return () => clearTimeout(timer);
  }, [searchQuery]); // Only trigger on search change

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="bg-white rounded-2xl p-4 flex items-center gap-4 flex-wrap">
      {/* Search Input */}
      <div className="flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Suchen..."
          className="w-full px-4 py-2 border border-dark_green/20 rounded-md text-dark_green placeholder:text-dark_green/50 focus:outline-none focus:border-green transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Sort Toggle Button */}
      <button
        onClick={handleSortToggle}
        className="px-4 py-2 bg-green text-white rounded-md hover:bg-green/90 transition-all duration-300 flex items-center gap-2"
        title={
          sortOrder === "asc" ? "Sortierung: A → Z" : "Sortierung: Z → A"
        }
      >
        <span className="text-sm font-medium">
          {sortOrder === "asc" ? "A → Z" : "Z → A"}
        </span>
      </button>

      {/* Results Count */}
      <div className="text-sm text-dark_green/70">
        {currentResults} von {totalResults} Ergebnissen
      </div>
    </div>
  );
}

