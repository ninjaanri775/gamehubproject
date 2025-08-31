import React, { useEffect, useState, useRef } from "react";
import OfferCard from "./OfferCard";
import { useNavigate } from "react-router-dom";

export default function TopOffersSidebar() {
  const [offers, setOffers] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const maxVisible = 6;

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/offers");
        const data = await res.json();
        const discounted = data.filter(offer => offer.discount && offer.discount > 0);
        const shuffled = discounted.sort(() => 0.5 - Math.random());
        setOffers(shuffled.slice(0, maxVisible));
      } catch (err) {
        console.error("Error fetching top offers:", err);
      }
    };
    fetchOffers();
  }, []);

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div style={{ margin: "20px 0", position: "relative" }}>
          <h2 className="Top-categories-h2 Top-categories-h3">ყველაზე მაგარი შეთავაზებები</h2>
      <div className="sidebar-header">
        <div className="arrows">
        </div>
        <button className="show-all-btn show-all-btn1" onClick={() => navigate("/shop")}>ყველა</button>
      </div>

      {/* Sidebar with offers */}
      <div className="sidebar sidebar3 top-offers">
  
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
