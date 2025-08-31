import { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);


  const loadFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setFavorites([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();
      setFavorites(data.map((offer) => offer._id)); 
    } catch (err) {
      console.error("Load favorites failed:", err);
      setFavorites([]);
    }
  };


  useEffect(() => {
    loadFavorites();
  }, []);

  const toggleFavorite = async (id) => {
    const isFav = favorites.includes(id);


    setFavorites((prev) =>
      isFav ? prev.filter((f) => f !== id) : [...prev, id]
    );

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to update favorites");
      const updatedFavorites = await res.json();
      setFavorites(updatedFavorites.map((offer) => offer._id));
    } catch (err) {
      console.error(err);

      setFavorites((prev) =>
        isFav ? [...prev, id] : prev.filter((f) => f !== id)
      );
    }
  };

  const isFavorite = (id) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, loadFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
