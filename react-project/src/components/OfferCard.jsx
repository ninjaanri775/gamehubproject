import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FavoritesContext } from "../context/FavoritesContext";

export default function OfferCard({ offer, onRemoved }) {
  const { user } = useContext(AuthContext);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);

  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isDeleted) return null;

  const discountedPrice = offer.discount
    ? (offer.priceValue * (1 - offer.discount / 100)).toFixed(2)
    : offer.priceValue.toFixed(2);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
const res = await fetch(`${import.meta.env.VITE_API_URL}/api/offers/${offer._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete");
      }
      setIsDeleted(true);
      if (onRemoved) onRemoved(offer._id);
    } catch (err) {
      console.error(err.message);
      alert("Failed to delete offer: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => alert("Working in progress");

  const handleFavorite = () => {
    if (!user) return alert("Login to add favorites");
    toggleFavorite(offer._id);
  };

return (
  <div className="offer-card">

    <div className="image-container">
      {offer.image && (
        <img
          className="offer-image"
          src={`http://localhost:5000/${offer.image}`}
          alt={offer.name}
        />
      )}
      {offer.discount > 0 && (
        <div className="discount-badge-image">{offer.discount}% OFF</div>
      )}
    </div>


    <h3>{offer.name}</h3>


    <div className="offer-prices">
      {offer.discount > 0 ? (
        <>
          <span className="original-price">${offer.priceValue.toFixed(2)}</span>
          <span className="discounted-price">
            ${discountedPrice} {offer.priceText}
          </span>
        </>
      ) : (
        <span className="regular-price">
          ${offer.priceValue.toFixed(2)} {offer.priceText}
        </span>
      )}
    </div>

    {offer.title && <p className="offer-title">{offer.title}</p>}


    <div className="offer-location">
      <img src="/images/Vector.png" alt="" className="location-icon" />
      <span>{offer.location}</span>
    </div>


    <div className="offer-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <button className="book-btn" onClick={handleBook}>
        Book Now
      </button>
      <button
        className={`favorite-btn ${isFavorite(offer._id) ? "favorite-active" : ""}`}
        onClick={handleFavorite}
      >
        ♥
      </button>
    </div>

    {user?.role === "admin" && (
      <div className="admin-buttons">
        <button onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    )}
  </div>
);
}
