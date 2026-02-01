
import React from 'react';

interface FilterBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  genres: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchText,
  setSearchText,
  selectedGenre,
  setSelectedGenre,
  sortBy,
  setSortBy,
  genres,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800">
      <div className="flex-1 relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by title or producer..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-black border border-zinc-800 text-sm text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-black border border-zinc-800 text-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer"
        >
          <option value="All Genres">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-black border border-zinc-800 text-sm text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="bpm-low">BPM: Low to High</option>
          <option value="bpm-high">BPM: High to Low</option>
        </select>
      </div>
    </div>
  );
};
