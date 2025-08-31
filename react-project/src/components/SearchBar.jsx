import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Always navigate, even if query is empty
    navigate(`/shop?search=${encodeURIComponent(query)}`);
  };

  return (
    <form  onSubmit={handleSearch}>
      <input className="normal-search"
        type="text"
        placeholder="Search offers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="submit-search" type="submit">Search</button>
    </form>
  );
}
