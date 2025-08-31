import React, { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import OfferCard from "./OfferCard";

export default function Favorites() {
  const { favorites } = useContext(FavoritesContext);

  if (!favorites.length) return <p>No favorites yet.</p>;

  return (
    <div className="favorites-container">
      {favorites.map((offer) => (
        <OfferCard key={offer._id} offer={offer} />
      ))}
    </div>
  );
}
