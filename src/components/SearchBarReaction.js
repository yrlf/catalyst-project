import React, { useState, useEffect, forwardRef } from 'react';

const SearchBarReaction = forwardRef(({ placeholder, onSearch }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleSearch = setTimeout(() => {
      onSearch(searchTerm);
    }, 500); // 设置500毫秒的防抖时间

    return () => clearTimeout(handleSearch);
  }, [searchTerm, onSearch]);

  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
});

export default SearchBarReaction;
