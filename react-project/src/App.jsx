import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Admin from "./pages/Admin";
import FavoritesPage from "./pages/FavoritesPage";

function AppContent() {
  const location = useLocation();
  const showSearchInNavbar = location.pathname === "/shop";

  return (
    <>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <AppContent />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}
