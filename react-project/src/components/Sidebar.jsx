import React, { useEffect, useState, useRef } from "react";
import OfferCard from "./OfferCard";
import { useNavigate } from "react-router-dom";

// Mapping category names to icon filenames
const categoryIcons = {
  basketball: "icon=Basketball (1).png",
  football: "icon=Football.png",
  MMA: "icon=Boxing.png",
  gaming: "icon=Esports.png",
  padel: "icon=Table Tennis.png",
  Tennis: "icon=Tennis.png"
};

// Top Categories Sidebar
export function TopCategoriesSidebar() {
  const navigate = useNavigate();
  const topCategories = ["football", "basketball", "padel", "gaming", "MMA", "Tennis"];
  const scrollRef = useRef(null);

  const scrollLeft = () =>
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div style={{ margin: "20px 0", position: "relative" }}>
      <h2 className="Top-categories-h2 Top-categories-h4">აირჩიე ტოპ კატეგორიები</h2>
      <div className="sidebar-header">
        <div className="arrows">
        </div>
        <button className="show-all-btn show-all-btn2" onClick={() => navigate("/shop")}>
          ყველას 
        </button>
      </div>

      <div className="sideba sidebar1 top-categories">
        <div className="scroll-container scroll-container2" ref={scrollRef}>
          {topCategories.map((cat) => (
            <button 
              key={cat}
              onClick={() => navigate(`/shop?search=${encodeURIComponent(cat)}`)}
              className="category-button"
            >
              <img 
                src={`/images/${categoryIcons[cat]}`}
                alt={cat}
                style={{ width: "180px", height: "180px" }}
              />
              <span style={{ textTransform: "capitalize" }}>{cat}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


export function SportFieldsSidebar() {
  const [offers, setOffers] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const maxVisible = 6;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/offers");
        const data = await res.json();
        const sportOffers = data.filter((o) =>
          ["football", "basketball", "MMA"].includes(o.category)
        );
        const shuffled = [...sportOffers].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, maxVisible);
        setOffers(selected);
      } catch (err) {
        console.error("Error fetching sport offers:", err);
      }
    };
    fetchOffers();
  }, []);

  const scrollLeft = () =>
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div style={{ margin: "20px 0", position: "relative" }}>
      <h2 className="Top-categories-h2 Top-categories-h5">სპორტული მოედნები</h2>
      <div className="sidebar-header">
        <div className="arrows">

        </div>
        <button className="show-all-btn show-all-btn3" onClick={() => navigate("/shop")}>
          ყველა
        </button>
      </div>

      <div className="sidebar sidebar2 sport-fields">
        <div className="scroll-container" ref={scrollRef}>
          {offers.map((offer) => (
            <div key={offer._id} style={{ flex: "0 0 250px" }}>
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
