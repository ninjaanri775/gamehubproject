import React, { createContext, useState, useEffect } from "react";

export const OffersContext = createContext();

export const OffersProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/offers");
        const data = await res.json();
        setOffers(data);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <OffersContext.Provider value={{ offers, setOffers, loading }}>
      {children}
    </OffersContext.Provider>
  );
};
