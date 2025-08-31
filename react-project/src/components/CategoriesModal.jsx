import React from "react";
import { useNavigate } from "react-router-dom";

export default function CategoriesModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const indoorCategories = [
    "MMA", "Fitness Halls", "Gaming", "Billiard", "Table Tennis", "Arcade Games"
  ];
  const outdoorCategories = [
    "Tennis", "Football", "Padel", "Carting", "Warsoft"
  ];

  const handleCategoryClick = (cat) => {
    navigate(`/shop?search=${encodeURIComponent(cat)}`);
    onClose();
  };

  return (
    <>
      {/* Background overlay */}
      <div className="categories-overlay" onClick={onClose}></div>

      {/* Modal dropdown content */}
      <div className="categories-dropdown">
        <div className="categories-content">
          <h2>შიდა აქტივობები</h2>
          <div className="categories-list">
            {indoorCategories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <h2>გარე აქტივობები</h2>
          <div className="categories-list">
            {outdoorCategories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryClick(cat)}>
                {cat}
              </button>
            ))}
          </div>

      
        </div>
      </div>
    </>
  );
}
