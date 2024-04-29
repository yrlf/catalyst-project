import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (onSearch) {
      onSearch(event.target.value);
    }
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
