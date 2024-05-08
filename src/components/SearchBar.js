import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm('');  // 清空搜索框
    onSearch('');  // 可以选择是否在清空时进行搜索
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search materials..."
        value={searchTerm}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>Clear</button>  
    </form>
  );
}

export default SearchBar;
