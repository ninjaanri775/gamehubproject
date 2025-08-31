import React, { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import OfferCard from "../components/OfferCard";
import Navbar from "../components/Navbar";

export default function FavoritesPage() {
  const { favorites } = useContext(FavoritesContext);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch favorites");

        const data = await res.json();
        setOffers(data); 
      } catch (err) {
        console.error(err);
      }
    }

    fetchFavorites();
  }, [favorites]); 

  return (
    <div className="favorites-page">
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <h1>Your Favorites</h1>
        {offers.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          <div className="offers-grid">
            {offers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
