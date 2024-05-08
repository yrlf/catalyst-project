import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      onSearch(searchTerm);
    }, 500); // Debounce delay to reduce frequent API calls

    return () => clearTimeout(timerId);
  }, [searchTerm, onSearch]);

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
