import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import OfferCard from "../components/OfferCard";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

export default function Shop() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [debouncedMin, setDebouncedMin] = useState(minPrice);
  const [debouncedMax, setDebouncedMax] = useState(maxPrice);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [tempMin, setTempMin] = useState(minPrice);
  const [tempMax, setTempMax] = useState(maxPrice);
  const [tempCategories, setTempCategories] = useState([]);

  const categories = [
    "tennis", "football", "padel", "carting", "warsoft",
    "MMA", "fitness halls", "gaming", "billiard",
    "table tennis", "arcade games"
  ];

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedMin(minPrice), 400);
    return () => clearTimeout(handler);
  }, [minPrice]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedMax(maxPrice), 400);
    return () => clearTimeout(handler);
  }, [maxPrice]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const search = getSearchQuery();
        let query = `http://localhost:5000/api/offers?`;
        if (search) query += `search=${encodeURIComponent(search)}&`;
        if (debouncedMin) query += `min=${debouncedMin}&`;
        if (debouncedMax) query += `max=${debouncedMax}&`;
        if (selectedCategories.length > 0) query += `categories=${selectedCategories.join(",")}&`;

        const res = await fetch(query);
        const data = await res.json();

        const shuffled = [...data].sort(() => 0.5 - Math.random());

        const getFinalPrice = (offer) =>
          offer.discount > 0 ? offer.priceValue * (1 - offer.discount / 100) : offer.priceValue;

        let finalOffers = [...shuffled];
        if (sort === "price_asc") {
          finalOffers.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
        } else if (sort === "price_desc") {
          finalOffers.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
        }

        setOffers(finalOffers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOffers();
  }, [location.search, sort, debouncedMin, debouncedMax, selectedCategories]);

  const handleMinChange = (e) => {
    const val = Number(e.target.value);
    if (val > tempMax) {
      setTempMin(tempMax);
      setTempMax(val);
    } else {
      setTempMin(val);
    }
  };

  const handleMaxChange = (e) => {
    const val = Number(e.target.value);
    if (val < tempMin) {
      setTempMax(tempMin);
      setTempMin(val);
    } else {
      setTempMax(val);
    }
  };

  const toggleTempCategory = (cat) => {
    setTempCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const openModal = () => {
    setTempMin(minPrice);
    setTempMax(maxPrice);
    setTempCategories([...selectedCategories]);
    setIsModalOpen(true);
  };

  const applyFilters = () => {
    setMinPrice(tempMin);
    setMaxPrice(tempMax);
    setSelectedCategories([...tempCategories]);
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    navigate(`?${params.toString()}`);
  };

  return (
    <div>
      {/* Removed search from navbar */}
      <Navbar showSearchInNavbar={false} />
      <br /><br /><br /><br />

      {/* Custom Search Bar */}
      <form onSubmit={handleSearch} className="search-bar-wrapper">
        <div className="search-bar">
          <input className="searchingbar"
            type="text"
            placeholder="გეიმინდი, ბილიარდი, პადელი..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="filter-bar">
        <button className="filtering" onClick={openModal}>ფილტრი</button>

        <select
          className="custom-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">სორტირება</option>
          <option value="price_asc">ფასი: დაბალი → მაღალი</option>
          <option value="price_desc">ფასი: მაღალი → დაბალი</option>
        </select>
      </div>

      <div className="offers-grid">
        {offers.map((offer) => (
          <OfferCard
            key={offer._id}
            offer={offer}
            onUpdate={user?.isAdmin ? (o) => navigate("/admin", { state: { offerToEdit: o } }) : undefined}
            onDelete={user?.isAdmin ? async (id) => {
              const res = await fetch(`http://localhost:5000/api/offers/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              });
              if (res.ok) setOffers((prev) => prev.filter((o) => o._id !== id));
            } : undefined}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>ფილტრი</h2>

            

            <h3>კატეგორიები</h3>
            <div className="categories-grid">
              {categories.map((cat) => (
                <label key={cat}>
                  <input
                    type="checkbox"
                    checked={tempCategories.includes(cat)}
                    onChange={() => toggleTempCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
            <div className="dual-range">
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={tempMin}
                  onChange={handleMinChange}
                  className="thumb thumb-left"
                />
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={tempMax}
                  onChange={handleMaxChange}
                  className="thumb thumb-right"
                />
                <div
                  className="range-selected"
                  style={{
                    left: `${(tempMin / 200) * 100}%`,
                    right: `${100 - (tempMax / 200) * 100}%`,
                  }}
                />
              </div>
              <div className="range-values">
                <span> {tempMin}-დან</span>
                <span> {tempMax}-მდე</span>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="doingfilter" onClick={applyFilters}>გაფილტვრა</button>
              <button className="clearing"
                onClick={() => {
                  setTempMin(0);
                  setTempMax(200);
                  setTempCategories([]);
                  setMinPrice(0);
                  setMaxPrice(200);
                  setSelectedCategories([]);
                  setIsModalOpen(false);
                }}
              >
                
                გასუფთავება
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
