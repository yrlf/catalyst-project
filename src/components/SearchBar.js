import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search term so that updates only happen every 500ms
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timerId);
  }, [searchTerm, onSearch]); // Re-run the effect only if searchTerm or onSearch changes

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search materials..."
      value={searchTerm}
      onChange={handleSearch}
    />
  );
}

export default SearchBar;
