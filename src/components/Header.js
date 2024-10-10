import React, { useState } from 'react';

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery); // Pass search query to parent component
  };

  return (
    <header>
      <img src="logo2.svg" alt="logo" />
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search videos..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </header>
  );
}

export default Header;
