import React, { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CategoriesModal from "./CategoriesModal";
import LoginRegisterModal from "./LoginRegisterModal";
import SearchBar from "./SearchBar";

export default function Navbar({ showSearchInNavbar = false }) {
  const { user, logout } = useContext(AuthContext);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const loginBtnRef = useRef();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="nav-btn"
          onClick={() => {
            setCategoriesOpen((prev) => !prev);
            setAuthOpen(false); 
          }}
        >
          კატეგორიები
        </button>
        <Link to="/" className="nav-logo">funzio</Link>
        {user && <Link to="/favorites" className="nav-link">♥</Link>}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
                 {showSearchInNavbar && (
        <div className="navbar-search">
          <SearchBar />
        </div>
      )}
            <button className="nav-btn" onClick={logout}>გასვლა</button>
          </>
        ) : (
          <button
            ref={loginBtnRef}
            className="nav-btn"
            onClick={() => {
              setAuthOpen((prev) => !prev);
              setCategoriesOpen(false); // close categories if open
            }}
          >
            შესვლა
          </button>
        )}
      </div>

      {/* Search bar if enabled */}


      {/* Categories full-width dropdown */}
      {categoriesOpen && (
        <CategoriesModal
          isOpen={categoriesOpen}
          onClose={() => setCategoriesOpen(false)}
        />
      )}

      {/* Login/Register dropdown under button */}
      {authOpen && loginBtnRef.current && (
        <LoginRegisterModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          position={loginBtnRef.current.getBoundingClientRect()}
        />
      )}
    </nav>
  );
}
